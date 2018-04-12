import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import {translate} from "react-i18next";
import { withTracker } from 'meteor/react-meteor-data';
import { Characters } from '../../../../../api/character';
import {
    Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, Grid, Icon,
    Input, InputLabel, Paper,
    Typography
} from "material-ui";
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
    },
    dialogSpeedSeparator: {
        paddingLeft: theme.spacing.unit,
        paddingRight: theme.spacing.unit,
        paddingTop: theme.spacing.unit
    },
    dialogSpeedSeparatorWrapper: {
        textAlign: 'center',
        marginTop: theme.spacing.unit * 2
    },
    dialogInput: {
        textAlign: 'center',
        width: '100%'
    }
});

class Speed extends Component {
    static propTypes = {
        classes: PropTypes.object.isRequired
    };

    state = {
        open: false,
        speed: {}
    };

    handleClickOpen = () => {
        this.setState({ open: true });
    };

    handleClose = () => {
        this.setState({ open: false, speed: {} });
    };

    handleSave = () => {
        Meteor.call('character.setSpeed',
            this.props.character._id,
            Object.assign({}, this.props.character.speed, this.state.speed)
        );

        this.handleClose();
    };

    setBaseSpeed = event => {
        this.setState({
            speed: Object.assign({}, this.state.speed, { base: event.target.value })
        });
    };

    setTemporarySpeed = event => {
        this.setState({
            speed: Object.assign({}, this.state.speed, { temporary: event.target.value })
        });
    };

    render() {
        const { t, classes, character } = this.props;

        const editable = isCharacterEditable(character);

        return (
            <Grid item xs={2}>
                <Paper className={classes.root}>
                    <div className={classes.iconWrapper}>
                        <Icon className={classes.icon}>directions_run</Icon>
                    </div>
                    <Button className={classes.modifier} size="small" onClick={this.handleClickOpen} disabled={!editable}>
                        <Typography variant="subheading">
                            {`${character.speed.base}${character.speed.temporary > 0 ? ` + ${character.speed.temporary}` : ''}`}
                        </Typography>
                    </Button>
                    <Typography variant="caption" className={classes.unit}>
                        {t('speedUnit')}
                    </Typography>
                </Paper>
                <Dialog
                    open={this.state.open}
                    onClose={this.handleClose}
                >
                    <DialogTitle>Character speed</DialogTitle>
                    <DialogContent>
                        <DialogContentText>How fast are you going?</DialogContentText>
                        <Grid container justify="center" alignItems="center">
                            <Grid item xs={5}>
                                <FormControl margin="dense">
                                    <InputLabel htmlFor="base">Base speed</InputLabel>
                                    <Input
                                        autoFocus
                                        id="base"
                                        type="number"
                                        value={this.state.speed.base || character.speed.base}
                                        onChange={this.setBaseSpeed}
                                        classes={{ input: classes.dialogInput }}
                                    />
                                </FormControl>
                            </Grid>

                            <Grid item xs={2} className={classes.dialogSpeedSeparatorWrapper}>
                                <span className={classes.dialogSpeedSeparator}>+</span>
                            </Grid>

                            <Grid item xs={5}>
                                <FormControl margin="dense">
                                    <InputLabel htmlFor="temporary">Temporary buff</InputLabel>
                                    <Input
                                        id="temporary"
                                        type="number"
                                        value={this.state.speed.temporary || character.speed.temporary}
                                        onChange={this.setTemporarySpeed}
                                        classes={{ input: classes.dialogInput }}
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose}>Cancel</Button>
                        <Button onClick={this.handleSave} color="primary">Save</Button>
                    </DialogActions>
                </Dialog>
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
    translate('characters')(withStyles(styles)(Speed))
);