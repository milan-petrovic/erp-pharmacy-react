import { Farmaceut, NotificationProps } from '../../constants/types';
import React, { useEffect, useState } from 'react';
import { useHistory, useRouteMatch } from 'react-router';
import { Field, Form, Formik, FormikHelpers, FormikProps } from 'formik';
import { makeStyles } from '@material-ui/core/styles';
import { AppRoutes } from '../../constants/routes/AppRoutes';
import { Avatar, Button, Container, CssBaseline, LinearProgress, TextField, Typography } from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { Notification } from '../../components/Notification/Notification';
import { yupValidationSchema } from './validation';

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
    const matchId = useRouteMatch<{ id: string }>(AppRoutes.KategorijaById)?.params.id;
    const [editing, setEditing] = useState<boolean>(false);

    // const getKategorija = (id: number) => {
    //     getKategorijaById(id)
    //         .then(response => {
    //             const { data } = response;
    //             setValues({ ...data });
    //         })
    //         .catch(notifyOnReject(setNotification));
    // };
    //
    // useEffect(() => {
    //     if (matchId && !isNaN(Number(matchId))) {
    //         getKategorija(Number(matchId));
    //         setEditing(true);
    //     }
    // }, []);

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
                        required
                        fullWidth
                        id="prezime"
                        label="Prezime"
                        name="prezime"
                        error={touched.prezime && !!errors.prezime}
                        helperText={touched.prezime && errors.prezime}
                    />
                    <Field
                        as={TextField}
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="brojDozvole"
                        label="Broj dozvole"
                        name="brojDozvole"
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
                        {editing ? `Edituj farmaceuta` : 'Kreiraj farmaceuta    '}
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
    email: '',
    ime: '',
    prezime: '',
    brojDozvole: '',
};

export const FarmaceutiForm: React.FC<NotificationProps> = props => {
    const [notification, setNotification] = useState<NotificationProps | undefined>(undefined);
    const history = useHistory();

    const handleOnSubmit = (values: Farmaceut, formikHelpers: FormikHelpers<Farmaceut>) => {
        console.log(values);
    };

    return (
        <Formik
            validateOnBlur={true}
            validateOnChange={false}
            initialValues={defaultValues}
            validationSchema={yupValidationSchema}
            onSubmit={(values, formikHelpers) => handleOnSubmit(values, formikHelpers)}>
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
