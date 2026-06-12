document.addEventListener("DOMContentLoaded", () => {
    // ==========================================
    // INSTANCIAÇÃO DO GRÁFICO (Chart.js)
    // ==========================================
    const ctx = document.getElementById('liveAgroChart').getContext('2d');
    const liveChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['10s atrás', '8s atrás', '6s atrás', '4s atrás', '2s atrás', 'Agora'],
            datasets: [
                {
                    label: 'Umidade Uva (%)',
                    data: [59, 58.5, 59, 58.2, 58.8, 58.7],
                    borderColor: '#2ecc71',
                    backgroundColor: 'rgba(46, 204, 113, 0.1)',
                    tension: 0.4,
                    fill: true
                },
                {
                    label: 'Umidade Café (%)',
                    data: [65, 65.8, 66, 66.2, 66.1, 66.3],
                    borderColor: '#e67e22',
                    backgroundColor: 'rgba(230, 126, 34, 0.1)',
                    tension: 0.4,
                    fill: true
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { labels: { color: '#ffffff', font: { family: 'Plus Jakarta Sans' } } }
            },
            scales: {
                y: { min: 20, max: 100, grid: { color: 'rgba(255,255,255,0.1)' }, ticks: { color: '#a0aec0' } },
                x: { grid: { display: false }, ticks: { color: '#a0aec0' } }
            }
        }
    });

    // Simulador de dados em tempo real (atualiza o gráfico a cada 3 segundos)
    setInterval(() => {
        liveChart.data.datasets[0].data.shift();
        liveChart.data.datasets[1].data.shift();

        // Flutuação leve baseada nos valores atuais da tela
        let baseUva = parseFloat(document.getElementById('kpi-uva').innerText);
        let baseCafe = parseFloat(document.getElementById('kpi-cafe').innerText);

        liveChart.data.datasets[0].data.push(+(baseUva + (Math.random() * 2 - 1)).toFixed(1));
        liveChart.data.datasets[1].data.push(+(baseCafe + (Math.random() * 2 - 1)).toFixed(1));
        liveChart.update();
    }, 3000);


    // ==========================================
    // SIMULADOR DE CLIMA INTERATIVO E HISTÓRICO
    // ==========================================
    const btnNormal = document.getElementById('btn-clima-normal');
    const btnChuva = document.getElementById('btn-clima-chuva');
    const btnSeca = document.getElementById('btn-clima-seca');

    const kpiUva = document.getElementById('kpi-uva');
    const kpiCafe = document.getElementById('kpi-cafe');
    const kpiAbsorcao = document.getElementById('kpi-absorcao');
    const kpiStatusTag = document.getElementById('kpi-status-tag');
    
    const popup = document.getElementById('popup-alerta');
    const popupTitulo = document.getElementById('popup-titulo');
    const popupMsg = document.getElementById('popup-mensagem');
    const logAlertas = document.getElementById('log-alertas');
    const statusDrenagem = document.getElementById('status-drenagem');

    function limparClimaAtivo() {
        [btnNormal, btnChuva, btnSeca].forEach(b => b.classList.remove('active'));
    }

    function adicionarLog(mensagem, tipo) {
        const hora = new Date().toLocaleTimeString();
        let classe = 'system';
        if (tipo === 'alerta') classe = 'alert';
        if (tipo === 'perigo') classe = 'danger';
        
        logAlertas.innerHTML += `<div class="log-item ${classe}">[${hora}] ${mensagem}</div>`;
        logAlertas.scrollTop = logAlertas.scrollHeight; // Auto-scroll
    }

    function mostrarPopup(titulo, mensagem) {
        popupTitulo.innerText = titulo;
        popupMsg.innerText = mensagem;
        popup.classList.remove('hidden');
    }

    btnNormal.addEventListener('click', () => {
        limparClimaAtivo();
        btnNormal.classList.add('active');
        
        kpiUva.innerText = "58.7%";
        kpiCafe.innerText = "66.3%";
        kpiAbsorcao.innerText = "94.8%";
        kpiStatusTag.innerText = "Excelente";
        kpiStatusTag.className = "sector-tag highlight";

        statusDrenagem.innerText = "FECHADO";
        statusDrenagem.className = "actuator-status";

        adicionarLog("🟢 Clima estabilizado em Rosário do Ivaí.", "sistema");
    });

    btnChuva.addEventListener('click', () => {
        limparClimaAtivo();
        btnChuva.classList.add('active');

        kpiUva.innerText = "84.2%";
        kpiCafe.innerText = "89.5%";
        kpiAbsorcao.innerText = "71.3%";
        kpiStatusTag.innerText = "Alerta";
        kpiStatusTag.className = "sector-tag highlight danger";

        statusDrenagem.innerText = "ABERTO FLUXO";
        statusDrenagem.className = "actuator-status active";

        adicionarLog("⚠️ Saturação de solo por precipitação.", "alerta");
        mostrarPopup("ALERTA DE SATURAÇÃO", "Solo atingindo limite crítico. Válvula de drenagem da encosta foi aberta para conter erosões.");
    });

    btnSeca.addEventListener('click', () => {
        limparClimaAtivo();
        btnSeca.classList.add('active');

        kpiUva.innerText = "31.4%";
        kpiCafe.innerText = "34.1%";
        kpiAbsorcao.innerText = "98.9%";
        kpiStatusTag.innerText = "Crítico";
        kpiStatusTag.className = "sector-tag highlight danger";

        statusDrenagem.innerText = "BLOQUEADO";
        statusDrenagem.className = "actuator-status";

        adicionarLog("🔥 Estresse hídrico severo detectado.", "perigo");
        mostrarPopup("ESTRESSE HÍDRICO IA", "Umidade abaixo do ideal. Sensores recomendam ativação imediata dos aspersores cadastrados.");
    });

    document.getElementById('btn-fechar-popup').addEventListener('click', () => {
        popup.classList.add('hidden');
    });


    // ==========================================
    // SIMULADOR DE ECONOMIA E COOPERATIVA
    // ==========================================
    const inputHectares = document.getElementById('input-hectares');
    const txtEconomia = document.getElementById('txt-economia');
    const txtLitrosSalvos = document.getElementById('txt-litros-salvos');

    inputHectares.addEventListener('input', (e) => {
        let val = parseFloat(e.target.value) || 0;
        if(val < 0) val = 0;
        
        let economiaFinanceira = val * 1200;
        let aguaPoupada = val * 12000;

        txtEconomia.innerText = `R$ ${economiaFinanceira.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
        txtLitrosSalvos.innerHTML = `Água poupada: <strong>${aguaPoupada.toLocaleString('pt-BR')} Litros</strong>/mês`;
    });


    // ==========================================
    // INTERATIVIDADE DE HARDWARE (SWITCHES IoT)
    // ==========================================
    const switchUva = document.getElementById('switch-uva');
    const statusBombaUva = document.getElementById('status-bomba-uva');
    const switchCafe = document.getElementById('switch-cafe');
    const statusBombaCafe = document.getElementById('status-bomba-cafe');

    switchUva.addEventListener('change', (e) => {
        if(e.target.checked) {
            statusBombaUva.innerText = "LIGADO (AUTO)";
            statusBombaUva.className = "actuator-status active";
            adicionarLog("⚡ Comando IoT enviado: Motobomba Uva ligada.", "sistema");
        } else {
            statusBombaUva.innerText = "DESLIGADO";
            statusBombaUva.className = "actuator-status";
            adicionarLog("🛑 Comando IoT enviado: Motobomba Uva desligada.", "sistema");
        }
    });

    switchCafe.addEventListener('change', (e) => {
        if(e.target.checked) {
            statusBombaCafe.innerText = "LIGADO (AUTO)";
            statusBombaCafe.className = "actuator-status active";
            adicionarLog("⚡ Comando IoT enviado: Aspersor Café ligado.", "sistema");
        } else {
            statusBombaCafe.innerText = "DESLIGADO";
            statusBombaCafe.className = "actuator-status";
            adicionarLog("🛑 Comando IoT enviado: Aspersor Café desligado.", "sistema");
        }
    });


    // ==========================================
    // AGROBOT DIAGNÓSTICO (CHAT INTERATIVO)
    // ==========================================
    const chatBox = document.getElementById('chat-box');
    const botoesResposta = document.querySelectorAll('.reply-btn');

    const respostasAI = {
        uva: "🍇 **Diagnóstico Viticultura**: O solo de Rosário do Ivaí exige monitoramento constante devido ao relevo. A IA calcula a taxa de evapotranspiração para evitar que as uvas rachem por excesso de água.",
        relevo: "⛰️ **Análise Topográfica**: Sendo a capital da videira em região acidentada, curvas de nível inteligentes seguram o escoamento superficial. O sistema monitora a absorção para mitigar riscos de lavagem de nutrientes.",
        lora: "📡 **Infraestrutura de Rede**: Usamos o protocolo de rádio LoRaWAN devido ao relevo irregular de encostas. Ele permite transmissões de sensores até 15km consumindo o mínimo de bateria (painel solar integrado)."
    };

    botoesResposta.forEach(botao => {
        botao.addEventListener('click', () => {
            const topico = botao.getAttribute('data-question');
            const perguntaTexto = botao.innerText;

            // Insere pergunta do usuário no chat
            chatBox.innerHTML += `<div class="message user">${perguntaTexto}</div>`;
            
            // Simula delay de raciocínio da IA
            setTimeout(() => {
                chatBox.innerHTML += `<div class="message system">${respostasAI[topico]}</div>`;
                chatBox.scrollTop = chatBox.scrollHeight; // Mantém o chat rolando para baixo
            }, 400);
        });
    });


    // ==========================================
    // FILTRAGEM DINÂMICA DE SETORES
    // ==========================================
    const selectCultura = document.getElementById('select-cultura');
    const cardUvaElement = document.querySelector('.uva-card');
    const cardCafeElement = document.querySelector('.cafe-card');

    selectCultura.addEventListener('change', (e) => {
        const filtro = e.target.value;
        if (filtro === 'uva') {
            cardUvaElement.style.display = 'block';
            cardCafeElement.style.display = 'none';
            adicionarLog("🔍 Painel filtrado: Visualizando apenas Viticultura.", "sistema");
        } else if (filtro === 'cafe') {
            cardUvaElement.style.display = 'none';
            cardCafeElement.style.display = 'block';
            adicionarLog("🔍 Painel filtrado: Visualizando apenas Cafeicultura.", "sistema");
        } else {
            cardUvaElement.style.display = 'block';
            cardCafeElement.style.display = 'block';
            adicionarLog("🔍 Painel filtrado: Exibindo todos os setores rurais.", "sistema");
        }
    });
});