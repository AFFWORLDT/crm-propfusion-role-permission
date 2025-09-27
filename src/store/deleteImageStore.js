import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export const useDeleteImageStore = create()(
    devtools(
        persist(
            (set) => ({
                images: [],
                setImages: (images) => set({ images }),
                addImage: (image) => set((state) => ({ 
                    images: [...state.images, image] 
                })),
                removeImage: (imageUrl) => set((state) => ({
                    images: state.images.filter(img => img !== imageUrl)
                })),
                clearAllImages: () => set({ images: [] }),
                reorderImages: (newOrder) => set({ images: newOrder })
            }),
            {
                name: "delete-images-storage"
            }
        )
    )
);

export default useDeleteImageStore;
