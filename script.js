(function(){
//////////////////////////////// PREPARE 1
	var canvas = document.createElement('canvas');
	// var canvas_sp = document.createElement('canvas'),
	ctx = canvas.getContext('2d'),
	// ctx_sp = canvas.getContext('2d'),
	w = canvas.width = innerWidth,
	h = canvas.height = innerHeight,

	wStart = 2/100*w;
	hStart = 2/100*h;
	wPlus = 96/100*w;
	hPlus = 96/100*h;

	LINEWIDTH = 800;

	timer = 0;
	score = 0;
	death = false;
	cdBullet = 0;
	readyToShot = true;
//////////////////////////////// PREPARE 2
	document.querySelector('body').appendChild(canvas);
	// document.querySelector('body').appendChild(canvas_sp);
	spaceship = {
		pos_x: w/2,
		pos_y: h/2,
		hp: 10,
		velocity_x: 0,
		velocity_y: 0,
		model_path: 'spaceship.png',
		model: new Image(),
		init: function(){
			this.model.src = "spaceship.png";
		},
		cycle: function(){
			this.change_pos();
			// console.log(this.velocity_x + ":" + this.velocity_y);
			this.draw_f();
		},
		change_pos: function(){
			this.pos_x += this.velocity_x;
			this.pos_y += this.velocity_y;

			this.velocity_x -= this.velocity_x/200;
			this.velocity_y -= this.velocity_y/200;	
		},
		draw_f: function(){
			ctx.beginPath();
			ctx.moveTo(spaceship.pos_x, spaceship.pos_y);
			// ctx.lineTo(spaceship.velocity_x*10e4, spaceship.velocity_y*10e4);
			ctx.closePath();
			ctx.stroke();
			ctx.drawImage(this.model, this.pos_x, this.pos_y);
		},
	};

	class Star {
		constructor(x, y, r, l){
			this.x = x;
			this.y = y;
			this.r = r;
			this.l = l;
		}
	}
	stars = []

	class Stone {
		constructor(x, y){
			this.pos_x = x;
			this.pos_y = y;
			this.model = new Image()
			this.model.src = "stone.png"
			this.velocity_x = (getRandomInt(w) - this.pos_x)/10;
			this.velocity_y = (getRandomInt(h) - this.pos_y)/10;
			this.timeExist = 0
			this.destroyed = false;
		}
	}
	stones = []

	class Bullet {
		constructor(vel_x, vel_y){
			this.pos_x = spaceship.pos_x;
			this.pos_y = spaceship.pos_y;

			let norma = Math.sqrt(Math.pow(spaceship.velocity_x, 2) + Math.pow(spaceship.velocity_x, 2));

			this.velocity_x = spaceship.velocity_x / norma;
			this.velocity_y = spaceship.velocity_y / norma;
			this.model = new Image();
			this.model.src = "bullet.png";
		}
	}
	bullets = []
//////////////////////////////// EVENTS

canvas.onmousedown = function(event) { 
  moveAt(event.clientX, event.clientY);

  function moveAt(x, y) {
  	koef = 50
    spaceship.velocity_x = -(spaceship.pos_x - x + 25)/koef;
    spaceship.velocity_y = -(spaceship.pos_y - y + 20)/koef;
  }

  function onMouseMove(e) {
    moveAt(e.clientX, e.clientY);
  }

  document.addEventListener('mousemove', onMouseMove);

  canvas.onmouseup = function(ev) {
    document.removeEventListener('mousemove', onMouseMove);
    onMouseMove(ev)
    canvas.onmouseup = null;
  };
};

document.onkeypress = function (e) {
	if (readyToShot == true){
		bullets.push(new Bullet());
		readyToShot = false;
	}
};

//////////////////////////////// MAIN
	window.onresize = function(){
		w = canvas.width = innerWidth,
		h = canvas.height = innerHeight;
	}

	function draw_circle(x, y, r) {
		ctx.beginPath();
		ctx.arc(x, y, r, 0, 2 * Math.PI, false);
		ctx.fillStyle = 'white';
		ctx.fill();
		ctx.lineWidth = 1;
		ctx.strokeStyle = '#02ee14';
		ctx.stroke();
		ctx.closePath();
	}

	function getRandomInt(max) {
		return Math.floor(Math.random() * max);
	}

	function drawBackGroung(){
		ctx.fillStyle = 'rgb(30, 30, 37)';
		ctx.fillRect(wStart, hStart, wPlus, hPlus);
		for (let i = 0; i < count_stars; i++) {
			draw_circle(stars[i].x, stars[i].y, stars[i].r);
		}
	}

	function drawBorder(){
		ctx.beginPath();
		ctx.moveTo(0, 0);
		ctx.lineTo(w, 0);
		ctx.moveTo(w-25, 0);
		ctx.lineTo(w-25, h);
		ctx.moveTo(w, h);
		ctx.lineTo(0, h);
		ctx.moveTo(25, h);
		ctx.lineTo(25, 0);
		
		if ( (LINEWIDTH > 50) ){
			LINEWIDTH -= 3;
		}
		ctx.lineWidth = LINEWIDTH;
		ctx.strokeStyle = "rgb(200, 200, 250)";
		
		ctx.stroke();		
		ctx.closePath();
	}

	function genStones(argument) {
		const koef = 1000;
		if (timer % koef == 0){
			stones.push(new Stone(0, getRandomInt(h)));
			stones.push(new Stone(w, getRandomInt(h)));
			stones.push(new Stone(getRandomInt(w), 0));
			stones.push(new Stone(getRandomInt(w), h));
		}
	}

	function processingStones(){
		for (var i = stones.length - 1; i >= 0; i--) {
			if ( stones[i].timeExist > 100 ){
				if ((stones[i].pos_x < 0) || (stones[i].pos_x > w) ||
					(stones[i].pos_y < 0) || (stones[i].pos_y > h)){
						stones.splice(i, 1);
						continue;
				}
			}
			if((spaceship.pos_x <= stones[i].pos_x+40) && (spaceship.pos_x >= stones[i].pos_x-35) &&
					(spaceship.pos_y <= stones[i].pos_y+40) && (spaceship.pos_y >= stones[i].pos_y-40)) {
				Death();
			}

			stones[i].pos_x += stones[i].velocity_x/100;
			stones[i].pos_y += stones[i].velocity_y/100;
			ctx.drawImage(stones[i].model, stones[i].pos_x, stones[i].pos_y);

			ctx.beginPath();
			ctx.moveTo(stones[i].pos_x, stones[i].pos_y);
			// ctx.lineTo(stones[i].velocity_x*10e4, stones[i].velocity_y*10e4);
			ctx.closePath();
			ctx.stroke();
			
			stones[i].timeExist += 1;
		}
	}

	function processingBullets(){
		let koef = 10;
		for (var i = bullets.length - 1; i >= 0; i--) {
			if ((bullets[i].pos_x < 0) || (bullets[i].pos_x > w) ||
					(bullets[i].pos_y < 0) || (bullets[i].pos_y > h)){
				bullets.splice(i, 1);
				continue;
			};
			bullets[i].pos_x += bullets[i].velocity_x*koef;
			bullets[i].pos_y += bullets[i].velocity_y*koef;
			ctx.drawImage(bullets[i].model, bullets[i].pos_x, bullets[i].pos_y);

			for (var j = stones.length - 1; j >= 0; j--) {
				if ((bullets[i].pos_x <= stones[j].pos_x+80) && (bullets[i].pos_x >= stones[j].pos_x-20) &&
					(bullets[i].pos_y <= stones[j].pos_y+80) && (bullets[i].pos_y >= stones[j].pos_y-20)){
						stones.splice(j, 1);
						score += 1;
						break;
				}
			}
		}
	}

	function processingText(){
		ctx.font = "48px Arial Black";
	  ctx.fillText("Scores: " + score, 80, 80);
	}

	function Death() {
		if (death == false){
			death = true;
			alert("You died 🐨" + '\n' + "Press RESTART to play again");
			location.reload();
		}
	}

	function processingCdBullet(){
		let koef = 100;
		if (readyToShot == false){
			if (cdBullet >= koef) {
				readyToShot = true;
				cdBullet = 0;
			}
			cdBullet += 1;
		}
	}

	function loop(){
		drawBackGroung();
		spaceship.cycle();
		processingCdBullet();
		processingStones();
		processingBullets();
		genStones();
		processingText();
		drawBorder();

		timer += 1;
		requestAnimationFrame(loop);
	}

	function init(){
		// Init stars
		count_stars = 150;
		for (let i = 0; i < count_stars; i++) {
			x = getRandomInt(wPlus)+wStart;
			y =getRandomInt(hPlus)+hStart;
			r = getRandomInt(5);
			l = getRandomInt(5);
			stars.push(new Star(x, y, r, l));
		}
		spaceship.init();
		//
		loop();
	}

	init();
}())