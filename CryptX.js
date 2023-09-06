const readline = require('readline');
const { createCipher, createDecipher } = require('crypto');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function rot13(text) {
    return text.replace(/[a-zA-Z]/g, function (c) {
        const charCode = c.charCodeAt(0);
        const start = c >= 'a' ? 'a'.charCodeAt(0) : 'A'.charCodeAt(0);
        return String.fromCharCode(start + ((charCode - start + 13) % 26));
    });
}

function base64ToReversedBinary(base64String) {
    try {
        const buffer = Buffer.from(base64String, 'base64');
        const binaryArray = Array.from(buffer).map(byte => byte.toString(2).padStart(8, '0'));
        return binaryArray.reverse().join('');
    } catch (error) {
        console.error("Error while converting base64 to reversed binary:", error.message);
        return null;
    }
}

function reversedBinaryToBase64(reversedBinary) {
    try {
        const binaryArray = reversedBinary.match(/.{1,8}/g).reverse();
        const buffer = Buffer.from(binaryArray.map(bin => parseInt(bin, 2)));
        return buffer.toString('base64');
    } catch (error) {
        console.error("Error while converting reversed binary to base64:", error.message);
        return null;
    }
}

function encrypt(input) {
    try {
        const rotated = rot13(input);
        const buffer = Buffer.from(rotated, 'utf-8');
        const encrypted = buffer.toString('base64');
        const reversedBinary = base64ToReversedBinary(encrypted);
        return reversedBinary;
    } catch (error) {
        console.error("Error while encrypting:", error.message);
        return null;
    }
}

function decrypt(encrypted) {
    try {
        const base64FromReversedBinary = reversedBinaryToBase64(encrypted);
        if (base64FromReversedBinary === null) {
            throw new Error("Unable to proceed with decryption due to previous errors.");
        }
        const buffer = Buffer.from(base64FromReversedBinary, 'base64');
        const rotated = buffer.toString('utf-8');
        const decrypted = rot13(rotated);
        return decrypted;
    } catch (error) {
        console.error("Error while decrypting:", error.message);
        return null;
    }
}

function getInput(prompt, callback) {
    rl.question(prompt, (input) => {
        callback(input);
    });
}

function exitProgram() {
    printGoodbyeBinary();
    rl.close();
}

function handleExit(exitOption) {
    if (exitOption.toLowerCase() === 'yes') {
        exitProgram();
    } else if (exitOption.toLowerCase() === 'no') {
        getInput('Do you want to start again? (yes/no): ', (startAgainOption) => {
            if (startAgainOption.toLowerCase() === 'yes') {
                main();
            } else {
                exitProgram();
            }
        });
    } else {
        console.log("Invalid input. Please enter 'yes' or 'no'.");
        getInput('Do you want to exit? (yes/no): ', handleExit);
    }
}

function handleSendToLocal(sendToLocalOption) {
    if (sendToLocalOption.toLowerCase() === 'yes') {
        console.log("Sending message to server...");
        setTimeout(() => {
            console.log("Message received on the server.");

            getInput('Do you want to exit? (yes/no): ', handleExit);
        }, 1000);
    } else if (sendToLocalOption.toLowerCase() === 'no') {
        getInput('Do you want to start again? (yes/no): ', (startAgainOption) => {
            if (startAgainOption.toLowerCase() === 'yes') {
                main();
            } else {
                exitProgram();
            }
        });
    } else {
        console.log("Invalid input. Please enter 'yes' or 'no'.");
        getInput('Send the encrypted message locally? (yes/no): ', handleSendToLocal);
    }
}

function printGoodbyeBinary() {
    console.log("Goodbye!");
}

function main() {
    console.log("Options:");
    console.log("1. Encrypt");
    console.log("2. Decrypt");

    getInput('Select an option: ', (option) => {
        switch (option) {
            case '1':
                getInput('Enter a message to encrypt: ', (message) => {
                    const encrypted = encrypt(message);
                    if (encrypted !== null) {
                        console.log("Encrypted message:", encrypted);

                        getInput('Send the encrypted message locally? (yes/no): ', handleSendToLocal);
                    } else {
                        exitProgram();
                    }
                });
                break;
            case '2':
                getInput('Enter the encrypted message to decrypt: ', (encryptedMessage) => {
                    const decrypted = decrypt(encryptedMessage);
                    if (decrypted !== null) {
                        console.log("Decrypted message:", decrypted);
                        getInput('Do you want to exit? (yes/no): ', handleExit);
                    } else {
                        exitProgram();
                    }
                });
                break;
            default:
                console.log("Invalid option selected. Please choose a valid option.");
                main();
                break;
        }
    });
}

main();
