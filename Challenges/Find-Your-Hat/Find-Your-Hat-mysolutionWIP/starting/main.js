const prompt = require("prompt-sync")({ sigint: true });

const player = "\u{1F61E}"; // sad from losing hat
const hat = "\u{1F3A9}"; // tophat because there's no cowboy hat emoji
const hole = "\u{26AB}"; // a hole in the field
const field = "\u{1F7EB}"; // a dirt colored field
const path = "\u{1F463}"; // these represent the path you've taken

const victory = "\u{1F920}"; // cowboy because they found their hat and put it on, making them happy again
const death = "\u{1F480}"; // player fell in a hole and died

// the game's premise
const story =
  "You were having a good time outside,\n" +
  "but then a strong breeze came by and blew your hat away!\n" +
  "You chased after it, but it landed in a field full of holes!\n" +
  "If you want it back you'll have to go get it carefully...\n";

class Field {
  constructor(field) {
    this.field = field;
  }

  // turns an array of arrays into a more user-readable format
  print() {
    return this.field.map((row) => row.join(" ")).join("\n");
  }

  // level validation function
  static validateField(field) {
    let arr = field;
    const start = findElement(arr, player); // sets start location to the player's position
    const end = findElement(arr, hat); // sets end location to the hat's position
    const height = arr.length;
    const width = arr[0].length;
    const visited = Array.from({ length: height }, () =>
      Array(width).fill(false)
    );

    function dfs(x, y) {
      if (
        x < 0 ||
        y < 0 ||
        x >= height ||
        y >= width ||
        arr[x][y] === hole ||
        visited[x][y]
      ) {
        return false;
      }
      if (x === end[0] && y === end[1]) {
        return true;
      }
      visited[x][y] = true;
      return dfs(x + 1, y) || dfs(x - 1, y) || dfs(x, y + 1) || dfs(x, y - 1);
    }

    return dfs(start[0], start[1]); // initializes Depth-first search algorithm
  }

  // takes in various parameters to generate a new, entirely random level
  static generateField(height, width, percentage) {
    const randArr = [];

    for (let i = 0; i < height; i++) {
      randArr.push([]);
      for (let j = 0; j < width; j++) {
        randArr[i].push(field);
      }
    }

    const fieldSize = height * width;
    let numOfHoles = Math.floor(fieldSize * (percentage / 100));

    // insures that there is at minimum 2 non-hole spots on the level so that level creation doesn't fail due to vailid level being impossible to generate.
    // NOTE: I don't like this solution from a game-design perspective as it makes boring level where you always spawn right next to the goal, it makes the game more user friendly though, so I've decided to leave it like this instead of throwing an error to the user.
    if (numOfHoles > fieldSize - 2) {
      let dif = numOfHoles - (fieldSize - 2);
      numOfHoles = numOfHoles - dif;
    }

    function itemPlacer(item, count) {
      for (let i = 0; i < count; ) {
        const posX = Math.floor(Math.random() * height);
        const posY = Math.floor(Math.random() * width);
        if (randArr[posX][posY] === field) {
          randArr[posX][posY] = item;
          i++;
        }
      }
    }

    itemPlacer(hole, numOfHoles);
    itemPlacer(player, 1);
    itemPlacer(hat, 1);

    return randArr;
  }
}

// basic level
const tutorialField = new Field([
  [player, field, field, field, hole],
  [hole, field, hole, field, field],
  [field, field, hole, hole, field],
  [field, hole, field, field, field],
  [field, field, field, hole, hat],
]);

// intitializes game with the tutorial field
function gameInitTutorial() {
  process.stdout.write(tutorialField.print() + "\n");
  gameLooper(tutorialField);
}

