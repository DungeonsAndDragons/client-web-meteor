import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { translate } from 'react-i18next';
import { withTracker } from 'meteor/react-meteor-data';
import { Characters } from '../../../../../api/character';

import { Grid, ListSubheader, Typography } from 'material-ui';
import Skill from './Skill';
import Speed from './Speed';
import DeathSaves from './DeathSaves';
import SingleValueCard from './SingleValueCard';

const styles = theme => ({
    root: {
        marginLeft: theme.spacing.unit * 3,
        marginRight: theme.spacing.unit * 3,
        marginBottom: theme.spacing.unit * 3
    },
    cardHeader: {
        textAlign: 'center',
        paddingTop: theme.spacing.unit
    }
});

class Statistics extends Component {
    static propTypes = {
        classes: PropTypes.object.isRequired
    };

    render() {
        const { t, classes, character } = this.props;

        return (
            <div className={classes.root}>
                <Grid container justify="center">
                    {/* ---- Skills ---- */}
                    <Grid item xs={12}>
                        <ListSubheader>Skills</ListSubheader>
                    </Grid>
                    <Grid item xs={12}>
                        {/* TODO Move this to a better location */}
                        <Typography
                            variant="caption"
                            style={{ textAlign: 'center' }}
                        >
                            Proficiency bonus: {character.proficiencyBonus}
                        </Typography>
                    </Grid>
                    {Object.keys(character.skills).map(skillType => (
                        <Skill
                            characterID={character._id}
                            skillType={skillType}
                            key={skillType}
                        />
                    ))}

                    {/* ---- Combat & Health ---- */}
                    <Grid item xs={12}>
                        <ListSubheader>Combat</ListSubheader>
                    </Grid>

                    <Speed characterID={character._id} />
                    <SingleValueCard
                        icon="new_releases"
                        labelKey="initiative"
                        valueKey="initiative"
                        method="character.setInitiative"
                        characterID={character._id}
                    />
                    <DeathSaves characterID={character._id} />
                    <SingleValueCard
                        icon="security"
                        labelKey="armorClass"
                        valueKey="armorClass"
                        method="character.setArmorClass"
                        characterID={character._id}
                    />

                    <Grid item>(Hit dice, Weponry)</Grid>

                    {/* ---- Other ---- */}
                    <Grid item xs={12}>
                        <ListSubheader>Other</ListSubheader>
                    </Grid>
                    <Grid item xs={4}>
                        Saving throws
                    </Grid>
                    <Grid item xs={4}>
                        (Inspiration, Passive perception, Player Name, XP,
                        Class, Alignment, Race, BG)
                    </Grid>
                </Grid>
            </div>
        );
    }
}

export default withTracker(props => {
    Meteor.subscribe('characters');

    return {
        character: Characters.findOne({ _id: props.characterID })
    };
})(translate('characters')(withStyles(styles)(Statistics)));
