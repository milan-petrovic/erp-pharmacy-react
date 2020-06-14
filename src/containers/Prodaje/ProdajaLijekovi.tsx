import React, { useEffect, useState } from 'react';
import { Lijek, NotificationProps, Racun } from '../../constants/types';
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
import { Notification } from '../../components/Notification/Notification';
import SendIcon from '@material-ui/icons/Send';
import { Link, useHistory } from 'react-router-dom';
import { AppRoutes } from '../../constants/routes/AppRoutes';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import { makeStyles } from '@material-ui/core/styles';
import { getLastRacun, postProdaja } from '../../service/domain/ProdajeService';
import { notifyOnReject } from '../../constants/AppUtils';
import { getAllLijekovi } from '../../service/domain/LijekoviService';

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

export const ProdajaLijekovi: React.FC<NotificationProps> = props => {
    const classes = useStyles();
    const [notification, setNotification] = useState<NotificationProps | undefined>(undefined);
    const [lijekovi, setLijekovi] = useState<Lijek[]>();
    const [poslednjiRacun, setPoslednjiRacun] = useState<Racun>();
    const history = useHistory();

    useEffect(() => {
        getLastRacun()
            .then(response => setPoslednjiRacun(response.data))
            .catch(notifyOnReject(setNotification));
    }, []);

    useEffect(() => {
        getLijekovi();
    }, [poslednjiRacun]);

    const getLijekovi = () => {
        getAllLijekovi()
            .then(response => setLijekovi(response.data))
            .catch(notifyOnReject(setNotification));
    };

    const handleOnClick = (lijekId: number, naziv: string | undefined) => {
        postProdaja({
            lijek: lijekId,
            racun: poslednjiRacun?.racunId!,
        })
            .then(response => {
                setNotification({
                    message: `Uspjesno dodan lijek  ${naziv} na racun`,
                    onClose: () => setNotification(undefined),
                });
            })
            .catch(notifyOnReject(setNotification))
            .finally(() => {
                getLijekovi();
            });
    };

    const handleZavrsetak = () => {
        history.push(AppRoutes.Racuni, {
            message: `Uspjesno zavrsena prodaja`,
            popupDuration: 5000,
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
            <Paper className={classes.paper}>
                <Grid container>
                    <Grid item xs={12} sm={9}></Grid>
                    <Grid item xs={12} sm={3}>
                        <Button
                            color="secondary"
                            variant="contained"
                            className={classes.button}
                            endIcon={<SendIcon />}
                            onClick={() => handleZavrsetak()}>
                            Zavrsi prodaju
                        </Button>
                    </Grid>
                </Grid>
                <TableContainer>
                    <Table className={classes.table} aria-label="simple-table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Naziv</TableCell>
                                <TableCell>Opis</TableCell>
                                <TableCell>Kolicina</TableCell>
                                <TableCell>Cijena</TableCell>
                                <TableCell>Prodaj</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {lijekovi?.map((lijek, idx) => {
                                return (
                                    <TableRow key={idx}>
                                        <TableCell>{lijek.naziv}</TableCell>
                                        <TableCell align="left">{lijek.opis}</TableCell>
                                        <TableCell align="left">{lijek.kolicina}</TableCell>
                                        <TableCell align="left">{lijek.cijena}</TableCell>
                                        <TableCell align="left">
                                            <IconButton
                                                aria-label="Edit category"
                                                color="secondary"
                                                size="small"
                                                onClick={() => handleOnClick(lijek.lijekId!, lijek.naziv)}>
                                                <AddShoppingCartIcon />
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
