var magicgems = {};

magicgems.createGameField = function(element) {
	var gamefield = {
		canvas: document.createElement('canvas'),
		width: element.clientWidth,
		height: element.clientHeight
	}
	element.appendChild(gamefield.canvas);
	gamefield.canvas.width = gamefield.width;
	gamefield.canvas.height = gamefield.height;
	magicgems.gamefield = gamefield;
	magicgems.gamefield.context = gamefield.canvas.getContext("2d");
	magicgems.tileWidth = 50;
	magicgems.tileHeight = magicgems.tileWidth;
	magicgems.tilesOnX = Math.floor(magicgems.gamefield.width / magicgems.tileWidth);
	magicgems.tilesOnY = Math.floor(magicgems.gamefield.height / magicgems.tileHeight);
	magicgems.map = new Array();
	for (var i = 0; i < magicgems.tilesOnY; i++) {
		var row = new Array(magicgems.tilesOnX);
		magicgems.map.push(row);
	}
	magicgems.generateMap();
	magicgems.gamefield.canvas.addEventListener('click', magicgems.click, false);
	magicgems.draw();
	
	console.log("Game field created in " + element.id + " element.");
}

magicgems.rand = function (min, max) {
	return Math.random() * (max - min) + min;
}

magicgems.gems = {
	emerald: function() {
			this.type = "emerald";
			this.color = "#00aa00";
			this.points = 50;
		},
	ruby: function() {
			this.type = "ruby";
			this.color = "#aa0000";
			this.points = 100;
		},
	sapphire: function() {
			this.type = "sapphire";
			this.color = "#0000aa";
			this.points = 150;
		},
	diamond: function() {
			this.type = "diamond";
			this.color = "#cccccc";
			this.points = 200;
		},
}

magicgems.inArray = function(arr,val) {
	for (var i = 0; i < arr.length; i++)	{
		if (arr[i] == val) {
			return true;
		}
	}
	return false;
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
			tile.x = i;
			tile.y = j;
			magicgems.map[i][j] = tile;
		}
	}
}

magicgems.draw = function() {
	for (var i = 0; i < magicgems.map.length; i++) {
		for (var j = 0; j < magicgems.map[i].length; j++) {
			magicgems.gamefield.context.fillStyle = magicgems.map[i][j].color;
			magicgems.gamefield.context.fillRect(j * magicgems.tileWidth, i * magicgems.tileHeight, magicgems.tileWidth, magicgems.tileHeight);
		}
	}
}

function inLimits(x, min, max) {
	return x >= 0 && x <= max;
}

magicgems.click = function(e) {
	var x = e.clientX - magicgems.gamefield.canvas.offsetLeft;
	var y = e.clientY - magicgems.gamefield.canvas.offsetTop;
	var tileX = Math.floor(x / magicgems.tileWidth);
	var tileY = Math.floor(y / magicgems.tileHeight);
	var checked = {};
	
	var clickedGem = magicgems.map[tileY][tileX];
	
	function checkNeighbors(tileX,tileY) {
		var map = magicgems.map;
		var neighborsCoords = [{x:tileX,y:tileY-1},{x:tileX,y:tileY+1},{x:tileX-1,y:tileY},{x:tileX+1,y:tileY}].filter(function(obj) { return inLimits(obj.x, 0, magicgems.tilesOnX-1) && inLimits(obj.y, 0, magicgems.tilesOnY-1)});
		var neighbors = [];
		
		for (var i = 0; i < neighborsCoords.length; i++) {
			var x = neighborsCoords[i].x;
			var y = neighborsCoords[i].y;
			
			//if ((typeof map[neighborsCoords[i].y] != "undefined") && (typeof map[neighborsCoords[i].y][neighborsCoords[i].x] != "undefined") && (map[neighborsCoords[i].y][neighborsCoords[i].x].type == map[tileY][tileX].type))  {
			
			if (map[y][x].type == clickedGem.type)  {
				neighbors.push(map[y][x]);
			}
		}
		
		console.log(neighbors);
		if (neighbors.length == 0) return [];
		
		for (var i = 0; i < neighbors.length; i++) {
			var coords = neighbors[i].x + "," + neighbors[i].y;
			if (!checked[coords]) {
				checked[coords] = true;
				arr = checkNeighbors(neighbors[i].x,neighbors[i].y);
				neighbors = neighbors.concat(arr);
			}
		}
		if (map[tileY][tileX].type == clickedGem.type) {
			return neighbors.concat([map[tileY][tileX]]);
		} else {
			return neighbors;
		}
	}
	
	var group = checkNeighbors(tileX,tileY);
	
	console.log(group);
}








