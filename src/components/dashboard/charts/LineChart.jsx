import ReactApexChart from "react-apexcharts";

function LineChart({ data, chartTheme, color = '#341b80' }) {
    const lineChartOptions = {
        chart: {
            type: 'area',
            zoom: {
                enabled: true
            },
            toolbar: {
                show: true,
                tools: {
                    download: true
                }
            },
            fontFamily: 'Poppins, sans-serif',
            foreColor: '#333'
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            curve: 'smooth',
            width: 3
        },
        fill: {
            type: 'gradient',
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.7,
                opacityTo: 0.3,
                stops: [0, 90, 100]
            }
        },
        grid: {
            row: {
                colors: ['#f3f3f3', 'transparent'],
                opacity: 0.5
            },
            borderColor: '#e0e0e0',
            strokeDashArray: 5
        },
        xaxis: {
            type: 'datetime',
            categories: data.map(item => item.date),
            labels: {
                formatter: function(val) {
                    return new Date(val).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                    })
                }
            }
        },
        yaxis: {
            labels: {
                formatter: function(val) {
                    return val.toFixed(0)
                }
            }
        },
        tooltip: {
            x: {
                format: 'dd MMM yyyy'
            }
        },
        theme: chartTheme,
        colors: [color]
    };

    const lineChartSeries = [{
        name: 'Daily Count',
        data: data.map(item => item.listings)
    }];

    return (
        <ReactApexChart 
            options={lineChartOptions} 
            series={lineChartSeries} 
            type="area" 
            height={300} 
        />
    );
}

export default LineChart; 