// src/stores/use-step-store.ts
import { create, StateCreator } from 'zustand';
import { devtools, DevtoolsOptions } from 'zustand/middleware';

interface StepRegisterStore {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  incrementStep: () => void;
  decrementStep: () => void;
}

const useStepRegisterStore = create<StepRegisterStore>()(
  devtools((set) => ({
    currentStep: 0,
    setCurrentStep: (step) => set({ currentStep: step }),
    incrementStep: () => set((state) => ({ currentStep: state.currentStep + 1 })),
    decrementStep: () => set((state) => ({ currentStep: state.currentStep - 1 }))
  }), { name: "StepRegisterStore" }))

export default useStepRegisterStore;


