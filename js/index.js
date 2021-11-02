let config = {
    //游戏状态 0：游戏未开始 1：游戏进行中 2：游戏结束
    status: 0,
    //病毒生成间隔
    interval:810,
    //下落速度
    speed:2,
    //关卡等级
    level: 1
}
//分数
let score = 0

//开始页面
let startAlert = document.querySelector('#start-alert')
let gameDesc = document.querySelector('.game-desc')
let footer = document.querySelector('#start-alert footer')

startAlert.addEventListener('click',()=>{
    gameDesc.classList.add('slide-up')
    footer.classList.add('slide-down')
    setTimeout(()=>{
       startAlert.style.display = 'none'
    },500)

    //更新游戏状态
    config.status = 1
    startGame()
})
var timer ,updater;
function startGame(){
    timer = setInterval(makeVirus,(config.interval-(config.level*10)))
    updater = setInterval(update ,16)
}

//获取游戏场景
let game = document.querySelector('#game')
let letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S',
    'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
]
let stage = document.querySelector('#stage')
let virues = []
let uiLayer = document.querySelector('#ui')

//生成病毒元素
function makeVirus(){
    let virus = document.createElement('div')
    virus.setAttribute('class','virus')

    let p = document.createElement('p')
    p.classList.add('letter')
    let letter = letters[Math.floor(Math.random()*26)]
    p.innerHTML = letter
    virus.appendChild(p)

    virus.style.left = Math.random()*(stage.offsetWidth-100)+'px'
    virus.letter = letter
    // 设置病毒的颜色
    switch(Math.floor(Math.random() * 6)){
        case 0:
            p.style.backgroundImage = 'radial-gradient(rgba(255,150,150,0),rgba(255,0,0,1))';
            p.style.boxShadow = '0 0 15px #f00';break;
        case 1:
            p.style.backgroundImage = 'radial-gradient(rgba(0, 255, 0, 0),rgba(0,255,0,1))';
            p.style.boxShadow = '0 0 15px #f00'; break;
        case 2:
            p.style.backgroundImage = 'radial-gradient(rgba(0, 0, 255, 0),rgba(0,0,255,1))';
            p.style.boxShadow = '0 0 15px #f00'; break;
        case 3:
            p.style.backgroundImage = 'radial-gradient(rgba(255, 255, 0, 0),rgba(255,255,0,1))';
            p.style.boxShadow = '0 0 15px #f00'; break;
        case 4:
            p.style.backgroundImage = 'radial-gradient(rgba(0, 255, 255, 0),rgba(0,255,255,1))';
            p.style.boxShadow = '0 0 15px #f00'; break;
        case 5:
            p.style.backgroundImage = 'radial-gradient(rgba(255, 0, 255, 0),rgba(255,0,255,1))';
            p.style.boxShadow = '0 0 15px #f00'; break;
    }
    game.appendChild(virus)
    virues.push(virus)
}

let winH = stage.offsetHeight
let startTimer,cTimer,count = 3
let nextTime = document.querySelector('#next-time')
let nextAlert = document.querySelector('#next-alert')
let nextBtn = document.querySelector('#next-btn')
let levelLabel = document.querySelector('#level-label')
//update 动画 刷新元素位置
function update(){
    for(i in virues){
        let virus = virues[i]
        virus.style.top = virus.offsetTop + config.speed + 'px'
        if(virus.offsetTop > (winH-200) && !uiLayer.warning ){
            showWarning()
            uiLayer.warning = true;
            setTimeout(()=>{
                uiLayer.warning = false
            },2000)
        }else if(virus.offsetTop >= winH){
            gameOver()
        }
    }
    if((score+1)%(20*(config.level*2)+1) == 0){
        clearInterval(timer)
        clearInterval(updater)
        nextAlert.style.display = 'block'
        config.status = 0
        startTimer=setInterval(()=>{
            nextTime.innerHTML = count
            count--
        },1000)
        cTimer = setTimeout(()=>{
            clearInterval(startTimer)
            nextLevel()
        },2500)
    }
}

function showWarning(){
    let warningLayer = document.createElement('div')
    warningLayer.classList.add('warning')
    uiLayer.appendChild(warningLayer)
}


//游戏结束
let gameOverAlert = document.querySelector('#game-over-alert')
function gameOver(){
    clearInterval(timer)
    clearInterval(updater)
    config.status = 2
    gameOverAlert.style.display='block'
}

let isPause = false
let scoreLabel = document.querySelector('#score-label')
let xmEffect = document.querySelector('#xm')
//监听键盘事件
window.addEventListener('keyup',function(e){
    let key = e.key;
    let ischecked = false
    //游戏暂停
    if(key === "Enter"){
        gamePause()
    }
    for(let i = 0 ; i<virues.length ; i++){
        let v = virues[i]
        if(v.letter.toLowerCase() === key.toLowerCase() && config.status == 1){
            let dieImg = document.createElement('img')
            game.appendChild(dieImg)
            dieImg.src = './imgs/virus-die.png'
            dieImg.style.position = 'absolute'
            dieImg.style.left = v.offsetLeft + 'px'
            dieImg.style.top = v.offsetTop + 'px'
            dieImg.classList.add('fade-out')

            setTimeout(()=>{
                game.removeChild(dieImg)
            },1000)
            game.removeChild(v)
            virues.splice(i,1)

            score++;
            scoreLabel.innerHTML = score
            //播放音效
            xmEffect.currentTime = 0;
            xmEffect.play()
            ischecked = true
            break;
        }
    }
    if(!ischecked && config.status == 1){
        makeVirus()
    }
})
let pasueUi = document.querySelector('.pause-ui')
//暂停
function gamePause(){
    if(config.status != 2){
        if(isPause){
            startGame()
            config.status = 1
            isPause = !isPause
            pasueUi.style.display = 'none'
        }else{
            clearInterval(timer)
            clearInterval(updater)
            config.status = 0
            isPause = !isPause
            pasueUi.style.display = 'block'
        }
    }
 }

//重玩
let restartBtn = document.querySelector('#restart-btn')
restartBtn.addEventListener('click',()=>{
    resetGame()
})

function resetGame(){
    gameOverAlert.style.display = 'none'
    config.status = 1
    score = 0
    scoreLabel.innerHTML = score
    game.innerHTML = ''
    virues = []
    uiLayer.removeChild(document.querySelector('.warning'))
    uiLayer.warning = false
    startGame()
}

//下一关

nextBtn.addEventListener('click',()=>{
    nextLevel()
})

function nextLevel(){
    nextAlert.style.display = 'none'
    config.level++
    levelLabel.innerHTML = config.level
    game.innerHTML = ''
    virues = []
    config.status = 1
    startGame()
}