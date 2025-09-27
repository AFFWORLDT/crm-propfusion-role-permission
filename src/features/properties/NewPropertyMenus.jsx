import { useNavigate } from "react-router-dom";
import ConfirmDelete, { ConfirmApiCall } from "../../ui/ConfirmDelete";
import Menus from "../../ui/Menus";
import Modal from "../../ui/Modal";
import styles from "./PropertyMenus.module.css";
import RentalAgreementForm from "../rental-agreement/RentalAgreementForm";
import useCreateRentalAgreement from "../rental-agreement/useCreateRentalAgreement";
import useDeleteProperty from "./useDeleteProperty";
import useCreateProperty from "./useCreateProperty";
import useUpdateProperty from "./useUpdateProperty";
import { useAuth } from "../../context/AuthContext";
import { useRefreshProperties } from "./useRefreshProperties";
import { useForm } from "react-hook-form";
import useImagesStore from "../../store/imagesStore";
import ChangeRefIdForm from "./ChangeRefIdForm";
import { useMyPermissions } from "../../hooks/useHasPermission";
import { useState } from "react";
import CurrencySwitcher from "../../components/CurrencySwitcher";
import SocialMediaShare from "../../components/SocialMediaShare";

function NewPropertyMenus({ data }) {
    const { hasPermission } = useMyPermissions();

    const { currentUser } = useAuth();
    const { mutate, isPending } = useRefreshProperties();
    const { removeProperty, isPending: isDeletingProperty } =
        useDeleteProperty();
    const { register, watch } = useForm();
    const portal = watch("portal");
    const { addProperty } = useCreateProperty();
    const { changeProperty } = useUpdateProperty();
    const navigate = useNavigate();
    const {
        addRentalAgreement: createRentalAgreement,
        isPending: isCreatingAgreement,
    } = useCreateRentalAgreement();

    const [showCurrencyModal, setShowCurrencyModal] = useState(false);
    const [currencyModalType, setCurrencyModalType] = useState("");
    const [showSocialModal, setShowSocialModal] = useState(false);
    const [isCurrent, setIsCurrent] = useState(false);

    const { clearAllImages } = useImagesStore();
    function handleDuplicateInSell(currentListingType) {
        const newProperty = {
            ...data,
            title: `Copy of ${data.title}`,
            listingType: "SELL",
        };

        delete newProperty.id;

        if (currentListingType === "RENT") {
            delete newProperty.cheques;
            delete newProperty.deposit;
            delete newProperty.priceType;
            delete newProperty.availabilityDate;
            return navigate("/for-sell/add", { state: newProperty });
        }

        addProperty({ newProperty }, { onSettled: () => navigate(-1) });
    }

    function handleDuplicateInRent(currentListingType) {
        const newProperty = {
            ...data,
            title: `Copy of ${data.title}`,
            listingType: "RENT",
        };

        delete newProperty.id;

        if (currentListingType === "SELL") {
            delete newProperty.completionStatus;
            delete newProperty.acCharge;
            delete newProperty.serviceCharge;
            delete newProperty.hasMortgage;
            return navigate("/for-rent/add", { state: newProperty });
        }

        addProperty({ newProperty }, { onSettled: () => navigate(-1) });
    }

    function handleChangeStatus(status) {
        const updatedProperty = {
            ...data,
            status,
        };

        delete updatedProperty.id;

        changeProperty({ id: data.id, updatedProperty });
    }
    function handleChangePublicStatus(status) {
        const updatedProperty = {
            ...data,
            public_status: status,
        };

        delete updatedProperty.id;

        changeProperty({ id: data.id, updatedProperty });
    }

    const openCurrencyModal = (type) => {
        if (type === "premium") {
            const userConfirmed = confirm(
                "Do you want to proceed with Login agent?"
            );
            if (!userConfirmed) {
                setIsCurrent(false);
                setCurrencyModalType(type);
                setShowCurrencyModal(true);
                return;
            }
            setIsCurrent(true);
        }
        setCurrencyModalType(type);
        setShowCurrencyModal(true);
    };

    const handleCurrencySelect = (currencyCode, rate, convertedPrice) => {
        const url =
            currencyModalType === "premium"
                ? `/share-premium/${data.listingType.toLowerCase()}/${data.id}?pdf=1&userId=${currentUser?.id}&currency=${currencyCode}&rate=${rate}&isCurrent=${isCurrent}`
                : `/share-new-property/${data.listingType.toLowerCase()}/${data.id}?pdf=1&userId=${currentUser?.id}&currency=${currencyCode}&rate=${rate}`;

        window.open(url, "_blank", "noopener,noreferrer");
    };

    return (
        <div className={styles.propertyMenus}>
            <Modal>
                <Menus>
                    <Menus.Toggle id={data.id} />

                    <Menus.List id={data.id}>
                        <Modal.Open openWindowName="ownerInfo">
                            <Menus.Button icon="/icons/info.svg">
                                Owner Info
                            </Menus.Button>
                        </Modal.Open>

                        <>
                            <Menus.Button
                                onClick={() =>
                                    handleChangePublicStatus(
                                        data?.public_status === true
                                            ? false
                                            : true
                                    )
                                }
                                icon={`${data?.public_status === true ? "/icons/eye-off.svg" : "/icons/eye.svg"}`}
                            >
                                {data?.public_status === true
                                    ? "Make Private"
                                    : "Make Public"}{" "}
                            </Menus.Button>
                        </>

                        {data.status !== "ACTIVE" && (
                            <>
                                <Menus.Button
                                    onClick={() => handleChangeStatus("ACTIVE")}
                                    icon="/icons/eye.svg"
                                >
                                    Activate
                                </Menus.Button>
                            </>
                        )}

                        {data.status !== "INACTIVE" && (
                            <>
                                <Menus.Button
                                    onClick={() =>
                                        handleChangeStatus("INACTIVE")
                                    }
                                    icon="/icons/eye-off.svg"
                                >
                                    Inactivate
                                </Menus.Button>
                            </>
                        )}

                        {data?.status !== "SOLD" &&
                            data.listingType === "SELL" && (
                                <Menus.Button
                                    onClick={() => handleChangeStatus("SOLD")}
                                    icon="/icons/sold.svg"
                                >
                                    Mark as Sold
                                </Menus.Button>
                            )}
                        {data?.status !== "RENTED" &&
                            data.listingType === "RENT" && (
                                <>
                                    <Modal.Open openWindowName="rentalAgreement">
                                        <Menus.Button icon="/icons/sold.svg">
                                            Rental Agreement
                                        </Menus.Button>
                                    </Modal.Open>

                                    <Menus.Button
                                        onClick={() =>
                                            handleChangeStatus("RENTED")
                                        }
                                        disabled={isPending}
                                        icon="/icons/refresh.svg"
                                    >
                                        Mark as Rented
                                    </Menus.Button>
                                </>
                            )}
                        <Modal.Open openWindowName="RefreshListing">
                            <Menus.Button
                                disabled={isPending}
                                icon="/icons/refresh.svg"
                            >
                                Refresh Listing
                            </Menus.Button>
                        </Modal.Open>
                        {hasPermission("update_properties") && (
                            <Menus.Button
                                onClick={() => {
                                    clearAllImages();
                                    navigate(
                                        `/for-${data.listingType.toLowerCase()}/edit/${data.id}`
                                    );
                                }}
                                icon="/icons/edit.svg"
                            >
                                Edit
                            </Menus.Button>
                        )}
                        <Menus.Button
                            onClick={() =>
                                handleDuplicateInSell(data.listingType)
                            }
                            icon="/icons/duplicate.svg"
                        >
                            Duplicate in Sell
                        </Menus.Button>

                        <Menus.Button
                            onClick={() =>
                                handleDuplicateInRent(data.listingType)
                            }
                            icon="/icons/duplicate.svg"
                        >
                            Duplicate in Rent
                        </Menus.Button>

                        <Modal.Open openWindowName="deleteProperty">
                            <Menus.Button icon="/icons/delete.svg">
                                Delete
                            </Menus.Button>
                        </Modal.Open>

                        <Menus.Button
                            icon="/icons/share.svg"
                            onClick={() => openCurrencyModal("regular")}
                        >
                            Share PDF
                        </Menus.Button>

                        <Menus.Button
                            icon="/icons/share-premium.svg"
                            onClick={() => openCurrencyModal("premium")}
                        >
                            Premium PDF
                        </Menus.Button>

                        <Menus.Button
                            icon="/icons/share-social.svg"
                            onClick={() => {
                                console.log("Button clicked!");
                                setShowSocialModal(true);
                            }}
                        >
                            Share to Social Media
                        </Menus.Button>

                        <Menus.Button
                            icon="/icons/share.svg"
                            onClick={() =>
                                window.open(
                                    `/share-new-property/${data.listingType.toLowerCase()}/${data.id}?userId=${currentUser?.id}`,
                                    "_blank",
                                    "noopener,noreferrer"
                                )
                            }
                        >
                            Share Link
                        </Menus.Button>

                        <Menus.Button
                            icon="/icons/eye.svg"
                            onClick={() =>
                                window.open(
                                    `/viewing-property/${data.listingType.toLowerCase()}/${data.id}`,
                                    "_blank",
                                    "noopener,noreferrer"
                                )
                            }
                        >
                            Viewing Link
                        </Menus.Button>

                        <Modal.Open openWindowName="changeRefIdModal">
                            <Menus.Button icon="/icons/edit.svg">
                                Change Ref ID
                            </Menus.Button>
                        </Modal.Open>
                    </Menus.List>
                </Menus>

                <Modal.Window name="ownerInfo">
                    <div className={styles.ownerInfo}>
                        <h3>Owner Info</h3>
                        <ul>
                            <li>
                                <span>Name:</span>
                                <span>{data?.owner_info?.lessor_name}</span>
                            </li>
                            <li>
                                <span>Phone:</span>
                                <span>{data?.owner_info?.lessor_phone}</span>
                            </li>
                            <li>
                                <span>Secondary Phone:</span>
                                <span>{data?.owner_info?.secondryPhone}</span>
                            </li>
                            <li>
                                <span>Email:</span>
                                <span>{data?.owner_info?.lessor_email}</span>
                            </li>
                            <li>
                                <span>Unit Number: </span>
                                <span>{data?.houseNo}</span>
                            </li>
                            <li>
                                <span>Nationality:</span>
                                <span>
                                    {typeof data?.ownerParam?.nationality ===
                                        "string" &&
                                    data?.ownerParam?.nationality !== "null"
                                        ? data?.ownerParam?.nationality
                                        : ""}
                                </span>
                            </li>
                        </ul>
                    </div>
                </Modal.Window>

                <Modal.Window name="deleteProperty">
                    <ConfirmDelete
                        resourceName="property"
                        onConfirm={() =>
                            removeProperty(data.id, {
                                onSettled: () => navigate(-1),
                            })
                        }
                        isDeleting={isDeletingProperty}
                    />
                </Modal.Window>

                <Modal.Window name="RefreshListing">
                    <ConfirmApiCall
                        resourceName="Refresh Listing"
                        onConfirm={() =>
                            mutate({
                                portal,
                            })
                        }
                    >
                        <form style={{ padding: "0rem" }}>
                            <div
                                style={{
                                    display: "flex",
                                    gap: "2rem",
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "flex-start",
                                }}
                            >
                                <label
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "0.5rem",
                                        cursor: "pointer",
                                    }}
                                >
                                    <input
                                        type="radio"
                                        {...register("portal")}
                                        value="bayut"
                                        style={{ cursor: "pointer" }}
                                    />
                                    Bayut
                                </label>
                                <label
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "0.5rem",
                                        cursor: "pointer",
                                    }}
                                >
                                    <input
                                        type="radio"
                                        {...register("portal")}
                                        value="propertyfinder"
                                        style={{ cursor: "pointer" }}
                                    />
                                    Property Finder
                                </label>
                                <label
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "0.5rem",
                                        cursor: "pointer",
                                    }}
                                >
                                    <input
                                        type="radio"
                                        {...register("portal")}
                                        value="both"
                                        defaultChecked={true}
                                        style={{ cursor: "pointer" }}
                                    />
                                    Both
                                </label>
                            </div>
                        </form>
                    </ConfirmApiCall>
                </Modal.Window>

                <Modal.Window name="rentalAgreement" overflow={true}>
                    <div className={styles.rentalAgreementModal}>
                        <h3>Create Rental Agreement</h3>
                        <RentalAgreementForm
                            isLoading={isCreatingAgreement}
                            isShowPropertyField={false}
                            onSubmit={(formData) => {
                                createRentalAgreement(
                                    {
                                        property_id: data.id,
                                        tenant_id: formData.tenant_id.value,
                                        payment_frequency:
                                            formData.payment_frequency.value,
                                        number_of_cheques:
                                            formData.number_of_cheques,
                                        status: "ACTIVE",
                                        start_date: formData.start_date,
                                        end_date: formData.end_date,
                                        terms_and_conditions:
                                            formData.terms_and_conditions,
                                        rent_amount: formData?.rent_amount,
                                        security_deposit:
                                            formData?.security_deposit,
                                        cheque_payments:
                                            formData?.cheque_payments,
                                        ejari_fees: +formData?.ejari_fees || 0,
                                        management_fees:
                                            +formData?.management_fees || 0,
                                        broker_fees:
                                            +formData?.broker_fees || 0,
                                        deposit: +formData?.deposit || 0,
                                        extra_charges:
                                            +formData?.ejari_fees || 0,
                                    },
                                    {
                                        onSuccess: (res) => {
                                            handleChangeStatus("RENTED");
                                            navigate(
                                                `/rental-agreement/list/${res.id}`
                                            );
                                        },
                                    }
                                );
                            }}
                            onCloseModal={() => {}}
                        />
                    </div>
                </Modal.Window>
                <Modal.Window name="changeRefIdModal">
                    <ChangeRefIdForm data={data} />
                </Modal.Window>

                {/* Social Media Share Modal */}
                <Modal.Window name="socialMediaShare">
                    <SocialMediaShare property={data} />
                </Modal.Window>
            </Modal>

            {/* Currency Switcher Modal */}
            <CurrencySwitcher
                open={showCurrencyModal}
                onClose={() => setShowCurrencyModal(false)}
                onSelectCurrency={handleCurrencySelect}
                price={data?.price || 0}
            />

            {/* Social Media Share Modal */}
            {showSocialModal && (
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: "rgba(0,0,0,0.5)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 1000,
                    }}
                >
                    <div
                        style={{
                            backgroundColor: "white",
                            padding: "20px",
                            borderRadius: "8px",
                            maxWidth: "500px",
                            width: "90%",
                            maxHeight: "80vh",
                            overflow: "auto",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                marginBottom: "20px",
                            }}
                        >
                            <h3>Share to Social Media</h3>
                            <button
                                onClick={() => setShowSocialModal(false)}
                                style={{
                                    background: "none",
                                    border: "none",
                                    fontSize: "24px",
                                    cursor: "pointer",
                                }}
                            >
                                ×
                            </button>
                        </div>

                        <div style={{ marginBottom: "20px" }}>
                            <h4>{data?.title || "Property"}</h4>
                            {data?.price && (
                                <p>AED {data.price.toLocaleString()}</p>
                            )}
                        </div>

                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns:
                                    "repeat(auto-fit, minmax(120px, 1fr))",
                                gap: "12px",
                                marginBottom: "20px",
                            }}
                        >
                            {Object.entries({
                                facebook: {
                                    icon: (
                                        <svg
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                        >
                                            <path
                                                d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                                                fill="#1877F2"
                                            />
                                        </svg>
                                    ),
                                    color: "#1877F2",
                                },
                                linkedin: {
                                    icon: (
                                        <svg
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                        >
                                            <path
                                                d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
                                                fill="#0A66C2"
                                            />
                                        </svg>
                                    ),
                                    color: "#0A66C2",
                                },
                                twitter: {
                                    icon: (
                                        <svg
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                        >
                                            <path
                                                d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"
                                                fill="#1DA1F2"
                                            />
                                        </svg>
                                    ),
                                    color: "#1DA1F2",
                                },
                                whatsapp: {
                                    icon: (
                                        <svg
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                        >
                                            <path
                                                d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"
                                                fill="#25D366"
                                            />
                                        </svg>
                                    ),
                                    color: "#25D366",
                                },
                                telegram: {
                                    icon: (
                                        <svg
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                        >
                                            <path
                                                d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z"
                                                fill="#0088CC"
                                            />
                                        </svg>
                                    ),
                                    color: "#0088CC",
                                },
                                instagram: {
                                    icon: (
                                        <svg
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                        >
                                            <path
                                                d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.2-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
                                                fill="#E4405F"
                                            />
                                        </svg>
                                    ),
                                    color: "#E4405F",
                                },
                                email: {
                                    icon: (
                                        <svg
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                        >
                                            <path
                                                d="M0 3v18h24V3H0zm21.518 2L12 12.713 2.482 5h19.036zM2 19V7.183l10 8.104 10-8.104V19H2z"
                                                fill="#EA4335"
                                            />
                                        </svg>
                                    ),
                                    color: "#EA4335",
                                },
                            }).map(([key, platform]) => (
                                <button
                                    key={key}
                                    onClick={() => {
                                        const shareUrl = `${window.location.origin}/share-new-property/${data.listingType.toLowerCase()}/${data.id}`;
                                        const shareText = `🏠 ${data.title} | AED ${data.price?.toLocaleString() || ""}`;

                                        const shareUrls = {
                                            facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`,
                                            linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(shareText)}`,
                                            twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`,
                                            whatsapp: `https://wa.me/?text=${encodeURIComponent(shareText + " " + shareUrl)}`,
                                            telegram: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`,
                                            instagram: `https://www.instagram.com/?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`,
                                            email: `mailto:?subject=${encodeURIComponent(shareText)}&body=${encodeURIComponent("Check out this property: " + shareUrl)}`,
                                        };

                                        window.open(
                                            shareUrls[key],
                                            "_blank",
                                            "width=600,height=400"
                                        );
                                        setShowSocialModal(false);
                                    }}
                                    style={{
                                        padding: "16px 12px",
                                        border: "2px solid #e5e7eb",
                                        borderRadius: "8px",
                                        background: "white",
                                        cursor: "pointer",
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        gap: "8px",
                                        transition: "all 0.2s",
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.borderColor =
                                            platform.color;
                                        e.target.style.transform =
                                            "translateY(-2px)";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.borderColor = "#e5e7eb";
                                        e.target.style.transform =
                                            "translateY(0)";
                                    }}
                                >
                                    {platform.icon}
                                </button>
                            ))}
                        </div>

                        <div
                            style={{
                                display: "flex",
                                gap: "12px",
                            }}
                        >
                            <button
                                onClick={async () => {
                                    const shareUrl = `${window.location.origin}/share-new-property/${data.listingType.toLowerCase()}/${data.id}`;
                                    await navigator.clipboard.writeText(
                                        shareUrl
                                    );
                                    alert("Link copied to clipboard!");
                                }}
                                style={{
                                    flex: 1,
                                    padding: "12px 16px",
                                    border: "2px solid #3b82f6",
                                    borderRadius: "8px",
                                    background: "white",
                                    color: "#3b82f6",
                                    fontWeight: "500",
                                    cursor: "pointer",
                                }}
                            >
                                Copy Link
                            </button>
                            <button
                                onClick={async () => {
                                    const shareUrl = `${window.location.origin}/share-new-property/${data.listingType.toLowerCase()}/${data.id}`;
                                    const shareText = `🏠 ${data.title} | AED ${data.price?.toLocaleString() || ""}`;
                                    await navigator.clipboard.writeText(
                                        shareText + " " + shareUrl
                                    );
                                    alert("Text copied to clipboard!");
                                }}
                                style={{
                                    flex: 1,
                                    padding: "12px 16px",
                                    border: "2px solid #3b82f6",
                                    borderRadius: "8px",
                                    background: "white",
                                    color: "#3b82f6",
                                    fontWeight: "500",
                                    cursor: "pointer",
                                }}
                            >
                                Copy Text
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default NewPropertyMenus;
