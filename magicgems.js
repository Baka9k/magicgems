/* Magicgems.js
 *
 * magicgems.createGameField(<element id>) creates game field in element with id given as argument.
 * Gamefield width and length will be same as element width and length, and if you want create it in empty div 
 * you should specify its width and height.
 * 
 * magicgems.removeGameField(<element id>) removes game field from element with id given as argument and removes its event listeners.
 * 
 * 
 * magicgems.preRendering() method render images from /textures folder on invisible canvases, and magicgems.draw() method draws this 
 * canvases instead of image objects.
 * 
*/


var magicgems = {};

magicgems.createGameField = function(element) {
	magicgems.tileWidth = 50;
	magicgems.tileHeight = magicgems.tileWidth;
	var gamefield = {
		canvas: document.createElement('canvas'),
		width: Math.round(element.clientWidth / magicgems.tileWidth) * magicgems.tileWidth,
		height: element.clientHeight
	}
	element.appendChild(gamefield.canvas);
	gamefield.canvas.width = gamefield.width;
	gamefield.canvas.height = gamefield.height;
	magicgems.gamefield = gamefield;
	magicgems.gamefield.context = gamefield.canvas.getContext("2d");
	magicgems.tilesOnX = Math.floor(magicgems.gamefield.width / magicgems.tileWidth);
	magicgems.tilesOnY = Math.floor(magicgems.gamefield.height / magicgems.tileHeight);
	magicgems.map = new Array();
	for (var i = 0; i < magicgems.tilesOnY; i++) {
		var row = new Array(magicgems.tilesOnX);
		magicgems.map.push(row);
	}
	
	magicgems.preRendering();
	magicgems.afterTexturesLoading = function() {
		magicgems.generateMap();
		magicgems.gamefield.canvas.addEventListener('click', magicgems.click, false);
		magicgems.draw(true);
		magicgems.interval = setInterval(function(){magicgems.step()}, 25);
		magicgems.effects.loadTextures();
	}
	
	window.addEventListener("keydown", magicgems.keypressHandler);
	magicgems.paused = true;
	magicgems.pausedTextureVisible = false;
	magicgems.gamefield.context.font = "bold 30px impact";
	
	console.log("Game field created in " + element.id + " element.");
}

magicgems.removeGameField = function(element) {
	clearInterval(magicgems.interval);
	var myNode = document.getElementById(element);
	while (myNode.firstChild) {
		myNode.removeChild(myNode.firstChild);
	}
	window.removeEventListener('keydown', magicgems.keypressHandler);
	
	console.log('Magicgems unloaded.')
}

magicgems.rand = function (min, max) {
	return Math.random() * (max - min) + min;
}

magicgems.keypressHandler = function(e){
	if(e.keyCode == 32) {
		if (e.preventDefault) { e.preventDefault()}
		else {e.stop()}
		e.returnValue = false;
		e.stopPropagation();   
		if (magicgems.paused) {
			magicgems.paused = false;
			magicgems.pausedTextureVisible = false;
			magicgems.draw(true);
		} else {
			magicgems.paused = true;
		}
	}
}

magicgems.textures = {
	canvases: {},
	contexts: {},
	images: {},
};

magicgems.animationInProgress = false;

magicgems.preRendering = function() {
	var count = 4 + 6 + 1;                 //Gems + Effects + Paused
	function render(name, width, height) {
		var canvas = document.createElement('canvas');
		canvas.width = width;
		canvas.height = height;
		magicgems.textures.canvases[name] = canvas;
		magicgems.textures.contexts[name] = canvas.getContext('2d');
		texture = new Image();
		texture.src = "textures/" + name + ".png";
		texture.onload = function() {
			magicgems.textures.contexts[name].drawImage(magicgems.textures.images[name], 0, 0);
			count--;
			if (count == 0) {
				console.log("Textures loaded");
				magicgems.afterTexturesLoading();
			}
		}
		magicgems.textures.images[name] = texture;
	}
	for (gem in magicgems.gems) {
		render(gem, magicgems.tileWidth, magicgems.tileHeight);
	}
	for (var i = 0; i < magicgems.effects.flash.length; i++) {
		render("flash"+i, magicgems.tileWidth, magicgems.tileHeight);
	}
	render('paused', 345, 150);
}

