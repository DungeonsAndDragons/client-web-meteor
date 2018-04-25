import { Characters } from '../../api/character.js';
import { DiceThrow } from '../../ui/helpers/Dice';

export function createCharacterFixtures() {
    if (Characters.find().count() === 0) {
        const getRandomModifier = () => Math.floor(Math.random() * 15) - 5;
        const getRandomScore = () => Math.floor(Math.random() * 57) + 3;
        const getRandomBool = () => Math.random() > 0.5;

        const getRandomUpTo = max => Math.floor(Math.random() * max);

        const diceSides = [4, 6, 8, 10, 12, 20];
        const getRandomDiceThrow = () =>
            new DiceThrow(
                0,
                getRandomUpTo(5),
                diceSides[getRandomUpTo(diceSides.length - 1)],
                getRandomUpTo(10)
            );

        const getRandomName = () => {
            return `Mindartis ${getRandomScore()}`;
        };

        const getRandomOwner = () => {
            const users = Meteor.users.find().fetch();
            return users[Math.floor(Math.random() * users.length)]._id;
        };

        const getRandomHealth = () => {
            const maximum = getRandomScore();
            const temporary = Math.floor(getRandomScore() * 0.5);
            const current = Math.floor(maximum * Math.random());

            return { current, temporary, maximum };
        };

        const getRandomAbilities = () => ({
            str: { score: getRandomScore(), modifier: getRandomModifier() },
            dex: { score: getRandomScore(), modifier: getRandomModifier() },
            con: { score: getRandomScore(), modifier: getRandomModifier() },
            int: { score: getRandomScore(), modifier: getRandomModifier() },
            wis: { score: getRandomScore(), modifier: getRandomModifier() },
            cha: { score: getRandomScore(), modifier: getRandomModifier() }
        });

        const getRandomSkills = () => ({
            acrobatics: {
                modifier: getRandomModifier(),
                proficiency: getRandomBool()
            },
            animalHandling: {
                modifier: getRandomModifier(),
                proficiency: getRandomBool()
            },
            arcana: {
                modifier: getRandomModifier(),
                proficiency: getRandomBool()
            },
            athletics: {
                modifier: getRandomModifier(),
                proficiency: getRandomBool()
            },
            deception: {
                modifier: getRandomModifier(),
                proficiency: getRandomBool()
            },
            history: {
                modifier: getRandomModifier(),
                proficiency: getRandomBool()
            },
            insight: {
                modifier: getRandomModifier(),
                proficiency: getRandomBool()
            },
            intimidation: {
                modifier: getRandomModifier(),
                proficiency: getRandomBool()
            },
            investigation: {
                modifier: getRandomModifier(),
                proficiency: getRandomBool()
            },
            medicine: {
                modifier: getRandomModifier(),
                proficiency: getRandomBool()
            },
            nature: {
                modifier: getRandomModifier(),
                proficiency: getRandomBool()
            },
            perception: {
                modifier: getRandomModifier(),
                proficiency: getRandomBool()
            },
            performance: {
                modifier: getRandomModifier(),
                proficiency: getRandomBool()
            },
            persuasion: {
                modifier: getRandomModifier(),
                proficiency: getRandomBool()
            },
            religion: {
                modifier: getRandomModifier(),
                proficiency: getRandomBool()
            },
            sleightOfHand: {
                modifier: getRandomModifier(),
                proficiency: getRandomBool()
            },
            stealth: {
                modifier: getRandomModifier(),
                proficiency: getRandomBool()
            },
            survival: {
                modifier: getRandomModifier(),
                proficiency: getRandomBool()
            }
        });

        const getRandomSpeed = () => ({
            base: Math.floor(Math.random() * 4) * 5 + 25,
            temporary: Math.floor(Math.random() * 10) * 5
        });

        const getRandomDeathSaves = () => ({
            successes: getRandomUpTo(3),
            failures: getRandomUpTo(3)
        });

        const getRandomHitDice = () => ({
            total: Array.from(Array(3), getRandomDiceThrow),
            remaining: Array.from(Array(3), getRandomDiceThrow)
        });

        console.log('Inserting character fixtures ...');

        for (let i = 0; i < 10; i++)
            Characters.insert({
                name: getRandomName(),
                ownerID: getRandomOwner(),
                health: getRandomHealth(),
                abilities: getRandomAbilities(),
                skills: getRandomSkills(),
                proficiencyBonus: getRandomModifier(),
                speed: getRandomSpeed(),
                initiative: getRandomModifier(),
                armorClass: getRandomUpTo(25),
                deathSaves: getRandomDeathSaves(),
                hitDice: getRandomHitDice()
            });
    }
}
