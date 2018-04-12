import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';

import {Grid, Tab, Tabs, Typography, Paper, Tooltip, Button, TextField, FormControl, Input} from "material-ui";
import SwipeableViews from 'react-swipeable-views';

import { withTracker } from 'meteor/react-meteor-data';
import { Characters } from "../../api/character";
import Loader from "../components/loader/loader";
import {translate} from "react-i18next";
import Statistics from "../components/character/detail/Statistics/Statistics";
import {isCharacterEditable} from "../helpers/authentication";

const styles = theme => ({
    root: {
        marginLeft: theme.spacing.unit * 3,
        marginRight: theme.spacing.unit * 3,
        marginBottom: theme.spacing.unit * 3
    },
    imageContainer: {
        textAlign: 'center'
    },
    image: {
        width: '100%'
    },
    leftStatsGrid: {
        height: '100%',
        padding: '0 1em'
    },
    modifier: {
        marginTop: '2em',
        marginBottom: '2em'
    },
    hp: {
        fontSize: '12pt'
    },
    characterName: {
        fontSize: '15pt',
        textAlign: 'center',
        width: '100%'
    },
    abilityContainer: {
        marginBottom: theme.spacing.unit * 1
    },
    abilityTitle: {
        paddingTop: theme.spacing.unit
    },
    modifierScoreContainer: {
        position: 'relative',
        bottom: '-0.7em',
        height: '1.4em'
    },
    modifierScore: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        color: '#fff',
        padding: '4px 8px',
        fontSize: '0.625rem',
        lineHeight: '1.4em',
        borderRadius: '2px',
        backgroundColor: '#616161',
        opacity: 0.9,
        textAlign: 'center',
    }
});

class CharacterDetail extends Component {
    static propTypes = {
        classes: PropTypes.object.isRequired
    };

    state = {
        selectedTab: 0,
    };

    handleTabChange = (event, selectedTab) => {
        this.setState({ selectedTab });
    };

    handleTabIndexChange = index => {
        this.setState({ selectedTab: index });
    };

    setCharacterName = event => {
        if (this.setCharacterNameTimeout) clearTimeout(this.setCharacterNameTimeout);

        const newName = event.target.value;

        this.setCharacterNameTimeout = setTimeout(() =>
            Meteor.call('character.setName', this.props.character._id, newName), 1000);
    };

    render() {
        const { t, classes, character } = this.props;

        if (!character)
            return <Loader text={t('loading')} />;

        const editable = isCharacterEditable(character);
        const { health, abilities } = character;

        const stats = [
            { type: 'Strength', score: 9, modifier: -1 },
            { type: 'Dexterity', score: 13, modifier: 1 },
            { type: 'Constitution', score: 12, modifier: 1 },
            { type: 'Intelligence', score: 19, modifier: 4 },
            { type: 'Wisdom', score: 12, modifier: 1 },
            { type: 'Charisma', score: 11, modifier: 0 }
        ];

        return (
            <div className={classes.root}>
                <Grid container spacing={40}>
                    {/*  --  Left column  --  */}
                    <Grid item xs={12} md={4} className={classes.imageContainer}>
                        <Grid container spacing={24}>
                            {/*  --  Character image & HP --  */}
                            <Grid item xs={12} sm={4} md={12}>
                                <img
                                    src='/Character.png' // TODO Replace this with the actual image
                                    className={classes.image}
                                />

                                {editable
                                    ? (<div>
                                            <FormControl margin="normal">
                                                <Input
                                                    id="charName"
                                                    defaultValue={character.name}
                                                    classes={{input: classes.characterName}}
                                                    onChange={this.setCharacterName}
                                                />
                                            </FormControl>
                                        </div>
                                    )
                                    : (<Typography variant="headline" gutterBottom>
                                            {character.name}
                                        </Typography>
                                    )
                                }

                                <Tooltip title={t('health.tooltip', { current: health.current, temporary: health.temporary })}>
                                    <Button size="small">
                                        <Typography variant="caption" className={classes.hp}>
                                            {`${health.current}${health.temporary > 0 ? ` + ${health.temporary}` : ''} / ${health.maximum} HP`}
                                        </Typography>
                                    </Button>
                                </Tooltip>
                            </Grid>
                            {/*  --  Most important character stats  --  */}
                            <Grid item xs={12} sm={8} md={12}>
                                <Grid container spacing={24} alignItems="center" justify="center" className={classes.leftStatsGrid}>
                                    {Object.keys(abilities).map(ability => (
                                        <Grid item xs={4} key={ability} zeroMinWidth>
                                            <Paper className={classes.abilityContainer}>
                                                <Typography variant="caption" noWrap className={classes.abilityTitle}>
                                                    {t(`ability.${ability}`)}
                                                </Typography>
                                                <Button className={classes.modifier} size="small" disabled={!editable}>
                                                    <Typography variant="subheading">
                                                        {abilities[ability].modifier}
                                                    </Typography>
                                                </Button>
                                                <Grid container justify="center" className={classes.modifierScoreContainer}>
                                                    <Grid item style={{ padding: 0 }}>
                                                        <div className={classes.modifierScore}>
                                                            {t('ability.score', { score: abilities[ability].score })}
                                                        </div>
                                                    </Grid>
                                                </Grid>
                                            </Paper>
                                        </Grid>
                                    ))}
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    {/*  --  Right column  --  */}
                    <Grid item xs={12} md={8}>
                        <Tabs
                            value={this.state.selectedTab}
                            onChange={this.handleTabChange}
                            indicatorColor="primary"
                            textColor="primary"
                            centered
                        >
                            <Tab label={t('tab.stats')} />
                            <Tab label={t('tab.spells')} />
                            <Tab label={t('tab.inventory')} />
                            <Tab label={t('tab.background')} />
                        </Tabs>

                        <SwipeableViews
                            axis="x"
                            index={this.state.selectedTab}
                            onChangeIndex={this.handleTabIndexChange}
                        >
                            <Statistics characterID={character._id} />
                            <div>{t('tab.spells')}</div>
                            <div>{t('tab.inventory')}</div>
                            <div>{t('tab.background')}</div>
                        </SwipeableViews>
                    </Grid>
                </Grid>
            </div>
        );
    }
}

export default withTracker(props => {
    Meteor.subscribe('characters');

    return {
        character: Characters.findOne({ _id: props.params.characterID })
    };
})(
    translate('characters')(withStyles(styles)(CharacterDetail))
);