import { NacinPlacanja, NotificationProps, Pacijent, Prodaja, Racun, Recept } from '../../constants/types';
import React, { useContext, useEffect, useState } from 'react';
import { useHistory, useRouteMatch } from 'react-router';
import { Field, Form, Formik, FormikHelpers, FormikProps } from 'formik';
import { makeStyles } from '@material-ui/core/styles';
import { AppRoutes } from '../../constants/routes/AppRoutes';
import { getAllRecepti, getReceptById } from '../../service/domain/ReceptiService';
import { notifyOnReject } from '../../constants/AppUtils';
import { getAllPacijenti } from '../../service/domain/PacijentiService';
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
import { getAllNaciniPlacanja } from '../../service/domain/NaciniPlacanjaService';
import { UserContext } from '../../service/providers/UserContextProvider';
import { getLastRacun, postRacun } from '../../service/domain/ProdajeService';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';

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
}: FormikProps<Racun> & { notification?: NotificationProps; setNotification: VoidFunction }) => {
    const classes = useStyles();
    const matchId = useRouteMatch<{ id: string }>(AppRoutes.ReceptById)?.params.id;
    const [pacijenti, setPacijenti] = useState<Pacijent[]>();
    const [recepti, setRecepti] = useState<Recept[]>();
    const [naciniPlacanja, setNaciniPlacanja] = useState<NacinPlacanja[]>();
    const [datum, setDatum] = useState<Date>(new Date());

    useEffect(() => {
        getAllRecepti()
            .then(response => {
                setRecepti(response.data);
            })
            .catch(error => console.log(error));
    }, []);

    useEffect(() => {
        getAllPacijenti()
            .then(response => setPacijenti(response.data))
            .catch(notifyOnReject(setNotification));
    }, []);

    useEffect(() => {
        getAllNaciniPlacanja()
            .then(response => {
                setNaciniPlacanja(response.data);
            })
            .catch(error => console.log(error));
    }, []);

    useEffect(() => {
        setFieldValue('datum', datum.toISOString().split('T')[0]);
    }, [datum]);

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Kreiraj novu prodaju
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
                    <Grid item xs={12}>
                        <FormControl style={{ minWidth: '100%' }}>
                            <InputLabel shrink={!!values.nacinPlacanja} required id="category-label">
                                Nacin placanja
                            </InputLabel>
                            <Field
                                id="category-select"
                                as={Select}
                                labelId="category-label"
                                name="nacinPlacanja"
                                input={<Input />}
                                fullWidth
                                MenuProps={MenuProps}>
                                {naciniPlacanja?.map(nacinPlacanja => (
                                    <MenuItem key={nacinPlacanja.nacinPlacanjaId} value={nacinPlacanja.nacinPlacanjaId}>
                                        {nacinPlacanja.naziv}
                                    </MenuItem>
                                ))}
                            </Field>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl style={{ minWidth: '100%' }}>
                            <InputLabel shrink={!!values.recept} required id="category-label">
                                Recept
                            </InputLabel>
                            <Field
                                id="category-select"
                                as={Select}
                                labelId="category-label"
                                name="recept"
                                input={<Input />}
                                fullWidth
                                MenuProps={MenuProps}>
                                {recepti?.map(recept => {
                                    let imeIPrezime;
                                    pacijenti?.forEach(pacijent => {
                                        if (pacijent.pacijentId === recept.receptId) {
                                            imeIPrezime = pacijent.ime + ' ' + pacijent.prezime;
                                        }
                                    });
                                    return (
                                        <MenuItem key={recept.receptId} value={recept.receptId}>
                                            {imeIPrezime + ' - ' + recept.nazivUstanove}
                                        </MenuItem>
                                    );
                                })}
                            </Field>
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
                                value={datum}
                                onChange={date => date && setDatum(date)}
                                KeyboardButtonProps={{
                                    'aria-label': 'change date',
                                }}
                            />
                        </Grid>
                    </MuiPickersUtilsProvider>
                    <Button
                        type="submit"
                        fullWidth
                        endIcon={<NavigateNextIcon />}
                        variant="outlined"
                        color="secondary"
                        className={classes.submit}
                        disabled={isSubmitting}>
                        Odaberi lijekove
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

const defaultValues: Racun = {
    datum: new Date(),
    suma: 0,
    nacinPlacanja: 0,
    farmaceut: 0,
    recept: undefined,
};

export const ProdajaRacunForm: React.FC<NotificationProps> = props => {
    const [notification, setNotification] = useState<NotificationProps | undefined>(undefined);
    const history = useHistory();
    const { user } = useContext(UserContext);

    const handleSubmit = (values: Racun, formikHelpers: FormikHelpers<Racun>) => {
        values.farmaceut = user?.userId;

        postRacun(values)
            .then(response => {
                history.push(AppRoutes.ProdajeNewLijek);
            })
            .catch(notifyOnReject(setNotification));
    };

    return (
        <Formik
            validateOnBlur={true}
            validateOnChange={false}
            initialValues={defaultValues}
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
