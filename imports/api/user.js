
// TODO This is leaking data about users. Replace it with a proper way of publishing the user ID -> username correlation
if (Meteor.isServer) Meteor.publish('users', () => Meteor.users.find());