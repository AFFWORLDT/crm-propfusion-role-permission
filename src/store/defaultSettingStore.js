import { devtools, persist } from "zustand/middleware";
import { create } from "zustand";

export const useDefaultSetting = create(
  devtools(
    persist(
      (set) => ({
        view: "table",  
        leadView: "pipeline",  
        pipeline: "pipeline", 

        setDefaultListView: (view) => set({ view }),
        setDefaultLeadView: (leadView) => set({ leadView }),
        setPipeline: (pipeline) => set({ pipeline }), 
        resetDefaultLeadView: () => set({ leadView: null }),
        resetDefaultListView: () => set({ view: null }),
    
      }),
      {
        name: "prop-fusion", 
      }
    )
  )
);
