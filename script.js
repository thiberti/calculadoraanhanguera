function calcularMensalidade() {
    let duracao = parseInt(document.getElementById('duracao').value);
    let mensalidade = parseFloat(document.getElementById('mensalidade').value);
    let desconto = parseInt(document.getElementById('desconto').value);
    let pagueFacil = parseInt(document.getElementById('pagueFacil').value);

    // Validação básica
    if (isNaN(duracao) || isNaN(mensalidade) || duracao <= pagueFacil) {
        document.getElementById('resultado').style.display = 'block';
        document.getElementById('resultado').innerHTML = '<p style="color: red;">Insira valores válidos.</p>';
        return;
    }

    let totalMensalidades = pagueFacil * mensalidade;
    let valorRestante = totalMensalidades - 59;
    let mesesRestantes = duracao - pagueFacil;
    let mensalidadeComDesconto = mensalidade - (mensalidade * (desconto / 100));
    let adicionalMensal = valorRestante / mesesRestantes;
    let novaMensalidade = mensalidadeComDesconto + adicionalMensal;
    let mensalidadeComPontualidade = novaMensalidade * 0.91;

    // Exibir resultado e liberar área visual
    document.getElementById('resultado').style.display = 'block';
    document.getElementById('resultado').innerHTML = `
        <p>Pague Fácil (acréscimo): <strong>R$${adicionalMensal.toFixed(2)}</strong></p>
        <p>Mensalidade 2º Semestre (Sem Pontualidade): <strong>R$${novaMensalidade.toFixed(2)}</strong></p>
        <p>Mensalidade 2º Semestre (Com Pontualidade): <strong>R$${mensalidadeComPontualidade.toFixed(2)}</strong></p>
    `;
}
