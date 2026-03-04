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

/* =========================================================================
   2. ANIMAÇÃO DO CANVAS
   ========================================================================= */
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let width, height, particles = [];
const colors = [ '#bbff00', '#ddff00', '#ffff00', '#ffcc00', '#ffaa00' ];

function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}

class Square {
    constructor() { this.init(); }
    init() {
        this.x = Math.random() * width;
        this.y = Math.random() * height - height;
        this.size = Math.random() * 15 + 5;
        this.speed = Math.random() * 2 + 0.5;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.opacity = Math.random() * 0.8 + 0.4;
    }
    update() {
        this.y += this.speed;
        if (this.y > height) { this.init(); this.y = -20; }
    }
    draw() {
        ctx.globalAlpha = this.opacity;
        ctx.strokeStyle = this.color;
        ctx.strokeRect(this.x, this.y, this.size, this.size);
        ctx.globalAlpha = 1;
    }
}

function initParticles() {
    particles = [];
    for (let i = 0; i < Math.floor(width / 10); i++) particles.push(new Square());
}

function animate() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
}

window.addEventListener('resize', () => { resize(); initParticles(); });
resize(); initParticles(); animate();
