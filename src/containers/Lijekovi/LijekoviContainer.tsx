import React, { useEffect, useState } from 'react';
import { getAllLijekovi } from '../../service/domain/LijekoviService';
import { Kategorija, Lijek } from '../../constants/types';
import { makeStyles } from '@material-ui/core/styles';
import {
    Button,
    Container,
    CssBaseline,
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
import { Link } from 'react-router-dom';
import { AppRoutes } from '../../constants/routes/AppRoutes';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { getAllKategorije, getKategorijaById } from '../../service/domain/KategorijeService';

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
    const [lijekovi, setLijekovi] = useState<Lijek[]>();
    const [kategorije, setKategorije] = useState<Kategorija[]>();

    useEffect(() => {
        getAllLijekovi()
            .then(response => {
                setLijekovi(response.data);
            })
            .catch(error => console.log(error));
    }, [kategorije]);

    useEffect(() => {
        getAllKategorije()
            .then(response => setKategorije(response.data))
            .catch(error => console.log(error));
    }, []);

    const getNazivKategorije = (kategorijaId: number) => {
        let nazivKategorije;
        kategorije?.forEach(kategorija => {
            if (kategorija.kategorijaId === kategorijaId) {
                nazivKategorije = kategorija.naziv;
            } else {
                nazivKategorije = '';
            }
        });
        return nazivKategorije;
    };

    return (
        <Container component="main" maxWidth="xl">
            <CssBaseline />
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
                            Kreiraj novu
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
                                            <IconButton aria-label="Edit category" color="secondary" size="small">
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton aria-label="Delete category" size="small">
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
