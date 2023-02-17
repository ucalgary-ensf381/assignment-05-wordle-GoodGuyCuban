// remove this line
// it's just here to shows it works

// dark mode toggle
document.getElementById('drkSwitch').addEventListener('click',()=>{
    if (document.documentElement.getAttribute('data-bs-theme') == 'dark') {
        document.documentElement.setAttribute('data-bs-theme','light')
    }
    else {
        document.documentElement.setAttribute('data-bs-theme','dark')
    }
})

const getWords = async () => {
    const res = await fetch("https://api.masoudkf.com/v1/wordle", {headers: {"x-api-key": "sw0Tr2othT1AyTQtNDUE06LqMckbTiKWaVYhuirv",},});
    let words = await res.json();
    let {dictionary} = words;

    return {dictionary};
};

// create a function that initializes a 4x4 board witb boxes for each letter
const initBoard = () => { 
    const board = document.getElementById('board');
    for (let i = 0; i < 4; i++) {
        const row = document.createElement('div');
        row.classList.add('row');
        row.classList.add('justify-content-center');
        // put placeholders in each box
        for (let j = 0; j < 4; j++) {
            const col = document.createElement('div');
            col.classList.add('col-auto');
            col.classList.add('p-0');
            const box = document.createElement('div');
            box.classList.add('box');
            box.classList.add('border');
            col.appendChild(box);
            row.appendChild(col);
            console.log(box);
            
        }
        board.appendChild(row);
    }
    // highlight the first box
    let firstBox = document.getElementsByClassName("box")[0]
    firstBox.classList.add("border-primary")
}
// call the function
initBoard();


const selectWord = async () => {
    let {dictionary} = await getWords();
    let word = dictionary[Math.floor(Math.random() * dictionary.length)]
    return word
}
currentWord = selectWord()
let guessesRemaining = 4
let nextLetter = 0

//add start over button
document.getElementById("startOver").addEventListener("click", () => {
    //reset the board
    let boxes = document.getElementsByClassName("box")
    for (let i = 0; i < boxes.length; i++) {
        boxes[i].innerHTML = ""
        boxes[i].classList.remove("bg-success")
        boxes[i].classList.remove("bg-secondary")
        boxes[i].classList.remove("text-white")
        boxes[i].classList.remove("border-primary")
    }
    //hide the hint using bootstrap
    document.getElementById('AlertPlaceholder').innerHTML = ""
    
    //reset the nextLetter variable
    nextLetter = 0
    //reset the guesses remaining
    guessesRemaining = 4
    //reset the current word
    currentWord = selectWord()
    //reset the border on the first box
    boxes[0].classList.add("border-primary")


})




document.addEventListener("keyup", (e) => {

    if (guessesRemaining === 0) {
        return
    }

    let pressedKey = String(e.key)
    if (pressedKey === "Backspace" && nextLetter !== 0) {
        deleteLetter()
        return
    }

    if (pressedKey === "Enter") {
        checkGuess()
        return
    }

    // found can be any letter from a-z, no numbers or special characters or function keys
    if (pressedKey.match(/^[a-zA-Z]$/)) {
        let found = pressedKey.match(/[a-z]/gi)
        if (!found || found.length > 1) {
            return
        } else {
            insertLetter(pressedKey)
        }
    }
})


// create a function that inserts a letter into a selected box. Inputs and selection are seperate functions
const insertLetter = (letter) => {
    if (nextLetter === 4) {
        //stop the user from entering more letters
        return
    }
    // create array of boxes with row and column
    let row = document.getElementsByClassName("row")[4 - guessesRemaining]
    let boxes = row.getElementsByClassName("box")
    
    letter = letter.toLowerCase()
    
    boxes[nextLetter].innerHTML = letter;

    nextLetter++;
    
    if (nextLetter < 4) {
        boxes[nextLetter].classList.add("border-primary")
    }
    // remove the highlight from the previous box
    boxes[nextLetter - 1].classList.remove("border-primary")
    
}

// create a function that deletes a letter from a selected box
const deleteLetter = () => {
    // create array of boxes with row and column
    let row = document.getElementsByClassName("row")[4 - guessesRemaining]
    let boxes = row.getElementsByClassName("box")
    // remove the letter from the box
    boxes[nextLetter - 1].innerHTML = "";
    if (nextLetter < 4) {
        boxes[nextLetter].classList.remove("border-primary")
    }
    nextLetter--;
    
    boxes[nextLetter].classList.add("border-primary")
    
}


// create a function that checks the guess against the word and highlights the correct letters in green and the incorrect letters in red
const checkGuess = async () => {
    if (nextLetter !== 4) {
        //prompt the user that they must complete the word first
        window.alert("You must complete the word before submitting your guess")
        return
    }
    //select just the 'word' part of the object
    let dictionary = await currentWord
    console.log(dictionary)
    let word = dictionary["word"]
    word = word.toLowerCase()
    console.log(word)

    let row = document.getElementsByClassName("row")[4 - guessesRemaining]
    let boxes = row.getElementsByClassName("box")
    let guess = ""

    // iterate through each box and check if the letter is correct
    for (let i = 0; i < 4; i++) {
        let letter = boxes[i].innerHTML
        guess += letter
        if (letter === word[i]) {
            boxes[i].classList.add("bg-success")
            boxes[i].classList.add("text-white")
        } else {
            boxes[i].classList.add("bg-secondary")
            boxes[i].classList.add("text-white")
        }
    }
    // if the guess is correct, end the game
    if (guess === word) {
        console.log("you win")
        return
    }
    // if the guess is incorrect, remove the highlight from the boxes and reset the nextLetter variable
    for (let i = 0; i < 4; i++) {
        boxes[i].classList.remove("border-primary")
    }
    nextLetter = 0
    guessesRemaining--
    // if the user has no guesses remaining, end the game
    if (guessesRemaining === 0) {
        let Alert = `<div class="alert alert-danger fade show text-center" role="alert"> You have no guesses remaining. The word was <span class="fw-bold">` + word.toUpperCase() + `</span></div>`
        // insert the alert into the placeholder div
        document.getElementById('AlertPlaceholder').innerHTML = Alert
        return
    }
    // if the user has guesses remaining, highlight the first box of the next row
    let nextRow = document.getElementsByClassName("row")[4 - guessesRemaining]
    let nextBoxes = nextRow.getElementsByClassName("box")
    nextBoxes[0].classList.add("border-primary")
}

// hint button function
document.getElementById('hintButton').addEventListener('click', async () => {
    let dictionary = await currentWord
    let hint = dictionary["hint"]
    // create a bootstrap alert with the hint
    let hintAlert = `<div class="alert alert-warning fade show text-center" role="alert">` + hint
    // insert the alert into the placeholder div
    document.getElementById('AlertPlaceholder').innerHTML = hintAlert
})
