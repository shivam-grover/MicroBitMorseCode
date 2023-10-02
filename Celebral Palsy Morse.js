let morseInput = "";
let dotDuration = 500;
let dashDuration = 1000;
let buttonAStartTime = 0;
let buttonBStartTime = 0;
let showCollectedString = false;
let decodedCharArray = ""

// Store Morse code patterns and their corresponding characters in two different arrays
// I tried using a dictionary, but it seems like MicroBit does not support dictionary methods
let morsePatterns: string[] = [".-", "-...", "-.-.", "-..", ".", "..-.", "--.", "....", "..", ".---", "-.-", ".-..", "--", "-.", "---", ".--.", "--.-", ".-.", "...", "-", "..-", "...-", ".--", "-..-", "-.--", "--..", "-----", ".----", "..---", "...--", "....-", ".....", "-....", "--...", "---..", "----.", ".-.-"];
let morseCharacters: string[] = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", " "];

// Function to decode Morse code into characters
function decodeMorseCode(morse: string): string {
    // Split morseInput into individual Morse code characters
    let morseCharacters = morse.split(" ");

    // Decode Morse code characters and concatenate them
    let decodedMessage = "";
    for (let morseChar of morseCharacters) {
        let decodedChar = findCharacterByMorseCode(morseChar);
        if (decodedChar) {
            decodedMessage += decodedChar;
        }
    }

    return decodedMessage;
}

// Function to find a character by Morse code
function findCharacterByMorseCode(morse: string): string | undefined {
    for (let i = 0; i < morsePatterns.length; i++) {
        if (morsePatterns[i] == morse) {
            return morseCharacters[i];
        }
    }
    return undefined; // Morse code not found in the mapping
}

// When user presses Button A, input a dot
input.onButtonPressed(Button.A, function () {
    buttonAStartTime = input.runningTime();
    morseInput += ".";
})

// When user presses Button B, input a dash
input.onButtonPressed(Button.B, function () {
    buttonBStartTime = input.runningTime();
    morseInput += "-";
})

// When user shakes the device:
//      1. Show the message in loop
//      2. If the message is already being shown, then clear the input and display
input.onGesture(Gesture.Shake, function () {
    if(showCollectedString==true){
        showCollectedString = false;
        decodedCharArray = "";
        basic.showString("");
        basic.clearScreen();
    }
    else{
        showCollectedString = true;
    }
})

// I realised the shaking the device might not be possible 
// for a patient with Cerebral Palasy 
// So an alternative demo that uses the logo button
// When the user presses the logo button:
//      1. Show the message in loop
//      2. If the message is already being shown, then clear the input and display
input.onLogoEvent(TouchButtonEvent.Pressed, function () {
    if (showCollectedString == true) {
        showCollectedString = false;
        decodedCharArray = "";
        basic.showString("");
        basic.clearScreen();
    }
    else {
        showCollectedString = true;
    }
})

// Pressing both A and B simultaneously will end the current morseInput
// and display the decoded character
input.onButtonPressed(Button.AB, function () {
    // Display the decoded character on the LED matrix
    let decodedCharacter = decodeMorseCode(morseInput);
    decodedCharArray += decodedCharacter;
    basic.showString(decodedCharacter);
    // Clear the Morse code input
    morseInput = "";
})

// Display in loop the final decoded sentence stored in decodedCharArray 
// if showCollectedString is true
basic.forever(function () {
    if (showCollectedString == true && decodedCharArray!="") {
        basic.showString("  " + (decodedCharArray) + ".")
    }
})