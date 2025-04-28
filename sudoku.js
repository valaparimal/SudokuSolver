const boardContainer = document.getElementById("sudoku-board");
const solveButton = document.getElementById("solve-button");
const reloadButton = document.getElementById("reload-button");

let board = new Array(0);
let errorString;

// create inputs 
for(let i=1; i<=81 ; i++){
    let cell = document.createElement("input");
    cell.setAttribute("class","cell")
    cell.type="number";
    cell.min=0;
    cell.max=9;
    cell.addEventListener("input",()=>{
        cell.value = cell.value%10;
    });
    boardContainer.appendChild(cell);
}


// click listener for solve button

solveButton.addEventListener("click",async()=>{
    solveButton.disabled = true;
    solveButton.style.backgroundColor="lightGray";
    solveButton.style.color="white";
    solveButton.style.boxShadow="none";
    // board.disabled = true;

    document.getElementById("loader").style.display="flex";
    document.querySelector(".container").style.opacity="0.5";
    await new Promise(resolve =>setTimeout(resolve,100));

    
    createSudokuArray();
    if(isCorrectSudocu()){
        if(solveSudoku(0,0)){
            // solveButton.disabled = false;
            solveButton.style.backgroundColor="green";
        }else{
            console.log("Sothing wrong...");
        }
    }else{
        console.log("Sudoku may wrong! (Please check data!)")   
    }
    document.getElementById("loader").style.display="none";
    document.querySelector(".container").style.opacity="1";
});

reloadButton.addEventListener("click",()=>{
    location.reload();
});


function solveSudoku(row,column){
    if(column == board.length){
        column = 0;
        row++;
    }

    if(row == board.length){
        printBoard();
        return true;
    }
    if(board[row][column] == 0){
        for(let i=1 ; i<10 ; i++){
            if(isPut(i,row,column)){
                board[row][column] = i;
                if(solveSudoku(row,column+1)){
                    return true;
                }else{
                    board[row][column] = 0;
                }
            }
        }
    }else{
       return solveSudoku(row,column+1);
    }
    
    return false;
}

// function createSudokuArray(){

//     let array = new Array(0);
//     let celles = document.querySelectorAll(".cell");

//     celles.forEach((cell)=>{
//         let number;
//         if(cell.value == ""){
//             number=0;
//         }else{
//             number=cell.value;
//             cell.style.backgroundColor="yellow";
//             cell.style.color = "black";
//         }
//         array.push(number);
//         cell.disabled = true;
//     });

//     let index=0;
//     for(let i=0; i<9 ; i++){
//         let row = new Array(0);
//         for(let j=0; j<9 ; j++){
//             row.push(array[index]);
//             index++;
//         }
//         board.push(row);
//     }
// }

function createSudokuArray(){

    let celles = document.querySelectorAll(".cell");
    let rowArray = new Array(0);
    
    let index = 0;

    celles.forEach((cell)=>{
        let number;
        if(cell.value == ""){
            number=0;
        }else{
            number=cell.value;
            cell.style.backgroundColor="lightyellow";
            cell.style.color = "black";
        }
        
        rowArray[index++] = number;
        if(index == 9){
            index =0;
            board.push(rowArray);
            rowArray = new Array(0);
        }
        cell.disabled = true;
    });
}


function isCorrectSudocu(){
    for(let i=0; i<9; i++){
        for(let j=0; j<9 ; j++){
            let number = board[i][j];
            if(number != 0){
                board[i][j] = 0;
                if(!isPut(number,i,j)){
                    let errorDiv = document.querySelector(".error");
                    errorDiv.style.display="block";
                    errorDiv.innerText = `Sudoku may wrong! (Please check data!)\nNumber : ${number}\ni) (Row,Column) : ( ${i+1} , ${j+1} ) ${errorString}`;
                    return false;
                }
                board[i][j] = number;
            }
        }
    }

    return true;
}

function isPut(number,row,column){
    for(let i=0 ; i<9 ; i++){

        // horizontal check
        if(board[row][i] == number){
            errorString = `\nii) (Row,Column) : ( ${row+1} , ${i+1} )`;
            return false;
        }

        // verticle check
        if(board[i][column] == number){
            errorString = `\nii) (Row,Column) : ( ${i+1} , ${column+1} )`;
            return false;
        }
    }

    // cross check

    let startRow = row - row%3;
    let startColumn = column - column%3;

    for(let i=startRow; i<startRow+3 ; i++){
        for(let j=startColumn ; j<startColumn+3 ; j++){
            if(board[i][j] == number){
                errorString = `\nii) (Row,Column) : ( ${i+1} , ${j+1} )`;
                return false;
            }
        }
    }

    return true;
}

function printBoard(){
    let celles = document.querySelectorAll(".cell");
    let row=0;
    let column=0;
    celles.forEach((cell)=>{
        cell.value = board[row][column];
        column++;
        if(column == 9){
            column =0;
            row++;
        }
    });
}