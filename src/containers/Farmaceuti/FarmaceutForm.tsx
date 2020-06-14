import React, { useEffect, useState } from 'react';
import { Farmaceut, Kategorija, NotificationProps } from '../../constants/types';
import { useHistory, useRouteMatch } from 'react-router';
import { Field, Form, Formik, FormikHelpers, FormikProps } from 'formik';
import { makeStyles } from '@material-ui/core/styles';
import { AppRoutes } from '../../constants/routes/AppRoutes';
import { getKategorijaById, postKategorija } from '../../service/domain/KategorijeService';
import { notifyOnReject } from '../../constants/AppUtils';
import { Avatar, Button, Container, CssBaseline, LinearProgress, TextField, Typography } from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { Notification } from '../../components/Notification/Notification';
import { yupValidationSchema } from './validation';
import { getFarmaceutById, postFarmaceut, putFarmaceut } from '../../service/domain/FarmaceutiService';

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
}: FormikProps<Farmaceut> & { notification?: NotificationProps; setNotification: VoidFunction }) => {
    const classes = useStyles();
    const matchId = useRouteMatch<{ id: string }>(AppRoutes.FarmaceutById)?.params.id;
    const [editing, setEditing] = useState<boolean>(false);

    const getFarmaceut = (id: number) => {
        getFarmaceutById(id)
            .then(response => {
                const { data } = response;
                setValues({ ...data });
            })
            .catch(notifyOnReject(setNotification));
    };

    useEffect(() => {
        if (matchId && !isNaN(Number(matchId))) {
            getFarmaceut(Number(matchId));
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
                    {editing ? `Edituj farmaceuta` : `Kreiraj novog farmaceuta`}
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
                        id="username"
                        label="Username"
                        name="username"
                        error={touched.username && !!errors.username}
                        helperText={touched.username && errors.username}
                    />
                    <Field
                        as={TextField}
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        type="password"
                        name="password"
                        label="Password"
                        error={touched.password && !!errors.password}
                        helperText={touched.password && errors.password}
                    />
                    <Field
                        as={TextField}
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        name="email"
                        label="Email"
                        error={touched.email && !!errors.email}
                        helperText={touched.email && errors.email}
                    />
                    <Field
                        as={TextField}
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        name="ime"
                        label="Ime"
                        error={touched.ime && !!errors.ime}
                        helperText={touched.ime && errors.ime}
                    />
                    <Field
                        as={TextField}
                        variant="outlined"
                        margin="normal"
                        fullWidth
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
                        type="number"
                        name="brojDozvole"
                        label="Broj dozvole"
                        error={touched.brojDozvole && !!errors.brojDozvole}
                        helperText={touched.brojDozvole && errors.brojDozvole}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="secondary"
                        className={classes.submit}
                        disabled={isSubmitting}>
                        {editing ? `Edituj farmaceuta` : 'Kreiraj farmaceuta'}
                    </Button>
                    <LinearProgress color="secondary" hidden={!isSubmitting} />
                </Form>
            </div>
        </Container>
    );
};

const defaultValues: Farmaceut = {
    username: '',
    password: '',
    ime: '',
    prezime: '',
    brojDozvole: 0,
    email: '',
};

export const FarmaceutForm: React.FC<NotificationProps> = props => {
    const [notification, setNotification] = useState<NotificationProps | undefined>(undefined);
    const history = useHistory();

    const handleSubmit = (values: Farmaceut, formikHelpers: FormikHelpers<Farmaceut>) => {
        const { setSubmitting, resetForm } = formikHelpers;

        setSubmitting(true);
        if (values.farmaceutId != null) {
            putFarmaceut(values)
                .then(_ => {
                    resetForm();
                    history.push(AppRoutes.Farmaceuti, {
                        message: `Uspjesno azuriran farmaceut ${values.username}`,
                        popupDuration: 5000,
                    });
                })
                .catch(notifyOnReject(setNotification))
                .finally(() => {
                    setSubmitting(false);
                });
        } else {
            postFarmaceut(values)
                .then(_ => {
                    resetForm();
                    history.push(AppRoutes.Farmaceuti, {
                        message: `Uspjesno kreiran farmaceut ${values.username}`,
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
