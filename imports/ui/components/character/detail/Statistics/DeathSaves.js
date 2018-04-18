import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import {translate} from "react-i18next";
import { withTracker } from 'meteor/react-meteor-data';
import { Characters } from '../../../../../api/character';
import {Checkbox, Grid, Icon, IconButton, Paper, Typography} from "material-ui";
import green from "material-ui/colors/green";

const styles = theme => ({
    root: {
        marginBottom: theme.spacing.unit * 1,
        textAlign: 'center'
    },
    green: {
        color: green[500],
    },
    red: {
        color: theme.palette.primary.main
    }
});

class DeathSaves extends Component {
    static propTypes = {
        classes: PropTypes.object.isRequired
    };

    setDeathSaves = (successes, failures) => {
        Meteor.call('character.setDeathSaves', this.props.character._id, successes, failures);
    };

    setDeathSaveSuccesses = successes => () => {
        this.setDeathSaves(successes, this.props.character.deathSaves.failures);
    };

    setDeathSaveFailures = failures => () => {
        this.setDeathSaves(this.props.character.deathSaves.successes, failures);
    };

    render() {
        const { t, classes, character } = this.props;

        const { successes, failures } = character.deathSaves;

        return (
            <Grid item xs={3}>
                <Paper className={classes.root}>
                    <div>
                        <IconButton onClick={this.setDeathSaveSuccesses(0)}>
                            <Icon>verified_user</Icon>
                        </IconButton>
                        <Checkbox classes={{checked: classes.green}} onClick={this.setDeathSaveSuccesses(1)} checked={successes > 0} />
                        <Checkbox classes={{checked: classes.green}} onClick={this.setDeathSaveSuccesses(2)} checked={successes > 1} />
                        <Checkbox classes={{checked: classes.green}} onClick={this.setDeathSaveSuccesses(3)} checked={successes > 2} />
                    </div>
                    <div>
                        <IconButton onClick={this.setDeathSaveFailures(0)}>
                            <Icon>error</Icon>
                        </IconButton>
                        <Checkbox classes={{checked: classes.red}} checkedIcon={<Icon>indeterminate_check_box</Icon>} onClick={this.setDeathSaveFailures(1)} checked={failures > 0} />
                        <Checkbox classes={{checked: classes.red}} checkedIcon={<Icon>indeterminate_check_box</Icon>} onClick={this.setDeathSaveFailures(2)} checked={failures > 1} />
                        <Checkbox classes={{checked: classes.red}} checkedIcon={<Icon>indeterminate_check_box</Icon>} onClick={this.setDeathSaveFailures(3)} checked={failures > 2} />
                    </div>

                    <Typography variant="caption" className={classes.unit}>
                        {t('deathSaves')}
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
    translate('characters')(withStyles(styles)(DeathSaves))
);