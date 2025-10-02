import useStepRegisterStore from '@/stores/use-register-step';
import React from 'react';

const RequestFormComponent: React.FC = () => {
    
  const { currentStep, incrementStep, decrementStep } = useStepRegisterStore(); // Get and set current step from Zustand store

  
  return (
    <div className="max-w-full p-6 mx-4 my-2 sm:px-6 sm:py-8 md:px-10 md:py-20 lg:px-16 lg:py-20 sm:mx-4 md:mx-10 lg:mx-16 bg-white rounded-lg shadow-lg transform scale-90">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Lengkapi Data Dirimu</h2>
      <p className="text-gray-600 mb-6">Isi informasi pribadi dengan benar untuk mempermudah proses aktivasi akun dan pengelolaan layananmu.</p>
      
      <form>
        <div className="mb-6">
          <label htmlFor="nama-lengkap" className="block text-gray-700 text-sm font-medium mb-2">Nama Lengkap</label>
          <input
            type="text"
            id="nama-lengkap"
            placeholder="Nama Lengkap..."
            className="w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-c"
          />
        </div>
        
        <div className="mb-6">
          <label htmlFor="nama-usaha" className="block text-gray-700 text-sm font-medium mb-2">Nama Usaha</label>
          <input
            type="text"
            id="nama-usaha"
            placeholder="Nama Usaha..."
            className="w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-c"
          />
        </div>

        {/* Flex container for Email and No Telpon with mobile-first and responsive layout */}
        <div className="flex flex-col sm:flex-row lg:flex-row mb-6 gap-6">
          <div className="sm:w-full lg:w-1/2">
            <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              id="email"
              placeholder="johndoe@gmail.com"
              className="w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-c"
            />
          </div>

          <div className="sm:w-full lg:w-1/2">
            <label htmlFor="no-telepon" className="block text-gray-700 text-sm font-medium mb-2">No Telpon</label>
            <input
              type="text"
              id="no-telepon"
              placeholder="08********"
              className="w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-c"
            />
          </div>
        </div>

        {/* Button Container with responsive positioning */}
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
      </form>
    </div>
  );
}

export default RequestFormComponent;
