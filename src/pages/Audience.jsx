import  { useEffect, useState } from "react";
import styles from "./../styles/Audience.module.css";
import SectionTop from "../ui/SectionTop";
import Modal from "../features/Audience/Modal";
import Header from "../features/Audience/Header";
import ListData from "../features/Audience/ListData";
import DeleteModal from "../features/Audience/DeleteModal";
import useDeleteAudience from "../features/Audience/useDeleteAudience";

function Audience() {
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [audienceToDelete, setAudienceToDelete] = useState(null);
    const [isSimpleForm, setIsSimpleForm] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const {deleteing,isPending}=useDeleteAudience()
    const [audienceType, setAudienceType] = useState("");
  
    useEffect(() => {
        setTimeout(() => {
            setInitialLoading(false);
        }, 1500);
    }, []);
  

    const handleEdit = (audience) => {
       setAudienceToDelete(audience.id)
       setShowModal(true);
       setIsSimpleForm(true)
    };

    const handleDeleteClick = (audience) => {
        setAudienceToDelete(audience);  
        setShowDeleteModal(true);
    };


    const handleConfirmDelete = async () => {
        try {
             deleteing(audienceToDelete.id)
             setShowDeleteModal(false)
            setAudienceToDelete(null);
        }catch{
            console.log("Error deleting audience")
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
         setAudienceToDelete(null)
        setIsSimpleForm(false);
       
    };
    const handleCreateClick = (simple = false) => {
        setIsSimpleForm(simple);
        setShowModal(true);
    };


  
    if (initialLoading) {
        return (
            <div className="sectionContainer">
                <SectionTop heading="Audience Management" />
                <section className="sectionStyles">
                    <div className={styles.container}>
                        <div className={styles.header}>
                            <div
                                className={`${styles.skeletonLoader} w-48 h-8`}
                            ></div>
                            <div
                                className={`${styles.skeletonLoader} w-64 h-10`}
                            ></div>
                        </div>
                        <div className={styles.tableContainer}>
                            {[1, 2, 3].map((index) => (
                                <div
                                    key={index}
                                    className={`${styles.skeletonLoader} ${styles.rowSkeleton}`}
                                />
                            ))}
                        </div>
                    </div>
                </section>
            </div>
        );
    }

    return (
        <div className="sectionContainer">
            <SectionTop heading="Audience Management" />

            <section className="sectionStyles">
                <div className={styles.container}>
                <Header 
                handleCreateClick={handleCreateClick} 
                setAudienceType={setAudienceType}
                audienceType={audienceType}
            />
                   <ListData
                    handleDeleteClick={handleDeleteClick}
                    handleEdit={handleEdit}
                    audienceType={audienceType}
                   />
                    {/* Create/Edit Modal */}
                    {showModal && (
                       <Modal
                       isSimpleForm={isSimpleForm}
                       handleCloseModal={handleCloseModal}  
                       id={audienceToDelete}    
                       setId={setAudienceToDelete}       
                       />
                    )}

                    {/* Delete Confirmation Modal */}
                    {showDeleteModal && (
                       <DeleteModal
                        audienceToDelete={audienceToDelete}
                        handleConfirmDelete={handleConfirmDelete}
                        deleteLoading={isPending}
                        setShowDeleteModal={setShowDeleteModal}
                        setAudienceToDelete={setAudienceToDelete}
                       />
                    )}
                </div>
            </section>
        </div>
    );
}

export default Audience;
