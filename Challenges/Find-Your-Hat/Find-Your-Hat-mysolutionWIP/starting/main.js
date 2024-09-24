const prompt = require('prompt-sync')({sigint: true});

const player = '\u{1F61E}'; // sad from losing hat
const hat = '\u{1F3A9}'; // tophat because there's no cowboy hat emoji
const hole = '\u{26AB}'; // a hole in the field
const field = '\u{1F7EB}'; // a dirt colored field
const path = '\u{1F463}'; // these represent the path you've taken

const victory = '\u{1F920}'; // cowboy because they found their hat and put it on, making them happy again
const death = '\u{1F480}'; // player fell in a hole and died

// the game's premise
const story = "You were having a good time outside,\n" +
    "but then a strong breeze came by and blew your hat away!\n" + 
    "You chased after it, but it landed in a field full of holes!\n" +
    "If you want it back you'll have to go get it carefully...\n";


class Field {
    constructor(field) {
        this.field = field;
    };

    // turns the array of arrays into a more user-readable format
    print() {
        let arrArr = this.field;
        let processedArr;

        processedArr = arrArr.join('\n');
        processedArr = arrArr.map(row => row.join(' ')).join('\n');

        return processedArr;
    };

    // takes in various parameters to generate a new, entirely random level
    static generateField(height, width, percentage) {
        const randArr = [];

        for (let i = 0; i < height; i++) {
            randArr.push([])
            for (let j = 0; j < width; j++) {
                randArr[i].push(field)
            }
        }

        const fieldSize = height * width;
        const numOfHoles = Math.floor(fieldSize * (percentage / 100))

        for (let i = 0; i < numOfHoles;) {
            const holeX = Math.floor(Math.random() *  height)
            const holeY = Math.floor(Math.random() *  width)
            if (randArr[holeX][holeY] === field){
                randArr[holeX][holeY] = hole;
                i++;
            }
        }

        let playerPlaced = false;
        let hatPlaced = false;

        while (!playerPlaced) {
            const playerX = Math.floor(Math.random() *  height)
            const playerY = Math.floor(Math.random() *  width)
            if (randArr[playerX][playerY] === field) {
                randArr[playerX][playerY] = player;
                playerPlaced = true;
            }
        }

        while (!hatPlaced) {
            const hatX = Math.floor(Math.random() *  height)
            const hatY = Math.floor(Math.random() *  width)
            if (randArr[hatX][hatY] === field) {
                randArr[hatX][hatY] = hat;
                hatPlaced = true;
            }
        }

        return randArr;
    };
};


// basic level
const tutorialField = new Field([
    [player, field, field, field, hole],
    [hole, field, hole, field, field],
    [field, field, hole, hole, field],
    [field, hole, field, field, field],
    [field, field, field, hole, hat]
]);


// intitializes game with the tutorial field 
function gameInitTutorial() {
    process.stdout.write(tutorialField.print() + '\n');
    gameLooper(tutorialField);

};

// intitializes game with a randomly generated level 
const gameInitRand = (height, width, percentage) => {
    const generatedField = Field.generateField(height, width, percentage)
    const randomField = new Field(generatedField)

    process.stdout.write(story);
    process.stdout.write(randomField.print() + '\n');
    gameLooper(randomField)
}

// iterates through arr of arrs searching for 'element', then returns arr with coordinates of element
function findElement(field, element) {
    for (let i = 0; i < field.length; i++) {
        for (let j = 0; j < field[i].length; j++) {
            if (field[i][j] === element) {
                return [i, j];
            }
        }
    }
    return false;
}

// takes in an element then returns what that element should be replaced with 
function returnReplacement(variable) {
    if (variable == field) {
        return player;
    } else if (variable == path) {
        return player;
    } else if (variable == hole) {
        return death;
    } else if (variable == hat) {
        return victory;
    } else {
        // if player didn't move, returns them to the field
        return player;
    }
}

