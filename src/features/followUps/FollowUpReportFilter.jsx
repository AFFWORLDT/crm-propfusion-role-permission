import Filter from "../../ui/Filter";
import { PROPERTY_TYPES } from "../../utils/constants";
import useStaff from "../admin/staff/useStaff";
import useRating from "../rating/useRating";
import useStages from "../stages/useStages";
import useStatus from "../status/useStatus";

const defaultValues = {
    name: "",
    date_from: "",
    date_to: "",
    agent_id: "",
    phone: "",
    property_type: "",
    rooms: "",
    nationality: "",
    claimed: "",
    client_source: "",
    tag: "",
    stage: "",
    group: "",
    stageId: "",
};

function FollowUpReportFilter() {
    const { data: stagesData, isLoading: isStagesLoading } = useStages("leads");
    const { data : ratingData, isLoading: isRatingLoading } = useRating("leads");
    const { data : statusData, isLoading: isStatusLoading } = useStatus("leads");

    const stagesOptions =
        stagesData?.map((item) => ({
            value: item.id,
            label: item.name,
        })) || [];

    

    const ratingOptions =
        ratingData?.map((item) => ({
            value: item.id,
            label: item.name,
        })) || [];

    const statusOptions =
        statusData?.map((item) => ({
            value: item.id,
            label: item.name,
        })) || [];

    return (
        <Filter defaultValues={defaultValues}>
            <ExtraFilters
                stagesOptions={stagesOptions}
                isStagesLoading={isStagesLoading}
                ratingOptions={ratingOptions}
                isRatingLoading={isRatingLoading}
                statusOptions={statusOptions}
                isStatusLoading={isStatusLoading}
            />
        </Filter>
    );
}

function ExtraFilters({
    stagesOptions,
    isStagesLoading,
    ratingOptions,
    isRatingLoading,
    statusOptions,
    isStatusLoading,
}) {
    return (
        <>
            <Filter.Input registerName="name" placeholder="Name" />

           
            <Filter.Input registerName="phone" placeholder="Phone" />
           
            <Filter.InputDataList
                registerName="stageId"
                placeholder="Stage"
                data={stagesOptions}
                isLoading={isStagesLoading}
            />
            <Filter.InputDataList
                registerName="ratingId"
                placeholder="Rating"
                data={ratingOptions}
                isLoading={isRatingLoading}
            />
            <Filter.InputDataList
                registerName="statusId"
                placeholder="Status"
                data={statusOptions}
                isLoading={isStatusLoading}
            />
        </>
    );
}

export default FollowUpReportFilter;
