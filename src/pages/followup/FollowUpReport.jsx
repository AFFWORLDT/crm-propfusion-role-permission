import { useEffect, useMemo, useState } from "react";
import {
    Box,
    Card,
    CardContent,
    Typography,
    Grid,
    LinearProgress,
    Paper,
    Divider,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
} from "@mui/material";
import {
    Assignment as AssignmentIcon,
    Warning as WarningIcon,
    Schedule as ScheduleIcon,
    BarChart as BarChartIcon,
    FilterList as FilterListIcon,
} from "@mui/icons-material";
import { toast } from "react-toastify";
import SectionTop from "../../ui/SectionTop";
import { useFollowUpsReports } from "../../features/followUps/useFollowUpsReports";
import Spinner from "../../ui/Spinner";
import useStaff from "../../features/admin/staff/useStaff";
import LeadReportInTable from "./LeadReportInTable";
import FollowUpReportFilter from "../../features/followUps/FollowUpReportFilter";
import ToggleButton from "../../ui/ToggleButton";
import FollowUpTimeFilter from "../../features/followUps/FollowUpTimeFilter";
import { useSearchParams } from "react-router-dom";

function FollowUpReport() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [selectedAgentId, setSelectedAgentId] = useState(
        searchParams.get("agent_id") || ""
    );
    const {
        followUpsReports: data,
        isLoading,
        error,
    } = useFollowUpsReports(selectedAgentId);
    const { data: staffData, isLoading: staffLoading } = useStaff();

    useEffect(() => {
        if (error) {
            toast.error(error.message);
        }
    }, [error]);

    const handleAgentChange = (event) => {
        const agentId = event.target.value;
        setSelectedAgentId(agentId);

        if (agentId) {
            searchParams.set("agent_id", agentId);
        } else {
            searchParams.delete("agent_id");
        }
        setSearchParams(searchParams);
    };

    const handleReset = () => {
        setSelectedAgentId("");
        searchParams.delete("agent_id");
        setSearchParams(searchParams);
    };

    const maxStageCount = useMemo(() => {
        if (!data?.leads_by_stage) return 0;
        return Math.max(...Object.values(data.leads_by_stage));
    }, [data?.leads_by_stage]);

    if (isLoading) return <Spinner type={"fullPage"} />;

    const progressColors = [
        "error.main", // Red
        "warning.main", // Orange
        "#FFD700", // Yellow
        "success.main", // Green
        "info.main", // Blue
        "primary.main", // Blue
        "secondary.main", // Purple
        "#DC2626", // Pink
    ];

    const statsCards = [
        {
            title: "Today's Follow-ups",
            value: data?.today_count || 0,
            subtext: "Due today",
            borderColor: "success.main",
            icon: <AssignmentIcon />,
        },
        {
            title: "Overdue",
            value: data?.overdue_count || 0,
            subtext: "Past due date",
            borderColor: "error.main",
            icon: <WarningIcon />,
        },
        {
            title: "Upcoming",
            value: data?.upcoming_count || 0,
            subtext: "Scheduled ahead",
            borderColor: "primary.main",
            icon: <ScheduleIcon />,
        },
        {
            title: "Total Follow-ups",
            value: data?.total_followups || 0,
            subtext: "All time",
            borderColor: "secondary.main",
            icon: <BarChartIcon />,
        },
    ];

    return (
        <div className="sectionContainer">
            <SectionTop heading="Follow Up Report" />

            <section className="sectionStyles">
                {/* Agent Filter */}
                <Box
                    sx={{
                        mb: 2,
                        display: "flex",
                        gap: 1,
                        alignItems: "center",
                        justifyContent: "flex-end",
                        backgroundColor: "#f0f0f0",
                        p: 1,
                        borderRadius: 1,
                    }}
                >
                    <FormControl
                        size="small"
                        sx={{
                            minWidth: 200,
                            backgroundColor: "white",
                            borderRadius: 1,
                            fontSize: "1.8rem",
                        }}
                    >
                        <InputLabel>Filter by Agent</InputLabel>
                        <Select
                            value={selectedAgentId}
                            label="Filter by Agent"
                            onChange={handleAgentChange}
                            disabled={staffLoading}
                        >
                            {staffData?.map((agent) => (
                                <MenuItem
                                    key={agent.id}
                                    value={agent.id.toString()}
                                >
                                    {agent.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    {selectedAgentId && (
                        <Button size="small" onClick={handleReset}>
                            Reset
                        </Button>
                    )}
                </Box>
                <Box>
                    {/* Stats Cards */}
                    <Grid container spacing={2} sx={{ mb: 4 }}>
                        {statsCards.map((card, index) => (
                            <Grid item xs={12} sm={6} md={3} lg={2} key={index}>
                                <Card
                                    sx={{
                                        borderTop: 3,
                                        borderTopColor: card.borderColor,
                                        transition:
                                            "box-shadow 0.2s ease-in-out",
                                        minWidth: { xs: 350, md: 250 },
                                        width: { xs: "100%", md: "100%" },
                                        height: "auto",
                                        "&:hover": {
                                            boxShadow: 3,
                                        },
                                    }}
                                >
                                    <CardContent sx={{ p: 3 }}>
                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "space-between",
                                                mb: 1,
                                            }}
                                        >
                                            <Typography
                                                variant="body1"
                                                sx={{
                                                    fontWeight: 500,
                                                    color: "text.secondary",
                                                    fontSize: "1.3rem",
                                                }}
                                            >
                                                {card.title}
                                            </Typography>
                                            <Box
                                                sx={{
                                                    opacity: 0.7,
                                                    color: "text.secondary",
                                                }}
                                            >
                                                {card.icon}
                                            </Box>
                                        </Box>
                                        <Typography
                                            variant="h3"
                                            sx={{
                                                fontWeight: 700,
                                                color: "text.primary",
                                                lineHeight: 1,
                                                my: 1,
                                            }}
                                        >
                                            {card.value.toLocaleString()}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color: "text.secondary",
                                                fontSize: "1.2rem",
                                            }}
                                        >
                                            {card.subtext}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>

                    {/* Leads by Stage */}
                    <Paper
                        sx={{
                            p: 2,
                            borderRadius: 1,
                            boxShadow: 1,
                        }}
                    >
                        <Typography
                            variant="h5"
                            sx={{
                                fontWeight: 600,
                                color: "text.primary",
                                mb: 2,
                                pb: 1,
                                borderBottom: 1,
                                borderColor: "divider",
                            }}
                        >
                            Leads by Stage
                        </Typography>

                        {data?.leads_by_stage &&
                        Object.keys(data.leads_by_stage).length > 0 ? (
                            <Box>
                                {Object.entries(data.leads_by_stage)
                                    .sort(([, a], [, b]) => b - a)
                                    .map(([stageName, count], index) => {
                                        const percentage =
                                            maxStageCount > 0
                                                ? (count / maxStageCount) * 100
                                                : 0;

                                        return (
                                            <Box key={stageName}>
                                                <Box
                                                    sx={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent:
                                                            "space-between",
                                                        py: 1,
                                                        px: { xs: 0, sm: 1 },
                                                        transition:
                                                            "background-color 0.15s ease-in-out",
                                                        borderRadius: 1,
                                                        "&:hover": {
                                                            backgroundColor:
                                                                "action.hover",
                                                        },
                                                    }}
                                                >
                                                    <Box
                                                        sx={{
                                                            display: "flex",
                                                            alignItems:
                                                                "center",
                                                            flex: 1,
                                                            minWidth: 0,
                                                        }}
                                                    >
                                                        <Typography
                                                            sx={{
                                                                fontWeight: 500,
                                                                color: "text.primary",
                                                                mr: 2,
                                                                minWidth: {
                                                                    xs: "auto",
                                                                    sm: 180,
                                                                },
                                                                textTransform:
                                                                    "capitalize",
                                                                fontSize:
                                                                    "1.4rem",
                                                            }}
                                                        >
                                                            {stageName}
                                                        </Typography>
                                                        <Box
                                                            sx={{
                                                                flex: 1,
                                                                mr: 2,
                                                            }}
                                                        >
                                                            <LinearProgress
                                                                variant="determinate"
                                                                value={
                                                                    percentage
                                                                }
                                                                sx={{
                                                                    height: 6,
                                                                    borderRadius: 1,
                                                                    backgroundColor:
                                                                        "divider",
                                                                    "& .MuiLinearProgress-bar":
                                                                        {
                                                                            backgroundColor:
                                                                                progressColors[
                                                                                    index %
                                                                                        progressColors.length
                                                                                ],
                                                                            borderRadius: 1,
                                                                        },
                                                                }}
                                                            />
                                                        </Box>
                                                    </Box>
                                                    <Box
                                                        sx={{
                                                            backgroundColor:
                                                                "action.hover",
                                                            px: 1,
                                                            py: 0.5,
                                                            borderRadius: 1,
                                                            border: 1,
                                                            borderColor:
                                                                "divider",
                                                            minWidth: 50,
                                                            textAlign: "right",
                                                        }}
                                                    >
                                                        <Typography
                                                            sx={{
                                                                fontWeight: 600,
                                                                color: "text.primary",
                                                                fontSize:
                                                                    "1.3rem",
                                                            }}
                                                        >
                                                            {count.toLocaleString()}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                                {index <
                                                    Object.entries(
                                                        data.leads_by_stage
                                                    ).length -
                                                        1 && <Divider />}
                                            </Box>
                                        );
                                    })}
                            </Box>
                        ) : (
                            <Box
                                sx={{
                                    textAlign: "center",
                                    py: 6,
                                    px: 2,
                                    color: "text.secondary",
                                }}
                            >
                                <Box
                                    sx={{
                                        fontSize: "3rem",
                                        mb: 2,
                                        opacity: 0.5,
                                    }}
                                >
                                    📊
                                </Box>
                                <Typography
                                    variant="h5"
                                    sx={{
                                        color: "text.secondary",
                                        m: 0,
                                    }}
                                >
                                    No leads data available
                                </Typography>
                            </Box>
                        )}
                    </Paper>
                </Box>

                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        width: "100%",
                        mt: 3,
                        mb: 2,
                    }}
                >
                    <ToggleButton>
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                width: "100%",
                                flexWrap: "wrap",
                                gap: 2,
                            }}
                        >
                            {/* Time Filter */}
                            <Box>
                                <FollowUpTimeFilter />
                            </Box>
                            <ToggleButton.Button
                                label="Filters"
                                icon={<FilterListIcon />}
                                sx={{
                                    backgroundColor: "grey.100",
                                    px: 2,
                                    borderRadius: 1,
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                    border: 1,
                                    borderColor: "grey.300",
                                }}
                            />
                        </Box>

                        <ToggleButton.Content>
                            <Box
                                sx={{
                                    p: 3,
                                    borderTop: 1,
                                    borderColor: "grey.200",
                                    bgcolor: "transparent",
                                    mt: 1.25,
                                }}
                            >
                                <FollowUpReportFilter />
                            </Box>
                        </ToggleButton.Content>
                    </ToggleButton>
                </Box>

                <div>
                    <LeadReportInTable />
                </div>
            </section>
        </div>
    );
}

export default FollowUpReport;
