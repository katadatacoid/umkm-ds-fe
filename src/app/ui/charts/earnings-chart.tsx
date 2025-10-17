"use client";

import React, { useLayoutEffect, useRef, useState } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

interface ChartDataItem {
  month: string;
  category1: number;
  category2: number;
  category3: number;
  category4: number;
  customTotal?: number;
}

interface EarningsChartProps {
  data?: ChartDataItem[];
}

const EarningsChart: React.FC<EarningsChartProps> = ({ data }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<"weekly" | "monthly" | "yearly">("monthly");

  // Dummy datasets (bisa nanti diganti dari props / API)
  const weeklyData = [
    { month: "Mon", category1: 50, category2: 80, category3: 70, category4: 40 },
    { month: "Tue", category1: 60, category2: 90, category3: 60, category4: 30 },
    { month: "Wed", category1: 40, category2: 60, category3: 80, category4: 50 },
    { month: "Thu", category1: 70, category2: 100, category3: 90, category4: 60 },
    { month: "Fri", category1: 80, category2: 110, category3: 100, category4: 70 },
  ];

  const monthlyData = [
    { month: "Jan", category1: 150, category2: 200, category3: 180, category4: 120 },
    { month: "Feb", category1: 180, category2: 220, category3: 200, category4: 140 },
    { month: "Mar", category1: 280, category2: 250, category3: 220, category4: 160 },
    { month: "Apr", category1: 180, category2: 200, category3: 180, category4: 130 },
    { month: "May", category1: 220, category2: 240, category3: 200, category4: 150 },
    { month: "Jun", category1: 160, category2: 180, category3: 170, category4: 120 },
  ];

  const yearlyData = [
    { month: "2021", category1: 800, category2: 1000, category3: 900, category4: 700 },
    { month: "2022", category1: 950, category2: 1200, category3: 1100, category4: 850 },
    { month: "2023", category1: 1020, category2: 1300, category3: 1250, category4: 1000 },
    { month: "2024", category1: 1100, category2: 1400, category3: 1300, category4: 1200 },
  ];

  const currentData =
    activeTab === "weekly" ? weeklyData : activeTab === "monthly" ? monthlyData : yearlyData;

  useLayoutEffect(() => {
    if (!chartRef.current) return;

    // Create root element
    const root = am5.Root.new(chartRef.current);

    // Set themes
    root.setThemes([am5themes_Animated.new(root)]);

    // Create chart
    const chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: false,
        panY: false,
        wheelX: "none",
        wheelY: "none",
        paddingLeft: 10,
        paddingRight: 10,
      })
    );

    // Add cursor
    const cursor = chart.set("cursor", am5xy.XYCursor.new(root, {}));
    cursor.lineY.set("visible", false);

    // Create axes
    const xRenderer = am5xy.AxisRendererX.new(root, {
      minGridDistance: 30,
      cellStartLocation: 0.2,
      cellEndLocation: 0.8,
    });

    xRenderer.labels.template.setAll({
      fontSize: 12,
      fill: am5.color(0x9ca3af),
    });

    xRenderer.grid.template.setAll({
      strokeOpacity: 0,
    });

    const xAxis = chart.xAxes.push(
      am5xy.CategoryAxis.new(root, {
        categoryField: "month",
        renderer: xRenderer,
        tooltip: am5.Tooltip.new(root, {}),
      })
    );

    const yRenderer = am5xy.AxisRendererY.new(root, {
      strokeOpacity: 0,
    });

    yRenderer.labels.template.setAll({
      fontSize: 12,
      fill: am5.color(0x9ca3af),
    });

    yRenderer.grid.template.setAll({
      stroke: am5.color(0xf0f0f0),
      strokeWidth: 1,
    });

    const yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        min: 0,
        extraMax: 0.1, // beri sedikit ruang di atas bar
        strictMinMax: false,
        maxPrecision: 0,
        numberFormat: "#,###",
        renderer: yRenderer,
      })
    );

    // Sample data - replace with your prop data
    const chartData = data || currentData;

    // Create series function
    function makeSeries(name: string, fieldName: string, color: string, isLast: boolean = false) {
      const series = chart.series.push(
        am5xy.ColumnSeries.new(root, {
          name,
          xAxis,
          yAxis,
          valueYField: fieldName,
          categoryXField: "month",
          stacked: true,
          tooltip: isLast
            ? am5.Tooltip.new(root, {
                labelText: "[bold]{categoryX}[/]\nTotal: [#ffffff]{customTotal}[/]",
                getFillFromSprite: false,
                autoTextColor: false,
                label: am5.Label.new(root, {
                  fill: am5.color(0xffffff),
                  fontSize: 13,
                  fontWeight: "500",
                }),
                background: am5.Rectangle.new(root, {
                  fill: am5.color(0x1e293b), // slate-800
                  fillOpacity: 0.95,
                  cornerRadiusTL: 6,
                  cornerRadiusTR: 6,
                  cornerRadiusBL: 6,
                  cornerRadiusBR: 6,
                }),
              })
            : undefined,
        })
      );

      series.columns.template.setAll({
        strokeOpacity: 0,
        cornerRadiusTL: isLast ? 4 : 0,
        cornerRadiusTR: isLast ? 4 : 0,
        width: am5.percent(60),
        tooltipY: 0,
        fill: am5.color(color),
      });

      // Hitung total manual
      const updatedData = chartData.map((item) => {
        const total = item.category1 + item.category2 + item.category3 + item.category4;
        return { ...item, customTotal: total };
      });

      series.data.setAll(updatedData);
      series.appear(1000);

      return series;
    }

    // Create stacked series - colors from the design
    makeSeries("Category 1", "category1", "#22d3ee", false); // Cyan
    makeSeries("Category 2", "category2", "#06b6d4", false); // Teal
    makeSeries("Category 3", "category3", "#6b7280", false); // Gray
    makeSeries("Category 4", "category4", "#d1d5db", true); // Light gray with rounded top

    xAxis.data.setAll(chartData);

    // Make stuff animate on load
    chart.appear(1000, 100);

    return () => {
      root.dispose();
    };
  }, [data, activeTab]);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 bg-gray-100 rounded flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                <path d="M192 160L192 144C192 99.8 278 64 384 64C490 64 576 99.8 576 144L576 160C576 190.6 534.7 217.2 474 230.7C471.6 227.9 469.1 225.2 466.6 222.7C451.1 207.4 431.1 195.8 410.2 187.2C368.3 169.7 313.7 160.1 256 160.1C234.1 160.1 212.7 161.5 192.2 164.2C192 162.9 192 161.5 192 160.1zM496 417L496 370.8C511.1 366.9 525.3 362.3 538.2 356.9C551.4 351.4 564.3 344.7 576 336.6L576 352C576 378.8 544.5 402.5 496 417zM496 321L496 288C496 283.5 495.6 279.2 495 275C510.5 271.1 525 266.4 538.2 260.8C551.4 255.2 564.3 248.6 576 240.5L576 255.9C576 282.7 544.5 306.4 496 320.9zM64 304L64 288C64 243.8 150 208 256 208C362 208 448 243.8 448 288L448 304C448 348.2 362 384 256 384C150 384 64 348.2 64 304zM448 400C448 444.2 362 480 256 480C150 480 64 444.2 64 400L64 384.6C75.6 392.7 88.5 399.3 101.8 404.9C143.7 422.4 198.3 432 256 432C313.7 432 368.3 422.3 410.2 404.9C423.4 399.4 436.3 392.7 448 384.6L448 400zM448 480.6L448 496C448 540.2 362 576 256 576C150 576 64 540.2 64 496L64 480.6C75.6 488.7 88.5 495.3 101.8 500.9C143.7 518.4 198.3 528 256 528C313.7 528 368.3 518.3 410.2 500.9C423.4 495.4 436.3 488.7 448 480.6z" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-gray-800">Total Earnings</h2>
          </div>
          <div className="mb-1">
            <span className="text-xs text-gray-500">Total January income</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-gray-900">2.960K</span>
            <span className="text-sm font-medium text-green-500 bg-green-50 px-2 py-1 rounded">
              ↑ 97%
            </span>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-6 border-b border-gray-200">
        {["weekly", "monthly", "yearly"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as "weekly" | "monthly" | "yearly")}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab
                ? "text-blue-600 border-blue-600"
                : "text-gray-500 border-transparent hover:text-gray-700"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Chart */}
      {/* <div ref={chartRef} style={{ width: "100%", height: "350px" }}></div> */}
      <div ref={chartRef} className="w-full h-[300px] sm:h-[350px] md:h-[400px]"></div>
    </div>
  );
};

export default EarningsChart;
