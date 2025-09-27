import Table from "../../ui/Table";
import { useNavigate } from "react-router-dom";
import { Eye } from "lucide-react"; 

// Styles
const logoStyle = {
    width: '40px',
    height: '40px',
    objectFit: 'contain',
    borderRadius: '4px',
};

const countStyle = {
    textAlign: 'center',
    fontSize: '1.4rem',
    cursor: 'pointer',
    color: '#2563eb', 
    fontWeight: '500',
    padding: '0.5rem 0',
    borderRadius: '4px',
    transition: 'background-color 0.2s ease'
};

const countHoverStyle = {
     backgroundColor: '#eff6ff'
};

const actionCellStyle = {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center', // Center align actions
    alignItems: 'center',
};

function DeveloperRow({ developerData }) {
    const navigate = useNavigate();

    const { id, name, logoUrl, agent_name, property_counts } = developerData;

    const handleNavigate = (listingType) => {
        let path = '';
        if (listingType === 'sell') {
            path = `/for-sell/new-list?developer_id=${id}`;
        } else if (listingType === 'rent') {
            path = `/for-rent/new-list?developer_id=${id}`;
        } else if (listingType === 'project') {
            path = `/new-projects/list?developer_id=${id}`;
        } else if (listingType === 'pool_project') {
            path = `/new-projects/list?developer_id=${id}&type=pool`;
        }
        if(path) navigate(path);
    };

    return (
        <Table.Row>
            <div>
                <img src={logoUrl || '/placeholder-logo.png'} alt={name} style={logoStyle} />
            </div>
            <div style={{ textAlign: 'left' }}>{name || "N/A"}</div>
            <div style={{ textAlign: 'left' }}>{agent_name || "N/A"}</div>
            <div 
                style={countStyle} 
                onClick={() => handleNavigate('sell')}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = countHoverStyle.backgroundColor}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                title={`View Sell listings for ${name}`}
            >
                {property_counts?.sell || 0}
            </div>
            <div 
                style={countStyle} 
                onClick={() => handleNavigate('rent')}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = countHoverStyle.backgroundColor}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                title={`View Rent listings for ${name}`}
            >
                {property_counts?.rent || 0}
            </div>
            <div 
                style={countStyle} 
                onClick={() => handleNavigate('project')}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = countHoverStyle.backgroundColor}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                title={`View Projects by ${name}`}
            >
                {property_counts?.project ?? 0}
            </div>
            <div 
                style={countStyle} 
                onClick={() => handleNavigate('pool_project')}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = countHoverStyle.backgroundColor}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                title={`View Pool Projects by ${name}`}
            >
                {property_counts?.pool_project ?? 0}
            </div>
            <div style={actionCellStyle}>
                <button 
                    onClick={() => handleNavigate('sell')} 
                    className="btnIcon"
                    title={`View Sell listings for ${name}`}
                    style={{ padding: '0.5rem'}}
                >
                    <Eye size={18} />
                </button>
            </div>
        </Table.Row>
    );
}

export default DeveloperRow; 