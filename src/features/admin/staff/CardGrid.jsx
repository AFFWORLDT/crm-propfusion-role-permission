import { useEffect } from "react";
import CustomCard from "../../../ui/CustomCard";
import useStaff from "./useStaff";
import useRoles from "../teams/useRoles";
import Grid from '@mui/material/Grid';
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

const CardGrid = () => {
    useRoles();

    const { isLoading, data, error } = useStaff();
    const [open, setOpen] = useState(false);
    const theme = useTheme();
    const isXs = useMediaQuery(theme.breakpoints.only('xs'));

    useEffect(() => {
        if (error) setOpen(true);
    }, [error]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[40vh]">
                <CircularProgress size={60} color="primary" />
            </div>
        );
    }

    return (
        <>
            <Grid 
                {...(!isXs && { container: true })} 
                spacing={3} 
                justifyContent="center"
            >
                {data.map((data, index) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={index} display="flex" justifyContent="center" alignItems="center">
                        <CustomCard staffData={data} />
                    </Grid>
                ))}
            </Grid>
            <Snackbar open={open} autoHideDuration={6000} onClose={() => setOpen(false)}>
                <Alert onClose={() => setOpen(false)} severity="error" sx={{ width: '100%' }}>
                    {error?.message || 'An error occurred'}
                </Alert>
            </Snackbar>
        </>
    );
};

export default CardGrid;
