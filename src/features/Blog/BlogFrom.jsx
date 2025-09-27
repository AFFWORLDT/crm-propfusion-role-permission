import { useEffect, useState } from "react";
import styles from "./../../pages/Blog.module.css";
import { Upload } from "lucide-react";
import toast from "react-hot-toast";
import {SmtpConfigSelector} from "./../../ui/SelectOptionSmtp"
import useAreasWithoutCount from "../areas/useAreasWithoutCount";
import useDevelopersWithoutCount from "../developers/useDevelopersWithoutCount";
import Cookies from "universal-cookie";
import useCompanySettings from "../admin/general/useCompanySettings";
import { useGetBlogById } from "./useBlog";

const cookies = new Cookies();
const user=cookies.get("USER")
const BlogForm = ({ id, setShowAddModal, onSubmit: handleFormSubmit ,setShowEditModal,setId}) => {
    const isEdit = id ? true:false
    
    const { data:CompanyData } =
    useCompanySettings();
    const [formData, setFormData] = useState({
        name: "",
        content: "",
        category: "",
        sources: "", // Changed from sources array to a single string
        area: "",
        developer: "",
        agency_name: CompanyData.company_name,
        created_by: "",
        photos: [],
        ownPortal: false,
        propfusionPortal: false,
    });
    const [selectedAraea, setSelectedArea] = useState("");
    const [selectedDeveloper, setSelectedDeveloper] = useState("");
    const [errors, setErrors] = useState({});
    const [previewImages, setPreviewImages] = useState([]);
    const [isUploading, setIsUploading] = useState(false);
    const { data: areaData, isLoading: isAreaLoading } =
        useAreasWithoutCount(true);
    const { isLoading: isDeveloperLoading, data: developerData } =
        useDevelopersWithoutCount(true);

        const {data:BlogData}=useGetBlogById(id)
        useEffect(() => {
            if (BlogData?.blogs?.length > 0) {
                const blog = BlogData.blogs[0]; // Assuming you only need the first blog
                setFormData((prev) => ({
                    ...prev,
                    name: blog?.name || "",
                    content: blog?.content || "",
                    category: blog?.category || "",
                    sources: blog?.sources || "", // Handle source as a string
                    photos: blog?.photos || [],
                    ownPortal: blog?.ownPortal || false,
                    propfusionPortal: blog?.propfusionPortal || false,
                }));
                setSelectedArea(blog?.area || "");
                setSelectedDeveloper(blog?.developer || "");
            }
        }, [BlogData,id,isEdit]);
        

      
    const validateForm = () => {
        const newErrors = {};
        if (!formData.name.trim()) {
            newErrors.name = "Name is required";
        }
        if (!formData.content.trim()) {
            newErrors.content = "content is required";
        }
        if (!formData.category.trim()) {
            newErrors.category = "Category is required";
        }
       
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

   
    const handleSourceChange = (e) => {
        const { value } = e.target;
        setFormData((prev) => ({
            ...prev,
            sources: value,
        }));
    };

    const handlePhotoChange = async (e) => {
        const files = Array.from(e.target.files || []);
        setIsUploading(true);

        try {
            const photoUrls = await Promise.all(
                files.map(async (file) => {
                    const formData = new FormData();
                    formData.append("file", file);
                    formData.append("upload_preset", "chat-app");

                    const response = await fetch(
                        "https://api.cloudinary.com/v1_1/dbqdqof8u/image/upload",
                        {
                            method: "POST",
                            body: formData,
                        }
                    );
                    const data = await response.json();
                    return data.secure_url;
                })
            );
            setPreviewImages((prev) => [...prev, ...photoUrls]);
        } catch (error) {
            toast.error("Error uploading photos");
        } finally {
            setIsUploading(false);
        }
    };

    const removeImage = (index) => {
        setPreviewImages((prev) => prev.filter((_, i) => i !== index));
    };
    

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            const submissionData = {
                ...formData,
                photos: previewImages,
                area: selectedAraea,
                developer: selectedDeveloper,
                created_by: user.id,
            };
            handleFormSubmit(submissionData);
        }
    };

    const handleCancel = () => {
        if(isEdit){
            setShowEditModal(false)
            setId(null)
            return
        }
        setFormData({
            name: "",
            content: "",
            category: "",
            sources: [""],
            area: "",
            developer: "",
            posted_by: "",
            agency_name: "",
            created_by: "",
            photos: [],
            ownPortal: false,
            propfusionPortal: false,
           
        });
        setPreviewImages([]);
        setShowAddModal(false);
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
                <h3 className={styles.sectionTitle}>Required Information</h3>

                <div className={styles.formField}>
                    <label htmlFor="name" className={styles.label}>
                        Title *
                    </label>
                    <input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`${styles.input} ${errors.name ? styles.error : ""}`}
                    />
                    {errors.name && (
                        <span className={styles.errorText}>{errors.name}</span>
                    )}
                </div>

                <div className={styles.formField}>
                    <label htmlFor="content" className={styles.label}>
                      content *
                    </label>
                    <textarea
                        id="content"
                        name="content"
                        value={formData.content}
                        onChange={handleChange}
                        className={`${styles.textarea} ${errors.description ? styles.error : ""}`}
                    />
                    {errors.description && (
                        <span className={styles.errorText}>
                            {errors.content}
                        </span>
                    )}
                </div>

                <div className={styles.formField}>
                    <label htmlFor="category" className={styles.label}>
                        Category *
                    </label>
                    <input
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className={`${styles.input} ${errors.category ? styles.error : ""}`}
                    />
                    {errors.category && (
                        <span className={styles.errorText}>
                            {errors.category}
                        </span>
                    )}
                </div>

                {/* <div className={styles.formField}>
                    <label htmlFor="created_by" className={styles.label}>
                        Created By *
                    </label>
                    <input
                        id="created_by"
                        name="created_by"
                        value={formData.created_by}
                        onChange={handleChange}
                        className={`${styles.input} ${errors.created_by ? styles.error : ""}`}
                    />
                    {errors.created_by && (
                        <span className={styles.errorText}>
                            {errors.created_by}
                        </span>
                    )}
                </div> */}
            </div>

            <div className={styles.fieldGroup}>
                <h3 className={styles.sectionTitle}>Additional Information</h3>

                {/* <div className={styles.formField}>
                    <label htmlFor="content" className={styles.label}>
                        Content
                    </label>
                    <textarea
                        id="content"
                        name="content"
                        value={formData.content}
                        onChange={handleChange}
                        className={styles.textarea}
                    />
                </div> */}

                <div className={styles.formField}>
                    <label htmlFor="area" className={styles.label}>
                        Area
                    </label>
                    <SmtpConfigSelector
                        value={selectedAraea}
                        onChange={setSelectedArea}
                        options={areaData}
                        placeholder="Choose Area"
                        isLoading={isAreaLoading}
                        displayField={"name"}
                        returnField={"name"}
                    />
                </div>

                <div className={styles.formField}>
                    <label htmlFor="developer" className={styles.label}>
                        Developer
                    </label>
                    <SmtpConfigSelector
                        value={selectedDeveloper}
                        onChange={setSelectedDeveloper}
                        options={developerData}
                        placeholder="Choose Area"
                        isLoading={isDeveloperLoading}
                        displayField={"name"}
                        returnField={"name"}
                    />
                </div>

                {/* <div className={styles.formField}>
                    <label htmlFor="posted_by" className={styles.label}>
                        Posted By
                    </label>
                    <input
                        id="posted_by"
                        name="posted_by"
                        value={formData.posted_by}
                        onChange={handleChange}
                        className={styles.input}
                    />
                </div> */}

                <div className={styles.formField}>
                    <label htmlFor="agency_name" className={styles.label}>
                        Company Name
                    </label>
                    <input
                        id="agency_name"
                        name="agency_name"
                        value={formData.agency_name}
                        onChange={handleChange}
                        className={styles.input}
                    />
                </div>
            </div>

            <div className={styles.fieldGroup}>
    <h3 className={styles.sectionTitle}>Source</h3>
    <div className={styles.formField}>
        <label htmlFor="sources" className={styles.label}>
            Source
        </label>
        <input
            type="text"
            id="sources"
            name="sources"
            value={formData.sources}
            onChange={handleSourceChange}
            placeholder="Enter source URL"
            className={styles.input}
        />
    </div>
