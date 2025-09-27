import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export const useImagesStore = create()(
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
                name: "images-storage"
            }
        )
    )
);

const useSingleImageStore = create()(
    devtools(
        persist(
            (set) => ({
                imageUrl: "",
                setImage: (url) => set({ imageUrl: url }),
                clearImage: () => set({ imageUrl: "" }),
                hasImage: () => {
                    const state = useSingleImageStore.getState();
                    return state.imageUrl !== "";
                }
            }),
            {
                name: "single-image-storage"
            }
        )
    )
);

export const useDocumentsStore = create()(
    devtools(
        persist(
            (set) => ({
                documents: {
                    management_contract: [],
                    tenancy_lease_contract: [],
                    title_deed: [],
                    affection_plan: [],
                    poa_noc: [],
                    building_drawing: [],
                    handover_documents: [],
                    other_documents: [],
                    vehicles_diagnostic_report: []
                },
                // Set a specific document
                setDocument: (documentType, value) => set((state) => ({
                    documents: {
                        ...state.documents,
                        [documentType]: value
                    }
                })),
                // Add document to arrays (handover_documents or other_documents)
                addArrayDocument: (documentType, value) => set((state) => ({
                    documents: {
                        ...state.documents,
                        [documentType]: [...state.documents[documentType], value]
                    }
                })),
                // Remove document from arrays
                removeArrayDocument: (documentType, value) => set((state) => ({
                    documents: {
                        ...state.documents,
                        [documentType]: state.documents[documentType].filter(doc => doc !== value)
                    }
                })),
                // Clear all documents
                clearAllDocuments: () => set({
                    documents: {
                        management_contract: [],
                        tenancy_lease_contract: [],
                        title_deed: [],
                        affection_plan: [],
                        poa_noc: [],
                        building_drawing: [],
                        handover_documents: [],
                        other_documents: []
                    }
                }),
                // Filter documents by type
                filterDocumentsByType: (type) => {
                    const state = useDocumentsStore.getState();
                    return state.documents[type];
                },
                // Filter non-empty documents
                getNonEmptyDocuments: () => {
                    const state = useDocumentsStore.getState();
                    return Object.entries(state.documents).reduce((acc, [key, value]) => {
                        if (Array.isArray(value) ? value.length > 0 : value !== "") {
                            acc[key] = value;
                        }
                        return acc;
                    }, {});
                }
            }),
            {
                name: "documents-storage"
            }
        )
    )
);

export { useSingleImageStore };
export default useImagesStore; 


