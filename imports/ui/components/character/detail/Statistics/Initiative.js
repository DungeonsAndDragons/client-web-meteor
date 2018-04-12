import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import {translate} from "react-i18next";
import { withTracker } from 'meteor/react-meteor-data';
import { Characters } from '../../../../../api/character';
import {Button, Grid, Icon, Paper, Tooltip, Typography} from "material-ui";
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
        fontSize: theme.spacing.unit * 4
    },
    unit: {
        paddingBottom: theme.spacing.unit
    }
});

class Initiative extends Component {
    static propTypes = {
        classes: PropTypes.object.isRequired
    };

    render() {
        const { t, classes, character } = this.props;

        const editable = isCharacterEditable(character);

        return (
            <Grid item xs={2}>
                <Paper className={classes.root}>
                    <div className={classes.iconWrapper}>
                        <Icon className={classes.icon}>new_releases</Icon>
                    </div>
                    <Grid container>
                        <Grid item xs={4}>-</Grid>
                        <Grid item xs={4}>
                            <Button className={classes.modifier} size="small" disabled={!editable}>
                                <Typography variant="subheading">
                                    {character.initiative}
                                </Typography>
                            </Button>
                        </Grid>
                        <Grid item xs={4}>+</Grid>
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