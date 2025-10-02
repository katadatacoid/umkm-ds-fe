import useStepRegisterStore from '@/stores/use-register-step';
import { useState, useMemo, useEffect } from 'react';
import PricingCard from '@/app/ui/card/price-card';
import { motion } from 'framer-motion';

type BillingCycle = "monthly" | "yearly";

interface PlanInput {
  id: string;
  title: string;
  plan: string;
  description?: string;
  monthlyPrice: string;
  yearlyPrice: string;
  features: string[];
  highlighted?: boolean;
}

interface SectionPriceProps {
  plans: PlanInput[];
  defaultCycle?: BillingCycle;
  onSelectPlan: (selectedPlan: PlanInput | null, selectedCycle: BillingCycle) => void; // Callback for parent with cycle
}

interface CycleButtonProps {
  cycle: BillingCycle;
  currentCycle: BillingCycle;
  onClick: (nextCycle: BillingCycle) => void;
  label: string;
  subText?: string;
  css?: string;
}

const CycleButton = ({
  cycle,
  currentCycle,
  onClick,
  label,
  subText,
  css,
}: CycleButtonProps) => (
  <button
    onClick={() => onClick(cycle)}
    className={`w-40 sm:w-48 h-16 px-6 py-3 ${css} ${
      currentCycle === cycle ? "bg-green-c text-white" : "bg-gray-200 text-gray-700"
    } transition duration-200 flex flex-col items-center justify-center`}
    aria-pressed={currentCycle === cycle}
  >
    <span>{label}</span>
    {subText && <small className="text-xs opacity-90">{subText}</small>}
  </button>
);

function SectionPrice({ plans, defaultCycle, onSelectPlan }: SectionPriceProps) {
  const [cycle, setCycle] = useState<BillingCycle>(defaultCycle || 'monthly');
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null); // Store selected plan ID
  const isMonthly = cycle === "monthly";

  const displayedPlans = useMemo(() => {
    return plans.map((p) => ({
      ...p,
      price: isMonthly ? p.monthlyPrice : p.yearlyPrice, // Apply pricing based on the cycle
    }));
  }, [plans, isMonthly]);

  const handleSetCycle = (next: BillingCycle) => {
    setCycle(next);
    onSelectPlan(null, next); // Pass the cycle to parent whenever it changes
  };

  const handleSelectCard = (plan: PlanInput) => {
    const isSelected = selectedPlanId === plan.id;

    // Toggle the selection: if already selected, unselect, else select the new one
    setSelectedPlanId(isSelected ? null : plan.id);

    // Pass null if unselected, or the plan if selected, along with the current cycle
    onSelectPlan(isSelected ? null : plan, cycle);
  };

  const monthlyPlans = displayedPlans.filter(p => p.monthlyPrice);
  const yearlyPlans = displayedPlans.filter(p => p.yearlyPrice);

  return (
    <div>
      <div className="flex flex-col justify-start sm:justify-center items-center text-center h-auto mt-2 sm:mt-10 px-5 sm:px-6 lg:px-20">
        <div className="flex justify-start items-start h-auto mb-4">
          {/* Cycle Buttons */}
          <CycleButton
            cycle="monthly"
            currentCycle={cycle}
            onClick={handleSetCycle}
            css="rounded-l-lg"
            label="Bulanan"
          />
          <CycleButton
            cycle="yearly"
            currentCycle={cycle}
            onClick={handleSetCycle}
            label="Tahunan"
            css="rounded-r-lg"
            subText="Hemat hingga 17%"
          />
        </div>
      </div>

      {/* Monthly Plans */}
      {cycle === 'monthly' && (
        <motion.div
          key="monthly"
          className="mt-10 overflow-x-auto sm:overflow-x-auto md:overflow-x-auto lg:overflow-x-hidden"
          initial={{ x: 200, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100, damping: 25 }}
        >
          <div className="flex space-x-4 px-4 min-w-max justify-center">
            {monthlyPlans.map((p) => (
              <PricingCard
                id={p.id}
                key={p.title}
                title={p.title}
                plan={p.plan}
                price={p.price}
                description={p.description ?? ""}
                features={p.features}
                textButton={selectedPlanId === p.id ? 'Terpilih' : 'Pilih'}
                onTapButton={() => handleSelectCard(p)} // Select card on tap
                selected={selectedPlanId === p.id} // Add a selected indicator
              />
            ))}
          </div>
        </motion.div>
      )}

      {/* Yearly Plans */}
      {cycle === 'yearly' && (
        <motion.div
          key="yearly"
          className="mt-10 overflow-x-auto sm:overflow-x-auto md:overflow-x-auto lg:overflow-x-hidden"
          initial={{ x: 200, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100, damping: 25 }}
        >
          <div className="flex space-x-4 px-4 min-w-max justify-center">
            {yearlyPlans.map((p) => (
              <PricingCard
                id={p.id}
                key={p.title}
                title={p.title}
                plan={p.plan}
                price={p.price}
                description={p.description ?? ""}
                features={p.features}
                textButton={selectedPlanId === p.id ? 'Terpilih' : 'Pilih'}
                onTapButton={() => handleSelectCard(p)} // Select card on tap
                selected={selectedPlanId === p.id} // Add a selected indicator
              />
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}

const ChooseYourPackageFragment: React.FC = () => {
  const { currentStep, incrementStep, decrementStep } = useStepRegisterStore();

  const [plans, setPlans] = useState<PlanInput[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await fetch("/api/plans");
        if (!res.ok) throw new Error("Failed to fetch plans");
        const data: PlanInput[] = await res.json();
        setPlans(data);
      } catch (err: any) {
        setError("Failed to load plans");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const handleSelectPlan = (selectedPlan: PlanInput | null, cycle: BillingCycle) => {
    console.log('Selected Plan:', selectedPlan);
    console.log('Selected Cycle:', cycle); // Log cycle (monthly/yearly)
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="spinner"></div> {/* Loading spinner */}
      </div>
    );
  }
  
  if (error) return <div>{error}</div>;

  return (
    <div className="container mx-auto p-8 transform scale-90 rounded-lg shadow-lg">
      <h1 className="text-2xl font-semibold mb-6">Pilih Paket Sesuai Kebutuhanmu</h1>
      <p className="text-gray-600 mb-10">
        Sesuaikan fitur dan layanan dengan kebutuhan bisnismu. Pilih paket terbaik untuk mulai membangun website impianmu
      </p>

      <SectionPrice plans={plans} onSelectPlan={handleSelectPlan} defaultCycle="monthly" />

      <div className="flex flex-row sm:flex-row justify-between sm:justify-end gap-4 mt-5">
        <button
          onClick={decrementStep}
          type="button"
          className="px-6 py-3 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition duration-300 sm:w-auto w-full"
        >
          Sebelumnya
        </button>
        <button
          onClick={incrementStep}
          type="button"
          className="px-6 py-3 bg-green-c text-white rounded-md hover:bg-green-600 transition duration-300 sm:w-auto w-full"
        >
          Selanjutnya
        </button>
      </div>
    </div>
  );
};

export default ChooseYourPackageFragment;

