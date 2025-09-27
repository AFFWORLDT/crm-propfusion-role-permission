import { Box, Tabs, Tab, styled } from "@mui/material";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { format, addDays } from "date-fns";

const StyledTabs = styled(Tabs)(() => ({
    backgroundColor: "#f5f5f5",
    borderRadius: "8px",
    padding: "4px",
    minHeight: "40px",
    "& .MuiTabs-indicator": {
        display: "none",
    },
}));

const StyledTab = styled(Tab)(({ theme }) => ({
    textTransform: "none",
    minHeight: "32px",
    padding: "6px 16px",
    borderRadius: "6px",
    fontSize: "14px",
    fontWeight: 500,
    color: "rgba(0, 0, 0, 0.7)",
    "&.Mui-selected": {
        color: theme.palette.primary.main,
        backgroundColor: "#fff",
        boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
    },
}));

function FollowUpTimeFilter({ onFilterChange }) {
    const [value, setValue] = useState("all");
    const [searchParams, setSearchParams] = useSearchParams();

    const handleChange = (event, newValue) => {
        setValue(newValue);
        
    
        searchParams.delete("followup_date_after");
        searchParams.delete("followup_date_before");
        
        if (newValue === "upcoming") {
            const today = new Date();
            const formattedDate = format(today, "yyyy-MM-dd");
            searchParams.set("followup_date_after", formattedDate);
        } else if (newValue === "today") {
            const today = new Date();
            const after = format(addDays(today, -1), "yyyy-MM-dd"); 
            const before = format(addDays(today, 1), "yyyy-MM-dd"); 
            searchParams.set("followup_date_after", after);
            searchParams.set("followup_date_before", before);
        } else if (newValue === "before") {
            const today = format(new Date(), "yyyy-MM-dd");
            searchParams.set("followup_date_before", today);
        }
        
        setSearchParams(searchParams);
        onFilterChange(newValue);
    };

    return (
        <Box sx={{ width: "100%", mb: 2 }}>
            <StyledTabs
                value={value}
                onChange={handleChange}
                variant="fullWidth"
                aria-label="follow-up time filter tabs"
            >
                <StyledTab label="Today" value="today" />
                <StyledTab label="Upcoming" value="upcoming" />
                <StyledTab label="Before" value="before" />
            </StyledTabs>
        </Box>
    );
}

export default FollowUpTimeFilter; 