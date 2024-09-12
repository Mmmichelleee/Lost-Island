let gameState = "start";  // 初始状态
let choices = [];
let hasShelter = false;  // 玩家是否已经建造了庇护所
let wood = 0;  // 木材数量
let rope = 0;  // 绳索数量
let health = 100;  // 初始生命值
let backpack = { wood: 0, rope: 0 };  // 背包系统，存储玩家拥有的资源

function setup() {
    let canvas = document.getElementById("gameCanvas");
    let ctx = canvas.getContext("2d");
    canvas.width = 800;
    canvas.height = 600;
    ctx.font = "18px Arial";
    ctx.fillStyle = "#ffffff";
}

function draw() {
    // Add your game logic here
}

setup();
