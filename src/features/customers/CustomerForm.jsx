import { useForm } from "react-hook-form";
import FormInputDataList from "../../ui/FormInputDataList";
import FormInputAsyncDataList from "../../ui/FormInputAsyncDataList";
import useStaff from "../admin/staff/useStaff";
import useAreas from "../areas/useAreas";
import styles from "../../styles/FormGrid.module.css";

import FormInputCountries from "../../ui/FormInputCountries";
import useAllDetails from "../all-details/useAllDetails";
import useInfiniteDatabasesNames from "../database/useInfinteDatabasesNames";
import { getCommunities } from "../../services/apiProperties";
import { formatLocationsCommunityOptionsForProperties } from "../../utils/utils";

function CustomerForm({
    onCloseModal,
    defaultValues,
    isEditSession,
    onSubmit,
    isWorking,
}) {
    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm({
        defaultValues: defaultValues || {
            project_name: "",
            unit_number: "",
            name: "",
            Rooms: "",
            total_area: "",
            nationality: "",
            email: "",
            contact_number: "",
            second_number: "",
            agent_id: "",
            area_id: "",
        },
    });
    const { data } = useAllDetails();
    const bgColor = data?.company_settings?.sidebar_color_code || "#020079";
    const { databases, isLoading: databaseLoading } =
        useInfiniteDatabasesNames();
    const { data: staffData, isLoading: staffLoading } = useStaff();
    const { data: areaData, isLoading: areaLoading } = useAreas();
    const databaseOptions = databases?.map((item) => {
        return { value: item?._id, label: item?.name };
    });
    const staffOptions = staffData?.map((item) => ({
        value: item.id,
        label: item.name,
    }));

    const areaOptions = areaData?.map((item) => ({
        value: item.id,
        label: item.name,
    }));

    const handleFormSubmit = (data) => {
        const payload = {
            "Project name": data.project_name,
            "Unit number": Number(data.unit_number),
            Name: data.name,
            Rooms: Number(data.Rooms),
            "Total area": Number(data.total_area),
            Nationality: data.nationality ? data.nationality.value : "",
            "E-mail": data.email,
            "Contact number": Number(data.contact_number),
            "Second number": data.second_number
                ? Number(data.second_number)
                : 0,
            agent_id: data.agent_id ? String(data.agent_id.value) : "",
            area_id: data.area_id ? data.area_id.value : "",
            // community_id: data.community_id ? data.community_id.value : "",
            database_name_id: data.database_name_id
                ? String(data.database_name_id.value)
                : "",
        };
        onSubmit(payload);
        onCloseModal?.();
    };

    return (
        <form
            onSubmit={handleSubmit(handleFormSubmit)}
            className={styles.formGrid}
        >
            <h3>{isEditSession ? "Edit Customer" : "Create New Customer"}</h3>
            <div className={styles.formContainer}>
                <div>
                    <label>Project Name</label>
                    <input
                        {...register("project_name", {
                            required: "Project name is required",
                        })}
                        className={styles.input}
                        placeholder="Enter project name"
                    />
                    {errors.project_name && (
                        <span className={styles.errorText}>
                            {errors.project_name.message}
                        </span>
                    )}
                </div>

                <div>
                    <label>Unit Number</label>
                    <input
                        type="number"
                        {...register("unit_number", {
                            required: "Unit number is required",
                            valueAsNumber: true,
                        })}
                        className={styles.input}
                        placeholder="Enter unit number"
                    />
                    {errors.unit_number && (
                        <span className={styles.errorText}>
                            {errors.unit_number.message}
                        </span>
                    )}
                </div>

                <div>
                    <label>Name</label>
                    <input
                        {...register("name", { required: "Name is required" })}
                        className={styles.input}
                        placeholder="Enter customer name"
                    />
                    {errors.name && (
                        <span className={styles.errorText}>
                            {errors.name.message}
                        </span>
                    )}
                </div>

                <div>
                    <label>Total Area</label>
                    <input
                        type="number"
                        {...register("total_area", {
                            required: "Total area is required",
                            valueAsNumber: true,
                        })}
                        className={styles.input}
                        placeholder="Enter total area"
                    />
                    {errors.total_area && (
                        <span className={styles.errorText}>
                            {errors.total_area.message}
                        </span>
                    )}
                </div>

                <div>
                    <label>Total Rooms</label>
                    <input
                        type="number"
                        {...register("Rooms", {
                            required: "Total rooms is required",
                            valueAsNumber: true,
                        })}
                        className={styles.input}
                        placeholder="Enter number of rooms"
                    />
                    {errors.Rooms && (
                        <span className={styles.errorText}>
                            {errors.Rooms.message}
                        </span>
                    )}
                </div>

                <div>
                    <label>Nationality</label>
                    <FormInputCountries
                        required
                        control={control}
                        registerName="nationality"
                        placeholder="Select a country"
                    />
                </div>

                <div>
                    <label>Email</label>
                    <input
                        type="email"
                        {...register("email", {
                            required: "Email is required",
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: "Invalid email address",
                            },
                        })}
                        className={styles.input}
                        placeholder="Enter email address"
                    />
                    {errors.email && (
                        <span className={styles.errorText}>
                            {errors.email.message}
                        </span>
                    )}
                </div>

                <div>
                    <label>Contact Number</label>
                    <input
                        type="number"
                        {...register("contact_number", {
                            required: "Contact number is required",
                            valueAsNumber: true,
                        })}
                        className={styles.input}
                        placeholder="Enter contact number"
                    />
                    {errors.contact_number && (
                        <span className={styles.errorText}>
                            {errors.contact_number.message}
                        </span>
                    )}
                </div>

                <div>
                    <label>Second Number</label>
                    <input
                        type="number"
                        {...register("second_number", {
                            valueAsNumber: true,
                        })}
                        className={styles.input}
                        placeholder="Enter secondary number (optional)"
                    />
                </div>

                <div>
                    <label>Agent</label>
                    <FormInputDataList
                        control={control}
                        registerName="agent_id"
                        data={staffOptions}
                        isLoading={staffLoading}
                        required={true}
                        placeholder="Select Agent"
                    />
                    {errors.agent_id && (
                        <span className={styles.errorText}>
                            Agent is required
                        </span>
                    )}
                </div>

                {/* <div>
                    <label>Area</label>
                    <FormInputDataList
                        control={control}
                        registerName="area_id"
                        data={areaOptions}
                        isLoading={areaLoading}
                        required={true}
                        placeholder="Select Area"
                    />
                    {errors.area_id && (
                        <span className={styles.errorText}>
                            Area is required
                        </span>
                    )}
                </div> */}

                <div>
                    <label>Area</label>
                    <FormInputAsyncDataList
                        control={control}
                        registerName="area_id"
                        asyncFunc={getCommunities}
                        formatFunc={
                            formatLocationsCommunityOptionsForProperties
                        }
                        required={true}
                        placeholder="select Area"
                    />
                    {errors.area_id && (
                        <span className={styles.errorText}>
                            Community is required
                        </span>
                    )}
                </div>

                <div>
                    <label>Database Name</label>
                    <FormInputDataList
                        control={control}
                        registerName={"database_name_id"}
                        data={databaseOptions}
                        isLoading={databaseLoading}
                        required={true}
                        placeholder="Select Database Name"
                    />
                    {errors.database_name_id && (
                        <span className={styles.errorText}>
                            This field is required
                        </span>
                    )}
                </div>
                <div className={styles.btnsContainer}>
                    <button
                        className={styles.btnSubmit}
                        type="submit"
                        disabled={isWorking}
                        style={{
                            backgroundColor: bgColor,
                            border: `1px solid ${bgColor}`,
                        }}
                    >
                        {isWorking
                            ? "Processing..."
                            : isEditSession
                              ? "Update"
                              : "Submit"}
                    </button>
                </div>
            </div>
        </form>
    );
}

export default CustomerForm;
