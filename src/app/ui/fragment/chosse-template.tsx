import useStepRegisterStore from '@/stores/use-register-step';
import React from 'react';

const TemplateSelection: React.FC = () => {

  const { currentStep, incrementStep, decrementStep } = useStepRegisterStore(); // Get and set current step from Zustand store

  const templates = [
    { title: "Savor the Freshness of Autumn", description: "Enjoy seasonal favorites with our wide selection of delicious offerings." },
    { title: "Discover Amazing Deals on Fresh Goods", description: "Shop now to find irresistible discounts on your favorite products." },
    { title: "What’s Fresh for Your Cart?", description: "Explore our seasonal selections and make your meals even more special." },
    { title: "Get Fresh Vegetables at Big Discounts", description: "Stock up on nutritious veggies at unbeatable prices today." },
    { title: "Snack Time, Anytime", description: "Grab your favorite snacks daily with our convenient shopping options." },
    { title: "Fresh, Healthy, and Ready for You", description: "Explore our fresh produce selection to brighten up your meals." },
  ];

  return (
    <div className="container mx-auto p-4 sm:p-8 transform scale-90 rounded-lg shadow-lg">
      <h1 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">Pilih Template yang Sesuai dengan Bisnis Anda</h1>
      <p className="text-sm sm:text-gray-600 mb-8 sm:mb-10">Temukan desain yang sempurna untuk bisnis Anda dan buat pengalaman berbelanja online yang menarik bagi pelanggan.</p>

      {/* Tailwind grid layout with responsive columns */}
      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
        {templates.map((template, index) => (
          <li key={index} className="border rounded-lg p-3 sm:p-4 bg-white shadow-lg flex flex-col">
            <h2 className="font-semibold text-lg sm:text-xl mb-2">{template.title}</h2>
            <p className="text-xs sm:text-gray-600 mb-3 sm:mb-4">{template.description}</p>
            <button className="mt-auto w-full py-2 sm:py-3 bg-green-c text-white rounded-lg hover:bg-green-600 transition duration-300">
              Pilih Template
            </button>
          </li>
        ))}
      </ul>

      {/* Button Container with responsive positioning */}
      <div className="flex flex-col sm:flex-row justify-between sm:justify-end gap-4 mt-4 sm:mt-5">
        <button
          onClick={decrementStep}
          type="button"
          className="px-4 sm:px-6 py-2 sm:py-3 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition duration-300 w-full sm:w-auto"
        >
          Sebelumnya
        </button>
        <button
          onClick={incrementStep}
          type="button"
          className="px-4 sm:px-6 py-2 sm:py-3 bg-green-c text-white rounded-md hover:bg-green-600 transition duration-300 w-full sm:w-auto"
        >
          Selanjutnya
        </button>
      </div>
    </div>
  );
};

export default TemplateSelection;
