import { useState } from "react";
import { PlusCircleIcon } from "lucide-react";
import styles from "./Blog.module.css";
import BlogForm from "../features/Blog/BlogFrom";
import BlogList from "../features/Blog/BlogList";
import { DeleteModal } from "../features/SmtpSetting/DeleteModal";
import SectionTop from "../ui/SectionTop";
import useCreateBlog from "../features/Blog/useCreate";
import useUpdateBlog from "../features/Blog/useUpdate";
import useDeleteBlog from "../features/Blog/useDelete";
import TabBar from "../ui/TabBar";

const Blog = () => {
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedBlog, setSelectedBlog] = useState(null);
    const {addBlog}=useCreateBlog()
    const { updateBlog } = useUpdateBlog()
    const { deleteing } =useDeleteBlog()

    const handleAddBlog = () => {
        setShowAddModal(true);
    };

    const handleEditBlog = (blog) => {
        setSelectedBlog(blog);
        setShowEditModal(true);
    };

    const handleDeleteBlog = (blog) => {
        setSelectedBlog(blog);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = () => {
        deleteing(selectedBlog)
        setShowDeleteModal(false);
        setSelectedBlog(null);
    };

    const onAddBlogSubmit = (data) => {
      addBlog(data)
       setShowAddModal(false)
    };

    const onEditBlogSubmit = (data) => {
        updateBlog({
            blogId:selectedBlog,
            queryParams: data,
        })
        setShowEditModal(false);
        setSelectedBlog(null)
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

                    {showAddModal && (
                        <div className={styles.modal}>
                            <div className={styles.modalContent}>
                                <h2 className={styles.modalTitle}>Add Blog</h2>
                                <BlogForm
                                    setShowAddModal={setShowAddModal}
                                    onSubmit={(data) => {
                                      onAddBlogSubmit(data)
                                    }}
                                />
                            </div>
                        </div>
                    )}

                    {showEditModal && selectedBlog && (
                        <div className={styles.modal}>
                            <div className={styles.modalContent}>
                                <h2 className={styles.modalTitle}>Edit Blog</h2>
                                <BlogForm
                                    onSubmit={(data)=>{
                                        onEditBlogSubmit(data)
                                    }}
                                    setShowEditModal={setShowEditModal}
                                    id={selectedBlog}
                                    setId={setSelectedBlog}
                                />
                            </div>
                        </div>
                    )}

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
