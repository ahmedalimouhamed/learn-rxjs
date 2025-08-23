import { fromEvent, of, combineLatest, switchMap, map, startWith } from 'rxjs';
import Chart from 'chart.js/auto';
const salesData = {
    "2020": [
        { month: "Jan", sales: 200, revenue: 5000 },
        { month: "Feb", sales: 150, revenue: 4500 },
        { month: "Mar", sales: 250, revenue: 6000 },
        { month: "Apr", sales: 300, revenue: 7500 },
        { month: "May", sales: 350, revenue: 8000 },
        { month: "Jun", sales: 400, revenue: 9000 },
        { month: "Jul", sales: 450, revenue: 10000 },
        { month: "Aug", sales: 500, revenue: 11000 },
        { month: "Sep", sales: 550, revenue: 12000 },
        { month: "Oct", sales: 600, revenue: 13000 },
        { month: "Nov", sales: 650, revenue: 14000 },
        { month: "Dec", sales: 700, revenue: 15000 }
    ],
    "2021": [
        { month: "Jan", sales: 220, revenue: 5500 },
        { month: "Feb", sales: 180, revenue: 5000 },
        { month: "Mar", sales: 280, revenue: 6500 },
        { month: "Apr", sales: 320, revenue: 7800 },
        { month: "May", sales: 380, revenue: 8500 },
        { month: "Jun", sales: 420, revenue: 9500 },
        { month: "Jul", sales: 480, revenue: 10500 },
        { month: "Aug", sales: 520, revenue: 11500 },
        { month: "Sep", sales: 580, revenue: 12500 },
        { month: "Oct", sales: 620, revenue: 13500 },
        { month: "Nov", sales: 680, revenue: 14500 },
        { month: "Dec", sales: 720, revenue: 15500 }
    ],
    "2022": [
        { month: "Jan", sales: 240, revenue: 5800 },
        { month: "Feb", sales: 200, revenue: 5200 },
        { month: "Mar", sales: 300, revenue: 6800 },
        { month: "Apr", sales: 340, revenue: 8000 },
        { month: "May", sales: 400, revenue: 8800 },
        { month: "Jun", sales: 440, revenue: 9800 },
        { month: "Jul", sales: 500, revenue: 10800 },
        { month: "Aug", sales: 540, revenue: 11800 },
        { month: "Sep", sales: 600, revenue: 12800 },
        { month: "Oct", sales: 640, revenue: 13800 },
        { month: "Nov", sales: 700, revenue: 14800 },
        { month: "Dec", sales: 750, revenue: 15800 }
    ],
    "2023": [
        { month: "Jan", sales: 260, revenue: 6000 },
        { month: "Feb", sales: 220, revenue: 5500 },
        { month: "Mar", sales: 320, revenue: 7000 },
        { month: "Apr", sales: 360, revenue: 8200 },
        { month: "May", sales: 420, revenue: 9000 },
        { month: "Jun", sales: 460, revenue: 10000 },
        { month: "Jul", sales: 520, revenue: 11000 },
        { month: "Aug", sales: 560, revenue: 12000 },
        { month: "Sep", sales: 620, revenue: 13000 },
        { month: "Oct", sales: 660, revenue: 14000 },
        { month: "Nov", sales: 720, revenue: 15000 },
        { month: "Dec", sales: 780, revenue: 16000 }
    ],
    "2024": [
        { month: "Jan", sales: 200, revenue: 5000 },
        { month: "Feb", sales: 150, revenue: 4500 },
        { month: "Mar", sales: 250, revenue: 6000 },
        { month: "Apr", sales: 300, revenue: 7500 },
        { month: "May", sales: 350, revenue: 8000 },
        { month: "Jun", sales: 400, revenue: 9000 },
        { month: "Jul", sales: 450, revenue: 10000 },
        { month: "Aug", sales: 500, revenue: 11000 },
        { month: "Sep", sales: 550, revenue: 12000 },
        { month: "Oct", sales: 600, revenue: 13000 },
        { month: "Nov", sales: 650, revenue: 14000 },
        { month: "Dec", sales: 700, revenue: 15000 }
    ]
};
try {
    // Get DOM elements
    const yearSelect = document.getElementById('yearSelect');
    const salesCtx = document.getElementById('salesChart');
    const revenueCtx = document.getElementById('revenueChart');
    // Initialize charts with proper typing
    const salesChart = new Chart(salesCtx, {
        type: 'bar',
        data: {
            labels: [],
            datasets: [{
                    label: 'Ventes',
                    data: [],
                    backgroundColor: 'rgba(75, 192, 192, 0.6)',
                    borderWidth: 1
                }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
    const revenueChart = new Chart(revenueCtx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                    label: 'Revenu (€)',
                    data: [],
                    backgroundColor: 'rgba(75, 192, 192, 0.1)',
                    fill: true,
                    tension: 0.4
                }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
    // Update chart data with proper typing
    const updateCharts = (data) => {
        if (!data || !data.length)
            return;
        const months = data.map(d => d.month);
        const sales = data.map(d => d.sales);
        const revenue = data.map(d => d.revenue);
        // Update sales chart
        if (salesChart?.data) {
            salesChart.data.labels = months;
            if (salesChart.data.datasets[0]) {
                salesChart.data.datasets[0].data = sales;
            }
            salesChart.update();
        }
        // Update revenue chart
        if (revenueChart?.data) {
            revenueChart.data.labels = months;
            if (revenueChart.data.datasets[0]) {
                revenueChart.data.datasets[0].data = revenue;
            }
            revenueChart.update();
        }
    };
    // Create observable for year changes
    const yearChange$ = fromEvent(yearSelect, 'change').pipe(map(() => yearSelect.value));
    // Combine initial value with changes and handle data updates
    yearChange$.pipe(startWith(yearSelect.value), map(year => salesData[year])).subscribe({
        next: updateCharts,
        error: (err) => {
            console.error('Error in subscription:', err);
        }
    });
}
catch (error) {
    console.error('Initialization error:', error);
    if (error instanceof Error) {
        alert(`Initialization error: ${error.message}`);
    }
    else {
        alert('An unknown error occurred during initialization');
    }
}
//# sourceMappingURL=main.js.map