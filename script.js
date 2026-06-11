document.addEventListener('DOMContentLoaded', () => {
    const canvasContext = document.getElementById('liveAgroChart');
    if (!canvasContext) return;

    // Configuração de dados históricos simulando telemetria de campo
    const datasetConfig = {
        labels: ['08:00', '10:00', '12:00', '14:00', '16:00', 'Leitura Atual'],
        datasets: [
            {
                label: 'Setor de Videiras (Uva)',
                data: [58.1, 57.4, 56.9, 59.2, 58.0, 58.7],
                borderColor: '#bf5af2',
                backgroundColor: 'rgba(191, 90, 242, 0.02)',
                borderWidth: 3,
                tension: 0.4,
                fill: true
            },
            {
                label: 'Setor de Cafeicultura',
                data: [65.0, 64.2, 63.8, 66.1, 65.4, 66.3],
                borderColor: '#0a84ff',
                backgroundColor: 'rgba(10, 132, 255, 0.02)',
                borderWidth: 3,
                tension: 0.4,
                fill: true
            }
        ]
    };

    // Opções de estilização interna do Chart.js
    const chartSettings = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                labels: {
                    color: '#94a3b8',
                    font: { family: 'Plus Jakarta Sans', size: 12, weight: '500' }
                }
            }
        },
        scales: {
            y: {
                grid: { color: 'rgba(255, 255, 255, 0.04)' },
                ticks: { color: '#94a3b8', font: { family: 'Plus Jakarta Sans' } }
            },
            x: {
                grid: { display: false },
                ticks: { color: '#94a3b8', font: { family: 'Plus Jakarta Sans' } }
            }
        }
    };

    // Instancia o gráfico global
    const agroChartInstance = new Chart(canvasContext.getContext('2d'), {
        type: 'line',
        data: datasetConfig,
        options: chartSettings
    });

    // Função de variação algorítmica para simular dados dinâmicos em tempo real
    function atualizarSensoresCampo() {
        const simulaUva = (Math.random() * (61.2 - 56.5) + 56.5).toFixed(1);
        const simulaCafe = (Math.random() * (68.5 - 63.2) + 63.2).toFixed(1);

        // Injeta os novos valores nos elementos de exibição numérica do HTML
        const uiUva = document.getElementById('kpi-uva');
        const uiCafe = document.getElementById('kpi-cafe');

        if (uiUva) uiUva.innerText = `${simulaUva}%`;
        if (uiCafe) uiCafe.innerText = `${simulaCafe}%`;

        // Modifica a última posição do array de dados do gráfico para gerar movimento
        agroChartInstance.data.datasets[0].data.shift();
        agroChartInstance.data.datasets[0].data.push(parseFloat(simulaUva));

        agroChartInstance.data.datasets[1].data.shift();
        agroChartInstance.data.datasets[1].data.push(parseFloat(simulaCafe));

        // Atualiza a interface gráfica de forma otimizada sem recarregar a página
        agroChartInstance.update('none');
    }

    // Inicializa a primeira leitura e define o intervalo de atualização para 4 segundos
    atualizarSensoresCampo();
    setInterval(atualizarSensoresCampo, 4000);
});