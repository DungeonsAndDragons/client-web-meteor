import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';

import { withTracker } from 'meteor/react-meteor-data';
import { Characters } from "../../../../api/character";

import { Grid, ListSubheader } from "material-ui";
import CharacterListItem from "./CharacterListItem";

const styles = theme => ({
});

class CharacterList extends Component {
    static propTypes = {
        classes: PropTypes.object.isRequired
    };

    render() {
        const { classes, characters } = this.props;

        const userID = Meteor.userId();

        const ownCharacters = characters.filter(char => char.ownerID === userID);
        const otherCharacters = characters.filter(char => char.ownerID !== userID);

        return (
            <Grid container spacing={24}>
                <Grid item xs={12}>
                    <ListSubheader component="div">Your characters</ListSubheader>
                </Grid>
                {ownCharacters.map(character => (
                    <Grid item xs={12} md={6} key={character._id}>
                        <CharacterListItem id={character._id} imageHeight={500}/>
                    </Grid>
                ))}
                <Grid item xs={12}>
                    <ListSubheader component="div">Other characters</ListSubheader>
                </Grid>
                {otherCharacters.map(character => (
                    <Grid item xs={6} md={4} key={character._id}>
                        <CharacterListItem id={character._id}/>
                    </Grid>
                ))}
            </Grid>
        );
    }
}

export default withTracker(() => {
    Meteor.subscribe('characters');
    Meteor.subscribe('users'); // TODO: This does not appear to work!

    return {
        characters: Characters.find({}).fetch(),
    };
})(
    withStyles(styles)(CharacterList)
);