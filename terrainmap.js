var TerrainMap = function(terrain, elID){

	this.de2ra = function(degree)   { return degree*(Math.PI/180); }
	/*

	fuck yeah ascii reference


		   y
		   |
		   |
		   |_______x		
		  /
		 /
		z



		a b c d
		e f g h
		i j k l
		m n o p


	*/


	//requires three.js
	if(typeof(THREE) == 'undefined'){
		console.error('Three.js not loaded');
		return false;
	}

	var scene = new THREE.Scene();
	this.camera = new THREE.PerspectiveCamera( 30, window.innerWidth / window.innerHeight, 0.1, 1000 );

	var renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);

	document.querySelector(elID).appendChild(renderer.domElement);

	/*var geometry 	= new THREE.Geometry();

	geometry.vertices.push(
		new THREE.Vector3( 1, 0, 0.5 ),
		new THREE.Vector3( 1, 0, 1 ),
		new THREE.Vector3( 1, 0, 0.5 )
	);

	geometry.faces.push( new THREE.Face3(0,1,2) );
	geometry.computeBoundingSphere();
 	geometry.computeFaceNormals();

	var object = new THREE.Mesh(new THREE.BoxGeometry( 100, 100, 100 ), new THREE.MeshBasicMaterial());

	scene.add(object);*/


	var plane_geometry = new THREE.PlaneGeometry( 20, 20 );
	var plane_material = new THREE.MeshBasicMaterial( {color: 0xA1A1A1, side: THREE.DoubleSide} );
	var plane = new THREE.Mesh( plane_geometry, plane_material );
	plane.position.z = -1;
	scene.add( plane );


	var geometry = new THREE.BoxGeometry( 1, 1, 1 );
	var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
	var cube = new THREE.Mesh( geometry, material );
	cube.position.z=0.5;
	//scene.add( cube );


	//point light
	this.light = new THREE.PointLight( 0xff0000, 1.5, 100 );
	this.light.position.set(20,20,50);
	scene.add( this.light );

	//ambient light
	var ambilight = new THREE.HemisphereLight(0xE8F5F8, 0x4A554D, 1);
	scene.add( ambilight );

	var mesh_geo = new THREE.Geometry();

	for (var i=0; i<terrain.contents.length; i++) {
		for(var j=0; j<terrain.contents[i].length; j++) {
			mesh_geo.vertices.push( new THREE.Vector3( j, i, terrain.contents[i][j] ) );
		}
	}

	for (var i=0; i<terrain.contents.length-1; i++) {
		for(var j=0; j<terrain.contents[i].length-1; j++) {
			var top_left = (i * terrain.contents.length) + j;
			var bottom_left = ( (i+1) * terrain.contents.length ) + j;
			var top_right = (i * terrain.contents.length) + j + 1;
			var bottom_right = ( (i+1) * terrain.contents.length ) + j + 1;

			//console.log( "top_left, top_right, bottom_right");
			//console.log( top_left+" "+top_right+" "+bottom_right);
			
			mesh_geo.faces.push(new THREE.Face3( top_left, top_right, bottom_right) );
			mesh_geo.faces.push(new THREE.Face3( bottom_right, bottom_left, top_left) );
		}
	}



	//var v1 = new THREE.Vector3(0,0,5);
	//var v2 = new THREE.Vector3(0,10,5);
	//var v3 = new THREE.Vector3(10,10,5);

	//debugger;
	//mesh_geo.vertices.push( v1 );
	//mesh_geo.vertices.push( v2 );
	//mesh_geo.vertices.push( v3 );

	//mesh_geo.faces.push(new THREE.Face3( 0, 1, 2) );
	mesh_geo.computeFaceNormals();

	this.mesh_obj = new THREE.Mesh(mesh_geo, new THREE.MeshPhongMaterial({
		color: 0x796060
		//wireframe : true
	}));



	var offset_x = terrain.contents.length*-0.5;
	var offset_y = terrain.contents[0].length*-0.5;

	this.mesh_obj.position.set( 0, 0, 0 );
	this.mesh_obj.geometry.applyMatrix(new THREE.Matrix4().makeTranslation( offset_x, offset_y, 0 ) );

	scene.add(this.mesh_obj);


	var face_normal = new THREE.Vector3( 0, 1, 0 );
	var face_color = new THREE.Color( 0xffaa00 );
	var face_face = new THREE.Face3( 0, 1, 2, face_normal, face_color, 0 );


	this.camera.rotation.x = this.de2ra(90);
	this.camera.rotation.y = this.de2ra(45);
	this.camera.position.x = 60;
	this.camera.position.y = -60;
	this.camera.position.z = 30;
	this.camera.rotateX(this.de2ra(-22));

	//this.camera.position.x = -20;

	//console.log(terrain.contents);
	
	//var offset = this.mesh_obj.centroid.clone();
	//this.mesh_obj.geometry.applyMatrix(new THREE.Matrix4().makeTranslation( -terrain.contents.length*-0.5, -terrain.contents[0].length*-0.5, 0 ) );
	//this.mesh_obj.position.copy( this.mesh_obj.centroid );


	var dis = this;

	function render() {
		dis.mesh_obj.rotateZ(dis.de2ra(0.1));
		requestAnimationFrame( render );
		renderer.render( scene, dis.camera );
	}
	render();
}