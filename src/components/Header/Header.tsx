import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { AppBar, Button, Grid, Toolbar, Typography } from '@material-ui/core';
import { drawerWidth, Roles, theme } from '../../constants/AppUtils';
import AddIcon from '@material-ui/icons/Add';
import { Link } from 'react-router-dom';
import { AppRoutes } from '../../constants/routes/AppRoutes';
import { UserContext } from '../../service/providers/UserContextProvider';

const useStyles = makeStyles(theme => ({
    appBar: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
    },
    toolbar: theme.mixins.toolbar,
    title: {
        flexGrow: 1,
    },
}));

export const Header: React.FC = () => {
    const { authenticated, user } = useContext(UserContext);
    const classes = useStyles();
    return (
        <AppBar position="fixed" className={classes.appBar}>
            <Toolbar>
                <Typography variant="h6" noWrap className={classes.title}>
                    Apoteka
                </Typography>
                {authenticated && user?.role === Roles.FARMACEUT && (
                    <Button
                        color="secondary"
                        variant="contained"
                        startIcon={<AddIcon />}
                        component={Link}
                        to={AppRoutes.ProdajeNewRacun}>
                        Kreiraj prodaju
                    </Button>
                )}
            </Toolbar>
        </AppBar>
    );
};
