import { useForm } from "react-hook-form";
import useStaff from "./admin/staff/useStaff";
import FormInputDataList from "../ui/FormInputDataList";
import toast from "react-hot-toast";
import  {
    useAssignBulkAgentToCommunity,
} from "./areas/useAssingesBulkAgentToArea";
import useAllDetails from "./all-details/useAllDetails";
import FormInputAsyncDataList from "../ui/FormInputAsyncDataList";
import { getCommunities } from "../services/apiProperties";
import { formatLocationsForChangeAreaAgent } from "../utils/utils";

function ChangeAreaAgentForm({ onCloseModal }) {
    const { data: allDetails } = useAllDetails();
    const sidebarColor =
        allDetails?.company_settings?.sidebar_color_code || "#020079";
    const { data: staffData, isLoading: isLoadingStaff } = useStaff();
    const {
        handleSubmit,
        control,
        formState: { errors },
    } = useForm({});
    const {
        isPending: isPendingCommunity,
        assignAgents: assignAgentsCommunity,
    } = useAssignBulkAgentToCommunity();

    const staffOptions = staffData.map((item) => {
        return { value: item.id, label: item.name };
    });
   

    const onSubmit = (data) => {
        if (!data.new_agent_id) {
            toast.error("Please select agent to replace with");
            return;
        }

        if (data.name) {
            assignAgentsCommunity(
                {
                    name: data.name.value,
                    payload: { agent_ids: [data.new_agent_id?.value] },
                },
                {
                    onSettled: () => {
                        onCloseModal();
                    },
                }
            );
           
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <h2>Change Agent</h2>
                <div style={{ marginTop: "1rem" }}>
                    <label htmlFor="name">Select Community *</label>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "1rem",
                            marginTop: "1rem",
                        }}
                    >
                        <FormInputAsyncDataList
                            id="name"
                            control={control}
                            placeholder="Search Community..."
                            registerName={"name"}
                            required={true}
                            isDisabled={isPendingCommunity}
                            isLoading={isPendingCommunity}
                            asyncFunc={getCommunities}
                            formatFunc={formatLocationsForChangeAreaAgent}
                        />
                    </div>
                    {errors.name && (
                        <span className="text-red-500">
                            {errors.name.message}
                        </span>
                    )}
                </div>

                <div style={{ marginTop: "1rem" }}>
                    <label htmlFor="new_agent_id">Select New Agent *</label>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "1rem",
                            marginTop: "1rem",
                        }}
                    >
                        <FormInputDataList
                            id="new_agent_id"
                            control={control}
                            data={staffOptions || []}
                            placeholder={
                                isLoadingStaff
                                    ? "Loading agents..."
                                    : "Choose an agent"
                            }
                            registerName={"new_agent_id"}
                            isDisabled={isPendingCommunity || isLoadingStaff}
                            isLoading={isLoadingStaff}
                        />
                    </div>
                </div>

                <div
                    style={{
                        display: "flex",
                        justifyContent: "end",
                        marginTop: "2.8rem",
                    }}
                >
                    <button
                        className="btnSubmit"
                        type="submit"
                        disabled={isPendingCommunity || isLoadingStaff}
                        style={{
                            background: sidebarColor,
                            color: "#fff",
                        }}
                    >
                        {isPendingCommunity ? "Changing Agent..." : "Change Agent"}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default ChangeAreaAgentForm;
