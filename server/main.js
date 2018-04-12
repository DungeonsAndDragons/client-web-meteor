import { Meteor } from 'meteor/meteor';
import {onServerStartup} from "../imports/startup/server";

Meteor.startup(() => {
    onServerStartup();
});
