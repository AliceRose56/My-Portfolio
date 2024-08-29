const fs = require("fs"); //provides access to filesystem methods like readFile

let secretWord = null; //declared variable intended to be updated while solution is found

//error first callback function for asyncronous work
let readFileCB = (err, data) => {
  if (err) {
    console.log(`Data not found: ${err}`);
  } else {
    let newData = data; //declared variable intended to be updated as the function loops

    //Code below searches a file for text that says ".txt" in a loop until file doesn't contain it
    if (newData.includes(".txt") === true) { 
      let stringData = newData.toString(); 
      let firstIndex = stringData.search(/\w+\.txt/g); //searches for the index of a word that ends in '.txt'
      let secondIndex = stringData.search(".txt");
      let slicedString = stringData.slice(firstIndex, secondIndex);
      newData = slicedString; //updates newData
      fs.readFile(`./${newData}.txt`, "utf-8", readFileCB); //loops into the next file
    } else { //if a file doesn't have ".txt", then it must have the secret word we're looking for!
      let stringData = newData.toString(); 
      let secretString = stringData.match(/("\w+")/g).toString().replace(/"/g, ''); //Checks the data for ""s around a word
      secretWord = secretString; //solution found, thus updated
      console.log(secretWord); //just checking everthing worked
    }
  }
};

fs.readFile("./fileOne.txt", "utf-8", readFileCB); //intializes the callback function