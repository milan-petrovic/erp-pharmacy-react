import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { NacinPlacanja, NotificationProps, Pacijent } from "../../constants/types";
import { deletePacijent, getAllPacijenti } from "../../service/domain/PacijentiService";
import {
    Button,
    Container,
    CssBaseline, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
    Grid,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from "@material-ui/core";
import AddIcon from '@material-ui/icons/Add';
import { Link, useHistory, useLocation } from "react-router-dom";
import { AppRoutes } from '../../constants/routes/AppRoutes';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { getDateAsString } from '../../constants/AppUtils';
import { Notification } from "../../components/Notification/Notification";
import { deleteNaciniPlacanja } from "../../service/domain/NaciniPlacanjaService";
import { AxiosError } from "axios";

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

export const PacijentiContainer: React.FC = () => {
    const classes = useStyles();
    const location = useLocation();
    const history = useHistory();
    const [notification, setNotification] = useState<NotificationProps | undefined>(undefined);
    const [pacijenti, setPacijenti] = useState<Pacijent[]>();
    const [dialog, setDialog] = useState<{ open: boolean; pacijent: Pacijent | null }>();


    useEffect(() => {
        getPacijenti();
    }, []);

    const getPacijenti = () => {
        getAllPacijenti()
          .then(response => {
              setPacijenti(response.data);
          })
          .catch(error => console.log(error));
    };

    useEffect(() => {
        if (location && location.state) {
            const pushedNotification = location.state as NotificationProps;
            setNotification({ ...pushedNotification, onClose: () => setNotification(undefined) });
        }
    }, [location]);

    const handleOnDelete = (pacijentId: number, ime: string | undefined, prezime: string | undefined) => {
        deletePacijent(pacijentId)
          .then(() => {
              setNotification({
                  message: `Uspjesno obrisan pacijent ${ime} ${prezime}`,
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
                      message: `Greska prilikom brisanja pacijenta ${ime} ${prezime}`,
                      severity: 'error',
                      onClose: () => setNotification(undefined),
                  });
                  console.error(error.response?.data);
              }
          })
          .finally(() => {
              getPacijenti();
              setDialog({ open: false, pacijent: null });
          });
    };

    const handleOpenDialog = (pacijent: Pacijent) => {
        setDialog({ open: true, pacijent: pacijent });
    };

    const handleCloseDialog = () => {
        setDialog({ open: false, pacijent: null });
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
                  <DialogTitle id="alert-dialog-title">Potvrda brisanja pacijenta</DialogTitle>
                  <DialogContent>
                      <DialogContentText id="alert-dialog-description">
                          {`Da li ste sigurni da zelite obrisati pacijenta ${dialog?.pacijent?.ime} ${dialog?.pacijent?.prezime}?`}
                      </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                      <Button
                        size="large"
                        onClick={() =>
                          handleOnDelete(dialog?.pacijent?.pacijentId!, dialog?.pacijent?.ime, dialog?.pacijent?.prezime)
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
                            to={AppRoutes.PacijentiNew}>
                            Dodaj
                        </Button>
                    </Grid>
                </Grid>
                <TableContainer>
                    <Table className={classes.table} aria-label="simple-table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Sifra zdravstvene</TableCell>
                                <TableCell>Ime</TableCell>
                                <TableCell>Prezime</TableCell>
                                <TableCell>Datum rodjenja</TableCell>
                                <TableCell>Akcije</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {pacijenti?.map((pacijent, idx) => {
                                const datumRodjenjaLocalString = getDateAsString(pacijent.datumRodjenja);
                                return (
                                    <TableRow key={idx}>
                                        <TableCell align="left">{pacijent.sifraZdravstvene}</TableCell>
                                        <TableCell>{pacijent.ime}</TableCell>
                                        <TableCell align="left">{pacijent.prezime}</TableCell>
                                        <TableCell align="left">{datumRodjenjaLocalString}</TableCell>

                                        <TableCell align="left">
                                            <IconButton aria-label="Edit category" color="secondary" size="small" onClick={() => history.push(AppRoutes.Pacijenti + `/${pacijent.pacijentId}`)}>
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton aria-label="Delete category" size="small" onClick={() => handleOpenDialog(pacijent)}>
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
