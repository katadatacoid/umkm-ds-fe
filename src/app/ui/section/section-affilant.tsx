'use client'

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import AffiliateCard , {Feature} from '../card/affli-card';

export default function SectionAffiliate() {

     // Features with the correct object structure (featureText and widgetIcon)
  const features1: Feature[] = [
    { featureText: 'Komisi: 20% dari pembelian pertama', widgetIcon: '/images/money.png' },
    { featureText: 'Durasi Cookie: 30 hari', widgetIcon: '/images/timer.png' },
    { featureText: 'Minimum Payout: Rp 100.000', widgetIcon: '/images/card.png' }
  ];

  const features2: Feature[] = [
    { featureText: '25% pembelian pertama + 5% langganan', widgetIcon: '/images/money.png' },
    { featureText: 'Durasi Cookie: 45 hari', widgetIcon: '/images/timer.png' },
    { featureText: 'Minimum Payout: Rp 75.000', widgetIcon: '/images/card.png' }
  ];

  const features3: Feature[] = [
    { featureText: '30% pembelian pertama + 10% langganan', widgetIcon: '/images/money.png' },
    { featureText: 'Durasi Cookie: 60 hari', widgetIcon: '/images/timer.png' },
    { featureText: 'Minimum Payout: Rp 50.000', widgetIcon: '/images/card.png' }
  ];

  const router = useRouter();

  const navigateToInfo = () => {
    router.push('/daftar-afiliasi');
  };

    return (
        <div>
            <div className="flex flex-col justify-start sm:justify-center items-center text-center h-auto mt-10 sm:mt-30 px-5 sm:px-6 lg:px-20">
                <small className="text-green-c mb-2 text-center text-base lg:text-lg font-bold">Affiliate Program</small>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-800 mb-2">
                    Program Afiliasi Rumah Digital UMKM
                </h2>
                <p className="font-normal text-[#535a56] text-base lg:text-lg max-w-3xl">
                    Bantu sesama UMKM go digital, dapatkan penghasilan tambahan setiap
                    kali ada yang daftar lewat rekomendasi Anda.
                </p>
            </div>


            {/* Conditional rendering based on selected */}
            <motion.div
                key="0"  // Add a key to trigger animation when selected changes
                className="mt-10 overflow-x-auto sm:overflow-x-auto md:overflow-x-auto lg:overflow-x-hidden"
                initial={{ x: 200, opacity: 0 }}  // Start from further right (200px) and invisible
                animate={{ x: 0, opacity: 1 }}   // Move to original position and become visible
                transition={{ type: 'spring', stiffness: 100, damping: 25 }} // Smooth easing transition
            >
                <div className="flex space-x-4 px-4 min-w-max justify-center">
                    <AffiliateCard
                        title="Starter"
                        plan="Starter Affiliate"
                        buttonText='Gabung Sebagai Starter Affiliate'
                        onButtonClick={navigateToInfo}
                        features={features1}
                    />
                    <AffiliateCard
                        title="Pro"
                        plan="Pro Affiliate"
                        buttonText='Jadi Pro Affiliate'
                        onButtonClick={navigateToInfo}
                        features={features2}
                    />
                    <AffiliateCard
                        title="Premium"
                        plan="Premium – Full Power"
                        buttonText='Raih Penghasilan Premium'
                        onButtonClick={navigateToInfo}
                        features={features3}
                    />
                </div>
            </motion.div>
        </div>
    );
}
