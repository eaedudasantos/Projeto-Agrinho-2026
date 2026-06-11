// 🌾 SCRIPT DE MONITORIZAÇÃO DE HUMIDADE - PROJETO AGRINHO 🌾

// 1. Definição das configurações do solo (Limiares de humidade em %)
const LIMIAR_SECO = 30;       // Abaixo de 30% o solo está demasiado seco
const LIMIAR_IDEAL_MIN = 40;  // Entre 40% e 70% é a humidade ideal
const LIMIAR_IDEAL_MAX = 70;

/**
 * Função que analisa a humidade atual e gera o diagnóstico para o agricultor
 * @param {number} percentagemHumidade 
 * @returns {Object} Mensagem de alerta e a cor correspondente ao estado
 */
function analisarSolo(percentagemHumidade) {
    let mensagem = "";
    let corStatus = "";

    if (percentagemHumidade < LIMIAR_SECO) {
        mensagem = "🚨 ALERTA: Solo muito seco! Ativar sistema de rega imediatamente.";
        corStatus = "#d9534f"; // Vermelho
    } else if (percentagemHumidade >= LIMIAR_IDEAL_MIN && percentagemHumidade <= LIMIAR_IDEAL_MAX) {
        mensagem = "✅ Solo Saudável: A humidade está no nível ideal para o cultivo.";
        corStatus = "#2b6e4c"; // Verde Agrinho
    } else if (percentagemHumidade > LIMIAR_IDEAL_MAX) {
        mensagem = "⚠️ Atenção: Solo encharcado. Risco de apodrecimento das raízes.";
        corStatus = "#0275d8"; // Azul
    } else {
        mensagem = "💧 Humidade moderada. Monitorize a plantação.";
        corStatus = "#f0ad4e"; // Amarelo/Laranja
    }

    return {
        texto: mensagem,
        cor: corStatus
    };
}

/**
 * Função para atualizar a interface do utilizador (HTML) com os dados do sensor
 * (Assume que tens elementos com estes IDs no teu HTML)
 */
function atualizarPainelDoAgricultor() {
    // Simula a leitura de um sensor real (gera um valor aleatório entre 10% e 90%)
    const valorSensorSimulado = Math.floor(Math.random() * (90 - 10 + 1)) + 10;
    
    // Executa a análise dos dados
    const diagnostico = analisarSolo(valorSensorSimulado);

    // Procura os elementos na página HTML para atualizar os textos
    const elementoHumidade = document.getElementById("valor-humidade");
    const elementoStatus = document.getElementById("status-mensagem");

    // Verifica se os elementos existem na página antes de alterar
    if (elementoHumidade && elementoStatus) {
        elementoHumidade.innerText = valorSensorSimulado + "%";
        elementoStatus.innerText = diagnostico.texto;
        elementoStatus.style.color = diagnostico.cor;
        
        console.log(`[Sensor] Leitura efetuada: ${valorSensorSimulado}% - ${diagnostico.texto}`);
    } else {
        // Caso os IDs ainda não existam no HTML, mostra apenas no painel de programador (Consola)
        console.log("--- Painel de Monitorização Agrinho ---");
        console.log(`Humidade do Solo: ${valorSensorSimulado}%`);
        console.log(`Status: ${diagnostico.texto}`);
    }
}

// Executa a função automaticamente assim que a página terminar de carregar
window.onload = function() {
    atualizarPainelDoAgricultor();
    
    // Atualiza a leitura automaticamente a cada 5 segundos para simular tempo real
    setInterval(atualizarPainelDoAgricultor, 5000);
};