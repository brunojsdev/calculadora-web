/* =========================================================================
  ÍNDICE DO ARQUIVO (JavaScript)
   1. LÓGICA DO MOTOR (Classe Calculator)
   2. INTERFACE E EVENTOS (Botões do DOM)
   3. SUPORTE AO TECLADO FÍSICO
   4. SISTEMA DE TEMAS (Persistência e Toggle)
   5. MOTOR DE ANIMAÇÃO (Canvas API - Efeito Espacial) 
   ========================================================================= */

/* =========================================================================
   1. LÓGICA DO MOTOR: Processamento matemático e estados
   ========================================================================= */
class Calculator {
  constructor(previousOperandElement, currentOperandElement) {
    this.previousOperandElement = previousOperandElement;
    this.currentOperandElement = currentOperandElement;
    this.clear();
  }

  clear() {
    this.currentOperand = "0";
    this.previousOperand = "";
    this.operation = undefined;
    this.readyToReset = false;
  }

  delete() {
    if (this.readyToReset) {
      this.currentOperand = "0";
      this.readyToReset = false;
      return;
    }
    if (this.currentOperand === "0") return;
    this.currentOperand = this.currentOperand.toString().slice(0, -1);
    if (this.currentOperand === "") this.currentOperand = "0";
  }

  appendNumber(number) {
    if (this.readyToReset) {
      this.currentOperand = number === "." ? "0." : number;
      this.readyToReset = false;
      return;
    }
    if (number === "." && this.currentOperand.includes(".")) return;
    if (this.currentOperand === "0" && number !== ".") {
      this.currentOperand = number;
    } else {
      this.currentOperand = this.currentOperand.toString() + number.toString();
    }
  }

  chooseOperation(operation) {
    if (this.currentOperand === "0" && this.previousOperand === "") return;
    if (this.previousOperand !== "") {
      this.compute();
    }
    this.operation = operation;
    this.previousOperand = this.currentOperand;
    this.currentOperand = "";
  }

  compute() {
    let computation;
    const prev = parseFloat(this.previousOperand);
    const current = parseFloat(this.currentOperand);
    if (isNaN(prev) || isNaN(current)) return;

    switch (this.operation) {
      case "+":
        computation = prev + current;
        break;
      case "-":
        computation = prev - current;
        break;
      case "*":
        computation = prev * current;
        break;
      case "/":
        computation = prev / current;
        break;
      default:
        return;
    }

    this.currentOperand = Math.round(computation * 10000000000) / 10000000000;
    this.operation = undefined;
    this.previousOperand = "";
    this.readyToReset = true;
  }

  getDisplayNumber(number) {
    const stringNumber = number.toString();
    const integerDigits = parseFloat(stringNumber.split(".")[0]);
    const decimalDigits = stringNumber.split(".")[1];
    let integerDisplay = isNaN(integerDigits)
      ? ""
      : integerDigits.toLocaleString("pt-BR");
    return decimalDigits != null
      ? `${integerDisplay},${decimalDigits}`
      : integerDisplay;
  }

  updateDisplay() {
    this.currentOperandElement.innerText =
      this.currentOperand === ""
        ? "0"
        : this.getDisplayNumber(this.currentOperand);
    if (this.operation != null) {
      this.previousOperandElement.innerText = `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`;
    } else {
      this.previousOperandElement.innerText = "";
    }
  }
}

/* =========================================================================
   2. INTERFACE E EVENTOS: Mapeamento de cliques do usuário
   ========================================================================= */
const calculator = new Calculator(
  document.getElementById("previous-operand"),
  document.getElementById("current-operand"),
);

document.querySelectorAll("[data-number]").forEach((button) => {
  button.addEventListener("click", () => {
    calculator.appendNumber(button.getAttribute("data-number"));
    calculator.updateDisplay();
  });
});

document.querySelectorAll(".btn-operator").forEach((button) => {
  button.addEventListener("click", () => {
    calculator.chooseOperation(button.getAttribute("data-action"));
    calculator.updateDisplay();
  });
});

document.querySelector('[data-action="="]').addEventListener("click", () => {
  calculator.compute();
  calculator.updateDisplay();
});

document
  .querySelector('[data-action="clear"]')
  .addEventListener("click", () => {
    calculator.clear();
    calculator.updateDisplay();
  });

document
  .querySelector('[data-action="delete"]')
  .addEventListener("click", () => {
    calculator.delete();
    calculator.updateDisplay();
  });

/* =========================================================================
   3. SUPORTE AO TECLADO FÍSICO: Atalhos para produtividade
   ========================================================================= */
window.addEventListener("keydown", (e) => {
  const key = e.key;
  // Números e Ponto
  if ((key >= "0" && key <= "9") || key === ".") calculator.appendNumber(key);
  // Operadores
  if (["+", "-", "*", "/"].includes(key)) calculator.chooseOperation(key);
  // Calcular (Enter ou =)
  if (key === "Enter" || key === "=") {
    e.preventDefault(); // Evita que o Enter clique no último botão focado
    calculator.compute();
  }
  // Deletar e Limpar
  if (key === "Backspace") calculator.delete();
  if (key.toLowerCase() === "c" || key === "Escape") calculator.clear();

  calculator.updateDisplay();
});

/* =========================================================================
   4. SISTEMA DE TEMAS: Persistência e Alternância Visual
   ========================================================================= */
const themeToggleBtn = document.getElementById("theme-toggle-btn");
const body = document.body;

