// Adiciona efeitos visuais e animações
document.addEventListener('DOMContentLoaded', function() {
    // Adiciona animação de digitação no título
    animateTitle();
    
    // Adiciona efeitos de foco nos inputs
    addInputEffects();
    
    // Adiciona validação em tempo real
    addRealTimeValidation();
});

function animateTitle() {
    const title = document.querySelector('h1');
    if (title) {
        const text = title.textContent;
        title.textContent = '';
        
        for (let i = 0; i < text.length; i++) {
            setTimeout(() => {
                title.textContent += text[i];
            }, i * 100);
        }
    }
}

function addInputEffects() {
    const inputs = document.querySelectorAll('input, select');
    
    inputs.forEach(input => {
        // Efeito de onda ao clicar
        input.addEventListener('click', function(e) {
            createRipple(e, this);
        });
        
        // Efeito de pulse ao focar
        input.addEventListener('focus', function() {
            this.style.animation = 'pulse 0.5s ease-in-out';
        });
        
        input.addEventListener('blur', function() {
            this.style.animation = '';
        });
    });
}

function createRipple(event, element) {
    const ripple = document.createElement('span');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 102, 0, 0.3);
        transform: scale(0);
        animation: ripple 0.6s linear;
        left: ${x}px;
        top: ${y}px;
        width: ${size}px;
        height: ${size}px;
        pointer-events: none;
    `;
    
    element.style.position = 'relative';
    element.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

function addRealTimeValidation() {
    const mensalidadeInput = document.getElementById('mensalidade');
    const bolsaInput = document.getElementById('bolsaPrimeiro');
    
    mensalidadeInput.addEventListener('input', function() {
        validateInput(this, this.value > 0);
    });
    
    bolsaInput.addEventListener('input', function() {
        validateInput(this, this.value >= 0 && this.value <= 100);
    });
}

function validateInput(input, isValid) {
    if (isValid) {
        input.classList.remove('error');
        input.style.borderColor = '#4CAF50';
    } else {
        input.classList.add('error');
        input.style.borderColor = '#f44336';
    }
}

function calcularMensalidade() {
    const button = document.querySelector('button');
    const resultadoDiv = document.getElementById('resultado');
    
    // Adiciona efeito de loading
    button.classList.add('loading');
    button.textContent = 'Calculando...';
    
    // Simula um pequeno delay para mostrar o loading
    setTimeout(() => {
        performCalculation();
        button.classList.remove('loading');
        button.textContent = 'Calcular';
    }, 1000);
}

function performCalculation() {
    let duracao = parseInt(document.getElementById('duracao').value);
    let mensalidade = parseFloat(document.getElementById('mensalidade').value);
    let desconto = parseInt(document.getElementById('desconto').value);
    let pagueFacil = parseInt(document.getElementById('pagueFacil').value);
    let bolsaPrimeiro = parseFloat(document.getElementById('bolsaPrimeiro').value);
    let calcularPrimeiro = document.getElementById('calcularPrimeiro').value;
    
    const resultadoDiv = document.getElementById('resultado');
    
    // Validação com animação de erro
    if (isNaN(duracao) || isNaN(mensalidade) || duracao <= pagueFacil || mensalidade <= 0) {
        showError('Insira valores válidos para todos os campos obrigatórios.');
        shakeInputs();
        return;
    }
    
    // Cálculos
    let totalMensalidades = pagueFacil * mensalidade;
    let valorRestante = totalMensalidades - 59;
    let mesesRestantes = duracao - pagueFacil;
    let adicionalMensal = valorRestante / mesesRestantes;
    
    let resultadoHtml = `
        <p><i class="icon">💰</i> Pague Fácil (acréscimo): <strong>R$${adicionalMensal.toFixed(2)}</strong></p>
    `;
    
    // Cálculo do 1º semestre se solicitado
    if (calcularPrimeiro === "Sim") {
        let mensalidadePrimeiroSemestre = mensalidade;
        
        if (!isNaN(bolsaPrimeiro) && bolsaPrimeiro > 0) {
            mensalidadePrimeiroSemestre -= mensalidadePrimeiroSemestre * (bolsaPrimeiro / 100);
        }
        
        mensalidadePrimeiroSemestre -= mensalidadePrimeiroSemestre * (desconto / 100);
        let novaMensalidadePrimeiroSemestre = mensalidadePrimeiroSemestre + adicionalMensal;
        let mensalidadePrimeiroComPontualidade = novaMensalidadePrimeiroSemestre * 0.91;
        
        resultadoHtml += `
            <p><i class="icon">📅</i> Mensalidade 1º Semestre (Sem Pontualidade): <strong>R$${novaMensalidadePrimeiroSemestre.toFixed(2)}</strong></p>
            <p><i class="icon">⏰</i> Mensalidade 1º Semestre (Com Pontualidade): <strong>R$${mensalidadePrimeiroComPontualidade.toFixed(2)}</strong></p>
        `;
    }
    
    // Cálculo do 2º semestre
    let mensalidadeComDesconto = mensalidade - (mensalidade * (desconto / 100));
    let novaMensalidade = mensalidadeComDesconto + adicionalMensal;
    let mensalidadeComPontualidade = novaMensalidade * 0.91;
    
    resultadoHtml += `
        <p><i class="icon">📅</i> Mensalidade 2º Semestre (Sem Pontualidade): <strong>R$${novaMensalidade.toFixed(2)}</strong></p>
        <p><i class="icon">⏰</i> Mensalidade 2º Semestre (Com Pontualidade): <strong>R$${mensalidadeComPontualidade.toFixed(2)}</strong></p>
    `;
    
    // Exibe resultado com animação
    showResult(resultadoHtml);
    
    // Adiciona confete de celebração
    createConfetti();
}

function showError(message) {
    const resultadoDiv = document.getElementById('resultado');
    resultadoDiv.style.display = 'block';
    resultadoDiv.style.background = 'linear-gradient(135deg, #ffebee, #ffcdd2)';
    resultadoDiv.style.borderLeft = '4px solid #f44336';
    resultadoDiv.innerHTML = `<p style="color: #f44336;"><i class="icon">⚠️</i> ${message}</p>`;
    
    // Remove o erro após 3 segundos
    setTimeout(() => {
        resultadoDiv.style.display = 'none';
    }, 3000);
}

function showResult(html) {
    const resultadoDiv = document.getElementById('resultado');
    resultadoDiv.style.background = 'linear-gradient(135deg, #fafafa, #f0f0f0)';
    resultadoDiv.style.borderLeft = '4px solid #ff6600';
    resultadoDiv.style.display = 'block';
    resultadoDiv.innerHTML = html;
    
    // Scroll suave para o resultado
    resultadoDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function shakeInputs() {
    const inputs = document.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.classList.add('error');
        setTimeout(() => {
            input.classList.remove('error');
        }, 500);
    });
}

function createConfetti() {
    const colors = ['#ff6600', '#ff3300', '#ffcc00', '#00ff00', '#0066ff', '#cc00ff'];
    
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.style.cssText = `
                position: fixed;
                width: 8px;
                height: 8px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                left: ${Math.random() * 100}vw;
                top: -10px;
                border-radius: 50%;
                animation: fall 3s linear forwards;
                z-index: 1000;
                pointer-events: none;
            `;
            
            document.body.appendChild(confetti);
            
            setTimeout(() => {
                confetti.remove();
            }, 3000);
        }, i * 50);
    }
}

// Adiciona CSS para animações dinâmicas
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to { transform: scale(2); opacity: 0; }
    }
    
    @keyframes fall {
        to { 
            transform: translateY(100vh) rotate(360deg); 
            opacity: 0; 
        }
    }
    
    .icon {
        margin-right: 8px;
        font-size: 1.2em;
    }
    
    /* Animação de contador para números */
    @keyframes countUp {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    .count-animation {
        animation: countUp 0.5s ease-out;
    }
`;
document.head.appendChild(style);

// Função para animar números (contador)
function animateNumber(element, finalValue, duration = 1000) {
    const startValue = 0;
    const increment = finalValue / (duration / 16);
    let current = startValue;
    
    const timer = setInterval(() => {
        current += increment;
        element.textContent = `R$${current.toFixed(2)}`;
        
        if (current >= finalValue) {
            clearInterval(timer);
            element.textContent = `R$${finalValue.toFixed(2)}`;
        }
    }, 16);
}

// Adiciona efeito de parallax suave no scroll
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.5;
    
    document.body.style.transform = `translateY(${rate}px)`;
});

// Adiciona efeito de hover 3D nos cards
document.addEventListener('mousemove', function(e) {
    const main = document.querySelector('main');
    if (main) {
        const rect = main.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        main.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    }
});

// Reset do efeito 3D quando o mouse sai
document.addEventListener('mouseleave', function() {
    const main = document.querySelector('main');
    if (main) {
        main.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
    }
});
