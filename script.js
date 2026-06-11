document.addEventListener('DOMContentLoaded', () => {
    const canvasContext = document.getElementById('liveAgroChart');
    if (!canvasContext) return;

    let climaAtivo = 'normal'; 
    let alertasAtivados = false;

    // Dados de simulação baseados nas necessidades de Rosário do Ivaí
    const baseLabels = ['10:00', '12:00', '14:00', '16:00', 'Agora', '+2h Projeção (IA)'];
    const dadosNormais = { uva: [58, 57, 56, 59, 58, 57.5], cafe: [65, 64, 63, 66, 65, 64.2] };
    const dadosChuva = { uva: [58, 57, 68, 79, 82, 88.0], cafe: [65, 64, 73, 81, 84, 91.5] };
    const dadosSeca = { uva: [58, 52, 47, 43, 39, 32.1], cafe: [65, 61, 55, 51, 46, 38.0] };

    // Inicialização do Gráfico (Chart.js) com design customizado
    const agroChartInstance = new Chart(canvasContext.getContext('2d'), {
        type: 'line',
        data: {
            labels: baseLabels,
            datasets: [
                { 
                    label: 'Uva Niágara', 
                    data: [...dadosNormais.uva], 
                    borderColor: '#bf5af2', 
                    backgroundColor: 'transparent', 
                    borderWidth: 3, 
                    tension: 0.3, 
                    segment: { borderDash: ctx => ctx.p1DataIndex === 5 ? [6, 6] : undefined } 
                },
                { 
                    label: 'Café Adensado', 
                    data: [...dadosNormais.cafe], 
                    borderColor: '#0a84ff', 
                    backgroundColor: 'transparent', 
                    borderWidth: 3, 
                    tension: 0.3, 
                    segment: { borderDash: ctx => ctx.p1DataIndex === 5 ? [6, 6] : undefined } 
                }
            ]
        },
        options: { 
            responsive: true, 
            maintainAspectRatio: false, 
            plugins: { legend: { labels: { color: '#94a3b8', font: { weight: '600' } } } }, 
            scales: { 
                y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#94a3b8' } }, 
                x: { grid: { display: false }, ticks: { color: '#94a3b8' } } 
            } 
        }
    });

    // Banco de respostas do AgroBot Inteligente
    const chatBox = document.getElementById('chat-box');
    const respostasBot = {
        uva: "No solo de Rosário do Ivaí, o excesso de umidade propicia fungos. Mantenha os aspersores desligados se a IA apontar curva acima de 65%.",
        relevo: "Nossa topografia acidentada gera enxurradas. A IA analisa a absorção para mitigar riscos de erosão nas encostas.",
        lora: "Áreas de vale não têm sinal celular estável. O rádio LoRa transmite dados a até 15km sem depender de operadoras de telefonia."
    };

    // Cliques nas perguntas rápidas do Chatbot
    document.querySelectorAll('.reply-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const q = e.target.getAttribute('data-question');
            chatBox.innerHTML += `<div class="message user">${e.target.innerText}</div>`;
            setTimeout(() => {
                chatBox.innerHTML += `<div class="message bot">🤖 ${respostasBot[q]}</div>`;
                chatBox.scrollTop = chatBox.scrollHeight;
            }, 400);
        });
    });

    // Função interna para disparar os Popups de Alerta na tela
    function dispararAlertaCelular(titulo, mensagem) {
        if (!alertasAtivados) return;
        document.getElementById('popup-titulo').innerText = titulo;
        document.getElementById('popup-mensagem').innerText = mensagem;
        document.getElementById('popup-alerta').classList.remove('hidden');
    }
    
    document.getElementById('btn-fechar-popup').addEventListener('click', () => {
        document.getElementById('popup-alerta').classList.add('hidden');
    });

    // Vinculação de celular simulada
    document.getElementById('btn-ativar-zap').addEventListener('click', () => {
        if(!document.getElementById('input-zap').value) return;
        alertasAtivados = true;
        alert(`Dispositivo celular pareado com sucesso para alertas preditivos!`);
    });

    // Calculadora Automática de Economia por Hectare
    document.getElementById('input-hectares').addEventListener('input', (e) => {
        let val = parseFloat(e.target.value) || 0;
        document.getElementById('txt-economia').innerText = `R$ ${(val * 1200).toLocaleString('pt-BR', {minimumFractionDigits: 2})}`;
    });

    // Filtros de visualização por cultura e mapas
    document.getElementById('select-cultura').addEventListener('change', (e) => {
        const val = e.target.value;
        const overlay = document.getElementById('map-target');
        const label = document.getElementById('map-label');
        if(val === 'uva') {
            overlay.style.background = "rgba(191, 90, 242, 0.25)"; label.innerText = "Setor Sul (Uvas)";
            agroChartInstance.setDatasetVisibility(0, true); agroChartInstance.setDatasetVisibility(1, false);
        } else if(val === 'cafe') {
            overlay.style.background = "rgba(10, 132, 255, 0.25)"; label.innerText = "Setor Norte (Café)";
            agroChartInstance.setDatasetVisibility(0, false); agroChartInstance.setDatasetVisibility(1, true);
        } else {
            overlay.style.background = "rgba(10, 132, 255, 0.08)"; label.innerText = "Propriedade Total";
            agroChartInstance.setDatasetVisibility(0, true); agroChartInstance.setDatasetVisibility(1, true);
        }
        agroChartInstance.update();
    });

    // Simulador de Clima com Gatilhos de Emergência de Hardware (IoT)
    document.querySelectorAll('.btn-clima').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.btn-clima').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            climaAtivo = e.target.id.replace('btn-clima-', '');

            const sUva = document.getElementById('switch-uva'), sCafe = document.getElementById('switch-cafe');
            const tUva = document.getElementById('status-bomba-uva'), tCafe = document.getElementById('status-bomba-cafe');

            if(climaAtivo === 'seca') {
                sUva.checked = true; sCafe.checked = true;
                tUva.innerText = "LIGADO - IA EMERGENCIAL"; tUva.className = "actuator-status active";
                tCafe.innerText = "LIGADO - IA EMERGENCIAL"; tCafe.className = "actuator-status active";
                document.getElementById('kpi-absorcao').innerText = "12.4%";
                document.getElementById('kpi-status-tag').innerText = "Déficit Crítico";
                agroChartInstance.data.datasets[0].data = [...dadosSeca.uva];
                agroChartInstance.data.datasets[1].data = [...dadosSeca.cafe];
                dispararAlertaCelular("☀️ DÉFICIT HÍDRICO", "Aviso Preditivo: Sensores acusam evapotranspiração acelerada. Motores ativados.");
            } else if(climaAtivo === 'chuva') {
                sUva.checked = false; sCafe.checked = false;
                tUva.innerText = "TRAVADO - CHUVA"; tUva.className = "actuator-status";
                tCafe.innerText = "TRAVADO - CHUVA"; tCafe.className = "actuator-status";
                document.getElementById('kpi-absorcao').innerText = "41.8%";
                document.getElementById('kpi-status-tag').innerText = "Alerta Erosão";
                agroChartInstance.data.datasets[0].data = [...dadosChuva.uva];
                agroChartInstance.data.datasets[1].data = [...dadosChuva.cafe];
                dispararAlertaCelular("🚨 REF. DESLAVAMENTO", "Volume pluvial crítico. Irrigação suspensa para controle de lixiviação.");
            } else {
                sUva.checked = false; sCafe.checked = false;
                tUva.innerText = "DESLIGADO"; tUva.className = "actuator-status";
                tCafe.innerText = "DESLIGADO"; tCafe.className = "actuator-status";
                document.getElementById('kpi-absorcao').innerText = "94.8%";
                document.getElementById('kpi-status-tag').innerText = "Excelente";
                agroChartInstance.data.datasets[0].data = [...dadosNormais.uva];
                agroChartInstance.data.datasets[1].data = [...dadosNormais.cafe];
            }
            agroChartInstance.update();
        });
    });

    // Loop que simula a flutuação em tempo real dos sensores (Muda a cada 4 segundos)
    setInterval(() => {
        if(climaAtivo !== 'normal') return;
        const vUva = (Math.random() * (60 - 57) + 57).toFixed(1);
        const vCafe = (Math.random() * (68 - 64) + 64).toFixed(1);
        document.getElementById('kpi-uva').innerText = `${vUva}%`;
        document.getElementById('kpi-cafe').innerText = `${vCafe}%`;
        agroChartInstance.data.datasets[0].data[4] = parseFloat(vUva);
        agroChartInstance.data.datasets[1].data[4] = parseFloat(vCafe);
        agroChartInstance.update('none');
    }, 4000);
});