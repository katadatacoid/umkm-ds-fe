// /src/useStore.ts
import { create } from 'zustand';
import { createJSONStorage ,persist} from 'zustand/middleware';

type Store = {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
};

// Zustand store without persistence to localStorage
const useStore = create<Store>()(
  persist(
    (set) => ({
      isSidebarOpen: false, // Initial state set to false
      toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })), // Toggle sidebar state
    }),
    { name: 'sidebarStore' } // devtools setup with a name for debugging
  )
);

export default useStore;
