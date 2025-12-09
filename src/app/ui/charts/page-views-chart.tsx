"use client";

import React, { useLayoutEffect, useRef, useMemo, useEffect } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import { useUserDashboardStore } from "@/stores/use-user-dashboard-store";

const PageViewsChart: React.FC = () => {
  const chartRef = useRef<HTMLDivElement>(null);

  // Zustand store
  const { pageViewsChart, setPageViewsFilter, setPageViewsData } = useUserDashboardStore();

  const { filter, data } = pageViewsChart;

  // Dummy alternative datasets for switching
  const datasets = {
    week: [
      { label: "Mon", pageViews: 3 },
      { label: "Tue", pageViews: 7 },
      { label: "Wed", pageViews: 5 },
      { label: "Thu", pageViews: 6 },
      { label: "Fri", pageViews: 8 },
      { label: "Sat", pageViews: 4 },
      { label: "Sun", pageViews: 9 },
    ],
    month: [
      { label: "Week 1", pageViews: 20 },
      { label: "Week 2", pageViews: 35 },
      { label: "Week 3", pageViews: 28 },
      { label: "Week 4", pageViews: 42 },
    ],
    year: [
      { label: "Jan", pageViews: 120 },
      { label: "Feb", pageViews: 160 },
      { label: "Mar", pageViews: 130 },
      { label: "Apr", pageViews: 180 },
      { label: "May", pageViews: 220 },
      { label: "Jun", pageViews: 200 },
      { label: "Jul", pageViews: 240 },
      { label: "Aug", pageViews: 260 },
      { label: "Sep", pageViews: 300 },
      { label: "Oct", pageViews: 310 },
      { label: "Nov", pageViews: 280 },
      { label: "Dec", pageViews: 350 },
    ],
  };

  // Whenever filter changes, update Zustand data
  useEffect(() => {
    setPageViewsData(datasets[filter]);
  }, [filter]);

  const currentData = useMemo(() => data, [data]);

  // Render chart
  useLayoutEffect(() => {
    if (!chartRef.current || !currentData?.length) return;

    // let root = am5.Root.new(chartRef.current);
    let root: am5.Root | null = am5.Root.new(chartRef.current);
    root.setThemes([am5themes_Animated.new(root)]);

    const chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panY: false,
        wheelY: "none",
        layout: root.verticalLayout,
        paddingLeft: 10,
        paddingRight: 10,
      })
    );

    const cursor = chart.set("cursor", am5xy.XYCursor.new(root, {}));
    cursor.lineY.set("visible", false);

    const maxValue = Math.max(...currentData.map((d) => d.pageViews));
    const roundedMax = Math.ceil(maxValue / 10) * 10;

    const yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        min: 0,
        max: roundedMax,
        strictMinMax: true,
        renderer: am5xy.AxisRendererY.new(root, {
          minGridDistance: 40,
        }),
      })
    );

    const xAxis = chart.xAxes.push(
      am5xy.CategoryAxis.new(root, {
        renderer: am5xy.AxisRendererX.new(root, { minGridDistance: 30 }),
        categoryField: "label",
      })
    );

    xAxis.data.setAll(currentData);

    const series = chart.series.push(
      am5xy.SmoothedXLineSeries.new(root, {
        name: "Page Views",
        xAxis,
        yAxis,
        valueYField: "pageViews",
        categoryXField: "label",
        stroke: am5.color("#41b57a"),
        tooltip: am5.Tooltip.new(root, {
          labelText: "{categoryX}: {valueY}",
        }),
      })
    );

    series.strokes.template.setAll({ strokeWidth: 3 });

    const gradient = am5.LinearGradient.new(root, {
      stops: [
        { opacity: 0.4, color: am5.color("#41b57a") },
        { opacity: 0.05, color: am5.color(0xffffff) },
      ],
    });

    series.fills.template.setAll({ fillGradient: gradient, visible: true });

    series.data.setAll(currentData);
    chart.appear(1000, 100);

    return () => {
      root?.dispose();
      root = null;
    };
  }, [currentData]);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mt-5">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Page Views</h3>
          <p className="text-sm text-gray-500">Periode: {filter}</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-3 mb-6 border-b border-gray-200">
        {["week", "month", "year"].map((tab) => (
          <button
            key={tab}
            onClick={() => setPageViewsFilter(tab as "week" | "month" | "year")}
            className={`relative pb-2 text-sm font-medium transition-colors ${
              filter === tab ? "text-emerald-600" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
            {filter === tab && (
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-emerald-600 rounded-full transition-all" />
            )}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="relative w-full overflow-x-auto scrollbar-hide">
        <div
          ref={chartRef}
          className="min-w-[600px] sm:min-w-[700px] md:min-w-full h-[300px] sm:h-[350px] md:h-[400px]"
        ></div>
      </div>
      <div className="text-xs pt-2 text-gray-400 italic text-center mt-1 sm:hidden">
        Geser chart ke kanan untuk melihat hari, minggu, dan bulan lainnya →
      </div>
    </div>
  );
};

export default PageViewsChart;
