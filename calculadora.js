// ... (Código anterior da lógica da calculadora) ...

let calcExpression = "";
const calcDisplay = document.getElementById("calc-display");

function calcAppend(val) {
    // ... (sua lógica existente)
    const operators = ['+', '-', '*', '/'];
    const lastChar = calcExpression.slice(-1);
    if (operators.includes(val) && operators.includes(lastChar)) return;
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


// --- ANIMAÇÃO DE FUNDO (MATEMÁTICA) ---
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');

let width, height;
let symbols = [];
// Símbolos matemáticos e números
const chars = ['+', '-', '×', '÷', '%', '√', 'π', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}

class MathSymbol {
    constructor() {
        this.init();
    }

    init() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.text = chars[Math.floor(Math.random() * chars.length)];
        this.size = Math.random() * 20 + 10; // Tamanho entre 10 e 30
        this.speedY = Math.random() * 0.5 - 0.25; // Flutua para cima ou baixo
        this.speedX = Math.random() * 0.5 - 0.25; // Flutua para lados
        this.opacity = Math.random() * 0.3 + 0.05; // Bem sutil
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Se sair da tela, reaparece do outro lado
        if (this.x > width) this.x = 0;
        else if (this.x < 0) this.x = width;
        if (this.y > height) this.y = 0;
        else if (this.y < 0) this.y = height;
    }

    draw() {
        ctx.font = `${this.size}px monospace`;
        ctx.fillStyle = `rgba(0, 255, 136, ${this.opacity})`; // Verde Neon
        ctx.fillText(this.text, this.x, this.y);
    }
}

function initAnimation() {
    resize();
    symbols = [];
    const count = 50; // Quantidade de símbolos
    for(let i=0; i<count; i++) symbols.push(new MathSymbol());
    animate();
}

function animate() {
    ctx.clearRect(0, 0, width, height);
    symbols.forEach(s => {
        s.update();
        s.draw();
    });
    requestAnimationFrame(animate);
}

window.addEventListener('resize', resize);
initAnimation();
