import { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import styles from "../../../pages/Dashboard.module.css";

function DonutChart({ data, chartTheme, legendPosition = "right" }) {
    const [showPercentage, setShowPercentage] = useState(false);
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
    
    const donutChartOptions = {
        chart: {
            type: 'donut',
            toolbar: {
                show: true,
                tools: {
                    download: true
                }
            },
            fontFamily: 'Poppins, sans-serif',
            foreColor: '#333',
            events: {
                dataPointSelection: function() {
                    setShowPercentage(!showPercentage);
                },
                click: function() {
                    setShowPercentage(!showPercentage);
                }
            },
            animations: {
                enabled: true,
                easing: 'easeinout',
                speed: 800,
                animateGradually: {
                    enabled: true,
                    delay: 150
                },
                dynamicAnimation: {
                    enabled: true,
                    speed: 350
                }
            }
        },
        labels: data.map(item => item.type),
        colors: data.map(item => item.color),
        responsive: [{
            breakpoint: 768,
            options: {
                chart: {
                    width: '100%'
                },
                legend: {
                    position: 'bottom',
                    fontSize: '12px',
                    offsetY: 0,
                    itemMargin: {
                        horizontal: 6,
                        vertical: 2
                    }
                },
                plotOptions: {
                    pie: {
                        donut: {
                            size: '65%',
                            labels: {
                                value: {
                                    fontSize: '12px'
                                },
                                total: {
                                    fontSize: '12px'
                                }
                            }
                        }
                    }
                }
            }
        }, {
            breakpoint: 576,
            options: {
                chart: {
                    width: '100%'
                },
                legend: {
                    position: 'bottom',
                    fontSize: '11px',
                    horizontalAlign: 'center',
                    offsetX: 0
                },
                plotOptions: {
                    pie: {
                        donut: {
                            size: '70%'
                        }
                    }
                }
            }
        }],
        legend: {
            position: window.innerWidth < 768 ? 'bottom' : legendPosition,
            fontSize: '13px',
            offsetY: 10,
            itemMargin: {
                horizontal: 5,
                vertical: 3
            },
            formatter: function(seriesName) {
                // Truncate long series names for mobile
                return window.innerWidth < 576 && seriesName.length > 12 
                    ? seriesName.substring(0, 12) + '...' 
                    : seriesName;
            }
        },
        dataLabels: {
            enabled: false
        },
        tooltip: {
            y: {
                formatter: function(val) {
                    return val.toLocaleString()
                }
            }
        },
        plotOptions: {
            pie: {
                donut: {
                    size: '55%',
                    labels: {
                        show: true,
                        name: {
                            show: true,
                            fontSize: '14px',
                            offsetY: -10
                        },
                        value: {
                            show: true,
                            fontSize: '16px',
                            fontWeight: 600,
                            formatter: function(val) {
                                return val.toLocaleString()
                            }
                        },
                        total: {
                            show: true,
                            label: 'Total',
                            fontSize: '14px',
                            fontWeight: 600,
                            formatter: function(w) {
                                return w.globals.seriesTotals.reduce((a, b) => a + b, 0).toLocaleString()
                            }
                        }
                    }
                }
            }
        },
        theme: chartTheme
    };

    const donutChartSeries = data.map(item => item.value);

    return (
        <div className={styles.chartWrapper}>
            <ReactApexChart 
                options={donutChartOptions} 
                series={donutChartSeries} 
                type="donut" 
                height={chartHeight} 
                width="100%"
            />
        </div>
    );
}

export default DonutChart; 