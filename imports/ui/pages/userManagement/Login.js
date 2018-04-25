import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import {
    Button,
    CircularProgress,
    Grid,
    Paper,
    TextField,
    Typography
} from 'material-ui';
import { translate } from 'react-i18next';
import { Link } from 'found';

const styles = theme => ({
    wrapper: {
        textAlign: 'center'
    },
    root: theme.mixins.gutters({
        display: 'inline-block',
        flexGrow: 1,
        textAlign: 'center',
        maxWidth: '40em',
        paddingTop: 16,
        paddingBottom: 16,
        marginTop: theme.spacing.unit * 3,
        marginBottom: theme.spacing.unit * 3
    }),
    logo: {
        width: 160,
        height: 160
    },
    loginButtonWrapper: {
        margin: theme.spacing.unit,
        position: 'relative'
    },
    loginButtonProgress: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -12,
        marginLeft: -12
    }
});

class Login extends Component {
    static propTypes = {
        classes: PropTypes.object.isRequired
    };

    state = {
        name: '',
        password: ''
    };

    handleChange = name => event => {
        this.setState({
            [name]: event.target.value
        });
    };

    handleKeyPress = event => {
        if (event.key === 'Enter') this.handleLogin();
    };

    handleLogin = () => {
        Meteor.loginWithPassword(this.state.name, this.state.password, err => {
            if (err) alert(err);
            else this.redirectAfterLogin();
        });
    };

    redirectAfterLogin = () => {
        this.props.router.push(
            Session.get('redirectAfterLogin') || '/dashboard'
        );
    };

    componentWillMount() {
        if (Meteor.userId()) this.redirectAfterLogin();
    }

    render() {
        const { t, classes } = this.props;

        const loginInProgress = Meteor.loggingIn();

        return (
            <div className={classes.wrapper}>
                <Paper className={classes.root} elevation={4}>
                    <Grid container spacing={8}>
                        <Grid item xs={12}>
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'center'
                                }}
                            >
                                <img
                                    alt="DnD"
                                    src="/dnd_logo.png"
                                    className={classes.logo}
                                />
                            </div>
                            <Typography variant="headline" component="h1">
                                {t('login.title')}
                            </Typography>
                            <Typography
                                variant="subheading"
                                style={{ color: '#a0a0a0' }}
                            >
                                {t('login.subtitle')}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                id="name"
                                label={t('username')}
                                value={this.state.name}
                                onChange={this.handleChange('name')}
                                onKeyPress={this.handleKeyPress}
                                margin="normal"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                id="password"
                                label={t('password')}
                                type="password"
                                autoComplete="current-password"
                                onChange={this.handleChange('password')}
                                onKeyPress={this.handleKeyPress}
                                margin="normal"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <div className={classes.loginButtonWrapper}>
                                <Button
                                    color="primary"
                                    disabled={loginInProgress}
                                    onClick={this.handleLogin}
                                >
                                    Login
                                </Button>
                                {loginInProgress && (
                                    <CircularProgress
                                        size={24}
                                        className={classes.loginButtonProgress}
                                    />
                                )}
                            </div>
                        </Grid>
                    </Grid>
                </Paper>
                <Typography variant="caption">
                    {t('noAccountYet')}{' '}
                    <Link to={{ pathname: '/register' }}>
                        {t('registerLinkTitle')}
                    </Link>
                </Typography>
            </div>
        );
    }
}

export default translate('userManagement')(withStyles(styles)(Login));