if (localStorage.getItem("theme") === "light") {
  body.classList.add("light-mode");
}

if (themeToggleBtn) {
  themeToggleBtn.addEventListener("click", () => {
    body.classList.toggle("light-mode");
    localStorage.setItem(
      "theme",
      body.classList.contains("light-mode") ? "light" : "dark",
    );
    initSpace();
  });
}

if (window.lucide) window.lucide.createIcons();

/* ==========================================================================
   5. MOTOR DE ANIMAÇÃO: Renderização espacial interativa via Canvas
   ========================================================================== */
const canvas = document.getElementById("bg-canvas");
const ctx = canvas.getContext("2d");

let width, height;
let stars = [];
let shootingStars = [];

const darkStarColors = [
  "#ffffff",
  "#fff4e6",
  "#ffdd00",
  "#ffaa00",
  "#ffcc80",
  "#e6f2ff",
];
const lightStarColors = ["#150136", "#5752ff", "#4338ca", "#17005c", "#0d0033"];

function resize() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = Math.max(
    document.body.scrollHeight,
    window.innerHeight,
  );
}

class Star {
  constructor() {
    this.init();
  }

  init() {
    this.type = Math.floor(Math.random() * 3) + 1;
    let baseSize = Math.random() * 2 + 0.5;
    this.size =
      this.type === 1
        ? baseSize * 2.5
        : this.type === 2
          ? baseSize * 1.8
          : baseSize * 1.2;
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.baseSpeedX = (Math.random() - 0.5) * 0.1;
    this.baseSpeedY = baseSize * 0.4 + 0.2;
    const currentPalette = body.classList.contains("light-mode")
      ? lightStarColors
      : darkStarColors;
    this.color =
      currentPalette[Math.floor(Math.random() * currentPalette.length)];
    this.maxOpacity = Math.random() * 0.7 + 0.3;
    this.twinklePhase = Math.random() * Math.PI * 2;
    this.twinkleSpeed = Math.random() * 0.02 + 0.005;
  }

  update() {
    this.x += this.baseSpeedX;
    this.y += this.baseSpeedY;
    this.twinklePhase += this.twinkleSpeed;
    this.opacity = (Math.sin(this.twinklePhase) * 0.5 + 0.5) * this.maxOpacity;

    if (this.y > height + 20) {
      this.y = -20;
      this.x = Math.random() * width;
    }
    if (this.x < -20) this.x = width + 20;
    if (this.x > width + 20) this.x = -20;
  }

  draw() {
    ctx.globalAlpha = this.opacity * 0.2;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size * 1.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = this.opacity;
    this._drawFourPointStar(this.x, this.y, this.size);
    ctx.globalAlpha = 1.0;
  }

  _drawFourPointStar(x, y, s) {
    ctx.beginPath();
    ctx.moveTo(x, y - s * 2.5);
    ctx.lineTo(x + s * 0.4, y - s * 0.4);
    ctx.lineTo(x + s * 2.5, y);
    ctx.lineTo(x + s * 0.4, y + s * 0.4);
    ctx.lineTo(x, y + s * 2.5);
    ctx.lineTo(x - s * 0.4, y + s * 0.4);
    ctx.lineTo(x - s * 2.5, y);
    ctx.lineTo(x - s * 0.4, y - s * 0.4);
    ctx.closePath();
    ctx.fill();
  }
}

class ShootingStar {
  constructor() {
    this.init();
  }
  init() {
    this.active = false;
    if (Math.random() > 0.993) {
      this.active = true;
      this.x = Math.random() * width;
      this.y = -50;
      this.size = Math.random() * 2 + 1;
      this.speedX = (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 5 + 3);
      this.speedY = Math.random() * 5 + 7;
      this.len = Math.random() * 80 + 30;
      this.opacity = 1;
    }
  }
  update() {
    if (!this.active) {
      this.init();
      return;
    }
    this.x += this.speedX;
    this.y += this.speedY;
    this.opacity -= 0.015;
    if (this.opacity <= 0 || this.y > height || this.x < 0 || this.x > width)
      this.active = false;
  }
  draw() {
    if (!this.active) return;
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(
      this.x - this.speedX * (this.len / 5),
      this.y - this.speedY * (this.len / 5),
    );
    ctx.lineWidth = this.size;
    ctx.lineCap = "round";
    let grad = ctx.createLinearGradient(
      this.x,
      this.y,
      this.x - this.speedX * (this.len / 10),
      this.y - this.speedY * (this.len / 10),
    );
    grad.addColorStop(0, `rgba(255, 255, 255, ${this.opacity})`);
    grad.addColorStop(1, `rgba(255, 170, 0, 0)`);
    ctx.strokeStyle = grad;
    ctx.stroke();
  }
}

function initSpace() {
  stars = [];
  shootingStars = [];
  const numStars = Math.min(Math.floor((width * height) / 12000), 150);
  for (let i = 0; i < numStars; i++) stars.push(new Star());
  for (let i = 0; i < 2; i++) shootingStars.push(new ShootingStar());
}

function animate() {
  ctx.clearRect(0, 0, width, height);
  stars.forEach((s) => {
    s.update();
    s.draw();
  });
  shootingStars.forEach((s) => {
    s.update();
    s.draw();
  });
  requestAnimationFrame(animate);
}

window.addEventListener("resize", () => {
  resize();
  initSpace();
});
resize();
initSpace();
animate();
