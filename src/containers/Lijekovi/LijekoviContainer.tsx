import React, { useContext, useEffect, useState } from 'react';
import { deleteLijek, getAllLijekovi, pretragaLijek } from '../../service/domain/LijekoviService';
import { Kategorija, Lijek, NacinPlacanja, NotificationProps } from '../../constants/types';
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
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { AppRoutes } from '../../constants/routes/AppRoutes';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { getAllKategorije, getKategorijaById } from '../../service/domain/KategorijeService';
import { Notification } from '../../components/Notification/Notification';
import { AxiosError, AxiosResponse } from 'axios';
import { UserContext, UserContextProvider } from '../../service/providers/UserContextProvider';
import SearchIcon from '@material-ui/icons/Search';
import LoopIcon from '@material-ui/icons/Loop';

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

export const LijekoviContainer: React.FC = () => {
    const classes = useStyles();
    const [notification, setNotification] = useState<NotificationProps | undefined>(undefined);
    const [lijekovi, setLijekovi] = useState<Lijek[]>();
    const [kategorije, setKategorije] = useState<Kategorija[]>();
    const [dialog, setDialog] = useState<{ open: boolean; lijek: Lijek | null }>();
    const location = useLocation();
    const history = useHistory();
    const [kljucPretrage, setKljucPretrage] = useState<string>('nazivLijeka');
    const [vrijednostPretrage, setVrijednostPretrage] = useState<string>('');

    const { user, authenticated } = useContext(UserContext);

    useEffect(() => {
        getLijekovi();
    }, [kategorije]);

    const getLijekovi = () => {
        getAllLijekovi()
            .then(response => {
                setLijekovi(response.data);
                console.log(user);
                console.log(authenticated);
            })
            .catch(error => console.log(error));
    };

    useEffect(() => {
        getAllKategorije()
            .then(response => setKategorije(response.data))
            .catch(error => console.log(error));
    }, []);

    useEffect(() => {
        if (location && location.state) {
            const pushedNotification = location.state as NotificationProps;
            setNotification({ ...pushedNotification, onClose: () => setNotification(undefined) });
        }
    }, [location]);

    const handleOnDelete = (lijekId: number, naziv: string | undefined) => {
        deleteLijek(lijekId)
            .then(() => {
                setNotification({
                    message: `Uspjesno obrisan lijek ${naziv}`,
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
                        message: `Greska prilikom brisanja lijeka ${naziv}`,
                        severity: 'error',
                        onClose: () => setNotification(undefined),
                    });
                    console.error(error.response?.data);
                }
            })
            .finally(() => {
                getLijekovi();
                setDialog({ open: false, lijek: null });
            });
    };

    const handleOpenDialog = (lijek: Lijek) => {
        setDialog({ open: true, lijek: lijek });
    };

    const handleCloseDialog = () => {
        setDialog({ open: false, lijek: null });
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
                    <DialogTitle id="alert-dialog-title">Potvrda brisanja lijeka</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            {`Da li ste sigurni da zelite obrisati lijek ${dialog?.lijek?.naziv}?`}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            size="large"
                            onClick={() => handleOnDelete(dialog?.lijek?.lijekId!, dialog?.lijek?.naziv)}
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
                <Grid container spacing={2} style={{ padding: 16 }}>
                    <Grid item xs={12} sm={2} style={{ marginTop: -6 }}>
                        <InputLabel id="search-type-select-label">Pretrazi prema</InputLabel>
                        <Select
                            labelId="search-type-select-label"
                            id="search-type-select"
                            fullWidth
                            value={kljucPretrage}
                            onChange={(evt: React.ChangeEvent<{ nazivLijeka?: string; value: unknown }>) => {
                                const { value } = evt.target;
                                if (typeof value === 'string') {
                                    setKljucPretrage(value);
                                }
                            }}>
                            <MenuItem value="nazivLijeka">Naziv lijeka</MenuItem>
                        </Select>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            color="secondary"
                            variant="outlined"
                            fullWidth
                            size="small"
                            label="Pretraga"
                            value={vrijednostPretrage}
                            onChange={event => setVrijednostPretrage(event.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12} sm={2}>
                        <Button
                            color="secondary"
                            variant="contained"
                            fullWidth
                            startIcon={<SearchIcon />}
                            onClick={() =>
                                pretragaLijek(kljucPretrage, vrijednostPretrage).then(
                                    (response: AxiosResponse<Lijek[]>) => {
                                        setLijekovi([...response.data]);
                                    },
                                )
                            }>
                            Pretrazi
                        </Button>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                        <Button
                            color="secondary"
                            variant="outlined"
                            fullWidth
                            startIcon={<LoopIcon />}
                            onClick={() =>
                                getAllLijekovi().then((response: AxiosResponse<Lijek[]>) => {
                                    setLijekovi([...response.data]);
                                })
                            }>
                            Resetuj
                        </Button>
                    </Grid>
                </Grid>
            </Paper>
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
                            to={AppRoutes.LijekoviNew}>
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
                                <TableCell>Kolicina</TableCell>
                                <TableCell>Cijena</TableCell>
                                <TableCell>Kategorija</TableCell>
                                <TableCell>Akcije</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {lijekovi?.map((lijek, idx) => {
                                let nazivKategorije;
                                kategorije?.forEach(kategorija => {
                                    if (kategorija.kategorijaId === lijek.kategorija) {
                                        nazivKategorije = kategorija.naziv;
                                    }
                                });
                                return (
                                    <TableRow key={idx}>
                                        <TableCell>{lijek.naziv}</TableCell>
                                        <TableCell align="left">{lijek.opis}</TableCell>
                                        <TableCell align="left">{lijek.kolicina}</TableCell>
                                        <TableCell align="left">{lijek.cijena}</TableCell>
                                        <TableCell align="left">{nazivKategorije}</TableCell>
                                        <TableCell align="left">
                                            <IconButton
                                                aria-label="Edit category"
                                                color="secondary"
                                                size="small"
                                                onClick={() => history.push(AppRoutes.Lijekovi + `/${lijek.lijekId}`)}>
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton
                                                aria-label="Delete category"
                                                size="small"
                                                onClick={() => handleOpenDialog(lijek)}>
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
