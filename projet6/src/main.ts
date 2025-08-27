import {interval, fromEvent, combineLatest, BehaviorSubject, of, merge} from 'rxjs';

import {map, scan, startWith, switchMap, takeWhile, filter, distinctUntilChanged, bufferTime, tap} from 'rxjs/operators';
import Chart from 'chart.js/auto';

interface SensorData {
    id: string;
    name: string;
    type: 'temperature' | 'humidity' | 'pressure' | 'motion';
    value: number;
    unit: string;
    battery: number;
    location: {x: number, y: number};
    status: 'normal' | 'warning' | 'critical';
    timestamp: Date;
}

interface Alert{
    id: string;
    type: 'battery' | 'value' | 'connection';
    message: string;
    sensorId: string;
    severity: 'info' | 'warning' | 'critical';
    timestamp: Date;
    resolved: boolean;
}

interface SystemMetrics{
    activeSensors: number;
    avgTemperature: number;
    maxTemperature: number;
    minTemperature: number;
    avgHumidity: number;
    avgBattery: number;
    dataRate: number;
    alertsCount: number;
}



const CONFIG = {
    updateInterval: 2000,
    maxDataPoints: 30,
    alertThresholds: {
        temperature: {min: 18, max: 28},
        humidity: {min: 30, max: 70},
        battery: 20,
        dataInterval: 10000
    },
    sensorTypes: ['temperature', 'humidity', 'pressure', 'motion'] as const,
    locations: ['Salle Serveurs', 'Bureau 101', 'Couloir Principal', 'Cuisine', 'Extérieur', 'Entrepôt', 'Labo R&D'] 
};

const initialSensors: SensorData[] = [
    {
        id: 'sensor-1',
        name: 'Temperature Sereur',
        type: 'temperature',
        value: 22.5,
        unit: '°C',
        battery: 85,
        location: {x: 30, y: 40},
        status: 'normal',
        timestamp: new Date()
    },
    {
        id: 'sensor-2',
        name: 'Humidité Bureau',
        type: 'humidity',
        value: 45,
        unit: '%',
        battery: 92,
        location: {x: 70, y: 20},
        status: 'normal',
        timestamp: new Date()
    },
    {
        id: 'sensor-3',
        name: 'Pression Atmosphérique',
        type: 'pressure',
        value: 1013,
        unit: 'hPa',
        battery: 78,
        location: {x: 50, y: 60},
        status: 'normal',
        timestamp: new Date()
    }
];

class IoTSimulator {
    private sensors$ = new BehaviorSubject<SensorData[]>(initialSensors);
    private alerts$ = new BehaviorSubject<Alert[]>([]);
    private metrics$ = new BehaviorSubject<SystemMetrics>({
        activeSensors: 0,
        avgTemperature: 0,
        maxTemperature: 0,
        minTemperature: 0,
        avgHumidity: 0,
        avgBattery: 0,
        dataRate: 0,
        alertsCount: 0
    });

    private dataPoints: number = 0;
    private lastUpdate: number = Date.now();

    createSensorStream(sensor: SensorData){
        return interval(CONFIG.updateInterval + Math.random() * 1000).pipe(
            scan((acc, sensorData) => {
                const noise = (Math.random() - 0.5) * 2;
                let newValue = acc.value;

                switch(acc.type){
                    case 'temperature':
                        newValue = this.addNoise(acc.value, 0.5, 12, 32);  // Plage réduite pour rester dans les seuils
                        break;
                    case 'humidity': 
                        newValue = this.addNoise(acc.value, 2, 20, 80);
                        break;
                    case 'pressure': 
                        newValue = this.addNoise(acc.value, 1, 980, 1020);
                        break;
                    case 'motion': 
                        newValue = Math.random() > 0.8 ? 1 : 0;
                        break;
                }

                const newBattery = Math.max(0, acc.battery - (0.1 + Math.random() * 0.2));

                return {
                    ...acc,
                    value: Number(newValue.toFixed(1)),
                    battery: Number(newBattery.toFixed(1)),
                    status: this.calculateStatus(acc.type, newValue, newBattery),
                    timestamp: new Date()
                }
            }, sensor)
        )
    }

    private addNoise(value: number, amplitude: number, min: number, max: number): number{
        const noise = (Math.random() - 0.5) * amplitude;
        return Math.min(max, Math.max(min, value + noise));
    }