/*
	ad.tileHeight = 40;
	ad.tileWidth = 40;
	ad.tilesOnX = Math.ceil(ad.width/ad.tileWidth);
	ad.tilesOnY = Math.ceil(ad.height/ad.tileHeight);
	ad.lr = 'r';
	ad.o2 = 1;
	ad.keys = 'enabled';
	ad.map = new Array();
	ad.currentMap = new Array();
	ad.displacementX = 0;
	ad.displacementY = 0;
	ad.camera = {};
	ad.currentFromX = 0;
	ad.currentFromY = 0;
	ad.currentDisplacementX = 0;
	ad.currentDisplacementY = 0;
	ad.items = {
		quartz: 0,
		emerald: 0,
		ruby: 0,
		diamond: 0
	};
	ad.context.font = '16px lucida console';
	ad.characteristics = {
		o2consumption: 0.00010
	};
	ad.dx = 0;
	ad.dy = 0;
	
	Array.prototype.in_array = function(p_val) {
		for(var i = 0, l = this.length; i < l; i++)	{
			if(this[i] == p_val) {
				return true;
			}
		}
		return false;
	}

	ad.draw = function(img, x, y, width, height) {
		ad.context.drawImage(img, Math.round(x), Math.round(y), width, height);
	}

	ad.drawBoat = function(x, y, width, height) {
		if (ad.lr == 'l') {
			var img = document.getElementById("boat-l");             
			ad.context.drawImage(img, x, y, width, height);
		}
		if (ad.lr == 'r') {
			var img = document.getElementById("boat-r");
			ad.context.drawImage(img, x, y, width, height);
		}
	}

	ad.coordHash = function(a, b) {
		var hash = a ^ b;
		for(var i = 0; i < 3; i++) {
			hash = hash*31 ^ (a << (0x0F & hash-1)) ^ (b << (0x0F & hash-31));
		}
		return hash;            
	}

	ad.hash2prob = function(hash) {
		return (hash & 0xFFFF)/65536;
	}

	ad.drawTile = function(tileX, tileY, dispX, dispY) {
		var x = (tileX - ad.currentDisplacementX)* ad.tileWidth + dispX;
		var y = (tileY - ad.currentDisplacementY)* ad.tileHeight + dispY;
		var xandy = (tileX + 'and' + tileY);
		var ap = ad.hash2prob(ad.coordHash(tileX, tileY));
		
		//Sky
		if (tileY < 6){
			ad.context.fillStyle = "#87CEFA";
			ad.context.fillRect(x, y, ad.tileWidth, ad.tileHeight);
		} 

		//Ground
		if (tileY == 21) {
			var probability = 0.5;
			if ((ap < probability) && (!ad.map.in_array(xandy))) {
				ad.draw(stone, x, y, ad.tileWidth, ad.tileHeight);
			}
		}
		if ((tileY > 21) && (ad.map.in_array(xandy) == false)) {
			ad.draw(stone, x, y, ad.tileWidth, ad.tileHeight);
		}
		var probability0 = 0.01;
		if ((tileY > 30) && (ap < probability0) && (ad.map.in_array(xandy) == false)) {
			ad.draw(quartz, x, y, ad.tileWidth, ad.tileHeight);
		}
		probability0 = 0.01;
		var probability1 = 0.02;
		if ((tileY > 71) && (tileY < 170) && (ap > probability0) && (ap < probability1) && (ad.map.in_array(xandy)==false)) {
			ad.draw(emerald, x, y, ad.tileWidth, ad.tileHeight);  
		}
	}
	
	ad.keypress = function(event) {
		if (ad.keys == 'enabled') {
			k = event.keyCode;
			switch(k) {
				case 38:
					ad.camera.up();
					break;
				case 40:
					ad.camera.down();
					break;
				case 37:
					ad.camera.left();
					break;
				case 39:
					ad.camera.right();
					break;
			}
		}
		//<	   37
		//^	   38
		//>    39
		//v    40
	}
	
	document.addEventListener('keydown', ad.keypress, false);

	ad.dig = function (tileX, tileY) {
		var xandy = (tileX + 'and' + tileY);
		var ap = ad.hash2prob(ad.coordHash(tileX, tileY));
		var probability = 0.01;
		if ((tileY > 30) && (tileY < 70) && (ap < probability) && (!ad.map.in_array(xandy))) {
			ad.items.quartz++;
		}
		probability = 0.01;
		if ((tileY > 71) && (tileY < 170) && (ap < probability) && (!ad.map.in_array(xandy))) {
			ad.items.emerald++;
		}
		if(!ad.map.in_array(xandy)) {
			ad.map.push(xandy);
		}
	}
	
	ad.camera.right = function () {
		ad.lr = 'r';
		ad.keys = "disabled";
		ad.displacementX++;
		ad.dig(Math.ceil(ad.tilesOnX / 2) + ad.displacementX - 1, 6 + ad.displacementY);
		ad.drawWorld(ad.displacementX, ad.displacementY);
	}

	ad.camera.left = function () {
		ad.lr = 'l';
		ad.keys = "disabled";
		ad.displacementX--;
		ad.dig(Math.ceil(ad.tilesOnX / 2) + ad.displacementX - 1, 6 + ad.displacementY);
		ad.drawWorld(ad.displacementX, ad.displacementY);
	}

	ad.camera.down = function () {
		ad.keys = "disabled";
		ad.displacementY++;
		ad.dig(Math.ceil(ad.tilesOnX / 2) + ad.displacementX - 1, 6 + ad.displacementY);
		ad.drawWorld(ad.displacementX, ad.displacementY);
	}
	
	ad.camera.up = function () {
		if (ad.displacementY <= 0) return;
		ad.keys = "disabled";
		ad.displacementY--;
		ad.dig(Math.ceil(ad.tilesOnX / 2) + ad.displacementX - 1, 6 + ad.displacementY);
		ad.drawWorld(ad.displacementX, ad.displacementY);
	}

	ad.drawWorld = function (fromX, fromY) {
		var xandy = ((Math.ceil(ad.tilesOnX / 2) + ad.displacementX - 1) + 'and' + (6 + ad.displacementY));
		var ap = ad.hash2prob(ad.coordHash((Math.ceil(ad.tilesOnX / 2) + ad.displacementX - 1), (6 + ad.displacementY)));
		if (((!ad.currentMap.in_array(xandy)) && ((fromY + 6) > 21)) || ((!ad.currentMap.in_array(xandy)) && ((fromY + 6) == 21) && (ap < 0.5))) {
			var t = 70;
		} else {
			var t = 20;
		}
		var stepX = Math.round((ad.currentFromX - fromX) * ad.tileWidth / t * 100) / 100;
		var stepY = Math.round((ad.currentFromY - fromY) * ad.tileHeight / t * 100) / 100;
		var nStepsX = (ad.currentFromX - fromX) * ad.tileWidth / stepX;
		var nStepsY = (ad.currentFromY - fromY) * ad.tileHeight / stepY;
		var c = 0;
		
		var step = function() {
			ad.raf = window.requestAnimationFrame(step);
			ad.dx += stepX;
			ad.dy += stepY;
			c++;
			ad.context.fillStyle = "#6495ED";
			ad.context.fillRect(0, 0, ad.width, ad.height); //Background (water)
			for (var i = ad.currentFromX - 1; i <= ad.currentFromX + ad.tilesOnX; i++) {
				for (var j = ad.currentFromY - 1; j <= ad.currentFromY + ad.tilesOnY; j++) {
					ad.drawTile(i, j, ad.dx, ad.dy);
				}
			}
			ad.drawBoat((Math.ceil(ad.tilesOnX / 2) * ad.tileWidth) - ad.tileWidth + 1, 6 * (ad.tileHeight) + ad.tileHeight * 0.2, ad.tileWidth - 2, ad.tileHeight * 0.725);
			ad.drawTools();
			ad.o2 -= ad.characteristics.o2consumption;
			if ((c > nStepsX) || (c > nStepsY)) {
				cancelAnimationFrame(ad.raf);
				ad.dx = 0;
				ad.dy = 0;
				ad.currentDisplacementX = ad.displacementX;
				ad.currentDisplacementY = ad.displacementY;
				ad.currentMap = [];
				ad.currentMap = ad.map.concat(ad.currentMap);
				ad.keys = "enabled";
			}
			if (ad.o2 <= 0) {
				ad.o2 = 0;
				ad.keys = "disabled";
				ad.context.font = '56px lucida console';
				ad.context.fillStyle = "#111111";
				ad.context.fillText('GAME OVER', ad.width / 2 - 200, ad.height / 2 - 60);
			}
		}
		
		step();
		ad.currentFromX = fromX;
		ad.currentFromY = fromY;
		if (ad.displacementY == 0) {
			ad.o2 = 1;
		}
	}
	
	ad.drawTools = function() {
		ad.context.font = '16px lucida console';
		ad.context.fillStyle = "#DDDDDD";
		ad.context.fillRect(8, 8, 80, 160);
		ad.draw(quartz, 36, 12, 20, 20);
		ad.context.fillStyle = "#555555";
		ad.context.fillText(ad.items.quartz, 65, 28);
		ad.draw(emerald, 36, 42, 20, 20);
		ad.context.fillText(ad.items.emerald, 65, 58);
		ad.draw(ruby, 36, 72, 20, 20);
		ad.context.fillText(ad.items.ruby, 65, 88);
		ad.draw(diamond, 36, 102, 20, 20);
		ad.context.fillText(ad.items.diamond, 65, 118);
		ad.context.fillStyle = "#00DD00";
		ad.context.fillRect(15, 15, 10, 130 * ad.o2);
		ad.context.fillText('O2', 15, 160);
	}
	
	
	ad.drawWorld(0,0);
}
*/