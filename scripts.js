// Seleciona os elementos
const valueInput = document.getElementById("value-number");
const operationInput = document.getElementById("operation-number");
const resultDiv = document.getElementById("result-number");

// Variável para armazenar o último resultado válido
let lastValidResult = null;

// Função para calcular o resultado
function calculateResult() {
  // Pega o valor base
  let baseValue = parseFloat(valueInput.value.replace(",", "."));

  // Pega a operação
  let operation = operationInput.value.trim();

  // Se o value-number estiver vazio, mostra "..."
  if (!valueInput.value || isNaN(baseValue)) {
    resultDiv.textContent = "...";
    lastValidResult = null;
    return;
  }

  // Se só tiver o valor base (sem operação), mostra o próprio valor
  if (!operation) {
    resultDiv.textContent = baseValue.toLocaleString("pt-BR", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
    lastValidResult = baseValue;
    return;
  }

  try {
    let result;

    // Remove espaços
    operation = operation.replace(/\s/g, "");

    // Substitui vírgulas por pontos
    operation = operation.replace(/,/g, ".");

    // Substitui porcentagens por seus valores decimais baseados no valor atual
    let processedOperation = operation.replace(
      /(\d+\.?\d*)%/g,
      (match, num) => {
        return `(${baseValue}*${num}/100)`;
      }
    );

    // Se começar com operador, adiciona o valor base no início
    if (/^[+\-*/]/.test(processedOperation)) {
      processedOperation = baseValue + processedOperation;
    }

    // Avalia a expressão de forma segura
    result = Function('"use strict"; return (' + processedOperation + ")")();

    // Se o resultado for válido, atualiza
    if (!isNaN(result) && isFinite(result)) {
      resultDiv.textContent = result.toLocaleString("pt-BR", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      });
      lastValidResult = result;
    } else {
      // Se inválido, mantém o último resultado válido
      if (lastValidResult !== null) {
        resultDiv.textContent = lastValidResult.toLocaleString("pt-BR", {
          minimumFractionDigits: 0,
          maximumFractionDigits: 2,
        });
      }
    }
  } catch (error) {
    // Em caso de erro, mantém o último resultado válido
    if (lastValidResult !== null) {
      resultDiv.textContent = lastValidResult.toLocaleString("pt-BR", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      });
    }
  }
}

// Adiciona event listeners para calcular em tempo real
valueInput.addEventListener("input", calculateResult);
operationInput.addEventListener("input", calculateResult);

// Também permite digitar texto no campo de operação
operationInput.type = "text";
