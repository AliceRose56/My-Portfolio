
const player = '\u{1F61E}'; // sad from losing hat
const hat = '\u{1F3A9}'; // tophat because there's no cowboy hat emoji
const hole = '\u{26AB}'; // a hole in the field
const field = '\u{1F7EB}'; // a dirt colored field
const path = '\u{1F463}'; // these represent the path you've taken

const victory = '\u{1F920}'; // cowboy because they found their hat and put it on, making them happy again
const death = '\u{1F480}'; // player fell in a hole and died




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


// level validator
function validateField(field) {
    let arr = field
    const playerPos = findElement(arr, player)
    const hatPos = findElement(arr, hat)
    const height = arr.length;
    const width = arr[0].length;
    const visited = Array.from({ length: height }, () => Array(width).fill(false));

    function dfs(x, y) {
        if (x < 0 || y < 0 || x >= height || y >= width || arr[x][y] === hole || visited[x][y]) {
            return false;
        }
        if (x === hatPos[0] && y === hatPos[1]) {
            return true;
        }
        visited[x][y] = true;
        return dfs(x + 1, y) || dfs(x - 1, y) || dfs(x, y + 1) || dfs(x, y - 1);
        }

        return dfs(playerPos[0], playerPos[1]);
}


const tutorialField = [
    [player, field, field, field, hole],
    [hole, field, hole, field, field],
    [field, field, hole, hole, field],
    [field, hole, field, field, hole],
    [field, field, field, hole, hat]
];

console.log(validateField(tutorialField))