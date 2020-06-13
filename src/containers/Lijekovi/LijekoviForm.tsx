import { Kategorija, Lijek, NotificationProps } from '../../constants/types';
import React, { useEffect, useState } from 'react';
import { useHistory, useRouteMatch } from 'react-router';
import { Field, Form, Formik, FormikHelpers, FormikProps } from 'formik';
import { yupValidationSchema } from './validation';
import { makeStyles } from '@material-ui/core/styles';
import { AppRoutes } from '../../constants/routes/AppRoutes';
import { getAllKategorije } from '../../service/domain/KategorijeService';
import { notifyOnReject } from '../../constants/AppUtils';
import {
    Avatar,
    Button,
    Container,
    CssBaseline,
    FormControl,
    FormHelperText,
    Grid,
    Input,
    InputLabel,
    LinearProgress,
    MenuItem,
    Select,
    TextField,
    Typography,
} from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { Notification } from '../../components/Notification/Notification';
import { getLijekById, postLijek, putLijek } from '../../service/domain/LijekoviService';

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
    values,
    isSubmitting,
    notification,
    setNotification,
}: FormikProps<Lijek> & { notification?: NotificationProps; setNotification: VoidFunction }) => {
    const classes = useStyles();
    const matchId = useRouteMatch<{ id: string }>(AppRoutes.LijekById)?.params.id;
    const [editing, setEditing] = useState<boolean>(false);
    const [kategorije, setKategorije] = useState<Kategorija[]>();

    const getLijek = (id: number) => {
        getLijekById(id)
            .then(response => {
                const { data } = response;
                setValues({ ...data });
            })
            .catch(notifyOnReject(setNotification));
    };

    useEffect(() => {
        if (matchId && !isNaN(Number(matchId))) {
            getLijek(Number(matchId));
            setEditing(true);
        }
    }, []);

    useEffect(() => {
        getAllKategorije()
            .then(response => {
                setKategorije(response.data);
            })
            .catch(error => console.log(error));
    }, []);

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    {editing ? `Edituj lijek` : `Kreiraj novi lijek`}
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
                        label="Naziv lijeka"
                        name="naziv"
                        error={touched.naziv && !!errors.naziv}
                        helperText={touched.naziv && errors.naziv}
                    />
                    <Field
                        as={TextField}
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        required
                        multiline
                        rows="5"
                        name="opis"
                        label="Opis lijeka"
                        error={touched.opis && !!errors.opis}
                        helperText={touched.opis && errors.opis}
                    />
                    <Field
                        as={TextField}
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        type="number"
                        name="cijena"
                        label="Cijena lijeka"
                        error={touched.cijena && !!errors.cijena}
                        helperText={touched.cijena && errors.cijena}
                    />
                    <Field
                        as={TextField}
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        type="number"
                        name="kolicina"
                        label="Kolicina"
                        error={touched.kolicina && !!errors.kolicina}
                        helperText={touched.kolicina && errors.kolicina}
                    />
                    <Grid item xs={12}>
                        <FormControl style={{ minWidth: '100%' }}>
                            <InputLabel
                                shrink={!!values.kategorija}
                                required
                                error={touched.kategorija && !!errors.kategorija}
                                id="category-label">
                                Kategorija
                            </InputLabel>
                            <Field
                                id="category-select"
                                as={Select}
                                labelId="category-label"
                                name="kategorija"
                                error={touched.kategorija && !!errors.kategorija}
                                input={<Input />}
                                fullWidth
                                MenuProps={MenuProps}>
                                {kategorije?.map(kategorija => (
                                    <MenuItem key={kategorija.kategorijaId} value={kategorija.kategorijaId}>
                                        {kategorija.naziv}
                                    </MenuItem>
                                ))}
                            </Field>
                            {touched.kategorija && errors?.kategorija ? (
                                <FormHelperText error>{errors.kategorija}</FormHelperText>
                            ) : null}
                        </FormControl>
                    </Grid>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="secondary"
                        className={classes.submit}
                        disabled={isSubmitting}>
                        {editing ? `Edituj lijek` : 'Kreiraj lijek    '}
                    </Button>
                    <LinearProgress color="secondary" hidden={!isSubmitting} />
                </Form>
            </div>
        </Container>
    );
};

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

const defaultValues: Lijek = {
    naziv: '',
    opis: '',
    kolicina: 0,
    cijena: 0,
    kategorija: 0,
};

export const LijekoviForm: React.FC<NotificationProps> = props => {
    const [notification, setNotification] = useState<NotificationProps | undefined>(undefined);
    const history = useHistory();

    const handleSubmit = (values: Lijek, formikHelpers: FormikHelpers<Lijek>) => {
        const { setSubmitting, resetForm } = formikHelpers;
        setSubmitting(true);

        if (values.lijekId != null) {
            putLijek(values)
                .then(_ => {
                    resetForm();
                    history.push(AppRoutes.Lijekovi, {
                        message: `Uspjesno azuriran lijek ${values.naziv}`,
                        popupDuration: 5000,
                    });
                })
                .catch(notifyOnReject(setNotification))
                .finally(() => {
                    setSubmitting(false);
                });
        } else {
            postLijek(values)
                .then(_ => {
                    resetForm();
                    history.push(AppRoutes.Lijekovi, {
                        message: `Uspjesno kreiran lijek ${values.naziv}`,
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
