import { useEffect, useState } from "react";
import BtnToggle from "../../../ui/BtnToggle";
import styles from "./QrCodeForm.module.css";
import toast from "react-hot-toast";
import Spinner from "../../../ui/Spinner";
import { useForm } from "react-hook-form";
import { POSITION_OPTIONS } from "../../../utils/constants";
import useUpdateWatermarkSettings from "../watermark/useUpdateWatermarkSettings";
import useWatermarkSettings from "../watermark/useWatermarkSettings";

function QrCodeForm() {
    const { isLoading, data, error } = useWatermarkSettings();
    const { changeWatermarkSettings, isPending } = useUpdateWatermarkSettings();

    const { register, watch, handleSubmit, reset } = useForm({
        defaultValues: {},
    });
    const [settingsActive, setSettingsActive] = useState(false);

    const watermarkPosition = watch("qr_code_position");
    const watermarkOpacity = watch("qr_code_opacity");
    const watermarkSize = watch("qr_code_size");
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
        setSettingsActive(data?.qr_code_on);
        reset(data);
    }, [data, reset]);

    function onSubmit(formData) {
        const newSettings = {
            qr_code_on: settingsActive,
            qr_code_position: formData.qr_code_position,
            qr_code_opacity: formData.qr_code_opacity,
            qr_code_size: formData.qr_code_size,
                
        };
        
        changeWatermarkSettings(newSettings);
    }

    function handleReset() {
        const newSettings = {
            qr_code_on: true,
            qr_code_position: "center",
            qr_code_opacity: "1",
            qr_code_size: "50",
        };

        changeWatermarkSettings(newSettings);
    }

    if (isLoading) return <Spinner type="fullPage" />;

    return (
        <div className={styles.watermarkForm}>
            <div className={styles.watermarkFormContainer}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div>
                        <span>QR Code on/off</span>
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
                                        {...register("qr_code_position")}
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
                            {...register("qr_code_opacity")}
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
                            {...register("qr_code_size", {
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
                    <div
                       
                    >
                        <img
                            src="/images/qr.jpg"
                            alt="QR Code Preview"
                            style={{
                                ...imageStyles,
                            }}
                        />
                    </div>
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
        transition:
            "opacity 0.5s ease, transform 0.5s ease, grid-area 0.5s ease",
    };
}

export default QrCodeForm;
