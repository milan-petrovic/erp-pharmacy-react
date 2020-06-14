import React, { useEffect, useState } from 'react';
import { deleteFarmaceutById, getAllFarmaceuti } from '../../service/domain/FarmaceutiService';
import { Farmaceut, Kategorija, NotificationProps } from '../../constants/types';
import { makeStyles } from '@material-ui/core/styles';
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
    Typography,
} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';

import { Link, useHistory, useLocation } from 'react-router-dom';
import { AppRoutes } from '../../constants/routes/AppRoutes';
import { Notification } from '../../components/Notification/Notification';
import { deleteKategorija } from '../../service/domain/KategorijeService';
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

export const FarmaceutiContainer: React.FC = () => {
    const classes = useStyles();
    const [farmaceuti, setFarmaceuti] = useState<Farmaceut[]>();
    const history = useHistory();
    const location = useLocation();
    const [dialog, setDialog] = useState<{ open: boolean; farmaceut: Farmaceut | null }>();
    const [notification, setNotification] = useState<NotificationProps | undefined>(undefined);

    useEffect(() => {
        getFarmaceuti();
    }, []);

    const getFarmaceuti = () => {
        getAllFarmaceuti()
            .then(response => {
                console.log(response);
                setFarmaceuti(response.data);
            })
            .catch(error => console.log(error));
    };

    const handleOpenDialog = (farmaceut: Farmaceut) => {
        setDialog({ open: true, farmaceut: farmaceut });
    };

    const handleCloseDialog = () => {
        setDialog({ open: false, farmaceut: null });
    };

    const handleOnDelete = (farmaceutId: number, username: string | undefined) => {
        deleteFarmaceutById(farmaceutId)
            .then(() => {
                setNotification({
                    message: `Uspjesno obrisan farmaceut ${username}`,
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
                        message: `Greska prilikom brisanja farmaceuta ${username}`,
                        severity: 'error',
                        onClose: () => setNotification(undefined),
                    });
                    console.error(error.response?.data);
                }
            })
            .finally(() => {
                getFarmaceuti();
                setDialog({ open: false, farmaceut: null });
            });
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
                    <DialogTitle id="alert-dialog-title">Potvrda brisanja farmaceuta</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            {`Da li ste sigurni da zelite obrisati farmaceuta ${dialog?.farmaceut?.ime} ${dialog?.farmaceut?.prezime}?`}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            size="large"
                            onClick={() => handleOnDelete(dialog?.farmaceut?.farmaceutId!, dialog?.farmaceut?.username)}
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
                            to={AppRoutes.FarmaceutiNew}>
                            Dodaj
                        </Button>
                    </Grid>
                </Grid>
                <TableContainer>
                    <Table className={classes.table} aria-label="simple-table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Username</TableCell>
                                <TableCell>E-Mail</TableCell>
                                <TableCell>Ime</TableCell>
                                <TableCell>Prezime</TableCell>
                                <TableCell>Broj dozvole</TableCell>
                                <TableCell>Akcije</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {farmaceuti?.map((farmaceut, idx) => {
                                return (
                                    <TableRow key={idx}>
                                        <TableCell>{farmaceut.username}</TableCell>
                                        <TableCell align="left">{farmaceut.email}</TableCell>
                                        <TableCell align="left">{farmaceut.ime}</TableCell>
                                        <TableCell align="left">{farmaceut.prezime}</TableCell>
                                        <TableCell align="left">{farmaceut.brojDozvole}</TableCell>
                                        <TableCell align="left">
                                            <IconButton
                                                aria-label="Edit category"
                                                color="secondary"
                                                size="small"
                                                onClick={() =>
                                                    history.push(AppRoutes.Farmaceuti + `/${farmaceut.farmaceutId}`)
                                                }>
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton
                                                aria-label="Delete category"
                                                size="small"
                                                onClick={() => handleOpenDialog(farmaceut)}>
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
