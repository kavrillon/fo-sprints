import Controller from '../../libs/Controller';
import _orderBy from 'lodash/orderBy';
import _map from 'lodash/map';
import Chart from 'chart.js';
import moment from 'moment';

export default class HomeController extends Controller {
    constructor(data) {
        super();

        // Controller vars
        this.data = data;

        // DOM vars
        this.velocityTitle = document.querySelector('[js-avg-velocity]');

        this.init();
    }

    init() {
        const labels = _orderBy(_map(this.data.weeks, 'key'));

        const velocityValues = _map(_orderBy(this.data.weeks, 'key'), 'points.spent');

        let velocityAvg = 0;
        velocityValues.forEach((elt) => {
            velocityAvg += elt;
        });
        velocityAvg = Math.round(velocityAvg / velocityValues.length);


        this.velocityTitle.textContent = `${velocityAvg} pts`;

        let velocityAvgArray = [];
        for (let i = 0; i < velocityValues.length; i++) {
            velocityAvgArray.push(velocityAvg);
        }

        // create charts
        new Chart(document.getElementById('ChartVelocity'), {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Velocity',
                        data: velocityValues,
                        borderWidth: 1,
                        borderColor: '#362f5f',
                        backgroundColor: 'rgba(54,47,95,0.3)',
                        pointRadius: 0
                    },
                    {
                        label: 'Average',
                        data: velocityAvgArray,
                        tooltip: false,
                        fill: false,
                        borderWidth: 1,
                        borderColor: '#cc0000',
                        pointRadius: 0
                    }
                ]
            },
            options: {
                legend: {
                    display: false
                },
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero:true
                        }
                    }]
                }
            }
        });

        const monitoringPercents = _map(this.data.weeks, 'activity.monitoring');
        let monitoringAvg = 0;
        monitoringPercents.forEach((elt) => {
            monitoringAvg += elt;
        });
        monitoringAvg = Math.round(monitoringAvg / monitoringPercents.length);

        const deliveryPercents = _map(this.data.weeks, 'activity.delivery');
        let deliveryAvg = 0;
        deliveryPercents.forEach((elt) => {
            deliveryAvg += elt;
        });
        deliveryAvg = Math.round(deliveryAvg / deliveryPercents.length);

        const supportPercents = _map(this.data.weeks, 'activity.support');
        let supportAvg = 0;
        supportPercents.forEach((elt) => {
            supportAvg += elt;
        });
        supportAvg = Math.round(supportAvg / supportPercents.length);

        const productPercents = _map(this.data.weeks, 'activity.product');
        let productAvg = 0;
        productPercents.forEach((elt) => {
            productAvg += elt;
        });
        productAvg = Math.round(productAvg / productPercents.length);

        new Chart(document.getElementById('ChartGlobalActivity'), {
            type: 'doughnut',
            data: {
                labels: [
                    'Monitoring',
                    'Support',
                    'Delivery',
                    'Product'
                ],
                datasets: [
                    {
                        data: [monitoringAvg, supportAvg, deliveryAvg, productAvg],
                        backgroundColor: [
                            '#ffce56',
                            '#44d279',
                            '#ff6384',
                            '#36a2eb'
                        ],
                        hoverBackgroundColor: [
                            '#ffce56',
                            '#44d279',
                            '#ff6384',
                            '#36a2eb'
                        ]
                    }
                ]
            },
            options: {
                legend: {
                    position: 'bottom'
                },
                responsive: true,
                maintainAspectRatio: false
            }
        });

        let months = [];
        let monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        for (let i = 0; i <= 11; i++) {
            months.push({
                key: i,
                label: monthLabels[i],
                activity: {
                    monitoring: 0,
                    support: 0,
                    delivery: 0,
                    product: 0
                },
                points: {
                    monitoring: 0,
                    support: 0,
                    delivery: 0,
                    product: 0,
                    spent: 0,
                    available: 0,
                    estimated: 0
                },
                weeks: []
            });
        }

        _orderBy(this.data.weeks, 'key').forEach((w) => {
            const monthKey = parseInt(moment(w.startDate).format('M')) - 1;
            if (months[monthKey]) {
                months[monthKey].weeks.push(w);
                months[monthKey].points.product += w.points.product;
                months[monthKey].points.monitoring += w.points.monitoring;
                months[monthKey].points.support += w.points.support;
                months[monthKey].points.delivery += w.points.delivery;
                months[monthKey].points.spent += w.points.spent;
                months[monthKey].points.available += w.points.available;
                months[monthKey].points.estimated += w.points.estimated;
            }
        });

        months.forEach((m) => {
            m.activity.product = m.points.product * 100 / m.points.spent;
            m.activity.monitoring = m.points.monitoring * 100 / m.points.spent;
            m.activity.support = m.points.support * 100 / m.points.spent;
            m.activity.delivery = m.points.delivery * 100 / m.points.spent;
        });

        new Chart(document.getElementById('ChartMonthlyActivity'), {
            type: 'line',
            data: {
                labels: monthLabels,
                datasets: [
                    {
                        label: 'Monitoring',
                        data: _map(months, 'activity.monitoring'),
                        backgroundColor: 'rgba(255,206,86,0.3)',
                        borderWidth: 1,
                        borderColor: '#ffce56',
                        pointRadius: 0
                    },
                    {
                        label: 'Support',
                        data: _map(months, 'activity.support'),
                        backgroundColor: 'rgba(68,210,121,0.3)',
                        borderWidth: 1,
                        borderColor: '#44d279',
                        pointRadius: 0
                    },
                    {
                        label: 'Delivery',
                        data: _map(months, 'activity.delivery'),
                        backgroundColor: 'rgba(255,99,132,0.3)',
                        borderWidth: 1,
                        borderColor: '#ff6384',
                        pointRadius: 0
                    },
                    {
                        label: 'Product',
                        data: _map(months, 'activity.product'),
                        backgroundColor: 'rgba(54,162,235,0.3)',
                        borderWidth: 1,
                        borderColor: '#36a2eb',
                        pointRadius: 0
                    }
                ]
            },
            options: {
                legend: {
                    position: 'bottom'
                },
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero:true
                        }
                    }]
                }
            }
        });
    }
}
