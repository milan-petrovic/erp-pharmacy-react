import React, { useEffect, useState } from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { NotificationProps } from '../../constants/types';

export const Notification: React.FC<NotificationProps> = ({
    popupDuration = 5000,
    severity = 'success',
    message,
    onClose,
}: NotificationProps) => {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        setOpen(true);
    }, []);

    const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
        onClose();
    };
    return (
        <Snackbar
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
            }}
            open={open}
            autoHideDuration={popupDuration}
            onClose={handleClose}>
            <MuiAlert onClose={handleClose} severity={severity} elevation={6} variant="filled">
                {message}
            </MuiAlert>
        </Snackbar>
    );
};
