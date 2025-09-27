import { useForm } from "react-hook-form";
import styles from "../../pages/general/ManageCompany.module.css";
import useUpdateCompanySettings from "../admin/general/useUpdateCompanySettings";
import FormInputCountries from "../../ui/FormInputCountries";

function StepCompanyDetails({ setCurrentStep }) {
    const { changeCompanySettings, isPending } = useUpdateCompanySettings();
    const { register, handleSubmit, control } = useForm({
        defaultValues: {},
    });

    function onSubmit(formData) {
        const newSettings = {
            ...formData,
            country_name: JSON.stringify(formData.country_name),
        };

        const keysToCheck = ["company_logo_url", "menu_logo_url"];

        keysToCheck.forEach((key) => {
            if (!newSettings[key] || typeof newSettings[key] === "string") {
                delete newSettings[key];
            }
        });

        changeCompanySettings(newSettings);
    }

    function handleNext() {
        setCurrentStep((currentStep) => currentStep + 1);
    }

    return (
        <div>
            <div
                style={{
                    backgroundColor: "var(--clr-neutral-50)",
                    padding: "2.4rem",
                    borderRadius: "2rem",
                }}
                className={styles.companyFormContainer}
            >
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div>
                        <span>Company Name</span>
                        <input
                            {...register("company_name")}
                            type="text"
                            placeholder="Name"
                        />
                    </div>

                    <div>
                        <span>Country</span>
                        <FormInputCountries
                            control={control}
                            registerName="country_name"
                            placeholder="Select a country"
                        />
                    </div>

                    <div>
                        <span>Billing Address</span>
                        <input
                            {...register("billing_address")}
                            type="text"
                            placeholder="Billing Address"
                        />
                    </div>

                    <div>
                        <span>Address</span>
                        <input
                            {...register("address")}
                            type="text"
                            placeholder="Address"
                        />
                    </div>

                    <div>
                        <span>Brief</span>
                        <textarea
                            {...register("brief_of_company")}
                            placeholder="Brief"
                            rows={5}
                        />
                    </div>

                    <div className={styles.inputFile}>
                        <span>Company Logo</span>
                        <div>
                            <input
                                {...register("company_logo_url")}
                                type="file"
                                accept="image/*"
                                disabled={isPending}
                            />
                        </div>
                    </div>

                    <div className={styles.inputFile}>
                        <span>Menu Logo</span>
                        <div>
                            <input
                                {...register("menu_logo_url")}
                                type="file"
                                accept="image/*"
                                disabled={isPending}
                            />
                        </div>
                    </div>

                    <div className="btnsContainer">
                        <button
                            type="submit"
                            className="btnSubmit"
                            disabled={isPending}
                        >
                            {isPending ? "Saving..." : "Save"}

                        </button>
                    </div>
                </form>
            </div>

            <div
                style={{
                    display: "flex",
                    gap: "3.2rem",
                    justifyContent: "end",
                    padding: "3.2rem 0 0",
                }}
            >
                <button
                    type="button"
                    style={{ fontWeight: "500" }}
                    onClick={handleNext}
                >
                    Skip
                </button>
                <button
                    type="button"
                    className="btnSubmit"
                    onClick={handleNext}
                >
                    Next
                </button>
            </div>
        </div>
    );
}

export default StepCompanyDetails;
