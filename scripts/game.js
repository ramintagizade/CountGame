class NumberedBox extends createjs.Container {
	constructor(game,number=0) {
		super();
		this.game = game;
		this.number = number;
		var movieclip = new lib.NumberedBox();
		movieclip.numberText.text = number;
		movieclip.numberText.font = "30px Oswald";
		new createjs.ButtonHelper(movieclip,0,1,2,false,new lib.NumberedBox(),3);
		this.addChild(movieclip);
		this.setBounds(0,0,50,50);
		this.on("click",this.handleClick.bind(this));
	}
	handleClick() {
		this.game.handleClick(this);
		createjs.Sound.play("Jump");
	}
}
class GameData {
	constructor() {
		this.amountOfBox = 3;
		this.resetData();
	}
	resetData() {
		this.currentNumber = 1;
	}
	nextNumber() {
		this.currentNumber+=1;
	}
	isRightNumber(number) {
		return (number===this.currentNumber);
	}
	isGameWin() {
		//TODO 
		return (this.currentNumber > this.amountOfBox);
	}
}

class Game {
	constructor() {
		console.log(`Welcome to the game .Version ${this.version()}`);
		
		this.loadSound();

		this.canvas = document.getElementById("game-canvas");
		this.stage = new createjs.Stage(this.canvas);
		
		this.stage.width = this.canvas.width;
		this.stage.height = this.canvas.height;

		this.stage.enableMouseOver();
		// enable tap on touch for devices 
		createjs.Touch.enable(this.stage);
		// enable retina screen 
		this.retinalize();
		window.debugStage = this.stage;
		createjs.Ticker.setFPS(60);
		// game related initialization 
		this.gameData = new GameData();
		// keep re-drawing 
		createjs.Ticker.on("tick",this.stage); 
		
		this.restartGame();
		// testing code 
		/*var circle = new createjs.Shape();
		circle.graphics.beginFill("red").drawCircle(0,0,40);
		circle.x = circle.y = 100;
		this.stage.addChild(circle); 
		*/

		this.stage.addChild(new lib.Background());
		this.generateMultipleBoxes(this.gameData.amountOfBox);
	}
	version() {
		return "1.0.0";
	}
	loadSound() {
		createjs.Sound.alternateExtensions = ["ogg", "wav"];
    	createjs.Sound.registerSound("soundfx/jump7.aiff", "Jump");
    	createjs.Sound.registerSound("soundfx/game-over.aiff", "Game Over");
	}
	restartGame() {
		this.gameData.resetData();
		this.stage.removeAllChildren();
		this.stage.addChild(new lib.Background());
		this.generateMultipleBoxes(this.gameData.amountOfBox);
	}
	generateMultipleBoxes(amount=10) {
		for(var i=amount;i>0;i--){
			var movieclip = new NumberedBox(this,i);
			this.stage.addChild(movieclip);
			// random postion 
			movieclip.x = Math.random() * (this.stage.width- movieclip.getBounds().width);
			movieclip.y = Math.random() * (this.stage.height - movieclip.getBounds().height);
		}
	}
	handleClick(numberedBox) {
		if(this.gameData.isRightNumber(numberedBox.number)){
			this.stage.removeChild(numberedBox);
			this.gameData.nextNumber();
			// is game over ? 
			if(this.gameData.isGameWin()){
				createjs.Sound.play("Game Over");
				var gameOverView = new lib.GameOverView();
				this.stage.addChild(gameOverView);
				gameOverView.restartButton.on("click",(function(){
					createjs.Sound.play("Jump");
					this.restartGame();
				}).bind(this));
			}
		}
	}
	retinalize() {
		this.stage.width = this.canvas.width;
		this.stage.height = this.canvas.height;
		let ratio = window.devicePixelRatio;
		if(ratio === undefined) return;
		this.canvas.setAttribute("width",Math.round(this.stage.width*ratio));
		this.canvas.setAttribute("height",Math.round(this.stage.height*ratio));
		this.stage.scaleX = this.stage.scaleY = ratio;
		// Set CSS style 
		this.canvas.style.width = this.stage.width+"px";
		this.canvas.style.height = this.stage.height+"px";
	}
}
var game = new Game();