import { useQuery } from "@tanstack/react-query";
import { getAllLeadFollowUps } from "../../services/apiFollowUps";
import { format, isToday } from "date-fns";
import { useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";
import SectionTop from "../../ui/SectionTop";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import { Calendar as CalendarIcon, List as ListIcon } from 'lucide-react';
// MUI imports
import {
  Box, Container, Grid, Card, CardHeader, CardContent, Avatar, Typography, Chip, Stack, Button, ToggleButton, ToggleButtonGroup, FormControl, InputLabel, Select, MenuItem, FormControlLabel, Checkbox, Paper, CircularProgress
} from '@mui/material';

function UpcomingFollowups() {
    const navigate = useNavigate();
    const { data: allFollowups, isLoading } = useQuery({
        queryKey: ["allLeadFollowups"],
        queryFn: getAllLeadFollowUps,
    });
    const [selectedAgent, setSelectedAgent] = useState("all");
    const [showPast, setShowPast] = useState(false);
    const [viewMode, setViewMode] = useState("list"); // 'list' or 'calendar'
    const [calendarDate, setCalendarDate] = useState(new Date());

    // Filter and sort followups
    const filteredFollowups = useMemo(() => {
        let filtered = (allFollowups || []);
        if (!showPast) {
            filtered = filtered.filter(followup => {
                if (!followup.nextfollowupdate) return false;
                const followupDate = new Date(followup.nextfollowupdate);
                return followupDate > new Date();
            });
        }
        if (selectedAgent !== "all") {
            filtered = filtered.filter(f => f.agent_id === selectedAgent);
        }
        return filtered.sort((a, b) => new Date(a.nextfollowupdate) - new Date(b.nextfollowupdate));
    }, [allFollowups, selectedAgent, showPast]);

    // Get unique agents from followups
    const agents = useMemo(() => {
        const map = new Map();
        (allFollowups || []).forEach(f => {
            if (f.agent_id && !map.has(f.agent_id)) {
                map.set(f.agent_id, {
                    agent_id: f.agent_id,
                    agent_name: f.agent_name,
                    agent_avatar: f.agent_avatar,
                });
            }
        });
        return Array.from(map.values());
    }, [allFollowups]);

    const handleLeadClick = (leadId) => {
        navigate(`/leads/details/${leadId}`);
    };

    // Calendar: map date string to count of followups
    const calendarFollowupMap = useMemo(() => {
        const map = {};
        filteredFollowups.forEach(f => {
            const dateStr = format(new Date(f.nextfollowupdate), 'yyyy-MM-dd');
            map[dateStr] = (map[dateStr] || 0) + 1;
        });
        return map;
    }, [filteredFollowups]);

    // Calendar tile content: show a badge with count if there are followups
    const tileContent = ({ date, view }) => {
        if (view === 'month') {
            const dateStr = format(date, 'yyyy-MM-dd');
            const count = calendarFollowupMap[dateStr];
            if (count) {
                return (
                    <Box textAlign="center" mt={0.5}>
                        <Chip label={count} size="small" color="primary" />
                    </Box>
                );
            }
        }
        return null;
    };

    // Calendar tile class: highlight today and selected date
    const tileClassName = ({ date, view }) => {
        if (view === 'month') {
            if (isToday(date)) return 'react-calendar__tile--today';
            if (format(date, 'yyyy-MM-dd') === format(calendarDate, 'yyyy-MM-dd')) return 'react-calendar__tile--active';
        }
        return null;
    };

    // When clicking a date, show followups for that date
    const followupsForDate = (date) => {
        const dateStr = format(date, 'yyyy-MM-dd');
        return filteredFollowups.filter(f => format(new Date(f.nextfollowupdate), 'yyyy-MM-dd') === dateStr);
    };

    if (isLoading) return <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh"><CircularProgress /></Box>;

    return (
        <Container maxWidth="xl" sx={{ py: 0, px: 0, minHeight: '100vh', bgcolor: '#f5f6fa' }}>
            <SectionTop heading="Followup Manager">
                <Grid container spacing={2} alignItems="center">
                    <Grid item>
                        <FormControl size="small">
                            <InputLabel id="agentFilter-label">Agent</InputLabel>
                            <Select
                                labelId="agentFilter-label"
                                id="agentFilter"
                                value={selectedAgent}
                                label="Agent"
                                onChange={e => setSelectedAgent(e.target.value)}
                                sx={{ minWidth: 160 }}
                            >
                                <MenuItem value="all">All Agents</MenuItem>
                                {agents.map(agent => (
                                    <MenuItem key={agent.agent_id} value={agent.agent_id}>
                                        <Stack direction="row" alignItems="center" gap={1}>
                                            {agent.agent_avatar && <Avatar src={agent.agent_avatar} sx={{ width: 24, height: 24 }} />}
                                            {agent.agent_name}
                                        </Stack>
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item>
                        <FormControlLabel
                            control={<Checkbox checked={showPast} onChange={e => setShowPast(e.target.checked)} color="primary" />}
                            label="Show past followups"
                        />
                    </Grid>
                    <Grid item>
                        <ToggleButtonGroup
                            value={viewMode}
                            exclusive
                            onChange={(_, val) => val && setViewMode(val)}
                            size="small"
                        >
                            <ToggleButton value="list" aria-label="List View">
                                <ListIcon size={18} style={{ marginRight: 6 }} /> List
                            </ToggleButton>
                            <ToggleButton value="calendar" aria-label="Calendar View">
                                <CalendarIcon size={18} style={{ marginRight: 6 }} /> Calendar
                            </ToggleButton>
                        </ToggleButtonGroup>
                    </Grid>
                </Grid>
            </SectionTop>
            <Box sx={{ pt: 4, minHeight: '80vh' }}>
                {viewMode === 'list' ? (
                    <Box sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: '1fr 1fr 1fr' },
                        gap: 3,
                        alignItems: 'stretch',
                        alignContent: 'stretch',
                        minHeight: '80vh',
                    }}>
                        {filteredFollowups.length === 0 ? (
                            <Box gridColumn="1/-1" textAlign="center" mt={8}>
                                <img src="/icons/empty-state.svg" alt="No followups" style={{ width: 120, opacity: 0.7 }} />
                                <Typography variant="h6" color="text.secondary" mt={2}>No followups</Typography>
                            </Box>
                        ) : (
                            filteredFollowups.map((followup) => (
                                <Box key={followup.id} sx={{ height: '100%' }}>
                                    <Card
                                        sx={{
                                            cursor: 'pointer',
                                            borderRadius: 3,
                                            boxShadow: 3,
                                            transition: 'box-shadow 0.2s, transform 0.2s, border 0.2s',
                                            '&:hover': {
                                                boxShadow: 8,
                                                transform: 'translateY(-4px) scale(1.015)',
                                                border: '2px solid #6366f1',
                                            },
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            p: 0,
                                        }}
                                        onClick={() => handleLeadClick(followup.target_id)}
                                    >
                                        <CardHeader
                                            avatar={followup.agent_avatar ? <Avatar src={followup.agent_avatar} /> : <Avatar>{followup.agent_name?.[0] || '?'}</Avatar>}
                                            title={<Typography variant="subtitle1" fontWeight={700} noWrap>{followup.agent_name || "Unnamed Agent"}</Typography>}
                                            subheader={<Typography variant="body2" color="text.secondary" noWrap>{followup.nextfollowupdate ? format(new Date(followup.nextfollowupdate), "MMM dd, yyyy hh:mm a") : "No date"}</Typography>}
                                            sx={{ pt: 2, pb: 0, px: 2 }}
                                        />
                                        <CardContent sx={{ px: 2, py: 1.5, flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', overflow: 'hidden' }}>
                                            <Typography variant="caption" color="text.secondary" mb={1} display="block" noWrap>
                                                Lead ID: <b>{followup.target_id || 'N/A'}</b>
                                            </Typography>
                                            <Stack direction="row" spacing={1} mb={1.5} flexWrap="wrap" sx={{ overflow: 'hidden' }}>
                                                {followup.stage_data?.name && (
                                                    <Chip label={followup.stage_data.name} size="small" sx={{ bgcolor: '#6366f1', color: '#fff', fontWeight: 700, borderRadius: 1.5, px: 1.5, fontSize: 13, boxShadow: 1, maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis' }} />
                                                )}
                                                {followup.status_data?.name && (
                                                    <Chip label={followup.status_data.name} size="small" sx={{ bgcolor: '#6366f1', color: '#fff', fontWeight: 700, borderRadius: 1.5, px: 1.5, fontSize: 13, boxShadow: 1, maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis' }} />
                                                )}
                                                {followup.rating_data?.name && (
                                                    <Chip icon={<span style={{fontSize:16,marginRight:2, color:'#fff'}}>⭐</span>}
                                                        label={followup.rating_data.name}
                                                        size="small"
                                                        sx={{ bgcolor: '#6366f1', color: '#fff', fontWeight: 700, borderRadius: 1.5, px: 1.5, fontSize: 13, boxShadow: 1, maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis' }}
                                                    />
                                                )}
                                            </Stack>
                                            <Typography variant="body1" color="text.primary" fontWeight={600} mb={followup.comment ? 1 : 0} sx={{ fontSize: 16, minHeight: 24, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                {followup.text || <span style={{ color: '#aaa', fontStyle: 'italic' }}>No message</span>}
                                            </Typography>
                                            {followup.comment && (
                                                <Typography variant="body2" color="text.secondary" fontStyle="italic" mt={0.5} sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                    <b>Comment:</b> {followup.comment}
                                                </Typography>
                                            )}
                                            <Box display="flex" justifyContent="flex-end" mt="auto">
                                                <Button
                                                    variant="contained"
                                                    size="small"
                                                    color="primary"
                                                    sx={{ borderRadius: 2, fontWeight: 700, minWidth: 80, boxShadow: 'none', textTransform: 'none' }}
                                                    onClick={e => { e.stopPropagation(); /* TODO: action */ }}
                                                >
                                                    Change
                                                </Button>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Box>
                            ))
                        )}
                    </Box>
                ) : (
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={5}>
                            <Paper elevation={3} sx={{ p: 2 }}>
                                <Calendar
                                    onChange={setCalendarDate}
                                    value={calendarDate}
                                    tileContent={tileContent}
                                    tileClassName={tileClassName}
                                />
                            </Paper>
                        </Grid>
                        <Grid item xs={12} md={7}>
                            <Typography variant="h6" fontWeight={600} mb={2}>
                                Followups on <Box component="span" color="primary.main">{format(calendarDate, 'MMM dd, yyyy')}</Box>
                            </Typography>
                            {followupsForDate(calendarDate).length === 0 ? (
                                <Box textAlign="center" mt={4}>
                                    <img src="/icons/empty-state.svg" alt="No followups" style={{ width: 120, opacity: 0.7 }} />
                                    <Typography variant="h6" color="text.secondary" mt={2}>No followups for this date</Typography>
                                </Box>
                            ) : (
                                <Grid container spacing={2}>
                                    {followupsForDate(calendarDate).map(followup => (
                                        <Grid item xs={12} sm={6} key={followup.id}>
                                            <Card
                                                sx={{
                                                    cursor: 'pointer',
                                                    borderRadius: 3,
                                                    boxShadow: 3,
                                                    p: 1.5,
                                                    transition: 'box-shadow 0.2s, transform 0.2s, border 0.2s',
                                                    '&:hover': {
                                                        boxShadow: 8,
                                                        transform: 'translateY(-4px) scale(1.015)',
                                                        border: '2px solid #6366f1',
                                                    },
                                                    minHeight: 240,
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    justifyContent: 'space-between',
                                                }}
                                                onClick={() => handleLeadClick(followup.target_id)}
                                            >
                                                <CardHeader
                                                    avatar={followup.agent_avatar ? <Avatar src={followup.agent_avatar} /> : <Avatar>{followup.agent_name?.[0] || '?'}</Avatar>}
                                                    title={<Typography variant="subtitle1" fontWeight={700}>{followup.agent_name || "Unnamed Agent"}</Typography>}
                                                    subheader={<Typography variant="body2" color="text.secondary">{followup.nextfollowupdate ? format(new Date(followup.nextfollowupdate), "MMM dd, yyyy hh:mm a") : "No date"}</Typography>}
                                                    sx={{ pb: 0 }}
                                                />
                                                <CardContent sx={{ pt: 1, pb: '8px !important' }}>
                                                    <Typography variant="caption" color="text.secondary" mb={1} display="block">
                                                        Lead ID: <b>{followup.target_id || 'N/A'}</b>
                                                    </Typography>
                                                    <Stack direction="row" spacing={1} mb={1.5} flexWrap="wrap">
                                                        {followup.stage_data?.name && (
                                                            <Chip label={followup.stage_data.name} size="small" sx={{ bgcolor: '#6366f1', color: '#fff', fontWeight: 700, borderRadius: 1.5, px: 1.5, fontSize: 13, boxShadow: 1, maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis' }} />
                                                        )}
                                                        {followup.status_data?.name && (
                                                            <Chip label={followup.status_data.name} size="small" sx={{ bgcolor: '#6366f1', color: '#fff', fontWeight: 700, borderRadius: 1.5, px: 1.5, fontSize: 13, boxShadow: 1, maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis' }} />
                                                        )}
                                                        {followup.rating_data?.name && (
                                                            <Chip icon={<span style={{fontSize:16,marginRight:2, color:'#fff'}}>⭐</span>}
                                                                label={followup.rating_data.name}
                                                                size="small"
                                                                sx={{ bgcolor: '#6366f1', color: '#fff', fontWeight: 700, borderRadius: 1.5, px: 1.5, fontSize: 13, boxShadow: 1, maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis' }}
                                                            />
                                                        )}
                                                    </Stack>
                                                    <Typography variant="body1" color="text.primary" fontWeight={600} mb={followup.comment ? 1 : 0} sx={{ fontSize: 16, minHeight: 24 }}>
                                                        {followup.text || <span style={{ color: '#aaa', fontStyle: 'italic' }}>No message</span>}
                                                    </Typography>
                                                    {followup.comment && (
                                                        <Typography variant="body2" color="text.secondary" fontStyle="italic" mt={0.5}>
                                                            <b>Comment:</b> {followup.comment}
                                                        </Typography>
                                                    )}
                                                    <Box display="flex" justifyContent="flex-end" mt={2}>
                                                        <Button
                                                            variant="contained"
                                                            size="small"
                                                            color="primary"
                                                            sx={{ borderRadius: 2, fontWeight: 700, minWidth: 80, boxShadow: 'none', textTransform: 'none' }}
                                                            onClick={e => { e.stopPropagation(); /* TODO: action */ }}
                                                        >
                                                            Change
                                                        </Button>
                                                    </Box>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    ))}
                                </Grid>
                            )}
                        </Grid>
                    </Grid>
                )}
            </Box>
        </Container>
    );
}

export default UpcomingFollowups; 