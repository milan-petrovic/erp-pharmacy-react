import { Admin, NotificationProps } from '../../constants/types';
import React, { useEffect, useState } from 'react';
import { useHistory, useRouteMatch } from 'react-router';
import { Field, Form, Formik, FormikHelpers, FormikProps } from 'formik';
import { yupValidationSchema } from './validation';
import { makeStyles } from '@material-ui/core/styles';
import { AppRoutes } from '../../constants/routes/AppRoutes';
import { Avatar, Button, Container, CssBaseline, LinearProgress, TextField, Typography } from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { Notification } from '../../components/Notification/Notification';
import { postKategorija } from '../../service/domain/KategorijeService';
import { notifyOnReject } from '../../constants/AppUtils';
import { getAdminById, postAdmin, putAdmin } from '../../service/domain/AdminiService';

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
}: FormikProps<Admin> & { notification?: NotificationProps; setNotification: VoidFunction }) => {
    const classes = useStyles();
    const matchId = useRouteMatch<{ id: string }>(AppRoutes.AdminById)?.params.id;
    const [editing, setEditing] = useState<boolean>(false);

    const getAdmin = (id: number) => {
        getAdminById(id)
            .then(response => {
                const { data } = response;
                setValues({ ...data });
            })
            .catch(notifyOnReject(setNotification));
    };

    useEffect(() => {
        if (matchId && !isNaN(Number(matchId))) {
            getAdmin(Number(matchId));
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
                    {editing ? `Edituj admina` : `Kreiraj novog admina`}
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
                        type="email"
                        name="email"
                        label="Email"
                        error={touched.email && !!errors.email}
                        helperText={touched.email && errors.email}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        disabled={isSubmitting}>
                        {editing ? `Edituj admina` : 'Kreiraj admina    '}
                    </Button>
                    <LinearProgress color="secondary" hidden={!isSubmitting} />
                </Form>
            </div>
        </Container>
    );
};

const defaultValues: Admin = {
    username: '',
    password: '',
    email: '',
};

export const AdminForm: React.FC<NotificationProps> = props => {
    const [notification, setNotification] = useState<NotificationProps | undefined>(undefined);
    const history = useHistory();

    const handleSubmit = (values: Admin, formikHelpers: FormikHelpers<Admin>) => {
        const { setSubmitting, resetForm } = formikHelpers;

        setSubmitting(true);
        if (values.adminId != null) {
            putAdmin(values)
                .then(_ => {
                    resetForm();
                    history.push(AppRoutes.Admini, {
                        message: `Uspjesno editovan admin ${values.username}`,
                        popupDuration: 5000,
                    });
                })
                .catch(notifyOnReject(setNotification))
                .finally(() => {
                    setSubmitting(false);
                });
        } else {
            postAdmin(values)
                .then(_ => {
                    resetForm();
                    history.push(AppRoutes.Admini, {
                        message: `Uspjesno kreiran admin ${values.username}`,
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
