'use client'

import Image from 'next/image';
import { useState, useEffect, useMemo } from 'react';
import PricingCard from '@/app/ui/card/price-card';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

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

    // Pass null if unselected, or the plan if selected, along with the current cycle
    onSelectPlan(plan, cycle);
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
                textButton={'Daftar'}
                onTapButton={() => handleSelectCard(p)} // Select card on tap
                selected={false} // Add a selected indicator
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
                textButton={'Daftar'}
                onTapButton={() => handleSelectCard(p)} // Select card on tap
                selected={false} // Add a selected indicator
              />
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default function SectionPriceT() {
     const [plans, setPlans] = useState<PlanInput[]>([]);
      const [loading, setLoading] = useState<boolean>(true);
      const [error, setError] = useState<string>("");
      const router = useRouter();
    
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
        router.push('/daftar')
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
        <div>
            <div className="flex flex-col justify-start sm:justify-center items-center text-center h-auto mt-10 sm:mt-30 px-5 sm:px-6 lg:px-20">
                <small className="text-green-c mb-2 text-center text-base lg:text-lg font-bold">Our Best Pricing</small>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-800 mb-2">
                    Paket Harga untuk Semua Kebutuhan UMKM
                </h2>
                <p className="font-normal text-[#535a56] text-base lg:text-lg max-w-3xl">
                    Pilih paket sesuai tahap bisnis Anda. Semua fitur utama sudah termasuk.
                </p>
            </div>
            <SectionPrice plans={plans} onSelectPlan={handleSelectPlan} defaultCycle="monthly" />
           

        </div>
    );
}
