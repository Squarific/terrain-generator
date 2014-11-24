var TerrainMap = function(terrain, elID, cycle){

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


	//var plane_geometry = new THREE.PlaneGeometry( 20, 20 );
	//var plane_material = new THREE.MeshBasicMaterial( {color: 0xA1A1A1, side: THREE.DoubleSide} );
	//var plane = new THREE.Mesh( plane_geometry, plane_material );
	//plane.position.z = -1;
	//scene.add( plane );


	//var geometry = new THREE.BoxGeometry( 1, 1, 1 );
	//var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
	//var cube = new THREE.Mesh( geometry, material );
	//cube.position.z=0.5;
	//scene.add( cube );


	//point light
	this.light = new THREE.PointLight( 0xff0000, 1.5, 100 );
	this.light.position.set(20,20,50);
	scene.add( this.light );

	//ambient light
	var ambilight = new THREE.HemisphereLight(0xE8F5F8, 0x4A554D, 1);
	scene.add( ambilight );

	this.mesh_geo = new THREE.Geometry();
	this.mesh_geo.dynamic = true;

	
	this.generate = function(mesh) {
		var vertices = [];
		var faces = [];


		for (var i=0; i<mesh.length; i++) {
			for(var j=0; j<mesh[i].length; j++) {
				vertices.push( new THREE.Vector3( j, i, mesh[i][j] ) );
			}
		}

		for (var i=0; i<mesh.length-1; i++) {
			for(var j=0; j<mesh[i].length-1; j++) {
				var top_left = (i * mesh.length) + j;
				var bottom_left = ( (i+1) * mesh.length ) + j;
				var top_right = (i * mesh.length) + j + 1;
				var bottom_right = ( (i+1) * mesh.length ) + j + 1;

				//console.log( "top_left, top_right, bottom_right");
				//console.log( top_left+" "+top_right+" "+bottom_right);
				
				faces.push(new THREE.Face3( top_left, top_right, bottom_right) );
				faces.push(new THREE.Face3( bottom_right, bottom_left, top_left) );
			}
		}
		this.mesh_geo.vertices = vertices;
		this.mesh_geo.faces = faces;
		if(this.mesh_obj){
			this.mesh_obj.position.set( 0, 0, 0 );
			this.mesh_obj.geometry.applyMatrix(new THREE.Matrix4().makeTranslation( offset_x, offset_y, 0 ) );
			this.mesh_obj.material.color = new THREE.Color( (Math.random()*0.5)+0.5,(Math.random()*0.5)+0.5,(Math.random()*0.5)+0.5 );
			this.mesh_geo.computeFaceNormals();
			this.mesh_geo.verticesNeedUpdate = true;
		}
	}


	this.generate(terrain.contents);
	this.mesh_geo.dynamic = true;
	this.mesh_geo.computeFaceNormals();

	this.mesh_obj = new THREE.Mesh(this.mesh_geo, new THREE.MeshPhongMaterial({
		color: 0x796060,
		wireframe : true
	}));



	var offset_x = terrain.contents.length*-0.5;
	var offset_y = terrain.contents[0].length*-0.5;

	this.mesh_obj.position.set( 0, 0, 0 );
	this.mesh_obj.geometry.applyMatrix(new THREE.Matrix4().makeTranslation( offset_x, offset_y, 0 ) );

	scene.add(this.mesh_obj);


	this.camera.rotation.x = this.de2ra(90);
	this.camera.rotation.y = this.de2ra(45);
	this.camera.position.x = 60;
	this.camera.position.y = -60;
	this.camera.position.z = 30;
	this.camera.rotateX(this.de2ra(-22));


	var dis = this;

	function render() {
		dis.mesh_obj.rotateZ(dis.de2ra(0.1));
		requestAnimationFrame( render );
		renderer.render( scene, dis.camera );
	}
	render();
}

TerrainMap.prototype.update = function(mesh){
	this.generate(mesh);
}