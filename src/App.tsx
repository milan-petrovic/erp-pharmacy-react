import React from 'react';
import './App.css';
import { makeStyles } from '@material-ui/core/styles';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Header } from './components/Header/Header';
import { SideDrawer } from './components/Drawer/SideDrawer';
import { AppRoutes } from './constants/routes/AppRoutes';
import { AdminLoginForm } from './containers/Auth/AdminLoginForm';
import { ApotekaLoginForm } from './containers/Auth/ApotekaLoginForm';
import { FarmaceutiContainer } from './containers/Farmaceuti/FarmaceutiContainer';
import { LijekoviContainer } from './containers/Lijekovi/LijekoviContainer';
import { UserContextProvider } from './service/providers/UserContextProvider';
import { KategorijeContainer } from './containers/Kategorije/KategorijeContainer';
import { NaciniPlacanjaContainer } from './containers/NaciniPlacanja/NaciniPlacanjaContainer';
import { AdminiContainer } from './containers/Admini/AdminiContainer';
import { PacijentiContainer } from './containers/Pacijenti/PacijentiContainer';
import { ReceptiContainer } from './containers/Recepti/ReceptiContainer';
import { KategorijaForm } from './containers/Kategorije/KategorijaForm';
import { NacinPlacanjaForm } from './containers/NaciniPlacanja/NacinPlacanjaForm';
import { AdminForm } from './containers/Admini/AdminForm';
import { FarmaceutiForm } from './containers/Farmaceuti/FarmaceutiForm';
import { PacijentForm } from "./containers/Pacijenti/PacijentForm";

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
    },
    appBarSpacer: { ...theme.mixins.toolbar },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
    },
    container: {
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(4),
    },
    paper: {
        padding: theme.spacing(2),
        display: 'flex',
        overflow: 'auto',
        flexDirection: 'column',
    },
    fixedHeight: {
        height: 240,
    },
}));

const App: React.FC = () => {
    const classes = useStyles();

    return (
        <UserContextProvider>
            <BrowserRouter>
                <div className={classes.root}>
                    <Header />
                    <SideDrawer />
                    <main className={classes.content}>
                        <div className={classes.appBarSpacer} />
                        <Switch>
                            <Route path={AppRoutes.AdminLogin} exact component={AdminLoginForm} />
                            <Route path={AppRoutes.Admini} exact component={AdminiContainer} />
                            <Route path={AppRoutes.AdminiNew} exact component={AdminForm} />
                            <Route path={AppRoutes.AdminById} exact component={AdminForm} />
                            <Route path={AppRoutes.Farmaceuti} exact component={FarmaceutiContainer} />
                            <Route path={AppRoutes.FarmaceutiNew} exact component={FarmaceutiForm} />
                            <Route path={AppRoutes.Kategorije} exact component={KategorijeContainer} />
                            <Route path={AppRoutes.KategorijeNew} exact component={KategorijaForm} />
                            <Route path={AppRoutes.KategorijaById} exac component={KategorijaForm} />
                            <Route path={AppRoutes.NaciniPlacanja} exact component={NaciniPlacanjaContainer} />
                            <Route path={AppRoutes.NaciniPlacanjaNew} exact component={NacinPlacanjaForm} />
                            <Route path={AppRoutes.NaciniPlacanjaById} exact component={NacinPlacanjaForm} />
                            <Route path={AppRoutes.ApotekaLogin} exact component={ApotekaLoginForm} />
                            <Route path={AppRoutes.Lijekovi} exact component={LijekoviContainer} />
                            <Route path={AppRoutes.Pacijenti} exact component={PacijentiContainer} />
                            <Route path={AppRoutes.PacijentiNew} exact component={PacijentForm} />
                            <Route path={AppRoutes.PacijentById} exact component={PacijentForm} />
                            <Route path={AppRoutes.Recepti} exact component={ReceptiContainer} />
                            {/*<Route exact path={[AppRoutes.Dashboard, '/']} component={AppDashboard} />*/}
                        </Switch>
                    </main>
                </div>
            </BrowserRouter>
        </UserContextProvider>
    );
};

export default App;