    private calculateStatus(type: string, value: number, battery: number): 'normal' | 'warning' | 'critical'{
        if(battery < 10) return 'critical';
        if(battery < CONFIG.alertThresholds.battery) return 'warning';

        switch(type){
            case 'temperature':
                if(value < 10 || value > 35) return 'critical'; 
                if(value < CONFIG.alertThresholds.temperature.min || 
                   value > CONFIG.alertThresholds.temperature.max) return 'warning';
                break;
            case 'humidity':
                if(value < 10 || value > 90) return 'critical';
                if(value < CONFIG.alertThresholds.humidity.min || value > CONFIG.alertThresholds.humidity.max) return 'warning';
                break;
        }
        return 'normal';
    }

    simulateNetwork(){
        const streams = initialSensors.map(sensor => 
            this.createSensorStream(sensor)
        );

        return combineLatest(streams).pipe(
            tap(sensors => {
                this.sensors$.next(sensors);
                this.checkAlerts(sensors);
                this.updateMetrics(sensors);
                this.dataPoints += sensors.length;
            })
        );
    }

    private checkAlerts(sensors: SensorData[]){
        const newAlerts: Alert[] = [];

        sensors.forEach(sensor => {
            if(sensor.battery < CONFIG.alertThresholds.battery){
                newAlerts.push({
                    id: `battery-${sensor.id}-${Date.now()}`,
                    type: 'battery',
                    message: `${sensor.name} : Batterie faible (${sensor.battery}%)`,
                    sensorId: sensor.id,
                    severity: sensor.battery < 10 ? 'critical' : 'warning',
                    timestamp: new Date(),
                    resolved: false
                });
            }

            if(sensor.status !== 'normal'){
                newAlerts.push({
                    id: `value-${sensor.id}-${Date.now()}`,
                    type: 'value',
                    message: `${sensor.name} : ${sensor.value}${sensor.unit} (${sensor.status})`,
                    sensorId: sensor.id,
                    severity: sensor.status === 'critical' ? 'critical' : 'warning',
                    timestamp: new Date(),
                    resolved: false
                })
            }
        })

        if(newAlerts.length > 0){
            this.alerts$.next([...this.alerts$.value, ...newAlerts].slice(-20));
        }
    }

    private updateMetrics(sensors: SensorData[]){
        const now = Date.now();
        const timeDiff = (now - this.lastUpdate) / 1000;
        const dataRate = timeDiff > 0 ? this.dataPoints / timeDiff : 0; 

        const tempSensors = sensors.filter(s => s.type === 'temperature');
        const humiditySensors = sensors.filter(s => s.type === 'humidity');

        this.metrics$.next({
            activeSensors : sensors.length,
            avgTemperature: tempSensors.length ? Number((tempSensors.reduce((sum, s) => sum + s.value, 0) / tempSensors.length).toFixed(1)) : 0,
            maxTemperature: tempSensors.length ? Number((tempSensors.reduce((sum, s) => Math.max(sum, s.value), -Infinity)).toFixed(1)) : 0,
            minTemperature: tempSensors.length ? Number((tempSensors.reduce((sum, s) => Math.min(sum, s.value), Infinity)).toFixed(1)) : 0,
            avgHumidity: humiditySensors.length ? Number((humiditySensors.reduce((sum, s) => sum + s.value, 0) / humiditySensors.length).toFixed(1)) : 0,
            avgBattery: Number((sensors.reduce((sum, s) => sum + s.battery, 0) / sensors.length).toFixed(1)),
            dataRate: Number((dataRate / 1024).toFixed(2)),
            alertsCount: this.alerts$.value.filter(a => !a.resolved).length
        });

        this.lastUpdate = now;
        this.dataPoints = 0;
    }

    addRandomSensor(){
        const type = CONFIG.sensorTypes[Math.floor(Math.random() * CONFIG.sensorTypes.length)] as 'temperature' | 'humidity' | 'pressure' | 'motion';
        const location = CONFIG.locations[Math.floor(Math.random() * CONFIG.locations.length)] as 'Salle Serveurs' | 'Bureau 101' | 'Couloir Principal' | 'Cuisine' | 'Extérieur' | 'Entrepôt' | 'Labo R&D';
        const baseValue : SensorData['value'] = {
            temperature: 20 + Math.random() * 10,
            humidity: 40 + Math.random() * 20,
            pressure: 1000 + Math.random() * 20,
            motion: 0
        }[type];

        const newSensor: SensorData = {
            id: `sensor-${Date.now()}`,
            name: `${type.charAt(0).toUpperCase() + type.slice(1)} ${location}`,
            type,
            value: baseValue,
            unit: type === 'temperature' ? '°C' : type === 'humidity' ? '%' : type === 'pressure' ? 'hPa' : '',
            battery: 80 + Math.random() * 20,
            location: {
                x: Math.random() * 90 + 5,
                y: Math.random() * 90 + 5
            },
            status: 'normal',
            timestamp: new Date(),
        };

        // Créer un nouveau flux pour ce capteur
        const newStream = this.createSensorStream(newSensor);
        
        // Mettre à jour la liste des capteurs
        const currentSensors = this.sensors$.value;
        this.sensors$.next([...currentSensors, newSensor]);
        
        // S'abonner aux mises à jour du capteur
        newStream.subscribe(updatedSensor => {
            const sensors = this.sensors$.value;
            const updatedSensors = sensors.map(s => 
                s.id === updatedSensor.id ? updatedSensor : s
            );
            this.sensors$.next(updatedSensors);
            
            // Mettre à jour les alertes et métriques
            this.checkAlerts(updatedSensors);
            this.updateMetrics(updatedSensors);
        });
        
        return newSensor;
    }

