/**
 * 1. URL DE CONEXÃO DIRETA (AJUSTADA)
 * CORREÇÃO CRUCIAL: Adicionamos ',brl' em 'vs_currencies'.
 * Sem isso, a API ignora o Real e o código exibe 'NaN'.
 */
const API_URL =
  "https://api.coingecko.com/api/v3/simple/price?vs_currencies=usd,brl&ids=bitcoin&x_cg_demo_api_key=CG-tYZVb6GJm6yTr3KD7RJm8ABs";

/**
 * 2. FUNÇÃO ASSÍNCRONA: fetchBitcoin
 * Gerencia a busca de dados sem travar a navegação do usuário.
 */
async function fetchBitcoin() {
  const dashboard = document.getElementById("dashboard");

  try {
    // Realiza a chamada para o servidor da CoinGecko
    const response = await fetch(API_URL);

    // TRATAMENTO DE ERRO: Verifica se a comunicação com o servidor foi bem-sucedida.
    if (!response.ok) throw new Error(`Erro na API: ${response.status}`);

    const data = await response.json();

    /**
     * 3. EXTRAÇÃO DE DADOS (DÓLAR E REAL)
     * Como a URL agora solicita 'usd,brl', ambos os valores estão disponíveis no JSON.
     */
    const btcUSD = data.bitcoin.usd;
    const btcBRL = data.bitcoin.brl;

    /**
     * 4. CONFIGURAÇÃO DE FORMATAÇÃO (PADRÃO BRASILEIRO)
     * 'pt-BR' garante o uso de PONTO para milhar e VÍRGULA para decimal.
     * 'minimumFractionDigits: 1' mantém o formato visual solicitado (ex: 348.625,0).
     */
    const formatador = new Intl.NumberFormat("pt-BR", {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    });

    // Aplicando a formatação profissional nos valores numéricos
    const btcUSD_fmt = formatador.format(btcUSD);
    const btcBRL_fmt = formatador.format(btcBRL);

    /**
     * 5. INJEÇÃO DE INTERFACE (UX/UI)
     * Montamos o card visual com os dados formatados.
     */
    dashboard.innerHTML = `
      <div class="crypto-card">
          <h3>Bitcoin (BTC)</h3>
          <div class="price-row">
              <!-- Cotação em Dólar: Destaque em Azul Neon (accent-color) -->
              <p class="price-brl" style="font-size: 2.2rem; color: var(--accent-color);">
                  $ ${btcUSD_fmt} <small style="font-size: 0.8rem">(BTC/USD)</small>
              </p>
              <!-- Cotação em Real: Estilo secundário com cor de texto padrão -->
              <p class="price-usd" style="font-size: 1.4rem; margin-top: 10px;">
                  R$ ${btcBRL_fmt} <small style="font-size: 0.7rem">(BTC/BRL)</small>
              </p>
          </div>
          <p style="color: var(--text-secondary); margin-top: 15px; font-size: 0.7rem;">
              Monitoramento em Tempo Real Ativo ✅
          </p>
      </div>
    `;
  } catch (error) {
    /**
     * 6. GESTÃO DE RESILIÊNCIA
     * Exibe erro amigável se a internet falhar ou o limite da API for atingido.
     */
    dashboard.innerHTML = `
      <div class="status-msg" style="color: var(--down-color)">
          ⚠️ Falha na Conexão <br>
          <small>O sistema tentará reconectar automaticamente em breve.</small>
      </div>
    `;
    console.error("Relatório Técnico:", error.message);
  }
}

// EXECUÇÃO INICIAL: Carrega os dados assim que a página é aberta
fetchBitcoin();

/**
 * 7. POLLING (ATUALIZAÇÃO CONTÍNUA)
 * Intervalo de 30 segundos (30000ms).
 * Mantém o dashboard "vivo" respeitando os limites do plano Demo.
 */
setInterval(fetchBitcoin, 30000);
