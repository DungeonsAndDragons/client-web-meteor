import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import {translate} from "react-i18next";
import { withTracker } from 'meteor/react-meteor-data';
import { Characters } from '../../../../../api/character';

const styles = theme => ({

});

class HitDice extends Component {
    static propTypes = {
        classes: PropTypes.object.isRequired
    };

    render() {
        const { t, classes, character } = this.props;

        return (
            <div>
                Hi there!
            </div>
        );
    }
}

export default withTracker(props => {
    Meteor.subscribe('characters');

    return {
        character: Characters.findOne({ _id: props.characterID })
    };
})(
    translate('character')(withStyles(styles)(HitDice))
);