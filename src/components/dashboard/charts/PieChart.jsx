import { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import styles from "../../../pages/Dashboard.module.css";

function PieChart({ data = [], title, chartTheme, showToggle = true }) {
    const [showPercentage, setShowPercentage] = useState(false);
    const [chartHeight, setChartHeight] = useState(300);
    
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 480) {
                setChartHeight(250);
            } else {
                setChartHeight(300);
            }
        };

        handleResize(); // Initial check
        window.addEventListener('resize', handleResize);
        
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // If no data or empty array, show a message
    if (!data || data.length === 0) {
        return <div className={styles.noDataMessage}>No data available</div>;
    }
    
    const pieChartOptions = {
        chart: {
            type: 'pie',
            toolbar: {
                show: true,
                tools: {
                    download: true,
                    selection: false,
                    zoom: false,
                    zoomin: false,
                    zoomout: false,
                    pan: false,
                    reset: false
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
            }
        },
        labels: data.map(item => item.type),
        colors: data.map(item => item.color),
        legend: {
            position: 'bottom',
            horizontalAlign: 'center',
            fontSize: '14px', // Removed mobile condition to keep font readable
            fontWeight: 'bold',
            markers: {
                width: 12, // Kept larger size for better visibility
                height: 12,
                radius: 6,
                fontWeight: 'bold',
                padding: 10
            },
            itemMargin: {
                horizontal: 10,
                vertical: 5
            }
        },
        tooltip: {
            enabled: true,
            y: {
                formatter: function(val) {
                    return val.toLocaleString()
                }
            }
        },
        responsive: [{
            breakpoint: 480,
            options: {
                chart: {
                    width: '100%'
                },
                legend: {
                    position: 'bottom',
                    fontSize: '12px',
                    offsetY: 5,
                    itemMargin: {
                        horizontal: 8,
                        vertical: 5
                    }
                }
            }
        }],
        dataLabels: {
            enabled: true,
            formatter: function(val, opts) {
                // Always show both label and value regardless of screen size
                const label = opts.w.globals.labels[opts.seriesIndex];
                const value = opts.w.globals.series[opts.seriesIndex].toLocaleString();
                if (showPercentage) {
                    return `${label}: ${val.toFixed(1)}%`;
                } else {
                    return `${label}: ${value}`;
                }
            },
            style: {
                fontSize: '10px', // Increased minimum font size
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 'bold' // Made bold for better visibility
            },
            dropShadow: {
                enabled: true, // Added shadow for better contrast
                color: '#fff',
                blur: 3
            }
        },
        theme: chartTheme
    };

    const pieChartSeries = data.map(item => item.value);

    return (
        <div>
            <div className={styles.chartContainer}>
                <ReactApexChart 
                    options={pieChartOptions} 
                    series={pieChartSeries} 
                    type="pie" 
                    height={chartHeight}
                    width="100%"
                />
            </div>
        </div>
    );
}

export default PieChart;