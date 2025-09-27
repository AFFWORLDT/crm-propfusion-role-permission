import { useEffect, useState } from "react";
import styles from "../../styles/ManageBase.module.css";
import useGetBayutKey from "../../features/admin/general/useGetBayutKey";
import useGetPropertyFinderKeys from "../../features/admin/general/useGetPropertyFinderKeys";
import toast from "react-hot-toast";
import Spinner from "../../ui/Spinner";
import useCreateBayutKey from "../../features/admin/general/useCreateBayutKey";
import useCreatePropertyFinderKey from "../../features/admin/general/useCreatePropertyFinderKey";
import SectionTop from "../../ui/SectionTop";
import { useNavigate } from "react-router-dom";
import TabBar from "../../ui/TabBar";
import { MANAGE_CALLS_TABS } from "../../utils/constants";
import useCreateCloudinaryCred from "../../features/admin/general/useCreateCloudinaryCred";
import useGetCloudinaryCredentials from "../../features/admin/general/useGetCloudinaryCredentials";
import useGetOpenAiKey from "../../features/admin/general/useGetOpenAiKey";
import useCreateOpenAiKey from "../../features/admin/general/useCreateOpenAiKey";
import useGetGeminiKey from "../../features/admin/general/useGetGeminiKey";
import useCreateGeminiKey from "../../features/admin/general/useCreateGeminiKey";

