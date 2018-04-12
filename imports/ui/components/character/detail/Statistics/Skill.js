import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import {translate} from "react-i18next";
import { withTracker } from 'meteor/react-meteor-data';
import { Characters } from '../../../../../api/character';
import {Grid, Icon, IconButton, Paper, Typography} from "material-ui";
import {isCharacterEditable} from "../../../../helpers/authentication";

const styles = theme => ({
    skillTitle: {
        textAlign: 'center',
        paddingTop: theme.spacing.unit
    },
    skillAvatarContainer: {
        padding: theme.spacing.unit * 2
    },
    skillBottom: {
        padding: theme.spacing.unit * 1,
    },
    skillNumberActive: {
        backgroundColor: theme.palette.primary.light,
        color: theme.palette.primary.contrastText
    },
    skillNumberInactive: {
        backgroundColor: '#bdbdbd',
        color: theme.palette.secondary.contrastText
    },
    skillButton: {
        width: theme.spacing.unit * 4,
        height: theme.spacing.unit * 4
    },
    skillNumberButton: {
        fontSize: '1.25rem',
        width: theme.spacing.unit * 5,
        height: theme.spacing.unit * 5
    }
});

class Skills extends Component {
    static propTypes = {
        classes: PropTypes.object.isRequired
    };

    getCurrentSkill = () => this.props.character.skills[this.props.skillType];

    toggleSkillProficiency = () => {
        Meteor.call('character.setSkillProficiency',
            this.props.character._id,
            this.props.skillType,
            !this.getCurrentSkill().proficiency
        );
    };

    updateSkillModifier = delta => () => {
        Meteor.call('character.setSkillModifier',
            this.props.character._id,
            this.props.skillType,
            this.getCurrentSkill().modifier + delta
        );
    };

    render() {
        const { t, classes, character, skillType } = this.props;

        const skill = character.skills[skillType];

        const editable = isCharacterEditable(character);

        const skillGridItemProps = editable ? { xs: 4, sm: 3, md: 4, lg: 3 } : { xs: 4, sm: 3, lg: 2 };

        const decreaseButton = editable
            ? (<Grid item>
                    <IconButton
                        classes={{ root: classes.skillButton }}
                        onClick={this.updateSkillModifier(-1)}
                    >
                        <Icon>remove</Icon>
                    </IconButton>
                </Grid>
            ) : null;

        const increaseButton = editable
            ? (<Grid item>
                    <IconButton
                        classes={{ root: classes.skillButton }}
                        onClick={this.updateSkillModifier(1)}
                    >
                        <Icon>add</Icon>
                    </IconButton>
                </Grid>
            ) : null;

        return (
            <Grid item {...skillGridItemProps} zeroMinWidth>
                <Paper>
                    <Typography variant="caption" className={classes.skillTitle} noWrap>
                        {t(`skill.${skillType}`)}
                    </Typography>
                    <Grid container justify="space-around" alignItems="center" className={classes.skillBottom}>
                        {decreaseButton}
                        <Grid item>
                            <IconButton
                                className={skill.proficiency ? classes.skillNumberActive : classes.skillNumberInactive}
                                classes={{ root: classes.skillNumberButton }}
                                onClick={this.toggleSkillProficiency}
                                disabled={!editable}
                            >
                                {skill.modifier}
                            </IconButton>
                        </Grid>
                        {increaseButton}
                    </Grid>
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
    translate('characters')(withStyles(styles)(Skills))
);