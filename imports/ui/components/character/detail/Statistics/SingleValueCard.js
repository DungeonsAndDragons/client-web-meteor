import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { translate } from 'react-i18next';
import { withTracker } from 'meteor/react-meteor-data';
import { Characters } from '../../../../../api/character';
import { Grid, Icon, IconButton, Paper, Typography } from 'material-ui';
import { isCharacterEditable } from '../../../../helpers/authentication';

const styles = theme => ({
    root: {
        marginBottom: theme.spacing.unit * 1,
        textAlign: 'center'
    },
    iconWrapper: {
        paddingTop: theme.spacing.unit
    },
    icon: {
        fontSize: theme.spacing.unit * 4
    },
    unit: {
        paddingBottom: theme.spacing.unit
    },
    button: {
        width: theme.spacing.unit * 4,
        height: theme.spacing.unit * 4,
        fontSize: theme.spacing.unit * 1
    },
    number: {
        fontSize: '1rem',
        paddingTop: 7,
        paddingBottom: 7
    }
});

class SingleValueCard extends Component {
    static propTypes = {
        classes: PropTypes.object.isRequired,
        icon: PropTypes.string.isRequired,
        labelKey: PropTypes.string.isRequired,
        valueKey: PropTypes.string.isRequired,
        method: PropTypes.string.isRequired
    };

    updateValue = delta => () => {
        Meteor.call(
            this.props.method,
            this.props.character._id,
            this.props.character[this.props.valueKey] + delta
        );
    };

    render() {
        const { t, classes, character, icon, labelKey, valueKey } = this.props;

        const editable = isCharacterEditable(character);

        const decreaseButton = editable ? (
            <Grid item>
                <IconButton
                    classes={{ root: classes.button }}
                    onClick={this.updateValue(-1)}
                >
                    <Icon>remove</Icon>
                </IconButton>
            </Grid>
        ) : null;

        const increaseButton = editable ? (
            <Grid item>
                <IconButton
                    classes={{ root: classes.button }}
                    onClick={this.updateValue(+1)}
                >
                    <Icon>add</Icon>
                </IconButton>
            </Grid>
        ) : null;

        return (
            <Grid item xs={2}>
                <Paper className={classes.root}>
                    <div className={classes.iconWrapper}>
                        <Icon className={classes.icon}>{icon}</Icon>
                    </div>
                    <Grid container justify="space-around" alignItems="center">
                        {decreaseButton}
                        <Grid item>
                            <Typography
                                variant="subheading"
                                className={classes.number}
                            >
                                {character[valueKey]}
                            </Typography>
                        </Grid>
                        {increaseButton}
                    </Grid>
                    <Typography variant="caption" className={classes.unit}>
                        {t(labelKey)}
                    </Typography>
                </Paper>
            </Grid>
        );
    }
}

export default withTracker(props => {
    Meteor.subscribe('characters');

    return {
        character: Characters.findOne({ _id: props.characterID })
    };
})(translate('characters')(withStyles(styles)(SingleValueCard)));
