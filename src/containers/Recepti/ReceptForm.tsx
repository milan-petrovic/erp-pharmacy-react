import { NotificationProps, Pacijent, Recept } from '../../constants/types';
import React, { useEffect, useState } from 'react';
import { useHistory, useRouteMatch } from 'react-router';
import { Field, Form, Formik, FormikHelpers, FormikProps } from 'formik';
import { makeStyles } from '@material-ui/core/styles';
import { AppRoutes } from '../../constants/routes/AppRoutes';
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
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { getAllPacijenti, getPacijentById } from '../../service/domain/PacijentiService';
import { yupValidationSchema } from './validation';
import { getReceptById, postRecept } from '../../service/domain/ReceptiService';
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
    setFieldValue,
    values,
    isSubmitting,
    notification,
    setNotification,
}: FormikProps<Recept> & { notification?: NotificationProps; setNotification: VoidFunction }) => {
    const classes = useStyles();
    const matchId = useRouteMatch<{ id: string }>(AppRoutes.ReceptById)?.params.id;
    const [editing, setEditing] = useState<boolean>(false);
    const [pacijenti, setPacijenti] = useState<Pacijent[]>();
    const [datumIzdavanja, setDatumIzdavanja] = useState<Date>(new Date());

    const getRecept = (id: number) => {
        getReceptById(id)
            .then(response => {
                const { data } = response;
                const { datumIzdavanja: datumIzdavanja } = data;
                setDatumIzdavanja(new Date(datumIzdavanja));
                setValues({ ...data });
            })
            .catch(notifyOnReject(setNotification));
    };

    useEffect(() => {
        if (matchId && !isNaN(Number(matchId))) {
            getRecept(Number(matchId));
            setEditing(true);
        }
    }, []);

    useEffect(() => {
        getAllPacijenti()
            .then(response => {
                setPacijenti(response.data);
            })
            .catch(error => console.log(error));
    }, []);

    useEffect(() => {
        setFieldValue('datumIzdavanja', datumIzdavanja.toISOString().split('.')[0]);
    }, [datumIzdavanja]);

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    {editing ? `Edituj recept` : `Kreiraj novi recept`}
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
                        multiline
                        rows="8"
                        id="sadrzaj"
                        label="Sadrzaj recepta"
                        name="sadrzaj"
                        error={touched.sadrzaj && !!errors.sadrzaj}
                        helperText={touched.sadrzaj && errors.sadrzaj}
                    />
                    <Field
                        as={TextField}
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        required
                        name="nazivUstanove"
                        label="Naziv ustanove"
                        error={touched.nazivUstanove && !!errors.nazivUstanove}
                        helperText={touched.nazivUstanove && errors.nazivUstanove}
                    />
                    <Grid item xs={12}>
                        <FormControl style={{ minWidth: '100%' }}>
                            <InputLabel
                                shrink={!!values.pacijentId}
                                required
                                error={touched.pacijentId && !!errors.pacijentId}
                                id="category-label">
                                Pacijent
                            </InputLabel>
                            <Field
                                id="category-select"
                                as={Select}
                                labelId="category-label"
                                name="pacijentId"
                                error={touched.pacijentId && !!errors.pacijentId}
                                input={<Input />}
                                fullWidth
                                MenuProps={MenuProps}>
                                {pacijenti?.map(pacijent => (
                                    <MenuItem key={pacijent.pacijentId} value={pacijent.pacijentId}>
                                        {pacijent.ime + ' ' + pacijent.prezime}
                                    </MenuItem>
                                ))}
                            </Field>
                            {touched.pacijentId && errors?.pacijentId ? (
                                <FormHelperText error>{errors.pacijentId}</FormHelperText>
                            ) : null}
                        </FormControl>
                    </Grid>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <Grid container>
                            <KeyboardDatePicker
                                margin="normal"
                                id="date-picker-dialog"
                                label="Datum izdavanja"
                                format="dd/MM/yyyy"
                                disabled
                                fullWidth
                                value={datumIzdavanja}
                                onChange={date => date && setDatumIzdavanja(date)}
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
                        {editing ? `Edituj recept` : 'Kreiraj recept'}
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

const defaultValues: Recept = {
    sadrzaj: '',
    nazivUstanove: '',
    pacijentId: 0,
    datumIzdavanja: new Date(),
};

export const ReceptForm: React.FC<NotificationProps> = props => {
    const [notification, setNotification] = useState<NotificationProps | undefined>(undefined);
    const history = useHistory();

    const handleSubmit = (values: Recept, formikHelpers: FormikHelpers<Recept>) => {
        const { setSubmitting, resetForm } = formikHelpers;

        setSubmitting(true);

        postRecept(values)
            .then(_ => {
                resetForm();
                history.push(AppRoutes.Recepti, {
                    message: 'Uspjesno kreiran recept',
                    popupDuration: 5000,
                });
            })
            .catch(notifyOnReject(setNotification))
            .finally(() => {
                setSubmitting(false);
            });
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
