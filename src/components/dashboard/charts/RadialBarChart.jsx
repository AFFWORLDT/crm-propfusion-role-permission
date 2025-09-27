import ReactApexChart from "react-apexcharts";

function RadialBarChart({ data, chartTheme }) {
    const radialBarOptions = {
        chart: {
            type: 'radialBar',
        },
        plotOptions: {
            radialBar: {
                offsetY: 0,
                startAngle: 0,
                endAngle: 270,
                hollow: {
                    margin: 5,
                    size: '30%',
                    background: 'transparent',
                    image: undefined,
                },
                dataLabels: {
                    name: {
                        show: true,
                    },
                    value: {
                        show: true,
                    }
                }
            }
        },
        colors: data.map(item => item.color),
        labels: data.map(item => item.type),
        legend: {
            show: true,
            floating: true,
            fontSize: '14px',
            position: 'right',
            offsetX: 0,
            offsetY: 15,
            labels: {
                useSeriesColors: true,
            },
            formatter: function(seriesName, opts) {
                return seriesName + ":  " + opts.w.globals.series[opts.seriesIndex].toLocaleString()
            }
        },
        theme: chartTheme
    };

    const radialBarSeries = data.map(item => item.value);

    return (
        <ReactApexChart 
            options={radialBarOptions} 
            series={radialBarSeries} 
            type="radialBar" 
            height={300} 
        />
    );
}

export default RadialBarChart; 