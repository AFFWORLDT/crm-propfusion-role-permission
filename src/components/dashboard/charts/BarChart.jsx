import { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import styles from "../../../pages/Dashboard.module.css";

function BarChart({ data, chartTheme }) {
    const [chartHeight, setChartHeight] = useState(300);
    
    // Adjust height based on screen size
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 576) {
                setChartHeight(250);
            } else if (window.innerWidth < 768) {
                setChartHeight(280);
            } else {
                setChartHeight(300);
            }
        };
        
        handleResize(); // Initial call
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    
    const barChartOptions = {
        chart: {
            type: 'bar',
            stacked: false,
            toolbar: {
                show: true,
                tools: {
                    download: true
                }
            },
            fontFamily: 'Poppins, sans-serif',
            foreColor: '#333',
            animations: {
                enabled: true,
                easing: 'easeinout',
                speed: 800,
                dynamicAnimation: {
                    enabled: true,
                    speed: 350
                }
            }
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '55%',
                endingShape: 'rounded',
                borderRadius: 4
            }
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            show: true,
            width: 2,
            colors: ['transparent']
        },
        xaxis: {
            categories: data.map(item => item.range),
            labels: {
                style: {
                    fontSize: window.innerWidth < 576 ? '10px' : '12px'
                },
                rotateAlways: window.innerWidth < 576 ? true : false,
                rotate: window.innerWidth < 576 ? -45 : 0
            }
        },
        yaxis: {
            title: {
                text: 'Count',
                style: {
                    fontSize: window.innerWidth < 576 ? '12px' : '14px',
                    fontWeight: 500
                }
            },
            labels: {
                formatter: function(val) {
                    return val.toFixed(0)
                },
                style: {
                    fontSize: window.innerWidth < 576 ? '10px' : '12px'
                }
            }
        },
        fill: {
            opacity: 1
        },
        tooltip: {
            y: {
                formatter: function (val) {
                    return val.toLocaleString() + " properties"
                }
            }
        },
        colors: ['#4ECDC4', '#FF6B6B'],
        legend: {
            position: window.innerWidth < 768 ? 'bottom' : 'top',
            horizontalAlign: window.innerWidth < 768 ? 'center' : 'right',
            fontSize: window.innerWidth < 576 ? '11px' : '13px',
            itemMargin: {
                horizontal: 8,
                vertical: 3
            }
        },
        responsive: [{
            breakpoint: 768,
            options: {
                plotOptions: {
                    bar: {
                        columnWidth: '70%'
                    }
                }
            }
        }],
        theme: chartTheme
    };

    const barChartSeries = [
        {
            name: 'For Rent',
            data: data.map(item => item.rent)
        },
        {
            name: 'For Sale',
            data: data.map(item => item.sale)
        }
    ];

    return (
        <div className={styles.chartWrapper}>
            <ReactApexChart 
                options={barChartOptions} 
                series={barChartSeries} 
                type="bar" 
                height={chartHeight} 
                width="100%"
            />
        </div>
    );
}

export default BarChart; 