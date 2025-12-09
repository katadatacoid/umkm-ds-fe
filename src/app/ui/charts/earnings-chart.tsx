"use client";

import React, { useLayoutEffect, useRef, useMemo, useEffect } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import { useUserDashboardStore } from "@/stores/use-user-dashboard-store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCoins } from "@fortawesome/free-solid-svg-icons";

const EarningsChart: React.FC = () => {
  const chartRef = useRef<HTMLDivElement>(null);

  const { earningsChart, setEarningsFilter, setEarningsData } = useUserDashboardStore();
  const { filter, data, percentage } = earningsChart;

  // Dummy alternatives (until backend integration)
  const datasets = {
    week: [
      { label: "Mon", amount: 200000 },
      { label: "Tue", amount: 250000 },
      { label: "Wed", amount: 180000 },
      { label: "Thu", amount: 300000 },
      { label: "Fri", amount: 260000 },
      { label: "Sat", amount: 200000 },
      { label: "Sun", amount: 240000 },
    ],
    month: [
      { label: "Week 1", amount: 400000 },
      { label: "Week 2", amount: 600000 },
      { label: "Week 3", amount: 550000 },
      { label: "Week 4", amount: 800000 },
    ],
    year: [
      { label: "Jan", amount: 500000 },
      { label: "Feb", amount: 600000 },
      { label: "Mar", amount: 550000 },
      { label: "Apr", amount: 700000 },
      { label: "May", amount: 750000 },
      { label: "Jun", amount: 680000 },
      { label: "Jul", amount: 720000 },
      { label: "Aug", amount: 800000 },
      { label: "Sep", amount: 830000 },
      { label: "Oct", amount: 870000 },
      { label: "Nov", amount: 920000 },
      { label: "Dec", amount: 1000000 },
    ],
  };

  // Whenever filter changes, update Zustand data
  useEffect(() => {
    setEarningsData(datasets[filter]);
  }, [filter]);

  const currentData = useMemo(() => data, [data]);

  const totalEarnings = useMemo(
    () => currentData.reduce((sum, item) => sum + item.amount, 0),
    [currentData]
  );

  useLayoutEffect(() => {
    if (!chartRef.current || !currentData?.length) return;

    // let root = am5.Root.new(chartRef.current);
    let root: am5.Root | null = am5.Root.new(chartRef.current);

    root.setThemes([am5themes_Animated.new(root)]);

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

    const cursor = chart.set("cursor", am5xy.XYCursor.new(root, {}));
    cursor.lineY.set("visible", false);

    const xRenderer = am5xy.AxisRendererX.new(root, {
      minGridDistance: 30,
      cellStartLocation: 0.2,
      cellEndLocation: 0.8,
    });

    xRenderer.labels.template.setAll({
      fontSize: 12,
      fill: am5.color(0x9ca3af),
    });

    const xAxis = chart.xAxes.push(
      am5xy.CategoryAxis.new(root, {
        categoryField: "label",
        renderer: xRenderer,
        tooltip: am5.Tooltip.new(root, {}),
      })
    );

    const yRenderer = am5xy.AxisRendererY.new(root, { strokeOpacity: 0 });
    yRenderer.labels.template.setAll({
      fontSize: 12,
      fill: am5.color(0x9ca3af),
    });

    const yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        min: 0,
        extraMax: 0.1,
        strictMinMax: false,
        maxPrecision: 0,
        numberFormat: "#,###",
        renderer: yRenderer,
      })
    );

    const series = chart.series.push(
      am5xy.ColumnSeries.new(root, {
        name: "Earnings",
        xAxis,
        yAxis,
        valueYField: "amount",
        categoryXField: "label",
        tooltip: am5.Tooltip.new(root, {
          labelText: "[bold]{categoryX}[/]\nRp {amount.formatNumber('#,###')}",
        }),
      })
    );

    const gradient = am5.LinearGradient.new(root, {
      stops: [
        { color: am5.color(0xacafbf), opacity: 1 },
        { color: am5.color(0x48bfe3), opacity: 1 },
      ],
      rotation: 90,
    });

    series.columns.template.setAll({
      strokeOpacity: 0,
      cornerRadiusTL: 6,
      cornerRadiusTR: 6,
      width: am5.percent(60),
      tooltipY: 0,
      fillGradient: gradient,
    });

    series.data.setAll(currentData);
    xAxis.data.setAll(currentData);
    chart.appear(1000, 100);

    return () => {
      root?.dispose();
      root = null;
    };
  }, [currentData]);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-yellow-50 rounded-lg flex items-center justify-center">
              <FontAwesomeIcon icon={faCoins} className="text-yellow-500 w-4 h-4" />
            </div>
            <h2 className="text-lg font-semibold text-gray-800">Total Earnings</h2>
          </div>
          <span className="text-xs text-gray-500">
            Periode:{" "}
            {filter === "week" ? "Mon - Sun" : filter === "month" ? "Week 1 - 4" : "Jan - Dec"}
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-bold text-gray-900">
              Rp {totalEarnings.toLocaleString("id-ID")}
            </span>
            {percentage && (
              <span className="text-sm font-medium text-green-500 bg-green-50 px-2 py-1 rounded">
                ↑ {percentage}%
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200">
        {["week", "month", "year"].map((tab) => (
          <button
            key={tab}
            onClick={() => setEarningsFilter(tab as "week" | "month" | "year")}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              filter === tab
                ? "text-blue-600 border-blue-600"
                : "text-gray-500 border-transparent hover:text-gray-700"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="relative w-full overflow-x-auto scrollbar-hide touch-pan-x">
        <div
          ref={chartRef}
          className={`h-[300px] sm:h-[350px] md:h-[400px] ${
            filter === "year" ? "min-w-[900px]" : "min-w-[600px] sm:min-w-[700px] md:min-w-full"
          }`}
        ></div>
      </div>
      <div className="text-xs pt-2 text-gray-400 italic text-center mt-1 sm:hidden">
        Geser chart ke kanan untuk melihat hari, minggu, dan bulan lainnya →
      </div>
    </div>
  );
};

export default EarningsChart;
