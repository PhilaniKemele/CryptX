function encrypt() {

    const inputText = document.getElementById("inputText").value;
    const password = document.getElementById("password").value;

    const encryptedText = CryptoJS.AES.encrypt(inputText, password).toString();
    document.getElementById("result").innerHTML = "Encrypted Text: " + encryptedText;

}

function decrypt() {

    const encryptedText = document.getElementById("inputText").value;
    const password = document.getElementById("password").value;

    try {

        const decryptedText = CryptoJS.AES.decrypt(encryptedText, password).toString(CryptoJS.enc.Utf8);
        document.getElementById("result").innerHTML = "Decrypted Text: " + decryptedText;

    } catch (error) {

        document.getElementById("result").innerHTML = "Decryption failed. Please check your password.";
        
    }

}
