
import '../../api/character.js';
import '../../api/user.js';

import {createCharacterFixtures} from "./fixtures";

export function onServerStartup() {
    createCharacterFixtures();
}