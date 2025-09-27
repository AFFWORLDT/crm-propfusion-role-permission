import { useQueryClient } from "@tanstack/react-query";
import LeadForm from "../../features/leads/LeadForm";
import useCreateLead from "../../features/leads/useCreateLead";
import { useCallLeads } from "../../store/callLeadDatastore";
import { useWhatsAppLeads } from "../../store/whatsAppLeadDataStore";
import MultiStepForm from "../../ui/MultiStepForm";
import SectionTop from "../../ui/SectionTop";
import useInfiniteWhatsappLeads from "../../features/leads/whatsappLeads/useInfiniteWhatsappLeads";
import { useNavigate } from "react-router-dom";


function renderStep(step) {
    switch (step) {
        case 1:
            return <LeadForm />;
        default:
            return null;
    }
}

function AddPortalLead() {
    const { addLead, isPending } = useCreateLead();
    const { whatsAppData, resetDefaultListView } = useWhatsAppLeads();
    const {CallData, resetDefaultList } = useCallLeads();    
    const queryClient = useQueryClient();
    const { refetch } = useInfiniteWhatsappLeads();
    const navigate = useNavigate();
    function handleFormSubmit(data, handleReset) {


        const newLead = {
            ...data,
            rent_period: data.rent_period ?  data.rent_period.value : null  ,
            agent_Id: whatsAppData?.agent_info?.agent_Id || CallData?.agent_info?.agent_Id,
            area_id: data.area_id?.map?.((item) => item.value) ?? [],
            property_type:
                data.property_type?.map?.((item) => item.value) ?? [],
            preferred_property: data?.preferred_property?.map?.((item) => item.value) ?? [],
            nationality: data.nationality?.value ?? "",
            phone: data?.phone
                ? `${data.phone}`
                : "",
            secondryPhone: data?.secondryPhone
                ? `${data.secondryPhone}`
                : "",
            status: "ACTIVE",
            isClaim: "NO",
        };

        if (newLead.clientType === "RENT") delete newLead.projectType;
        delete newLead.telCodePrimary;
        delete newLead.telCodeSecondary;

        addLead(newLead, {
            onSettled: handleReset,
            onSuccess: (data) => {
                resetDefaultListView()
                resetDefaultList()
                queryClient.invalidateQueries({ queryKey: ["leads"] });
                queryClient.invalidateQueries({ queryKey: ["whatsappLeads"] });
                queryClient.invalidateQueries({ queryKey: ["portalCalls"] });
            navigate(`/leads/details/${data?.id}`,{replace:true});

                refetch()
            }
        });
    }
    return (
        <div className="sectionContainer">
            <SectionTop heading="Add Lead" />
            <section className="sectionStyles">
                <MultiStepForm
                    totalSteps={1}
                    renderStep={renderStep}
                    onFormSubmit={handleFormSubmit}
                    isSubmitting={isPending}
                    defaultValues={{
                        clientType: whatsAppData.listingType ? whatsAppData.listingType === "SELL" ? "SELL" : "RENT" : "",
                        name: whatsAppData.name ? whatsAppData.name : '',
                        agent_Id: whatsAppData?.agent_info  ? {
                            label: whatsAppData?.agent_info?.name ?? "Select",
                            value: whatsAppData?.agent_Id ?? "",
                        } : CallData?.agent_info? {
                            label: CallData?.agent_info?.name ?? "Select",
                            value: CallData?.agent_Id ?? "",
                        }  : null,
                        phone: whatsAppData.cell || CallData?.receiver_number ? whatsAppData?.cell || CallData?.receiver_number:CallData?.receiver_number ? CallData?.receiver_number: '',
                        clientSource: whatsAppData?.portal ? whatsAppData?.portal : '',
                        preferred_property: (whatsAppData?.title && whatsAppData?.property_id) ? [{ label: whatsAppData?.title, value: whatsAppData?.property_id }] : [],
                        area_id: (whatsAppData?.area_id && whatsAppData?.area_name) ? [{ label: whatsAppData?.area_name, value: whatsAppData?.area_id }] : [],
                        whatsapp_lead_id: whatsAppData?.lead_id ? whatsAppData?.lead_id.toString() : null,
                        call_logs_id:CallData?.lead_id ? CallData?.lead_id.toString():null,
                        leads_message:whatsAppData?.message ? whatsAppData.message:null

                    }}
                />
            </section>
        </div>
    );
}

export default AddPortalLead;
