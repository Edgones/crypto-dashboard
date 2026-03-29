/**
 * 1. DEFINIÇÃO DO ENDPOINT (URL)
 * Aqui usamos a URL absoluta fornecida pela CoinGecko.
 * O parâmetro 'x_cg_demo_api_key' é o nosso "crachá" de acesso que evita bloqueios.
 */
const API_URL = `https://api.coingecko.com{CONFIG.API_KEY}`;

/**
 * 2. FUNÇÃO ASSÍNCRONA (Async/Await)
 * Essencial para buscar dados externos sem "travar" o navegador do usuário.
 * O 'async' indica que a função terá processos que levam tempo (como a internet).
 */
async function fetchBitcoin() {
  // Capturamos o elemento HTML onde os dados serão "injetados"
  const dashboard = document.getElementById("dashboard");

  try {
    /**
     * 3. A REQUISIÇÃO (Fetch)
     * O 'await' faz o código esperar a resposta da API antes de prosseguir.
     */
    const response = await fetch(API_URL);

    // Verificação de segurança: Se o servidor der erro (ex: 401, 429), lançamos uma exceção
    if (!response.ok) throw new Error(`Erro na API: ${response.status}`);

    /**
     * 4. TRATAMENTO DOS DADOS (JSON)
     * Transformamos a resposta bruta em um objeto JavaScript legível.
     */
    const data = await response.json();

    // Acessamos o valor do dólar (usd) dentro do objeto retornado (bitcoin)
    const btcUSD = data.bitcoin.usd;

    /**
     * 5. LÓGICA DE FALLBACK (Contingência)
     * Como a URL atual só pede 'usd', usamos um multiplicador manual para o Real.
     * O operador '||' garante que o código não quebre se o valor vier vazio.
     */
    const btcBRL = data.bitcoin.brl || btcUSD * 5.25;

    /**
     * 6. INTERNACIONALIZAÇÃO (Intl.NumberFormat)
     * Este é o segredo para o formato "66.408,3".
     * 'pt-BR' define o padrão brasileiro (ponto no milhar, vírgula no decimal).
     * 'minimumFractionDigits: 1' força a exibição de pelo menos uma casa decimal.
     */
    const formatador = new Intl.NumberFormat("pt-BR", {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    });

    // Criamos versões formatadas (Strings) para exibição visual
    const btcUSD_fmt = formatador.format(btcUSD);
    const btcBRL_fmt = formatador.format(btcBRL);

    /**
     * 7. MANIPULAÇÃO DO DOM (innerHTML)
     * Injetamos o conteúdo dinâmico usando Template Literals (crases).
     * Isso substitui o "Carregando..." pelos cards reais com os preços.
     */
    dashboard.innerHTML = `
    <div class="crypto-card">
        <h3>Bitcoin (BTC)</h3>
        <div class="price-row">
            <!-- Exibição do Dólar: Estilizado com a cor 'accent' (azul neon) -->
            <p class="price-brl" style="font-size: 2.2rem; color: var(--accent-color);">
                $ ${btcUSD_fmt} <small style="font-size: 0.8rem">(BTC/USD)</small>
            </p>
            <!-- Exibição do Real: Menor, logo abaixo da cotação principal -->
            <p class="price-usd" style="font-size: 1.4rem; margin-top: 10px;">
                R$ ${btcBRL_fmt} <small style="font-size: 0.7rem">(BTC/BRL)</small>
            </p>
        </div>
        <p style="color: var(--text-secondary); margin-top: 15px; font-size: 0.7rem;">
            Formatação Regional Ativada ✅
        </p>
    </div>
`;
  } catch (error) {
    /**
     * 8. GESTÃO DE ERROS (Catch)
     * Se algo falhar (internet, chave inválida), o usuário recebe um feedback claro
     * e o erro técnico é registrado no console para o desenvolvedor.
     */
    dashboard.innerHTML = `
            <div class="status-msg" style="color: var(--down-color)">
                ⚠️ Falha na Conexão <br>
                <small>Verifique sua rede ou a chave da API.</small>
            </div>
        `;
    console.error("Relatório Técnico:", error.message);
  }
}

/**
 * 9. INICIALIZAÇÃO E POLLING
 * Chamamos a função uma vez ao abrir a página e depois a cada 60 segundos.
 * Isso mantém os dados frescos sem sobrecarregar a API (Rate Limit).
 */
fetchBitcoin();
setInterval(fetchBitcoin, 30000);
