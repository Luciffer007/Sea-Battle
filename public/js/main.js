"use strict";

import BattleField from "./battle-field.js";
import ModalWindow from "./modal-window.js";
import post from "./post.js";

;(function() {
    let name = '';

    /* Сreating battlefields */
    let myFleet = new BattleField('my-fleet', 'friend');
    let enemyFleet = new BattleField('enemy-fleet', 'enemy');
    myFleet.create();
    enemyFleet.create(makeShot);

    /* Creating a modal window of name entry */
    let contentNameWindow = '<div><h3>Enter your name, Captain!</h3><form name="captain"><input name="captainName" type="text" value="Shipboy" onkeydown="if(event.keyCode == 13) return false"/></form></div>';
    let modalWindow = new ModalWindow(contentNameWindow, 'Play', startGame);
    modalWindow.create();

    /* Handler to start/restart the game */
    function startGame() {
        /* Remembering the player's name until the next page reload */
        if (!name) {
            name = document.captain.elements.captainName.value;
        }

        document.getElementById('my-name').innerText = name;
        post('/start-game').then(function (response) {
            document.getElementById('enemy-name').innerText = JSON.parse(response);
        });

        myFleet.update();
        enemyFleet.update();

        /* Request to the server about the placement of friendly ships*/
        post('/preparation').then(function (response) {
            myFleet.placementShips(JSON.parse(response));
        });

        this.destroy();
    }

    /* Handler on the shot at the enemy's field */
    function makeShot(event) {
        let target = event.target;
        let currentTarget = event.currentTarget;

        if (target.getAttribute('class') == 'not-checked' && currentTarget.getAttribute('status') == 'enable') {
            /* Sending shot coordinates to server */
            let coordinates = JSON.stringify({
                rowIndex: target.getAttribute('rowIndex'),
                columnIndex: target.getAttribute('columnIndex')
            });
            post('/shot', coordinates).then(function (response) {
                /* Processing the result of shot */
                let responseObj = JSON.parse(response);
                if (responseObj.resultShot == 'hit') {
                    /* Hit */
                    target.removeAttribute('class');
                    target.setAttribute('class', 'ship');
                    target.insertAdjacentHTML('beforeEnd', '<div class="hit"></div>');

                    if (responseObj.isEnemyDestroy) {
                        responseObj.indexesEnemyOneCellZone.forEach(function (indexes) {
                            let element = currentTarget.querySelector('div[rowIndex="' + indexes[0] + '"][columnIndex="' + indexes[1] + '"]');
                            element.removeAttribute('class');
                            element.setAttribute('class', 'sea');
                            element.insertAdjacentHTML('beforeEnd', '<div class="miss"></div>');
                        });
                    }

                    /* Check win condition */
                    if (responseObj.isWin) {
                        /* Creating a modal window of win */
                        let contentWinWindow = '<div><h3>Win!</h3><br/><span>Good job, captain. Enemy\'s last ship sunk.</span></div>';
                        let modalWinWindow = new ModalWindow(contentWinWindow, 'Play again', startGame);
                        modalWinWindow.create();
                    }
                } else {
                    /* Miss */
                    target.removeAttribute('class');
                    target.setAttribute('class', 'sea');
                    target.insertAdjacentHTML('beforeEnd', '<div class="miss"></div>');
                }

                /* Eliminating the possibility of two modal windows */
                if (!responseObj.isWin) {
                    changeActivePlayer('my-name', 'enemy-name', currentTarget);
                    /* Processing the result of enemy shot */
                    setTimeout(pretendToThink, 1000, responseObj, currentTarget);
                }
            });
        }
    }

    function changeActivePlayer(player1Name, player2Name, enemyField) {
        document.getElementById(player1Name).classList.toggle('active-player');
        document.getElementById(player2Name).classList.toggle('active-player');
        /* Disable/enable shot capability */
        if (enemyField.getAttribute('status') == 'enable')
            enemyField.setAttribute('status', 'disable');
        else
            enemyField.setAttribute('status', 'enable')
    }

    function pretendToThink(responseObj, enemyField) {
        let cell = document.querySelector('#my-fleet div[rowIndex="' + responseObj.rowIndex + '"][columnIndex="' + responseObj.columnIndex + '"]');
        cell.insertAdjacentHTML('beforeEnd', '<div class="' + responseObj.resultEnemyShot + '"></div>');

        if (responseObj.isDestroy) {
            responseObj.indexesOneCellZone.forEach(function (indexes) {
                let element = document.querySelector('#my-fleet div[rowIndex="' + indexes[0] + '"][columnIndex="' + indexes[1] + '"]');
                element.insertAdjacentHTML('beforeEnd', '<div class="miss"></div>');
            });
        }

        /* Check lose condition */
        if (responseObj.isLose) {
            /* Creating a modal window of lose */
            let contentWinWindow = '<div><h3>Lose!</h3><br/><span>Captain, all our ships are sunk. It was an honor to serve with you.</span></div>';
            let modalLoseWindow = new ModalWindow(contentWinWindow, 'Try again', startGame);
            modalLoseWindow.create();
        }
        changeActivePlayer('my-name', 'enemy-name', enemyField);
    }
})();