magicgems.gems = {
	emerald: function() {
			this.type = "emerald";
			this.texture = magicgems.textures.canvases.emerald;
			this.points = 50;
		},
	ruby: function() {
			this.type = "ruby";
			this.texture = magicgems.textures.canvases.ruby;
			this.points = 100;
		},
	sapphire: function() {
			this.type = "sapphire";
			this.texture = magicgems.textures.canvases.sapphire;
			this.points = 150;
		},
	diamond: function() {
			this.type = "diamond";
			this.texture = magicgems.textures.canvases.diamond;
			this.points = 200;
		},
}

magicgems.effects = {
	flash: [{},{},{},{},{},{}],
	loadTextures: function() {
		magicgems.effects.flash[0].texture = magicgems.textures.canvases.flash0;
		magicgems.effects.flash[1].texture = magicgems.textures.canvases.flash1;
		magicgems.effects.flash[2].texture = magicgems.textures.canvases.flash2;
		magicgems.effects.flash[3].texture = magicgems.textures.canvases.flash3;
		magicgems.effects.flash[4].texture = magicgems.textures.canvases.flash4;
		magicgems.effects.flash[5].texture = magicgems.textures.canvases.flash5;
	},
}

magicgems.stats = {
	points: 0,
	best: 0,
	attempts: 1,
	gemsDestroyed: 0,
	started: Date.now(),
	totalGemsDestroyed: 0,
}

magicgems.generateTile = function() {
	var probability = Math.round(magicgems.rand(0,3));
	switch(probability) {
		case 0:
			var tile = new magicgems.gems.emerald();
			break;
		case 1:
			var tile = new magicgems.gems.ruby();
			break;
		case 2:
			var tile = new magicgems.gems.sapphire();
			break;
		case 3:
			var tile = new magicgems.gems.diamond();
			break;
	}
	return tile;
}
	
magicgems.generateMap = function() {
	for (var i = 0; i < Math.round(magicgems.map.length / 2); i++) {
		for (var j = 0; j < magicgems.map[i].length; j++) {
			magicgems.map[i][j] = "void";
		}
	}
	for (var i = Math.round(magicgems.map.length / 2); i < magicgems.map.length; i++) {
		for (var j = 0; j < magicgems.map[i].length; j++) {
			var tile = magicgems.generateTile();
			tile.x = j;
			tile.y = i;
			tile.displacement = 0;
			magicgems.map[i][j] = tile;
		}
	}
}

magicgems.draw = function(onload) {
	if ((magicgems.paused) && (!onload)) {
		if (!magicgems.pausedTextureVisible) {
			magicgems.gamefield.context.drawImage(magicgems.textures.canvases.paused, magicgems.gamefield.width/2 - 345/2, magicgems.gamefield.height/2 - 150/2);
			magicgems.pausedTextureVisible = true;
		}
		return;
	}
	magicgems.gamefield.context.fillStyle = "#000000";
	if (onload) {
		magicgems.gamefield.context.fillRect(0,0,magicgems.gamefield.width,magicgems.gamefield.height);
	}
	for (var i = 0; i < magicgems.map.length; i++) {
		for (var j = 0; j < magicgems.map[i].length; j++) {
			if (magicgems.map[i][j] == "void") {
				magicgems.gamefield.context.fillStyle = "#000000";
				magicgems.gamefield.context.fillRect(j * magicgems.tileWidth, i * magicgems.tileHeight, magicgems.tileWidth, magicgems.tileHeight);
				continue;
			}
			if (magicgems.map[i][j].type == "destroyed") {
				magicgems.gamefield.context.fillStyle = "#000000";
				magicgems.gamefield.context.fillRect(j * magicgems.tileWidth, i * magicgems.tileHeight, magicgems.tileWidth, magicgems.tileHeight);
				magicgems.gamefield.context.drawImage(magicgems.map[i][j].texture, j * magicgems.tileWidth, i * magicgems.tileHeight);
				magicgems.map[i][j].counter ++;
				if (magicgems.map[i][j].counter == 1) {       //Edit counter value to change effect animation speed
					magicgems.map[i][j].counter = 0;
					magicgems.map[i][j].state ++;
					if (magicgems.map[i][j].state == 6) {
						magicgems.map[i][j] = "void";
					} else {
						magicgems.map[i][j].texture = magicgems.effects.flash[magicgems.map[i][j].state].texture;
					}
				}
				continue;
			}
			if (magicgems.map[i][j].animated) {
				displacement = magicgems.map[i][j].displacement;
				magicgems.gamefield.context.fillStyle = "#000000";
				magicgems.gamefield.context.fillRect(j * magicgems.tileWidth, i * magicgems.tileHeight, magicgems.tileWidth, magicgems.tileHeight);
				magicgems.gamefield.context.drawImage(magicgems.map[i][j].texture, j * magicgems.tileWidth, i * magicgems.tileHeight + displacement);
			}
			if ((!magicgems.map[i][j].animated)&&(!onload)) continue;
			displacement = magicgems.map[i][j].displacement;
			magicgems.gamefield.context.drawImage(magicgems.map[i][j].texture, j * magicgems.tileWidth, i * magicgems.tileHeight + displacement);
		}
	}
	magicgems.gamefield.context.strokeStyle = "#ffffff";
	magicgems.gamefield.context.strokeText(magicgems.stats.points, magicgems.gamefield.width - 100, 35); 
}