</div>

            <div className={styles.fieldGroup}>
                <h3 className={styles.sectionTitle}>Photos</h3>
                <div className={styles.photoUpload}>
                    <input
                        type="file"
                        id="photos"
                        multiple
                        accept="image/*"
                        onChange={handlePhotoChange}
                        className={styles.fileInput}
                    />
                    <label htmlFor="photos" className={styles.uploadLabel}>
                        <span className={styles.uploadIcon}>
                            <Upload />
                        </span>
                        <span>Select Images</span>
                    </label>
                </div>

                {isUploading && (
                    <div className={styles.uploading}>Uploading photos...</div>
                )}

                {previewImages.length > 0 && (
                    <div className={styles.previewGrid}>
                        {previewImages.map((image, index) => (
                            <div key={index} className={styles.previewItem}>
                                <div className={styles.imageWrapper}>
                                    <img
                                        src={image}
                                        alt={`Preview ${index + 1}`}
                                        className={styles.previewImage}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(index)}
                                        className={styles.removeImageButton}
                                        aria-label="Remove image"
                                    >
                                        ×
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className={styles.fieldGroup}>
                <h3 className={styles.sectionTitle}>Portal Options</h3>
                <div className={styles.checkboxGroup}>
                    <div className={styles.checkbox}>
                        <input
                            type="checkbox"
                            id="ownPortal"
                            name="ownPortal"
                            checked={formData.ownPortal}
                            onChange={handleChange}
                        />
                        <label htmlFor="ownPortal" className={styles.label}>
                            Own Portal
                        </label>
                    </div>
                    <div className={styles.checkbox}>
                        <input
                            type="checkbox"
                            id="propfusionPortal"
                            name="propfusionPortal"
                            checked={formData.propfusionPortal}
                            onChange={handleChange}
                        />
                        <label
                            htmlFor="propfusionPortal"
                            className={styles.label}
                        >
                            Propfusion Portal
                        </label>
                    </div>
                </div>
            </div>

            <div className={styles.buttonGroup}>
                <button type="submit" className={styles.submitButton} disabled={isUploading}>
                    {isEdit ? "Update" : "Save"}
                </button>
                <button
                    type="button"
                    onClick={handleCancel}
                    className={styles.cancelButton}
                >
                    Cancel
                </button>
            </div>
        </form>
    );
};

export default BlogForm;
