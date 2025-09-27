import { useNavigate } from "react-router-dom";
import LeadForm from "../../features/leads/LeadForm";
import useUpdateLead from "../../features/leads/useUpdateLead";
import MultiStepForm from "../../ui/MultiStepForm";
import SectionTop from "../../ui/SectionTop";
import useLead from "../../features/leads/useLead";
import Spinner from "../../ui/Spinner";
import { PROPERTY_TYPES } from "../../utils/constants";
import { useEffect } from "react";
import toast from "react-hot-toast";

function EditLead() {
    const { data: leadData, isLoading: isLoadingLead, error } = useLead();
    const { changeLead, isPending: isUpdatingLead } = useUpdateLead();
    const navigate = useNavigate();

    useEffect(() => {
        if (error) toast.error(error.message);
    }, [error]);

    function handleFormSubmit(data) {
        const newLead = {
            ...data,
            nationality: data?.nationality?.value ?? "",
            agent_Id: data.agent_Id?.value ?? null,
            property_type:
                data.property_type?.map?.((item) => item.value) ?? [],
            preferred_property: data.preferred_property?.map?.((item) => item.value) ?? [],
            location: data.location ? data?.location?.value : null,
        };

        delete newLead.areas;
        delete newLead.agent;
        if (newLead.clientType === "RENT") delete newLead.projectType;

        changeLead(
            { id: data.id, payload: newLead },
            {
                onSettled: () => navigate(`/leads/details/${data.id}`),
            }
        );
    }

    function renderStep(step) {
        switch (step) {
            case 1:
                return <LeadForm leadType={leadData[0]?.clientType} />;
            default:
                return null;
        }
    }

    if (isLoadingLead) return <Spinner type="fullPage" />;

    const defaultValues = {
        ...leadData[0],
        agent_Id: leadData[0]?.agent ? {
            label: leadData[0].agent?.name ?? "Select",
            value: leadData[0].agent_Id ?? "",
        } : null,
        area_id: leadData[0]?.area_id?.map((value, i) => {
            return { label: leadData[0].areas[i]?.name, value };
        }),
        property_type: PROPERTY_TYPES.filter((obj) =>
            leadData[0].property_type?.includes(obj.value)
        ),
        preferred_property: leadData[0]?.preferred_property_details?.map((value, i) => {
            return { label: leadData[0]?.preferred_property_details[i]?.title, value : value?.id };
        }),

        preferred_project: leadData[0]?.preferred_project_details?.map((value, i) => {
            return { value: value?.id, label: value?.name };
        }),
        preferred_developer: leadData[0]?.preferred_developer_details?.map((value, i) => {
            return { value: value?.id, label: value?.name };
        }),
        nationality: leadData[0]?.nationality ?{
            label: leadData[0]?.nationality,
            value: leadData[0]?.nationality
        } : null,
        location: leadData[0]?.location ?{
            label: `${leadData[0]?.location?.name ? leadData[0]?.location?.name + ", " : ""}${leadData[0]?.location?.property_name ? leadData[0]?.location?.property_name + ", " : ""}${leadData[0]?.location?.sub_community ? leadData[0]?.location?.sub_community + ", " : ""}${leadData[0]?.location?.community ? leadData[0]?.location?.community + ", " : ""}${leadData[0]?.location?.city ? leadData[0]?.location?.city : ""}`,    
            value: leadData[0]?.location
        } : null,

    };

    return (
        <div className="sectionContainer">
            <SectionTop heading="Edit Lead" />
            <section className="sectionStyles">
                <MultiStepForm
                    totalSteps={1}
                    renderStep={renderStep}
                    onFormSubmit={handleFormSubmit}
                    isSubmitting={isUpdatingLead}
                    defaultValues={defaultValues}
                />
            </section>
        </div>
    );
}

export default EditLead;
