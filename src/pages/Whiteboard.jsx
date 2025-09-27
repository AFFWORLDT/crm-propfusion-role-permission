import { useState, useMemo, useCallback } from 'react';
import { 
    Calendar, 
    Users, 
    MessageSquare, 
    Heart, 
    Star, 
    TrendingUp, 
    Gift, 
    Filter,
    Search,
    Plus,
    MoreHorizontal,
    Eye,
    ThumbsUp,
    Share2,
    Settings,
    RefreshCw,
    Sparkles,
    Zap,
    Crown,
    Target,
    Award,
    Globe,
    Shield
} from 'lucide-react';
import styles from './Whiteboard.module.css';

const Whiteboard = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // Optimized mock data with more realistic content
    const whiteboardData = useMemo(() => ({
        posts: [
            {
                id: 1,
                title: "🏆 Exclusive Launch: Downtown Dubai Luxury Residences",
                content: "We're thrilled to announce the exclusive launch of 50 ultra-luxury apartments in the heart of Downtown Dubai. These premium residences feature panoramic city views, world-class amenities, and direct access to the Dubai Mall. Pre-booking starts next week with VIP access for our premium clients!",
                author: "Sarah Johnson",
                avatar: "/images/user-profile.png",
                timestamp: "2 hours ago",
                likes: 24,
                comments: 8,
                shares: 12,
                type: "announcement",
                priority: "high",
                category: "luxury",
                readTime: "3 min read",
                image: "/images/luxury-property.jpg",
                tags: ["Luxury", "Downtown Dubai", "Premium", "Launch"],
                engagement: 85
            },
            {
                id: 2,
                title: "📈 Market Intelligence Report - Q4 2024 Analysis",
                content: "Property prices in Dubai have increased by 15% this quarter, driven by strong demand from international investors and the city's growing reputation as a global business hub. Here's what this means for our premium client portfolio and investment strategies...",
                author: "Ahmed Al-Rashid",
                avatar: "/images/user-profile.png",
                timestamp: "4 hours ago",
                likes: 18,
                comments: 5,
                shares: 7,
                type: "market-update",
                priority: "medium",
                category: "analytics",
                readTime: "5 min read",
                image: "/images/market-chart.jpg",
                tags: ["Market Analysis", "Q4 2024", "Investment", "Dubai"],
                engagement: 72
            },
            {
                id: 3,
                title: "🎯 Team Excellence Meeting - Weekly Strategic Standup",
                content: "Key highlights from today's strategic meeting: New lead generation strategies implemented, upcoming luxury property viewings scheduled, and premium client follow-ups prioritized. Team performance metrics show 15% improvement in conversion rates.",
                author: "Maria Garcia",
                avatar: "/images/user-profile.png",
                timestamp: "6 hours ago",
                likes: 12,
                comments: 3,
                shares: 2,
                type: "meeting-notes",
                priority: "low",
                category: "team",
                readTime: "2 min read",
                image: "/images/team-meeting.jpg",
                tags: ["Team Meeting", "Strategy", "Performance", "Goals"],
                engagement: 58
            },
            {
                id: 4,
                title: "🌟 Client Success Story: AED 25M Villa Sale",
                content: "Congratulations to our team for closing a record-breaking AED 25M villa sale in Palm Jumeirah! This achievement demonstrates our commitment to excellence and our ability to deliver exceptional results for our premium clients.",
                author: "David Wilson",
                avatar: "/images/user-profile.png",
                timestamp: "1 day ago",
                likes: 32,
                comments: 12,
                shares: 18,
                type: "success-story",
                priority: "high",
                category: "achievement",
                readTime: "2 min read",
                image: "/images/villa-sale.jpg",
                tags: ["Success Story", "Palm Jumeirah", "Record Sale", "Achievement"],
                engagement: 92
            }
        ],
        comments: [
            {
                id: 1,
                postId: 1,
                author: "John Smith",
                avatar: "/images/user-profile.png",
                content: "This is absolutely fantastic! When can we start showing these luxury properties to our VIP clients? The location is perfect for our premium portfolio.",
                timestamp: "1 hour ago",
                likes: 5,
                isVerified: true,
                role: "Senior Agent"
            },
            {
                id: 2,
                postId: 1,
                author: "Lisa Chen",
                avatar: "/images/user-profile.png",
                content: "Perfect timing! I have 3 premium clients who would be perfect for this exclusive development. The amenities look incredible.",
                timestamp: "45 minutes ago",
                likes: 3,
                isVerified: true,
                role: "Luxury Specialist"
            },
            {
                id: 3,
                postId: 2,
                author: "David Wilson",
                avatar: "/images/user-profile.png",
                content: "These market insights are incredibly valuable for our client consultations. Excellent analysis and presentation!",
                timestamp: "2 hours ago",
                likes: 7,
                isVerified: false,
                role: "Market Analyst"
            },
            {
                id: 4,
                postId: 4,
                author: "Emily Davis",
                avatar: "/images/user-profile.png",
                content: "Congratulations on this amazing achievement! This sets a new standard for our team. Well done!",
                timestamp: "30 minutes ago",
                likes: 9,
                isVerified: true,
                role: "Team Lead"
            }
        ],
        upcomingInteractions: [
            {
                id: 1,
                type: "property-viewing",
                title: "🏖️ Luxury Villa Viewing - Palm Jumeirah",
                client: "Mr. & Mrs. Anderson",
                time: "10:00 AM",
                date: "Today",
                status: "confirmed",
                priority: "high",
                location: "Palm Jumeirah Villa 123",
                value: "AED 15M",
                duration: "2 hours",
                agent: "Sarah Johnson",
                notes: "VIP clients interested in waterfront properties"
            },
            {
                id: 2,
                type: "client-meeting",
                title: "💼 Premium Investment Consultation",
                client: "Dr. Sarah Mitchell",
                time: "2:00 PM",
                date: "Today",
                status: "confirmed",
                priority: "high",
                location: "Office - Executive Suite",
                value: "AED 25M",
                duration: "1.5 hours",
                agent: "Ahmed Al-Rashid",
                notes: "Portfolio diversification discussion"
            },
            {
                id: 3,
                type: "follow-up-call",
                title: "📞 VIP Follow-up Call - Penthouse Inquiry",
                client: "Mr. James Brown",
                time: "4:30 PM",
                date: "Today",
                status: "pending",
                priority: "medium",
                location: "Phone Call",
                value: "AED 8M",
                duration: "30 mins",
                agent: "Maria Garcia",
                notes: "Follow-up on penthouse viewing"
            },
            {
                id: 4,
                type: "contract-signing",
                title: "📝 Luxury Rental Agreement Signing",
                client: "Ms. Emily Davis",
                time: "11:00 AM",
                date: "Tomorrow",
                status: "scheduled",
                priority: "high",
                location: "Office - Conference Room",
                value: "AED 500K/year",
                duration: "1 hour",
                agent: "David Wilson",
                notes: "Annual luxury rental contract"
            }
        ],
        upcomingBirthdays: [
            {
                id: 1,
                name: "Sarah Johnson",
                role: "Senior Luxury Agent",
                avatar: "/images/user-profile.png",
                birthday: "Today",
                age: 28,
                department: "Premium Sales",
                achievements: ["Top Performer", "Client Excellence"],
                yearsWithCompany: 5
            },
            {
                id: 2,
                name: "Ahmed Al-Rashid",
                role: "Property Director",
                avatar: "/images/user-profile.png",
                birthday: "Tomorrow",
                age: 32,
                department: "Management",
                achievements: ["Leadership Award", "Team Builder"],
                yearsWithCompany: 8
            },
            {
                id: 3,
                name: "Maria Garcia",
                role: "Marketing Strategist",
                avatar: "/images/user-profile.png",
                birthday: "Dec 25",
                age: 26,
                department: "Marketing",
                achievements: ["Creative Excellence", "Brand Builder"],
                yearsWithCompany: 3
            },
            {
                id: 4,
                name: "David Wilson",
                role: "Junior Agent",
                avatar: "/images/user-profile.png",
                birthday: "Dec 28",
                age: 24,
                department: "Sales",
                achievements: ["Rising Star", "Quick Learner"],
                yearsWithCompany: 1
            }
        ],
        stats: {
            totalPosts: 12,
            totalComments: 45,
            upcomingInteractions: 8,
            upcomingBirthdays: 4,
            teamMembers: 25,
            activeClients: 150,
            totalValue: "AED 2.5B",
            conversionRate: "85%",
            monthlyGrowth: "+12%",
            clientSatisfaction: "98%"
        }
    }), []);

    const tabs = useMemo(() => [
        { id: 'overview', label: 'Overview', icon: TrendingUp, color: '#667eea' },
        { id: 'posts', label: 'Posts', icon: MessageSquare, color: '#10b981' },
        { id: 'interactions', label: 'Interactions', icon: Calendar, color: '#f59e0b' },
        { id: 'birthdays', label: 'Birthdays', icon: Gift, color: '#ef4444' },
        { id: 'comments', label: 'Comments', icon: Users, color: '#8b5cf6' }
    ], []);


    const getTypeIcon = useCallback((type) => {
        switch (type) {
            case 'property-viewing': return '🏠';
            case 'client-meeting': return '🤝';
            case 'follow-up-call': return '📞';
            case 'contract-signing': return '📝';
            default: return '📅';
        }
    }, []);

    const handleRefresh = useCallback(() => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
        }, 1000);
    }, []);

    const handlePostClick = useCallback((post) => {
        console.log('Post clicked:', post);
    }, []);

    const handleCreatePost = useCallback(() => {
        console.log('Create post clicked');
    }, []);

    const renderOverview = () => (
        <div className={styles.overviewGrid}>
            {/* Enhanced Stats Cards */}
            <div className={styles.statsGrid}>
                <div className={`${styles.statCard} ${styles.statCardPrimary} ${styles.premiumCard}`}>
                    <div className={styles.statIcon}>
                        <MessageSquare size={28} />
                    </div>
                    <div className={styles.statContent}>
                        <h3>{whiteboardData.stats.totalPosts}</h3>
                        <p>Premium Posts</p>
                        <div className={styles.statTrend}>
                            <TrendingUp size={16} />
                            <span>+12%</span>
                        </div>
                    </div>
                    <div className={styles.statGlow}></div>
                </div>
                
                <div className={`${styles.statCard} ${styles.statCardSuccess} ${styles.premiumCard}`}>
                    <div className={styles.statIcon}>
                        <Users size={28} />
                    </div>
                    <div className={styles.statContent}>
                        <h3>{whiteboardData.stats.totalComments}</h3>
                        <p>Engagements</p>
                        <div className={styles.statTrend}>
                            <TrendingUp size={16} />
                            <span>+8%</span>
                        </div>
                    </div>
                    <div className={styles.statGlow}></div>
                </div>
                
                <div className={`${styles.statCard} ${styles.statCardWarning} ${styles.premiumCard}`}>
                    <div className={styles.statIcon}>
                        <Calendar size={28} />
                    </div>
                    <div className={styles.statContent}>
                        <h3>{whiteboardData.stats.upcomingInteractions}</h3>
                        <p>VIP Meetings</p>
                        <div className={styles.statTrend}>
                            <TrendingUp size={16} />
                            <span>+15%</span>
                        </div>
                    </div>
                    <div className={styles.statGlow}></div>
                </div>
                
                <div className={`${styles.statCard} ${styles.statCardInfo} ${styles.premiumCard}`}>
                    <div className={styles.statIcon}>
                        <Gift size={28} />
                    </div>
                    <div className={styles.statContent}>
                        <h3>{whiteboardData.stats.upcomingBirthdays}</h3>
                        <p>Celebrations</p>
                        <div className={styles.statTrend}>
                            <TrendingUp size={16} />
                            <span>+5%</span>
                        </div>
                    </div>
                    <div className={styles.statGlow}></div>
                </div>
            </div>

            {/* Enhanced Activity Feed */}
            <div className={styles.recentActivity}>
                <div className={styles.sectionHeader}>
                    <h3>
                        <Sparkles size={24} />
                        Recent Activity
                    </h3>
                    <button className={styles.viewAllButton}>View All</button>
                </div>
                <div className={styles.activityList}>
                    {whiteboardData.posts.slice(0, 3).map((post, index) => (
                        <div key={post.id} className={`${styles.activityItem} ${styles.premiumActivityItem}`} style={{ animationDelay: `${index * 0.1}s` }}>
                            <div className={styles.activityAvatar}>
                                <img src={post.avatar} alt={post.author} />
                                <div className={styles.activityBadge}>
                                    <Crown size={12} />
                                </div>
                            </div>
                            <div className={styles.activityContent}>
                                <p><strong>{post.author}</strong> posted: {post.title}</p>
                                <div className={styles.activityMeta}>
                                    <span className={styles.activityTime}>{post.timestamp}</span>
                                    <span className={styles.activityCategory}>{post.category}</span>
                                    <span className={styles.activityEngagement}>{post.engagement}% engagement</span>
                                </div>
                            </div>
                            <div className={styles.activityActions}>
                                <button className={styles.activityActionButton}>
                                    <Heart size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Enhanced Quick Actions */}
            <div className={styles.quickActions}>
                <div className={styles.sectionHeader}>
                    <h3>
                        <Zap size={24} />
                        Quick Actions
                    </h3>
                </div>
                <div className={styles.actionButtons}>
                    <button className={`${styles.actionButton} ${styles.premiumActionButton}`} onClick={handleCreatePost}>
                        <Plus size={20} />
                        <span>New Post</span>
                        <div className={styles.buttonGlow}></div>
                    </button>
                    <button className={`${styles.actionButton} ${styles.premiumActionButton}`}>
                        <Calendar size={20} />
                        <span>Schedule Meeting</span>
                        <div className={styles.buttonGlow}></div>
                    </button>
                    <button className={`${styles.actionButton} ${styles.premiumActionButton}`}>
                        <Users size={20} />
                        <span>Add Team Member</span>
                        <div className={styles.buttonGlow}></div>
                    </button>
                </div>
            </div>
        </div>
    );

    const renderPosts = () => (
        <div className={styles.postsContainer}>
            <div className={styles.postsHeader}>
                <div className={styles.headerContent}>
                    <h2>
                        <Star size={28} />
                        Premium Posts & Updates
                    </h2>
                    <p>Stay updated with the latest luxury property insights and team achievements</p>
                </div>
                <button className={`${styles.newPostButton} ${styles.premiumButton}`} onClick={handleCreatePost}>
                    <Plus size={20} />
                    <span>Create Post</span>
                    <div className={styles.buttonGlow}></div>
                </button>
            </div>
            
            <div className={styles.postsList}>
                {whiteboardData.posts.map((post, index) => (
                    <div key={post.id} className={`${styles.postCard} ${styles.premiumPostCard} ${styles[`postCard--${post.priority}`]}`} style={{ animationDelay: `${index * 0.1}s` }} onClick={() => handlePostClick(post)}>
                        <div className={styles.postHeader}>
                            <div className={styles.postAuthor}>
                                <div className={styles.postAvatarContainer}>
                                    <img src={post.avatar} alt={post.author} className={styles.postAvatar} />
                                    <div className={styles.verifiedBadge}>
                                        <Shield size={12} />
                                    </div>
                                </div>
                                <div className={styles.postAuthorInfo}>
                                    <h4>{post.author}</h4>
                                    <div className={styles.postMeta}>
                                        <span className={styles.postTime}>{post.timestamp}</span>
                                        <span className={styles.postReadTime}>{post.readTime}</span>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.postActions}>
                                <span className={`${styles.priorityBadge} ${styles[`priorityBadge--${post.priority}`]}`}>
                                    {post.priority}
                                </span>
                                <button className={styles.postMenuButton}>
                                    <MoreHorizontal size={16} />
                                </button>
                            </div>
                        </div>
                        
                        <div className={styles.postContent}>
                            <h3 className={styles.postTitle}>{post.title}</h3>
                            <p className={styles.postText}>{post.content}</p>
                            <div className={styles.postTags}>
                                {post.tags.map((tag, idx) => (
                                    <span key={idx} className={styles.postTag}>{tag}</span>
                                ))}
                            </div>
                        </div>
                        
                        <div className={styles.postFooter}>
                            <div className={styles.postEngagement}>
                                <button className={styles.engagementButton}>
                                    <Heart size={16} />
                                    {post.likes}
                                </button>
                                <button className={styles.engagementButton}>
                                    <MessageSquare size={16} />
                                    {post.comments}
                                </button>
                                <button className={styles.engagementButton}>
                                    <Share2 size={16} />
                                    {post.shares}
                                </button>
                            </div>
                            <div className={styles.postType}>
                                <span className={`${styles.typeBadge} ${styles[`typeBadge--${post.type}`]}`}>
                                    {post.type.replace('-', ' ')}
                                </span>
                                <span className={styles.engagementRate}>{post.engagement}% engagement</span>
                            </div>
                        </div>
                        
                        <div className={styles.postGlow}></div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderInteractions = () => (
        <div className={styles.interactionsContainer}>
            <div className={styles.interactionsHeader}>
                <div className={styles.headerContent}>
                    <h2>
                        <Target size={28} />
                        VIP Interactions
                    </h2>
                    <p>Manage your premium client meetings and property viewings</p>
                </div>
                <div className={styles.interactionFilters}>
                    <button className={`${styles.filterButton} ${styles.premiumFilterButton}`}>
                        <Filter size={16} />
                        <span>Filter</span>
                    </button>
                </div>
            </div>
            
            <div className={styles.interactionsList}>
                {whiteboardData.upcomingInteractions.map((interaction, index) => (
                    <div key={interaction.id} className={`${styles.interactionCard} ${styles.premiumInteractionCard} ${styles[`interactionCard--${interaction.priority}`]}`} style={{ animationDelay: `${index * 0.1}s` }}>
                        <div className={styles.interactionIcon}>
                            <span className={styles.typeEmoji}>{getTypeIcon(interaction.type)}</span>
                            <div className={styles.interactionGlow}></div>
                        </div>
                        
                        <div className={styles.interactionContent}>
                            <div className={styles.interactionHeader}>
                                <h4>{interaction.title}</h4>
                                <div className={styles.interactionBadges}>
                                    <span className={`${styles.statusBadge} ${styles[`statusBadge--${interaction.status}`]}`}>
                                        {interaction.status}
                                    </span>
                                    <span className={styles.valueBadge}>
                                        {interaction.value}
                                    </span>
                                </div>
                            </div>
                            
                            <div className={styles.interactionDetails}>
                                <div className={styles.detailRow}>
                                    <span className={styles.detailLabel}>Client:</span>
                                    <span className={styles.detailValue}>{interaction.client}</span>
                                </div>
                                <div className={styles.detailRow}>
                                    <span className={styles.detailLabel}>Time:</span>
                                    <span className={styles.detailValue}>{interaction.time} - {interaction.date}</span>
                                </div>
                                <div className={styles.detailRow}>
                                    <span className={styles.detailLabel}>Location:</span>
                                    <span className={styles.detailValue}>{interaction.location}</span>
                                </div>
                                <div className={styles.detailRow}>
                                    <span className={styles.detailLabel}>Agent:</span>
                                    <span className={styles.detailValue}>{interaction.agent}</span>
                                </div>
                                <div className={styles.detailRow}>
                                    <span className={styles.detailLabel}>Notes:</span>
                                    <span className={styles.detailValue}>{interaction.notes}</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className={styles.interactionActions}>
                            <button className={styles.actionButton}>
                                <Eye size={16} />
                            </button>
                            <button className={styles.actionButton}>
                                <Calendar size={16} />
                            </button>
                        </div>
                        
                        <div className={styles.interactionGlow}></div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderBirthdays = () => (
        <div className={styles.birthdaysContainer}>
            <div className={styles.birthdaysHeader}>
                <div className={styles.headerContent}>
                    <h2>
                        <Crown size={28} />
                        Team Celebrations
                    </h2>
                    <p>Celebrate your team members&apos; special days and achievements</p>
                </div>
                <button className={`${styles.birthdayButton} ${styles.premiumButton}`}>
                    <Gift size={20} />
                    <span>Send Wishes</span>
                    <div className={styles.buttonGlow}></div>
                </button>
            </div>
            
            <div className={styles.birthdaysList}>
                {whiteboardData.upcomingBirthdays.map((person, index) => (
                    <div key={person.id} className={`${styles.birthdayCard} ${styles.premiumBirthdayCard}`} style={{ animationDelay: `${index * 0.1}s` }}>
                        <div className={styles.birthdayAvatar}>
                            <img src={person.avatar} alt={person.name} />
                            <div className={styles.birthdayBadge}>
                                <Gift size={16} />
                            </div>
                            <div className={styles.birthdayGlow}></div>
                        </div>
                        
                        <div className={styles.birthdayContent}>
                            <h4>{person.name}</h4>
                            <p className={styles.birthdayRole}>{person.role}</p>
                            <p className={styles.birthdayDate}>
                                <Calendar size={14} />
                                {person.birthday} • Turning {person.age + 1}
                            </p>
                            <div className={styles.achievements}>
                                {person.achievements.map((achievement, idx) => (
                                    <span key={idx} className={styles.achievementBadge}>
                                        <Award size={12} />
                                        {achievement}
                                    </span>
                                ))}
                            </div>
                            <span className={styles.birthdayDepartment}>{person.department} • {person.yearsWithCompany} years</span>
                        </div>
                        
                        <div className={styles.birthdayActions}>
                            <button className={`${styles.wishButton} ${styles.premiumWishButton}`}>
                                <Heart size={16} />
                                <span>Wish</span>
                                <div className={styles.buttonGlow}></div>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderComments = () => (
        <div className={styles.commentsContainer}>
            <div className={styles.commentsHeader}>
                <div className={styles.headerContent}>
                    <h2>
                        <Globe size={28} />
                        Premium Discussions
                    </h2>
                    <p>Engage with your team&apos;s latest conversations and insights</p>
                </div>
                <div className={styles.commentFilters}>
                    <button className={`${styles.filterButton} ${styles.premiumFilterButton}`}>
                        <Filter size={16} />
                        <span>Filter</span>
                    </button>
                </div>
            </div>
            
            <div className={styles.commentsList}>
                {whiteboardData.comments.map((comment, index) => (
                    <div key={comment.id} className={`${styles.commentCard} ${styles.premiumCommentCard}`} style={{ animationDelay: `${index * 0.1}s` }}>
                        <div className={styles.commentAvatar}>
                            <img src={comment.avatar} alt={comment.author} />
                            {comment.isVerified && (
                                <div className={styles.verifiedBadge}>
                                    <Shield size={12} />
                                </div>
                            )}
                        </div>
                        
                        <div className={styles.commentContent}>
                            <div className={styles.commentHeader}>
                                <h5>{comment.author}</h5>
                                <span className={styles.commentRole}>{comment.role}</span>
                                <span className={styles.commentTime}>{comment.timestamp}</span>
                            </div>
                            
                            <p className={styles.commentText}>{comment.content}</p>
                            
                            <div className={styles.commentActions}>
                                <button className={styles.commentActionButton}>
                                    <ThumbsUp size={14} />
                                    {comment.likes}
                                </button>
                                <button className={styles.commentActionButton}>
                                    <MessageSquare size={14} />
                                    Reply
                                </button>
                            </div>
                        </div>
                        
                        <div className={styles.commentGlow}></div>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div className={styles.whiteboard}>
            {/* Premium Header */}
            <div className={styles.whiteboardHeader}>
                <div className={styles.headerLeft}>
                    <h1 className={styles.whiteboardTitle}>
                        <span className={styles.titleIcon}>✨</span>
                        <span className={styles.titleText}>Premium Whiteboard</span>
                        <div className={styles.titleGlow}></div>
                    </h1>
                    <p className={styles.whiteboardSubtitle}>
                        Your exclusive command center for luxury real estate operations
                    </p>
                </div>
                
                <div className={styles.headerRight}>
                    <div className={styles.searchContainer}>
                        <Search size={20} className={styles.searchIcon} />
                        <input
                            type="text"
                            placeholder="Search premium content..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={styles.searchInput}
                        />
                    </div>
                    
                    <button 
                        onClick={handleRefresh}
                        className={`${styles.refreshButton} ${isLoading ? styles.refreshButtonLoading : ''} ${styles.premiumButton}`}
                    >
                        <RefreshCw size={20} />
                    </button>
                    
                    <button className={`${styles.settingsButton} ${styles.premiumButton}`}>
                        <Settings size={20} />
                    </button>
                </div>
            </div>

            {/* Premium Tab Navigation */}
            <div className={styles.tabNavigation}>
                {tabs.map((tab) => {
                    const IconComponent = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`${styles.tabButton} ${activeTab === tab.id ? styles.tabButtonActive : ''} ${styles.premiumTabButton}`}
                            style={{ '--tab-color': tab.color }}
                        >
                            <IconComponent size={20} />
                            {tab.label}
                            {activeTab === tab.id && <div className={styles.tabGlow}></div>}
                        </button>
                    );
                })}
            </div>

            {/* Premium Content Area */}
            <div className={styles.whiteboardContent}>
                {activeTab === 'overview' && renderOverview()}
                {activeTab === 'posts' && renderPosts()}
                {activeTab === 'interactions' && renderInteractions()}
                {activeTab === 'birthdays' && renderBirthdays()}
                {activeTab === 'comments' && renderComments()}
            </div>
        </div>
    );
};

export default Whiteboard;