import styles from './BlogListing.module.css';
import { Eye, Edit, Trash2, Clock } from 'lucide-react';
import useBlog from "./useBlog";
import Pagination from '../Audience/Pagination';
import { useState } from "react";

const ListingField = ({ label, value, isBadge }) => {
  if (!value) return null;
  
  return (
    <div className={styles.field}>
      <div className={styles.label}>{label}</div>
      {isBadge ? (
        <span className={styles.badge}>{value}</span>
      ) : (
        <div className={styles.value}>{value}</div>
      )}
    </div>
  );
};
const SkeletonCard = () => {
  return (
    <div className={styles.skeletonCard}>
      <div className={styles.skeletonHeader}>
        <div>
          <div className={styles.skeletonTitle}></div>
          <div className={styles.skeletonTimestamp}></div>
        </div>
        <div className={styles.skeletonActions}>
          <div className={styles.skeletonButton}></div>
          <div className={styles.skeletonButton}></div>
          <div className={styles.skeletonButton}></div>
        </div>
      </div>
      
      <div className={styles.skeletonField}>
        <div className={styles.skeletonLabel}></div>
        <div className={styles.skeletonValue}></div>
      </div>
      <div className={styles.skeletonField}>
        <div className={styles.skeletonLabel}></div>
        <div className={styles.skeletonValue}></div>
      </div>
      <div className={styles.skeletonField}>
        <div className={styles.skeletonLabel}></div>
        <div className={styles.skeletonValue}></div>
      </div>
      <div className={styles.skeletonField}>
        <div className={styles.skeletonLabel}></div>
        <div className={styles.skeletonValue}></div>
      </div>
    </div>
  );
};

const ListingActions = ({ onView, onEdit, onDelete }) => (
  <div className={styles.actions}>
    <button onClick={onView} className={`${styles.button} ${styles.viewButton}`}>
      <Eye size={16} />
      View
    </button>
    <button onClick={onEdit} className={`${styles.button} ${styles.editButton}`}>
      <Edit size={16} />
      Edit
    </button>
    <button onClick={onDelete} className={`${styles.button} ${styles.deleteButton}`}>
      <Trash2 size={16} />
      Delete
    </button>
  </div>
);

const ListingCard = ({ listing, onView, onEdit, onDelete }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const showPortals = listing.ownPortal && listing.propfusionPortal;

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div>
          <h2 className={styles.cardTitle}>{listing.name || 'Untitled Listing'}</h2>
          <span className={styles.timestamp}>
            <Clock size={14} className={styles.icon} />
            Created at: {formatDate(listing.created_at)}
          </span>
        </div>
        <ListingActions
          onView={() => onView(listing.id)}
          onEdit={() => onEdit(listing.id)}
          onDelete={() => onDelete(listing.id)}
        />
      </div>

      <div className={styles.cardContent}>
        <ListingField label="Category" value={listing.category} isBadge />
        <ListingField label="Created By" value={listing.created_by} />
        <ListingField label="Company Name" value={listing.agency_name} />
        <ListingField label="Area" value={listing.area} />
        <ListingField label="Description" value={listing.description} />
        <ListingField label="Developer" value={listing.developer} />
        {showPortals && (
          <>
            <ListingField label="Own Portal" value={listing.ownPortal} />
            <ListingField label="Propfusion Portal" value={listing.propfusionPortal} />
          </>
        )}
        <ListingField label="Posted By" value={listing.posted_by} />
        <ListingField label="Sources" value={listing.sources} />
      </div>
    </div>
  );
};


const BlogList = ({ handleEditBlog, handleDeleteBlog }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const {data,isLoading}=useBlog(currentPage, pageSize)
  const totalPages = Math.ceil(data?.totalBlogs / pageSize);

  // eslint-disable-next-line no-unused-vars
  const handleView = (id) => {
    // navigate(`/admin/blog/${id}`);
    return(
      <div>
        
      </div>
    )
  };

  if (isLoading) {
    return (
      <div className={styles.blogGrid}>
        {[...Array(6)].map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    );
  }

    return (
      <div>
      <div className={styles.blogGrid}>
      {data?.blogs?.length === 0 ? (
        <div className={styles.emptyState}>
          <p>No listings found</p>
        </div>
      ) : (
        data?.blogs?.map((listing) => (
          <ListingCard
            key={listing.id}
            listing={listing}
            onView={handleView}
            onEdit={handleEditBlog}
            onDelete={handleDeleteBlog}
          />
        ))
      )}
       
      </div>
      <Pagination
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={setCurrentPage}
      pageSize={pageSize}
      onPageSizeChange={setPageSize}
      pageSizeOptions={[5, 10, 20, 50]} // Optional
  />
      </div>
    );
  };
export default BlogList  