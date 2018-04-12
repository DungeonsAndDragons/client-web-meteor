import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Accounts } from 'meteor/accounts-base'

import { withStyles } from 'material-ui/styles';
import {
    Button, CircularProgress, Divider, FormControl, FormHelperText, Grid, Input, InputLabel, Paper, TextField,
    Typography
} from "material-ui";
import {translate} from "react-i18next";
import {Link} from "found";

const styles = theme => ({
    wrapper: {
        textAlign: 'center'
    },
    root: theme.mixins.gutters({
        display: 'inline-block',
        flexGrow: 1,
        textAlign: 'center',
        maxWidth: '35em',
        paddingTop: 16,
        paddingBottom: 16,
        marginTop: theme.spacing.unit * 3,
        marginBottom: theme.spacing.unit * 3
    }),
    logo: {
        width: 50,
        height: 50,
    },
    registerButtonWrapper: {
        margin: theme.spacing.unit,
        position: 'relative'
    },
    registerButtonProgress: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -12,
        marginLeft: -12,
    },
});

class Register extends Component {
    static propTypes = {
        classes: PropTypes.object.isRequired
    };

    state = {
        username: '',
        password: '',
        passwordRepeat: '',
        email: ''
    };

    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
        });
    };

    handleKeyPress = event => {
        if (event.key === 'Enter') this.handleRegister();
    };

    handleRegister = () => {
        Accounts.createUser({
            username: this.state.username,
            password: this.state.password,
            email: this.state.email,
            profile: undefined
        }, (err) => {
            if (err) alert(err);
            else this.props.router.push(Session.get('redirectAfterLogin') || '/dashboard');
        });
    };

    render() {

        const { t, classes } = this.props;
        const registerInProgress = Meteor.loggingIn();

        const passwordsDontMatch = this.state.password !== this.state.passwordRepeat;

        return (
            <div className={classes.wrapper}>
                <Paper className={classes.root} elevation={4}>
                    <Grid container spacing={8} justify="center">
                        <Grid item xs={12}>
                            <Typography variant="headline" component="h1">
                                {t('register.title')}
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                id="username"
                                label={t('username')}
                                margin="normal"
                                value={this.state.name}
                                onChange={this.handleChange('username')}
                                onKeyPress={this.handleKeyPress}
                            />
                            <TextField
                                id="email"
                                label={t('email')}
                                margin="normal"
                                value={this.state.email}
                                onChange={this.handleChange('email')}
                                onKeyPress={this.handleKeyPress}
                            />
                        </Grid>
                        <Grid item xs={12} />
                        <Grid item xs={6}>
                            <TextField
                                id="password"
                                label={t('password')}
                                type="password"
                                autoComplete="new-password"
                                margin="normal"
                                onChange={this.handleChange('password')}
                                onKeyPress={this.handleKeyPress}
                            />

                            <FormControl error={passwordsDontMatch} aria-describedby="repeat-password-text" margin="normal">
                                <InputLabel htmlFor="repeat-password">{t('register.passwordRepeat')}</InputLabel>
                                <Input
                                    id="repeat-password"
                                    type="password"
                                    value={this.state.passwordRepeat}
                                    onChange={this.handleChange('passwordRepeat')}
                                    onKeyPress={this.handleKeyPress}
                                />
                                {passwordsDontMatch
                                    ? <FormHelperText id="repeat-password-text">{t('register.passwordMismatch')}</FormHelperText>
                                    : null}
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <div className={classes.registerButtonWrapper}>
                                <Button
                                    color="primary"
                                    disabled={registerInProgress || passwordsDontMatch}
                                    onClick={this.handleRegister}
                                >
                                    {t('register.submit')}
                                </Button>
                                {registerInProgress && <CircularProgress size={24} className={classes.registerButtonProgress} />}
                            </div>
                        </Grid>
                    </Grid>
                </Paper>
                <Typography variant="caption">
                    {t('alreadyHaveAccount')} <Link to={{ pathname: '/login' }}>{t('loginLinkTitle')}</Link>
                </Typography>
            </div>
        );
    }
}

export default translate('userManagement')(withStyles(styles)(Register));