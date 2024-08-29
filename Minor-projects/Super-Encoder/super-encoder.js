// Importing the encryptors.js functions.
const encrytors = require("./encryptors.js");

const { caesarCipher, symbolCipher, reverseCipher } = encrytors;

// Encrypts a string through multiple layers of ciphers
const encodeMessage = (str) => {
  if (str.length > 0) {
    const encryptionKey = Math.floor(Math.random() * (26) + 1) // generates a random encrytion key between 1 and 26 for caesarCipher

    const ceasarLayer = caesarCipher(str, encryptionKey);
    const reverseLayer = reverseCipher(ceasarLayer)
    const symbolLayer = symbolCipher(reverseLayer)
    
    return `Encoded phrase: ${symbolLayer}\nDecryption key: ${encryptionKey}`
  } else {
    return "Please try again: Remember to write the message you'd like to encrypt!" // returned if required data was missing 
  }
}

// Decrypts a string by reversing the order of the encryption layers
const decodeMessage = (str, key) => {
  if (str.length > 0 && key) {
    let negKey = -key // converts the encryption key to a negative to reverse the caesarCipher layer

    const deSymbolLayer = symbolCipher(str)
    const deReverseLayer = reverseCipher(deSymbolLayer)
    const deCeasarLayer = caesarCipher(deReverseLayer, negKey);
    
    return deCeasarLayer
  } else {
    return "Please try again: Remember to write the message you'd like to decrypt!" // returned if required data was missing 
  }
}

// User input / output.

const handleInput = (userInputStr) => {
  const str = userInputStr.toString().trim();
  const num = Number(process.argv[3]) // converts index 3 from command line to an integer
  let output; // declared for later use

  // if mode is encode, calls encodeMessage
  if (process.argv[2] === 'encode') {
    output = encodeMessage(str);
  } 
  // if mode is decode, calls decodeMessage
  if (process.argv[2] === 'decode' && num) {
    output = decodeMessage(str, num);
  } else if (process.argv[2] === 'decode') { // if decode and no key provided, returns string. TODO?: could throw and log an error, then exit process
    output = "Please provide the decryption key!"
  }
  
  process.stdout.write(output + '\n');
  process.exit();
}

// Run the program.
process.stdout.write('Enter the message you would like to encrypt/decrypt...\n> ');
process.stdin.on('data', handleInput)