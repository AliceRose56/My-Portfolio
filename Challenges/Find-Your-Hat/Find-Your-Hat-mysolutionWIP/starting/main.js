const prompt = require('prompt-sync')({sigint: true});

const player = '\u{1F61E}'; // sad from losing hat
const hat = '\u{1F3A9}'; // tophat because there's no cowboy hat emoji
const hole = '\u{26AB}'; // a hole in the field
const field = '\u{1F7EB}'; // a dirt colored field
const path = '\u{1F463}' // these represent the path you've taken

const victory = '\u{1F920}'; // cowboy because they found their hat and put it on, making them happy again
const death = '\u{1F480}'; // player fell in a hole and died


class Field {
    constructor(field) {
        this.field = field
    }

    print() {
        let arrArr = this.field
        let processedArr;

        processedArr = arrArr.join('\n')
        processedArr = processedArr.replaceAll(',', '')

        return processedArr
    }

    generateField(height, width, percent) {
        // TODO generate random fields with params
    }
}


const myField = new Field([
    [player, field, field, field, hole],
    [hole, field, hole, field, field],
    [field, field, hole, hole, field],
    [field, hole, field, field, field],
    [field, field, field, hole, hat]
])





const gameInitStand = () => {
    let i = 0
    if (i === 0) {
        process.stdout.write(myField.print())
        i++
    } else {
        gameLooper(myField)
    }
}

/* TODO make random fields 
const gameInitRand = () => {
    const randField = myField.generateField(height, width, percent)
    let i = 0
    if (i === 0) {
        process.stdout.write(myField.print())
        i++
    } else {
        gameLooper(randField)
    }
}
*/

// iterates through arr of arrs searching for 'element', then returns arr with co-ordinates of element
const findElement = (field, element) => {
    for (i = 0, i < field.length; i++;) {
        for (j = 0, j < field[i].length; j++;) {
            if (field[i][j] === element) {
                return [i, j]
            } else {
                return false;
            }
        }
    }
}

// runs the game loop, taking in the field's intial state as a param
const gameLooper = (fieldStart) => {
    const userInput = prompt('Which way? ') // <----- Proplem, supposed to take userInput continuously, but fails
    let modifiedField = fieldStart // assigns param, with the intent of editing it during movement

    if (findElement(modifiedField, player) === false) { // TODO if field has no player trigger lose state 

    } else if (findElement(modifiedField, death)) { // TODO if field has death trigger lose state 
                
    } else if (findElement(modifiedField, victory)) { // TODO if field has victory trigger win state 

    } else if (findElement(modifiedField, player)) { // if field has a player, move it, then loop game
        const playerPos = findElement(modifiedField, player) // store player's co-ords
        const firstSplice = modifiedField[playerPos[0]].splice(playerPos[1], 1, path) //removes player from initial pos, and replaces with path
        let secondSplice;

        const returnReplacement = (variable) => { // checks what var is, then returns what var should be turned into
            if (variable == field) {
                return player
            } else if (variable == path) {
                return player
            } else if (variable == hole) {
                return death
            } else if (variable == hat) {
                return victory
            }  else {
                return null
            }
        }

        if (userInput == 'w') {    // converts user-input into movement across the 
            const up = playerPos[0] - 1; // to move up subtract 1 from first co-ord
            secondSplice = modifiedField[up].splice(playerPos[1], 1, returnReplacement(modifiedField[up][playerPos[1]])) // splices var into position above former position
        } else if (userInput == 'a') {
            const left = playerPos[1] - 1;  // to move left subtract 1 from second co-ord
            secondSplice = modifiedField[0].splice(left, 1, returnReplacement(modifiedField[playerPos[0]][left])) // splices var into position left of former position
        } else if (userInput == 's') {
            const down = playerPos[0] + 1;  // to move down add 1 to first co-ord
            secondSplice = modifiedField[down].splice(playerPos[1], 1, returnReplacement(modifiedField[down][playerPos[1]])) // splices var into position below former position
        } else if (userInput == 'd') {
            const right = playerPos[0] - 1;  // to move right add 1 to second co-ord
            secondSplice = modifiedField[0].splice(right, 1, returnReplacement(modifiedField[playerPos[0]][right])) // splices var into position right of former position
        } else {
            // TODO add err 
        }
        gameLooper(modifiedField) // loops the game using now altered field
    }

}





const pickMode = () => {
    const story = "You were having a good time outside,\n" +
    "but then a strong breeze came by and blew your hat away!\n" + 
    "You chased after it, but it landed in a field full of holes!\n" +
    "If you want it back you'll have to go get it carefully...\n";


    let output;

    if (process.argv[2] === 'standard') {
        output = story   
        gameInitStand()
    } else if (process.argv[2] === 'random') {
        // output = '' // Should output something requesting 3 params for field generation
        gameInitRand()
    } else { 
        output = "Please pick either the standard or random mode!" 
        process.stdout.write(output)
        process.exit(); 
    }
    process.stdout.write(output)
  }





process.stdin.on('data', pickMode) // initializes game!



//testing code bellow
//console.log(myField.print())
//console.log(myField.field[0].includes(player))