magicgems.inLimits = function (x, min, max) {
	return x >= 0 && x <= max;
}

magicgems.click = function(e) {
	if (magicgems.paused) {
		return;
	}
	//if (magicgems.animationInProgress) return;
	x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft; 
	y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;  
	x -= magicgems.gamefield.canvas.offsetLeft;
	y -= magicgems.gamefield.canvas.offsetTop;
	var tileX = Math.floor(x / magicgems.tileWidth);
	var tileY = Math.floor(y / magicgems.tileHeight);
	if (typeof magicgems.map[tileY] === "undefined") return;
	if (magicgems.map[tileY][tileX] == "void") return;
	if (magicgems.map[tileY][tileX].type == "destroyed") return;
	var checked = {};
	var grouped = {};
	checked[tileX + "," + tileY] = true;
	
	var clickedGem = magicgems.map[tileY][tileX];
	
	function checkNeighbors(tileX,tileY) {
		var map = magicgems.map;
		var neighborsCoords = [{x:tileX,y:tileY-1},{x:tileX,y:tileY+1},{x:tileX-1,y:tileY},{x:tileX+1,y:tileY}].filter(function(obj) {return magicgems.inLimits(obj.x, 0, magicgems.tilesOnX-1) && magicgems.inLimits(obj.y, 0, magicgems.tilesOnY-1)});
		var neighbors = [];
		
		for (var i = 0; i < neighborsCoords.length; i++) {
			var x = neighborsCoords[i].x;
			var y = neighborsCoords[i].y;
			var coords = x + "," + y;
			if (map[y][x].type == clickedGem.type)  {
				if (!grouped[coords]) {
					neighbors.push(map[y][x]);
					grouped[coords] = true;
				}
			}
		}
		
		if (neighbors.length == 0) return [];
		
		for (var i = 0; i < neighbors.length; i++) {
			var coords = neighbors[i].x + "," + neighbors[i].y;
			if (!checked[coords]) {
				checked[coords] = true;
				arr = checkNeighbors(neighbors[i].x,neighbors[i].y);
				neighbors = neighbors.concat(arr);
			}
		}
		return neighbors;
	}
	
	var group = checkNeighbors(tileX,tileY);
	for (var i = 0; i < group.length; i++) {
		var gem = magicgems.map[group[i].y][group[i].x];
		magicgems.stats.points += gem.points;
		gem.texture = magicgems.effects.flash[0].texture;   //+gem.type
		gem.type = "destroyed";
		gem.points = 0;
		gem.state = 0;
		gem.counter = 0;
		magicgems.stats.gemsDestroyed++;
		magicgems.stats.totalGemsDestroyed++;
	}
}

