import { useState } from "react";
import { PlusCircleIcon } from "lucide-react";
import styles from "./Blog.module.css";
import BlogList from "../features/Blog/BlogList";
import { DeleteModal } from "../features/SmtpSetting/DeleteModal";
import SectionTop from "../ui/SectionTop";
import useDeleteBlog from "../features/Blog/useDelete";
import TabBar from "../ui/TabBar";
import { useNavigate } from "react-router-dom";

const Blog = () => {
    const navigate = useNavigate();
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedBlog, setSelectedBlog] = useState(null);
    const { deleteing } = useDeleteBlog();

    const handleAddBlog = () => {
        navigate("/admin/blog/add");
    };

    const handleEditBlog = (blogId) => {
        navigate(`/admin/blog/${blogId}/edit`);
    };

    const handleDeleteBlog = (blogId) => {
        setSelectedBlog(blogId);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = () => {
        deleteing(selectedBlog);
        setShowDeleteModal(false);
        setSelectedBlog(null);
    };

    return (
        <div className="sectionContainer">
            <SectionTop>
                <TabBar
                    activeTab="BLOG"
                    tabs={[
                        {
                            id: "BLOG",
                            label: "Blog",
                            bgColor: "#f5f4fa",
                            fontColor: "#341b80",
                            path: "/blog",
                        },
                    ]}
                />
            </SectionTop>

            <section 
                className="sectionStyles" 
                style={{
                    paddingTop: "8rem",
                    paddingLeft: "3rem",
                    backgroundColor: "#f5f4fa",
                }}
            >
                <div className={styles.container} style={{backgroundColor: "#f5f4fa", boxShadow: "none"}}>
                    <div className={styles.header} style={{marginBottom: "2rem"}}>
                        <h1 className={styles.title}>Blogs</h1>
                        <button
                            className={styles.button}
                            onClick={handleAddBlog}
                        >
                            <PlusCircleIcon className={styles.addIcon} />
                            Add Blog
                        </button>
                    </div>

                    <BlogList
                        handleEditBlog={handleEditBlog}
                        handleDeleteBlog={handleDeleteBlog}
                    />

                    {showDeleteModal && selectedBlog && (
                        <DeleteModal
                            onConfirm={handleConfirmDelete}
                            isOpen={showDeleteModal}
                            onClose={() => {
                                setShowDeleteModal(false);
                            }}
                            title={"Blog"}
                        />
                    )}
                </div>
            </section>
        </div>
    );
};

export default Blog;
