let board;
let boardWidth = 800;
let boardHeight = 300;
let context;

//ตั้งค่าตัวละครเกม
let playerWidth = 85;
let playerHeight = 85;
let playerX = 50;
let playerY = boardHeight - playerHeight;
let playerImg;
let player = {
    x: playerX,
    y: playerY,
    width: playerWidth,
    height: playerHeight
};
let gameOver = false;
let score = 0;
let time = 0;

//อุปสรรค
let boxImg;
let boxWidth = 50; // กำหนดขนาดของกล่อง
let boxHeight = 50; // กำหนดขนาดของกล่อง
let boxX = boardWidth;
let boxY = boardHeight - boxHeight;

let boxesArray = [];
let boxSpeed = -3;

//gravity & velocity
let velocityY = 0;
let gravity = 0.25;

// นับจำนวนครั้งที่เล่นใหม่
let restartCount = 0;
const maxRestarts = 2;

console.log(player);

//กำหนดเหตุการเริ่มเกม
window.onload = function() {
    board = document.getElementById('board');
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");

    //player
    playerImg = new Image();
    playerImg.src = "https://blogger.googleusercontent.com/img/a/AVvXsEg9WRqUf5ooqAVW3I0YiV9mUH4mc1lzCZE00f0uiAhVs_3vYTuDk57upmLo8gxznQbNLDgvsbZsSGwToKq0DwVKewCKHNE6eRIuLsC3yPpH7UOwl-7qWVsPMqZiRTNutbEUdeOBmQh3rGqvgl2NUGYIWvrgSN_0lEL5m458NBZwg6rocbJR0TV9BrCQeHQk";
    playerImg.onload = function () {
        context.drawImage(playerImg, player.x, player.y, player.width, player.height);
    } 

    //request animation frame
    requestAnimationFrame(update);

    //ดักจับกระโดด
    document.addEventListener("keydown", movePlayer);
    
    //สร้าง box
    boxImg = new Image();
    boxImg.src = "https://blogger.googleusercontent.com/img/a/AVvXsEg_cbR2WbP7CosO-PSdfuJrQP4eyCwj0naXOw16_wiPltrykbwrMKac9equzwGc4cwLvWcnfir3ihOZS_kApiHN1dgMDP5hEPP46Lm14fsmC765sVlXV5GnJmHMaFji8-ooVUoPVKKE4q-3838EOMWXdNuGe0HQNHIu_IXKCmilj8Eo3PUjubHmXbDTOgoj";
    scheduleNextBox(); 
     
}

// ฟังก์ชันสุ่มเวลาสำหรับการสร้างกล่องใหม่
function scheduleNextBox() {
    if (gameOver) {
        return;
    }

    //สุ่มเวลาระหว่าง 2 ถึง 3 วินาที
    let randomTime = Math.random() * 4000 + 2000; 
    setTimeout(function() {
        createBox();
        scheduleNextBox(); // สร้างกล่องใหม่และกำหนดเวลาสำหรับกล่องถัดไป
    }, randomTime);
}

//fun update
function update() {
    requestAnimationFrame(update); // update anime ตลอดเวลา

    if (gameOver) { // ตรวจสอบว่าเกม over หรือไม่
        return;
    }

    context.clearRect(0, 0, board.width, board.height); // เคลียร์ภาพซ้อน
    velocityY += gravity;

    // Update player position
    player.y = Math.min(player.y + velocityY, playerY);
    context.drawImage(playerImg, player.x, player.y, player.width, player.height);
    
    // Update and draw boxes
    for (let i = 0; i < boxesArray.length; i++) {
        let box = boxesArray[i];
        box.x += boxSpeed;
        context.drawImage(box.img, box.x, box.y, box.width, box.height);

        // ตรวจสอบการชน
        if (onCollision(player, box)) {
            gameOver = true;

            // แจ้งเตือนผล.
            context.font = "normal bold 40px Arial";
            context.textAlign = "center";
            context.fillText("เกมจบแล้ว!", boardWidth / 2, boardHeight / 2);
            context.font = "normal bold 40px Arial";
            context.fillText("Score : " + score, boardWidth / 2, boardHeight / 2 + 50);
            return; // หยุดการอัปเดตเพิ่มเติมเมื่อเกมจบ
        }
    }

    // นับคะแนน
    score++;
    context.font = "normal bold 40px Arial";
    context.textAlign = "left";
    context.fillText("Score : " + score, 10, 34);

    // นับเวลา
    time += 0.01;
    context.font = "normal bold 20px Arial";
    context.textAlign = "right";
    context.fillText("Time : " + (time.toFixed()), boardWidth - 10, 30);
    
    if (time >= 60) {
        gameOver = true;
        context.font = "normal bold 40px Arial";
        context.textAlign = "center";
        context.fillText("เกมจบแล้ว!", boardWidth / 2, boardHeight / 2);
        context.font = "normal bold 40px Arial";
        context.fillText("Score : " + score, boardWidth / 2, boardHeight / 2 + 50);
        context.font = "normal bold 20px Arial";
        context.fillText("กด R เพื่อเริ่มเกมใหม่", boardWidth / 2, boardHeight / 2 + 100);
    }
}


function movePlayer(e) {
    if (gameOver) {
        if (e.code === "KeyR" && restartCount < maxRestarts) {
            restartGame();
        }
        return;
    }

    if (e.code === "Space" && player.y === playerY) {
        velocityY = -10;
    }
}

function createBox() {
    if (gameOver) {
        return;
    }

    let box = {
        img: boxImg,
        x: boxX,
        y: boxY,
        width: boxWidth,
        height: boxHeight
    };
    boxesArray.push(box);

    if (boxesArray.length > 5) {
        boxesArray.shift(); // แก้ไขการลบกล่อง
    }
}

function onCollision(obj1, obj2) {
    return obj1.x < (obj2.x + obj2.width) &&
           (obj1.x + obj1.width) > obj2.x && 
           obj1.y < (obj2.y + obj2.height) &&
           (obj1.y + obj1.height) > obj2.y; 
}

//re game
function restartGame() {
    if (restartCount < maxRestarts) {
        restartCount++;
        gameOver = false;
        score = 0;
        time = 0;
        velocityY = 0;
        boxesArray = [];
        player.y = playerY;
        scheduleNextBox(); 
    } else {
        context.font = "normal bold 30px Arial";
        context.textAlign = "center";
        context.fillText("โปรดโหลดหน้าใหม่เพื่อเริ่มเกม", boardWidth / 2, boardHeight / 2+100);

    }
}