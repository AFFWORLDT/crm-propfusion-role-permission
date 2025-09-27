import { devtools, persist } from "zustand/middleware";
import { create } from "zustand";

export const useAllGlobalData = create()(
    devtools(
        persist(
            (set) => ({
                allGlobalData: {},
                setAllGlobalData: (data) => {
                    set({ allGlobalData: data });
                },
                removeAllGlobalData: () => {
                    set({ allGlobalData: {} });
                },
            }),
            {
                name: "prop-fusion",
            }
        )
    )
);

export default useAllGlobalData;
