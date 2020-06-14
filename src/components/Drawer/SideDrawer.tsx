import { drawerWidth, Roles } from '../../constants/AppUtils';
import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Avatar, Divider, Drawer, List, ListItem, ListItemAvatar, ListItemIcon, ListItemText } from '@material-ui/core';
import { MenuItems } from '../MenuItems/MenuItems';
import { UserContext } from '../../service/providers/UserContextProvider';
import { Link } from 'react-router-dom';
import { AppRoutes } from '../../constants/routes/AppRoutes';
import VpnKeyIcon from '@material-ui/icons/VpnKey';

const useStyles = makeStyles(theme => ({
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    avatarColor: {
        color: theme.palette.primary.main,
        backgroundColor: theme.palette.secondary.main,
    },
}));

export const SideDrawer: React.FC = () => {
    const classes = useStyles();
    const { authenticated, user } = useContext(UserContext);

    const getFirstCharacterForAvatar = (username?: string) => {
        return username?.charAt(0).toUpperCase();
    };

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
                {authenticated && (
                    <>
                        <List>
                            <ListItem>
                                <ListItemAvatar>
                                    <Avatar className={classes.avatarColor}>
                                        {getFirstCharacterForAvatar(user && user.username)}
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText primary={user && user.username} secondary={user && user.email} />
                            </ListItem>
                        </List>
                        <Divider />
                        <List>{<MenuItems role={user?.role} />}</List>
                    </>
                )}
                {!authenticated && (
                    <>
                        <ListItem button component={Link} to={AppRoutes.AdminLogin}>
                            <ListItemIcon>
                                <VpnKeyIcon />
                            </ListItemIcon>
                            <ListItemText primary="Admin panel" />
                        </ListItem>
                        <ListItem button component={Link} to={AppRoutes.ApotekaLogin}>
                            <ListItemIcon>
                                <VpnKeyIcon />
                            </ListItemIcon>
                            <ListItemText primary="Apoteka" />
                        </ListItem>
                    </>
                )}
            </List>
        </Drawer>
    );
};
