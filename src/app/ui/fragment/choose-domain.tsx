import useStepRegisterStore from '@/stores/use-register-step';
import React from 'react';

const DomainSearchFragment: React.FC = () => {

  const { currentStep, incrementStep, decrementStep } = useStepRegisterStore(); // Get and set current step from Zustand store

  
  return (
    <div className="bg-white p-6 sm:p-10 rounded-lg shadow-lg max-w-full mx-3 my-2 lg:mx-10 transform scale-90">
      <h2 className="text-base sm:text-2xl font-semibold text-gray-900 mb-4">
        Temukan Domain yang Tepat untuk Bisnis Anda
      </h2>
      <p className="text-sm sm:text-md text-gray-600 mb-6">
        Pemilihan nama domain yang tepat akan membantu membangun identitas brand Anda dan mempermudah pelanggan menemukan bisnis Anda secara online.
      </p>
      <div className="flex items-center border-1 border-green-c bg-gray-50 rounded-3xl px-4 py-1 sm:px-4 md:py-2">
        <input
          type="text"
          placeholder="Cari Domain.."
          className="w-full text-sm sm:text-md  text-gray-700 placeholder-gray-500 focus:outline-none "
        />
        <button className="w-35 lg:w-45 text-sm text-center text-green-c  py-2 px-3  sm:py-2 sm:p-2 focus:outline-none focus:bg-green-c focus:text-white focus:rounded-xl hover:bg-green-c hover:text-white hover:rounded-2xl">
          Cari Domain
        </button>
      </div>
      <div className="mt-6 text-right">
      <button
          onClick={incrementStep}
            type="button"
            className="px-6 py-3 bg-green-c text-white rounded-md hover:bg-green-600 transition duration-300 sm:w-auto"
          >
            Selanjutnya
          </button>
      </div>
    </div>
  );
};

export default DomainSearchFragment;