// intitializes game with a randomly generated level
function gameInitRand(height, width, percentage) {
  if (percentage >= 100 || percentage < 0) {
    process.stdout.write(
      `\x1b[31m\nERROR: Failed to generate level with the provided percentaage of holes. Try generating a level again with a percentage between 0 and 100\x1b[0m`
    );
    process.exit();
  } else if (height > 25 || height < 1 || width > 25 || width < 1) {
    process.stdout.write(
      `\x1b[31m\nERROR: Failed to generate level with the provided height/width. Try generating a level again with a height/width between 1 and 25\x1b[0m`
    );
    process.exit();
  } else {
    const killSwitch = 25;
    let loopCount = 0;

    while (loopCount <= killSwitch) {
      const generatedField = Field.generateField(height, width, percentage);
      const randomField = new Field(generatedField);
      if (Field.validateField(generatedField)) {
        process.stdout.write(story);
        process.stdout.write(randomField.print() + "\n");
        gameLooper(randomField);
      } else if (loopCount === killSwitch) {
        process.stdout.write(
          `\x1b[31m \n ERROR: Failed to generate a winnable level after ${loopCount} attempts. Try generating a level again with less holes!\x1b[0m`
        );
        process.exit();
      } else {
        loopCount++;
      }
    }
  }
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
function returnReplacement(element) {
  if (element == field) {
    return player;
  } else if (element == path) {
    return player;
  } else if (element == hole) {
    return death;
  } else if (element == hat) {
    return victory;
  } else {
    // if player didn't move, returns them to the field
    return player;
  }
}

// moves player based on which direction was inputed
function movePlayer(direction, field) {
  let modifiedField = field; // assigns param, with the intent of editing it during loops

  const playerPos = findElement(modifiedField.field, player); // gets players position
  let targetPos;

  const up = playerPos[0] - 1; // to move up subtract 1 from first coord
  const left = playerPos[1] - 1; // to move left subtract 1 from second coord
  const down = playerPos[0] + 1; // to move down add 1 to first coord
  const right = playerPos[1] + 1; // to move right add 1 to second coord

  const fieldWidth = modifiedField.field[0].length;
  const fieldHeight = modifiedField.field.length;

  // turns user input into target coords for movement
  if (direction === "w") {
    targetPos = [up, playerPos[1]];
  } else if (direction === "a") {
    targetPos = [playerPos[0], left];
  } else if (direction === "s") {
    targetPos = [down, playerPos[1]];
  } else if (direction === "d") {
    targetPos = [playerPos[0], right];
  } else {
    // if user inputs any other character, restates controls, then doesn't move the player
    process.stdout.write("Pssst.. use 'w', 'a', 's', or 'd' to move!\n");
    targetPos = [playerPos[0], playerPos[1]];
  }

  // removes player from initial pos, and replaces with path
  if (playerPos) {
    modifiedField.field[playerPos[0]][playerPos[1]] = path;
  }

  // if targetPos is out of bounds, trigger loop prematurely to set off a failstate
  if (
    targetPos[0] < 0 ||
    targetPos[1] < 0 ||
    targetPos[0] >= fieldHeight ||
    targetPos[1] >= fieldWidth
  ) {
    console.clear();
    process.stdout.write(modifiedField.print());
    gameLooper(modifiedField);
  }

  // replaces element at targetPos with appropiate new element
  if (playerPos) {
    modifiedField.field[targetPos[0]][targetPos[1]] = returnReplacement(
      modifiedField.field[targetPos[0]][targetPos[1]]
    );
  }
}

// runs the game loop, taking in the field's intial state as a param
function gameLooper(fieldStart) {
  if (findElement(fieldStart.field, death)) {
    // if field has death, trigger lose state
    process.stdout.write(`\nYou fell in a hole and died! Game over ${death}`);
    process.exit();
  } else if (findElement(fieldStart.field, victory)) {
    // if field has victory, trigger win state
    process.stdout.write(`\nYou found your hat, Horray! Game won! ${victory}`);
    process.exit();
  } else if (findElement(fieldStart.field, player) === false) {
    // if field has no player, trigger lose state
    process.stdout.write(
      `\nYou left the field, abandoning your hat! Game over ${player}`
    );
    process.exit();
  } else if (findElement(fieldStart.field, player)) {
    // if field has a player, move it, then loop game
    const userInput = prompt("Which way? ");

    // if user inputs anything, calls movePlayer. If no input writes, then loop retriggers with no move made
    if (userInput) {
      movePlayer(userInput, fieldStart);
    } else {
      process.stdout.write("Pick a direction to move! \n");
    }
    console.clear();
    process.stdout.write(`${fieldStart.print()}\n`);
    gameLooper(fieldStart); // loops the game using now altered field
  }
}

// handler for initializing multiple different game modes based on user input
function pickMode() {
  console.clear();
  let output;
  if (process.argv[2] === "tutorial") {
    output = story;
    process.stdout.write(output);
    gameInitTutorial();
  } else if (process.argv[2] === "random") {
    const userParams = prompt(
      "Input field parameters in this format, using integers: height, width, pecentageOfHoles "
    );

    if (userParams) {
      const spliter = userParams.split(", ");
      let userHeight = parseInt(spliter[0]);
      let userWidth = parseInt(spliter[1]);
      let userPercentage = parseInt(spliter[2]);
      gameInitRand(userHeight, userWidth, userPercentage);
    } else {
      output = "Please provide parameters for field generation!";
      process.stdout.write(output);
      process.exit();
    }
  } else {
    output = "Please pick either the tutorial or random mode!";
    process.stdout.write(output);
    process.exit();
  }
}

pickMode(); // initializes game!
