import { useState } from "react";
import { Modal } from "@mui/material";
import FormInputSelect from "../../ui/FormInputSelect";
import useUpdateFloorPlan from "./useUpdateFloorPlan";
import { BEDROOM_NUM_OPTIONS, PROPERTY_TYPES } from "../../utils/constants";
import styles from './EditFloorPlanButton.module.css';

const EditFloorPlanButton = ({
    floorPlanId,
    projectId,
    defaultValues,
    children,
    setFloorPlanList
}) => {
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({
        title: defaultValues?.title || "",
        Bedroom: defaultValues?.Bedroom || "",
        price: defaultValues?.price || 0,
        size: defaultValues?.size || 0,
        layout: null,
        sold_out: defaultValues?.sold_out || false,
        property_type: defaultValues?.property_type || "APARTMENT",
        tower: defaultValues?.tower || ""
    });
    const [layoutFileName, setLayoutFileName] = useState(defaultValues?.layout || "");

    const { changeFloorPlan, isPending ,} = useUpdateFloorPlan();
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        if (name === 'layout' && files?.length > 0) {
            setFormData(prev => ({
                ...prev,
                layout: files[0]
            }));
            setLayoutFileName(files[0].name);
            return;
        }
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSwitchChange = () => {
        setFormData(prev => ({
            ...prev,
            sold_out: !prev.sold_out
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Create payload without layout field
        const payload = {
            title: formData.title,
            Bedroom: formData.Bedroom,
            price: formData.price,
            size: formData.size,
            sold_out: formData.sold_out,
            property_type: formData.property_type,
            tower: formData.tower
        };

        // Only add layout if a new file is selected
        if (formData.layout) {
            payload.layout = formData.layout;
        }

        changeFloorPlan({
            projectId,
            floorPlanId,
            updatedFloorPlan: payload
        });

        // Update floor plan list with new data
        setFloorPlanList(prev => {
            const planToUpdate = prev.find(plan => plan.id === floorPlanId);
            if (!planToUpdate) return prev;
            
            return prev.map(plan => 
                plan.id === floorPlanId 
                    ? { ...plan, ...payload }  // Use the same payload here
                    : plan
            );
        });

        handleClose();
    };

    const register = (name, options = {}) => ({
        name,
        onChange: handleChange,
        value: formData[name],
        required: options.required
    });

    return (
        <>
            <div
                onClick={handleOpen}
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                }}
                className="btnNormalSmall"
            >
                {children}
            </div>

            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="floor-plan-modal"
                aria-describedby="edit-floor-plan-modal"
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    overflowY: "scroll",
                }}
            >
                <div className={styles.modalContainer}>
                    <h2 className={styles.title}>Edit Floor Plan</h2>
                    <form className={styles.form}>
                        <div className={styles.formGroup}>
                            <label className={styles.label} htmlFor="title">Title</label>
                            <input
                                id="title"
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label} htmlFor="tower">Tower</label>
                            <input
                                id="tower"
                                type="text"
                                name="tower"
                                value={formData.tower}
                                onChange={handleChange}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label} htmlFor="Bedroom">Bedroom</label>
                            <FormInputSelect
                                register={register}
                                registerName="Bedroom"
                                options={[
                                    { label: "Type", value: "" },
                                    ...BEDROOM_NUM_OPTIONS.slice(1),
                                ]}
                                required={true}
                                hasGrouping={false}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label} htmlFor="price">Price</label>
                            <input
                                id="price"
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label} htmlFor="size">Size</label>
                            <input
                                id="size"
                                type="number"
                                name="size"
                                value={formData.size}
                                onChange={handleChange}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label} htmlFor="layout">Layout File</label>
                            <input
                                id="layout"
                                type="file"
                                name="layout"
                                onChange={handleChange}
                                accept="image/*,.pdf"
                            />
                            {layoutFileName && (
                                <div className={styles.filePreviewContainer}>
                                   
                                    {formData.layout && formData.layout.type.startsWith('image/') && (
                                        <img 
                                            src={URL.createObjectURL(formData.layout)} 
                                            alt="Layout Preview" 
                                            className={styles.imagePreview}
                                        />
                                    )}
                                    {defaultValues?.layout && !formData.layout && (
                                        <img 
                                            src={defaultValues.layout} 
                                            alt="Current Layout" 
                                            className={styles.imagePreview}
                                        />
                                    )}
                                </div>
                            )}
                        </div>

                        <div className={styles.switchContainer}>
                            <label className={styles.switch}>
                                <input
                                    type="checkbox"
                                    checked={formData.sold_out}
                                    onChange={handleSwitchChange}
                                    className={styles.switchInput}
                                    id="sold_out"
                                    name="sold_out"
                                />
                                <span className={styles.slider}></span>
                            </label>
                            <span className={styles.switchLabel}>
                                Sold Out
                            </span>
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label} htmlFor="property_type">Property Type</label>
                            <FormInputSelect
                                register={register}
                                registerName="property_type"
                                options={PROPERTY_TYPES}
                                required={true}
                                hasGrouping={false}
                            />
                        </div>

                        <div className={styles.buttonContainer}>
                            <button 
                                onClick={handleSubmit}
                                type="button" 
                                className="btnNormalSmall">
                                {isPending ? "Saving..." : "Save Changes"}
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
        </>
    );
};

export default EditFloorPlanButton;
