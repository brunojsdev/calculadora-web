let calcExpression = "";
const calcDisplay = document.getElementById("calc-display");

function calcAppend(val) {
    const operators = ['+', '-', '*', '/'];
    const lastChar = calcExpression.slice(-1);

    // Evita operadores duplicados
    if (operators.includes(val) && operators.includes(lastChar)) {
        return;
    }

    calcExpression += val;
    calcDisplay.innerText = calcExpression;
    scrollDisplayToEnd();
}

function calcClear() {
    calcExpression = "";
    calcDisplay.innerText = "0";
}

function calcEqual() {
    try {
        if (!calcExpression) return;
        
        // Validação simples de segurança
        if (/^[0-9+\-*/. ]+$/.test(calcExpression)) {
            const result = eval(calcExpression); 
            const formattedResult = Number.isInteger(result) ? result : result.toFixed(4);
            
            calcDisplay.innerText = formattedResult;
            calcExpression = result.toString();
        } else {
            throw new Error("Inválido");
        }
    } catch (e) {
        calcDisplay.innerText = "Erro";
        setTimeout(() => { calcClear(); }, 1500);
    }
}

function scrollDisplayToEnd() {
    calcDisplay.scrollLeft = calcDisplay.scrollWidth;
}
