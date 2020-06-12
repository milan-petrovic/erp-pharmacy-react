import React, { useEffect, useState } from 'react';
import { Kategorija, NotificationProps } from '../../constants/types';
import { Field, Form, Formik, FormikHelpers, FormikProps } from 'formik';
import { yupValidationSchema } from './validation';
import { Avatar, Button, Container, CssBaseline, LinearProgress, TextField, Typography } from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { Notification } from '../../components/Notification/Notification';
import { makeStyles } from '@material-ui/core/styles';
import { getKategorijaById, postKategorija, putKategorija } from '../../service/domain/KategorijeService';
import { useHistory, useRouteMatch } from 'react-router';
import { AppRoutes } from '../../constants/routes/AppRoutes';
import { notifyOnReject } from '../../constants/AppUtils';

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
    isSubmitting,
    notification,
    setNotification,
}: FormikProps<Kategorija> & { notification?: NotificationProps; setNotification: VoidFunction }) => {
    const classes = useStyles();
    const matchId = useRouteMatch<{ id: string }>(AppRoutes.KategorijaById)?.params.id;
    const [editing, setEditing] = useState<boolean>(false);

    const getKategorija = (id: number) => {
        getKategorijaById(id)
            .then(response => {
                const { data } = response;
                setValues({ ...data });
            })
            .catch(notifyOnReject(setNotification));
    };

    useEffect(() => {
        if (matchId && !isNaN(Number(matchId))) {
            getKategorija(Number(matchId));
            setEditing(true);
        }
    }, []);

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    {editing ? `Edituj kategoriju` : `Kreiraj novu kategoriju`}
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
                        id="naziv"
                        label="Naziv kategorije"
                        name="naziv"
                        error={touched.naziv && !!errors.naziv}
                        helperText={touched.naziv && errors.naziv}
                    />
                    <Field
                        as={TextField}
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        multiline
                        rows="5"
                        name="opis"
                        label="Opis kategorije"
                        error={touched.opis && !!errors.opis}
                        helperText={touched.opis && errors.opis}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        disabled={isSubmitting}>
                        {editing ? `Edituj kategoriju` : 'Kreiraj kategoriju    '}
                    </Button>
                    <LinearProgress color="secondary" hidden={!isSubmitting} />
                </Form>
            </div>
        </Container>
    );
};

const defaultValues: Kategorija = {
    naziv: '',
    opis: '',
};

export const KategorijaForm: React.FC<NotificationProps> = props => {
    const [notification, setNotification] = useState<NotificationProps | undefined>(undefined);
    const history = useHistory();

    const handleSubmit = (values: Kategorija, formikHelpers: FormikHelpers<Kategorija>) => {
        const { setSubmitting, resetForm } = formikHelpers;

        setSubmitting(true);

        if (values.kategorijaId != null) {
            putKategorija(values)
                .then(_ => {
                    resetForm();
                    history.push(AppRoutes.Kategorije, {
                        message: `Uspjesno azurirana kategorija ${values.naziv}`,
                        popupDuration: 5000,
                    });
                })
                .catch(notifyOnReject(setNotification))
                .finally(() => {
                    setSubmitting(false);
                });
        } else {
            postKategorija(values)
                .then(_ => {
                    resetForm();
                    history.push(AppRoutes.Kategorije, {
                        message: `Uspjesno kreirana kategorija ${values.naziv}`,
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
