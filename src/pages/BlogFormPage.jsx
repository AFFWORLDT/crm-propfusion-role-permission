import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import BlogForm from "../features/Blog/BlogFrom";
import useCreateBlog from "../features/Blog/useCreate";
import useUpdateBlog from "../features/Blog/useUpdate";
import toast from "react-hot-toast";
import styles from "./Blog.module.css";
import SectionTop from "../ui/SectionTop";

const BlogFormPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = Boolean(id);
    const { addBlog, isLoading: isCreating } = useCreateBlog();
    const { updateBlog, isLoading: isUpdating } = useUpdateBlog();

    const handleFormSubmit = async (data) => {
        try {
            if (isEdit) {
                await updateBlog({
                    blogId: id,
                    payload: data,
                });
                toast.success("Blog updated successfully!");
            } else {
                await addBlog(data);
                toast.success("Blog created successfully!");
            }
            navigate("/admin/blog");
        } catch (error) {
            toast.error(
                isEdit ? "Failed to update blog" : "Failed to create blog"
            );
        }
    };

    const handleCancel = () => {
        navigate("blog");
    };

    return (
        <div className="sectionContainer">
            <SectionTop heading={isEdit ? "Edit Blog" : "Add New Blog"} />

            <section className="sectionStyles">
                <BlogForm
                    id={id}
                    onSubmit={handleFormSubmit}
                    onCancel={handleCancel}
                    isLoading={isCreating || isUpdating}
                />
            </section>
        </div>
    );
};

export default BlogFormPage;