function ManageCalls() {
  
    const router = useNavigate();
    const {
        isLoading: isLoadingBayut,
        data: dataBayut,
        error: errorBayut,
    } = useGetBayutKey();
    const {
        isLoading: isLoadingPropertyFinder,
        data: dataPropertyFinder,
        error: errorPropertyFinder,
    } = useGetPropertyFinderKeys();
    const { saveCloudinaryKey, isPending: isSavingCloudinaryKey } =
        useCreateCloudinaryCred();
    const {
        isLoading: isLoadingCloudinary,
        data: dataCloudinary,
        error: errorCloudinary,
    } = useGetCloudinaryCredentials();

    const { saveBayutKey, isPending: isSavingBayutKey } = useCreateBayutKey();
    const { savePropertyFinderKey, isPending: isSavingPropertyFinderKey } =
        useCreatePropertyFinderKey();

    const { isLoading: isLoadingOpenAi, data: dataOpenAi, error: errorOpenAi } = useGetOpenAiKey();
    const { saveOpenAiKey, isPending: isSavingOpenAiKey } = useCreateOpenAiKey();

    const { isLoading: isLoadingGemini, data: dataGemini, error: errorGemini } = useGetGeminiKey();
    const { saveGeminiKey, isPending: isSavingGeminiKey } = useCreateGeminiKey();

    const [bayutApiKey, setBayutApiKey] = useState("");
    const [propertyFinderKeys, setPropertyFinderKeys] = useState("");
    const [cloudinaryKeys, setCloudinaryKeys] = useState({
        cloudName: "",
        apiKey: "",
        apiSecret: "",
    });

    const [openAiApiKey, setOpenAiApiKey] = useState("");
    const [geminiApiKey, setGeminiApiKey] = useState("");

    const [hiddenInputs, setHiddenInputs] = useState({
        bayutApi: true,
        propertyFinderApi: true,
        propertyFinderSecret: true,
        cloudinaryApiKey: true,
        cloudinaryApiSecret: true,
        openAiApi: true,
        geminiApi: true,
    });

    function toggleHide(inputField) {
        setHiddenInputs((currentState) => {
            return {
                ...currentState,
                [inputField]: !currentState[inputField],
            };
        });
    }

    useEffect(() => {
        if (dataBayut) {
            setBayutApiKey(dataBayut);
        }
    }, [dataBayut]);

    useEffect(() => {
        if (dataPropertyFinder) {
            setPropertyFinderKeys(dataPropertyFinder);
        }
    }, [dataPropertyFinder]);

    useEffect(() => {
        if (dataCloudinary) {
            setCloudinaryKeys(dataCloudinary);
        }
    }, [dataCloudinary]);

    useEffect(() => {
        if (errorCloudinary) {
            toast.error(errorCloudinary.message);
        }
    }, [errorCloudinary]);

    useEffect(() => {
        if (errorBayut) {
            toast.error(errorBayut.message);
        }
        if (errorPropertyFinder) {
            toast.error(errorPropertyFinder.message);
        }
    }, [errorBayut, errorPropertyFinder]);

    useEffect(() => {
        if (dataOpenAi) {
            setOpenAiApiKey(dataOpenAi);
        }
    }, [dataOpenAi]);

    useEffect(() => {
        if (errorOpenAi) toast.error(errorOpenAi.message);
    }, [errorOpenAi]);

    useEffect(() => {
        if (dataGemini) {
            setGeminiApiKey(dataGemini);
        }
    }, [dataGemini]);

    useEffect(() => {
        if (errorGemini) toast.error(errorGemini.message);
    }, [errorGemini]);

    function handleBayutForm(e) {
        e.preventDefault();
        if (bayutApiKey === dataBayut) return;
        saveBayutKey({ apiKey: bayutApiKey, source: "Bayut & Dubizzle" });
    }

    function handlePropertyFinderForm(e) {
        e.preventDefault();
        if (
            JSON.stringify(propertyFinderKeys) ===
            JSON.stringify(dataPropertyFinder)
        )
            return;
        savePropertyFinderKey({
            apiKey: propertyFinderKeys.apiKey,
            secretKey: propertyFinderKeys.secretKey,
            source: "Property Finder",
        });
    }

    function handleCloudinaryForm(e) {
        e.preventDefault();
        saveCloudinaryKey({
            cloudName: cloudinaryKeys.cloudName,
            apiKey: cloudinaryKeys.apiKey,
            apiSecret: cloudinaryKeys.apiSecret,
            source: "Cloudinary",
        });
    }

    function handleOpenAiForm(e) {
        e.preventDefault();
        if (openAiApiKey === dataOpenAi) return;
        saveOpenAiKey({ apiKey: openAiApiKey, source: "OpenAI" });
    }

    function handleGeminiForm(e) {
        e.preventDefault();
        if (geminiApiKey === dataGemini) return;
        saveGeminiKey({ apiKey: geminiApiKey, source: "Gemini" });
    }

    if (isLoadingBayut || isLoadingPropertyFinder || isLoadingCloudinary || isLoadingOpenAi || isLoadingGemini)
        return <Spinner type="fullPage" />;

    return (
        <div className="sectionContainer">
            <SectionTop heading="Manage Calls">
                <TabBar
                    tabs={MANAGE_CALLS_TABS}
                    activeTab={"MANAGE_CALLS"}
                    navigateTo={(id) =>
                        MANAGE_CALLS_TABS.find((tab) => tab.id === id)?.path ||
                        "/admin/general/manage-calls"
                    }
                />
            </SectionTop>
            <section
                className="sectionStyles"
                style={{ backgroundColor: MANAGE_CALLS_TABS[0].bgColor }}
            >
                <div className="sectionDiv">
                    <div className={styles.manage}>
                        <form onSubmit={handleBayutForm}>
                            <div className={styles.formTitle}>
                                <img src="/icons/bayut.png" />
                                <img src="/icons/dubizzle.png" />
                                <h3>Bayut & Dubizzle</h3>
                            </div>

                            <div className={styles.formFlex}>
                                <div>
                                    <label htmlFor="bayutApiKey">API Key</label>
                                    <input
                                        value={bayutApiKey}
                                        onChange={(e) =>
                                            setBayutApiKey(e.target.value)
                                        }
                                        id="bayutApiKey"
                                        type={
                                            hiddenInputs.bayutApi
                                                ? "password"
                                                : "text"
                                        }
                                    />
                                    <BtnHide
                                        inputField="bayutApi"
                                        toggleHide={toggleHide}
                                        hiddenInputs={hiddenInputs}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className={styles.btnSave}
                                    disabled={isSavingBayutKey}
                                >
                                    Save
                                </button>
                            </div>
                        </form>

                        <form onSubmit={handlePropertyFinderForm}>
                            <div className={styles.formTitle}>
                                <img src="/icons/property-finder.png" />
                                <h3>Property Finder</h3>
                            </div>

                            <div className={styles.formFlex}>
                                <div>
                                    <label htmlFor="propertyFinderApi">
                                        API Key
                                    </label>
                                    <input
                                        value={propertyFinderKeys.apiKey ?? ""}
                                        onChange={(e) =>
                                            setPropertyFinderKeys({
                                                ...propertyFinderKeys,
                                                apiKey: e.target.value,
                                            })
                                        }
                                        id="propertyFinderApi"
                                        type={
                                            hiddenInputs.propertyFinderApi
                                                ? "password"
                                                : "text"
                                        }
                                    />
                                    <BtnHide
                                        inputField="propertyFinderApi"
                                        toggleHide={toggleHide}
                                        hiddenInputs={hiddenInputs}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className={styles.btnSave}
                                    disabled={isSavingPropertyFinderKey}
                                >
                                    Save
                                </button>
                            </div>

                            <div className={styles.formFlex}>
                                <div>
                                    <label htmlFor="propertyFinderSecret">
                                        Secret Key
                                    </label>
                                    <input
                                        value={
                                            propertyFinderKeys.secretKey ?? ""
                                        }
                                        onChange={(e) =>
                                            setPropertyFinderKeys({
                                                ...propertyFinderKeys,
                                                secretKey: e.target.value,
                                            })
                                        }
                                        id="propertyFinderSecret"
                                        type={
                                            hiddenInputs.propertyFinderSecret
                                                ? "password"
                                                : "text"
                                        }
                                    />
                                    <BtnHide
                                        inputField="propertyFinderSecret"
                                        toggleHide={toggleHide}
                                        hiddenInputs={hiddenInputs}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className={styles.btnSave}
                                    disabled={isSavingPropertyFinderKey}
                                >
                                    Save
                                </button>
                            </div>
                        </form>

                        <form onSubmit={handleCloudinaryForm}>
                            <div className={styles.formTitle}>
                                <img src="/icons/cloudinary.svg" />
                                <h3>Cloudinary</h3>
                            </div>

                            <div className={styles.formFlex}>
                                <div>
                                    <label htmlFor="cloudinaryCloudName">
                                        Cloud Name
                                    </label>
                                    <input
                                        value={cloudinaryKeys.cloudName}
                                        onChange={(e) =>
                                            setCloudinaryKeys({
                                                ...cloudinaryKeys,
                                                cloudName: e.target.value,
                                            })
                                        }
                                        id="cloudinaryCloudName"
                                        type="text"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className={styles.btnSave}
                                    disabled={isSavingCloudinaryKey}
                                >
                                    Save
                                </button>
                            </div>

                            <div className={styles.formFlex}>
                                <div>
                                    <label htmlFor="cloudinaryApiKey">
                                        API Key
                                    </label>
                                    <input
                                        value={cloudinaryKeys.apiKey}
                                        onChange={(e) =>
                                            setCloudinaryKeys({
                                                ...cloudinaryKeys,
                                                apiKey: e.target.value,
                                            })
                                        }
                                        id="cloudinaryApiKey"
                                        type={
                                            hiddenInputs.cloudinaryApiKey
                                                ? "password"
                                                : "text"
                                        }
                                    />
                                    <BtnHide
                                        inputField="cloudinaryApiKey"
                                        toggleHide={toggleHide}
                                        hiddenInputs={hiddenInputs}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className={styles.btnSave}
                                    disabled={isSavingCloudinaryKey}
                                >
                                    Save
                                </button>
                            </div>

                            <div className={styles.formFlex}>
                                <div>
                                    <label htmlFor="cloudinaryApiSecret">
                                        API Secret
                                    </label>
                                    <input
                                        value={cloudinaryKeys.apiSecret}
                                        onChange={(e) =>
                                            setCloudinaryKeys({
                                                ...cloudinaryKeys,
                                                apiSecret: e.target.value,
                                            })
                                        }
                                        id="cloudinaryApiSecret"
                                        type={
                                            hiddenInputs.cloudinaryApiSecret
                                                ? "password"
                                                : "text"
                                        }
                                    />
                                    <BtnHide
                                        inputField="cloudinaryApiSecret"
                                        toggleHide={toggleHide}
                                        hiddenInputs={hiddenInputs}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className={styles.btnSave}
                                    disabled={isSavingCloudinaryKey}
                                >
                                    Save
                                </button>
                            </div>
                        </form>

                        <form onSubmit={handleOpenAiForm}>
                            <div className={styles.formTitle}>
                                <img src="/icons/openai.svg" alt="OpenAI" style={{ width: 32, height: 32 }} />
                                <h3>OpenAI</h3>
                            </div>
                            <div className={styles.formFlex}>
                                <div>
                                    <label htmlFor="openAiApiKey">API Key</label>
                                    <input
                                        value={openAiApiKey}
                                        onChange={(e) => setOpenAiApiKey(e.target.value)}
                                        id="openAiApiKey"
                                        type={hiddenInputs.openAiApi ? "password" : "text"}
                                    />
                                    <BtnHide
                                        inputField="openAiApi"
                                        toggleHide={toggleHide}
                                        hiddenInputs={hiddenInputs}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className={styles.btnSave}
                                    disabled={isSavingOpenAiKey}
                                >
                                    Save
                                </button>
                            </div>
                        </form>

                        <form onSubmit={handleGeminiForm}>
                            <div className={styles.formTitle}>
                                <img src="/icons/gemini.svg" alt="Gemini" style={{ width: 32, height: 32 }} />
                                <h3>Gemini</h3>
                            </div>
                            <div className={styles.formFlex}>
                                <div>
                                    <label htmlFor="geminiApiKey">API Key</label>
                                    <input
                                        value={geminiApiKey}
                                        onChange={(e) => setGeminiApiKey(e.target.value)}
                                        id="geminiApiKey"
                                        type={hiddenInputs.geminiApi ? "password" : "text"}
                                    />
                                    <BtnHide
                                        inputField="geminiApi"
                                        toggleHide={toggleHide}
                                        hiddenInputs={hiddenInputs}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className={styles.btnSave}
                                    disabled={isSavingGeminiKey}
                                >
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </section>
        </div>
    );
}

function BtnHide({ inputField, toggleHide, hiddenInputs }) {
    return (
        <button type="button" onClick={() => toggleHide(inputField)}>
            <img
                src={
                    hiddenInputs[inputField]
                        ? "/icons/eye.svg"
                        : "/icons/eye-off.svg"
                }
            />
        </button>
    );
}

export default ManageCalls;
