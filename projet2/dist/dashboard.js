import { interval, merge, of } from 'rxjs';
import { map, filter, scan, startWith, switchMap } from 'rxjs/operators';
class MonitoringDashboard {
    metrics = {
        cpu: 0,
        memory: 0,
        network: 0,
        disk: 0
    };
    simulateMetric(metricName) {
        return interval(1000 + Math.random() * 2000).pipe(map(() => {
            const change = Math.random() * 20 - 10;
            this.metrics[metricName] = Math.max(0, Math.min(100, this.metrics[metricName] + change));
            return { metric: metricName, value: Math.round(this.metrics[metricName]) };
        }));
    }
    createeAlerts() {
        return interval(5000).pipe(map(() => {
            const alerts = [];
            if (this.metrics.cpu > 85)
                alerts.push('CPU usage high!');
            if (this.metrics.memory > 90)
                alerts.push('Memory usage critical');
            if (this.metrics.network > 80)
                alerts.push('Network traffic high');
            return alerts;
        }), filter(alerts => alerts.length > 0));
    }
    createDashboard() {
        const cpu$ = this.simulateMetric('cpu');
        const memory$ = this.simulateMetric('memory');
        const network$ = this.simulateMetric('network');
        const disk$ = this.simulateMetric('disk');
        return merge(cpu$, memory$, network$, disk$).pipe(scan((acc, metric) => ({
            ...acc,
            [metric.metric]: metric.value
        }), { cpu: 0, memory: 0, network: 0, disk: 0 }), startWith({ cpu: 0, memory: 0, network: 0, disk: 0 }));
    }
}
const dashboard = new MonitoringDashboard();
const monitoring$ = dashboard.createDashboard();
monitoring$.subscribe(metrics => {
    console.clear();
    console.log('CPU : ' + metrics.cpu + '%');
    console.log('Memory : ' + metrics.memory + '%');
    console.log('Network : ' + metrics.network + '%');
    console.log('Disk : ' + metrics.disk + '%');
});
dashboard.createeAlerts().subscribe(alerts => {
    console.log('Alertes : ', alerts);
});
//# sourceMappingURL=dashboard.js.map