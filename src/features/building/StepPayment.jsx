import styles from "../../styles/MultiStepForm.module.css";
import FormInputDatePicker from "../../ui/FormInputDatePicker";
import MultiStepForm, { useMultiStepForm } from "../../ui/MultiStepForm";
import { useState } from "react";
import { PAYMENT_OPTIONS } from "../../utils/constants";

function StepPayment({ chequePaymentsData }) {
    const { control, setValue, getValues } = useMultiStepForm();
    const [chequePayments, setChequePayments] = useState(chequePaymentsData || [{ due_date: null, amount: 0, payment_status: "pending", reference_number: "" }]);


    return (
        <div className={`sectionDiv ${styles.multiStepFormGrid}`}>
            <div className={styles.formContainer}>
                <MultiStepForm.InputDatePicker
                    registerName="contract_start_date"
                    placeholder="Select start date"
                    label="Contract Start Date"
                />
                <MultiStepForm.InputDatePicker
                    registerName="contract_end_date"
                    placeholder="Select end date"
                    label="Contract End Date"
                />
                {/* <MultiStepForm.Input
                    registerName="building_status"
                    type="text"
                    placeholder="Enter building status"
                    label="Building Status"
                /> */}
                <MultiStepForm.Input
                    registerName="annual_rent"
                    type="text"
                    placeholder="Enter annual rent"
                    label="Annual Rent"
                    valueAsNumber={true}

                />
                <MultiStepForm.InputDataList
                    registerName="annual_rent_method"
                    type="text"
                    placeholder="Enter annual rent method"
                    label="Annual Rent Method"
                    data={[...PAYMENT_OPTIONS, { value: "OTHER", label: "Other" }]}
                />
                <MultiStepForm.Input
                    registerName="security_amount"
                    type="text"
                    placeholder="Enter security amount"
                    label="Security Amount"
                    valueAsNumber={true}
                />
                <MultiStepForm.InputDataList
                    registerName="security_amount_payment_method"
                    type="text"
                    placeholder="Select security amount payment "
                    label="Security Payment "
                    data={[...PAYMENT_OPTIONS, { value: "OTHER", label: "Other" }]}
                />
                <MultiStepForm.Input
                    registerName="commission_amount"
                    type="text"
                    placeholder="Enter commission amount"
                    label="Commission Amount"
                    valueAsNumber={true}
                />
                <MultiStepForm.InputDataList
                    registerName="commission_payment_method"
                    type="text"
                    placeholder="Select commission payment method "
                    label="Commission Payment"
                    data={[...PAYMENT_OPTIONS, { value: "OTHER", label: "Other" }]}
                />

                <MultiStepForm.Input
                    registerName="no_of_cheques"
                    type="number"
                    placeholder="Enter number of cheques"
                    valueAsNumber={true}
                    label="Number of Cheques"
                />
                <MultiStepForm.Input
                    registerName="bank_name"
                    type="text"
                    placeholder="Enter bank name"
                    label="Bank Name"
                />

                <div className={styles.inputContainer} style={{ gridColumn: "1 / -1" }}>
                    <label>Cheque Payments</label>
                    <div className={styles.chequePaymentsContainer} style={{ marginTop: "10px" }}>
                        {chequePayments.map((payment, index) => (
                            <div key={index} className={styles.chequePaymentRow} style={{
                                display: "grid",
                                gridTemplateColumns: "1fr 1fr 1fr 1fr auto",
                                gap: "10px",
                                marginBottom: "10px"
                            }}>
                                <div>
                                    <FormInputDatePicker
                                        control={control}
                                        registerName={`cheque_payments.${index}.due_date`}
                                        placeholder="Select due date"
                                    />
                                </div>
                                <div>
                                    <MultiStepForm.Input
                                        registerName={`cheque_payments.${index}.amount`}
                                        type="number"
                                        placeholder="Enter amount"
                                        valueAsNumber={true}
                                    />
                                </div>
                                <div>
                                    <MultiStepForm.InputDataList
                                        registerName={`cheque_payments.${index}.payment_status`}
                                        placeholder="Select status"
                                        label=""
                                        data={[
                                            { value: "pending", label: "PENDING" },
                                            { value: "done", label: "DONE" },
                                        ]}
                                    />
                                </div>
                                <div>
                                    <MultiStepForm.Input
                                        registerName={`cheque_payments.${index}.reference_number`}
                                        type="text"
                                        placeholder="Enter reference number"
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (chequePayments.length > 1) {
                                            const updatedPayments = [...chequePayments];
                                            updatedPayments.splice(index, 1);
                                            setChequePayments(updatedPayments);

                                            // Update form values
                                            const currentValues = getValues();
                                            const updatedChequePayments = [...(currentValues.cheque_payments || [])];
                                            updatedChequePayments.splice(index, 1);
                                            setValue("cheque_payments", updatedChequePayments);
                                        }
                                    }}
                                    style={{
                                        backgroundColor: "#f44336",
                                        color: "white",
                                        border: "none",
                                        padding: "5px 10px",
                                        borderRadius: "4px",
                                        cursor: "pointer"
                                    }}
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={() => {
                                setChequePayments([...chequePayments, { due_date: null, amount: 0, payment_status: "Pending", reference_number: "" }]);
                            }}
                            style={{
                                backgroundColor: "#4CAF50",
                                color: "white",
                                border: "none",
                                padding: "8px 16px",
                                borderRadius: "4px",
                                cursor: "pointer",
                                marginTop: "5px"
                            }}
                        >
                            Add Cheque Payment
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default StepPayment;