// runs the game loop, taking in the field's intial state as a param
function gameLooper(fieldStart) {
    let modifiedField = fieldStart; // assigns param, with the intent of editing it during loops
    const playerPos = findElement(modifiedField.field, player); // gets players position

    // moves player based on which direction was inputed
    function movePlayer(direction) {
        let targetPos;

        const up = playerPos[0] - 1; // to move up subtract 1 from first coord
        const left = playerPos[1] - 1; // to move left subtract 1 from second coord
        const down = playerPos[0] + 1; // to move down add 1 to first coord
        const right = playerPos[1] + 1; // to move right add 1 to second coord

        const fieldWidth = modifiedField.field[0].length;
        const fieldHeight = modifiedField.field.length;

        // turns user input into target coords for movement
        if (direction === 'w') {
            targetPos = [up, playerPos[1]];
        } else if (direction === 'a') {
            targetPos = [playerPos[0], left];
        } else if (direction === 's') {
            targetPos = [down, playerPos[1]];
        } else if (direction === 'd') {
            targetPos = [playerPos[0], right];
        } else {
            // if user inputs any other character, restates controls, then doesn't move the player
            process.stdout.write("Pssst.. use 'w', 'a', 's', or 'd' to move!\n");
            targetPos = [playerPos[0], playerPos[1]];
        };

        // removes player from initial pos, and replaces with path
        if (playerPos) {
            modifiedField.field[playerPos[0]][playerPos[1]] = path;
        };

        // if targetPos is out of bounds, trigger loop prematurely to set off a failstate 
        if (targetPos[0] < 0 || targetPos[1] < 0 || targetPos[0] >= fieldHeight || targetPos[1] >= fieldWidth) {
            console.clear();
            process.stdout.write(modifiedField.print());
            gameLooper(modifiedField);
        };

        // replaces element at targetPos with appropiate new element
        if (playerPos) {
            modifiedField.field[targetPos[0]][targetPos[1]] = returnReplacement(modifiedField.field[targetPos[0]][targetPos[1]]);
        };
    };


    if (findElement(modifiedField.field, death)) { // if field has death, trigger lose state 
        process.stdout.write(`\nYou fell in a hole and died! Game over ${death}`);
        process.exit();
    } else if (findElement(modifiedField.field, victory)) { // if field has victory, trigger win state 
        process.stdout.write(`\nYou found your hat, Horray! Game won! ${victory}`);
        process.exit();
    } else if (findElement(modifiedField.field, player) === false) { // if field has no player, trigger lose state 
        process.stdout.write(`\nYou left the field, abandoning your hat! Game over ${player}`);
        process.exit();
    } else if (findElement(modifiedField.field, player)) { // if field has a player, move it, then loop game
        const userInput = prompt('Which way? ');

        // if user inputs anything, calls movePlayer. If no input writes, then loop retriggers with no move made
        if (userInput) {
            movePlayer(userInput);
        } else {
            process.stdout.write('Pick a direction to move! \n');
        };
        console.clear();
        process.stdout.write(story);
        process.stdout.write(`\n${modifiedField.print()}\n`);
        gameLooper(modifiedField); // loops the game using now altered field
    };

};

// handler for initializing multiple different game modes based on user input
const pickMode = () => {
    console.clear();
    let output;
    if (process.argv[2] === 'tutorial') {
        output = story;
        process.stdout.write(output);
        gameInitTutorial();
    } else if (process.argv[2] === 'random') {
        const userParams = prompt('Input field parameters in this format, using integers: height, width, pecentageOfHoles ');

        if (userParams) {
            const spliter = userParams.split(', ');
            let userHeight = parseInt(spliter[0]);
            let userWidth = parseInt(spliter[1]);
            let userPercentage = parseInt(spliter[2]);
            gameInitRand(userHeight, userWidth, userPercentage);
        } else {
            output = 'Please provide parameters for field generation!'
            process.stdout.write(output);
            process.exit();
        };
        
    } else { 
        output = "Please pick either the tutorial or random mode!";
        process.stdout.write(output);
        process.exit(); 
    };
};



pickMode(); // initializes game!