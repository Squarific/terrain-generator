function Terrain(opts){
	var dis = this;
	//length width height

	function generateFlat(l,w){
		var returnArr = [];
		for(i=0;i<l;i++){
			for(j=0;j<w;j++){
				if(j==0) {
					returnArr.push([]);
				}
				returnArr[i][j] = Math.random()*0.2;
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


	snakes around, starting at center.
	One move, turn, one move, turn, repeat.

	# of spaces to take on each stretch
	1,1,2,2,3,3,4,4,5,5,6,6,7,7

	# of stretches to do:
	( ( total # of layers you want * 2 ) - 1 ) * 2

	***********************/
	function createPyramid(height,pos_x,pos_y){
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

	function raound(max){
		return Math.floor(Math.random() * max);
	}

	/*************************/

	this.contents = generateFlat(opts.width,opts.length);
	for(k=0;k<20;k++){
		createPyramid(raound(20),raound(this.contents.length),raound(this.contents[0].length));	
	}

}