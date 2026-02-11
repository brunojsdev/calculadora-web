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

 // --- SCRIPT DO FUNDO (CANVAS SQUARES) ---

const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');

let width, height;
let particles = [];

// Paleta extraída diretamente do seu calculadora.css
const colors = [
  '#00ff88', // Verde Neon (Principal)
  '#1e293b', // Cor da Borda (Sutil)
  '#e2e8f0', // Cor do Texto
  '#ef4444', // Cor do botão Clear (Destaque)
  '#0b1221'  // Fundo do Card (Para profundidade)
];
  
  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  
  class Square {
    constructor() {
      this.init();
    }
  
    init() {
      this.x = Math.random() * width;
      this.y = Math.random() * height - height; // Começa acima da tela
      this.size = Math.random() * 15 + 5; // Tamanho entre 5 e 20
      this.speed = Math.random() * 2 + 0.5;
      this.color = colors[Math.floor(Math.random() * colors.length)];
      this.opacity = Math.random() * 0.5 + 0.1;
    }
  
    update() {
      this.y += this.speed;
      if (this.y > height) {
        this.init(); // Reinicia quando sai da tela
        this.y = -20;
      }
    }
  
    draw() {
      ctx.globalAlpha = this.opacity;
      ctx.strokeStyle = this.color;
      ctx.lineWidth = 1.5;
      ctx.strokeRect(this.x, this.y, this.size, this.size);
      
      // Ocasionalmente preenche o quadrado
      if (Math.random() > 0.98) {
         ctx.fillStyle = this.color;
         ctx.fillRect(this.x, this.y, this.size, this.size);
      }
      ctx.globalAlpha = 1;
    }
  }
  
  function initParticles() {
    particles = [];
    const particleCount = Math.floor(width / 10); // Densidade baseada na largura
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Square());
    }
  }
  
  function animate() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(animate);
  }
  
  window.addEventListener('resize', () => {
    resize();
    initParticles();
  });
  
  // Inicialização
  resize();
  initParticles();
  animate();
