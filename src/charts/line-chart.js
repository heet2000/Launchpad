import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

const LineChart = ({ data }) => {
    const chartRef = useRef(null);

    useEffect(() => {
        const chartDom = chartRef.current;
        const myChart = echarts.init(chartDom);

        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const defaultData = [2, 1, 0, 3, 1, 2, 0, 1, 2, 0, 1, 2];

        const option = {
            backgroundColor: 'transparent',
            tooltip: {
                trigger: 'axis',
                backgroundColor: 'rgba(30, 39, 58, 0.7)',
                borderColor: 'rgba(255, 255, 255, 0.2)',
                textStyle: {
                    color: '#fff'
                },
                axisPointer: {
                    type: 'shadow',
                    shadowStyle: {
                        color: 'rgba(106, 17, 203, 0.1)'
                    }
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                top: '10%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: months,
                axisLine: {
                    lineStyle: {
                        color: 'rgba(255, 255, 255, 0.3)'
                    }
                },
                axisLabel: {
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: 10,
                    rotate: 0
                },
                axisTick: {
                    show: false
                }
            },
            yAxis: {
                type: 'value',
                name: 'Days',
                nameTextStyle: {
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: 12,
                    padding: [0, 0, 0, 5]
                },
                splitLine: {
                    lineStyle: {
                        color: 'rgba(255, 255, 255, 0.1)',
                        type: 'dashed'
                    }
                },
                axisLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                axisLabel: {
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: 10
                }
            },
            series: [
                {
                    name: 'Leave Days',
                    data: data || defaultData,
                    type: 'line',
                    smooth: true,
                    symbol: 'circle',
                    symbolSize: 8,
                    showSymbol: true,
                    lineStyle: {
                        width: 4,
                        color: {
                            type: 'linear',
                            x: 0,
                            y: 0,
                            x2: 1,
                            y2: 0,
                            colorStops: [
                                {
                                    offset: 0,
                                    color: 'rgba(106, 17, 203, 0.8)'
                                },
                                {
                                    offset: 1,
                                    color: 'rgba(37, 117, 252, 0.8)'
                                }
                            ]
                        }
                    },
                    itemStyle: {
                        color: '#a18cd1',
                        borderWidth: 2,
                        borderColor: '#fff',
                        shadowColor: 'rgba(106, 17, 203, 0.5)',
                        shadowBlur: 10
                    },
                    areaStyle: {
                        color: {
                            type: 'linear',
                            x: 0,
                            y: 0,
                            x2: 0,
                            y2: 1,
                            colorStops: [
                                {
                                    offset: 0,
                                    color: 'rgba(106, 17, 203, 0.5)'
                                },
                                {
                                    offset: 1,
                                    color: 'rgba(37, 117, 252, 0.05)'
                                }
                            ]
                        }
                    },
                    emphasis: {
                        scale: true,
                        focus: 'series',
                        itemStyle: {
                            borderWidth: 3,
                            borderColor: '#fff',
                            shadowBlur: 20
                        }
                    },
                    animation: true,
                    animationDuration: 2000,
                    animationEasing: 'cubicInOut'
                }
            ],
            animationDuration: 1500,
            animationEasing: 'cubicInOut'
        };

        myChart.setOption(option);

        // Handle resize
        const handleResize = () => {
            myChart.resize();
        };
        window.addEventListener('resize', handleResize);

        // Cleanup on component unmount
        return () => {
            window.removeEventListener('resize', handleResize);
            myChart.dispose();
        };
    }, [data]);

    return <div ref={chartRef} style={{ width: '100%', height: '100%' }}></div>;
};

export default LineChart;
