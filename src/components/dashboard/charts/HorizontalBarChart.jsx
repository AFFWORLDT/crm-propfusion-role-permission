import { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import styles from "../../../pages/Dashboard.module.css";

function HorizontalBarChart({ data, chartTheme, colors: customColors }) {
    const [chartHeight, setChartHeight] = useState(Math.max(300, data.length * 40));
    const [isMobile, setIsMobile] = useState(false);
    
    // Adjust height and check device size
    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth <= 480;
            setIsMobile(mobile);
            
            const baseHeight = mobile ? 200 : (window.innerWidth < 768 ? 250 : 300);
            const rowHeight = mobile ? 30 : (window.innerWidth < 576 ? 35 : 40);
            setChartHeight(Math.max(baseHeight, data.length * rowHeight));
        };
        
        handleResize(); // Initial call
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [data.length]);
    
    const horizontalBarOptions = {
        chart: {
            type: 'bar',
            toolbar: {
                show: false
            },
            animations: {
                enabled: true,
                easing: 'easeinout',
                speed: 600,
                animateGradually: {
                    enabled: true,
                    delay: 100
                },
                dynamicAnimation: {
                    enabled: true,
                    speed: 300
                }
            }
        },
        plotOptions: {
            bar: {
                horizontal: true,
                barHeight: isMobile ? '60%' : '70%',
                distributed: true,
                borderRadius: 4,
                dataLabels: {
                    position: 'center'
                }
            }
        },
        dataLabels: {
            enabled: true,
            formatter: function(val) {
                return val.toFixed(0)
            },
            style: {
                fontSize: isMobile ? '9px' : (window.innerWidth < 576 ? '10px' : '12px'),
                colors: ['#fff'],
                fontWeight: 500,
                textShadow: '0px 0px 2px rgba(0, 0, 0, 0.5)'
            },
            offsetX: isMobile ? 20 : (window.innerWidth < 576 ? 25 : 40)
        },
        colors: customColors && customColors.length > 0
            ? customColors
            : ['#4ECDC4', '#FF6B6B', '#FFB74D', '#A78BFA', '#F472B6', '#96C93D'],
        xaxis: {
            categories: data.map(p => p.name),
            labels: {
                show: true,
                style: {
                    fontSize: isMobile ? '9px' : (window.innerWidth < 576 ? '10px' : '12px')
                },
                formatter: function(val) {
                    // More aggressive truncation for mobile
                    if (isMobile && val.length > 8) {
                        return val.substring(0, 8) + '...';
                    }
                    return window.innerWidth < 576 && val.length > 12 
                        ? val.substring(0, 12) + '...' 
                        : val;
                }
            }
        },
        yaxis: {
            labels: {
                show: true,
                style: {
                    fontSize: isMobile ? '9px' : (window.innerWidth < 576 ? '10px' : '12px')
                },
                maxWidth: isMobile ? 100 : 150
            }
        },
        tooltip: {
            y: {
                formatter: function(val) {
                    return val + " properties"
                }
            },
            style: {
                fontSize: isMobile ? '10px' : '12px'
            }
        },
        responsive: [{
            breakpoint: 480,
            options: {
                chart: {
                    height: '100%',
                    toolbar: {
                        show: false
                    }
                },
                plotOptions: {
                    bar: {
                        barHeight: '50%'
                    }
                },
                grid: {
                    padding: {
                        left: 5,
                        right: 5
                    }
                }
            }
        }],
        theme: chartTheme,
        grid: {
            padding: {
                left: isMobile ? 5 : 10,
                right: isMobile ? 5 : 10
            }
        }
    };

    const horizontalBarSeries = [{
        name: 'Properties',
        data: data.map(p => p.count)
    }];

    return (
        <div className={styles.chartWrapper}>
            <ReactApexChart 
                options={horizontalBarOptions} 
                series={horizontalBarSeries} 
                type="bar" 
                height={chartHeight} 
                width="100%"
            />
        </div>
    );
}

export default HorizontalBarChart;