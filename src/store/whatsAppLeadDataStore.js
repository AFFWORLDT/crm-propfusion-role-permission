import { devtools, persist } from "zustand/middleware";
import { create } from "zustand";

export const useWhatsAppLeads = create(
  devtools(
    persist(
      (set) => ({
        whatsAppData: {},

        setDefaultListView: (newView) =>
          set(() => ({
            whatsAppData: newView,
          })),

        resetDefaultListView: () =>
          set(() => ({
            whatsAppData: {}, 
          })),
      }),
      {
        name: "whatsAppLeads", 
      }
    )
  )
);
