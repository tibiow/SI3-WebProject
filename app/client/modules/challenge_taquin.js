var piece, x, y, size;
var isWin = false;
var resFolder = "puzzle/";
var x3 = resFolder + "3x3/";

var keyDownTextField = function(e) {
    keyPressed(e.keyCode);
}

var findBlankCell = function() {
    for (var m = 0; m < size; m++) {
        for (var n = 0; n < size; n++) {
            var src_name = document.getElementById("pic" + m + n).getAttribute('src');
            if (src_name == resFolder + "blank.jpg" || src_name == x3 + "blank.jpg") {
                var index = {
                    "x": n,
                    "y": m
                }
                return index;
            }
        }
    }
}

var keyPressed = function(e) {
    var blanc_cell = findBlankCell();
    var blank_cell_position_x = blanc_cell["x"];
    var blank_cell_position_y = blanc_cell["y"];

    if (e == 37) { // if left arrow pressed
        var left_position_x = blank_cell_position_x + 1;
        if (left_position_x > size - 1) {
            return;
        }
        piece[blank_cell_position_y][blank_cell_position_x] = piece[blank_cell_position_y][left_position_x];
        piece[blank_cell_position_y][left_position_x] = "blank.jpg";
    } else if (e == 38) { // if up arrow pressed
        var left_position_y = blank_cell_position_y + 1;
        if (left_position_y > size - 1) {
            return;
        }
        piece[blank_cell_position_y][blank_cell_position_x] = piece[left_position_y][blank_cell_position_x];
        piece[left_position_y][blank_cell_position_x] = "blank.jpg";
    } else if (e == 39) { // if right arrow pressed
        var left_position_x = blank_cell_position_x - 1;
        if (left_position_x < 0) {
            return;
        }
        piece[blank_cell_position_y][blank_cell_position_x] = piece[blank_cell_position_y][left_position_x];
        piece[blank_cell_position_y][left_position_x] = "blank.jpg";
    } else if (e == 40) { // if down key pressed
        var left_position_y = blank_cell_position_y - 1;
        if (left_position_y < 0) {
            return;
        }
        piece[blank_cell_position_y][blank_cell_position_x] = piece[left_position_y][blank_cell_position_x];
        piece[left_position_y][blank_cell_position_x] = "blank.jpg";
    }
    checkWin();
    if (isWin) {
        document.removeEventListener("keydown", keyDownTextField);
    }
    swop();
}

var onLoad = function() {
    //console.log("loaded");
    setSize(4);
    setUp();
    ReorderPuzzle();
    RandomizePuzzle();
    document.addEventListener("keydown", keyDownTextField);
}

var setSize = function(customSize) {
    size = customSize;
}

var ReorderPuzzle = function() {
    piece = new Array();
    isWin = true;
    if (size == 3) {
        piece[piece.length] = new Array("pic00.jpg", "pic01.jpg", "pic02.jpg");
        piece[piece.length] = new Array("pic10.jpg", "pic11.jpg", "pic12.jpg");
        piece[piece.length] = new Array("pic20.jpg", "pic21.jpg", "blank.jpg");
    } else if (size == 4) {
        piece[piece.length] = new Array("pic00.jpg", "pic01.jpg", "pic02.jpg", "pic03.jpg");
        piece[piece.length] = new Array("pic10.jpg", "pic11.jpg", "pic12.jpg", "pic13.jpg");
        piece[piece.length] = new Array("pic20.jpg", "pic21.jpg", "pic22.jpg", "pic23.jpg");
        piece[piece.length] = new Array("pic30.jpg", "pic31.jpg", "pic32.jpg", "blank.jpg");
    }
    swop();
    document.removeEventListener("keydown", keyDownTextField);
}

var setUp = function() {
    for (var m = 0; m < size; m++) {
        for (var n = 0; n < size; n++) {
            var elem = document.createElement("img");
            var id = "pic" + m + n;
            var onclick = "puzzleView.puzzle.play(" + id + ")";
            elem.setAttribute("src", "");
            elem.setAttribute("id", id);
            elem.setAttribute("ng-click", onclick);
            elem.setAttribute("alt", "");
            document.getElementById("game").appendChild(elem);
        }
        var mybr = document.createElement('br');
        document.getElementById("game").appendChild(mybr);
    }
}

var play = function(imgnum) {
    console.log("play --> " + imgnum);
    if (isWin == false) {
        //console.log("in play: isWin: ", isWin);
        check(imgnum);
    }
}

