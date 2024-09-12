let gameState = "start";  // 初始状态
let choices = [];
let hasShelter = false;  // 玩家是否已经建造了庇护所
let wood = 0;  // 木材数量
let rope = 0;  // 绳索数量
let health = 100;  // 初始生命值
let backpack = { wood: 0, rope: 0 };  // 背包系统，存储玩家拥有的资源
let warningThreshold = 20;  // 低生命值警告的阈值
let showShelterRequirements = false;  // 是否显示建造庇护所的材料
const requiredWood = 5;  // 建造庇护所所需木材
const requiredRope = 3;  // 建造庇护所所需绳索

function setup() {
  createCanvas(800, 600);
  textSize(18);
  fill(255);
}

function draw() {
  background(0);
  displayStory();  // 显示当前的故事文本
  displayChoices();  // 显示玩家可选的操作
  displayStatus();  // 显示玩家的状态（生命值、背包等）

  // 在玩家开始收集资源后显示建造庇护所所需的材料（在庇护所建成前始终显示）
  if (showShelterRequirements && !hasShelter) {
    displayShelterRequirements();
  }

  // 生命值警告：当生命值低于一定阈值时，显示警告信息
  if (health <= warningThreshold && health > 0) {
    fill(255, 0, 0);
    text("Warning: Your health is low!", 50, 450);
    fill(255);  // 恢复默认文本颜色
  }

  // 如果生命值为0，游戏将显示濒死状态并阻止进一步操作
  if (health <= 0) {
    fill(255, 0, 0);
    text("You are exhausted and cannot continue. Return to the shelter to recover.", 50, 500);
    noLoop();  // 暂停游戏循环，玩家无法继续操作
  }
}

// 显示建造庇护所所需的材料，直到庇护所建成
function displayShelterRequirements() {
  fill(255);
  text("Shelter Requirements:", 333, 400);  // 将材料需求显示在屏幕底部，避免与其他文本重叠
  text(`Wood: ${backpack.wood}/${requiredWood}`, 333, 430);
  text(`Rope: ${backpack.rope}/${requiredRope}`, 333, 460);
}

function displayStory() {
  textAlign(LEFT);
  let storyText = "";

  // 初始状态：玩家在岛上醒来，有一个背包
  if (gameState === "start") {
    storyText = "You wake up on a deserted island. You realize you need to build a shelter to survive. Collect wood and rope to construct it.";
    choices = ["Continue"];  // 玩家继续了解材料信息
    showShelterRequirements = false;  // 初始时不显示材料信息

  // 在玩家选择“继续”后，显示材料信息
  } else if (gameState === "showRequirements") {
    storyText = "Now, you must gather materials to build the shelter.";
    choices = ["Explore the forest", "Walk along the beach"];
    showShelterRequirements = true;  // 开始显示材料信息

  // 森林场景：玩家可以收集木材和绳索
  } else if (gameState === "exploreForest") {
    if (health > 20) {
      storyText = "You enter the dense forest. You find some useful materials. What do you want to do?";
      choices = ["Collect wood", "Collect rope", "Return to the start"];
    } else {
      storyText = "Your health is too low to explore the forest.";
      choices = ["Return to the start"];
    }

  // 沙滩场景：玩家可以收集木材或其他材料
  } else if (gameState === "walkBeach") {
    storyText = "You walk along the beach. Waves crash gently, and you see some debris. What will you do?";
    choices = ["Search for wood", "Search for rope", "Return to the start"];

  // 触发建造庇护所的场景
  } else if (gameState === "buildShelter") {
    storyText = "You have gathered enough materials to build a shelter. Do you want to build it now?";
    choices = ["Yes, build the shelter", "No, keep gathering materials"];

  // 庇护所建造完成后的场景
  } else if (gameState === "shelter") {
    storyText = "You have built a shelter. It provides safety and a place to rest. What do you want to do next?";
    choices = ["Rest and regain health", "Explore the island"];
  }

  text(storyText, 50, 50, 700, 200);
}

function displayChoices() {
  textAlign(LEFT);
  for (let i = 0; i < choices.length; i++) {
    text((i + 1) + ": " + choices[i], 50, 300 + i * 50);
  }
}

// 显示玩家的状态（生命值、背包中的物资等）
function displayStatus() {
  text(`Health: ${health}`, 50, 500);
  text(`Wood: ${backpack.wood}`, 50, 550);
  text(`Rope: ${backpack.rope}`, 200, 550);
}

function keyPressed() {
  if (health <= 0) return;  // 如果生命值为0，无法执行任何操作

  // 初始状态选择
  if (gameState === "start" && key === '1') {
    gameState = "showRequirements";  // 玩家选择继续，显示建造庇护所的任务和材料需求
  }

  // 显示材料需求后的选择
  else if (gameState === "showRequirements" && key === '1') {
    gameState = "exploreForest";  // 玩家选择探索森林
  } else if (gameState === "showRequirements" && key === '2') {
    gameState = "walkBeach";  // 玩家选择走向沙滩

  // 森林场景选择
  } else if (gameState === "exploreForest" && key === '1') {
    if (health > 20) {
      backpack.wood += 2;  // 收集木材到背包
      health -= 10;  // 每次探索消耗10点生命值
    }
    gameState = "exploreForest";  // 采集后保持在当前场景
  } else if (gameState === "exploreForest" && key === '2') {
    if (health > 20) {
      backpack.rope += 1;  // 收集绳索到背包
      health -= 10;  // 每次探索消耗10点生命值
    }
    gameState = "exploreForest";  // 采集后保持在当前场景
  } else if (gameState === "exploreForest" && key === '3') {
    gameState = "showRequirements";  // 玩家返回起点

  // 沙滩场景选择
  } else if (gameState === "walkBeach" && key === '1') {
    backpack.wood += 1;  // 从沙滩收集木材到背包
    health -= 10;  // 每次探索消耗10点生命值
    gameState = "walkBeach";  // 采集后保持在当前场景
  } else if (gameState === "walkBeach" && key === '2') {
    backpack.rope += 1;  // 从沙滩收集绳索到背包
    health -= 10;  // 每次探索消耗10点生命值
    gameState = "walkBeach";  // 采集后保持在当前场景
  } else if (gameState === "walkBeach" && key === '3') {
    gameState = "showRequirements";  // 玩家返回起点

  // 检查是否可以建造庇护所
  } else if (gameState === "showRequirements") {
    if (backpack.wood >= requiredWood && backpack.rope >= requiredRope) {
      gameState = "buildShelter";  // 玩家选择建造庇护所
    }
  }

  // 建造庇护所的选择
  if (gameState === "buildShelter" && key === '1') {
    hasShelter = true;
    gameState = "shelter";  // 玩家成功建造庇护所
  } else if (gameState === "buildShelter" && key === '2') {
    gameState = "showRequirements";  // 玩家选择继续收集材料
  }

  // 庇护所的选择
  else if (gameState === "shelter" && key === '1') {
    health += 20;  // 玩家在庇护所中休息恢复生命值
    if (health > 100) health = 100;  // 生命值上限为100
    gameState = "showRequirements";  // 休息后玩家可以继续探索
    loop();  // 允许玩家继续游戏
  } else if (gameState === "shelter" && key === '2') {
    gameState = "showRequirements";  // 玩家继续探索岛屿
  }
}