magicgems.gravitation = function() {
	magicgems.animationInProgress = false;
	for (var i = magicgems.map.length-1; i >= 0; i--) {
		for (var j = 0; j < magicgems.map[i].length; j++) {
			if (magicgems.map[i][j].animated) {
				if (magicgems.map[i][j].displacement >= 0) {
					magicgems.map[i][j].timeOfFalling = 0;
					magicgems.map[i][j].animated = false;
				} else {			
					if ((i < magicgems.map.length - 1) && (magicgems.map[i+1][j] == "void")) {
						if ((i < magicgems.map.length - 2) && (magicgems.map[i+2][j].animated)) {
							if (magicgems.map[i][j].displacement <= magicgems.map[i+2][j].displacement + magicgems.tileHeight) {
								magicgems.map[i][j].timeOfFalling = 0;
							}
						}
						magicgems.map[i][j].animationEnd++;
						magicgems.map[i][j].displacement -= magicgems.tileHeight;
						magicgems.map[i+1][j] = magicgems.map[i][j];
						magicgems.map[i+1][j].y++;
						magicgems.map[i][j] = "void";
					}
					magicgems.map[i][j].timeOfFalling++;
					magicgems.map[i][j].displacement += Math.round(magicgems.map[i][j].timeOfFalling * 0.3);
					if (magicgems.map[i][j].displacement > 0) {
						magicgems.map[i][j].displacement = 0;
					}
				}
				magicgems.animationInProgress = true;
				continue;
			}
			if (i == magicgems.map.length-1) continue;
			if (magicgems.map[i+1][j] !== "void") continue;
			if (magicgems.map[i][j] == "void") continue;
			if (magicgems.map[i][j] == "destroyed") continue;
			magicgems.map[i+1][j] = magicgems.map[i][j];
			magicgems.map[i+1][j].y++;
			magicgems.map[i][j] = "void";
			magicgems.map[i+1][j].animated = true;
			magicgems.map[i+1][j].animationStart = i;
			magicgems.map[i+1][j].animationEnd = i+1;
			magicgems.map[i+1][j].timeOfFalling = 0;
			magicgems.map[i+1][j].displacement = (magicgems.map[i+1][j].animationStart - magicgems.map[i+1][j].animationEnd) * magicgems.tileHeight;
			magicgems.animationInProgress = true;
		}
	}
}

magicgems.restart = function() {
	magicgems.stepCounter = 0;
	magicgems.generateMap();
	magicgems.draw(true);
	magicgems.stats.points = 0;
	magicgems.stats.attempts++;
	magicgems.stats.gemsDestroyed = 0;
	magicgems.stats.started = Date.now();
}

magicgems.generateGems = function() {
	for (var i = 0; i < magicgems.map[0].length; i++) { 
		if (magicgems.map[0][i] == "void") {
			var tile = magicgems.generateTile();
			tile.x = i;
			tile.y = 0;
			tile.displacement = 0;
			magicgems.map[0][i] = tile;
			magicgems.gamefield.context.drawImage(magicgems.map[0][i].texture, i * magicgems.tileWidth, 0);
		}
		else {
			var s = magicgems.stats;
			var time = magicgems.msToTime(Date.now() - s.started);
			alert("You lose!\nYou recieved      "+s.points+" points\nYou destroyed   "+s.gemsDestroyed+" gems\nTime:                  "+time+"\n\nTotal gems destroyed: "+s.totalGemsDestroyed);
			magicgems.restart();
		}
	}
}

magicgems.msToTime = function(s) {
	var ms = s % 1000;
	s = (s - ms) / 1000;
	var secs = s % 60;
	s = (s - secs) / 60;
	var mins = s % 60;
	var hrs = (s - mins) / 60;
	return hrs + ':' + mins + ':' + secs;
}

	
magicgems.stepCounter = 0;

magicgems.step = function() {
	magicgems.draw();
	if (magicgems.paused) {
		return;
	}
	magicgems.stepCounter++;
	magicgems.gravitation();
	if (magicgems.stepCounter == 250) {
		magicgems.generateGems();
		magicgems.stepCounter = 0;
	}
}




