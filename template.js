var canvas,g;
var player,enemy1;
var score,scene;
var enemies = [];
var restart_button;

// 敵の初期値を設定
const enemyTypes  =[
  {
    type : 'enemy1',
    image : null,
    src : "./image/enemy1.png",
    posx : 0,
    posy : 600,
    r : 10,
    speed : 10,
    acceleration : 0,
    clash_flg : false
  },
  { 
    type : 'enemy2',
    image : null, 
    src :"./image/mii.jpg",
    posx : 1.22,
    posy : 400,
    r : 10,
    speed : -2,
    acceleration : 0,
    clash_flg : false
  },
  {
    type : 'enemy3',
    image : null,
    src : "./image/enemy3.png",
    posx : 1.08,
    posy : 600,
    r : 20,
    speed : -2,
    acceleration : 0,
    clash_flg : false
},
  {
    type : 'friend1',
    image : null,
    src : "./image/friend1.png",
    posx : 1.7,
    posy : 600, 
    r : 20,
    speed : -2,
    acceleration : 0,
    clash_flg : false
  }
];


// シーンの定義
const Scenes = {
  Start:"Start",
  GameMain: "GameMain",
  GameOver:"GameOver",
};

// 画面読み込み時
onload = function(){
  canvas = document.getElementById("gamecanvas");
  g = canvas.getContext("2d");
  init();
};

// 初期値設定
function init(){
  // ゲーム管理データの初期化
  scene = Scenes.Start;
  draw(); //スタート画面表示
  score = 0;

  // プレイヤーの初期値を設定
  player = new Sprite();
  player.image = new Image();
  player.image.src = "./image/player.png";
  player.posx = 400;
  player.posy = 600;
  player.r = 10;
  player.speed = 0;
  player.acceleration = 0;

  player.heart = 3;
  
  // enemies配列初期化
  enemies = [];
}


// キー押下時の動作
function keypress(e){
  // スペースキーが押されたときの処理
  if(e.key === ' '){
    player.speed = -20;
    player.acceleration =1.0;
    console.log('jump');

  // Fキーが押された時の処理
  }else if(e.key === 'f' || e.key === 'F'){
    console.log('tornade');
    for(const e of enemies){
      if(e.type == 'enemy3'){
        var diffX3 = (e.posx - player.posx)**2;
        var diffY3 = (e.posy - player.posy)**2;
        var distance3 = diffX3 + diffY3;
        var r3 = (e.r+ player.r)**2;
        var action_r = ((e.r + 150)+ player.r)**2;
        if(distance3  > r3 && distance3 <= action_r ){
          e.posy = 150;
          e.speed = 20;
          player.image.src = './image/player_tornade.png';
          setTimeout(()=>{
            player.image.src = "./image/player.png";
          },"500");
          
        }
      }
    }
  }
}

//ループ処理
function fps(){
  var fps = setInterval(()=> {
    update();
    draw();
    if(scene == Scenes.GameOver){
      console.log('stop');
      clearInterval(fps);
    }
  },16);
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

    // 敵の状態更新
    if (Math.random() < 0.01) {
      const enemyType = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
      // console.log(enemyType);
      const newEnemy = new Enemy();
      newEnemy.type = enemyType.type;
      newEnemy.image = new Image();
      newEnemy.image.src = enemyType.src;
      if(newEnemy.type == 'enemy2'||newEnemy.type == 'enemy3'||newEnemy.type == 'friend1'){
      newEnemy.posx = Math.floor(Math.random() *1081)+1080;
      }else if(newEnemy.type == 'enemy1'){
      newEnemy.posx == 0;
      }
      newEnemy.posy = 600;
      newEnemy.r = enemyType.r;
      newEnemy.speed = enemyType.speed;
      newEnemy.acceleration = enemyType.acceleration;
      newEnemy.clash_flg = enemyType.clash_flg;

      // 新しい敵をenemies配列に追加
      enemies.push(newEnemy);
    }
  
    // 範囲外の敵を除外
    enemies = enemies.filter((e) => (e.posx <= 1080) || (e.posx >= 0));

    for(const e of enemies){
      // 既存の敵の位置を更新
      e.posx += e.speed;

      // スコア加算
      if(e.type == 'enemy1' && e.posx > 1080 && e.clash_flg == false){
        score += 100;
        e.clash_flg = true;
        console.log('enemy1');
        }else if(e.type == 'enemy2' && e.posx < 0 && e.clash_flg == false){
          score += 100; 
          e.clash_flg = true;
          console.log('enemy2');
        }else if(e.type == 'enemy3' && e.posx < 0 && e.clash_flg == false){
          score += 100;
          e.clash_flg = true;
          console.log('enemy3');
        }else if(e.type == 'enemy3' && e.posx >= 1080 && e.posy == 150 && e.clash_flg == false){
          score += 100;
          e.clash_flg = true;
          console.log('enemy3_tornado');
        }
    };

    // あたり判定
    for(const e of enemies){
      var diffX1 = (e.posx - player.posx)**2;
      var diffY1 = (e.posy - player.posy)**2;
      var distance1 = diffX1 + diffY1;
      var r1 = (e.r+ player.r)**2;

      if(player.heart < 3 && distance1 <= r1 && e.clash_flg == false && e.type == 'friend1'){
        player.heart += 1;
        e.clash_flg = true;
        console.log('heal');
      }else if(distance1 <= r1 && e.clash_flg == false && (e.type == 'enemy1' ||e.type == 'enemy2'||e.type == 'enemy3')){
          player.heart -= 1;
          e.clash_flg = true;
          console.log('damage');
        }
      };

    // プレイヤーの体力判定
    if(player.heart <= 0){
      scene = Scenes.GameOver;
      enemies.forEach(e =>{
        e.speed = 0;
      })
    }

  }// ゲームオーバー中
  else if(scene == Scenes.GameOver){
    } 
}


