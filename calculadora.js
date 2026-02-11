// --- Lógica da Calculadora ---
let calcExpression = "";
const calcDisplay = document.getElementById("calc-display");

function calcAppend(val) {
    const operators = ['+', '-', '*', '/'];
    const lastChar = calcExpression.slice(-1);
    if (operators.includes(val) && operators.includes(lastChar)) return;
    calcExpression += val;
    calcDisplay.innerText = calcExpression;
}

function calcClear() {
    calcExpression = "";
    calcDisplay.innerText = "0";
}

function calcEqual() {
    try {
        if (!calcExpression) return;
        const result = eval(calcExpression); 
        calcDisplay.innerText = Number.isInteger(result) ? result : result.toFixed(4);
        calcExpression = result.toString();
    } catch (e) {
        calcDisplay.innerText = "Erro";
        setTimeout(calcClear, 1500);
    }
}

// --- ANIMAÇÃO DE PARTÍCULAS (MESMA DO PORTFÓLIO) ---
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let width, height, particles = [];
const color = '#00ff88'; // Verde Neon

function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    createParticles();
}

class Particle {
    constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 2 + 1;
        this.speedX = Math.random() * 1 - 0.5;
        this.speedY = Math.random() * 1 - 0.5;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x > width) this.x = 0; else if (this.x < 0) this.x = width;
        if (this.y > height) this.y = 0; else if (this.y < 0) this.y = height;
    }
    draw() {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function createParticles() {
    particles = [];
    const count = (width * height) / 12000;
    for (let i = 0; i < count; i++) particles.push(new Particle());
}

function connect() {
    for (let i = 0; i < particles.length; i++) {
        for (let j = i; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 150) {
                ctx.strokeStyle = color;
                ctx.globalAlpha = 1 - (dist / 150);
                ctx.lineWidth = 0.5;
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }
    ctx.globalAlpha = 1;
}

function animate() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => { p.update(); p.draw(); });
    connect();
    requestAnimationFrame(animate);
}

window.addEventListener('resize', resize);
resize();
animate();
