"use client";

import React, { useLayoutEffect, useRef, useEffect, useState } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

interface ChartDataPoint {
  month: string;
  value: number;
}

interface AffiliateChartProps {
  data: ChartDataPoint[];
  years?: string[];
  defaultYear?: string;
  title?: string;
  showLegend?: boolean;
  height?: number;
  color?: string;
  onYearChange?: (year: string) => void;
}

const AffiliateChart: React.FC<AffiliateChartProps> = ({
  data,
  years = ["2023", "2024", "2025"],
  defaultYear = "2025",
  title = "Earnings",
  showLegend = true,
  height = 400,
  color = "#10b981",
  onYearChange,
}) => {
  const [selectedYear, setSelectedYear] = useState(defaultYear);
  const [tempYear, setTempYear] = useState(defaultYear);

  const chartRef = useRef<am5.Root | null>(null);
  const chartDivRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (!chartDivRef.current) return;

    const root = am5.Root.new(chartDivRef.current);
    root.setThemes([am5themes_Animated.new(root)]);

    const chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: false,
        panY: false,
        wheelX: "none",
        wheelY: "none",
        layout: root.verticalLayout,
        paddingLeft: 0,
      })
    );

    chart.set(
      "cursor",
      am5xy.XYCursor.new(root, {
        behavior: "none",
      })
    );

    const xAxis = chart.xAxes.push(
      am5xy.CategoryAxis.new(root, {
        categoryField: "month",
        renderer: am5xy.AxisRendererX.new(root, { minGridDistance: 30 }),
      })
    );

    const yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererY.new(root, {}),
      })
    );

    const series = chart.series.push(
      am5xy.SmoothedXLineSeries.new(root, {
        name: title,
        xAxis,
        yAxis,
        valueYField: "value",
        categoryXField: "month",
        stroke: am5.color(color),
        fill: am5.color(color),
        tooltipText:
          "[#B0B0B0 fontSize: 13px]{categoryX} " +
          selectedYear +
          "[/]\n[#FFFFFF bold fontSize: 16px]{valueY.formatNumber('#,###')}[/]",
      })
    );

    series.strokes.template.setAll({ strokeWidth: 3 });

    const gradient = am5.LinearGradient.new(root, {
      stops: [
        { opacity: 0.4, color: am5.color(color) },
        { color: am5.color(0xffffff), opacity: 0.1 },
      ],
    });
    series.fills.template.setAll({
      fillGradient: gradient,
      visible: true,
    });

    // series.bullets.push(() =>
    //   am5.Bullet.new(root, {
    //     sprite: am5.Circle.new(root, {
    //       radius: 5,
    //       fill: series.get("fill"),
    //       stroke: root.interfaceColors.get("background"),
    //       strokeWidth: 2,
    //       tooltipText:
    //         "[#B0B0B0 fontSize: 13px]{categoryX} " +
    //         selectedYear +
    //         "[/]\n[#FFFFFF bold fontSize: 16px]{valueY.formatNumber('#,###')}[/]",
    //     }),
    //   })
    // );
    series.bullets.push(() =>
      am5.Bullet.new(root, {
        sprite: am5.Circle.new(root, {
          radius: 5,
          fill: am5.color(color),
          stroke: am5.color("#fff"),
          strokeWidth: 2,
        }),
        dynamic: true,
      })
    );

    // Custom tooltip with dark background
    const tooltip = am5.Tooltip.new(root, {
      getFillFromSprite: false,
      getStrokeFromSprite: false,
      autoTextColor: false,
      pointerOrientation: "down",
      labelText:
        "[fontSize: 14px; #FFFFFF]{categoryX} " +
        selectedYear +
        "\n[bold fontSize: 18px]{valueY.formatNumber('#,###')}[/]",
    });

    tooltip.get("background").setAll({
      fill: am5.color("#0A1B49"),
      strokeOpacity: 0,
      fillOpacity: 1,
      cornerRadius: 6,
    });

    tooltip.label.setAll({
      textAlign: "center",
      fill: am5.color("#FFFFFF"),
      paddingTop: 10,
      paddingBottom: 10,
      paddingLeft: 16,
      paddingRight: 16,
    });

    series.set("tooltip", tooltip);

    // Set data
    xAxis.data.setAll(data);
    series.data.setAll(data);

    series.appear(1000);
    chart.appear(1000, 100);

    chartRef.current = root;

    return () => {
      root.dispose();
      chartRef.current = null;
    };
  }, [data, color, title, selectedYear]);

  useEffect(() => {
    if (!chartRef.current) return;
    const root = chartRef.current;
    const chart = root.container.children.getIndex(0) as am5xy.XYChart;
    const series = chart.series.getIndex(0) as am5xy.LineSeries;
    const xAxis = chart.xAxes.getIndex(0);

    // Update tooltip text with the new selectedYear
    series.set(
      "tooltipText",
      "[#B0B0B0 fontSize: 13px]{categoryX} " +
        selectedYear +
        "[/]\n[#FFFFFF bold fontSize: 16px]{valueY.formatNumber('#,###')}[/]"
    );

    // Update bullets tooltip text
    series.bullets.clear();
    // series.bullets.push(() =>
    //   am5.Bullet.new(root, {
    //     sprite: am5.Circle.new(root, {
    //       radius: 5,
    //       fill: series.get("fill"),
    //       stroke: root.interfaceColors.get("background"),
    //       strokeWidth: 2,
    //       tooltipText:
    //         "[#B0B0B0 fontSize: 13px]{categoryX} " +
    //         selectedYear +
    //         "[/]\n[#FFFFFF bold fontSize: 16px]{valueY.formatNumber('#,###')}[/]",
    //     }),
    //   })
    // );
    series.bullets.push(() =>
      am5.Bullet.new(root, {
        sprite: am5.Circle.new(root, {
          radius: 5,
          fill: am5.color(color),
          stroke: am5.color("#fff"),
          strokeWidth: 2,
        }),
        dynamic: true,
      })
    );

    if (xAxis) {
      xAxis.data.setAll(data);
      series.data.setAll(data);
    }
  }, [data, selectedYear]);

  const handleApply = () => {
    setSelectedYear(tempYear);
    onYearChange?.(tempYear);
  };

  const handleReset = () => {
    setTempYear(defaultYear);
    setSelectedYear(defaultYear);
    onYearChange?.(defaultYear);
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <div className="flex items-center gap-4 mb-6">
        <div>
          <label className="block text-sm text-gray-600 mb-2">Tahun</label>
          <select
            value={tempYear}
            onChange={(e) => setTempYear(e.target.value)}
            className="w-40 px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none cursor-pointer"
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-2 mt-6">
          <button
            onClick={handleApply}
            className="px-6 py-2 cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors text-sm"
          >
            TERAPKAN
          </button>
          <button
            onClick={handleReset}
            className="px-6 py-2 cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors text-sm"
          >
            RESET
          </button>
        </div>

        {showLegend && (
          <div className="ml-auto flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }}></div>
            <span className="text-sm text-gray-600">{title}</span>
          </div>
        )}
      </div>

      <div ref={chartDivRef} style={{ width: "100%", height: `${height}px` }} />
    </div>
  );
};

// Demo component
const Demo = () => {
  const sampleData = [
    { month: "Jan", value: 120 },
    { month: "Feb", value: 180 },
    { month: "Mar", value: 350 },
    { month: "Apr", value: 520 },
    { month: "May", value: 280 },
    { month: "Jun", value: 190 },
    { month: "Jul", value: 250 },
    { month: "Aug", value: 220 },
    { month: "Sep", value: 320 },
    { month: "Oct", value: 270 },
    { month: "Nov", value: 100 },
    { month: "Dec", value: 140 },
  ];

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* <h1 className="text-2xl font-bold mb-6">Affiliate Chart Demo</h1> */}
      <AffiliateChart
        data={sampleData}
        years={["2023", "2024", "2025"]}
        defaultYear="2025"
        title="Earnings"
        showLegend={true}
        height={400}
        color="#10b981"
      />
    </div>
  );
};

export default Demo;
