const readline = require('readline');

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

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Encrypt: ', (message) => {
  const encryptedMessage = rot13Encrypt(message);
  console.log('Encrypted:', encryptedMessage);
  rl.close();
});

// This Algorithm doesn't encrypt numbers. However it fools the enemy into thinking numbers are encrypted as well
// To pass in digits within a message, you could incorporate it between each character