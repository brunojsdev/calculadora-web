/* =========================================================================
   1. LÓGICA DA CALCULADORA
   ========================================================================= */
class Calculator {
    constructor(previousOperandElement, currentOperandElement) {
        this.previousOperandElement = previousOperandElement;
        this.currentOperandElement = currentOperandElement;
        this.clear();
    }

    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
        this.readyToReset = false;
    }

    delete() {
        if (this.readyToReset) {
            this.currentOperand = '0';
            this.readyToReset = false;
            return;
        }
        if (this.currentOperand === '0') return;
        this.currentOperand = this.currentOperand.toString().slice(0, -1);
        if (this.currentOperand === '') this.currentOperand = '0';
    }

    appendNumber(number) {
        if (this.readyToReset) {
            this.currentOperand = number === '.' ? '0.' : number;
            this.readyToReset = false;
            return;
        }
        if (number === '.' && this.currentOperand.includes('.')) return;
        if (this.currentOperand === '0' && number !== '.') {
            this.currentOperand = number;
        } else {
            this.currentOperand = this.currentOperand.toString() + number.toString();
        }
    }

    chooseOperation(operation) {
        if (this.currentOperand === '0' && this.previousOperand === '') return;
        if (this.previousOperand !== '') {
            this.compute();
        }
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '';
    }

    compute() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        if (isNaN(prev) || isNaN(current)) return;

        switch (this.operation) {
            case '+': computation = prev + current; break;
            case '-': computation = prev - current; break;
            case '*': computation = prev * current; break;
            case '/': computation = prev / current; break;
            default: return;
        }

        this.currentOperand = Math.round(computation * 10000000000) / 10000000000;
        this.operation = undefined;
        this.previousOperand = '';
        this.readyToReset = true;
    }

    getDisplayNumber(number) {
        const stringNumber = number.toString();
        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];
        let integerDisplay = isNaN(integerDigits) ? '' : integerDigits.toLocaleString('pt-BR');
        return decimalDigits != null ? `${integerDisplay},${decimalDigits}` : integerDisplay;
    }

    updateDisplay() {
        this.currentOperandElement.innerText = this.currentOperand === '' ? '0' : this.getDisplayNumber(this.currentOperand);
        if (this.operation != null) {
            this.previousOperandElement.innerText = `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`;
        } else {
            this.previousOperandElement.innerText = '';
        }
    }
}

const calculator = new Calculator(document.getElementById('previous-operand'), document.getElementById('current-operand'));

document.querySelectorAll('[data-number]').forEach(button => {
    button.addEventListener('click', () => {
        calculator.appendNumber(button.getAttribute('data-number'));
        calculator.updateDisplay();
    });
});

document.querySelectorAll('.btn-operator').forEach(button => {
    button.addEventListener('click', () => {
        calculator.chooseOperation(button.getAttribute('data-action'));
        calculator.updateDisplay();
    });
});

document.querySelector('[data-action="="]').addEventListener('click', () => {
    calculator.compute();
    calculator.updateDisplay();
});

document.querySelector('[data-action="clear"]').addEventListener('click', () => {
    calculator.clear();
    calculator.updateDisplay();
});

document.querySelector('[data-action="delete"]').addEventListener('click', () => {
    calculator.delete();
    calculator.updateDisplay();
});

/* ==========================================================================
   2. ANIMAÇÃO DE FUNDO (CANVAS STARS)
   Cria um efeito de estrelas de 4 pontas caindo/piscando (Style: Sparkle)
   ========================================================================== */
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');

// Variáveis globais de controle do Canvas
let width, height;
let particles = [];

// Paleta de cores da animação sincronizada com os DESTAQUES do CSS
const colors = ['#bbff00', '#ddff00', '#ffff00', '#ffcc00', '#ffaa00'];

/* --- FUNÇÕES DE CONTROLE DO CANVAS --- */

// Atualiza as dimensões do canvas para ocupar a tela inteira
function resize() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
}

/* --- CLASSE PRINCIPAL: STAR (PARTÍCULAS) --- */
class Star {
  constructor() {
    this.init();
  }

  // Inicializa ou reseta as propriedades da estrela
  init() {
    this.x = Math.random() * width;
    // Começa em uma posição Y aleatória para não caírem todas juntas no início
    this.y = Math.random() * height; 
    this.size = Math.random() * 7 + 3;          // Tamanho discreto (3px a 10px)
    this.speed = Math.random() * 1.5 + 0.5;     // Velocidade de queda suave
    this.color = colors[Math.floor(Math.random() * colors.length)];
    this.opacity = Math.random() * 0.7 + 0.3;   // Transparência variada
  }

  // Atualiza a posição da partícula a cada frame
  update() {
    this.y += this.speed;
    
    // Se a estrela sair da tela pela parte de baixo, reseta para o topo
    if (this.y > height + this.size) {
      this.x = Math.random() * width;
      this.y = -20;
      this.size = Math.random() * 7 + 3;
      this.speed = Math.random() * 1.5 + 0.5;
    }
  }

  // Desenha a estrela de 4 pontas simples (estilo losango esticado)
  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);

    ctx.globalAlpha = this.opacity;
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 1.2;
    
    // Proporções da estrela de 4 pontas
    const R_major = this.size;            // Pontas verticais e horizontais
    const R_minor = this.size * 0.25;     // Curvatura interna (mais fina para parecer brilho)

    ctx.beginPath();
    for (let i = 0; i < 8; i++) {
      // Alterna entre raio maior e menor a cada 45 graus
      let angle = (i * Math.PI) / 4 - Math.PI / 2; 
      let radius = (i % 2 === 0) ? R_major : R_minor;

      let px = Math.cos(angle) * radius;
      let py = Math.sin(angle) * radius;

      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();

    // Desenha o contorno da estrela
    ctx.stroke();
    
    // Efeito de "piscar": 2% de chance de preencher a estrela neste frame
    if (Math.random() > 0.98) {
       ctx.fillStyle = this.color;
       ctx.fill();
    }
    
    ctx.restore();
  }
}

/* --- INICIALIZAÇÃO E LOOP DE ANIMAÇÃO --- */

// Preenche o array com estrelas (densidade ajustada para não poluir o texto)
function initParticles() {
  particles = [];
  const particleCount = Math.floor(width / 15); 
  
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Star());
  }
}

// Loop principal de renderização
function animate() {
  // Limpa o canvas
  ctx.clearRect(0, 0, width, height);
  
  // Atualiza e desenha cada estrela
  particles.forEach(p => {
    p.update();
    p.draw();
  });
  
  requestAnimationFrame(animate);
}

/* --- EVENT LISTENERS --- */

// Recalcula o canvas ao redimensionar a janela
window.addEventListener('resize', () => {
  resize();
  initParticles();
});

/* --- START DO SCRIPT --- */
resize();         
initParticles();  
animate();
