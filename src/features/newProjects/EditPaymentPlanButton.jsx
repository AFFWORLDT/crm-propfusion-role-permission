import { useState } from "react";
import { Modal } from "@mui/material";

import styles from './EditPaymentPlanButton.module.css';
import { useUpdateProjectPaymentPlan } from "./useUpdateProjectPaymentPlan";

function EditPaymentPlanButton({
    paymentPlanId,
    projectId,
    defaultValues,
    children,
    setPaymentPlanList
}) {
  console.log(defaultValues)
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: defaultValues?.name  || "",
    post_handover: defaultValues?.post_handover || "",
    on_handover: defaultValues?.on_handover || "",
    under_construction_count: defaultValues?.under_construction_count || "",
    first_installment: defaultValues?.first_installment || "",
    on_handover_count: defaultValues?.on_handover_count || "",
    under_construction: defaultValues?.under_construction || "",
    first_installment_count : defaultValues?.first_installment_count || "",
    is_active: defaultValues?.is_active === true ? true : false,
    description: defaultValues?.description || "",
    post_handover_count: defaultValues?.post_handover_count || "",  
  });
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
const {updatePaymentPlan,isPending}=useUpdateProjectPaymentPlan()
  const handleChange = (e) => {
    const { name, value, type, checked, } = e.target;
  
    setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
    }));
};

const handleSwitchChange = () => {
  setFormData(prev => ({
      ...prev,
      is_active: !prev.is_active
  }));
};

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
        name: formData.name,
        post_handover: formData.post_handover,
        on_handover: formData.on_handover,
        under_construction_count: formData.under_construction_count,
        first_installment: formData.first_installment,
    }
    updatePaymentPlan({
        projectId,
        paymentPlanId,
        paymentPlanData: payload
    },{
      onSuccess:()=>{
        setPaymentPlanList(prev=>{
            const planToUpdate=prev.find(plan=>plan.id===paymentPlanId)
            if(!planToUpdate) return prev
            return prev.map(plan=>plan.id===paymentPlanId?{...plan,...payload}:plan)
        })
        handleClose()
      }

    })
    
  }
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
                aria-labelledby="payment-plan-modal"
                aria-describedby="edit-payment-plan-modal"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  overflowY: "scroll",
                }}
            >
               <div className={styles.modalContainer}>
                      <h2 className={styles.title}>Edit Payment Plan</h2>
                    <form className={styles.form}>
                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label className={styles.label} htmlFor="name">Name</label>
                                <input
                                    id="pay-name"
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label} htmlFor="post_handover">Post Handover (%)</label>
                                <input
                                    id="post_handover"
                                    type="number"
                                    name="post_handover"
                                    value={formData.post_handover}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label} htmlFor="post_handover_count">Post Handover Count</label>
                                <input
                                    id="post_handover_count"
                                    type="number"
                                    name="post_handover_count"
                                    value={formData.post_handover_count}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label className={styles.label} htmlFor="on_handover">On Handover (%)</label>
                                <input
                                    id="on_handover"
                                    type="number"
                                    name="on_handover"
                                    value={formData.on_handover}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label} htmlFor="under_construction_count">Under Construction Count</label>
                                <input
                                    id="under_construction_count"
                                    type="number"
                                    name="under_construction_count"
                                    value={formData.under_construction_count}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label className={styles.label} htmlFor="first_installment">First Installment (%)</label>
                                <input
                                    id="first_installment"
                                    type="number"
                                    name="first_installment"
                                    value={formData.first_installment}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label} htmlFor="on_handover_count">On Handover Count</label>
                                <input
                                    id="on_handover_count"
                                    type="number"
                                    name="on_handover_count"
                                    value={formData.on_handover_count}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label className={styles.label} htmlFor="under_construction">Under Construction (%)</label>
                                <input
                                    id="under_construction"
                                    type="number"
                                    name="under_construction"
                                    value={formData.under_construction}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label} htmlFor="first_installment_count">First Installment Count</label>
                                <input
                                    id="first_installment_count"
                                    type="number"
                                    name="first_installment_count"
                                    value={formData.first_installment_count}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label} htmlFor="description">Description</label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows="4"
                            />
                        </div>

                        <div className={styles.switchContainer}>
                            <label className={styles.switch}>
                                <input
                                    type="checkbox"
                                    checked={formData.is_active}
                                    onChange={handleSwitchChange}
                                    className={styles.switchInput}
                                    id="is_active"
                                    name="is_active"
                                />
                                <span className={styles.slider}></span>
                            </label>
                            <span className={styles.switchLabel}>
                                Active
                            </span>
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
  )
}

export default EditPaymentPlanButton
