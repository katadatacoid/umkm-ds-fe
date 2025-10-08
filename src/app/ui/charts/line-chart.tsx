import React, { useLayoutEffect } from 'react';
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';

// Tipe data untuk chart
interface ChartData {
    month: string;
    [key: string]: number | string;  // Membuat data lebih fleksibel untuk menerima nilai apa pun
}

interface ChartProps {
    data: ChartData[]; // Data yang akan ditampilkan di chart
    seriesNames: string[]; // Nama series yang ingin ditampilkan
    fieldNames: string[]; // Nama field data yang ingin digunakan untuk sumbu Y
    colors: string[]; // Warna untuk setiap series
    chartType: 'line' | 'column'; // Menentukan apakah menggunakan LineSeries atau ColumnSeries
}

const Chart: React.FC<ChartProps> = ({ data, seriesNames, fieldNames, colors, chartType }) => {
    useLayoutEffect(() => {
        let root = am5.Root.new('chartdiv');

        // Set the theme
        root.setThemes([am5themes_Animated.new(root)]);

        // Create the chart
        let chart = root.container.children.push(
            am5xy.XYChart.new(root, {
                panY: false,
                layout: root.verticalLayout,
            })
        );

        // Create Y-axis
        let yAxis = chart.yAxes.push(
            am5xy.ValueAxis.new(root, {
                           strictMinMax : false,
                renderer: am5xy.AxisRendererY.new(root, {
                    minGridDistance: 40,
                }),
            })
        );

        // Create X-axis (Category Axis)
        let xAxis = chart.xAxes.push(
            am5xy.CategoryAxis.new(root, {
                maxDeviation: 0.5,
                renderer: am5xy.AxisRendererX.new(root, {
                    minGridDistance: 30,
                    
                }),
                categoryField: 'month',

            })
        );
        xAxis.data.setAll(data);

        // Loop over the seriesNames and create a series for each
        seriesNames.forEach((name, index) => {
            let series;

            if (chartType === 'line') {
                // Create LineSeries
                series = chart.series.push(
                    am5xy.SmoothedXLineSeries.new(root, {
                        name,
                        xAxis,
                        yAxis,
                        valueYField: fieldNames[index],
                        categoryXField: 'month',
                        tooltip: am5.Tooltip.new(root, {
                            labelText: "[bold]{name}[/]\n{valueX.formatDate()}: {valueY}"
                          }),
                        stroke: am5.color(colors[index]),
                        // fill: am5.color(colors[index]),
                        // fillOpacity: 0.3
                        interpolationDuration: 1000, // Duration for interpolation animation
                        interpolationEasing: am5.ease.out(am5.ease.cubic), // Easing for smoothness
                    })
                );

                series.strokes.template.setAll(
                    {
                        strokeWidth: 3,
                        
                    }
                );
                let gradient = am5.LinearGradient.new(root, {
                    stops: [{
                        opacity: 0.4,
                        color: am5.color(colors[index])
                    }, {
                        color: am5.color(0xFFFFFF),
                        opacity: 0.1
                    }]
                });
                series.fills.template.setAll({

                    fillGradient: gradient,
                    visible: true
                });
            } else {
                // Create ColumnSeries
                series = chart.series.push(
                    am5xy.ColumnSeries.new(root, {
                        name,
                        xAxis,
                        yAxis,
                        valueYField: fieldNames[index],
                        categoryXField: 'month',
                        fill: am5.color(colors[index]),
                        stroke: am5.color(colors[index]),
                    })
                );
            }

            series.data.setAll(data);
        });

        // Add legend
        let legend = chart.children.push(am5.Legend.new(root, {}));
        legend.data.setAll(chart.series.values);

        // Add cursor for interactivity
        chart.set('cursor', am5xy.XYCursor.new(root, {}));

        // Cleanup on component unmount
        return () => {
            root.dispose();
        };
    }, [data, seriesNames, fieldNames, colors, chartType]);

    return (
        <div
            id="chartdiv"
            className='my-5'
            style={{ width: '100%', height: '500px', backgroundColor: '#fff' }}
        ></div>
    );
};

export default Chart;
