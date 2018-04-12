import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';

import { MuiThemeProvider, withStyles } from 'material-ui/styles';
import {CssBaseline, AppBar, Toolbar, Typography, Button, IconButton, Icon, Menu, MenuItem} from 'material-ui';

import { theme } from '../theme';
import {I18nextProvider, translate} from "react-i18next";

import i18n from '../../i18n/localization';

const styles = theme => ({
    children: {
        margin: 8,
        paddingTop: 64
    },
    menuButton: {
        marginLeft: -12,
        marginRight: 20
    }
});

const Copyright = translate('common')(({ t }) => (
    <Typography variant="caption">
        {i18n.t('copyright', { year: new Date().getFullYear() })}
    </Typography>
));

class App extends Component {
    static propTypes = {
        children: PropTypes.node,
        classes: PropTypes.object.isRequired
    };

    state = {
        anchorEl: null,
    };

    doLogout = () => {
        this.handleClose();

        Session.set('redirectAfterLogin', undefined);

        Meteor.logout((err) => {
            if (err) alert(err);
            else setTimeout(() => this.props.router.push('/login'), 250);
        });
    };

    handleAccountMenu = (event) => {
        this.setState({ anchorEl: event.currentTarget });
    };

    handleClose = () => {
        this.setState({ anchorEl: null });
    };

    render() {
        const { user, children, classes } = this.props;

        let toolbar;

        if (user) {
            const { anchorEl } = this.state;
            const open = Boolean(anchorEl);
            toolbar = (
                <Toolbar>
                    <IconButton className={classes.menuButton} color="inherit" aria-label="Menu">
                        <Icon>menu</Icon>
                    </IconButton>
                    <Typography variant="title" color="inherit" style={{ flex: 1 }}>
                        Dungeons & Dragons
                    </Typography>
                    <Typography variant="caption" color="inherit">
                        {user.username}
                    </Typography>
                    <div>
                        <IconButton
                            aria-owns={open ? 'menu-appbar' : null}
                            aria-haspopup="true"
                            onClick={this.handleAccountMenu}
                            color="inherit"
                        >
                            <Icon>account_circle</Icon>
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorEl}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={open}
                            onClose={this.handleClose}
                        >
                            <MenuItem onClick={this.doLogout}>Logout</MenuItem>
                        </Menu>
                    </div>
                </Toolbar>
            );
        } else {
            toolbar = (
                <Toolbar>
                    <Typography variant="title" color="inherit" style={{ width: '100%', textAlign: 'center' }}>
                        Nordakademie Elmshorn
                    </Typography>
                </Toolbar>
            );
        }

        return (
            <I18nextProvider i18n={i18n}>
                <MuiThemeProvider theme={theme}>
                    <CssBaseline />
                        <AppBar position="fixed" color="primary">
                            {toolbar}
                        </AppBar>
                        <div className={classes.children}>{children}</div>
                        <div style={{ color: '#bfbfbf', textAlign: 'center'}}>
                            <Copyright />
                        </div>
                </MuiThemeProvider>
            </I18nextProvider>
        );
    }
}

export default withTracker(() => {
    return {
        user: Meteor.user(),
    };
})(
    withStyles(styles)(App)
);