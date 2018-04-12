import { Meteor } from 'meteor/meteor';
import {onClientStartup} from "../imports/startup/client";

Meteor.startup(() => {
    onClientStartup();
});