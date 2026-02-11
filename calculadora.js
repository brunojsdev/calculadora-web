// --- Lógica Funcional ---
let calcExpression = "";
const calcDisplay = document.getElementById("calc-display");

function calcAppend(val) {
    const operators = ['+', '-', '*', '/'];
    const lastChar = calcExpression.slice(-1);
    if (operators.includes(val) && operators.includes(lastChar)) return;
    calcExpression += val;
    calcDisplay.innerText = calcExpression;
}

function calcClear() { calcExpression = ""; calcDisplay.innerText = "0"; }

function calcEqual() {
    try {
        if (!calcExpression) return;
        const result = eval(calcExpression); 
        calcDisplay.innerText = Number.isInteger(result) ? result : result.toFixed(4);
        calcExpression = result.toString();
    } catch (e) { calcDisplay.innerText = "Erro"; setTimeout(calcClear, 1500); }
}

// --- ANIMAÇÃO DE GRADE DO SEU PORTFÓLIO (CÓDIGO ORIGINAL) ---
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let width, height;
let squares = [];
const squareSize = 30; 
const color = '#00ff88'; 

function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    initGrid();
}

function initGrid() {
    squares = [];
    const cols = Math.ceil(width / squareSize);
    const rows = Math.ceil(height / squareSize);
    for (let x = 0; x < cols; x++) {
        for (let y = 0; y < rows; y++) {
            squares.push({
                x: x * squareSize,
                y: y * squareSize,
                opacity: 0,
                targetOpacity: 0
            });
        }
    }
}

window.addEventListener('mousemove', (e) => {
    squares.forEach(sq => {
        const dx = e.clientX - (sq.x + squareSize / 2);
        const dy = e.clientY - (sq.y + squareSize / 2);
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
            sq.targetOpacity = 0.6;
        }
    });
});

function animate() {
    ctx.clearRect(0, 0, width, height);
    
    ctx.strokeStyle = color;
    ctx.lineWidth = 0.1;
    ctx.globalAlpha = 0.1;
    for(let i=0; i<width; i+=squareSize) {
        ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, height); ctx.stroke();
    }
    for(let i=0; i<height; i+=squareSize) {
        ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(width, i); ctx.stroke();
    }

    squares.forEach(sq => {
        sq.opacity += (sq.targetOpacity - sq.opacity) * 0.05;
        sq.targetOpacity *= 0.96;

        if (sq.opacity > 0.01) {
            ctx.globalAlpha = sq.opacity;
            ctx.fillStyle = color;
            ctx.fillRect(sq.x + 1, sq.y + 1, squareSize - 2, squareSize - 2);
        }
    });

    if (Math.random() > 0.98) {
        squares[Math.floor(Math.random() * squares.length)].targetOpacity = 0.4;
    }

    requestAnimationFrame(animate);
}

window.addEventListener('resize', resize);
resize();
animate();
