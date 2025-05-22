const amount = document.getElementById('amount');
const fromCurrency = document.getElementById('from-currency');
const toCurrency = document.getElementById('to-currency');
const result = document.getElementById('result');
const convertButton = document.getElementById('convert-button');
const swapButton = document.getElementById('swap-button');
const historyList = document.getElementById('history-list');

const API_KEY = '4feba4c1877d5f69d9014806';

// Variáveis para controle de paginação
let currentPage = 1;
const itemsPerPage = 10;
let cryptoData = [];

// Função para formatar números grandes
function formatNumber(num) {
    if (num >= 1e9) return (num / 1e9).toFixed(2) + ' B';
    if (num >= 1e6) return (num / 1e6).toFixed(2) + ' M';
    if (num >= 1e3) return (num / 1e3).toFixed(2) + ' K';
    return num.toFixed(2);
}

// Função para atualizar os dados das criptomoedas
async function updateCryptoData() {
    try {
        const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=true');
        cryptoData = await response.json();
        displayCryptoData();
    } catch (error) {
        console.error('Erro ao buscar dados:', error);
        document.getElementById('cripto-table-body').innerHTML = `
            <tr>
                <td colspan="7" class="error-message">
                    Erro ao carregar dados. Por favor, tente novamente mais tarde.
                </td>
            </tr>
        `;
    }
}

// Função para exibir os dados na tabela
function displayCryptoData() {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageData = cryptoData.slice(startIndex, endIndex);
    
    const tableBody = document.getElementById('cripto-table-body');
    tableBody.innerHTML = pageData.map((coin, index) => `
        <tr>
            <td>${startIndex + index + 1}</td>
            <td>
                <div class="cripto-name">
                    <img src="${coin.image}" alt="${coin.name}">
                    <div>
                        <div>${coin.name}</div>
                        <div class="cripto-symbol">${coin.symbol.toUpperCase()}</div>
                    </div>
                </div>
            </td>
            <td>$${coin.current_price.toFixed(2)}</td>
            <td class="${coin.price_change_percentage_24h >= 0 ? 'price-change-positive' : 'price-change-negative'}">
                ${coin.price_change_percentage_24h?.toFixed(2)}%
            </td>
            <td>$${formatNumber(coin.total_volume)}</td>
            <td>$${formatNumber(coin.market_cap)}</td>
            <td>
                <div class="mini-chart">
                    <canvas id="chart-${coin.symbol}" width="150" height="50"></canvas>
                </div>
            </td>
        </tr>
    `).join('');

    // Criar mini gráficos para cada moeda
    pageData.forEach(coin => {
        const ctx = document.getElementById(`chart-${coin.symbol}`).getContext('2d');
        const sparklineData = coin.sparkline_in_7d.price;
        const isPositive = coin.price_change_percentage_24h >= 0;
        
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: [...Array(sparklineData.length).keys()],
                datasets: [{
                    data: sparklineData,
                    borderColor: isPositive ? '#28a745' : '#dc3545',
                    borderWidth: 1.5,
                    fill: false,
                    pointRadius: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: { enabled: false }
                },
                scales: {
                    x: { display: false },
                    y: { display: false }
                },
                animation: false
            }
        });
    });

    // Atualizar informações da paginação
    document.getElementById('page-info').textContent = `Página ${currentPage} de ${Math.ceil(cryptoData.length / itemsPerPage)}`;
    document.getElementById('prev-page').disabled = currentPage === 1;
    document.getElementById('next-page').disabled = currentPage === Math.ceil(cryptoData.length / itemsPerPage);
}

// Adicionar event listeners para os botões de paginação
document.getElementById('prev-page').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        displayCryptoData();
    }
});

document.getElementById('next-page').addEventListener('click', () => {
    if (currentPage < Math.ceil(cryptoData.length / itemsPerPage)) {
        currentPage++;
        displayCryptoData();
    }
});

