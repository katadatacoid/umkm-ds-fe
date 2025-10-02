// /src//useStore.ts
import {create,StateCreator} from 'zustand';
import { devtools ,DevtoolsOptions} from 'zustand/middleware';

type Store = {
  count: number;
  increase: () => void;
  decrease: () => void;
};

// Wrap the store creation in devtools correctly
const useStore = create<Store>()(
  devtools((set) => ({
    count: 0,
    increase: () => set((state) => ({ count: state.count + 1 })),
    decrease: () => set((state) => ({ count: state.count - 1 })),
  }),{name : "count"}) // devtools setup with a name for debugging
);

export default useStore;