var check = function(imgnum) {
    x = parseInt(imgnum.substring(4, 5)); // Retrieves the x co-ordinate of the image from it's ID.
    y = parseInt(imgnum.substring(3, 4)); // Retrieves the y co-ordinate of the image from it's ID.
    //console.log("x:", x);
    //console.log("y:", y);
    // alert(y+':'+x);  // for testing purposes
    var ylow = (y - 1 < 0) ? 0 : y - 1; // This makes sure that the lower bound of y does not drop below 0.
    var yhigh = (y + 1 > size - 1) ? 0 : y + 1; // This makes sure that the upper bound of y does not drop go above 3.
    var xlow = (x - 1 < 0) ? 0 : x - 1; // This makes sure that the lower bound of x does not drop below 0.
    var xhigh = (x + 1 > size - 1) ? 0 : x + 1; // This makes sure that the upper bound of x does not drop go above 3.

    if (document.getElementById(imgnum).src != "blank.jpg") {

        if (piece[ylow][x] == "blank.jpg") {
            piece[ylow][x] = piece[y][x];
            piece[y][x] = "blank.jpg";
        } // Checks above y for a blank image and if it finds one a swop is made.
        else if (piece[yhigh][x] == "blank.jpg") {
            piece[yhigh][x] = piece[y][x];
            piece[y][x] = "blank.jpg";
        } // Checks below y for a blank image and if it finds one a swop is made.
        else if (piece[y][xlow] == "blank.jpg") {
            piece[y][xlow] = piece[y][x];
            piece[y][x] = "blank.jpg";
        } // Checks above x for a blank image and if it finds one a swop is made.
        else if (piece[y][xhigh] == "blank.jpg") {
            piece[y][xhigh] = piece[y][x];
            piece[y][x] = "blank.jpg";
        } // Checks below x for a blank image and if it finds one a swop is made.
    }
    swop();
}

var swop = function() {
    for (var m = 0; m < size; m++) {
        for (var n = 0; n < size; n++) {
            if (size == 3) {
                document.getElementById("pic" + m + n).src = x3 + piece[m][n]; // Swops all the image sources for the ones in the array.
                document.getElementById("pic" + m + n).alt = x3 + piece[m][n];
            } else if (size == 4) {
                document.getElementById("pic" + m + n).src = resFolder + piece[m][n]; // Swops all the image sources for the ones in the array.
                document.getElementById("pic" + m + n).alt = resFolder + piece[m][n];
            }
        }
    }
}

var randOrd = function() {
    return (Math.round(Math.random()) - 0.5);
}

var RandomizePuzzle = function() {
    isWin = false;
    //console.log("isWin in Randomize:", isWin);
    var RndArr;
    if (size == 3) {
        RndArr = ['00', '01', '02', '10', '11', '12', '20', '21', '22'];
    } else if (size == 4) {
        RndArr = ['00', '01', '02', '03', '10', '11', '12', '13', '20', '21', '22', '23', '30', '31', '32', '33'];
    }
    RndArr.sort(randOrd);
    RndArr.sort(randOrd); // do it again just for kicks if desired
    // alert(RndArr.join(' '));	// for testing purposes
    var i = 0;
    for (var m = 0; m < size; m++) {
        for (var n = 0; n < size; n++) {
            var pix = 'pic' + RndArr[i]; // alert(pix);
            if ((size == 4 && pix == 'pic33')) {
                piece[m][n] = 'blank.jpg';
            } else if (size == 3 && pix == "pic22") {
                piece[m][n] = 'blank.jpg';
            } else {
                piece[m][n] = pix + '.jpg';
            }
            if (size == 3) {
                document.getElementById(pix).src = x3 + piece[m][n];
                document.getElementById(pix).alt = x3 + piece[m][n];
            }
            document.getElementById(pix).src = piece[m][n];
            document.getElementById(pix).alt = piece[m][n];
            i++;
        }
    }
    swop();
}

var checkWin = function() {
    for (var m = 0; m < size; m++) {
        for (var n = 0; n < size; n++) {
            var src_name = document.getElementById("pic" + m + n).getAttribute('src');
            var id = "pic" + m + n + ".jpg"
                // check for blank (the last)
            if (size == 4 && id == "pic33.jpg" && src_name == "blank.jpg") {
                //console.log("blank case: true");
                isWin = true;
                //console.log("isWin:", isWin);
                return;
            } else if (size == 3 && id == "pic22.jpg" && src_name == "blank.jpg") {
                //console.log("blank case: true");
                isWin = true;
                //console.log("isWin:", isWin);
                return;
            } else if (src_name != id) {
                //console.log("src name:", src_name);
                //console.log("id:", id);
                //console.log("isWin:", isWin);
                return;
            }
        }
    }
    isWin = true;
    //console.log("isWin:", isWin);
}

// function to test
var hasWon = function() {
    return isWin;
}

//exporting what we need
Modules.client.challenge_taquin = {
    "load": onLoad,
    "play": play,
    "checkWin": checkWin,
    "hasWon": hasWon,
    "randomize": RandomizePuzzle,
    "reorder": ReorderPuzzle
};
