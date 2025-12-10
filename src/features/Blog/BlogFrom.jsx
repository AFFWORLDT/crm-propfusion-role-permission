import { useEffect, useState } from "react";
import styles from "./../../pages/Blog.module.css";
import { Upload } from "lucide-react";
import toast from "react-hot-toast";
import { SmtpConfigSelector } from "./../../ui/SelectOptionSmtp";
import useAreasWithoutCount from "../areas/useAreasWithoutCount";
import useDevelopersWithoutCount from "../developers/useDevelopersWithoutCount";
import Cookies from "universal-cookie";
import useCompanySettings from "../admin/general/useCompanySettings";
import { useGetBlogById } from "./useBlog";
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";
import { useNavigate } from "react-router-dom";

const cookies = new Cookies();
const user = cookies.get("USER");
const BlogForm = ({ id, onSubmit: handleFormSubmit, onCancel, isLoading }) => {
    const navigate = useNavigate();
    const isEdit = id ? true : false;

    const { data: CompanyData } = useCompanySettings();

    // Sun Editor configuration
    const sunEditorOptions = {
        height: 500,
        buttonList: [
            ["undo", "redo"],
            ["font", "fontSize", "formatBlock"],
            ["paragraphStyle", "blockquote"],
            [
                "bold",
                "underline",
                "italic",
                "strike",
                "subscript",
                "superscript",
            ],
            ["fontColor", "hiliteColor", "textStyle"],
            ["removeFormat"],
            ["outdent", "indent"],
            ["align", "horizontalRule", "list", "lineHeight"],
            ["table", "link", "video", "audio"],
            ["fullScreen", "showBlocks", "codeView"],
            ["preview", "print"],
            ["save", "template"],
        ],
        // Disable image upload
        imageUploadUrl: "",
        imageUploadSizeLimit: 0,
        imageUploadMultiple: false,
        imageUploadBefore: function (files, info, uploadHandler) {
            // Block image uploads
            uploadHandler({
                errorMessage: "Image upload is disabled",
            });
        },
    };

    const [formData, setFormData] = useState({
        name: "",
        content: "",
        category: "",
        sources: "", // Changed from sources array to a single string
        area: "",
        developer: "",
        agency_name: CompanyData?.company_settings?.company_name,
        created_by: "",
        photos: [],
        ownPortal: false,
        propfusionPortal: false,
    });
    const [selectedAraea, setSelectedArea] = useState("");
    const [selectedDeveloper, setSelectedDeveloper] = useState("");
    const [errors, setErrors] = useState({});
    const [selectedFiles, setSelectedFiles] = useState([]); // Store File objects
    const [previewImages, setPreviewImages] = useState([]); // Store preview URLs
    const { data: areaData, isLoading: isAreaLoading } =
        useAreasWithoutCount(true);
    const { isLoading: isDeveloperLoading, data: developerData } =
        useDevelopersWithoutCount("", true);

    const { data: BlogData } = useGetBlogById(id);
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
            // Set preview images for existing photos (URLs from server)
            if (
                blog?.photos &&
                Array.isArray(blog.photos) &&
                blog.photos.length > 0
            ) {
                setPreviewImages(blog.photos);
            } else {
                setPreviewImages([]);
            }
            // Clear selected files when loading existing blog
            setSelectedFiles([]);
        }
    }, [BlogData, id, isEdit]);

    // Cleanup object URLs on unmount
    useEffect(() => {
        return () => {
            // Cleanup all blob URLs when component unmounts
            previewImages.forEach((url) => {
                if (url && typeof url === "string" && url.startsWith("blob:")) {
                    URL.revokeObjectURL(url);
                }
            });
        };
    }, [previewImages]);

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

    const handlePhotoChange = (e) => {
        const files = Array.from(e.target.files || []);

        // Create preview URLs for new files
        const newPreviewUrls = files.map((file) => URL.createObjectURL(file));

        // Store File objects
        setSelectedFiles((prev) => [...prev, ...files]);

        // Store preview URLs
        setPreviewImages((prev) => [...prev, ...newPreviewUrls]);

        // Clear the input to allow selecting the same file again
        e.target.value = "";
    };

    const removeImage = (index) => {
        // Revoke the object URL to free memory if it's a blob URL (new file)
        const previewUrl = previewImages[index];
        if (
            previewUrl &&
            typeof previewUrl === "string" &&
            previewUrl.startsWith("blob:")
        ) {
            URL.revokeObjectURL(previewUrl);

            // Find the corresponding file index in selectedFiles
            // Count how many blob URLs come before this index
            let fileIndex = 0;
            for (let i = 0; i < index; i++) {
                if (
                    previewImages[i] &&
                    typeof previewImages[i] === "string" &&
                    previewImages[i].startsWith("blob:")
                ) {
                    fileIndex++;
                }
            }

            // Remove from selectedFiles
            setSelectedFiles((prev) => prev.filter((_, i) => i !== fileIndex));
        }

        // Always remove from previewImages
        setPreviewImages((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            // Create FormData for multipart/form-data submission
            const formDataToSubmit = new FormData();

            // Append all form fields
            formDataToSubmit.append("name", formData.name);
            formDataToSubmit.append("content", formData.content);
            formDataToSubmit.append("category", formData.category);
            formDataToSubmit.append("sources", formData.sources || "");
            formDataToSubmit.append("area", selectedAraea || "");
            formDataToSubmit.append("developer", selectedDeveloper || "");
            formDataToSubmit.append("agency_name", formData.agency_name || "");
            formDataToSubmit.append("created_by", user.id);
            formDataToSubmit.append("ownPortal", formData.ownPortal);
            formDataToSubmit.append(
                "propfusionPortal",
                formData.propfusionPortal
            );

            // Append photo files
            selectedFiles.forEach((file, index) => {
                formDataToSubmit.append(`photos`, file);
            });

            handleFormSubmit(formDataToSubmit);
        }
    };

    const handleCancel = () => {
        if (onCancel) {
            onCancel();
        } else {
            navigate("/admin/blog");
        }
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
                        Content *
                    </label>
                    <SunEditor
                        setContents={formData.content}
                        height="400px"
                        onChange={(content) => {
                            setFormData((prev) => ({ ...prev, content }));
                            if (errors.content) {
                                setErrors((prev) => ({ ...prev, content: "" }));
                            }
                        }}
                        setOptions={sunEditorOptions}
                        placeholder="Write your blog content here..."
                    />
                    {errors.content && (
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
                <button
                    type="submit"
                    className={styles.submitButton}
                    disabled={isLoading}
                >
                    {isLoading ? "Saving..." : isEdit ? "Update" : "Save"}
                </button>
                <button
                    type="button"
                    onClick={handleCancel}
                    className={styles.cancelButton}
                    disabled={isLoading}
                >
                    Cancel
                </button>
            </div>
        </form>
    );
};

export default BlogForm;
