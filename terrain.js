function Terrain(opts){
	var dis = this;
	//length width height

	var occupado = [];

	function generateFlat(l,w,forceHeight){
		var returnArr = [];
		for(i=0;i<l;i++){
			for(j=0;j<w;j++){
				if(j==0) {
					returnArr.push([]);
				}
				returnArr[i][j] = typeof(forceHeight) == 'undefined' ? Math.random()*0.2 : forceHeight;
			}
		}
		return returnArr;
	}


	/**********************
	
	4 	4 	4 	4 	4 	4 	4 		1 - 1
	4	3	3 	3 	3 	3 	4 		2 - 8
	4	3	2 	2 	2 	3 	4 		3 - 16
	4	3	2	1 	2 	3 	4 		4 - 24
	4	3	2	2	2 	3 	4
	4	3 	3 	3 	3 	3 	4
	4 	4 	4 	4 	4 	4 	4

				4			
			4	3	4		
		4	3	2	3	4	
	4	3	2	1	2	3	4
		4	3	2	3	4	
			4	3	4		
				4	


	1   2   3   4   5   6   7   8
	  1   2   3   4   5   6   7   8
	1   2   3   4   5   6   7   8
	  1   2   3   4   5   6   7   8
	1   2   3   4   5   6   7   8
	  1   2   3   4   5   6   7   8
	1   2   3   4   5   6   7   8
	  1   2   3   4   5   6   7   8
	1   2   3   4   5   6   7   8
	  1   2   3   4   5   6   7   8
	1   2   3   4   5   6   7   8
	  1   2   3   4   5   6   7   8

	snakes around, starting at center.
	One move, turn, one move, turn, repeat.

	# of spaces to take on each stretch
	1,1,2,2,3,3,4,4,5,5,6,6,7,7

	# of stretches to do:
	( ( total # of layers you want * 2 ) - 1 ) * 2

	***********************/
	function createSquarePyramid(height,pos_x,pos_y){
		var max_x = dis.contents.length;
		var max_y = dis.contents[0].length;

		dis.contents[pos_x][pos_y] = height;

		var base = 0;
		var step_sequence = [];
		var total_levels = height - base;
		var total_steps = ( ( total_levels * 2 ) - 1 ) * 2;

		var j=1;
		for(var i=0; i<total_steps; i+=2) {
			step_sequence.push(j);
			if( j != (total_levels * 2)-1 ){
				step_sequence.push(j);
			}

			j++;
		}

		console.log(step_sequence);
		
		
		var cur_x = pos_x;
		var cur_y = pos_y;

		var directions = ['down','right','up','left'];
		var cur_direction = 0;
		var slope = 1;


		var cur_dist_down = 1;
		step_sequence.forEach(function(step) {

			for(var j=0; j<step; j++){
				switch(directions[cur_direction]){
					case 'down':
						//console.log('down');
						cur_y ++;
						break;
					case 'right':
						//console.log('right');
						cur_x ++;
						break;
					case 'up':
						//console.log('up');
						cur_y --;
						break;
					case 'left':
						//console.log('left');
						cur_x --;
						break;
				}

				if(
					cur_y >= 0 &&
					cur_y < max_y &&
					cur_x >= 0 &&
					cur_x < max_x
				){
					dis.contents[cur_x][cur_y] = height - cur_dist_down;
				}

			}

			cur_direction = cur_direction != 3 ? cur_direction + 1 : 0;
			if( cur_direction == 0 ){
				cur_dist_down += slope;
			}

		});

	}
	function createLessShittySquarePyramid(height,pos_x,pos_y){
		/***************
			
			4 	4 	4 	4 	4 	4 	4 		1 - 
			4	3	3 	3 	3 	3 	4 		2 - n : 0 | dist before turn: 2
			4	3	2 	2 	2 	3 	4 		3 - n : 1 | dist before turn: 4
			4	3	2	1 	2 	3 	4 		4 - n : 2 | dist before turn: 6
			4	3	2	2	2 	3 	4
			4	3 	3 	3 	3 	3 	4 		(n+1)*2
			4 	4 	4 	4 	4 	4 	4

		***************/
		var max_x = dis.contents.length;
		var max_y = dis.contents[0].length;
		var cur_x = pos_x;
		var cur_y = pos_y;
		var slope = 1;
		
		var total_steps = Math.floor(height/slope);

		if(! testOccupied(cur_x-total_steps,cur_y-total_steps,cur_x+total_steps,cur_y+total_steps)){
			return;
		}


		if(dis.occupado[cur_x][cur_y]){
			return;
		}
		dis.occupado[cur_x][cur_y] = true;
		dis.contents[cur_x][cur_y] = height;

		var cur_height = height;

		//determine whether it can select the current position.


		for (var i=0;i<total_steps;i++) {
			cur_y++;
			if(i > 0){
				cur_y++;
			}
			cur_x--;
			cur_height -= slope;
			updatePointIfPossible(cur_x,cur_y,cur_z);
			
			//steps to move calculation: i-
			var steps = (i+1) * 2;
			var directions = ['right','up','left','down'];
			var cur_direction = -1;

			for(var j=0; j<4; j++){
				cur_direction = cur_direction != 3 ? cur_direction + 1 : 0;
				if(j==3){
					steps --;
				}
				for(var k=0; k<steps; k++) {
					switch(directions[j]){
						case 'down':
							//console.log('down');
							cur_y ++;
							break;
						case 'right':
							//console.log('right');
							cur_x ++;
							break;
						case 'up':
							//console.log('up');
							cur_y --;
							break;
						case 'left':
							//console.log('left');
							cur_x --;
							break;
					}
					updatePointIfPossible(cur_x,cur_y,cur_z);
				}
			}

		}
	}

	function updatePointIfPossible(x,y,z,additive){
		if(
			y >= 0 &&
			y < dis.contents[0].length &&
			x >= 0 &&
			x < dis.contents.length
		){
			if(typeof(additive) == 'boolean' && additive == true){
				dis.contents[x][y] += z;
			}else if(typeof(additive) == 'function'){
				if(additive()){
					dis.contents[x][y] += z;
				}else{
					dis.contents[x][y] = z;
				}
			}else{
				dis.contents[x][y] = z;
			}
			dis.occupado[x][y] = true;
			return true;
		}
		return false;
		//console.log(cur_x+','+cur_y+','+cur_height);
	}

	function snakeHill(){
		//select a random point and rough vector, and start snakin'
		var max_x = dis.contents.length;
		var max_y = dis.contents[0].length;
		var cur_x = Math.round(Math.random()*dis.contents.length);
		var cur_y = Math.round(Math.random()*dis.contents[0].length);

		dis.contents[cur_x][cur_y] = 2;

		var mountainRangeOccupado = cloneOccupado();

		//rough vectors: % of chance it will go in either direction.
		var roughVectorX = 0;
		while(roughVectorX == 0){ roughVectorX = (Math.random()*2) - 1; } //force not 0, obvs.
		var roughVectorY = 0;
		while(roughVectorY == 0){ roughVectorY = (Math.random()*2) - 1; }

		for(var i=0; i<500; i++){
			//each turn will allow it to move either 1 by x and/or y. 
			//Direction should be determined by roughVector props
			var x_changes = Math.random() > Math.abs(roughVectorX);
			var y_changes = Math.random() > Math.abs(roughVectorY);

			if(x_changes){
				cur_x += roughVectorX > 0 ? 1 : -1;
			}

			if(y_changes){
				cur_y += roughVectorY > 0 ? 1 : -1;
			}



			//if bad position, break
			if(! updatePointIfPossible(cur_x,cur_y,2,function(){mountainRangeOccupado[cur_x][cur_y] != true})){
				break;
			}
			
		}
	}

	function cloneOccupado(){
		var occ = [];
		for(var i=0; i<dis.occupado.length; i++)
		{
			occ.push([]);
			for(var j=0; j>dis.occupado[i].length; i++)
			{
				occ[i][j] = dis.occupado[i][j];
			}
		}
		return occ;
	}

	function raound(max){
		return Math.floor(Math.random() * max);
	}

	function testOccupied(min_x,min_y,max_x,max_y){
		//max and min out the vars to reduce the amount to run through the array
		min_x = min_x >= 0 ? min_x : 0;
		min_y = min_y >= 0 ? min_y : 0;

		max_x = max_x <= dis.contents.length ? max_x : dis.contents.length;
		max_y = max_y <= dis.contents.length ? max_y : dis.contents.length;

		for (var i=min_x; i<max_x; i++) {
			for (var j=min_y; j<max_y; j++) {
				if(dis.occupado[i][j] == true){
					return false;
				}
			}
		}
		return true;
	}

	/*************************/

	this.contents = generateFlat(opts.width,opts.length);
	this.occupado = generateFlat(opts.width,opts.length,0);

	for(k=0;k<20;k++){
		snakeHill();
	}

/*
	for(k=0;k<500;k++){
		var x = raound(this.contents.length);
		var y = raound(this.contents[0].length);

		if(
			(x%2==0 && y%2==0) ||
			(x%2==1 && y%2==1)
		){
			createLessShittySquarePyramid(raound(10),x,y);
			//console.log(countTrue(dis.occupado));
		}else{
			//create triangle pyramid?
		}
	}
*/

}