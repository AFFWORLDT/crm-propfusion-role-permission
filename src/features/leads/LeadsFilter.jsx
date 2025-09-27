import { useEffect } from "react";
import { getAllForums } from "../../services/apiLeads";
import Filter from "../../ui/Filter";
import {
    BEDROOM_NUM_OPTIONS,
    CLAIM_OPTIONS,
    PROPERTY_TYPES,
    SOURCE_OPTIONS,
} from "../../utils/constants";
import useStaff from "../admin/staff/useStaff";
import useStages from "../stages/useStages";
import useTags from "../tags/useTags";
import { formatForumOptionsForLeades, formatLocationsCommunityOptionsForProperties } from "../../utils/utils";
import { getLocation } from "../../services/apiLocations";
import { useSearchParams } from "react-router-dom";

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
    client_sub_source: "",
    tag: "",
    stage: "",
    group: "",
};

function LeadsFilter() {
    const { data: staffData, isLoading: isStaffLoading } = useStaff();
    const { data: tagData, isLoading: isTagLoading } = useTags("leads");
    const { data: stagesData, isLoading: isStagesLoading } = useStages("leads");
    // const { data: groupsData, isLoading: isGroupsLoading } = useGroups("leads");

    const tagOptions =
        tagData?.map((item) => ({
            value: item.id,
            label: item.name,
        })) || [];

    const stagesOptions =
        stagesData?.map((item) => ({
            value: item.id,
            label: item.name,
        })) || [];

    // const groupsOptions =
    //     groupsData?.map((item) => ({
    //             value: item.id,
    //         label: item.name,
    //     })) || [];

    const staffOptions = [
        { value: 0, label: "Unassigned" },
        ...(staffData?.map((item) => ({
            value: item.id,
            label: item.name,
        })) || [])
    ];

    return (
        <Filter defaultValues={defaultValues}>
            <ExtraFilters
                staffOptions={staffOptions}
                isStaffLoading={isStaffLoading}
                tagOptions={tagOptions}
                isTagLoading={isTagLoading}
                stagesOptions={stagesOptions}
                isStagesLoading={isStagesLoading}
                // groupsOptions={groupsOptions}
                // isGroupsLoading={isGroupsLoading}
            />
        </Filter>
    );
}

function ExtraFilters({
    staffOptions,
    isStaffLoading,
    tagOptions,
    isTagLoading,
    stagesOptions,
    isStagesLoading,
    // groupsOptions,
    // isGroupsLoading,
}) {
    const [searchParams] = useSearchParams();
    const city = searchParams.get("city");
    const community = searchParams.get("community");
    const subcommunity = searchParams.get("subcommunity");
    return (
        <>
            <Filter.Input registerName="name" placeholder="Name" />

            <Filter.InputDatePicker
                registerName="date_from"
                placeholder="Start Date"
            />
            <Filter.InputDatePicker
                registerName="date_to"
                placeholder="End Date"
            />
            <Filter.InputDataList
                registerName="agent_id"
                data={staffOptions}
                isLoading={isStaffLoading}
                placeholder="Select Agent"
            />
            <Filter.Input registerName="phone" placeholder="Phone" />
            <Filter.InputDataList
                registerName="property_type"
                data={PROPERTY_TYPES}
                isMulti
            />
            <Filter.InputDataList
                registerName="rooms"
                data={BEDROOM_NUM_OPTIONS}
                placeholder={"Bedroom"}
            />
            <Filter.Input
                registerName="nationality"
                placeholder="Nationality"
            />
            <Filter.InputDataList
                registerName="claimed"
                data={CLAIM_OPTIONS}
                placeholder={"Claimed"}
            />

            <Filter.InputDataList
                registerName="client_source"
                data={SOURCE_OPTIONS}
                placeholder={"Client source"}
            />
            <Filter.InputAsyncDataList
                registerName="client_sub_source"
                placeholder="client sub source"
                asyncFunc={() => getAllForums()}
                formatFunc={formatForumOptionsForLeades}
                isCreatable
            />
            <Filter.InputDataList
                registerName="tag"
                placeholder="Tags"
                data={tagOptions}
                isLoading={isTagLoading}
            />
            <Filter.InputDataList
                registerName="stageId"
                placeholder="Stage"
                data={stagesOptions}
                isLoading={isStagesLoading}
            />
            <Filter.InputAsyncDataList
                registerName="city"
                placeholder="city"
                asyncFunc={(search) => getLocation("city", search)}
                formatFunc={formatLocationsCommunityOptionsForProperties}
            />
            {city !== null && (
                <Filter.InputAsyncDataList
                    registerName="community"
                    placeholder="community"
                    asyncFunc={(search) =>
                        getLocation("community", search, city)
                    }
                    formatFunc={formatLocationsCommunityOptionsForProperties}
                />
            )}
            {city !== null && community !== null && (
                <Filter.InputAsyncDataList
                    registerName="subcommunity"
                    placeholder="subcommunity"
                    asyncFunc={(search) =>
                        getLocation("sub_community", search, city, community)
                    }
                    formatFunc={formatLocationsCommunityOptionsForProperties}
                />
            )}
            {/* {city !== null && community !== null && subcommunity !== null && (
                <Filter.Input
                    registerName="property_name"
                    placeholder="Property Name"
                    type="text"
                />
            )} */}
            {/* <Filter.InputDataList
                registerName="groupId"
                placeholder="Group"
                data={groupsOptions}
                isLoading={isGroupsLoading}
            /> */}
        </>
    );
}

export default LeadsFilter;
