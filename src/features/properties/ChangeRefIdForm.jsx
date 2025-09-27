import { toast } from "react-toastify";
import React from "react";
import useChangePropertyId from "./useChangePropertyId";

export default function ChangeRefIdForm({ data, onCloseModal }) {
    const { changePropertyId } = useChangePropertyId();

    function handleChangeRefId(e) {
      e.preventDefault();

        changePropertyId(
        { oldPropertyId: data.id, newPropertyId: e.target.refId.value },
        {
          onSuccess: () => {
            toast.success("Ref ID changed successfully!");
            onCloseModal(); 
          },
          onError: () => {
            toast.error("Failed to change Ref ID");
          },
        }
      );
    }

   
    const headingStyle = {
      fontSize: 22,
      fontWeight: 600,
      marginBottom: 18,
      color: "#11181C",
      letterSpacing: -0.5,
    };
    const labelStyle = {
      display: "block",
      marginBottom: 8,
      fontWeight: 500,
      color: "#344054",
      fontSize: 15,
    };
    const inputStyle = {
      width: " 300px",
      padding: "10px 12px",
      borderRadius: 8,
      border: "1px solid #d1d5db",
      fontSize: 15,
      outline: "none",
      transition: "border-color 0.2s, box-shadow 0.2s",
      boxSizing: "border-box",
      margin : "0 auto",
    };
    const buttonStyle = {
      padding: "10px 0",
      width: " 300px",
      background: "#fcfeff",
      color: "#1f1414",
      border: " 1px solid #d1d5db",
      borderRadius: 8,
      fontWeight: 600,
      fontSize: 16,
      cursor: "pointer",
      boxShadow: "0 1px 2px 0 rgba(16, 24, 40, 0.05)",
      transition: "background 0.2s, box-shadow 0.2s",
      margin : "0 auto",
      
    };
    // Focus/hover states via inline event handlers
    const [inputFocus, setInputFocus] = React.useState(false);
    const [buttonHover, setButtonHover] = React.useState(false);

    return (
      <div >
        <h3 style={headingStyle}>Change Ref ID</h3>
        <form onSubmit={handleChangeRefId} autoComplete="off">
          <div style={{ marginBottom: 18 }}>
            <label htmlFor="refId" style={labelStyle}>
              Ref ID
            </label>
            <input
              type="text"
              name="refId"
              id="refId"
              style={{
                ...inputStyle,
                borderColor: inputFocus ? "#3B82F6" : inputStyle.border,
                boxShadow: inputFocus ? "0 0 0 2px #3B82F633" : undefined,
              }}
              onFocus={() => setInputFocus(true)}
              onBlur={() => setInputFocus(false)}
            />
          </div>
          <button
            type="submit"
            style={{
              ...buttonStyle,
             
            }}
            onMouseEnter={() => setButtonHover(true)}
            onMouseLeave={() => setButtonHover(false)}
          >
            Save
          </button>
        </form>
      </div>
    );
}
  