// ==========================================================================
// CENTRAL AGRO-PRECI IA - VERSÃO INTEGRAL MASTER (AGRINHO 2026)
// ==========================================================================

document.addEventListener("DOMContentLoaded", function () {
    // A lógica foi gerada com IA.
    // --- 1. SINTETIZADOR DE VOZ (ACESSIBILIDADE) ---
    function falarAlerta(texto) {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel(); // Limpa falas anteriores
            const fala = new SpeechSynthesisUtterance(texto);
            fala.lang = 'pt-BR';
            fala.rate = 1.1; 
            window.speechSynthesis.speak(fala);
        }
    }

    // --- 2. CRIAÇÃO DO BOTÃO DE TEMA (MODO DIA/NOITE) ---
    const sidebarTop = document.getElementById('sidebar-top-container');
    if (sidebarTop) {
        const btnTema = document.createElement('button');
        btnTema.innerHTML = "☀️ Alternar Modo Dia/Noite";
        btnTema.style.cssText = "width: 100%; padding: 10px; margin-top: 15px; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15); color: white; border-radius: 6px; cursor: pointer; font-weight: bold; font-family: inherit; font-size: 11px;";
        
        sidebarTop.appendChild(btnTema);

        btnTema.addEventListener('click', function() {
            document.body.classList.toggle('modo-claro');
            if (document.body.classList.contains('modo-claro')) {
                btnTema.innerHTML = "🌙 Modo Operação Noturna";
                btnTema.style.background = "#e2e8f0";
                btnTema.style.color = "#2d3748";
                btnTema.style.borderColor = "#cbd5e0";
            } else {
                btnTema.innerHTML = "☀️ Alternar Modo Dia/Noite";
                btnTema.style.background = "rgba(255,255,255,0.08)";
                btnTema.style.color = "white";
                btnTema.style.borderColor = "rgba(255,255,255,0.15)";
            }
        });
    }

    // --- 3. INICIALIZAÇÃO DO GRÁFICO (CHART.JS) ---
    const canvasElement = document.getElementById('liveAgroChart');
    let liveChart = null;

    if (canvasElement) {
        const ctx = canvasElement.getContext('2d');
        let tempoLabels = ['00s', '03s', '06s', '09s', '12s', '15s'];
        let dadosUva = [58, 59, 57, 58, 59, 58.7];
        let dadosCafe = [65, 66, 64, 67, 65, 66.3];

        liveChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: tempoLabels,
                datasets: [
                    {
                        label: 'Umidade Uva (%)',
                        data: dadosUva,
                        borderColor: '#2ecc71',
                        backgroundColor: 'rgba(46, 204, 113, 0.1)',
                        tension: 0.4,
                        borderWidth: 2
                    },
                    {
                        label: 'Umidade Café (%)',
                        data: dadosCafe,
                        borderColor: '#3498db',
                        backgroundColor: 'rgba(52, 152, 219, 0.1)',
                        tension: 0.4,
                        borderWidth: 2
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: { min: 10, max: 100, grid: { color: 'rgba(255,255,255,0.05)' } },
                    x: { grid: { display: false } }
                },
                plugins: { legend: { labels: { color: '#inherit' } } }
            }
        });

        // Loop de simulação de leitura dos sensores (roda a cada 3 segundos)
        setInterval(() => {
            const btnChuva = document.getElementById('btn-clima-chuva');
            const btnSeca = document.getElementById('btn-clima-seca');
            
            // Só oscila aleatoriamente se os climas fixos extremos não estiverem ativos
            if (btnChuva && btnSeca && !btnChuva.classList.contains('active') && !btnSeca.classList.contains('active')) {
                let novaUmidadeUva = (57 + Math.random() * 3).toFixed(1);
                let novaUmidadeCafe = (64 + Math.random() * 4).toFixed(1);
                atualizarPainelDados(novaUmidadeUva, novaUmidadeCafe);
            }
        }, 3000);
    }

    // Função interna para empurrar novos valores nos KPIs e atualizar as linhas do gráfico
    function atualizarPainelDados(umidadeUva, umidadeCafe) {
        const kpiUva = document.getElementById('kpi-uva');
        const kpiCafe = document.getElementById('kpi-cafe');
        if (kpiUva) kpiUva.innerText = umidadeUva + "%";
        if (kpiCafe) kpiCafe.innerText = umidadeCafe + "%";

        if (liveChart) {
            liveChart.data.datasets[0].data.shift();
            liveChart.data.datasets[0].data.push(parseFloat(umidadeUva));
            
            liveChart.data.datasets[1].data.shift();
            liveChart.data.datasets[1].data.push(parseFloat(umidadeCafe));
            liveChart.update();
        }
    }

    // --- 4. CONFIGURAÇÃO DA CENTRAL MATRIX CLIMÁTICA ---
    const btnClimaNormal = document.getElementById('btn-clima-normal');
    const btnClimaChuva = document.getElementById('btn-clima-chuva');
    const btnClimaSeca = document.getElementById('btn-clima-seca');
    const sliderChuva = document.getElementById('slider-chuva-adubo');

    function resetarBotoesClima() {
        if (btnClimaNormal) btnClimaNormal.classList.remove('active');
        if (btnClimaChuva) btnClimaChuva.classList.remove('active');
        if (btnClimaSeca) btnClimaSeca.classList.remove('active');
    }

    if (btnClimaNormal) {
        btnClimaNormal.addEventListener('click', function () {
            resetarBotoesClima();
            this.classList.add('active');
            if (sliderChuva) { sliderChuva.value = 20; sliderChuva.dispatchEvent(new Event('input')); }
            atualizarPainelDados(58.7, 66.3);
            mostrarAlertaPopup("MATRIZ CLIMÁTICA", "Padrão meteorológico redefinido para Estável.");
            falarAlerta("Clima estabilizado. Umidade retornando aos parâmetros.");
        });
    }

    if (btnClimaChuva) {
        btnClimaChuva.addEventListener('click', function () {
            resetarBotoesClima();
            this.classList.add('active');
            if (sliderChuva) { sliderChuva.value = 85; sliderChuva.dispatchEvent(new Event('input')); }
            atualizarPainelDados(88.5, 92.1);
            mostrarAlertaPopup("ALERTA METEOROLÓGICO", "Frente de precipitação ativa em Rosário do Ivaí.");
            falarAlerta("Aviso de tempestade. Frente de precipitação ativa.");
        });
    }

    if (btnClimaSeca) {
        btnClimaSeca.addEventListener('click', function () {
            resetarBotoesClima();
            this.classList.add('active');
            if (sliderChuva) { sliderChuva.value = 5; sliderChuva.dispatchEvent(new Event('input')); }
            atualizarPainelDados(31.2, 28.4);
            mostrarAlertaPopup("ESTRESSE HÍDRICO", "Gradiente térmico elevado. Monitorando evapotranspiração.");
            falarAlerta("Alerta de estresse hídrico detectado.");
        });
    }

    // --- 5. INTERAÇÃO DO MONITORAMENTO POR CULTURA ---
    const selectCultura = document.getElementById('select-cultura');
    const cardUva = document.querySelector('.uva-card');
    const cardCafe = document.querySelector('.cafe-card');
    const mapLabel = document.getElementById('map-label');
    const mapTarget = document.getElementById('map-target');

    if (selectCultura) {
        selectCultura.addEventListener('change', function () {
            const valor = this.value;

            if (cardUva) cardUva.style.opacity = "1";
            if (cardCafe) cardCafe.style.opacity = "1";

            if (valor === 'uva') {
                if (cardCafe) cardCafe.style.opacity = "0.2";
                if (mapLabel) mapLabel.innerText = "Foco Orbital: Setor Sul - Uva Niágara";
                if (mapTarget) {
                    mapTarget.style.borderColor = "#2ecc71";
                    mapTarget.style.top = "20%"; mapTarget.style.left = "30%";
                }
                falarAlerta("Filtrando telemetria para viticultura.");
            } else if (valor === 'cafe') {
                if (cardUva) cardUva.style.opacity = "0.2";
                if (mapLabel) mapLabel.innerText = "Foco Orbital: Setor Norte - Café Adensado";
                if (mapTarget) {
                    mapTarget.style.borderColor = "#3498db";
                    mapTarget.style.top = "50%"; mapTarget.style.left = "65%";
                }
                falarAlerta("Filtrando telemetria para cafeicultura.");
            } else {
                if (mapLabel) mapLabel.innerText = "Mapeamento NDVI Ativo";
                if (mapTarget) {
                    mapTarget.style.borderColor = "#2ecc71";
                    mapTarget.style.top = "35%"; mapTarget.style.left = "45%";
                }
                falarAlerta("Exibindo visão geral de todas as culturas.");
            }
        });
    }

    // --- 6. CONFIGURAÇÃO DO CÁLCULO DE ECONOMIA CIRCULAR ---
    const inputHectares = document.getElementById('input-hectares');
    const txtEconomia = document.getElementById('txt-economia');
    const txtLitrosSalvos = document.getElementById('txt-litros-salvos');

    function calcularEconomia() {
        if (inputHectares && txtEconomia && txtLitrosSalvos) {
            let hectares = parseFloat(inputHectares.value);
            if (isNaN(hectares) || hectares < 0) hectares = 0;

            let granaPoupada = hectares * 1200;
            let aguaPoupada = hectares * 12000;

            txtEconomia.innerText = `R$ ${granaPoupada.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
            txtLitrosSalvos.innerHTML = `Recurso hídrico poupado: <strong>${aguaPoupada.toLocaleString('pt-BR')} Litros</strong>/mês`;
        }
    }

    if (inputHectares) {
        inputHectares.addEventListener('input', calcularEconomia);
        calcularEconomia(); 
    }

    // --- 7. CONFIGURAÇÃO DOS INTERRUPTORES IoT ---
    function configurarAtuador(switchId, statusId, textoNome) {
        const elementoSwitch = document.getElementById(switchId);
        const statusTxt = document.getElementById(statusId);
        
        if (elementoSwitch && statusTxt) {
            elementoSwitch.addEventListener('change', function() {
                if (this.checked) {
                    statusTxt.innerText = "LIGADO";
                    statusTxt.style.color = "#2ecc71";
                    mostrarAlertaPopup("IoT ATUADOR", `${textoNome} foi acionado com sucesso.`);
                    falarAlerta(`${textoNome} foi ligado.`);
                } else {
                    statusTxt.innerText = "DESLIGADO";
                    statusTxt.style.color = "#e74c3c";
                    mostrarAlertaPopup("IoT ATUADOR", `${textoNome} foi desligado.`);
                    falarAlerta(`${textoNome} foi desligado.`);
                }
            });
        }
    }

    configurarAtuador('switch-uva', 'status-bomba-uva', 'A motobomba de uvas');
    configurarAtuador('switch-cafe', 'status-bomba-cafe', 'O aspersor de café');

    const switchDrenagem = document.getElementById('switch-drenagem');
    const statusDrenagem = document.getElementById('status-drenagem');
    if (switchDrenagem && statusDrenagem) {
        switchDrenagem.addEventListener('change', function() {
            if (this.checked) {
                statusDrenagem.innerText = "ABERTO";
                statusDrenagem.style.color = "#2ecc71";
                falarAlerta("Comportas de drenagem abertas manualmente.");
            } else {
                statusDrenagem.innerText = "FECHADO";
                statusDrenagem.style.color = "#e74c3c";
                falarAlerta("Comportas de drenagem fechadas.");
            }
        });
    }

    // Missão do Drone VANT
    const btnDrone = document.getElementById('btn-voot-drone');
    const statusDrone = document.getElementById('status-drone');
    if (btnDrone && statusDrone) {
        btnDrone.addEventListener('click', function() {
            btnDrone.disabled = true;
            btnDrone.innerText = "Voando...";
            btnDrone.style.opacity = "0.5";
            statusDrone.innerText = "EM MISSÃO ✈️";
            statusDrone.style.color = "#3498db";
            
            mostrarAlertaPopup("VANT MAPEAMENTO", "Drone decolou para monitoramento orbital.");
            falarAlerta("Atenção: Drone decolou para mapeamento aéreo.");

            setTimeout(() => {
                statusDrone.innerText = "Hangar";
                statusDrone.style.color = "#a0aec0";
                btnDrone.disabled = false;
                btnDrone.innerText = "Executar Missão";
                btnDrone.style.opacity = "1";
                mostrarAlertaPopup("VANT SATELLITE", "Missão concluída com sucesso!");
                falarAlerta("O drone retornou ao hangar.");
            }, 5000);
        });
    }

    // --- 8. LOGICA DE INTENSIDADE DA CHUVA (SLIDER IA) ---
    if (sliderChuva) {
        sliderChuva.addEventListener('input', function() {
            const intensidade = parseInt(this.value);
            const txtPerda = document.getElementById('txt-perda-adubo');
            const statusTagEncosta = document.getElementById('kpi-status-tag');
            const txtAbsorcao = document.getElementById('kpi-absorcao');
            const descEncosta = document.getElementById('kpi-desc-encosta');
            const swDrenagem = document.getElementById('switch-drenagem');
            const lblDrenagem = document.getElementById('status-drenagem');

            if (txtPerda) {
                let kgEvitados = (intensidade * 0.2).toFixed(1);
                txtPerda.innerText = `${kgEvitados} kg por hectare`;
            }

            if (intensidade > 75) {
                if (statusTagEncosta) { statusTagEncosta.innerText = "CRÍTICO"; statusTagEncosta.style.background = "#e74c3c"; }
                if (txtAbsorcao) txtAbsorcao.innerText = "42.1%";
                if (descEncosta) descEncosta.innerText = "Alerta de Saturação! Solo instável.";

                if (swDrenagem && !swDrenagem.checked) {
                    swDrenagem.checked = true;
                    if (lblDrenagem) { lblDrenagem.innerText = "ABERTO (IA)"; lblDrenagem.style.color = "#2ecc71"; }
                    mostrarAlertaPopup("ALERTA CRÍTICO DA IA", "Solo saturado! Sistema de drenagem ativado emergencialmente.");
                    falarAlerta("Aviso crítico de engenharia: Solo saturado detectado. Ativando comportas de drenagem.");
                }
            } else if (intensidade > 40) {
                if (statusTagEncosta) { statusTagEncosta.innerText = "ALERTA"; statusTagEncosta.style.background = "#f39c12"; }
                if (txtAbsorcao) txtAbsorcao.innerText = "71.4%";
                if (descEncosta) descEncosta.innerText = "Escoamento superficial sob monitoramento.";
            } else {
                if (statusTagEncosta) { statusTagEncosta.innerText = "Excelente"; statusTagEncosta.style.background = "#2ecc71"; }
                if (txtAbsorcao) txtAbsorcao.innerText = "94.8%";
                if (descEncosta) descEncosta.innerText = "Drenagem ativa mitigando escoamento linear.";
            }
        });
    }

    // --- 9. AGROBOT (CHATBOT) RESPONSIVO ---
    const chatBox = document.getElementById('chat-box');
    const respostasAgroBot = {
        uva: "🍇 **Diagnóstico Viticultura:** Sensores indicam nível ideal de umidade para a Uva Niágara.",
        relevo: "⛰️ **Estudo Topográfico:** O relevo inclinado de Rosário do Ivaí exige monitoramento constante das encostas.",
        lora: "📡 **Telemetria LoraWAN:** Sinal operando com excelente ganho (-68 dBm) na fazenda."
    };

    document.querySelectorAll('.reply-btn-chat').forEach(botao => {
        botao.addEventListener('click', function() {
            const vetor = this.getAttribute('data-question');
            if (chatBox && respostasAgroBot[vetor]) {
                chatBox.innerHTML += `<div class="message user" style="text-align: right; color: #3498db; margin: 5px 0;"><strong>Você:</strong> ${this.innerText}</div>`;
                
                setTimeout(() => {
                    chatBox.innerHTML += `<div class="message system" style="margin: 5px 0; background: rgba(0,0,0,0.1); padding: 8px; border-radius: 6px; border-left: 3px solid #2ecc71;">🤖 <strong>AgroBot:</strong> ${respostasAgroBot[vetor]}</div>`;
                    chatBox.scrollTop = chatBox.scrollHeight;
                }, 400);
            }
        });
    });

    // --- 10. CONTROLADORES DO POPUP E EMISSÃO DE RELATÓRIO ---
    function mostrarAlertaPopup(titulo, mensagem) {
        const popup = document.getElementById('popup-alerta');
        const pTitulo = document.getElementById('popup-titulo');
        const pMsg = document.getElementById('popup-mensagem');
        
        if (pTitulo) pTitulo.innerText = titulo;
        if (pMsg) pMsg.innerText = mensagem;
        if (popup) popup.classList.remove('hidden');
    }

    const btnFechar = document.getElementById('btn-fechar-popup');
    if (btnFechar) {
        btnFechar.addEventListener('click', function() {
            const popup = document.getElementById('popup-alerta');
            if (popup) popup.classList.add('hidden');
        });
    }

    const btnRelatorio = document.getElementById('btn-gerar-relatorio');
    if (btnRelatorio) {
        btnRelatorio.addEventListener('click', function() {
            mostrarAlertaPopup("CERTIFICAÇÃO AMBIENTAL", "Relatório de conformidade ambiental gerado para o Agrinho.");
            falarAlerta("Relatório assinado e autenticado com sucesso.");
        });
    }

    // --- 11. MANUAL DE PRÁTICAS SUSTENTÁVEIS (ESG) ---
    const btnEsg = document.getElementById('btn-abrir-esg');
    if (btnEsg) {
        btnEsg.addEventListener('click', function() {
            mostrarAlertaPopup("MANUAL ESG DA PROPRIEDADE", "Manejo ecológico de solos declivosos e contenção de erosão hídrica via sensores LoRa em Rosário do Ivaí.");
            falarAlerta("Diretriz de sustentabilidade ativa. Monitorando curvas de nível para conter a erosão hídrica do relevo.");
            
            if (chatBox) {
                chatBox.innerHTML += `<div class="message system" style="margin: 5px 0; background: rgba(46, 204, 113, 0.1); padding: 8px; border-radius: 6px; border-left: 3px solid #2ecc71;">🌱 <strong>ESG Insight:</strong> Curvas de nível e plantio direto integrados evitam perdas de adubo por enxurrada.</div>`;
                chatBox.scrollTop = chatBox.scrollHeight;
            }
        });
    }
});