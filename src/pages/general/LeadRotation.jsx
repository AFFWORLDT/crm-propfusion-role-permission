import { useState, useEffect } from "react";
import {
    Plus,
    Settings,
} from "lucide-react";
import styles from "./SmtpSetting.module.css";
import SectionTop from "../../ui/SectionTop";
import TabBar from "../../ui/TabBar";
import { LEAD_ROTATION_TABS, PROPERTY_TYPES } from "../../utils/constants";
import ScreenRotationAltIcon from '@mui/icons-material/ScreenRotationAlt';
import { getAgentRotationSettings, updateAgentRotationSettings } from "../../services/apiLeadRotation";
import { useQuery } from "@tanstack/react-query";
import { 
    FormControl, 
    FormControlLabel, 
    Switch, 
    Button, 
    Box, 
    Typography, 
    MenuItem, 
    Select, 
    InputLabel, 
    Grid, 
    IconButton, 
    Card, 
    CardContent, 
    CircularProgress,
    Snackbar,
    Alert
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import useStaff from "../../features/admin/staff/useStaff";

const LeadRotation = () => {
    const [agentRotation, setAgentRotation] = useState(false);
    const [days, setDays] = useState(0);
    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(0);
    const [rotationReason, setRotationReason] = useState("");
    const [refreshDays, setRefreshDays] = useState(0);
    const [refreshHours, setRefreshHours] = useState(0);
    const [refreshMinutes, setRefreshMinutes] = useState(0);
    const [propertyTypeAgents, setPropertyTypeAgents] = useState([]);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success"
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch agents list
    const { data: agentsList = [], isLoading: isLoadingAgents } = useStaff();

    // Fetch current rotation settings
    const { data: rotationSettings, isLoading, error } = useQuery({
        queryKey: ["agentRotationSettings"],
        queryFn: getAgentRotationSettings,
    });

    // Convert minutes to days, hours, minutes
    const convertMinutesToTime = (totalMinutes) => {
        const days = Math.floor(totalMinutes / (24 * 60));
        const remainingMinutes = totalMinutes % (24 * 60);
        const hours = Math.floor(remainingMinutes / 60);
        const minutes = remainingMinutes % 60;
        return { days, hours, minutes };
    };

    useEffect(() => {
        if (rotationSettings) {
            setAgentRotation(rotationSettings.agent_rotation || false);
            
            // Convert rotation_time (minutes) to days, hours, minutes
            if (rotationSettings.rotation_time) {
                const time = convertMinutesToTime(rotationSettings.rotation_time);
                setDays(time.days);
                setHours(time.hours);
                setMinutes(time.minutes);
            }

            // Rotation reason
            if (rotationSettings.rotation_reason) {
                setRotationReason(rotationSettings.rotation_reason);
            } else {
                setRotationReason("");
            }

            // Convert api_call_interval_minutes (minutes) to days, hours, minutes for Refresh Time
            if (rotationSettings.api_call_interval_minutes) {
                const refreshTime = convertMinutesToTime(rotationSettings.api_call_interval_minutes);
                setRefreshDays(refreshTime.days);
                setRefreshHours(refreshTime.hours);
                setRefreshMinutes(refreshTime.minutes);
            } else {
                setRefreshDays(0);
                setRefreshHours(0);
                setRefreshMinutes(0);
            }
            
            // Initialize property type agents
            if (rotationSettings.property_type_agents) {
                const mappedAgents = Object.entries(rotationSettings.property_type_agents).map(([property, agentId]) => ({
                    property_type: property,
                    agent_id: agentId
                }));
                setPropertyTypeAgents(mappedAgents.length > 0 ? mappedAgents : [{ property_type: "", agent_id: "" }]);
            } else {
                setPropertyTypeAgents([{ property_type: "", agent_id: "" }]);
            }
        }
    }, [rotationSettings]);

    const handleAddPropertyTypeAgent = () => {
        setPropertyTypeAgents([...propertyTypeAgents, { property_type: "", agent_id: "" }]);
    };

    const handleRemovePropertyTypeAgent = (index) => {
        const updatedPropertyTypeAgents = [...propertyTypeAgents];
        updatedPropertyTypeAgents.splice(index, 1);
        setPropertyTypeAgents(updatedPropertyTypeAgents);
    };

    const handlePropertyTypeChange = (index, value) => {
        const updatedPropertyTypeAgents = [...propertyTypeAgents];
        updatedPropertyTypeAgents[index].property_type = value;
        setPropertyTypeAgents(updatedPropertyTypeAgents);
    };

    const handleAgentChange = (index, value) => {
        const updatedPropertyTypeAgents = [...propertyTypeAgents];
        updatedPropertyTypeAgents[index].agent_id = value;
        setPropertyTypeAgents(updatedPropertyTypeAgents);
    };

    const handleSubmit = async () => {
        try {
            setIsSubmitting(true);
            
            // Convert days, hours, minutes to total minutes
            const totalMinutes = (days * 24 * 60) + (hours * 60) + minutes;

            // Convert refresh days, hours, minutes to total minutes (api_call_interval_minutes)
            const refreshTotalMinutes = (refreshDays * 24 * 60) + (refreshHours * 60) + refreshMinutes;

            // Convert propertyTypeAgents array to required object format
            const propertyTypeAgentsObj = {};
            propertyTypeAgents.forEach(item => {
                if (item.property_type && item.agent_id) {
                    propertyTypeAgentsObj[item.property_type] = item.agent_id;
                }
            });

            const payload = {
                agent_rotation: agentRotation,
                property_type_agents: propertyTypeAgentsObj,
                rotation_time: totalMinutes,
                rotation_reason: rotationReason,
                api_call_interval_minutes: refreshTotalMinutes
            };

            await updateAgentRotationSettings(payload);
            
            setSnackbar({
                open: true,
                message: "Lead rotation settings updated successfully!",
                severity: "success"
            });
        } catch (error) {
            setSnackbar({
                open: true,
                message: `Failed to update settings: ${error.message}`,
                severity: "error"
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    // Custom styling for better UI
    const textStyles = {
        fontWeight: 600,
        fontSize: '14px',
        color: '#000'
    };

    const labelStyles = {
        fontWeight: 600,
        fontSize: '14px',
        color: '#000'
    };

    const headingStyles = {
        fontWeight: 700,
        color: '#000',
        fontSize: '18px'
    };

    const titleStyles = {
        fontWeight: 700,
        color: '#000',
        fontSize: '22px'
    };

    // Dropdown styles to match the image
    const selectStyles = {
        height: '40px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        backgroundColor: '#fff',
        '& .MuiOutlinedInput-notchedOutline': {
            border: 'none'
        },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            border: 'none'
        },
        '& .MuiSelect-select': {
            ...textStyles,
            paddingTop: '8px',
            paddingBottom: '8px',
        }
    };

    return (
        <div className="sectionContainer">
            <SectionTop heading="Lead Rotation">
                <TabBar
                    tabs={LEAD_ROTATION_TABS}
                    activeTab={"LEAD_ROTATION"}
                    navigateTo={(id) => LEAD_ROTATION_TABS.find(tab => tab.id === id)?.path || '/admin/general/lead-rotation'}
                />
            </SectionTop>
            <section className="sectionStyles" style={{ backgroundColor: LEAD_ROTATION_TABS[0].bgColor }}>
                <Box sx={{ p: 3 }}>
                    <Card elevation={3} sx={{ borderRadius: '8px' }}>
                        <CardContent sx={{ p: 4 }}>
                            <Box display="flex" alignItems="center" mb={3}>
                                <ScreenRotationAltIcon fontSize="large" sx={{ mr: 1, color: '#000' }} />
                                <Typography variant="h5" sx={titleStyles}>Lead Rotation Settings</Typography>
                            </Box>

                            {isLoading ? (
                                <Box display="flex" justifyContent="center" my={4}>
                                    <CircularProgress />
                                </Box>
                            ) : error ? (
                                <Alert severity="error" sx={{ my: 2 }}>
                                    Error loading settings: {error.message}
                                </Alert>
                            ) : (
                                <>
                                    <FormControl component="fieldset" sx={{ mb: 3 }}>
                                        <FormControlLabel
                                            control={
                                                <Switch
                                                    checked={agentRotation}
                                                    onChange={(e) => setAgentRotation(e.target.checked)}
                                                    color="primary"
                                                />
                                            }
                                            label={<Typography sx={labelStyles}>Enable Agent Rotation</Typography>}
                                        />
                                    </FormControl>

                                    <Box mb={4}>
                                        <Typography variant="h6" gutterBottom sx={headingStyles}>
                                            Rotation Time
                                        </Typography>
                                        <Grid container spacing={2}>
                                            <Grid item xs={4}>
                                                <FormControl fullWidth>
                                                    <InputLabel id="days-label" sx={labelStyles}>Days</InputLabel>
                                                    <Select
                                                        labelId="days-label"
                                                        value={days}
                                                        onChange={(e) => setDays(e.target.value)}
                                                        label="Days"
                                                        disabled={!agentRotation}
                                                        sx={selectStyles}
                                                    >
                                                        {Array.from({ length: 31 }, (_, i) => i).map((day) => (
                                                            <MenuItem key={day} value={day} sx={textStyles}>{day}</MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            </Grid>
                                            <Grid item xs={4}>
                                                <FormControl fullWidth>
                                                    <InputLabel id="hours-label" sx={labelStyles}>Hours</InputLabel>
                                                    <Select
                                                        labelId="hours-label"
                                                        value={hours}
                                                        onChange={(e) => setHours(e.target.value)}
                                                        label="Hours"
                                                        disabled={!agentRotation}
                                                        sx={selectStyles}
                                                    >
                                                        {Array.from({ length: 24 }, (_, i) => i).map((hour) => (
                                                            <MenuItem key={hour} value={hour} sx={textStyles}>{hour}</MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            </Grid>
                                            <Grid item xs={4}>
                                                <FormControl fullWidth>
                                                    <InputLabel id="minutes-label" sx={labelStyles}>Minutes</InputLabel>
                                                    <Select
                                                        labelId="minutes-label"
                                                        value={minutes}
                                                        onChange={(e) => setMinutes(e.target.value)}
                                                        label="Minutes"
                                                        disabled={!agentRotation}
                                                        sx={selectStyles}
                                                    >
                                                        {Array.from({ length: 60 }, (_, i) => i).map((minute) => (
                                                            <MenuItem key={minute} value={minute} sx={textStyles}>{minute}</MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            </Grid>
                                        </Grid>
                                    </Box>

                                    <Box mb={4}>
                                        <Typography variant="h6" gutterBottom sx={headingStyles}>
                                            Rotation Reason
                                        </Typography>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} md={6} lg={4}>
                                                <FormControl fullWidth>
                                                    <InputLabel id="rotation-reason-label" sx={labelStyles}>Rotation Reason</InputLabel>
                                                    <Select
                                                        labelId="rotation-reason-label"
                                                        value={rotationReason}
                                                        onChange={(e) => setRotationReason(e.target.value)}
                                                        label="Rotation Reason"
                                                        disabled={!agentRotation}
                                                        sx={selectStyles}
                                                    >
                                                        <MenuItem value="no_activity" sx={textStyles}>No Activity</MenuItem>
                                                        <MenuItem value="no_stage_followup" sx={textStyles}>No Stage Follow-up</MenuItem>
                                                    </Select>
                                                </FormControl>
                                            </Grid>
                                        </Grid>
                                    </Box>

                                    <Box mb={4}>
                                        <Typography variant="h6" gutterBottom sx={headingStyles}>
                                            Refresh Time
                                        </Typography>
                                        <Grid container spacing={2}>
                                            <Grid item xs={4}>
                                                <FormControl fullWidth>
                                                    <InputLabel id="refresh-days-label" sx={labelStyles}>Days</InputLabel>
                                                    <Select
                                                        labelId="refresh-days-label"
                                                        value={refreshDays}
                                                        onChange={(e) => setRefreshDays(e.target.value)}
                                                        label="Days"
                                                        disabled={!agentRotation}
                                                        sx={selectStyles}
                                                    >
                                                        {Array.from({ length: 31 }, (_, i) => i).map((day) => (
                                                            <MenuItem key={day} value={day} sx={textStyles}>{day}</MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            </Grid>
                                            <Grid item xs={4}>
                                                <FormControl fullWidth>
                                                    <InputLabel id="refresh-hours-label" sx={labelStyles}>Hours</InputLabel>
                                                    <Select
                                                        labelId="refresh-hours-label"
                                                        value={refreshHours}
                                                        onChange={(e) => setRefreshHours(e.target.value)}
                                                        label="Hours"
                                                        disabled={!agentRotation}
                                                        sx={selectStyles}
                                                    >
                                                        {Array.from({ length: 24 }, (_, i) => i).map((hour) => (
                                                            <MenuItem key={hour} value={hour} sx={textStyles}>{hour}</MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            </Grid>
                                            <Grid item xs={4}>
                                                <FormControl fullWidth>
                                                    <InputLabel id="refresh-minutes-label" sx={labelStyles}>Minutes</InputLabel>
                                                    <Select
                                                        labelId="refresh-minutes-label"
                                                        value={refreshMinutes}
                                                        onChange={(e) => setRefreshMinutes(e.target.value)}
                                                        label="Minutes"
                                                        disabled={!agentRotation}
                                                        sx={selectStyles}
                                                    >
                                                        {Array.from({ length: 60 }, (_, i) => i).map((minute) => (
                                                            <MenuItem key={minute} value={minute} sx={textStyles}>{minute}</MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            </Grid>
                                        </Grid>
                                    </Box>

                                    <Typography variant="h6" gutterBottom sx={headingStyles}>
                                        Property Type to Agent Mapping
                                    </Typography>

                                    {isLoadingAgents ? (
                                        <Box display="flex" justifyContent="center" my={2}>
                                            <CircularProgress size={24} />
                                        </Box>
                                    ) : (
                                        <>
                                            {propertyTypeAgents.map((item, index) => (
                                                <Box key={index} sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                                                    <Box sx={{ width: '45%', mr: 2 }}>
                                                        <Typography sx={{ ...labelStyles, mb: 1 }}>Property Type</Typography>
                                                        <Select
                                                            value={item.property_type}
                                                            onChange={(e) => handlePropertyTypeChange(index, e.target.value)}
                                                            displayEmpty
                                                            fullWidth
                                                            sx={selectStyles}
                                                            MenuProps={{
                                                                PaperProps: {
                                                                    style: {
                                                                        maxHeight: 300,
                                                                    }
                                                                }
                                                            }}
                                                            disabled={!agentRotation}
                                                        >
                                                            <MenuItem value="" disabled sx={textStyles}>
                                                                Select Property Type
                                                            </MenuItem>
                                                            {PROPERTY_TYPES.map((type) => (
                                                                <MenuItem key={type.value} value={type.value} sx={textStyles}>
                                                                    {type.label}
                                                                </MenuItem>
                                                            ))}
                                                        </Select>
                                                    </Box>
                                                    <Box sx={{ width: '45%', mr: 2 }}>
                                                        <Typography sx={{ ...labelStyles, mb: 1 }}>Agent</Typography>
                                                        <Select
                                                            value={item.agent_id}
                                                            onChange={(e) => handleAgentChange(index, e.target.value)}
                                                            displayEmpty
                                                            fullWidth
                                                            sx={selectStyles}
                                                            MenuProps={{
                                                                PaperProps: {
                                                                    style: {
                                                                        maxHeight: 300,
                                                                    }
                                                                }
                                                            }}
                                                            disabled={!agentRotation}
                                                        >
                                                            <MenuItem value="" disabled sx={textStyles}>
                                                                Select Agent
                                                            </MenuItem>
                                                            {agentsList.map((agent) => (
                                                                <MenuItem key={agent.id} value={agent.id} sx={textStyles}>
                                                                    {agent.name}
                                                                </MenuItem>
                                                            ))}
                                                        </Select>
                                                    </Box>
                                                    <IconButton 
                                                        color="error" 
                                                        onClick={() => handleRemovePropertyTypeAgent(index)}
                                                        disabled={propertyTypeAgents.length === 1 || !agentRotation}
                                                        sx={{ color: '#ff3333', mt: 3 }}
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </Box>
                                            ))}

                                            <Box mt={3} mb={4}>
                                                <Button 
                                                    variant="outlined" 
                                                    startIcon={<AddIcon />}
                                                    onClick={handleAddPropertyTypeAgent}
                                                    disabled={!agentRotation}
                                                    sx={{ 
                                                        fontWeight: 600, 
                                                        fontSize: '14px',
                                                        borderWidth: '1px',
                                                        color: '#1976d2',
                                                        borderColor: '#1976d2',
                                                        textTransform: 'uppercase',
                                                        padding: '8px 16px'
                                                    }}
                                                >
                                                    Add Property Type Mapping
                                                </Button>
                                            </Box>
                                        </>
                                    )}

                                    <Box mt={4} display="flex" justifyContent="flex-end">
                                        <Button 
                                            variant="contained" 
                                            color="primary" 
                                            onClick={handleSubmit}
                                            disabled={isSubmitting}
                                            sx={{ 
                                                fontWeight: 700, 
                                                fontSize: '14px',
                                                padding: '10px 24px',
                                                textTransform: 'none'
                                            }}
                                        >
                                            {isSubmitting ? <CircularProgress size={24} /> : "Save Settings"}
                                        </Button>
                                    </Box>
                                </>
                            )}
                        </CardContent>
                    </Card>
                </Box>
            </section>

            <Snackbar 
                open={snackbar.open} 
                autoHideDuration={6000} 
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert 
                    onClose={handleCloseSnackbar} 
                    severity={snackbar.severity}
                    sx={{ 
                        '& .MuiAlert-message': { 
                            ...textStyles,
                            fontWeight: 600 
                        } 
                    }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default LeadRotation;
