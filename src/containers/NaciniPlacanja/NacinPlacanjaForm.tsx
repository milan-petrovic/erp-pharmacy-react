import React, { useEffect, useState } from 'react';
import { Kategorija, NacinPlacanja, NotificationProps } from '../../constants/types';
import { useHistory, useRouteMatch } from 'react-router';
import { Field, Form, Formik, FormikHelpers, FormikProps } from 'formik';
import { yupValidationSchema } from './validation';
import { makeStyles } from '@material-ui/core/styles';
import { AppRoutes } from '../../constants/routes/AppRoutes';
import { getKategorijaById } from '../../service/domain/KategorijeService';
import { notifyOnReject } from '../../constants/AppUtils';
import { Avatar, Button, Container, CssBaseline, LinearProgress, TextField, Typography } from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { Notification } from '../../components/Notification/Notification';
import { getNacinPlacanjaById, postNacinPlacanja, putNacinPlacanja } from '../../service/domain/NaciniPlacanjaService';

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
}: FormikProps<NacinPlacanja> & { notification?: NotificationProps; setNotification: VoidFunction }) => {
    const classes = useStyles();
    const matchId = useRouteMatch<{ id: string }>(AppRoutes.NaciniPlacanjaById)?.params.id;
    const [editing, setEditing] = useState<boolean>(false);

    const getNacinPlacanja = (id: number) => {
        getNacinPlacanjaById(id)
            .then(response => {
                const { data } = response;
                console.log(data);
                setValues({ ...data });
            })
            .catch(notifyOnReject(setNotification));
    };

    useEffect(() => {
        if (matchId && !isNaN(Number(matchId))) {
            getNacinPlacanja(Number(matchId));
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
                    {editing ? `Edituj nacin placanja` : `Kreiraj novi nacin placanja`}
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
                        label="Naziv nacina placanja"
                        name="naziv"
                        error={touched.naziv && !!errors.naziv}
                        helperText={touched.naziv && errors.naziv}
                    />
                    <Field
                        as={TextField}
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        rows="5"
                        multiline
                        name="opis"
                        label="Opis nacina placanja"
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
                        {editing ? `Edituj nacin placanja` : 'Kreiraj nacin placanja'}
                    </Button>
                    <LinearProgress color="secondary" hidden={!isSubmitting} />
                </Form>
            </div>
        </Container>
    );
};

const defaultValues: NacinPlacanja = {
    naziv: '',
    opis: '',
};

export const NacinPlacanjaForm: React.FC = props => {
    const [notification, setNotification] = useState<NotificationProps | undefined>(undefined);
    const history = useHistory();

    const handleSubmit = (values: NacinPlacanja, formikHelpers: FormikHelpers<NacinPlacanja>) => {
        const { setSubmitting, resetForm } = formikHelpers;
        setSubmitting(true);

        if (values.nacinPlacanjaId != null) {
            putNacinPlacanja(values)
                .then(_ => {
                    resetForm();
                    history.push(AppRoutes.NaciniPlacanja, {
                        message: `Uspjesno azuriran nacin placanja ${values.naziv}`,
                        popupDuration: 5000,
                    });
                })
                .catch(notifyOnReject(setNotification))
                .finally(() => {
                    setSubmitting(false);
                });
        } else {
            postNacinPlacanja(values)
                .then(_ => {
                    resetForm();
                    history.push(AppRoutes.NaciniPlacanja, {
                        message: `Uspjesno kreiran nacin placanja ${values.naziv}`,
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
            validateOnBlur={true}
            validateOnChange={false}
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
