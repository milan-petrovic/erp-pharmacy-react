import { Farmaceut, NacinPlacanja, NotificationProps, Prodaja, Racun } from '../../constants/types';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import React, { useEffect, useState } from 'react';
import {
    Button,
    Container,
    CssBaseline,
    ExpansionPanel,
    ExpansionPanelDetails,
    ExpansionPanelSummary,
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
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { getAllRacuni, getProdaje } from '../../service/domain/ProdajeService';
import { getDateAsString } from '../../constants/AppUtils';
import { Notification } from '../../components/Notification/Notification';
import AddIcon from '@material-ui/icons/Add';
import { Link, useLocation } from 'react-router-dom';
import { AppRoutes } from '../../constants/routes/AppRoutes';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { getAllFarmaceuti } from '../../service/domain/FarmaceutiService';
import { getAllNaciniPlacanja } from '../../service/domain/NaciniPlacanjaService';

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

export const RacuniContainer: React.FC<NotificationProps> = props => {
    const classes = useStyles();
    const [notification, setNotification] = useState<NotificationProps | undefined>(undefined);
    const [racuni, setRacuni] = useState<Racun[]>();
    const [naciniPlacanja, setNaciniPlacanja] = useState<NacinPlacanja[]>();
    const [farmaceuti, setFarmaceuti] = useState<Farmaceut[]>();
    const location = useLocation();

    useEffect(() => {
        getAllRacuni()
            .then(response => setRacuni(response.data))
            .catch(error => console.log(error));
    }, []);

    useEffect(() => {
        getAllFarmaceuti()
            .then(response => setFarmaceuti(response.data))
            .catch(error => console.log(error));
    }, []);

    useEffect(() => {
        getAllNaciniPlacanja()
            .then(response => setNaciniPlacanja(response.data))
            .catch(error => console.log(error));
    }, []);

    useEffect(() => {
        if (location && location.state) {
            const pushedNotification = location.state as NotificationProps;
            setNotification({ ...pushedNotification, onClose: () => setNotification(undefined) });
        }
    }, [location]);

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
                <TableContainer>
                    <Table className={classes.table} aria-label="simple-table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Datum</TableCell>
                                <TableCell>Suma</TableCell>
                                <TableCell>Nacin placanja</TableCell>
                                <TableCell>Farmaceut</TableCell>
                                <TableCell>Recept</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {racuni?.map((racun, idx) => {
                                let nacinPlacanjaNaziv;
                                let farmaceutImePrezime;
                                let recept;

                                farmaceuti?.forEach(farmaceut => {
                                    if (farmaceut.farmaceutId === racun.farmaceut) {
                                        farmaceutImePrezime = farmaceut.ime + ' ' + farmaceut.prezime;
                                    }
                                });

                                naciniPlacanja?.forEach(nacinPlacanja => {
                                    if (nacinPlacanja.nacinPlacanjaId === racun.nacinPlacanja) {
                                        nacinPlacanjaNaziv = nacinPlacanja.naziv;
                                    }
                                });

                                return (
                                    <TableRow key={idx}>
                                        <TableCell>{getDateAsString(racun.datum)}</TableCell>
                                        <TableCell align="left">{racun.suma}</TableCell>
                                        <TableCell align="left">{nacinPlacanjaNaziv}</TableCell>
                                        <TableCell align="left">{farmaceutImePrezime}</TableCell>
                                        <TableCell align="left">{racun.recept}</TableCell>
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
