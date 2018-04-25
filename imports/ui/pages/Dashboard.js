import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';

import CharacterList from '../components/character/list/CharacterList';
import { Grid } from 'material-ui';

const styles = theme => ({
    root: {
        margin: theme.spacing.unit * 3
    }
});

class Dashboard extends Component {
    static propTypes = {
        classes: PropTypes.object.isRequired
    };

    render() {
        const { classes } = this.props;

        return (
            <div className={classes.root}>
                <Grid container spacing={24}>
                    <Grid item xs={6}>
                        <CharacterList />
                    </Grid>
                    <Grid item xs={6}>
                        Session list
                    </Grid>
                </Grid>
            </div>
        );
    }
}

export default withStyles(styles)(Dashboard);