    simulateFault(){
        const sensors = this.sensors$.value;
        if(sensors.length === 0) return;

        const randomSensor = sensors[Math.floor(Math.random() * sensors.length)] as SensorData;

        const faultySensor: SensorData = {
            ...randomSensor,
            battery: 5 + Math.random() * 5,
            status: 'critical',
            value: randomSensor.type === 'temperature' ? 50 : randomSensor.type === 'humidity' ? 95: 0
        };

        this.sensors$.next(sensors.map(s => 
            s.id === randomSensor.id ? faultySensor : s
        ));

        this.alerts$.next([...this.alerts$.value, {
            id: `fault-${Date.now()}`,
            type: 'connection',
            message: `PANNE : ${randomSensor.name} - valeurs anormales detectees`,
            sensorId: randomSensor.id,
            severity: 'critical',
            timestamp: new Date(),
            resolved: false
        }]);
    }

    getSensors(){ return this.sensors$.asObservable();}
    getAlerts(){ return this.alerts$.asObservable();}
    getMetrics(){ return this.metrics$.asObservable();}
}

class IoTDashboard {
    private simulator = new IoTSimulator();
    private charts: any = {};
    private sensorHistory: {[key: string] : number[]} = {};

    initialize(){
        this.initCharts();
        this.setupEventListeners();
        this.startSimulation();
    }

    private initCharts(){
        this.charts.temperature = new Chart('tempChart', {
            type: 'line',
            data: {
                labels: [],
                datasets: []
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: {duration: 0}
            }
        });

        this.charts.humidity = new Chart('humidityChart', {
            type: 'line',
            data: {
                labels: [],
                datasets: []
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: {duration: 0}
            }
        });
    }

    private setupEventListeners(){
        fromEvent(document.getElementById('addSensorBtn') as HTMLButtonElement, 'click').subscribe(() => {
            this.simulator.addRandomSensor();
        });

        fromEvent(document.getElementById('simulateFaultBtn') as HTMLButtonElement, 'click').subscribe(() => {
            this.simulator.simulateFault();
        });

        fromEvent(document.getElementById('seedSelect') as HTMLSelectElement, 'change').subscribe((event: Event) => {
            CONFIG.updateInterval = parseInt((event.target as HTMLSelectElement).value);
        });
    }

    private startSimulation(){
        this.simulator.simulateNetwork().subscribe(sensors => {
            this.updateSensorDisplay(sensors);
            this.updateCharts(sensors);
            this.updateMap(sensors);
        });

        this.simulator.getMetrics().subscribe(metrics => {
            this.updateMetrics(metrics);
        });

        this.simulator.getAlerts().subscribe(alerts => {
            this.updateAlerts(alerts);
        })
    }

    private updateSensorDisplay(sensors: SensorData[]){
        const container = document.getElementById('sensorsContainer') as HTMLElement;
        container.innerHTML = '';

        sensors.forEach(sensor => {
            const batteryClass = sensor.battery > 50 ? 'battery-high' : sensor.battery > 20 ? 'battery-medium' : 'battery-low';

            container.innerHTML += `
                <div class="sensor-item ${sensor.status}">
                    <span class="sensot-icon">${this.getSensorIcon(sensor.type)}</span>
                    <div class="sensor-info">
                        <span class="sensor-name">${sensor.name}</span>
                        <span class="sensor-location">Batterie : ${sensor.battery}%</span>
                    </div>
                    <span class="sensor-value">${sensor.value}${sensor.unit}</span>
                    <span class="sensor-battery ${batteryClass}">${sensor.battery}%</span>
                </div>
            `;
        });
    }

