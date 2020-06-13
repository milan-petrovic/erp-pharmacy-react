import { format, parseISO } from 'date-fns';
import { NotificationProps } from './types';
import { AxiosError } from 'axios';
import { createMuiTheme } from '@material-ui/core';

export const drawerWidth = 240;

export enum Roles {
    ADMIN = 'admin',
    FARMACEUT = 'farmaceut',
}

export const requiredMessage = 'Obavezno polje';
export const lengthConstraintMessage = (length: number) => `Mora da sadrzi najmanje ${length} karaktera`;

export const getDateAsString = (date?: Date) => {
    if (date) {
        return format(parseISO(date.toString()), 'dd/MM/yyyy');
    } else {
        return date;
    }
};

export const getDateTimeAsString = (date?: Date) => {
    if (date) {
        return format(parseISO(date.toString()), 'dd/MM/yyyy HH:mm');
    } else {
        return date;
    }
};

export const notifyOnReject = (
    setNotification: (value: NotificationProps | undefined) => void,
    defaultErrorMessage = 'Greska na serveru. Provjerite da li su podaci dobri.',
) => {
    return (error: AxiosError<{ errors?: string[] }>) => {
        const errors = error.response?.data?.errors;
        if (errors && errors.length > 0) {
            setNotification({
                message: errors[0],
                severity: 'error',
                onClose: () => setNotification(undefined),
            });
        } else {
            setNotification({
                message: defaultErrorMessage,
                severity: 'error',
                onClose: () => setNotification(undefined),
            });
        }
    };
};

export const theme = createMuiTheme({
    palette: {
        type: 'dark',
        primary: {
            main: '#283943',
            dark: '#112430',
        },
        secondary: {
            main: '#09d989',
            light: '#00000029',
        },
        background: {
            default: '#112430',
            paper: '#283943',
        },
    },
});
