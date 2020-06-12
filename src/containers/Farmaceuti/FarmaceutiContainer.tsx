import React, { useEffect, useState } from 'react';
import { getAllFarmaceuti } from '../../service/domain/FarmaceutiService';
import { Farmaceut } from '../../constants/types';
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
    Typography,
} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';

import { Link } from 'react-router-dom';
import { AppRoutes } from '../../constants/routes/AppRoutes';

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
                            Kreiraj novog
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
