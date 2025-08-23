import { interval, fromEvent, combineLatest, BehaviorSubject, of, merge } from "rxjs";
import { map, scan, tap, startWith, switchMap, takeWhile, filter, distinctUntilChanged, bufferTime } from "rxjs/operators";
import Chart from "chart.js/auto";
const CONFIG = {
    updateInterval: 1000,
    maxDataPoints: 50,
    alertThresholds: {
        priceChange: 2,
        volumeSpike: 150,
        trendDuration: 5
    }
};
const initialStocks = [
    { symbol: 'AAPL', price: 150.75, change: 0, volume: 1000000, timestamp: new Date() },
    { symbol: 'GOOGL', price: 2800.50, change: 0, volume: 500000, timestamp: new Date() },
    { symbol: 'TSLA', price: 750.50, change: 0, volume: 750000, timestamp: new Date() },
    { symbol: 'MSFT', price: 250.25, change: 0, volume: 800000, timestamp: new Date() },
];
const portfolio = [
    { symbol: 'AAPL', quantity: 10, avgPrice: 150.75 },
    { symbol: 'GOOGL', quantity: 5, avgPrice: 2800.50 },
    { symbol: 'TSLA', quantity: 20, avgPrice: 750.50 },
];
class StockSimulator {
    stocks$ = new BehaviorSubject(initialStocks);
    alerts$ = new BehaviorSubject([]);
    createStockStream(symbol, initialPrice, initialVolume) {
        return interval(CONFIG.updateInterval).pipe(scan((acc) => {
            const change = (Math.random() - 0.5) * 3;
            const newPrice = acc.price * (1 + change / 100);
            const newVolume = initialVolume * (0.7 + Math.random() * 0.6);
            return {
                ...acc,
                timestamp: new Date(),
                price: Number(newPrice.toFixed(2)),
                change: Number(((newPrice - initialPrice) / initialPrice * 100).toFixed(2)),
                volume: Math.floor(newVolume)
            };
        }, {
            symbol,
            price: initialPrice,
            change: 0,
            volume: initialVolume,
            timestamp: new Date()
        }));
    }
    simulateMarket() {
        const streams = initialStocks.map(stock => this.createStockStream(stock.symbol, stock.price, stock.volume));
        return combineLatest(streams).pipe(map(stocks => stocks.sort((a, b) => a.symbol.localeCompare(b.symbol))), tap(stocks => this.stocks$.next(stocks)), tap(stocks => this.checkAlerts(stocks)));
    }
    checkAlerts(stocks) {
        const newAlerts = [];
        stocks.forEach(stock => {
            if (Math.abs(stock.change) > CONFIG.alertThresholds.priceChange) {
                newAlerts.push({
                    type: 'price',
                    message: `${stock.symbol} : ${stock.change > 0 ? '↑' : '↓'} ${Math.abs(stock.change)}%`,
                    symbol: stock.symbol,
                    value: stock.change,
                    timestamp: new Date(),
                    severity: stock.change > 5 ? 'critical' : 'warning'
                });
            }
            const avgVolume = initialStocks.find(s => s.symbol === stock.symbol)?.volume || 0;
            if (stock.volume > avgVolume * (CONFIG.alertThresholds.volumeSpike / 100)) {
                newAlerts.push({
                    type: 'volume',
                    message: `${stock.symbol} : Volume anormal (${stock.volume.toLocaleString()})`,
                    symbol: stock.symbol,
                    value: stock.volume,
                    timestamp: new Date(),
                    severity: 'warning'
                });
            }
        });
        if (newAlerts.length > 0) {
            this.alerts$.next([...this.alerts$.value, ...newAlerts].slice(-10));
        }
    }
    addRandomStock() {
        const newSymbols = ['AMZN', 'NVDA', 'META', 'NFLX', 'BTC-USD'];
        const symbol = newSymbols[Math.floor(Math.random() * newSymbols.length)];
        console.log("symbol generated -> ", symbol);
        const price = 100 + Math.random() * 500;
        const volume = Math.floor(Math.random() * 800000);
        const newStock = this.createStockStream(symbol, price, volume);
        newStock.pipe(takeWhile((_, index) => index < 20)).subscribe(latest => {
            const currentStockes = this.stocks$.value;
            if (!currentStockes.find(s => s.symbol === symbol)) {
                this.stocks$.next([...currentStockes, latest]);
            }
        });
    }
    getStocks() {
        return this.stocks$.asObservable();
    }
    getAlerts() {
        return this.alerts$.asObservable();
    }
}
class FinancialDashboard {
    simulator = new StockSimulator();
    charts = {};
    initialize() {
        this.initCharts();
        this.setupEventListeners();
        this.startSimulation();
    }
    initCharts() {
        this.charts.price = new Chart('priceChart', {
            type: 'line',
            data: {
                labels: [],
                datasets: initialStocks.map((stock, i) => ({
                    label: stock.symbol,
                    data: [],
                    borderColor: `hsl(${i * 90}, 70%, 50%)`,
                    tension: 0.1,
                    borderWidth: 2,
                }))
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: {
                    duration: 0
                }
            }
        });
        this.charts.portfolio = new Chart('portfolioChart', {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                        label: 'Valeur Portfolio',
                        data: [],
                        borderColor: 'rgba(75, 192, 192, 1)',
                        backgroundColor: 'rgba(75, 192, 192, 0.1)',
                        fill: true,
                        tension: 0.1,
                    }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
        this.charts.volume = new Chart('volumeChart', {
            type: 'bar',
            data: {
                labels: initialStocks.map(s => s.symbol),
                datasets: [{
                        label: 'Volume',
                        data: initialStocks.map(s => s.volume),
                        backgroundColor: 'rgba(153, 102, 255, 0.6)',
                    }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
            }
        });
    }
    setupEventListeners() {
        fromEvent(document.getElementById('addStockBtn'), 'click').subscribe(() => {
            this.simulator.addRandomStock();
        });
        fromEvent(document.getElementById('speedSelect'), 'change').subscribe((event) => {
            CONFIG.updateInterval = Number(event.target.value);
        });
    }
    startSimulation() {
        this.simulator.simulateMarket().subscribe(stocks => {
            this.updateStockDisplay(stocks);
            this.updateCharts(stocks);
            this.updatePortfolio(stocks);
        });
        this.simulator.getAlerts().subscribe(alerts => {
            this.updateAlerts(alerts);
        });
    }
    updateStockDisplay(stocks) {
        const container = document.getElementById('stocksContainer');
        container.innerHTML = '';
        stocks.forEach(stock => {
            const changeClass = stock.change >= 0 ? 'positive' : 'negative';
            const changeIcon = stock.change >= 0 ? '↑' : '↓';
            container.innerHTML += `
            <div class="stock-item">
                <span class="stock-symbol">${stock.symbol}</span>
                <span class="stock-price">$${stock.price.toFixed(2)}</span>
                <span class="stock-change ${changeClass}">
                    ${changeIcon} ${stock.change > 0 ? '+' : ''} ${stock.change.toFixed(2)}%
                </span>
            </div>
            `;
        });
    }
    updateCharts(stocks) {
        if (!this.charts?.price?.data?.datasets) {
            console.warn('Le graphique des prix n\'est pas correctement initialisé');
            return;
        }
        const now = new Date().toLocaleTimeString();
        stocks.forEach((stock, index) => {
            if (this.charts.price.data.datasets[index]) {
                this.charts.price.data.datasets[index].data.push(stock.price);
            }
        });
        this.charts.price.data.labels.push(now);
        if (this.charts.price.data.labels.length > CONFIG.maxDataPoints) {
            this.charts.price.data.labels.shift();
            this.charts.price.data.datasets.forEach((dataset) => {
                dataset.data.shift();
            });
        }
        this.charts.price.update('none');
        this.charts.volume.data.datasets[0].data = stocks.map(stock => stock.volume);
        this.charts.volume.data.labels = stocks.map(s => s.symbol);
        this.charts.volume.update('none');
    }
    updatePortfolio(stocks) {
        const totalValue = stocks.reduce((total, stock) => {
            const holding = portfolio.find(p => p.symbol === stock.symbol);
            return total + (holding ? stock.price * holding.quantity : 0);
        }, 0);
        const initialValue = portfolio.reduce((total, holding) => {
            const initialStock = initialStocks.find(s => s.symbol === holding.symbol);
            return total + (initialStock ? initialStock.price * holding.quantity : 0);
        }, 0);
        const change = ((totalValue - initialValue) / initialValue) * 100;
        document.getElementById('portfolioValue').textContent = `€${totalValue.toLocaleString('fr-FR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })}`;
        const changeElement = document.getElementById('portfolioChange');
        changeElement.textContent = `${change > 0 ? '+' : ''}${change.toFixed(2)}%`;
        changeElement.className = change > 0 ? 'positive' : 'negative';
        this.charts.portfolio.data.labels.push(new Date().toLocaleTimeString());
        this.charts.portfolio.data.datasets[0].data.push((totalValue));
        if (this.charts.portfolio.data.labels.length > 20) {
            this.charts.portfolio.data.labels.shift();
            this.charts.portfolio.data.datasets[0].data.shift();
        }
        this.charts.portfolio.update('none');
    }
    updateAlerts(alerts) {
        const container = document.getElementById('alertsContainer');
        if (alerts.length === 0) {
            container.innerHTML = '<div class="alert">Aucune alerte pour le moment</div>';
            return;
        }
        container.innerHTML = alerts.slice(-5).reverse().map(alert => `
            <div class="alert ${alert.severity}">
                <strong>${alert.timestamp.toLocaleTimeString()}</strong>
                ${alert.message}
            </div>
            
        `).join('');
    }
}
document.addEventListener('DOMContentLoaded', () => {
    const dashboard = new FinancialDashboard();
    dashboard.initialize();
});
//# sourceMappingURL=main.js.map