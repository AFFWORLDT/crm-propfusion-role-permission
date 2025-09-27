import styles from "../../styles/MultiStepForm.module.css";
import MultiStepForm, { useMultiStepForm } from "../../ui/MultiStepForm";
import { LucideSparkles, X } from "lucide-react";
import { useCreatePropertyContent } from "../Ai/useCreatePropertyContent";
import { useState } from "react";

function StepDescription() {
    const { watch, setValue } = useMultiStepForm();
    const { createContent, isPending, aiResponse } = useCreatePropertyContent();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [step, setStep] = useState(1);
    const [selectedTitle, setSelectedTitle] = useState(null);
    const [selectedTitleIndex, setSelectedTitleIndex] = useState(null);

    const propertyType = watch("property_type") || null;
    const size = watch("size") || null;
    const bedRooms = watch("bedRooms") || null;
    const bathrooms = watch("bathrooms") || null;
    const parking = watch("parking") || null;
    const isFurnished = watch("isFurnished") || null;
    const price = watch("price") || null;
    const priceType = watch("priceType") || null;
    const cheques = watch("cheques") || null;
    const deposit = watch("deposit") || null;
    const location = watch("location") || null;
    const area_id = watch("area_id") || null;
    const totalFloor = watch("totalFloor") || null;
    const floor = watch("floor") || null;
    const buildYear = watch("buildYear") || null;
    const plotSize = watch("plotSize") || null;
    const occupancy = watch("occupancy") || null;
    const availabilityDate = watch("availabilityDate") || null;
    const source_of_listing = watch("source_of_listing") || null;
    const houseNo = watch("houseNo") || null;
    const developerId = watch("developerId") || null;
    const agent_Id = watch("agent_Id") || null;
    const serviceCharge = watch("serviceCharge") || null;
    const hasMortgage = watch("hasMortgage") || null;
    const acCharge = watch("acCharge") || null;

    const handleGenerateContent = async () => {
        try {
            const payload = {
                propertyType,
                size,
                bedRooms,
                bathrooms,
                parking,
                isFurnished,
                price,
                priceType,
                cheques,
                deposit,
                location: location?.value || null,
                area_id: area_id?.value || null,
                totalFloor,
                floor,
                buildYear,
                plotSize,
                occupancy,
                availabilityDate,
                source_of_listing,
                houseNo,
                developerId: developerId?.value || null,
                agent: agent_Id ? {
                    name: agent_Id.label || null,
                } : null,
                serviceCharge,
                hasMortgage,
                acCharge,
            };
            
            console.log('Sending payload:', payload);
            
            createContent(
                payload,
                {
                    onSuccess: () => {
                        setIsModalOpen(true);
                    },
                }
            );
        } catch (error) {
            console.error('Error generating content:', error);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setStep(1);
        setSelectedTitle(null);
        setSelectedTitleIndex(null);
    };

    const handleTitleSelect = (title, index) => {
        setSelectedTitleIndex(index);
        setSelectedTitle(title);
        
        setTimeout(() => {
            setStep(2);
            setSelectedTitleIndex(null);
        }, 700);
    };

    const handleDescriptionSelect = (description) => {
        setValue("title", selectedTitle);
        setValue("description", description);
        closeModal();
    };

    const titleOptions = aiResponse?.data?.titles?.map((t) => ({
        label: t,
        value: t,
    }));

    const descriptionOptions = aiResponse?.data?.descriptions?.map((d) => ({
        label: d,
        value: d,
    }));

    return (
        <>
            <div className={`sectionDiv ${styles.multiStepFormGrid}`}>
                <div style={{ gridTemplateColumns: "1fr" }} className={styles.formContainer}>
                    <div className="d-flex gap-3 justify-content-end">
                        <div className={`${styles.buttonContainer} ${isPending ? styles.pending : ""}`}>
                            <button
                                type="button"
                                className={styles.aiGenerateButton}
                                onClick={handleGenerateContent}
                                disabled={isPending}
                            >
                                <LucideSparkles size={18} />
                                {isPending ? "Generating..." : "Generate AI Content"}
                            </button>
                        </div>
                    </div>

                    <MultiStepForm.Input
                        registerName="title"
                        placeholder="Title"
                        required={true}
                        label="Title"
                    />
                    <MultiStepForm.InputTextArea
                        registerName="description"
                        placeholder="Enter content"
                        required={true}
                        label="Description"
                        maxLength={5000}
                    />
                </div>
            </div>

            {isModalOpen && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 1000
                }}>
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '8px',
                        padding: '20px',
                        width: '90%',
                        maxWidth: '800px',
                        maxHeight: '90vh',
                        overflow: 'auto',
                        position: 'relative',
                    }}>
                        <button
                            type="button"
                            onClick={closeModal}
                            style={{
                                position: 'absolute',
                                right: '15px',
                                top: '15px',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                padding: '5px'
                            }}
                            aria-label="Close modal"
                        >
                            <X size={20} />
                        </button>

                        <h2 style={{
                            textAlign: 'center',
                            marginBottom: '20px',
                            fontSize: '1.5rem',
                        }}>
                            {step === 1 ? "Select Title" : "Select Description"}
                        </h2>

                        {step === 1 ? (
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                                gap: '15px',
                                marginBottom: '20px',
                            }}>
                                {titleOptions?.map((title, index) => (
                                    <div
                                        key={index}
                                        onClick={() => handleTitleSelect(title.value, index)}
                                        style={{
                                            padding: '15px',
                                            border: `1px solid ${selectedTitleIndex === index ? '#4CAF50' : '#ddd'}`,
                                            borderRadius: '6px',
                                            cursor: 'pointer',
                                            transition: 'all 0.3s ease',
                                            backgroundColor: selectedTitleIndex === index ? '#f0fff0' : 'white',
                                            ':hover': {
                                                backgroundColor: selectedTitleIndex === index ? '#f0fff0' : '#f5f5f5'
                                            }
                                        }}
                                    >
                                        {title.label}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div style={{
                                display: 'grid',
                                gap: '15px',
                                marginBottom: '20px'
                            }}>
                                {descriptionOptions?.map((desc, index) => (
                                    <div
                                        key={index}
                                        onClick={() => handleDescriptionSelect(desc.value)}
                                        style={{
                                            padding: '15px',
                                            border: '1px solid #ddd',
                                            borderRadius: '6px',
                                            cursor: 'pointer',
                                            transition: 'all 0.3s ease',
                                            ':hover': {
                                                backgroundColor: '#f5f5f5'
                                            }
                                        }}
                                    >
                                        {desc.label}
                                    </div>
                                ))}
                            </div>
                        )}

                        <div style={{
                            marginTop: '20px',
                            padding: '15px',
                            backgroundColor: '#fff3cd',
                            border: '1px solid #ffeeba',
                            borderRadius: '4px',
                            color: '#856404'
                        }}>
                            <strong>Warning:</strong> Please review AI-generated content carefully before adding.
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default StepDescription;