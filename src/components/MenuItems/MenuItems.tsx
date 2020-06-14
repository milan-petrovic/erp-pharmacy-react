import React, { useContext, useEffect } from 'react';
import { Divider, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import DashboardIcon from '@material-ui/icons/Dashboard';
import { Link, useHistory } from 'react-router-dom';
import { Roles, theme } from '../../constants/AppUtils';
import { UserContext } from '../../service/providers/UserContextProvider';
import { AppRoutes } from '../../constants/routes/AppRoutes';
import PeopleIcon from '@material-ui/icons/People';
import SupervisedUserCircleIcon from '@material-ui/icons/SupervisedUserCircle';
import AppsIcon from '@material-ui/icons/Apps';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import PaymentIcon from '@material-ui/icons/Payment';
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd';
import AssignmentIcon from '@material-ui/icons/Assignment';
import LocalHospitalIcon from '@material-ui/icons/LocalHospital';

interface MainMenuItemsProps {
    role?: string;
}

export const MenuItems: React.FC<MainMenuItemsProps> = (props: MainMenuItemsProps) => {
    const { authenticated, user, logoutUser } = useContext(UserContext);
    const history = useHistory();

    useEffect(() => {}, [authenticated]);
    return (
        <>
            {props.role === Roles.FARMACEUT && (
                <>
                    <ListItem button component={Link} to={AppRoutes.Lijekovi}>
                        <ListItemIcon>
                            <LocalHospitalIcon />
                        </ListItemIcon>
                        <ListItemText primary="Lijekovi" />
                    </ListItem>
                    <ListItem button component={Link} to={AppRoutes.Racuni}>
                        <ListItemIcon>
                            <AssignmentIcon />
                        </ListItemIcon>
                        <ListItemText primary="Prodaje" />
                    </ListItem>
                    <ListItem button component={Link} to={AppRoutes.Pacijenti}>
                        <ListItemIcon>
                            <PeopleIcon />
                        </ListItemIcon>
                        <ListItemText primary="Pacijetni" />
                    </ListItem>
                    <ListItem button component={Link} to={AppRoutes.Recepti}>
                        <ListItemIcon>
                            <AssignmentIndIcon />
                        </ListItemIcon>
                        <ListItemText primary="Recepti" />
                    </ListItem>
                </>
            )}
            {props.role === Roles.ADMIN && (
                <>
                    <ListItem button component={Link} to={AppRoutes.Farmaceuti}>
                        <ListItemIcon>
                            <PeopleIcon />
                        </ListItemIcon>
                        <ListItemText primary="Farmaceuti" />
                    </ListItem>
                    <ListItem button component={Link} to={AppRoutes.Admini}>
                        <ListItemIcon>
                            <SupervisedUserCircleIcon />
                        </ListItemIcon>
                        <ListItemText primary="Admini" />
                    </ListItem>
                    <ListItem button component={Link} to={AppRoutes.Kategorije}>
                        <ListItemIcon>
                            <AppsIcon />
                        </ListItemIcon>
                        <ListItemText primary="Kategorije" />
                    </ListItem>
                    <ListItem button component={Link} to={AppRoutes.NaciniPlacanja}>
                        <ListItemIcon>
                            <PaymentIcon />
                        </ListItemIcon>
                        <ListItemText primary="Nacini placanja" />
                    </ListItem>
                </>
            )}
            <Divider />
            <ListItem
                button
                onClick={() => {
                    logoutUser && logoutUser();
                    history.push('/');
                }}>
                <ListItemIcon>
                    <ExitToAppIcon />
                </ListItemIcon>
                <ListItemText primary="Odjava" />
            </ListItem>
        </>
    );
};
