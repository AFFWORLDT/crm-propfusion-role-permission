import styles from "../../styles/MultiStepForm.module.css";
import DisplayImagesOnAdd from "../../ui/DisplayImagesOnAdd";
import MultiStepForm from "../../ui/MultiStepForm";
import DisplayDocs from "./DisplayDocs";
// import useDeleteProjectImage from "./useDeleteProjectImage";

function StepPhotos({ projectData }) {
    // const { removeProjectImage,  } =
    //     useDeleteProjectImage();

    // function handleRemoveImage(imageUrl) {
    //     return () =>
    //         removeProjectImage({
    //             projectId: projectData.id,
    //             imageUrl,
    //         });
    // }



    return (
        <div className={`sectionDiv ${styles.multiStepFormGrid}`}>
            <div
                style={{ gridTemplateColumns: "1fr" }}
                className={styles.formContainer}
            >
                <div>
                    <MultiStepForm.InputFile
                        registerName="photos"
                        label="Images"
                        accept="image/*"
                        multiple={true}
                    />


                    <DisplayImagesOnAdd
                        imagesData={projectData?.photos}
                        // onAction={handleRemoveImageWhileAdding}
                        // isDoingAction={isDeleting}
                        iconAction="/icons/delete.svg"

                    />
                </div>
                <div>
                    <MultiStepForm.InputBuildingDocs
                        registerName="management_contract"
                        label="Management Cr."
                        accept="application/pdf"
                        multiple={true}
                    />
                    <DisplayDocs
                        imagesData={projectData?.management_contract}
                        iconAction="/icons/delete.svg"
                        filter="management_contract"
                    />
                </div>

                <div>
                    <MultiStepForm.InputBuildingDocs
                        registerName="tenancy_lease_contract"
                        label="Tenancy Lease Cr."
                        accept="application/pdf"
                        multiple={true}
                    />
                    <DisplayDocs
                        imagesData={projectData?.tenancy_lease_contract}
                        iconAction="/icons/delete.svg"
                        filter="tenancy_lease_contract"
                    />
                </div>
                <div>
                    <MultiStepForm.InputBuildingDocs
                        registerName="title_deed"
                        label="Title Deed"
                        accept="application/pdf"
                        multiple={true}
                    />
                    <DisplayDocs
                        imagesData={projectData?.title_deed}
                        iconAction="/icons/delete.svg"
                        filter="title_deed"
                    />
                </div>


                <div>
                    <MultiStepForm.InputBuildingDocs
                        registerName="affection_plan"
                        label="Affection Plan"
                        accept="application/pdf"
                        multiple={false}
                    />
                    <DisplayDocs
                        imagesData={projectData?.affection_plan}
                        iconAction="/icons/delete.svg"
                        filter="affection_plan"
                    />
                </div>
                <div>
                    <MultiStepForm.InputBuildingDocs
                        registerName="poa_noc"
                        label="POA/NOC"
                        accept="application/pdf"
                        multiple={false}
                    />
                    <DisplayDocs
                        imagesData={projectData?.poa_noc}
                        iconAction="/icons/delete.svg"
                        filter="poa_noc"
                    />
                </div>
                <div>
                    <MultiStepForm.InputBuildingDocs
                        registerName="building_drawing"
                        label="Building Dr"
                        accept="application/pdf"
                        multiple={false}
                    />
                    <DisplayDocs
                        imagesData={projectData?.building_drawing}
                        iconAction="/icons/delete.svg"
                        filter="building_drawing"
                    />
                </div>
                <div>
                    <MultiStepForm.InputBuildingDocs
                        registerName="handover_documents"
                        label="Handover "
                        accept="application/pdf"
                        multiple={true}
                    />
                    <DisplayDocs
                        imagesData={projectData?.handover_documents}
                        iconAction="/icons/delete.svg"
                        filter="handover_documents"
                    />
                </div>
                <div>
                    <MultiStepForm.InputBuildingDocs
                        registerName="other_documents"
                        label="Other"
                        accept="application/pdf"
                        multiple={true}
                    />
                    <DisplayDocs
                        imagesData={projectData?.other_documents}
                        iconAction="/icons/delete.svg"
                        filter="other_documents"
                    />

                </div>
            </div>
        </div>
    );
}

export default StepPhotos;
