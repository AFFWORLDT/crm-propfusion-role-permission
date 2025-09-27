import { useState, useRef, useCallback, useEffect } from "react";
import SectionTop from "../../ui/SectionTop";
import NewOwner from "../../features/Owner/NewOwner";
import useInfiniteOwners from "../../features/Owner/useInfiniteOwners";
import { DeleteModal } from "../../features/SmtpSetting/DeleteModal";
import useDeleteOwner from "../../features/Owner/useDelete";
import AddOwner from "./AddOwner";
import styles from "./ListOwner.module.css";
import { TENANT_OWNER_CONTRACT_TABS } from "../../utils/constants";
import TabBar from "../../ui/TabBar";
import Spinner from "../../ui/Spinner";
import ScrollToTop from "../../ui/ScrollToTop";
import OwnerActions from "../../features/Owner/OwnerActions";

function ListOwner({ listingType }) {
    const [id, setId] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editOwnerId, setEditOwnerId] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const containerRef = useRef(null);

    const {
        owners,
        isLoading,
        error,
        totalSize,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteOwners(searchQuery);

    const handleScroll = useCallback(() => {
        if (!containerRef.current) return;

        const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
        const scrollPercentage = (scrollTop / (scrollHeight - clientHeight)) * 100;

        if (scrollPercentage > 80 && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [hasNextPage, fetchNextPage, isFetchingNextPage]);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        container.addEventListener("scroll", handleScroll);

        return () => {
            if (container) {
                container.removeEventListener("scroll", handleScroll);
            }
        };
    }, [handleScroll]);

    const currentTab = TENANT_OWNER_CONTRACT_TABS.find(
        (tab) => tab.id === "OWNERS"
    );

    const { deleting } = useDeleteOwner();

    const handleConfirmDelete = () => {
        deleting(id);
        setShowDeleteModal(false);
        setId(null);
    };

    const handleEdit = (owner) => {
        setEditOwnerId(owner.id);
        setShowAddModal(true);
    };

    const handleAddOwner = () => {
        setEditOwnerId(null);
        setShowAddModal(true);
    };

    const handleCloseModal = () => {
        setShowAddModal(false);
        setEditOwnerId(null);
    };

    const handelDelete = async (data) => {
        setShowDeleteModal(true);
        setId(data?.id);
    };

    return (
        <div className="sectionContainer">
            <SectionTop
                heading={`${listingType[0] + listingType.toLowerCase().slice(1)} List`}
            >
                <TabBar
                    tabs={TENANT_OWNER_CONTRACT_TABS}
                    activeTab={"OWNERS"}
                    navigateTo={(tabId) => {
                        const tab = TENANT_OWNER_CONTRACT_TABS.find(
                            (t) => t.id === tabId
                        );
                        return tab?.path || "/";
                    }}
                />
            </SectionTop>
            <section
                ref={containerRef}
                className="sectionStyles"
                style={{
                    backgroundColor: currentTab?.bgColor || "#ffffff",
                    height: "calc(100vh)",
                    overflowY: "auto",
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                    position: "relative",
                    paddingTop: "4rem",
                    paddingLeft: "3rem"
                }}
            >
                <style>
                    {`
                        .sectionStyles::-webkit-scrollbar {
                            display: none;
                        }
                    `}
                </style>
                <div
                    className="sectionDiv"
                    style={{
                        backgroundColor: currentTab?.bgColor || "#ffffff",
                        boxShadow: "none",
                        position: "relative"
                    }}


                >
                    <OwnerActions
                        onAddOwner={handleAddOwner}
                    />
                    <div className={styles.searchContainer} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
                        <input
                            type="text"
                            placeholder="Search owner by name..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={styles.searchInput}
                        />

                    </div>

                    <DeleteModal
                        onConfirm={handleConfirmDelete}
                        isOpen={showDeleteModal}
                        onClose={() => setShowDeleteModal(false)}
                        title={"Owner"}
                    />


                    {isLoading ? (
                        <div className={styles.loaderContainer}>
                            <Spinner />
                        </div>
                    ) : owners?.length === 0 ? (
                        <div className={styles.noData}>
                            <p>No owners found</p>
                        </div>
                    ) : (
                        <NewOwner
                            isLoading={isLoading}
                            error={error}
                            data={owners}
                            totalSize={totalSize}
                            handelDelete={handelDelete}
                            handleEdit={handleEdit}
                            onAddOwner={handleAddOwner}
                            isFetchingNextPage={isFetchingNextPage}
                        />
                    )}

                    {isFetchingNextPage && (
                        <div className={styles.loadingMore}>
                            <Spinner />
                        </div>
                    )}
                </div>
                <ScrollToTop containerRef={containerRef} />
            </section>

            {showAddModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <button
                            onClick={handleCloseModal}
                            className={styles.closeButton}
                        >
                            &times;
                        </button>
                        <AddOwner
                            ownerId={editOwnerId}
                            onClose={handleCloseModal}
                            heading={editOwnerId ? "Edit Owner" : "Add Owner"}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

export default ListOwner;
