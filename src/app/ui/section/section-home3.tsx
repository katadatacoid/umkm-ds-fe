'use client'

import { motion } from 'framer-motion';
import Image from 'next/image';

type FeatureSectionProps = {
    title: string;
    description: string;
    imageSrc: string;
    imageFirst: boolean;
};

const FeatureSection = ({ title, description, imageSrc, imageFirst }: FeatureSectionProps) => {
    return (
        <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 px-6 sm:px-10 lg:px-20 lg:mt-30"
            initial={{ opacity: 0, y: 50 }} // Start off-screen with opacity 0
            whileInView={{ opacity: 1, y: 0 }} // Animate to full opacity and original position
            viewport={{ once: true, amount: 0.2 }} // Trigger the animation once the section is visible
            transition={{ duration: 0.8 }} // Duration of the transition
        >
            {/* Column 1 */}
            <div className={`px-2 sm:px-10 flex flex-col justify-center items-center sm:items-start order-2 sm:${imageFirst ? 'order-2' : 'order-1'}`}>
                <p className="text-green-600 mb-2 text-center sm:text-left">
                    Our Features
                </p>
                {/* title */}
                <h4 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-gray-800 mb-4 text-center sm:text-start">
                    {title}
                </h4>
                {/* description */}
                <p className="text-gray-700 mb-6 text-center sm:text-start">
                    {description}
                </p>
            </div>

            {/* Column 2 with Image */}
            <div className={`px-2 flex justify-center items-center order-1 sm:${imageFirst ? 'order-1' : 'order-2'} col-span-1 sm:col-span-1`}>
                {/* Image for Column 2 */}
                <Image
                    src={imageSrc} // Dynamic image source
                    alt={title} // Alt text based on the title
                    width={595} // Set the desired width for desktop screens
                    height={504} // Set the desired height (adjust the ratio)
                    className="sm:w-1/2 md:w-3/4 lg:w-full h-auto" // Makes the image responsive
                    layout="intrinsic" // Ensures the image respects its aspect ratio
                />
            </div>
        </motion.div>
    );
};

export default function SectionHome3() {
    return (
        <div>
            {/* Example of the FeatureSection component usage */}
            <FeatureSection
                title="Pengelolaan & Pemeliharaan Website"
                description="Kami tahu banyak pelaku UMKM sibuk mengurus bisnis sehari-hari.
                             Karena itu, kami bantu memastikan website Anda tetap berjalan
                             lancar dengan pemeliharaan rutin dan dukungan teknis yang siap
                             setiap saat."
                imageSrc="/images/images-services.png"
                imageFirst={true}
            />
            <FeatureSection
                title="Domain & Hosting Profesional"
                description="Membangun kepercayaan pelanggan dimulai dari alamat online yang meyakinkan. Dengan domain khusus bisnis Anda dan hosting yang cepat serta aman, usaha kecil bisa tampil besar di mata pelanggan."
                imageSrc="/images/webhosting.png"
                imageFirst={false}
            />
            <FeatureSection
                title="Panduan Lengkap untuk Pengguna"
                description="Tak perlu khawatir soal teknis. Kami siapkan panduan sederhana agar Anda bisa mengelola website sendiri dengan mudah, sehingga lebih banyak waktu bisa difokuskan untuk mengembangkan usaha."
                imageSrc="/images/panduan-pengguna.png"
                imageFirst={true}
            />
        </div>
    );
}