// Atualizar dados a cada 1 minuto
setInterval(updateCryptoData, 60000);
const CRYPTO_LIST = [
    'bitcoin', 'ethereum', 'tether', 'binancecoin', 'solana',
    'xrp', 'usdc', 'cardano', 'avalanche-2', 'dogecoin',
    'polkadot', 'tron', 'chainlink', 'polygon', 'shiba-inu',
    'dai', 'litecoin', 'bitcoin-cash', 'uniswap', 'stellar',
    'monero', 'okb', 'ethereum-classic', 'kaspa', 'cosmos',
    'hedera', 'filecoin', 'lido-dao', 'crypto-com-chain', 'near',
    'vechain', 'maker', 'optimism', 'arbitrum', 'algorand',
    'rocket-pool', 'the-graph', 'aave', 'quant', 'stacks',
    'theta-token', 'fantom', 'immutable', 'render-token', 'injective-protocol',
    'axie-infinity', 'gala', 'kava', 'curve-dao-token', 'neo',
    'thorchain', 'flow', 'mina-protocol', 'apecoin', 'decentraland',
    'conflux-token', 'gmx', 'synthetix-network-token', 'kucoin-shares', 'tezos',
    'eos', 'the-sandbox', 'iota', 'trust-wallet-token', 'compound-governance-token',
    'frax-share', 'arweave', 'pepe', 'woo-network', 'flare-networks',
    'pancakeswap-token', 'sui', 'dydx', 'zilliqa', 'dash',
    'gnosis', 'nexo', 'osmosis', 'zcash', '1inch',
    'waves', 'loopring', 'bitcoin-gold', 'basic-attention-token', 'fetch-ai',
    'singularitynet', 'enjincoin', 'golem', 'siacoin', 'ocean-protocol',
    'band-protocol', 'ankr', 'cartesi', 'audius', 'livepeer',
    'api3', 'storj', 'nkn', 'numeraire', 'radicle',
    'balancer', 'kyber-network', 'origintrail', 'swissborg', 'skale'
];

const FIAT_CURRENCIES = [
    { code: 'USD', name: 'Dólar Americano' },
    { code: 'EUR', name: 'Euro' },
    { code: 'BRL', name: 'Real Brasileiro' },
    { code: 'GBP', name: 'Libra Esterlina' },
    { code: 'JPY', name: 'Iene Japonês' },
    { code: 'AUD', name: 'Dólar Australiano' },
    { code: 'CAD', name: 'Dólar Canadense' },
    { code: 'CHF', name: 'Franco Suíço' },
    { code: 'CNY', name: 'Yuan Chinês' },
    { code: 'NZD', name: 'Dólar Neozelandês' }
];

function isCrypto(currency) {
    return CRYPTO_LIST.includes(currency.toLowerCase());
}

function populateCurrencySelects() {
    const selects = [fromCurrency, toCurrency];
    
    selects.forEach(select => {
        select.innerHTML = '';
        
        const fiatGroup = document.createElement('optgroup');
        fiatGroup.label = 'Moedas Tradicionais';
        FIAT_CURRENCIES.forEach(currency => {
            const option = document.createElement('option');
            option.value = currency.code;
            option.textContent = `${currency.code} - ${currency.name}`;
            fiatGroup.appendChild(option);
        });
        select.appendChild(fiatGroup);
        
        const cryptoGroup = document.createElement('optgroup');
        cryptoGroup.label = 'Criptomoedas';
        CRYPTO_LIST.forEach(crypto => {
            const option = document.createElement('option');
            option.value = crypto;
            option.textContent = `${crypto.toUpperCase()} - ${crypto.charAt(0).toUpperCase() + crypto.slice(1)}`;
            cryptoGroup.appendChild(option);
        });
        select.appendChild(cryptoGroup);
    });

    // Set default values
    fromCurrency.value = 'USD';
    toCurrency.value = 'BRL';
}

function addToHistory(from, to, amount, result) {
    if (!historyList) return;

    const date = new Date().toLocaleString();
    
    const historyItem = document.createElement('div');
    historyItem.className = 'history-item';
    historyItem.innerHTML = `
        <span>${amount} ${from} = ${result} ${to}<br>
        <small>${date}</small></span>
        <span class="delete-history">×</span>
    `;

    historyItem.querySelector('.delete-history').addEventListener('click', () => {
        historyItem.remove();
        saveHistoryToLocalStorage();
    });

    historyList.insertBefore(historyItem, historyList.firstChild);
    saveHistoryToLocalStorage();
}

