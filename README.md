# 🔢 Calculadora Web | Modern Glassmorphism

Uma aplicação de calculadora totalmente funcional com uma interface moderna e sofisticada, inspirada na estética de exploração espacial. O projeto combina lógica matemática robusta com efeitos visuais avançados, como Glassmorphism e renderização de partículas em tempo real.

## 🛠️ Stack Tecnológica

- **Estrutura:** HTML5 Semântico.
- **Estilização:** CSS3 Avançado (Grid, Flexbox e Variáveis Nativas).
- **Lógica de Motor:** JavaScript (ES6+) utilizando **Programação Orientada a Objetos (POO)**.
- **Efeitos Visuais:** HTML5 Canvas API e Lucide Icons.

## ✨ Funcionalidades e Diferenciais

### 🌓 Sistema de Temas e Persistência

Assim como no portfólio principal, a calculadora possui um sistema de troca de temas (Dark/Light Mode) que altera não apenas as cores da interface, mas também a paleta de cores das estrelas e meteoros do fundo. A preferência do usuário é mantida através do `localStorage`.

### 🚀 Background Interativo (Nebulosa)

Utiliza a **Canvas API** para renderizar um fundo dinâmico:

- **Cintilação:** Estrelas que piscam e se movem suavemente.
- **Meteoros:** Efeito de estrelas cadentes geradas aleatoriamente.
- **Otimização:** Renderização fluida que se ajusta automaticamente ao redimensionamento da tela.

### ⌨️ Experiência do Usuário (UX)

- **Suporte ao Teclado Físico:** Mapeamento completo para entrada de números, operadores, `Enter` para calcular e `Backspace` para deletar.
- **Design Responsivo:** Interface otimizada para uso em dispositivos móveis e desktops.
- **Feedback Visual:** Botões com gradientes radiais e efeitos de profundidade (box-shadow) ao interagir.

### 🧠 Lógica de Processamento

A calculadora foi estruturada em uma classe `Calculator`, garantindo:

- Separação clara entre a lógica matemática e a manipulação do DOM.
- Formatação de números no padrão brasileiro (`pt-BR`).
- Histórico de operação atual e anterior em tempo real.

## 📂 Estrutura de Arquivos

```bash
/
├── index.html      # Estrutura principal e botões da calculadora
├── style.css       # Design Tokens, Glassmorphism e Temas
├── script.js       # Classe Calculator, motor Canvas e eventos
├── img/            # Assets estáticos (favicon)
└── README.md       # Documentação técnica
```

## ⚙️ Como Executar

1. Clone o repositório:
   ```bash
   git clone https://github.com/brunojsdev/calculadora-web.git
   ```
2. Acesse a pasta e abra o arquivo `index.html` em qualquer navegador moderno.

---

### 📝 Notas de Versão (V2)

- Implementação do motor de animação de estrelas cadentes.
- Adição de suporte total a atalhos de teclado.
- Refatoração completa do CSS para uso de variáveis de tema.

Desenvolvido por **Bruno J. Silveira** | Acesse meu Portfólio
