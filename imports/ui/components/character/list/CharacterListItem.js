import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';

import { withTracker } from 'meteor/react-meteor-data';
import { Characters } from "../../../../api/character";
import {Card, CardContent, CardMedia, Typography} from "material-ui";
import {Link} from "found";
import Loader from "../../loader/loader";

const styles = theme => ({
    root: {
        padding: theme.spacing.unit * 2,
        textAlign: 'center',
        color: theme.palette.text.secondary
    },
    card: {
        backgroundColor: theme.palette.grey['100'],
        border: '1px solid #d3d3d3',
        cursor: 'pointer',
        transitionProperty: 'border',
        transitionDuration: 0.5,
        '&:hover': {
            border: `1px solid ${theme.palette.primary.main}`
        }
    },
    cardContent: {
        backgroundColor: theme.palette.background.paper,
        borderTop: '1px solid #d3d3d3'
    }
});

class CharacterListItem extends Component {
    static propTypes = {
        classes: PropTypes.object.isRequired
    };

    render() {
        const { classes, character, imageHeight } = this.props;

        if (!character)
            return <Loader text="Loading character" />;

        return (
            <Link
                Component={Card}
                className={classes.card}
                to={{ pathname: `/character/${character._id}` }}
            >
                <CardMedia
                    style={{ height: imageHeight ? imageHeight : 300 }}
                    image='/Character.png' // TODO Replace this with the actual image
                    title={character.name}
                />
                <CardContent className={classes.cardContent}>
                    <Typography variant="headline" component="h3" noWrap>
                        {character.name}
                    </Typography>
                    <Typography variant="caption" component="p">
                        {character.owner() ? character.owner().username : ''}
                    </Typography>
                </CardContent>
            </Link>
        );
    }
}

export default withTracker(props => {
    Meteor.subscribe('characters');

    return {
        character: Characters.findOne({ _id: props.id }),
    };
})(
    withStyles(styles)(CharacterListItem)
);