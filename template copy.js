var canvas,g;
var player,enemy1;
var score;
var enemies1 = [];

// シーンの定義
const Scenes = {
  GameMain: "GameMain",
  GameOver:"GameOver",
};

// 画面読み込み時
onload = function(){
  canvas = document.getElementById("gamecanvas");
  g = canvas.getContext("2d");
  init();
  document.addEventListener('keypress', keypress);
  setInterval("gameloop()",16);
};

// 初期値設定
function init(){
  // ゲーム管理データの初期化
  scene = Scenes.GameMain;
  score = 0;

  // プレイヤーの初期値を設定
  player = new Sprite();
  player.image = new Image();
  player.image.src = "./player.jpg";
  player.posx = 400;
  player.posy = 600;
  player.r = 10;
  player.speed = 0;
  player.acceleration = 0;

  player.heart = 3;

  // 敵1(こう)の初期値を設定
  var enemies1 = [];
  // enemy1 = new Enemy();
  // enemy1.image = new Image();
  // enemy1.image.src = "./mii.jpg";
  // enemy1.posx = -400;
  // enemy1.posy = 600;
  // enemy1.r = 10;
  // enemy1.speed = 15;
  // enemy1.acceleration = 0;
  // enemy1.clash_flg = false;

  // 敵2(みなほ)の初期値を設定
  enemy2 = new Sprite();
  enemy2.image = new Image();
  enemy2.image.src = "./mii.jpg";
  enemy2.posx = 420;
  enemy2.posy = 400;
  enemy2.r = 10;
  enemy2.speed = -2;
  enemy2.acceleration = 0;
  enemy2.clash_flg = false;

  // 敵3(パパ)の初期値を設定
  enemy3 = new Sprite();
  enemy3.image = new Image();
  enemy3.image.src = "./dad.jpg";
  enemy3.posx = 800;
  enemy3.posy = 600;
  enemy3.r = 20;
  enemy3.speed = -2;
  enemy3.acceleration = 0;
  enemy3.clash_flg = false;

  // 味方1(ゆう)の初期値を設定
  friend1 = new Sprite();
  friend1.image = new Image();
  friend1.image.src = "./player.jpg";
  friend1.posx = 550;
  friend1.posy = 600;
  friend1.r = 20;
  friend1.speed = -2;
  friend1.acceleration = 0;
  friend1.clash_flg = false;
} 

// キー押下時の動作
function keypress(e){
  if(e.key === ' '){
    // スペースキーが押されたときの処理
    player.speed = -20;
    player.acceleration =1.5;
    console.log('jump');
  }else if(e.key === 'f' || e.key === 'F'){
    // Fキーが押された時の処理
    console.log('f');
    var diffX3 = (enemy3.posx - player.posx)**2;
    var diffY3 = (enemy3.posy - player.posy)**2;
    var distance3 = diffX3 + diffY3;
    var r3 = (enemy3.r+ player.r)**2;
    var action_r = ((enemy3.r + 150)+ player.r)**2;
    if(distance3  > r3 && distance3 <= action_r ){
      enemy3.posy = 150;
      enemy3.speed = 20;
    }
  }
}

//ループ処理
function gameloop(){
  update();
  draw();
  console.log(enemies1)
}

