var size;
var isWin = false;
var arrayOfElems = [];
var rightArray =[];

/**
* used once in the body to initialize the game
* @param ustomSize must be loaded from XML
*/
function onload(customSize) {
    setUp(customSize);
    fillGrid();
    sufflePuzzle();
    document.addEventListener("keydown", keyPressed);
}

/**
* set the size of the grid and the right order array
*/
function setSize(customSize) {
    size = customSize;
    
    for (var i = 1; i < size*size; i++) {
        rightArray.push(i);
    }
    rightArray.push("blank");
}

/**
* check if it is possible to move the blank cell when a key arrow was pressed
*/
function keyPressed(e) {
    var pressedKey = e.keyCode;
    
    var blanc_cell = findBlank();

    if (pressedKey == 37) { // if left arrow pressed
    
        if (blanc_cell % size == 1) { // blank cell is on the very left column
            return;
        }
        swap(arrayOfElems, blanc_cell-1, blanc_cell-2); // move blank cell to left
    } 
    
    else if (pressedKey == 38) { // if up arrow pressed
        
        if (blanc_cell - size <= 0) { // blank cell is on the top already
            return;
        }
        swap(arrayOfElems, blanc_cell-1, (blanc_cell-1)-size);
        
    } else if (pressedKey == 39) { // if right arrow pressed
        
        if (blanc_cell % size == 0) { // blank cell is on the right
            return;
        }
        swap(arrayOfElems, blanc_cell-1, blanc_cell);
    } 
    else if (pressedKey == 40) { // if down key pressed
        
        if (blanc_cell + size > size*size) { // blank cell is on the bottom
            return;
        }
        swap(arrayOfElems, blanc_cell-1, (blanc_cell-1)+size);
    }
    fillGrid();
    
    checkWin();
    if (isWin) {
        setWinButton();
        document.removeEventListener("keydown", keyPressed);
    }
}

/**
* to fill the div class=game with divs "nuls"
* and array of elements which is used to move the cells
*/
function setUp(customSize) {
    // save the custom size in var size of the class
    setSize(customSize);
    console.log("in set up");
    var i = 0;
    // fill the divs
    var m;
    for (m = 1; m <= size*size; m++) {
        
        
        var elem = document.createElement("button");
        var id = m;
        var onclick = "play(this.id); ";
        elem.setAttribute("id", id);
        elem.setAttribute("onclick", onclick);
        elem.setAttribute("class", "piece");
        document.getElementById("game").appendChild(elem);
        i = i+1;
        
        if (i == size) {
            i = 0;
            var mybr = document.createElement('br');
            document.getElementById("game").appendChild(mybr);
        }
        
    }
    
    // fill the array
    for (var i = 1; i < size*size; i++) {
        arrayOfElems.push(i);
    }
    arrayOfElems.push("blank");
    
}


/**
 * Shuffles array in place.
 * @param {Array} a items The array containing the items.
 */
function shuffle(a) {
    var j, x, i;
    for (i = a.length; i; i -= 1) {
        j = Math.floor(Math.random() * i);
        x = a[i - 1];
        a[i - 1] = a[j];
        a[j] = x;
    }
}

/**
* fill the buttons with appropriate content of the array of elements with current position
*/
function fillGrid() {
    for (var i = 1; i <= arrayOfElems.length; i++) {
        document.getElementById(i).innerHTML = arrayOfElems[i-1];
    }
}

function sufflePuzzle() {
    shuffle(arrayOfElems);
    fillGrid();
    isWin = false;
}

/**
* search the position of blank cell in the grid
*/
function findBlank() {
    for (var i = 1; i <= size*size; i++) {
        var name = document.getElementById(i).innerHTML;
        if (name == "blank") {
            console.log("blank cell:", i);
            return i;
        }
    }
}

/**
* set the game in the "winning" position
* (was written to tests)
*/
function reorderPuzzle() {
    // initialize the array
    arrayOfElems = [];
    
    // fill the array
    for (var i = 1; i < size*size; i++) {
        arrayOfElems.push(i);
    }
    arrayOfElems.push("blank");
    fillGrid();
    isWin = true;
    document.removeEventListener("keydown", keyPressed);
}

/**
* swap element on indexes i and j of array a
*/
function swap(ar, i, j) {
    var tmp = ar[i];
    ar[i] = ar[j];
    ar[j] = tmp;
}

/**
* when cell is clicked, check if can move
* used in play()
*/
function checkButton(imgnum) {
    var index = parseInt(imgnum);
    console.log(index);
    var bottom;
    if (index + size > size*size) {
        bottom = -1;
    }
    else {
        bottom = index+size;
    }
    
    var top;
    if (index - size < 1) {
        top = -1;
    }
    else {
        top = index - size;
    }
    
    var right;
    if ((index+1)%size == 1) {
        right = -1;
    }
    else {
        right = index+1;
    }
    
    var left;
    if ((index-1)%size == 0) {
        left = -1;
    }
    else {
        left = index-1;
    }
    
    console.log("bottom:", bottom, "left:", left, "right:", right, "top:", top);
    
    if (document.getElementById(index).innerHTML != "blank") {
        // raisonnement en index de array - pour cela -1 est fait
        
        // si en haut est le blank on les swap
        if (arrayOfElems[bottom-1] == "blank") {
            console.log("bottom blank", "bottom-1=", bottom-1);
            swap(arrayOfElems, bottom-1, index-1);
        }
        
        else if (arrayOfElems[top-1] == "blank") {
            swap(arrayOfElems, top-1, index-1);
        }
        
        else if (arrayOfElems[left-1] == "blank") {
            swap(arrayOfElems, left-1, index-1);
        }
        
        else if (arrayOfElems[right-1] == "blank") {
            swap(arrayOfElems, right-1, index-1);
        }
        
        fillGrid();
        checkWin();
        
        if (isWin == true) {
            setWinButton();
        }
    }
    
}

/**
* when button cell is clecked, check if user have already won
* if not, move the cell if possible
*/
function play(imgnum) {
    if (!isWin){
        checkButton(imgnum);
    }
    else {
        console.log("t'as deja gagne, c'est bon");
    }
}

/**
* check if user have won
*/
function checkWin() {
    for (var i = 1; i < size*size; i++) {
        var elem = document.getElementById(i).innerHTML;
        if (elem != rightArray[i-1]) {
            console.log("pas gagne");
            isWin = false;
            return;
        }
    }
    isWin = true;
    setWinButton();
    console.log("gagne");
}

/**
* add the NEXT button in the document
* must be modified when implementing in project
*/
function setWinButton() {
    var elem = document.createElement("button");
    elem.innerHTML = "You win. Click to continue";
    document.body.appendChild(elem);
}