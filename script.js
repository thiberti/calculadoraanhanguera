function calcularMensalidade() {
    let duracao = parseInt(document.getElementById('duracao').value);
    let mensalidade = parseFloat(document.getElementById('mensalidade').value);
    let desconto = parseInt(document.getElementById('desconto').value);
    let pagueFacil = parseInt(document.getElementById('pagueFacil').value);

    let bolsaPrimeiro = parseFloat(document.getElementById('bolsaPrimeiro').value);
    let calcularPrimeiro = document.getElementById('calcularPrimeiro').value; // "Sim" ou "Não"

    // Referência ao bloco de resultado
    let resultadoDiv = document.getElementById('resultado');

    // Validação básica
    if (isNaN(duracao) || isNaN(mensalidade) || duracao <= pagueFacil) {
        resultadoDiv.style.display = 'block';
        resultadoDiv.innerHTML = '<p style="color: red;">Insira valores válidos.</p>';
        return;
    }

    let totalMensalidades = pagueFacil * mensalidade;
    let valorRestante = totalMensalidades - 59;
    let mesesRestantes = duracao - pagueFacil;
    let adicionalMensal = valorRestante / mesesRestantes;

    let resultadoHtml = `<p>Pague Fácil (acréscimo): <strong>R$${adicionalMensal.toFixed(2)}</strong></p>`;

    // Se for "Sim", calcula e exibe o 1º semestre
    if (calcularPrimeiro === "Sim") {
        let mensalidadePrimeiroSemestre = mensalidade;

        if (!isNaN(bolsaPrimeiro) && bolsaPrimeiro > 0) {
            mensalidadePrimeiroSemestre -= mensalidadePrimeiroSemestre * (bolsaPrimeiro / 100);
        }

        mensalidadePrimeiroSemestre -= mensalidadePrimeiroSemestre * (desconto / 100);
        let novaMensalidadePrimeiroSemestre = mensalidadePrimeiroSemestre + adicionalMensal;
        let mensalidadePrimeiroComPontualidade = novaMensalidadePrimeiroSemestre * 0.91;

        resultadoHtml += `
            <p>Mensalidade 1º Semestre (Sem Pontualidade): <strong>R$${novaMensalidadePrimeiroSemestre.toFixed(2)}</strong></p>
            <p>Mensalidade 1º Semestre (Com Pontualidade): <strong>R$${mensalidadePrimeiroComPontualidade.toFixed(2)}</strong></p>
        `;
    }

    // Cálculo do 2º semestre (sempre mostrado)
    let mensalidadeComDesconto = mensalidade - (mensalidade * (desconto / 100));
    let novaMensalidade = mensalidadeComDesconto + adicionalMensal;
    let mensalidadeComPontualidade = novaMensalidade * 0.91;

    resultadoHtml += `
        <p>Mensalidade 2º Semestre (Sem Pontualidade): <strong>R$${novaMensalidade.toFixed(2)}</strong></p>
        <p>Mensalidade 2º Semestre (Com Pontualidade): <strong>R$${mensalidadeComPontualidade.toFixed(2)}</strong></p>
    `;

    // Exibir resultado e liberar área visual
    resultadoDiv.style.display = 'block';
    resultadoDiv.innerHTML = resultadoHtml;
}
