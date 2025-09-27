import React from 'react';
import { useParams } from 'react-router-dom';
import styles from '../../../features/admin/MetaAds/ListMetaAds.module.css';
import Spinner from '../../../ui/Spinner';
import { AlertCircle } from 'lucide-react';
import SectionTop from '../../../ui/SectionTop';

function EditMetaAds() {
    const { formId } = useParams();

    // TODO: Implement form editing logic
    const isLoading = false;
    const error = null;

    if (isLoading) {
        return (
            <div className={styles.loading}>
                <Spinner />
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.error}>
                <AlertCircle size={48} />
                <h2>Error Loading Meta Ad</h2>
                <p>{error.message || "An unexpected error occurred"}</p>
            </div>
        );
    }

    return (
        <div className="sectionContainer">
            <SectionTop heading="Edit Meta Ad" />
            
            <section className="sectionStyles">
                <div className={styles.container}>
                    <h2>Edit Meta Ad</h2>
                    <p>Form ID: {formId}</p>
                    {/* TODO: Add form fields */}
                </div>
            </section>
        </div>
    );
}

export default EditMetaAds; 