// 描画
function draw(){
  g.fillStyle = "rgb(0, 0, 0)";
  g.fillRect(0, 0, 1080, 700);

  // ボタンエリアの作成
  const button_area = document.createElement("div");
  button_area.setAttribute("id",button_area);
  var button_area_style = button_area.style;
  var button_area_styles = {
    display: 'flex',
    position: 'fixed',
    width: '1080px',
    height: '700px',
    top: '20px',
    left: '20px',
    justifyContent:'center',
    alignItems: 'center',
  }
  for(var style in button_area_styles){
    button_area_style[style] = button_area_styles[style];
  }
  document.body.appendChild(button_area);

  // スタート時
  if(scene == Scenes.Start){  
    const start_button = document.createElement("button");
    var start_button_style = start_button.style;
    var start_button_styles = {
      position:'absolute',
      width:'400px',
      height:'100px',
      font: '1.2rem "Arial", sans-serif',
      fontSize:'64px',
      color:' black',
      backgroundcolor: '#eb6100',
      borderRadius: '32px',
      top:'50%'
    }
    start_button.innerHTML = "START";
    for(var style in start_button_styles){
      start_button_style[style] = start_button_styles[style];
    }
    button_area.appendChild(start_button);

    start_button.onclick = ()=>{
      start_button.style.display = 'none';
      scene = Scenes.GameMain;
      document.addEventListener('keypress', keypress);
      fps();
    };

  //プレイ時
  }else if(scene == Scenes.GameMain){
    // 背景描画
    g.fillStyle = "rgb(0, 0, 0)";
    g.fillRect(0, 0, 1080, 700);

    // スコア表示
    g.fillStyle ="rgb(255,255,255)";
    g.font = "16pt Arial";
    var heart_label = "体力："+player.heart + "   score: " + score;
    var heart_label_width = g.measureText(heart_label).width /2;
    g.fillText(heart_label,540 - heart_label_width,40);

    // player描画
    player.draw(g);

    // enemy描画
    enemies.forEach((e) => {
      e.draw(g);
    })

  // ゲームオーバー時
  }else if(scene == Scenes.GameOver){

    //ゲームオーバー表記
    g.fillStyle ="rgb(255,255,255)";
    g.font = "48pt Arial";
    var scorelabel = "GAME OVER";
    var scorelabelWidth = g.measureText(scorelabel).width /2;
    g.fillText(scorelabel,540 - scorelabelWidth ,340);

    //スコア表記
    var score_label = "score"+ score;
    var score_label_width = g.measureText(score_label).width /2;
    g.fillText(score_label,540-score_label_width,440);

    // ボタンエリアflex右上端
    button_area.style.justifyContent = 'flex-end'
    button_area.style.alignItems = 'flex-start'

    // リスタートボタン表示
    const restart_button = document.createElement("img");
    restart_button.src = './image/restart.png';
    var restart_button_style = restart_button.style;
    var restart_button_styles = {
      color:'white',
      padding:'25px'
    }
    for(var style in restart_button_styles){
      restart_button_style[style] = restart_button_styles[style];
    }
    button_area.appendChild(restart_button);
    
    restart_button.onclick = ()=>{
      restart_button.style.display = 'none';
      init();
 
    };
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
    )};
}

class Player extends Sprite{
  heart = 0;
}

class Enemy extends Sprite{
  clash_flg = false;
  type = '';
}

// CSS表記

// var styles = {
//   position:'absolute',
//   width:'400px',
//   height:'100px',
//   font: '1.2rem "Arial", sans-serif',
//   fontSize:'64px',
//   color:' black',
//   backgroundcolor: '#eb6100',
//   borderRadius: '32px',
//   top:'50%'
// }

// class html_tag{
//   setTag(id,tag,styles,message){
//       id = document.createElement(tag);
//       var id_style = id.style;
//       id.innerHTML = message;
//       for(var style in styles){
//         id_style[style] = styles[style];
//       }
//       var button_area = document.getElementById('button_area');
//       button_area.appendChild(id);
//     }
//   }