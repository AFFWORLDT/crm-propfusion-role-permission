import { useEffect, useState } from "react";
import BtnToggle from "../../../ui/BtnToggle";
import useWatermarkSettings from "./useWatermarkSettings";
import styles from "./WatermarkForm.module.css";
import toast from "react-hot-toast";
import Spinner from "../../../ui/Spinner";
import { useForm } from "react-hook-form";
import useUpdateWatermarkSettings from "./useUpdateWatermarkSettings";
import { POSITION_OPTIONS } from "../../../utils/constants";

function WatermarkForm() {
    const { isLoading, data, error } = useWatermarkSettings();
    const { changeWatermarkSettings, isPending } = useUpdateWatermarkSettings();

    const { register, watch, handleSubmit, reset } = useForm({
        defaultValues: {},
    });
    const [settingsActive, setSettingsActive] = useState(false);

    const watermarkPosition = watch("watermark_position");
    const watermarkOpacity = watch("watermark_opacity");
    const watermarkSize = watch("watermark_size");
    const imageStyles = generateImageStyles(
        watermarkPosition,
        watermarkOpacity,
        watermarkSize
    );

    useEffect(() => {
        if (error) toast.error(error.message);
    }, [error]);

    // Set default values whenever the data arrives
    useEffect(() => {
        setSettingsActive(data?.watermark_on);
        reset(data);
    }, [data, reset]);

    function onSubmit(formData) {
        const newSettings = {
            ...formData,
            watermark_on: settingsActive,
        };

        if (
            !newSettings.watermark_url ||
            typeof newSettings.watermark_url === "string"
        ) {
            delete newSettings.watermark_url;
        }

        changeWatermarkSettings(newSettings);
    }

    function handleReset() {
        const newSettings = {
            watermark_on: true,
            watermark_position: "center",
            watermark_opacity: "1",
            watermark_size: "50",
        };

        changeWatermarkSettings(newSettings);
    }

    if (isLoading) return <Spinner type="fullPage" />;

    return (
        <div className={styles.watermarkForm}>
            <div className={styles.watermarkFormContainer}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div>
                        <span>Watermark on/off</span>
                        <BtnToggle
                            isActive={settingsActive}
                            onToggle={() => setSettingsActive(!settingsActive)}
                            isDisabled={isPending}
                        />
                    </div>

                    <div className={styles.inputRadio}>
                        <span>Position</span>
                        <div>
                            {POSITION_OPTIONS.map((item, i) => (
                                <div key={i}>
                                    <input
                                        {...register("watermark_position")}
                                        id={item.value}
                                        type="radio"
                                        value={item.value}
                                        disabled={isPending}
                                    />
                                    <label htmlFor={item.value}>
                                        {item.label}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className={styles.inputRange}>
                        <span>Opacity</span>
                        <input
                            {...register("watermark_opacity")}
                            type="range"
                            min={0}
                            max={1}
                            step={0.1}
                            disabled={isPending}
                        />
                    </div>

                    <div className={styles.inputRange}>
                        <span>Size</span>
                        <input
                            {...register("watermark_size", {
                                onChange: (e) => {
                                    if (e.target.value < 10)
                                        e.target.value = 10;
                                },
                            })}
                            type="range"
                            min={0}
                            max={100}
                            step={10}
                            disabled={isPending}
                        />
                    </div>

                    <div className={styles.inputFile}>
                        <span>Watermark</span>
                        <div>
                            {data?.watermark_url && (
                                <div className="imgContainer">
                                    <img src={data.watermark_url} />
                                </div>
                            )}
                            <input
                                {...register("watermark_url")}
                                type="file"
                                accept="image/*"
                                disabled={isPending}
                            />
                        </div>
                    </div>

                    <div className="btnsContainer">
                        <button
                            onClick={handleReset}
                            type="button"
                            className="btnFormNormal"
                        >
                            Reset
                        </button>
                        <button
                            type="submit"
                            className="btnSubmit"
                            disabled={isPending}
                        >
                              {isPending ? "Processing..." : "Submit"}
                        </button>
                    </div>
                </form>
            </div>

            <div className={styles.watermarkPreview}>
                {settingsActive && (
                    <img style={imageStyles} src={data?.watermark_url} />
                )}
            </div>
        </div>
    );
}

function generateImageStyles(
    watermarkPosition,
    watermarkOpacity,
    watermarkSize
) {
    const positions = watermarkPosition?.split("_");
    const row = positions?.[0]; // top | center | bottom
    const column = positions?.[1] ?? "center"; // left | center | right

    const alignMap = {
        top: "start",
        center: "center",
        bottom: "end",
    };

    const rowMap = {
        top: 1,
        center: 2,
        bottom: 3,
    };

    const columnMap = {
        left: 1,
        center: 2,
        right: 3,
    };

    const rowNum = rowMap[row];
    const columnNum = columnMap[column];

    return {
        gridArea: `${rowNum} / ${columnNum}`,
        alignSelf: alignMap[row],
        justifySelf: column,
        opacity: watermarkOpacity,
        transform: `scale(${watermarkSize / 100})`, 
        transformOrigin: `${row} ${column}`,
        maxWidth: "100%",
        maxHeight: "100%",
        objectFit: "contain", 
        transition: "opacity 0.5s ease, transform 0.5s ease, grid-area 0.5s ease",
    };
}

export default WatermarkForm;
