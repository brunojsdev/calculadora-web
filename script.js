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
   2. ANIMAÇÃO DE FUNDO (CANVAS)
   ========================================================================== */

const canvas = document.getElementById('bg-canvas');

if (canvas) {
  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  const colors = ['#bbff00', '#ddff00', '#ffff00', '#ffcc00', '#ffaa00'];

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  function isPosOccupied(x, y, minDistance) {
    for (let p of particles) {
      const dx = p.x - x;
      const dy = p.y - y;
      if (Math.sqrt(dx * dx + dy * dy) < minDistance) return true;
    }
    return false;
  }

  class Star {
    constructor() {
      this.init(true);
    }

    init(fullScreen = false) {
      this.type = Math.floor(Math.random() * 3) + 1;
      
      // Definição de tamanhos por tipo conforme solicitado
      if (this.type === 1) {
        this.size = Math.random() * 3 + 6; // Tipo 1: entre 3 e 9
      } else if (this.type === 2) {
        this.size = Math.random() * 4 + 5; // Tipo 2: entre 4 e 9
      } else {
        this.size = Math.random() * 2 + 3; // Tipo 3: entre 2 e 5
      }
      
      let foundPos = false;
      let attempts = 0;
      let safeMargin = 45; 

      while (!foundPos && attempts < 30) {
        this.x = Math.random() * width;
        this.y = fullScreen ? Math.random() * height : -50;
        
        let currentMargin = attempts > 15 ? safeMargin / 2 : safeMargin;

        if (!isPosOccupied(this.x, this.y, currentMargin)) {
          foundPos = true;
        }
        attempts++;
      }

      this.speed = Math.random() * 0.3 + 0.15;
      this.color = colors[Math.floor(Math.random() * colors.length)];
      this.opacity = Math.random() * 0.4 + 0.2;
      this.isBlinking = false;
      this.blinkTimer = 0;
    }

    update() {
      this.y += this.speed;
      
      if (!this.isBlinking && Math.random() > 0.992) {
        this.isBlinking = true;
        this.blinkTimer = Math.floor(Math.random() * 6) + 3;
      }

      if (this.isBlinking) {
        this.blinkTimer--;
        if (this.blinkTimer <= 0) this.isBlinking = false;
      }
      
      if (this.y > height + 50) {
        this.init(false);
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      const s = this.size;
      
      if (this.isBlinking) {
        ctx.globalAlpha = 1.0;
        ctx.shadowBlur = 15;
        ctx.shadowColor = this.color;
      } else {
        ctx.globalAlpha = this.opacity;
        ctx.shadowBlur = 0;
      }
      
      ctx.fillStyle = this.color;

      switch (this.type) {
        case 1: this._drawType1(s); break;
        case 2: this._drawType2(s); break;
        case 3: this._drawType3(s); break;
      }
      ctx.restore();
    }

    _drawType1(s) {
      const drawTaper = (angle, len, thk) => {
        ctx.save(); ctx.rotate(angle); ctx.beginPath();
        ctx.moveTo(0, -thk / 2); ctx.lineTo(len, 0); ctx.lineTo(0, thk / 2);
        ctx.fill(); ctx.restore();
      };
      ctx.rotate(Math.PI / 8); 
      drawTaper(-Math.PI / 4, s * 2.2, s * 0.2);
      drawTaper(3 * Math.PI / 4, s * 1.4, s * 0.2);
      drawTaper(-3 * Math.PI / 4, s * 0.8, s * 0.15);
      drawTaper(Math.PI / 4, s * 0.7, s * 0.15);
    }

    _drawType2(s) {
      ctx.beginPath();
      for (let i = 0; i < 16; i++) {
        let angle = i * Math.PI / 8 - Math.PI / 2;
        let radius = (i % 4 === 0) ? s * 1.8 : (i % 2 === 0 ? s * 0.8 : s * 0.2);
        if (i === 0) ctx.moveTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
        else ctx.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
      }
      ctx.fill();
    }

    _drawType3(s) {
      ctx.beginPath();
      // Ajuste na proporção
      const vLen = s * 2.2; 
      const hLen = s * 0.7; 
      
      ctx.moveTo(0, -vLen);
      ctx.quadraticCurveTo(0, 0, hLen, 0);
      ctx.quadraticCurveTo(0, 0, 0, vLen);
      ctx.quadraticCurveTo(0, 0, -hLen, 0);
      ctx.quadraticCurveTo(0, 0, 0, -vLen);
      
      ctx.closePath();
      ctx.fill();
    }
  }

  function initParticles() {
    resize();
    particles = [];
    const particleCount = Math.floor(width / 22); 
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Star());
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
  }

  window.addEventListener('resize', initParticles);
  resize(); initParticles(); animate();
}
