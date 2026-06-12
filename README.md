# 🌾 Agro-Preci IA — Gêmeo Digital Hidro-Responsivo (Agrinho 2026)

> **Município:** Rosário do Ivaí - PR  
> **Foco do Projeto:** Agricultura Familiar de Precisão, Sustentabilidade (ESG), IoT e Acessibilidade Cognitiva.  
> **Contexto:** Projeto desenvolvido para a categoria de Tecnologia/Inovação do Concurso Agrinho 2026.

---

## ⛰️ Justificativa e Impacto Regional

O município de Rosário do Ivaí - PR possui uma forte tradição na agricultura familiar, destacando-se na produção de **Uva Niágara** e **Café**. No entanto, a topografia predominantemente acidentada (relevo declivoso) da região impõe sérios desafios aos produtores locais:
1. **Erosão Hídrica:** Enxurradas severas em épocas de chuva forte lavam a camada fértil do solo.
2. **Lixiviação de Nutrientes:** O adubo aplicado (NPK) é arrastado pelas águas antes da absorção pelas plantas, gerando prejuízo financeiro e contaminação de rios.
3. **Escassez de Dados:** Pequenos produtores muitas vezes carecem de ferramentas acessíveis para prever e mitigar o estresse hídrico ou o excesso de umidade.

O **Agro-Preci IA** surge como uma resposta tecnológica viável, integrando hardware simulado de baixo custo e uma interface de software inteligente para proteger as encostas e potencializar a safra local.

---

## ⚙️ Como a Plataforma Funciona?

O sistema opera como um **Gêmeo Digital** conectado à propriedade através de quatro pilares integrados:

1. **Captura Telemétrica (LoRaWAN):** Sensores de umidade inseridos no solo das culturas enviam leituras constantes (simuladas a cada 3 segundos via JavaScript) alimentando os painéis de controle e gráficos de linhas (`Chart.js`).
2. **Zoneamento Óptico Orbital (NDVI):** Uma simulação de sensoriamento remoto via satélite permite ao produtor filtrar dados por cultura específica (Uva ou Café) e focar o alvo orbital no setor que necessita de intervenção.
3. **Tomada de Decisão Automatizada (IA):** Ao detectar que o solo atingiu o nível crítico de saturação hídrica (acima de 75% no simulador de precipitação), a IA **ativa emergencialmente as comportas de drenagem**, mitigando o escoamento superficial linear e a erosão.
4. **Acessibilidade e Conectividade Local:** O sistema conta com leitores de tela por voz (`Web Speech API`) para produtores com baixa alfabetização ou deficiência visual, além de expor as cotações financeiras em tempo real das cooperativas de Rosário do Ivaí.

---

## 🛠️ Tecnologias Utilizadas

Para garantir leveza, estabilidade e fácil distribuição, o projeto foi construído utilizando tecnologias web puras (*Vanilla Stack*):

* **HTML5:** Estruturação semântica de dados, tabelas de cotação e painéis IoT.
* **CSS3:** Design responsivo, arquitetura *Glassmorphism* para painéis escuros, animações de pulso para a telemetria orbital e suporte nativo ao **Modo Dia/Noite**.
* **JavaScript (ES6+):** Motor lógico do sistema. Gerencia os temporizadores dos sensores, gatilhos de IA para atuadores, cálculos de economia hídrica baseados em hectares e filtros de interface.
* **Chart.js:** Biblioteca externa em Javascript para renderização gráfica de alta performance da umidade do solo em tempo real.
* **Web Speech API:** Tecnologia nativa do navegador utilizada para sintetizar comandos de voz automáticos e alertas de engenharia do AgroBot.

---

## 📂 Estrutura de Arquivos

```text
├── index.html       # Estrutura de telas, introdução técnica e componentes ESG.
├── style.css        # Estilização completa, variáveis de cor e regras do modo claro.
├── script.js        # Lógica dos sensores, inteligência artificial, chatbot e voz.
└── README.md        # Documentação e defesa conceitual do projeto (Este arquivo).