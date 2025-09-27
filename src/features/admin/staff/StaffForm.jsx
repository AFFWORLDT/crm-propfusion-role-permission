import { useForm } from "react-hook-form";
import useCreateStaffMember from "./useCreateStaffMember";
import styles from "../../../styles/FormGrid.module.css";
import useUpdateStaffMember from "./useUpdateStaffMember";
import { GENDER_OPTIONS } from "../../../utils/constants";
import useRoles from "../teams/useRoles";
import useTeams from "../teams/useTeams";
import FormInputDataList from "../../../ui/FormInputDataList";
import FormInputContact from "../../../ui/FormInputContact";
import FormInputDatePicker from "../../../ui/FormInputDatePicker";
import FormInputCountries from "../../../ui/FormInputCountries";
import { buildStaffData } from "../../../utils/buildFormData";
import { useState } from "react";
import Cropper from "react-easy-crop";
import useLanguages from "../../../hooks/useLaug";
import { useMyPermissions } from "../../../hooks/useHasPermission";

function StaffForm({ onCloseModal, staffToEdit = {} }) {
    const [selectedImage, setSelectedImage] = useState(null);
    const { hasPermission } = useMyPermissions();

    const [previewImage, setPreviewImage] = useState(
        staffToEdit?.avatar || null
    );
    const [showCropper, setShowCropper] = useState(false);
    const [showLanguagesPopover, setShowLanguagesPopover] = useState(false);
    const [specialities, setSpecialities] = useState(
        staffToEdit?.specialities || []
    );
    const [specialityInput, setSpecialityInput] = useState("");
    const { data: languagesData, isLoading: isLoadingLanguages } =
        useLanguages();
    const mappedLanguages = languagesData.map((item) => {
        return {
            value: `${item[0]}:${item[1]}`,
            label: item[1],
        };
    });

    const handleAddSpeciality = (e) => {
        e.preventDefault();
        if (specialityInput.trim()) {
            setSpecialities([...specialities, specialityInput.trim()]);
            setSpecialityInput("");
        }
    };

    const handleRemoveSpeciality = (indexToRemove) => {
        setSpecialities(
            specialities.filter((_, index) => index !== indexToRemove)
        );
    };

    const parseNationality = (nationality) => {
        try {
            return nationality ? JSON.parse(nationality) : "";
        } catch (e) {
            return nationality || "";
        }
    };

    const isEditSession = staffToEdit.id ? true : false;
    const { register, handleSubmit, control, setValue, watch } = useForm({
        defaultValues: isEditSession
            ? {
                  ...staffToEdit,
                  order: staffToEdit?.order || 0,
                  team: {
                      label: staffToEdit.team_name,
                      value: staffToEdit.team,
                  },
                  dob: staffToEdit?.dob ? new Date(staffToEdit.dob) : "",
                  nationality: parseNationality(staffToEdit?.nationality),
                  languages: staffToEdit?.languages
                      ? staffToEdit?.languages.map((item) => {
                            return {
                                value: `${item}`,
                                label: `${item}`,
                            };
                        })
                      : [],
                  specialities: staffToEdit?.specialities || [],
                  role_id: staffToEdit?.role_id
                      ? Number(staffToEdit.role_id)
                      : "",
              }
            : {
                  order: 0,
                  specialities: [],
              },
    });

    const { addStaffMember, isPending: isCreating } = useCreateStaffMember();
    const { updateStaffMember, isPending: isUpdating } = useUpdateStaffMember();
    const isWorking = isCreating || isUpdating;

    const { data: teamsData, isLoading: isLoadingTeams } = useTeams();
    const { data: rolesData, isLoading: isLoadingRoles } = useRoles();

    const getAllTeams = (teams, level = 0) => {
        let allTeams = [];
        teams.forEach((team) => {
            const indent = "  ".repeat(level);
            allTeams.push({
                value: team.team_id,
                label: `${indent}${team.name}${team.team_leader ? ` (Leader: ${team.team_leader.name})` : ""}`,
            });
            if (team.sub_teams && team.sub_teams.length > 0) {
                allTeams = allTeams.concat(
                    getAllTeams(team.sub_teams, level + 1)
                );
            }
        });
        return allTeams;
    };

    const teamsOptions = getAllTeams(teamsData);

    const handleImageSelect = (e) => {
        if (e.target.files?.length) {
            const file = e.target.files[0];
            setSelectedImage(URL.createObjectURL(file));
            setShowCropper(true);
        }
    };

    const createImageFromCrop = async (croppedAreaPixels) => {
        const image = new Image();
        image.src = selectedImage;

        return new Promise((resolve) => {
            image.onload = () => {
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");

                canvas.width = croppedAreaPixels.width;
                canvas.height = croppedAreaPixels.height;

                ctx.drawImage(
                    image,
                    croppedAreaPixels.x,
                    croppedAreaPixels.y,
                    croppedAreaPixels.width,
                    croppedAreaPixels.height,
                    0,
                    0,
                    croppedAreaPixels.width,
                    croppedAreaPixels.height
                );

                canvas.toBlob((blob) => {
                    const croppedFile = new File([blob], "cropped-image.jpg", {
                        type: "image/jpeg",
                        lastModified: Date.now(),
                    });
                    resolve(croppedFile);
                }, "image/jpeg");
            };
        });
    };

    const handleCropComplete = async (croppedAreaPixels) => {
        const croppedFile = await createImageFromCrop(croppedAreaPixels);
        setValue("avatar", croppedFile);
        setPreviewImage(URL.createObjectURL(croppedFile));
        setShowCropper(false);
        setSelectedImage(null);
    };

    const handleCropCancel = () => {
        setShowCropper(false);
        setSelectedImage(null);
    };

    function onSubmit(data) {
        const avatar =
            typeof data.avatar === "string" ? data?.avatar : data?.avatar;
        const newStaff = buildStaffData({ ...data, specialities }, avatar);

        isEditSession
            ? updateStaffMember(
                  {
                      id: staffToEdit.id,
                      payload: newStaff,
                  },
                  {
                      onSettled: onCloseModal,
                  }
              )
            : addStaffMember(newStaff, {
                  onSettled: onCloseModal,
              });
    }

    return (
        <form className={styles.formGrid} onSubmit={handleSubmit(onSubmit)}>
            <h3>Staff Form</h3>

            <div className={styles.formContainer}>
                <div>
                    <label>Name</label>
                    <input type="text" required {...register("name")} />
                </div>
                <div>
                    <label>Team</label>
                    <FormInputDataList
                        control={control}
                        registerName={"team"}
                        data={[...teamsOptions]}
                        isLoading={isLoadingTeams}
                        placeholder="Select Team"
                    />
                </div>
                <div>
                    <label>Email</label>
                    <input type="email" required {...register("email")} />
                </div>
                <div>
                    <label>BRN Number</label>
                    <input type="string" {...register("brn_number")} />
                </div>
                <div>
                    <label>Emirates ID</label>
                    <input type="string" {...register("emirates_id")} />
                </div>
                <div>
                    <label>Passport Number</label>
                    <input type="string" {...register("passport_no")} />
                </div>
                <div className={styles.splitInput}>
                    <div>
                        <label>Phone</label>
                        <FormInputContact
                            control={control}
                            registerName="telCode"
                            placeholder="Tel Code"
                        />
                    </div>
                    <input type="text" required {...register("phone")} />
                </div>

                {!isEditSession && (
                    <div>
                        <label>Password</label>
                        <input
                            type="password"
                            required
                            {...register("password")}
                        />
                    </div>
                )}
                <div>
                    <label>Gender</label>
                    <select required {...register("gender")}>
                        {GENDER_OPTIONS.map((item) => (
                            <option value={item.value} key={item.value}>
                                {item.label}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>DOB</label>
                    <FormInputDatePicker
                        control={control}
                        registerName="dob"
                        placeholder="Select date"
                    />
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
                    <label>Languages</label>
                    <FormInputDataList
                        required
                        control={control}
                        registerName="languages"
                        placeholder="Select languages"
                        data={mappedLanguages}
                        isLoading={isLoadingLanguages}
                        isMulti
                    />
                    <div
                        style={{
                            marginTop: "8px",
                            position: "relative",
                        }}
                    >
                        <button
                            type="button"
                            onMouseEnter={() => setShowLanguagesPopover(true)}
                            onMouseLeave={() => setShowLanguagesPopover(false)}
                            style={{
                                padding: "4px 8px",
                                backgroundColor: "#f1f5f9",
                                border: "1px solid #e2e8f0",
                                borderRadius: "4px",
                                cursor: "pointer",
                                fontSize: "12px",
                                textTransform: "uppercase",
                                fontWeight: "500",
                                letterSpacing: "0.025em",
                            }}
                        >
                            See Languages ({watch("languages")?.length || 0})
                        </button>

                        {showLanguagesPopover && (
                            <div
                                onMouseEnter={() =>
                                    setShowLanguagesPopover(true)
                                }
                                onMouseLeave={() =>
                                    setShowLanguagesPopover(false)
                                }
                                style={{
                                    position: "absolute",
                                    top: "100%",
                                    left: "0",
                                    marginTop: "8px",
                                    padding: "12px",
                                    backgroundColor: "white",
                                    border: "1px solid #e2e8f0",
                                    borderRadius: "6px",
                                    boxShadow:
                                        "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                                    zIndex: 1000,
                                    minWidth: "200px",
                                    maxHeight: "300px",
                                    overflowY: "auto",
                                }}
                            >
                                {watch("languages")?.length > 0 ? (
                                    <div
                                        style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: "8px",
                                        }}
                                    >
                                        {watch("languages").map(
                                            (lang, index) => (
                                                <span
                                                    key={index}
                                                    style={{
                                                        padding: "4px 8px",
                                                        backgroundColor:
                                                            "#f8fafc",
                                                        borderRadius: "4px",
                                                        fontSize: "14px",
                                                    }}
                                                >
                                                    {lang.label}
                                                </span>
                                            )
                                        )}
                                    </div>
                                ) : (
                                    <p
                                        style={{
                                            color: "#64748b",
                                            fontSize: "14px",
                                        }}
                                    >
                                        No languages selected
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
                <div>
                    <label>State</label>
                    <select required {...register("state")}>
                        <option value="" hidden>
                            Select
                        </option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>
                {(hasPermission("update_roles") ||
                    hasPermission("manage_roles")) && (
                    <div>
                        <label>Role</label>
                        <select
                            required
                            {...register("role_id")}
                            disabled={isLoadingRoles}
                        >
                            {!isEditSession && (
                                <option value="" hidden>
                                    Select
                                </option>
                            )}
                            {rolesData?.roles?.map((option) => (
                                <option
                                    value={Number(option?.role_id)}
                                    key={option?.role_id}
                                >
                                    {option?.name}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
                <div>
                    <label
                        style={{
                            display: "block",
                            marginBottom: "8px",
                            fontWeight: 500,
                        }}
                    >
                        Specialties
                    </label>
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "12px",
                            padding: "12px",
                            border: "1px solid #e2e8f0",
                            borderRadius: "6px",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                gap: "8px",
                            }}
                        >
                            <input
                                type="text"
                                value={specialityInput}
                                onChange={(e) =>
                                    setSpecialityInput(e.target.value)
                                }
                                placeholder="Enter speciality"
                                style={{
                                    flex: 1,
                                    padding: "8px 12px",
                                    border: "1px solid #e2e8f0",
                                    borderRadius: "4px",
                                    fontSize: "14px",
                                }}
                            />
                            <button
                                type="button"
                                onClick={handleAddSpeciality}
                                style={{
                                    padding: "8px 16px",
                                    backgroundColor: "#3b82f6",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "4px",
                                    cursor: "pointer",
                                    fontSize: "14px",
                                    fontWeight: 500,
                                    ":hover": {
                                        backgroundColor: "#2563eb",
                                    },
                                }}
                            >
                                Add
                            </button>
                        </div>
                        <div
                            style={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: "8px",
                            }}
                        >
                            {specialities.map((spec, index) => (
                                <span
                                    key={index}
                                    style={{
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: "6px",
                                        padding: "4px 8px",
                                        backgroundColor: "#f1f5f9",
                                        borderRadius: "4px",
                                        fontSize: "14px",
                                    }}
                                >
                                    {spec}
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleRemoveSpeciality(index)
                                        }
                                        style={{
                                            padding: "0",
                                            backgroundColor: "transparent",
                                            border: "none",
                                            color: "#64748b",
                                            cursor: "pointer",
                                            fontSize: "16px",
                                            lineHeight: 1,
                                            ":hover": {
                                                color: "#475569",
                                            },
                                        }}
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
                <div>
                    <label>Avatar</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageSelect}
                        required={!isEditSession && !previewImage}
                    />
                    {previewImage && (
                        <img
                            src={previewImage}
                            alt="Preview"
                            className={styles.previewImage}
                        />
                    )}
                </div>
                <div
                    style={{
                        gridColumn: "1 / -1",
                    }}
                >
                    <label>About</label>
                    <textarea {...register("remarks")} />
                </div>
                <div>
                    <label>S No.</label>
                    <input
                        type="number"
                        min="0"
                        placeholder="Enter serial number"
                        {...register("order", {
                            valueAsNumber: true,
                            validate: (value) =>
                                value >= 0 || "Order must be 0 or greater",
                        })}
                    />
                </div>
                <div className="btnsContainer">
                    <button
                        onClick={onCloseModal}
                        className="btnFormNormal"
                        type="button"
                        disabled={isWorking}
                    >
                        Cancel
                    </button>
                    <button
                        className="btnSubmit"
                        type="submit"
                        disabled={isWorking}
                    >
                        {isWorking ? "Processing..." : "Submit"}
                    </button>
                </div>
            </div>
            {showCropper && selectedImage && (
                <ImageCropper
                    image={selectedImage}
                    onCropComplete={handleCropComplete}
                    onCancel={handleCropCancel}
                />
            )}
        </form>
    );
}

export default StaffForm;

function ImageCropper({ image, onCropComplete, onCancel }) {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

    return (
        <div className={styles.cropContainer}>
            <div className={styles.cropContent}>
                <div className={styles.cropperWrapper}>
                    <Cropper
                        image={image}
                        crop={crop}
                        zoom={zoom}
                        aspect={1}
                        onCropChange={setCrop}
                        onZoomChange={setZoom}
                        onCropComplete={(_, croppedPixels) =>
                            setCroppedAreaPixels(croppedPixels)
                        }
                    />
                </div>
                <div className={styles.cropActions}>
                    <button
                        type="button"
                        className={`${styles.cropBtn} ${styles.cancelBtn}`}
                        onClick={onCancel}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        className={`${styles.cropBtn} ${styles.cropSubmitBtn}`}
                        onClick={() => onCropComplete(croppedAreaPixels)}
                    >
                        Crop & Upload
                    </button>
                </div>
            </div>
        </div>
    );
}
