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





						26,88	27,88	28,88
						26,89	num 	28,89
						26,90	27,90 	28,90




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

		dis.contents[cur_x][cur_y] = height;
		dis.occupado[cur_x][cur_y] = true;

		var cur_height = height;

		//determine whether it can select the current position.


		for (var i=0;i<total_steps;i++) {
			cur_y++;
			if(i > 0){
				cur_y++;
			}
			cur_x--;
			cur_height -= slope;
			updatePointIfPossible();
			
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
					updatePointIfPossible();
				}
			}

		}

		function updatePointIfPossible(){
			if(
				cur_y >= 0 &&
				cur_y < max_y &&
				cur_x >= 0 &&
				cur_x < max_x
			){
				dis.contents[cur_x][cur_y] = cur_height;
				dis.occupado[cur_x][cur_y] = true;
			}
			//console.log(cur_x+','+cur_y+','+cur_height);
		}

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

	//function countTrue(arr){
	//	var trues = 0;
	//	for (var i=0; i<arr.length; i++) {
	//		for (var j=0; j<arr[0].length; j++) {
	//			if(arr[i][j] == true){
	//				trues++;
	//			}
	//		}
	//	}
	//	return trues;
	//}

}