function saveHistoryToLocalStorage() {
    if (!historyList) return;
    localStorage.setItem('conversionHistory', historyList.innerHTML);
}

function loadHistoryFromLocalStorage() {
    if (!historyList) return;
    const savedHistory = localStorage.getItem('conversionHistory');
    if (savedHistory) {
        historyList.innerHTML = savedHistory;
        document.querySelectorAll('.delete-history').forEach(button => {
            button.addEventListener('click', () => {
                button.parentElement.remove();
                saveHistoryToLocalStorage();
            });
        });
    }
}

async function shareConversion() {
    const text = `${amount.value} ${fromCurrency.value} = ${result.value} ${toCurrency.value}`;
    
    try {
        if (navigator.share) {
            await navigator.share({
                title: 'Conversão de Moeda',
                text: text,
                url: window.location.href
            });
        } else {
            await navigator.clipboard.writeText(text);
            alert('Resultado copiado para a área de transferência!');
        }
    } catch (error) {
        console.error('Erro ao compartilhar:', error);
    }
}

async function convertCurrency() {
    if (!amount.value || isNaN(amount.value)) {
        alert('Por favor, digite um valor válido!');
        return;
    }

    convertButton.classList.add('loading');

    try {
        const fromIsCrypto = isCrypto(fromCurrency.value);
        const toIsCrypto = isCrypto(toCurrency.value);

        if (fromIsCrypto && toIsCrypto) {
            // Crypto to Crypto
            const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${fromCurrency.value},${toCurrency.value}&vs_currencies=usd`);
            const data = await response.json();
            const fromUSD = data[fromCurrency.value].usd;
            const toUSD = data[toCurrency.value].usd;
            const rate = fromUSD / toUSD;
            result.value = (amount.value * rate).toFixed(8);
        } else if (fromIsCrypto) {
            // Crypto to Fiat
            const cryptoResponse = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${fromCurrency.value}&vs_currencies=usd`);
            const cryptoData = await cryptoResponse.json();
            const usdValue = cryptoData[fromCurrency.value].usd * amount.value;
            
            const fiatResponse = await fetch(`https://v6.exchangerate-api.com/v6/${API_KEY}/latest/USD`);
            const fiatData = await fiatResponse.json();
            const finalRate = fiatData.conversion_rates[toCurrency.value];
            result.value = (usdValue * finalRate).toFixed(2);
        } else if (toIsCrypto) {
            // Fiat to Crypto
            const fiatResponse = await fetch(`https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${fromCurrency.value}`);
            const fiatData = await fiatResponse.json();
            const usdAmount = amount.value / fiatData.conversion_rates['USD'];
            
            const cryptoResponse = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${toCurrency.value}&vs_currencies=usd`);
            const cryptoData = await cryptoResponse.json();
            const cryptoRate = 1 / cryptoData[toCurrency.value].usd;
            result.value = (usdAmount * cryptoRate).toFixed(8);
        } else {
            // Fiat to Fiat
            const response = await fetch(`https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${fromCurrency.value}`);
            const data = await response.json();
            const rate = data.conversion_rates[toCurrency.value];
            result.value = (amount.value * rate).toFixed(2);
        }

        addToHistory(
            fromCurrency.value,
            toCurrency.value,
            amount.value,
            result.value
        );

    } catch (error) {
        alert('Erro ao converter. Tente novamente mais tarde.');
        console.error(error);
    } finally {
        convertButton.classList.remove('loading');
    }
}

function swapCurrencies() {
    const temp = fromCurrency.value;
    fromCurrency.value = toCurrency.value;
    toCurrency.value = temp;
    if (amount.value !== '') {
        convertCurrency();
    }
}

// Event Listeners
convertButton.addEventListener('click', convertCurrency);
swapButton.addEventListener('click', swapCurrencies);
document.getElementById('share-button').addEventListener('click', shareConversion);
amount.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') convertCurrency();
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    populateCurrencySelects();
    loadHistoryFromLocalStorage();
});