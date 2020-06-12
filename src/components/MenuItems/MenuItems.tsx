import React, { useContext, useEffect } from 'react';
import { ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import DashboardIcon from '@material-ui/icons/Dashboard';
import { Link } from 'react-router-dom';
import { Roles } from '../../constants/AppUtils';
import { UserContext } from '../../service/providers/UserContextProvider';

interface MainMenuItemsProps {
    role?: string;
}

export const MenuItems: React.FC<MainMenuItemsProps> = (props: MainMenuItemsProps) => {
    const { authenticated, user } = useContext(UserContext);
    useEffect(() => {}, [authenticated]);
    return (
        <>
            {props.role === Roles.FARMACEUT && (
                <>
                    <ListItem button component={Link} to="">
                        <ListItemIcon>
                            <DashboardIcon />
                        </ListItemIcon>
                        <ListItemText primary="Lijekovi" />
                    </ListItem>
                    <ListItem button component={Link} to="">
                        <ListItemIcon>
                            <DashboardIcon />
                        </ListItemIcon>
                        <ListItemText primary="Prodaje" />
                    </ListItem>
                    <ListItem button component={Link} to="">
                        <ListItemIcon>
                            <DashboardIcon />
                        </ListItemIcon>
                        <ListItemText primary="Pacijetni" />
                    </ListItem>
                    <ListItem button component={Link} to="">
                        <ListItemIcon>
                            <DashboardIcon />
                        </ListItemIcon>
                        <ListItemText primary="Recepti" />
                    </ListItem>
                </>
            )}
            {props.role === Roles.ADMIN && (
                <>
                    <ListItem button component={Link} to="">
                        <ListItemIcon>
                            <DashboardIcon />
                        </ListItemIcon>
                        <ListItemText primary="Farmaceuti" />
                    </ListItem>
                    <ListItem button component={Link} to="">
                        <ListItemIcon>
                            <DashboardIcon />
                        </ListItemIcon>
                        <ListItemText primary="Kategorije" />
                    </ListItem>
                    <ListItem button component={Link} to="">
                        <ListItemIcon>
                            <DashboardIcon />
                        </ListItemIcon>
                        <ListItemText primary="Nacini placanja" />
                    </ListItem>
                </>
            )}
            <ListItem button component={Link} to="">
                <ListItemIcon>
                    <DashboardIcon />
                </ListItemIcon>
                <ListItemText primary="Odjava" />
            </ListItem>
        </>
    );
};
