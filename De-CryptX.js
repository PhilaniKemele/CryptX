const readline = require('readline');

function rot13Decrypt(encryptedMessage) {
  return rot13Encrypt(encryptedMessage);
}

function rot13Encrypt(message) {
  return message
    .split('')
    .map((char) => {
      const code = char.charCodeAt(0);
      if ((code >= 65 && code <= 90) || (code >= 97 && code <= 122)) {
        let shift = code <= 90 ? 65 : 97;
        return String.fromCharCode(((code - shift + 13) % 26) + shift);
      }
      return char;
    })
    .join('');
}

function binaryRepresentation(message) {
  return message
    .split('')
    .map((char) => char.charCodeAt(0).toString(2).padStart(8, '0'))
    .join(' ');
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function startDecoding() {
  rl.question('Enter passkey: ', (passkey) => {
    if (passkey !== 'AirCav007') {
      console.log('Incorrect passkey. Exiting...');
      rl.close();
    } else {
      console.log('Passkey accepted.');
      setTimeout(() => {
        rl.question('De-Crypt: ', (encryptedMessage) => {
          console.log('Decoding...');

          let binaryRepresentationString = binaryRepresentation(encryptedMessage);
          let binaryRepresentationArray = binaryRepresentationString.split('');

          let displayBinaryInterval = setInterval(() => {
            const binaryDigit = binaryRepresentationArray.shift();
            process.stdout.write(binaryDigit);
            if (binaryRepresentationArray.length === 0) {
              clearInterval(displayBinaryInterval);
              setTimeout(() => {
                const decryptedMessage = rot13Decrypt(encryptedMessage);
                console.log('\nDecrypted:', decryptedMessage);
                rl.close();
              }, 1000);
            }
          }, 100);

          // This is to handle the case where the encrypted message is empty or invalid
          if (binaryRepresentationArray.length === 0) {
            console.log('\nNo valid encrypted message to decode.');
            rl.close();
          }
        });
      }, 2000);
    }
  });
}

startDecoding();