    private getSensorIcon(type: SensorData['type']){
        const icons: {[key in SensorData['type']]: string} = {
            temperature: '🌡️',
            humidity: '💧',
            pressure: '📊',
            motion: '🏃'
        };

        return icons[type as keyof typeof icons] || '📻';
    }

    private updateCharts(sensors: SensorData[]){
        const now = new Date().toLocaleTimeString();

        const tempSensors = sensors.filter(s => s.type === 'temperature');
        tempSensors.forEach(sensor => {
            if(!this.sensorHistory[sensor.id]){
                this.sensorHistory[sensor.id] = [];
            }

            (this.sensorHistory[sensor.id] as number[]).push(sensor.value);

            if((this.sensorHistory[sensor.id] as number[]).length > CONFIG.maxDataPoints){
                (this.sensorHistory[sensor.id] as number[]).shift();
            }
        });

        const humiditySensors = sensors.filter(s => s.type === 'humidity');
        humiditySensors.forEach(sensor => {
            if(!this.sensorHistory[sensor.id]){
                this.sensorHistory[sensor.id] = [];
            }
            (this.sensorHistory[sensor.id] as number[]).push(sensor.value);
            if((this.sensorHistory[sensor.id] as number[]).length > CONFIG.maxDataPoints){
                (this.sensorHistory[sensor.id] as number[]).shift();
            }
        });

        this.updateChartData(this.charts.temperature, tempSensors, now);
        this.updateChartData(this.charts.humidity, sensors.filter(s => s.type === 'humidity'), now);
    }

    private updateChartData(chart: any, sensors: SensorData[], label: string){
        chart.data.labels.push(label);

        sensors.forEach((sensor, index) => {
            if(!chart.data.datasets[index]){
                chart.data.datasets.push({
                    label: sensor.name,
                    data: [],
                    borderColor: `hsl(${index * 60}, 70%, 50%)`,
                    tension: 0.1,
                })
            }

            if(this.sensorHistory[sensor.id]){
                chart.data.datasets[index].data = [...this.sensorHistory[sensor.id] as number[]];
            }
        });

        if(chart.data.labels.length > CONFIG.maxDataPoints){
            chart.data.labels.shift();
            chart.data.datasets.forEach((dataset: any) => {
                dataset.data.shift();
            });
        }

        chart.update('none');
    }

    private updateMap(sensors: SensorData[]){
        const container = document.getElementById('mapContainer') as HTMLElement;
        container.innerHTML = '<div class="map-grid"></div>';

        sensors.forEach(sensor => {
            const point = document.createElement('div');
            point.className = `map-point ${sensor.status}`;
            point.style.left = `${sensor.location.x}%`;
            point.style.top = `${sensor.location.y}%`;
            point.title = `${sensor.name}: ${sensor.value}${sensor.unit}`;

            container.querySelector('.map-grid')?.appendChild(point);
        })
    }

    private updateMetrics(metrics: SystemMetrics){
        (document.getElementById('activeSensors') as HTMLElement).textContent = metrics.activeSensors.toString();
        (document.getElementById('avgTemp') as HTMLElement).textContent = `${metrics.avgTemperature.toFixed(1)}°C`;
        (document.getElementById('maxTemp') as HTMLElement).textContent = `${metrics.maxTemperature.toFixed(1)}°C`;
        (document.getElementById('minTemp') as HTMLElement).textContent = `${metrics.minTemperature.toFixed(1)}°C`;
        (document.getElementById('avgHumidity') as HTMLElement).textContent = `${metrics.avgHumidity.toFixed(1)}%`;
        (document.getElementById('activeAlerts') as HTMLElement).textContent = metrics.alertsCount.toString();
        (document.getElementById('avgBattery') as HTMLElement).textContent = `${metrics.avgBattery.toFixed(1)}%`;
        (document.getElementById('dataRate') as HTMLElement).textContent = `${metrics.dataRate.toFixed(2)} KB/s`;

        const sensors = this.simulator.getSensors();
    }

    private updateAlerts(alerts: Alert[]){
        const container = document.getElementById('alertsContainer') as HTMLElement;
        const activeAlerts = alerts.filter(a => !a.resolved);

        if(activeAlerts.length === 0){
            container.innerHTML = '<div class="alert">Aucune alerte pour le moment</div>';
            return;
        }

        container.innerHTML = activeAlerts.slice(-5).reverse().map(alert => `
            <div class="alert ${alert.severity}">
                <strong>${new Date(alert.timestamp).toLocaleTimeString()}</strong><br>
                ${alert.message}
            </div>
        `).join('');
        
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const dashboard = new IoTDashboard();
    dashboard.initialize();
})