// 更新
function update(){
  // ゲームプレイ中
  if(scene == Scenes.GameMain){
    // プレイヤーの状態更新
    player.speed += player.acceleration;
    player.posy += player.speed;
    if( player.posy >= 600){
      player.posy = 600
      player.speed = 0;
      player.acceleration = 0;  
    }

    // 敵1の状態更新
    if(Math.random() < 0.02){
    const newEnemy1 = new Enemy();
    newEnemy1.image = new Image();
    newEnemy1.image.src = "./mii.jpg";
    newEnemy1.posx = -400;
    // newEnemy1.posx = Math.floor(Math.random() * 1080);
    newEnemy1.posy = 600;
    newEnemy1.r = 10;
    newEnemy1.speed = 15;
    newEnemy1.acceleration = 0;
    newEnemy1.clash_flg = false;

    // 新しい敵1をenemies配列に追加
    enemies1.push(newEnemy1);
    }

    // 既存の敵1の位置を更新
    enemies1.forEach(e => {
      e.posx += e.speed;
    })
    
    // 範囲外の敵を除外
    enemies1 = enemies1.filter((e) => e.posx <= 1020);


    // 敵2の状態更新
    enemy2.posx += enemy2.speed;

    // 敵3の状態更新
    enemy3.posx += enemy3.speed;

    // 味方1の状態更新
    friend1.posx += friend1.speed;

    // あたり判定
    enemies1.forEach(e => {
      var diffX1 = (e.posx - player.posx)**2;
      var diffY1 = (e.posy - player.posy)**2;
      var distance1 = diffX1 + diffY1;
      var r1 = (e.r+ player.r)**2;
      if(distance1 <= r1 && e.clash_flg == false){
        player.heart -= 1;
        e.clash_flg = true;
      }
    });



    var diffX2 = (enemy2.posx - player.posx)**2;
    var diffY2 = (enemy2.posy - player.posy)**2;
    var distance2 = diffX2 + diffY2;
    var r2 = (enemy2.r+ player.r)**2;

    var diffX3 = (enemy3.posx - player.posx)**2;
    var diffY3 = (enemy3.posy - player.posy)**2;
    var distance3 = diffX3 + diffY3;
    var r3 = (enemy3.r+ player.r)**2;

    var diff_friend1X = (friend1.posx - player.posx)**2;
    var diff_friend1Y = (friend1.posy - player.posy)**2;
    var distance_friend1 = diff_friend1X + diff_friend1Y;
    var r_friend1 = (friend1.r+ player.r)**2;

    // if(distance1 <= r1 && enemy1.clash_flg == false){
    //   player.heart -= 1;
    //   enemy1.clash_flg = true;
    // }else 
    if(distance2 <= r2 && enemy2.clash_flg == false){
      player.heart -= 1;
      enemy2.clash_flg = true;
    }else if(distance3 <= r3 && enemy3.clash_flg == false){
      player.heart -= 1;
      enemy3.clash_flg = true;
     }else if(distance_friend1 <= r_friend1 && friend1.clash_flg == false){
      player.heart += 1;
      friend1.clash_flg = true;
     }
    // プレイヤーの体力判定
    if(player.heart <= 0){
      enemy1.speed = 0;
      enemy2.speed = 0;
      enemy3.speed = 0;
      scene = Scenes.GameOver;
    }
    // スコア加算
    if(enemy1.posx > 1080){
    score += 100; 
    enemy1.posx = -20;
    enemy1.speed = 0;
    }else if(enemy2.posx < 0){
      score += 100;
      enemy2.posx = 2000;
      enemy2.speed = 0;
    }else if(enemy3.posx < 0 || enemy3.posx >1080){
      score += 100;
      enemy3.posx = 0;
      enemy3.posy = 20;
      enemy3.speed = 0;
    }

  }// ゲームオーバー中
  else if(scene == Scenes.GameOver){

    } 
}

// 描画
function draw(){
  // 背景描画
   g.fillStyle = "rgb(0, 0, 0)";
   g.fillRect(0, 0, 1080, 700);
 
   // 縦長の四角形を画面の中央に描画
   var rectWidth = 900; // 幅
   var rectHeight = 580; // 高さ
   var x = (canvas.width - rectWidth) / 2; // x座標を計算
   var y = (canvas.height - rectHeight) / 2; // y座標を計算
   g.fillStyle = "rgb(255, 255, 255)"; // 色を設定（例: 赤）
   g.fillRect(x, y, rectWidth, rectHeight);

  //プレイ時
  if(scene == Scenes.GameMain){
    // スコア表示
    g.fillStyle ="rgb(255,255,255)";
    g.font = "16pt Arial";
    var heart_label = "体力："+player.heart + "   score: " + score;
    var heart_label_width = g.measureText(heart_label).width /2;
    g.fillText(heart_label,540 - heart_label_width,40);

    // plyaer描画
    player.draw(g);

    // enemy1描画
    for(let i = 0; i<enemies1.length; i++){
      enemies1[i].draw(g);
    }

    enemy2.draw(g);
    enemy3.draw(g);
    friend1.draw(g);
  
  // ゲームオーバー時
  }else if(scene == Scenes.GameOver){
    //ゲームオーバー表記
    g.fillStyle ="rgb(0,0,0)";
    g.font = "48pt Arial";
    var scorelabel = "GAME OVER";
    var scorelabelWidth = g.measureText(scorelabel).width /2;
    g.fillText(scorelabel,540 - scorelabelWidth ,340);

    //スコア表記
    var score_label = "score"+score;
    var score_label_width = g.measureText(score_label).width /2;
    g.fillText(score_label,540-score_label_width,440);
  }
}

// spriteクラス
class Sprite{
  image = null;
  posx = 0;
  posy = 0;
  r = 0;
  speed = 0;
  acceleration = 0;

  // 描画処理
  draw(g){
    g.drawImage(
      this.image,
      this.posx - this.image.width /2,
      this.posy - this.image.height /2
    )}
}

class Player extends Sprite{
  heart = 0;
}

class Enemy extends Sprite{
  clash_flg = false;
}