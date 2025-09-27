
import { createContext, useState, useContext } from 'react';
import toast from 'react-hot-toast';
import useDeleteProperty from '../features/properties/useDeleteProperty';
import useUpdateProperty from '../features/properties/useUpdateProperty';
import Modal from '../ui/Modal';

const SelectedPropertiesContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useSelectedProperties = () => useContext(SelectedPropertiesContext);

export function SelectedPropertiesProvider({ children }) {
    const [selectedIds, setSelectedIds] = useState([]);
    const [showCheckboxes, setShowCheckboxes] = useState(false);
    const { removeProperty, } = useDeleteProperty();
    const { changeProperty } = useUpdateProperty()

    const toggleSelection = (id) => {
        setSelectedIds((prev) =>
            prev.includes(id)
                ? prev.filter((item) => item !== id)
                : [...prev, id]
        );
    };

    const clearSelection = () => setSelectedIds([]);

    const confirmDelete = async () => {
        try {
            await Promise.all(
                selectedIds.map(async (id) => {
                    try {
                        await removeProperty(id);
                    } catch (error) {
                        console.error(`Failed to delete property ${id}:`, error);
                        toast.error(`Failed to delete property ${id}`);
                    }
                })
            );
            clearSelection();
        } catch (error) {
            toast.error('Failed to delete properties.');
            console.error('Bulk action error:', error);
        }
    };

    const MarkActiveInActiveProperty = async (status) => {
        try {
            await Promise.all(
                selectedIds.map(async (id) => {
                    try {
                        await changeProperty({
                            id,
                            updatedProperty: { status }
                        }, {
                            onSettled: () => {
                                clearSelection();
                            }
                        });

                    } catch (error) {
                        console.error(`Failed to ${status} property ${id}:`, error);
                        toast.error(`Failed to ${status} property ${id}`);
                    }
                })
            )

        } catch (error) {
            console.error('Bulk action error:', error);
            toast.error('.');
        }
    }

    const handleBulkAction = (actionType) => {
        if (selectedIds.length === 0) {
            toast.error('Please select at least one item.');
            return;
        }

        if (actionType === 'Delete') {
            const confirmed = window.confirm(
                `Are you sure you want to delete ${selectedIds.length} properties?`
            );
            if (confirmed) {
                confirmDelete();
            }

            return;
        }

        if (actionType === 'Mark Active') {
            MarkActiveInActiveProperty('ACTIVE')
            return
        }
        if (actionType === 'Mark Inactive') {
            MarkActiveInActiveProperty('INACTIVE')
            return
        }
        
    };

    const handleMultiSelect = () => {
        setShowCheckboxes((prev) => !prev);
    };

    return (
        <SelectedPropertiesContext.Provider
            value={{
                selectedIds,
                toggleSelection,
                clearSelection,
                handleBulkAction,
                showCheckboxes,
                handleMultiSelect
            }}
        >
            {children}
            <Modal>

            
        </Modal>
        </SelectedPropertiesContext.Provider>
    );
}

