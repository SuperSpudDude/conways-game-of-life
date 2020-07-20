const height = 500, width = 500;
const cellPerRow = 50;
const rows = cellPerRow, cols = cellPerRow;
const cellSize = height/cellPerRow;
var isPaused = false;

function generation(ctx, grid){
    if(!isPaused){
        ctx.clearRect(0,0,width,height);
        draw(ctx, grid);
        grid = nextGeneration(grid);
    }
    requestAnimationFrame(() => generation(ctx, grid));
}

function nextGeneration(grid){
    const nextGrid = new Array(grid.length);
    for(let y = 0; y < cellPerRow; y++){
        nextGrid[y] = new Array(grid.length);
        for(let x = 0; x < cellPerRow; x++){
            const cell = grid[y][x]; 
            const neighbours = countNeighbours(grid, x, y);
            if( cell == 1 && (neighbours < 2 || neighbours > 3)){
                nextGrid[y][x] = 0;
            } else if (cell == 0 && neighbours == 3) {
                nextGrid[y][x] = 1;
            } else {
                nextGrid[y][x] = cell;
            }
        }
    }
    return nextGrid;
}

function countNeighbours(grid, cellX, cellY){
    var count = 0;
    for(let y = -1; y < 2; y++){
        for(let x = -1; x < 2; x++){
            var newY = (cellY + y + rows) % rows;
            var newX = (cellX + x + cols) % cols;
            if(grid[newY][newX] == 1){
                count+=1;
            }
        }
    }
    return count - grid[cellY][cellX];
}

function getGrid(){
    var grid = new Array(cellPerRow);
    for(let y = 0; y < cellPerRow; y++){
        grid[y] = new Array(cellPerRow);
        for(let x = 0; x < cellPerRow; x++){
                grid[y][x] = Math.round(Math.random());   
        }
    }
    return grid;
}

function draw(ctx, grid){
    for(let y = 0; y < cellPerRow; y++){
        for(let x = 0; x < cellPerRow; x++){
            if(grid[y][x] == 1){
                ctx.fillStyle = "#000000";
                ctx.fillRect(x*cellSize, y*cellSize, cellSize, cellSize);
            } else {
                ctx.strokeRect(x*cellSize, y*cellSize, cellSize, cellSize);
            }
        }
    }
}

function play(){ isPaused = false;}

function pause(){ isPaused = true; }

function reset(ctx){
    generation(ctx, getGrid());
}


window.onload = () =>{
    // set up page elements
    const c = document.getElementById("myCanvas");
    const ctx = c.getContext("2d");
    document.getElementById("btnPlay").onclick = function(){ play()};
    document.getElementById("btnPause").onclick = function(){ pause()};
    document.getElementById("btnReset").onclick = function(){ reset(ctx)};

    // initialise grid
    const grid = getGrid();
    draw(ctx, grid);
    generation(ctx, grid);
}
