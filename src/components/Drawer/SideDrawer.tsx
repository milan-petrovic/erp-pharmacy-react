import { drawerWidth, Roles } from '../../constants/AppUtils';
import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Divider, Drawer, List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { MenuItems } from '../MenuItems/MenuItems';
import { UserContext } from '../../service/providers/UserContextProvider';
import { Link } from 'react-router-dom';
import { AppRoutes } from '../../constants/routes/AppRoutes';
import DashboardIcon from '@material-ui/icons/Dashboard';

const useStyles = makeStyles(theme => ({
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
}));

export const SideDrawer: React.FC = () => {
    const classes = useStyles();
    const { authenticated, user } = useContext(UserContext);

    return (
        <Drawer
            className={classes.drawer}
            variant="permanent"
            classes={{
                paper: classes.drawerPaper,
            }}
            anchor="left">
            <Divider />
            <List>
                {authenticated && <List>{<MenuItems role={Roles.FARMACEUT} />}</List>}
                {!authenticated && (
                    <>
                        <ListItem button component={Link} to={AppRoutes.AdminLogin}>
                            <ListItemIcon>
                                <DashboardIcon />
                            </ListItemIcon>
                            <ListItemText primary="Admin panel" />
                        </ListItem>
                        <ListItem button component={Link} to={AppRoutes.ApotekaLogin}>
                            <ListItemIcon>
                                <DashboardIcon />
                            </ListItemIcon>
                            <ListItemText primary="Apoteka" />
                        </ListItem>
                    </>
                )}
            </List>
        </Drawer>
    );
};
