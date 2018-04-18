import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import {translate} from "react-i18next";
import { withTracker } from 'meteor/react-meteor-data';
import { Characters } from '../../../../../api/character';
import {Button, Grid, Icon, IconButton, Paper, Tooltip, Typography} from "material-ui";
import {isCharacterEditable} from "../../../../helpers/authentication";

const styles = theme => ({
    root: {
        marginBottom: theme.spacing.unit * 1,
        textAlign: 'center'
    },
    iconWrapper: {
        paddingTop: theme.spacing.unit
    },
    icon: {
        fontSize: theme.spacing.unit * 4,
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

class Initiative extends Component {
    static propTypes = {
        classes: PropTypes.object.isRequired
    };

    updateInitiative = delta => () => {
        Meteor.call('character.setInitiative',
            this.props.character._id,
            this.props.character.initiative + delta
        );
    };

    render() {
        const { t, classes, character } = this.props;

        const editable = isCharacterEditable(character);

        const decreaseButton = editable
            ? (
                <Grid item>
                    <IconButton
                        classes={{ root: classes.button }}
                        onClick={this.updateInitiative(-1)}
                    >
                        <Icon>remove</Icon>
                    </IconButton>
                </Grid>
            ) : null;

        const increaseButton = editable
            ? (
                <Grid item>
                    <IconButton
                        classes={{ root: classes.button }}
                        onClick={this.updateInitiative(+1)}
                    >
                        <Icon>add</Icon>
                    </IconButton>
                </Grid>
            ) : null;

        return (
            <Grid item xs={2}>
                <Paper className={classes.root}>
                    <div className={classes.iconWrapper}>
                        <Icon className={classes.icon}>new_releases</Icon>
                    </div>
                    <Grid container justify="space-around" alignItems="center">
                        {decreaseButton}
                        <Grid item>
                            <Typography variant="subheading" className={classes.number}>
                                {character.initiative}
                            </Typography>
                        </Grid>
                        {increaseButton}
                    </Grid>
                    <Typography variant="caption" className={classes.unit}>
                        {t('initiative')}
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
})(
    translate('characters')(withStyles(styles)(Initiative))
);