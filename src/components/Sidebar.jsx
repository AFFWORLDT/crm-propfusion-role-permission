import { NavLink } from 'react-router-dom';
import styles from './Sidebar.module.css';
import { 
    LayoutDashboard, 
    Building2, 
    MapPin,
    Building,
    Home,
    Users,
    MessageSquare,
    MessageCircle,
    BarChart2
} from 'lucide-react';

function Sidebar() {
    return (
        <nav className={styles.sidebar}>
            <div className={styles.navGroup}>
                <h3>Communication</h3>
                <NavLink 
                    to="/feed" 
                    className={({ isActive }) => 
                        isActive ? styles.activeNavLink : styles.navLink
                    }
                >
                    <MessageSquare size={20} />
                    <span>Agent Feed</span>
                </NavLink>
                <NavLink 
                    to="/agent-properties" 
                    className={({ isActive }) => 
                        isActive ? styles.activeNavLink : styles.navLink
                    }
                >
                    <BarChart2 size={20} />
                    <span>Agent Properties</span>
                </NavLink>
            </div>

            {/* WhatsApp Logs Link at the bottom */}
            <div className={styles.navGroup} style={{ marginTop: 'auto' }}>
                <NavLink 
                    to="/whatsapp-logs" 
                    className={({ isActive }) => 
                        isActive ? styles.activeNavLink : styles.navLink
                    }
                >
                    <MessageCircle size={20} />
                    <span>WhatsApp Logs</span>
                </NavLink>
            </div>

            <div className={styles.navGroup} style={{ marginTop: 'auto' }}>
                <NavLink 
                    to="/whatsapp" 
                    className={({ isActive }) => 
                        isActive ? styles.activeNavLink : styles.navLink
                    }
                >
                    <MessageCircle size={20} />
                    <span>WhatsApp</span>
                </NavLink>
            </div>
        </nav>
    );
}

export default Sidebar; 