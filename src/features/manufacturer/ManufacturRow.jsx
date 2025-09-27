import Table from "../../ui/Table";

// Basic styling, can be moved to CSS modules
const countStyle = {
    textAlign: 'center',
    fontSize: '1.4rem',
    cursor: 'pointer',
    color: '#2563eb', // Blue color like links
    fontWeight: '500',
    padding: '0.5rem 0', // Add padding for easier clicking
    borderRadius: '4px',
    transition: 'background-color 0.2s ease'
};

const countHoverStyle = {
     backgroundColor: '#eff6ff' // Light blue background on hover
};

function ManufacturerRow({ manufacturerData }) {
    const { id, name, country } = manufacturerData;

    return (
        <Table.Row>
            <div style={{ textAlign: 'left' }}>{name || "N/A"}</div>
            <div style={{ textAlign: 'left' }}>{country || "Unknown"}</div>
            <div style={{ textAlign: 'left' }}>{id || "N/A"}</div>
        </Table.Row>
    );
}

export default ManufacturerRow; 