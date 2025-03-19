import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

const GaugeChart = ({ data, color, maxValue }) => {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    useEffect(() => {
        const chartDom = chartRef.current;
        const myChart = echarts.init(chartDom);
        chartInstance.current = myChart;

        // Create gradient color
        const colorStops = [
            {
                offset: 0,
                color: 'rgba(106, 17, 203, 0.8)' // Start with purple
            },
            {
                offset: 1,
                color: 'rgba(37, 117, 252, 0.8)' // End with blue
            }
        ];

        const option = {
            backgroundColor: 'transparent',
            tooltip: {
                formatter: '{a} <br/>{b} : {c}',
                backgroundColor: 'rgba(30, 39, 58, 0.7)',
                borderColor: 'rgba(255, 255, 255, 0.2)',
                textStyle: {
                    color: '#fff'
                }
            },
            series: [
                {
                    name: 'Leaves',
                    type: 'gauge',
                    center: ['50%', '55%'],
                    radius: '80%',
                    startAngle: 200,
                    endAngle: -20,
                    min: 0,
                    max: maxValue,
                    splitNumber: 6,
                    itemStyle: {
                        color: {
                            type: 'linear',
                            x: 0,
                            y: 0,
                            x2: 0,
                            y2: 1,
                            colorStops: colorStops
                        },
                        shadowColor: 'rgba(106, 17, 203, 0.5)',
                        shadowBlur: 10
                    },
                    progress: {
                        show: true,
                        width: 25,
                        roundCap: true,
                        itemStyle: {
                            shadowColor: 'rgba(0, 0, 0, 0.3)',
                            shadowBlur: 15,
                            shadowOffsetX: 2,
                            shadowOffsetY: 2
                        }
                    },
                    pointer: {
                        show: false,
                    },
                    axisLine: {
                        lineStyle: {
                            width: 25,
                            color: [
                                [1, 'rgba(255, 255, 255, 0.1)']
                            ]
                        }
                    },
                    axisTick: {
                        distance: -38,
                        splitNumber: 5,
                        lineStyle: {
                            width: 1,
                            color: 'rgba(255, 255, 255, 0.3)'
                        }
                    },
                    splitLine: {
                        distance: -42,
                        length: 12,
                        lineStyle: {
                            width: 2,
                            color: 'rgba(255, 255, 255, 0.4)'
                        }
                    },
                    axisLabel: {
                        distance: -15,
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontSize: 12,
                        fontWeight: 'normal'
                    },
                    anchor: {
                        show: false,
                    },
                    title: {
                        show: true,
                        offsetCenter: [0, '80%'],
                        fontSize: 12,
                        fontWeight: 'normal',
                        color: 'rgba(255, 255, 255, 0.7)',
                        formatter: 'Total Leaves'
                    },
                    detail: {
                        valueAnimation: true,
                        width: '60%',
                        lineHeight: 30,
                        borderRadius: 8,
                        offsetCenter: [0, '10%'],
                        fontSize: 32,
                        fontWeight: 'bold',
                        formatter: '{value}',
                        color: '#fff',
                        textShadow: '0 0 10px rgba(106, 17, 203, 0.5)'
                    },
                    data: [
                        {
                            value: data,
                            name: 'Leaves Remaining'
                        },
                    ],
                    animation: true,
                    animationDuration: 2000,
                    animationEasing: 'cubicInOut'
                },
                // Add a decorative ring
                {
                    type: 'pie',
                    center: ['50%', '55%'],
                    radius: ['87%', '89%'],
                    hoverAnimation: false,
                    itemStyle: {
                        color: {
                            type: 'linear',
                            x: 0,
                            y: 0,
                            x2: 0,
                            y2: 1,
                            colorStops: [
                                {
                                    offset: 0,
                                    color: 'rgba(161, 140, 209, 0.8)'
                                },
                                {
                                    offset: 1,
                                    color: 'rgba(251, 194, 235, 0.8)'
                                }
                            ]
                        }
                    },
                    data: [100],
                    z: 1
                }
            ],
            animationDuration: 1500,
            animationEasing: 'cubicInOut'
        };

        myChart.setOption(option);

        // Handle resize
        const handleResize = () => {
            if (chartInstance.current) {
                chartInstance.current.resize();
            }
        };

        window.addEventListener('resize', handleResize);

        // Ensure chart is properly sized initially
        setTimeout(() => {
            handleResize();
        }, 200);

        // Clean up on component unmount
        return () => {
            window.removeEventListener('resize', handleResize);
            if (chartInstance.current) {
                chartInstance.current.dispose();
            }
        };
    }, [data, color, maxValue]);

    return (
        <div
            ref={chartRef}
            style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}
        />
    );
};

export default GaugeChart;
