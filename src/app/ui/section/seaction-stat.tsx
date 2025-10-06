import StatCard from "@/app/ui/card/stat-card";

interface StatItem {
    title: string;
    value: number | string;
    percentage?: number;
    description?: string;
  }
  
  interface StatsSectionProps {
    title?: string; // opsional: header section
    stats: StatItem[];
    className?: string; // custom tambahan style
  }
  
  const StatsSection: React.FC<StatsSectionProps> = ({ title, stats, className }) => {
    return (
      <section className={`w-full mt-4 ${className || ""}`}>
        {/* Optional Section Header */}
        {title && (
          <h2 className="text-sm sm:text-base font-semibold text-gray-700 mb-3 sm:mb-4">
            {title}
          </h2>
        )}
  
        {/* Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {stats.map((item, i) => (
            <StatCard
              key={i}
              title={item.title}
              value={item.value}
              percentage={item.percentage}
              description={item.description}
            />
          ))}
        </div>
      </section>
    );
  };

  export default StatsSection
  