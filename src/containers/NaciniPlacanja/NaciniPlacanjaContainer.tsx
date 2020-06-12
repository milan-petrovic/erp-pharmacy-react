import { makeStyles } from '@material-ui/core/styles';
import React, { useEffect, useState } from 'react';
import {
    Button,
    Container,
    CssBaseline,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Grid,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { AppRoutes } from '../../constants/routes/AppRoutes';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { deleteNaciniPlacanja, getAllNaciniPlacanja } from '../../service/domain/NaciniPlacanjaService';
import { Kategorija, NacinPlacanja, NotificationProps } from '../../constants/types';
import { AxiosError } from 'axios';
import { Notification } from '../../components/Notification/Notification';

const useStyles = makeStyles(theme => ({
    table: {
        minWidth: 650,
    },
    paper: {
        marginTop: theme.spacing(4),
        marginBottom: theme.spacing(4),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    button: {
        float: 'right',
        margin: theme.spacing(2),
    },
}));

export const NaciniPlacanjaContainer: React.FC = () => {
    const classes = useStyles();
    const [notification, setNotification] = useState<NotificationProps | undefined>(undefined);
    const location = useLocation();
    const history = useHistory();

    const [naciniPlacanja, setNaciniPlacanja] = useState();
    const [dialog, setDialog] = useState<{ open: boolean; nacinPlacanja: NacinPlacanja | null }>();

    useEffect(() => {
        getNaciniPlacanja();
    }, []);

    useEffect(() => {
        if (location && location.state) {
            const pushedNotification = location.state as NotificationProps;
            setNotification({ ...pushedNotification, onClose: () => setNotification(undefined) });
        }
    }, [location]);

    const getNaciniPlacanja = () => {
        getAllNaciniPlacanja()
            .then(response => {
                setNaciniPlacanja(response.data);
            })
            .catch(error => console.log(error));
    };

    const handleOnDelete = (nacinPlacanjaId: number, naziv: string | undefined) => {
        deleteNaciniPlacanja(nacinPlacanjaId)
            .then(() => {
                setNotification({
                    message: `Uspjesno obrisan nacin placanja ${naziv}`,
                    onClose: () => setNotification(undefined),
                });
            })
            .catch((error: AxiosError) => {
                const errors = error.response?.data.errors;
                if (errors && errors.length > 0) {
                    setNotification({
                        message: errors[0],
                        severity: 'error',
                        onClose: () => setNotification(undefined),
                    });
                } else {
                    setNotification({
                        message: `Greska prilikom brisanja nacina placanja ${naziv}`,
                        severity: 'error',
                        onClose: () => setNotification(undefined),
                    });
                    console.error(error.response?.data);
                }
            })
            .finally(() => {
                getNaciniPlacanja();
                setDialog({ open: false, nacinPlacanja: null });
            });
    };

    const handleOpenDialog = (nacinPlacanja: NacinPlacanja) => {
        setDialog({ open: true, nacinPlacanja: nacinPlacanja });
    };

    const handleCloseDialog = () => {
        setDialog({ open: false, nacinPlacanja: null });
    };

    return (
        <Container component="main" maxWidth="xl">
            <CssBaseline />
            {notification && (
                <Notification
                    popupDuration={notification?.popupDuration}
                    message={notification?.message}
                    onClose={notification?.onClose}
                    severity={notification?.severity}
                />
            )}
            {dialog && dialog.open && (
                <Dialog
                    open={dialog.open}
                    onClose={handleCloseDialog}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description">
                    <DialogTitle id="alert-dialog-title">Potvrda brisanja nacina placanja</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            {`Da li ste sigurni da zelite obrisati kategoriju ${dialog?.nacinPlacanja?.naziv}?`}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            size="large"
                            onClick={() =>
                                handleOnDelete(dialog?.nacinPlacanja?.nacinPlacanjaId!, dialog?.nacinPlacanja?.naziv)
                            }
                            color="secondary">
                            Potvrdi
                        </Button>
                        <Button size="large" onClick={() => handleCloseDialog()}>
                            Odustani
                        </Button>
                    </DialogActions>
                </Dialog>
            )}
            <Paper className={classes.paper}>
                <Grid container>
                    <Grid item xs={12} sm={9}></Grid>
                    <Grid item xs={12} sm={3}>
                        <Button
                            color="secondary"
                            variant="outlined"
                            className={classes.button}
                            startIcon={<AddIcon />}
                            component={Link}
                            to={AppRoutes.NaciniPlacanjaNew}>
                            Dodaj
                        </Button>
                    </Grid>
                </Grid>
                <TableContainer>
                    <Table className={classes.table} aria-label="simple-table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Naziv</TableCell>
                                <TableCell>Opis</TableCell>
                                <TableCell>Akcije</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {naciniPlacanja?.map((nacinPlacanja, idx) => {
                                return (
                                    <TableRow key={idx}>
                                        <TableCell>{nacinPlacanja.naziv}</TableCell>
                                        <TableCell align="left">{nacinPlacanja.opis}</TableCell>
                                        <TableCell align="left">
                                            <IconButton
                                                aria-label="Edit category"
                                                color="secondary"
                                                size="small"
                                                onClick={() =>
                                                    history.push(
                                                        AppRoutes.NaciniPlacanja + `/${nacinPlacanja.nacinPlacanjaId}`,
                                                    )
                                                }>
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton
                                                aria-label="Delete category"
                                                size="small"
                                                onClick={() => handleOpenDialog(nacinPlacanja)}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </Container>
    );
};
