import { devtools, persist } from "zustand/middleware";
import { create } from "zustand";

export const useCallLeads = create(
  devtools(
    persist(
      (set) => ({
        CallData: {}, 
        
        setDefaultList: (newData) =>
          set(() => ({
            CallData: newData,
          })),
        
        resetDefaultList: () =>
          set(() => ({
            CallData: {},
          })),
      }),
      {
        name: "CallData", 
      }
    )
  )
);