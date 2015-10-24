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
	magicgems.generateMap();
	magicgems.gamefield.canvas.addEventListener('click', magicgems.click, false);
	window.onload = function() {magicgems.draw(true);};
	console.log("Game field created in " + element.id + " element.");
}

magicgems.rand = function (min, max) {
	return Math.random() * (max - min) + min;
}

magicgems.gems = {
	emerald: function() {
			this.type = "emerald";
			this.texture = new Image(); 
			this.texture.src = "textures/emerald.png";
			this.points = 50;
		},
	ruby: function() {
			this.type = "ruby";
			this.texture = new Image(); 
			this.texture.src = "textures/ruby.png";
			this.points = 100;
		},
	sapphire: function() {
			this.type = "sapphire";
			this.texture = new Image(); 
			this.texture.src = "textures/sapphire.png";
			this.points = 150;
		},
	diamond: function() {
			this.type = "diamond";
			this.texture = new Image(); 
			this.texture.src = "textures/diamond.png";
			this.points = 200;
		},
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
	for (var i = 0; i < magicgems.map.length; i++) {
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
			if (magicgems.map[i][j].animated) {
				magicgems.gamefield.context.fillStyle = "#000000";
				magicgems.gamefield.context.fillRect(j * magicgems.tileWidth, i * magicgems.tileHeight, magicgems.tileWidth, magicgems.tileHeight);
			}
			if ((!magicgems.map[i][j].animated)&&(!onload)) continue;
			displacement = magicgems.map[i][j].displacement;
			magicgems.gamefield.context.drawImage(magicgems.map[i][j].texture, j * magicgems.tileWidth, i * magicgems.tileHeight + displacement, magicgems.tileWidth, magicgems.tileHeight);
		}
	}
}

function inLimits(x, min, max) {
	return x >= 0 && x <= max;
}

magicgems.click = function(e) {
	x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft; 
	y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;  
	x -= magicgems.gamefield.canvas.offsetLeft;
	y -= magicgems.gamefield.canvas.offsetTop;
	var tileX = Math.floor(x / magicgems.tileWidth);
	var tileY = Math.floor(y / magicgems.tileHeight);
	if (magicgems.map[tileY][tileX] == "void") return;
	var checked = {};
	checked[tileX + "," + tileY] = true;
	
	var clickedGem = magicgems.map[tileY][tileX];
	
	function checkNeighbors(tileX,tileY) {
		var map = magicgems.map;
		var neighborsCoords = [{x:tileX,y:tileY-1},{x:tileX,y:tileY+1},{x:tileX-1,y:tileY},{x:tileX+1,y:tileY}].filter(function(obj) { return inLimits(obj.x, 0, magicgems.tilesOnX-1) && inLimits(obj.y, 0, magicgems.tilesOnY-1)});
		var neighbors = [];
		
		for (var i = 0; i < neighborsCoords.length; i++) {
			var x = neighborsCoords[i].x;
			var y = neighborsCoords[i].y;
			if (map[y][x].type == clickedGem.type)  {
				neighbors.push(map[y][x]);
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
		magicgems.map[group[i].y][group[i].x] = "void";
	}
}

magicgems.gravitation = function() {
	for (var i = magicgems.map.length-1; i >= 0; i--) {
		for (var j = 0; j < magicgems.map[i].length; j++) {
			if (magicgems.map[i][j].animated) {
				if (magicgems.map[i][j].displacement >= 0) {
					magicgems.map[i][j].timeOfFalling = 0;
					magicgems.map[i][j].animated = false;
				} else {
					
					if ((i < magicgems.map.length - 1) && (magicgems.map[i+1][j] == "void")) {
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
				continue;
			}
			if (i == magicgems.map.length-1) continue;
			if (magicgems.map[i+1][j] !== "void") continue;
			magicgems.map[i+1][j] = magicgems.map[i][j];
			magicgems.map[i+1][j].y++;
			magicgems.map[i][j] = "void";
			magicgems.map[i+1][j].animated = true;
			magicgems.map[i+1][j].animationStart = i;
			magicgems.map[i+1][j].animationEnd = i+1;
			magicgems.map[i+1][j].timeOfFalling = 0;
			magicgems.map[i+1][j].displacement = (magicgems.map[i+1][j].animationStart - magicgems.map[i+1][j].animationEnd) * magicgems.tileHeight;
		}
	}
}

magicgems.step = function() {
	magicgems.draw();
	magicgems.gravitation();
}

setInterval(function(){magicgems.step()}, 25);



