import { NotificationProps, Pacijent, Recept } from '../../constants/types';
import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { deleteReceptById, getAllRecepti } from '../../service/domain/ReceptiService';
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
import { getDateAsString, getDateTimeAsString } from '../../constants/AppUtils';
import { deletePacijent, getAllPacijenti } from '../../service/domain/PacijentiService';
import { Notification } from '../../components/Notification/Notification';
import { AxiosError } from 'axios';

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

export const ReceptiContainer: React.FC = () => {
    const classes = useStyles();
    const [recepti, setRecepti] = useState<Recept[]>();
    const [pacijenti, setPacijenti] = useState<Pacijent[]>();
    const [notification, setNotification] = useState<NotificationProps | undefined>(undefined);
    const location = useLocation();
    const history = useHistory();
    const [dialog, setDialog] = useState<{ open: boolean; recept: Recept | null }>();

    useEffect(() => {
        getRecepti();
    }, [pacijenti]);

    const getRecepti = () => {
        getAllRecepti()
            .then(response => {
                setRecepti(response.data);
            })
            .catch(error => console.log(error));
    };

    useEffect(() => {
        getAllPacijenti()
            .then(response => setPacijenti(response.data))
            .catch(error => console.log(error));
    }, []);

    useEffect(() => {
        if (location && location.state) {
            const pushedNotification = location.state as NotificationProps;
            setNotification({ ...pushedNotification, onClose: () => setNotification(undefined) });
        }
    }, [location]);

    const handleOpenDialog = (recept: Recept) => {
        setDialog({ open: true, recept: recept });
    };

    const handleCloseDialog = () => {
        setDialog({ open: false, recept: null });
    };

    const handleOnDelete = (receptId: number) => {
        deleteReceptById(receptId)
            .then(() => {
                setNotification({
                    message: `Uspjesno obrisan recept`,
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
                        message: `Greska prilikom brisanja recepta}`,
                        severity: 'error',
                        onClose: () => setNotification(undefined),
                    });
                    console.error(error.response?.data);
                }
            })
            .finally(() => {
                getRecepti();
                setDialog({ open: false, recept: null });
            });
    };

    return (
        <Container component="main" maxWidth="xl">
            <CssBaseline />
            {dialog && dialog.open && (
                <Dialog
                    open={dialog.open}
                    onClose={handleCloseDialog}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description">
                    <DialogTitle id="alert-dialog-title">Potvrda brisanja recepta</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            {`Da li ste sigurni da zelite obrisati recept?`}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            size="large"
                            onClick={() => handleOnDelete(dialog?.recept?.receptId!)}
                            color="secondary">
                            Potvrdi
                        </Button>
                        <Button size="large" onClick={() => handleCloseDialog()}>
                            Odustani
                        </Button>
                    </DialogActions>
                </Dialog>
            )}
            {notification && (
                <Notification
                    popupDuration={notification?.popupDuration}
                    message={notification?.message}
                    onClose={notification?.onClose}
                    severity={notification?.severity}
                />
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
                            to={AppRoutes.ReceptiNew}>
                            Dodaj
                        </Button>
                    </Grid>
                </Grid>
                <TableContainer>
                    <Table className={classes.table} aria-label="simple-table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Sadrzaj</TableCell>
                                <TableCell>Datum izdavanja</TableCell>
                                <TableCell>Naziv ustanove</TableCell>
                                <TableCell>Pacijent</TableCell>
                                <TableCell>Akcije</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {recepti?.map((recept, idx) => {
                                const datumIzdvanja = getDateAsString(recept.datumIzdavanja);
                                let imePrezimePacijenta;

                                pacijenti?.forEach(pacijent => {
                                    if (pacijent.pacijentId === recept.pacijentId) {
                                        imePrezimePacijenta = pacijent.ime + ' ' + pacijent.prezime;
                                    }
                                });

                                return (
                                    <TableRow key={idx}>
                                        <TableCell>{recept.sadrzaj}</TableCell>
                                        <TableCell align="left">{datumIzdvanja}</TableCell>
                                        <TableCell align="left">{recept.nazivUstanove}</TableCell>
                                        <TableCell align="left">{imePrezimePacijenta}</TableCell>
                                        <TableCell align="left">
                                            <IconButton
                                                aria-label="Edit category"
                                                color="secondary"
                                                size="small"
                                                onClick={() => history.push(AppRoutes.Recepti + `/${recept.receptId}`)}>
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton
                                                aria-label="Delete category"
                                                size="small"
                                                onClick={() => handleOpenDialog(recept)}>
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
