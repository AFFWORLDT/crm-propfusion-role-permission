import React from 'react';
import { X } from 'lucide-react';

const AmenitiesList = ({ watch, setValue }) => {
  const amenities = watch("amenities") || [];
  
  if (amenities.length === 0) return null;

  return (
    <div style={{ 
      marginTop: "15px", 
      border: "1px solid #e6e6e6", 
      padding: "15px", 
      borderRadius: "8px",
      backgroundColor: "#fafafa",
      boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
    }}>
      <div style={{
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        gap: "12px"
      }}>
        {amenities.map((item, i) => (
          <div 
            key={i} 
            style={{ 
              position: "relative",
              border: "1px solid #e1e1e1",
              borderRadius: "6px",
              padding: "20px 12px 12px",
              minWidth: "130px",
              backgroundColor: "white",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              transition: "all 0.2s ease",
              cursor: "default",
              maxWidth: "200px"
            }}
          >
            <button
              type="button"
              onClick={() => {
                const updatedAmenities = amenities.filter((_, index) => index !== i);
                setValue("amenities", updatedAmenities);
              }}
              style={{
                backgroundColor: "rgba(255, 77, 79, 0.1)",
                color: "#ff4d4f",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "12px",
                padding: "3px",
                position: "absolute",
                top: "4px",
                right: "4px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s ease",
                ':hover': {
                  backgroundColor: "rgba(255, 77, 79, 0.2)",
                  transform: "scale(1.05)"
                }
              }}
            >
              <X size={14}/>
            </button>
            <span style={{
              fontSize: "14px",
              color: "#2c3e50",
              fontWeight: "500",
              display: "block",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap"
            }}>
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AmenitiesList;