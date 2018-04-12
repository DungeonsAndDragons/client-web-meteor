import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import SimpleSchema from 'simpl-schema';

export const Characters = new Mongo.Collection('characters');

Characters.helpers({
    owner() {
        return Meteor.users.findOne({ _id: this.ownerID });
    }
});

const healthSchema = new SimpleSchema({
    current: { type: SimpleSchema.Integer, min: 0, defaultValue: 0 },
    maximum: { type: SimpleSchema.Integer, min: 0, defaultValue: 0 },
    temporary: { type: SimpleSchema.Integer, min: 0, defaultValue: 0 }
});

const abilitySchema = new SimpleSchema({
    score: { type: SimpleSchema.Integer, min: 3 },
    modifier: SimpleSchema.Integer
});

const abilitiesSchema = new SimpleSchema({
    str: abilitySchema,
    dex: abilitySchema,
    con: abilitySchema,
    int: abilitySchema,
    wis: abilitySchema,
    cha: abilitySchema
});

const skillSchema = new SimpleSchema({
    modifier: SimpleSchema.Integer,
    proficiency: Boolean
});

const skillsSchema = new SimpleSchema({
    acrobatics: skillSchema,
    animalHandling: skillSchema,
    arcana: skillSchema,
    athletics: skillSchema,
    deception: skillSchema,
    history: skillSchema,
    insight: skillSchema,
    intimidation: skillSchema,
    investigation: skillSchema,
    medicine: skillSchema,
    nature: skillSchema,
    perception: skillSchema,
    performance: skillSchema,
    persuasion: skillSchema,
    religion: skillSchema,
    sleightOfHand: skillSchema,
    stealth: skillSchema,
    survival: skillSchema
});

const speedSchema = new SimpleSchema({
    base: SimpleSchema.Integer,
    temporary: SimpleSchema.Integer
});

Characters.schema = new SimpleSchema({
    name: { type: String, defaultValue: 'Unnamed' },
    health: healthSchema,
    abilities: abilitiesSchema,
    skills: skillsSchema,
    proficiencyBonus: SimpleSchema.Integer,
    speed: speedSchema, // feet per round
    initiative: SimpleSchema.Integer,
    ownerID: String
});

Characters.attachSchema(Characters.schema);

if (Meteor.isServer) Meteor.publish('characters', () => Characters.find());

const validateEditPermission = (charID, userID) => {
    const char = Characters.findOne({ _id: charID });
    if (!char) throw new Meteor.Error('not-found');
    const ownerID = char.ownerID;

    if (!userID || userID && userID !== ownerID)
        throw new Meteor.Error('not-authorized');
};

Meteor.methods({
    'character.setName'(charID, name) {
        check(charID, String);
        check(name, String);

        validateEditPermission(charID, this.userId);

        Characters.update(charID, { $set: { name: name || 'Unnamed' } });
    },
    'character.setHealth'(charID, health) {
        check(charID, String);
        check(health, Object);

        validateEditPermission(charID, this.userId);

        Characters.update(charID, { $set: { health: health } });
    },
    'character.setSkillProficiency'(charID, skillType, proficient) {
        check(charID, String);
        check(skillType, String);
        check(proficient, Boolean);

        validateEditPermission(charID, this.userId);

        Characters.update(charID, { $set: { [`skills.${skillType}.proficiency`]: proficient } });
    },
    'character.setSkillModifier'(charID, skillType, modifier) {
        check(charID, String);
        check(skillType, String);
        check(modifier, Number);

        validateEditPermission(charID, this.userId);

        Characters.update(charID, { $set: { [`skills.${skillType}.modifier`]: modifier } });
    },
    'character.setSpeed'(charID, speed) {
        check(charID, String);

        validateEditPermission(charID, this.userId);

        Characters.update(charID, { $set: { speed } });
    }
    // 'tasks.insert'(text) {
    //     check(text, String);
    //
    //     // Make sure the user is logged in before inserting a task
    //     if (!this.userId) {
    //         throw new Meteor.Error('not-authorized');
    //     }
    //
    //     Tasks.insert({
    //         text,
    //         createdAt: new Date(),
    //         owner: this.userId,
    //         username: Meteor.users.findOne(this.userId).username,
    //     });
    // },
    // 'tasks.remove'(taskId) {
    //     check(taskId, String);
    //
    //     Tasks.remove(taskId);
    // }
});