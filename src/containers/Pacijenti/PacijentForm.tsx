import { Kategorija, NotificationProps, Pacijent } from '../../constants/types';
import React, { useEffect, useState } from 'react';
import { useHistory, useRouteMatch } from 'react-router';
import { Field, Form, Formik, FormikHelpers, FormikProps } from 'formik';
import { AppRoutes } from '../../constants/routes/AppRoutes';
import { getDateAsString, notifyOnReject } from "../../constants/AppUtils";
import { Avatar, Button, Container, CssBaseline, Grid, LinearProgress, TextField, Typography } from "@material-ui/core";
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { Notification } from '../../components/Notification/Notification';
import { makeStyles } from '@material-ui/core/styles';
import { yupValidationSchema } from './validation';
import DateFnsUtils from "@date-io/date-fns";
import { KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import { postKategorija } from "../../service/domain/KategorijeService";
import { getPacijentById, postPacijent, putPacijent } from "../../service/domain/PacijentiService";

const useStyles = makeStyles(theme => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

const InnerForm = ({
    touched,
    errors,
    setValues,
                       setFieldValue,

                       isSubmitting,
    notification,
    setNotification,
}: FormikProps<Pacijent> & { notification?: NotificationProps; setNotification: VoidFunction }) => {
    const classes = useStyles();
    const matchId = useRouteMatch<{ id: string }>(AppRoutes.PacijentById)?.params.id;
    const [editing, setEditing] = useState<boolean>(false);
    const [datumRodjenja, setDatumRodjenja] = useState<Date>(new Date());

    const getPacijent = (id: number) => {
        getPacijentById(id)
            .then(response => {
                const { data } = response;
                const { datumRodjenja: datumRodjenja } = data;
                setDatumRodjenja(new Date(datumRodjenja));
                setValues({ ...data });
            })
            .catch(notifyOnReject(setNotification));
    };

    useEffect(() => {
        if (matchId && !isNaN(Number(matchId))) {
            getPacijent(Number(matchId));
            setEditing(true);
        }
    }, []);

    useEffect(() => {
        setFieldValue('datumRodjenja', datumRodjenja.toISOString().split('T')[0]);
    }, [datumRodjenja]);

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    {editing ? `Edituj pacijenta` : `Kreiraj novog pacijenta`}
                </Typography>
                {notification && (
                    <Notification
                        popupDuration={notification.popupDuration}
                        message={notification.message}
                        onClose={notification.onClose}
                        severity={notification.severity}
                    />
                )}
                <Form className={classes.form}>
                    <Field
                        as={TextField}
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="ime"
                        label="Ime"
                        name="ime"
                        error={touched.ime && !!errors.ime}
                        helperText={touched.ime && errors.ime}
                    />
                    <Field
                        as={TextField}
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        required
                        name="prezime"
                        label="Prezime"
                        error={touched.prezime && !!errors.prezime}
                        helperText={touched.prezime && errors.prezime}
                    />
                    <Field
                      as={TextField}
                      variant="outlined"
                      margin="normal"
                      fullWidth
                      required
                      type="number"
                      name="sifraZdravstvene"
                      label="Sifra zdravstvene"
                      error={touched.sifraZdravstvene && !!errors.sifraZdravstvene}
                      helperText={touched.sifraZdravstvene && errors.sifraZdravstvene}
                    />
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <Grid container>
                            <KeyboardDatePicker
                              margin="normal"
                              id="date-picker-dialog"
                              label="Datum rodjenja"
                              format="dd/MM/yyyy"
                              fullWidth
                              value={datumRodjenja}
                              onChange={date => date && setDatumRodjenja(date)}
                              KeyboardButtonProps={{
                                  'aria-label': 'change date',
                              }}
                            />
                        </Grid>
                    </MuiPickersUtilsProvider>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        disabled={isSubmitting}>
                        {editing ? `Edituj pacijenta` : 'Kreiraj pacijenta'}
                    </Button>
                    <LinearProgress color="secondary" hidden={!isSubmitting} />
                </Form>
            </div>
        </Container>
    );
};

const defaultValues: Pacijent = {
    ime: '',
    prezime: '',
    datumRodjenja: new Date(),
    sifraZdravstvene: 0,
};

export const PacijentForm: React.FC<NotificationProps> = props => {
    const [notification, setNotification] = useState<NotificationProps | undefined>(undefined);
    const history = useHistory();


    const handleSubmit = (values: Pacijent, formikHelpers: FormikHelpers<Pacijent>) => {
        const { setSubmitting, resetForm } = formikHelpers;

        setSubmitting(true);
        if (values.pacijentId != null) {
            putPacijent(values)
              .then(_ => {
                  resetForm();
                  history.push(AppRoutes.Pacijenti, {
                      message: `Uspjesno kreiran pacijent ${values.ime} ${values.prezime}`,
                      popupDuration: 5000,
                  });
              })
              .catch(notifyOnReject(setNotification))
              .finally(() => {
                  setSubmitting(false);
              });
        } else {
            postPacijent(values)
              .then(_ => {
                  resetForm();
                  history.push(AppRoutes.Pacijenti, {
                      message: `Uspjesno kreiran pacijent ${values.ime} ${values.prezime}`,
                      popupDuration: 5000,
                  });
              })
              .catch(notifyOnReject(setNotification))
              .finally(() => {
                  setSubmitting(false);
              });
        }
    };

    return (
        <Formik
            validateOnChange={false}
            validateOnBlur={true}
            initialValues={defaultValues}
            validationSchema={yupValidationSchema}
            onSubmit={(values, formikHelpers) => handleSubmit(values, formikHelpers)}>
            {formikProps => (
              <InnerForm
                {...formikProps}
                {...props}
                notification={notification}
                setNotification={setNotification as VoidFunction}
              />
            )}
        </Formik>
    );
};
