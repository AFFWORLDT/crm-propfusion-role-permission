import { useState } from 'react';
import styles from './AgentFeed.module.css';
import { Heart, MessageCircle, Share2, MoreHorizontal, Image, Link2, Smile } from 'lucide-react';
import Avatar from '../../ui/Avatar';
import SectionTop from '../../ui/SectionTop';

function AgentFeed() {
    const [posts, setPosts] = useState([
        // Add a default post for testing
        {
            id: 1,
            content: "Welcome to the Agent Feed! Share your thoughts and updates with the team.",
            author: {
                name: 'System',
                avatar: '/default-avatar.png'
            },
            timestamp: new Date(),
            likes: 0,
            comments: [],
            isLiked: false
        }
    ]);
    const [newPost, setNewPost] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    const handlePost = () => {
        if (!newPost.trim()) return;
        
        const post = {
            id: Date.now(),
            content: newPost,
            author: {
                name: 'Current Agent',
                avatar: '/default-avatar.png'
            },
            timestamp: new Date(),
            likes: 0,
            comments: [],
            isLiked: false
        };

        setPosts([post, ...posts]);
        setNewPost('');
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setIsUploading(true);
            // Add image upload logic here
            setSelectedImage(URL.createObjectURL(file));
            setIsUploading(false);
        }
    };

    return (
        <div className="sectionContainer">
            <SectionTop heading="Agent Feed">
                <div className={styles.feedStats}>
                    <div className={styles.stat}>
                        <span>Total Posts</span>
                        <strong>{posts.length}</strong>
                    </div>
                    <div className={styles.stat}>
                        <span>Active Agents</span>
                        <strong>24</strong>
                    </div>
                </div>
            </SectionTop>

            <section 
                className="sectionStyles"
                style={{
                    paddingTop: "4rem",
                    paddingLeft: "3rem",
                    backgroundColor: "#f5f4fa"
                }}
            >
                <div className={styles.feedContainer}>
                    {/* Create Post Section */}
                    <div className={styles.createPost}>
                        <div className={styles.postInput}>
                            <Avatar src="/default-avatar.png" alt="User" />
                            <textarea 
                                placeholder="Share your thoughts..."
                                value={newPost}
                                onChange={(e) => setNewPost(e.target.value)}
                            />
                        </div>
                        <div className={styles.postActions}>
                            <div className={styles.attachments}>
                                <input 
                                    type="file" 
                                    id="imageUpload"
                                    hidden 
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                />
                                <button onClick={() => document.getElementById('imageUpload').click()}>
                                    <Image size={20} />
                                    <span>Photo</span>
                                </button>
                                <button>
                                    <Link2 size={20} />
                                    <span>Link</span>
                                </button>
                                <button>
                                    <Smile size={20} />
                                    <span>Feeling</span>
                                </button>
                            </div>
                            <button 
                                className={styles.postButton}
                                onClick={handlePost}
                                disabled={!newPost.trim()}
                            >
                                Post
                            </button>
                        </div>
                    </div>

                    {/* Posts List */}
                    <div className={styles.posts}>
                        {posts.map(post => (
                            <PostCard key={post.id} post={post} />
                        ))}
                    </div>
                </div>
            </section>

            {selectedImage && (
                <div className={styles.imagePreview}>
                    <img src={selectedImage} alt="Preview" />
                    <button onClick={() => setSelectedImage(null)}>Remove</button>
                </div>
            )}
        </div>
    );
}

function PostCard({ post }) {
    const [isLiked, setIsLiked] = useState(post.isLiked);
    const [likes, setLikes] = useState(post.likes);
    const [showComments, setShowComments] = useState(false);
    const [newComment, setNewComment] = useState('');

    const handleLike = () => {
        setIsLiked(!isLiked);
        setLikes(prev => isLiked ? prev - 1 : prev + 1);
    };

    const handleComment = () => {
        if (!newComment.trim()) return;
        
        const comment = {
            id: Date.now(),
            content: newComment,
            author: {
                name: 'Current Agent',
                avatar: '/default-avatar.png'
            },
            timestamp: new Date()
        };

        post.comments.push(comment);
        setNewComment('');
    };

    return (
        <div className={styles.postCard}>
            <div className={styles.postHeader}>
                <div className={styles.authorInfo}>
                    <Avatar src={post.author.avatar} alt={post.author.name} />
                    <div>
                        <h4>{post.author.name}</h4>
                        <span>{new Date(post.timestamp).toLocaleString()}</span>
                    </div>
                </div>
                <button className={styles.moreButton}>
                    <MoreHorizontal size={20} />
                </button>
            </div>

            <div className={styles.postContent}>
                {post.content}
            </div>

            <div className={styles.postStats}>
                <span>{likes} likes</span>
                <span>{post.comments.length} comments</span>
            </div>

            <div className={styles.postActions}>
                <button 
                    className={`${styles.actionButton} ${isLiked ? styles.liked : ''}`}
                    onClick={handleLike}
                >
                    <Heart size={20} />
                    <span>Like</span>
                </button>
                <button 
                    className={styles.actionButton}
                    onClick={() => setShowComments(!showComments)}
                >
                    <MessageCircle size={20} />
                    <span>Comment</span>
                </button>
                <button className={styles.actionButton}>
                    <Share2 size={20} />
                    <span>Share</span>
                </button>
            </div>

            {showComments && (
                <div className={styles.comments}>
                    <div className={styles.commentInput}>
                        <Avatar src="/default-avatar.png" alt="User" size="small" />
                        <input 
                            type="text"
                            placeholder="Write a comment..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleComment()}
                        />
                    </div>
                    {post.comments.map(comment => (
                        <div key={comment.id} className={styles.comment}>
                            <Avatar src={comment.author.avatar} alt={comment.author.name} size="small" />
                            <div className={styles.commentContent}>
                                <h5>{comment.author.name}</h5>
                                <p>{comment.content}</p>
                                <span>{new Date(comment.timestamp).toLocaleString()}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default AgentFeed; 