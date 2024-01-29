const Screen = {
	width: 40,
	height: 40,
	block_size: 10,
	current_score: 0,
	bestScore: 0
}
if (document.querySelector('#centre').clientHeight < document.querySelector('#centre').clientWidth) {
	Screen.block_size = Math.floor(document.querySelector('#centre').clientHeight/40);
} else {
	Screen.block_size = Math.floor(document.querySelector('#centre').clientWidth/40);
}
let score = document.querySelector("#score");
let bestScore = document.querySelector("#bestScore");
score.innerHTML = Screen.current_score;
bestScore.innerHTML = Screen.bestScore;
let randomInteger = function (pow) {
	return Math.floor(Math.random() * pow);
}
const Fruit = {
	position_x: randomInteger(Screen.width),
	position_y: randomInteger(Screen.height),
	ChangePosition () {
		this.position_x = randomInteger(Screen.width);
		this.position_y = randomInteger(Screen.height);
	}
}
const canv = document.querySelector("#canv");
canv.width = Screen.width*Screen.block_size;
canv.height = Screen.height*Screen.block_size;
canv.style.position = 'absolute';
canv.style.left = document.querySelector('#centre').clientWidth / 2 - canv.width / 2 +'px';
canv.style.bottom = document.querySelector('#centre').clientHeight / 2 - canv.height / 2+'px';
const ctx = canv.getContext('2d');
ctx.fillStyle = 'black';
ctx.fillRect(0,0,canv.width,canv.height);
const Snake = {
	length: 2,
	direction: [1,0],
	body: [[-1,10],[-2,10]],
	checkColision () {
		for (let i=1; i<this.length; i++) {
			if (this.body[0][0]==this.body[i][0]&&this.body[0][1]==this.body[i][1]) {
				this.length = 2;
				this.direction = [1,0];
				this.body = [[-1,10],[-2,10]];
				if (Screen.current_score > Screen.bestScore) {
					Screen.bestScore = Screen.current_score;
					bestScore.innerHTML = Screen.bestScore;
				}
				Screen.current_score = 0;
				score.innerHTML = Screen.current_score;
				Fruit.ChangePosition();
			}
		}
	},
	moveForward () {
		let save_privious = [0,0];
		let saveThis = [0,0];
		for (let i = 0; i< this.length; i++) {
			if (i==0) {
				if (this.body[0][0]>Screen.width) {
					save_privious[0] = this.body[0][0];
					save_privious[1] = this.body[0][1];
					this.body[0][0] = 0;
					this.body[0][1] = this.body[0][1]+this.direction[1];
				} else if (this.body[0][0]<0) {
					save_privious[0] = this.body[0][0];
					save_privious[1] = this.body[0][1];
					this.body[0][0] = Screen.width;
					this.body[0][1] = this.body[0][1]+this.direction[1];
				} else if (this.body[0][1]>Screen.height) {
					save_privious[0] = this.body[0][0];
					save_privious[1] = this.body[0][1];
					this.body[0][0] = this.body[0][0]+this.direction[0];
					this.body[0][1] = 0;
				} else if (this.body[0][1]<0) {
					save_privious[0] = this.body[0][0];
					save_privious[1] = this.body[0][1];
					this.body[0][0] = this.body[0][0]+this.direction[0];
					this.body[0][1] = Screen.height;
				} else{
					save_privious[0] = this.body[0][0];
					save_privious[1] = this.body[0][1];
					this.body[0][0] = this.body[0][0]+this.direction[0];
					this.body[0][1] = this.body[0][1]+this.direction[1];
				}
			} else {
				saveThis[0] = this.body[i][0]
				saveThis[1] = this.body[i][1]
				this.body[i][0] = save_privious[0];
				this.body[i][1] = save_privious[1];
				save_privious[0] = saveThis[0];
				save_privious[1] = saveThis[1];
			}
		}
		this.checkColision();
	},
	drawSnake() {
		ctx.fillStyle = 'black';
		ctx.fillRect(0,0,canv.width,canv.height);
		ctx.fillStyle = 'red';
		ctx.fillRect(Fruit.position_x*Screen.block_size,Fruit.position_y*Screen.block_size,Screen.block_size,Screen.block_size);
		this.moveForward();
		ctx.fillStyle = 'Lime';
		ctx.fillRect(this.body[0][0]*Screen.block_size,this.body[0][1]*Screen.block_size,Screen.block_size,Screen.block_size);
		ctx.fillStyle = 'green';
		for (let i = 1; i< this.length; i++) {
			ctx.fillRect(this.body[i][0]*Screen.block_size,this.body[i][1]*Screen.block_size,Screen.block_size,Screen.block_size);
		}
	},
	changeDirection(e) {
		if (e.key=="ArrowUp" || e.key=="w") {
			if (this.direction[0] == -1 || this.direction[0] == 1) {
				this.direction = [0,-1];
			}
		}
		if (e.key=="ArrowLeft" || e.key=="a") {
			if (this.direction[1] == -1 || this.direction[1] == 1) {
				this.direction = [-1,0];
			}
		}
		if (e.key=="ArrowRight" || e.key=="d") {
			if (this.direction[1] == -1 || this.direction[1] == 1) {
				this.direction = [1,0];
			}
		}
		if (e.key=="ArrowDown" || e.key=="s") {
			if (this.direction[0] == -1 || this.direction[0] == 1) {
				this.direction = [0,1];
			}
		}
	},
	eat () {
		if (this.body[0][0] == Fruit.position_x && this.body[0][1] == Fruit.position_y) {
			//if (this.length<30){
			this.body.push([this.body[this.length-1][0]+1,this.body[this.length-1][1]]);
			this.length = this.length+1;
			//}
			Fruit.ChangePosition();
			Screen.current_score++;
			score.innerHTML = Screen.current_score;
		}
	}
}
let step=0;
// незабываем про привязку контекста!
let changeDirection = Snake.changeDirection.bind(Snake);
addEventListener("keydown", changeDirection);
function gameloop () {
	requestAnimationFrame(gameloop);
	if (++step<4) {
		return;
	}
	step = 0;
	Snake.drawSnake();
	Snake.eat()
}
requestAnimationFrame(gameloop);

window.addEventListener('resize',function(event){
	if (document.querySelector('#centre').clientHeight < document.querySelector('#centre').clientWidth) {
		Screen.block_size = Math.floor(document.querySelector('#centre').clientHeight/40);
		console.log(document.querySelector('#centre').clientHeight);
		canv.width = Screen.width*Screen.block_size;
		canv.height = Screen.height*Screen.block_size;
		canv.style.left = document.querySelector('#centre').clientWidth / 2 - canv.width / 2 + 'px';
		canv.style.bottom = document.querySelector('#centre').clientHeight / 2 - canv.height / 2 + 'px';
	} else {
		Screen.block_size = Math.floor(document.querySelector('#centre').clientWidth/40);
		console.log(document.querySelector('#centre').clientWidth);
		canv.width = Screen.width*Screen.block_size;
		canv.height = Screen.height*Screen.block_size;
		canv.style.left = document.querySelector('#centre').clientWidth / 2 - canv.width / 2 +'px';
		canv.style.bottom = document.querySelector('#centre').clientHeight / 2 - canv.height / 2+'px';
	}
});
