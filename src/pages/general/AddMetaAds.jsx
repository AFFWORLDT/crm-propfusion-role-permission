import MultiStepForm from "../../ui/MultiStepForm";
import SectionTop from "../../ui/SectionTop";
import useCreateMetaAdForm from "../../features/admin/MetaAds/useCreateMetaAdForm";
import MetaAdForm from "../../features/admin/MetaAds/MetaAdForm";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function AddMetaAds() {
    const { mutate: addMetaAd, isPending } = useCreateMetaAdForm();
    const navigate = useNavigate();
    function renderStep(step) {
        switch (step) {
            case 1:
                return (
                    <>
                        <MetaAdForm />
                    </>
                );
        }
    }
    function handleFormSubmit(data, handleReset) {
        const newMetaAd = {
            ...data,
            agent_Id: data.agent_Id?.value ?? null,
            location: data.location?.value ?? null,
            form_id: data.form_id?.value ?? null,
            page_id: data.page_id?.value ?? null,
            property_type:
                data.property_type?.map?.((item) => item.value) ?? [],
            preferred_property:
                data.preferred_property?.map?.((item) => item.value) ?? [],
            preferred_project:
                data.preferred_project?.map?.((item) => item.value) ?? [],
            preferred_developer:
                data.preferred_developer?.map?.((item) => item.value) ?? [],
        };
        if (newMetaAd.clientType === "RENT") delete newMetaAd.projectType;
        delete newMetaAd.telCodePrimary;
        delete newMetaAd.telCodeSecondary;

        addMetaAd(newMetaAd, {
            onSuccess: () => {
                navigate("/admin/general/manage-meta-ads", { replace: true });
                toast.success("Meta Ad Added Successfully");
                // handleReset();
            },
        });
    }
    return (
        <div className="sectionContainer">
            <SectionTop heading="Add Meta Ads" />
            <section className="sectionStyles">
                <MultiStepForm
                    totalSteps={1}
                    renderStep={renderStep}
                    onFormSubmit={handleFormSubmit}
                    isSubmitting={isPending}
                    defaultValues={{}}
                />
            </section>
        </div>
    );
}

export default AddMetaAds;
