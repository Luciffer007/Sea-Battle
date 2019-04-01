"use strict";

import BattleField  from "./battle-field.js";

let myFleet = new BattleField('my-fleet', 0);
let enemyFleet = new BattleField('enemy-fleet', 1);
myFleet.create();
enemyFleet.create();
myFleet.placementShips();
