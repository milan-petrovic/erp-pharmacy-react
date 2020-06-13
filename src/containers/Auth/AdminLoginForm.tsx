import React, { useContext, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { Avatar, Button, Container, CssBaseline, TextField, Typography } from '@material-ui/core';
import { LoginModel, NotificationProps } from '../../constants/types';
import { Field, Form, Formik, FormikHelpers, FormikProps } from 'formik';
import { yupValidationSchema } from './validation';
import { Notification } from '../../components/Notification/Notification';
import { adminLogin } from '../../service/domain/LoginService';
import { UserContext } from '../../service/providers/UserContextProvider';
import { notifyOnReject, Roles } from '../../constants/AppUtils';
import { useHistory } from 'react-router';
import { AppRoutes } from '../../constants/routes/AppRoutes';

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
    isValid,
    setValues,
    values,
    isSubmitting,
    setFieldValue,
    notification,
    setNotification,
}: FormikProps<LoginModel> & { notification?: NotificationProps; setNotification: VoidFunction }) => {
    const classes = useStyles();

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Prijavi se kao admin
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
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        error={touched.password && !!errors.password}
                        helperText={touched.password && errors.password}
                    />
                    <Button type="submit" fullWidth variant="contained" color="secondary" className={classes.submit}>
                        Prijavi se
                    </Button>
                </Form>
            </div>
        </Container>
    );
};
const defaultValues: LoginModel = {
    username: '',
    password: '',
};

export const AdminLoginForm: React.FC<NotificationProps> = props => {
    const { loginUser, authenticated } = useContext(UserContext);
    const [notification, setNotification] = useState<NotificationProps | undefined>(undefined);
    const history = useHistory();

    const handleSubmit = (values: LoginModel, formikHelpers: FormikHelpers<LoginModel>) => {
        const { setSubmitting, resetForm } = formikHelpers;
        adminLogin(values)
            .then(response => {
                resetForm();
                loginUser &&
                    loginUser({
                        username: response.data.username,
                        password: response.data.password,
                        email: response.data.email,
                        role: Roles.ADMIN,
                    });
                history.push(AppRoutes.Farmaceuti);
            })
            .catch(notifyOnReject(setNotification, 'Pogresan username ili password'))
            .finally(() => {
                setSubmitting(false);
            });
    };

    return (
        <Formik
            validateOnChange={false}
            validateOnBlur={true}
            initialValues={defaultValues}
            validationSchema={yupValidationSchema}
            onSubmit={(loginModel, formikHelpers) => handleSubmit(loginModel, formikHelpers)}>
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
