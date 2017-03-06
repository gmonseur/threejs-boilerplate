// THREE.JS VARIABLES
var scene,
    camera, fieldOfView, aspectRatio, nearPlane, farPlane,
    renderer,
    container,
    controls,
    gui;

// SCREEN VARIABLES
var HEIGHT, WIDTH;

// GUI
var guicontrols = new function () {
    this.rotationSpeed = 0.02;
};

// INIT THREE.JS + SCENE
function createScene() {

    HEIGHT = window.innerHeight;
    WIDTH = window.innerWidth;

    scene = new THREE.Scene();
    aspectRatio = WIDTH / HEIGHT;
    fieldOfView = 50;
    nearPlane = .1;
    farPlane = 10000;
    camera = new THREE.PerspectiveCamera(
        fieldOfView,
        aspectRatio,
        nearPlane,
        farPlane
    );

    camera.position.set(0, 150, 400);
    camera.lookAt(scene.position);

    // RENDER
    renderer = new THREE.WebGLRenderer({alpha: true, antialias: true});
    renderer.setSize(WIDTH, HEIGHT);
    renderer.shadowMap.enabled = true;
    // to antialias the shadow
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container = document.getElementById('threejsbox');
    container.appendChild(renderer.domElement);
    window.addEventListener('resize', handleWindowResize, false);

    // FLOOR
    var floorTexture = new THREE.TextureLoader().load('img/floor.jpg');
    floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
    floorTexture.repeat.set(8, 8);
    var floorMaterial = new THREE.MeshLambertMaterial({map: floorTexture, side: THREE.DoubleSide});
    var floorGeometry = new THREE.PlaneGeometry(1280, 1280, 100, 100);
    var floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.position.y = -0.5;
    floor.rotation.x = Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // ORBIT CONTROLS
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.damping = 0.2;
    controls.maxPolarAngle = Math.PI;
    controls.minPolarAngle = -Math.PI / 2;
    controls.minDistance = 300;
    controls.maxDistance = 700;
    controls.enabled = true;
    controls.enableZoom = true;
    controls.enablePan = true;

    // STATS
    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.bottom = '0px';
    stats.domElement.style.zIndex = 100;
    container.appendChild(stats.domElement);

    // GUI
    gui = new dat.GUI();
    gui.add(guicontrols, 'rotationSpeed', 0, 0.5);
}

// WINDOW RESIZE
function handleWindowResize() {
    HEIGHT = window.innerHeight;
    WIDTH = window.innerWidth;
    renderer.setSize(WIDTH, HEIGHT);
    camera.aspect = WIDTH / HEIGHT;
    camera.updateProjectionMatrix();
}

// LIGHTS
var ambientLight, frontLight;
var SHADOW_MAP_WIDTH = 2048, SHADOW_MAP_HEIGHT = 1024;

function createLights() {
    // AMBIENTLIGHT
    ambientLight = new THREE.AmbientLight(0x404040); // soft white light
    ambientLight.intensity = 4;
    scene.add(ambientLight);

    // FRONTLIGHT
    frontLight = new THREE.SpotLight(0xffffff);
    frontLight.position.set(0, 3000, 5000);
    frontLight.target.position.set(0, 0, 0);
    frontLight.intensity = 0.2;
    frontLight.castShadow = true;
    frontLight.shadow = new THREE.LightShadow(new THREE.PerspectiveCamera(50, 1, 3000, 25000));
    frontLight.shadow.bias = 0.0001;
    frontLight.shadow.mapSize.width = SHADOW_MAP_WIDTH;
    frontLight.shadow.mapSize.height = SHADOW_MAP_HEIGHT;

    // Light helper
    //var lightHelper = new THREE.CameraHelper(frontLight.shadow.camera);
    //scene.add(lightHelper);

    scene.add(frontLight);
}

// CUBE OBJECT
var cube;

function createBox() {
    var geometry = new THREE.CubeGeometry(100, 100, 100);
    var crateTexture = new THREE.TextureLoader().load('img/crate.gif');
    var material = new THREE.MeshLambertMaterial({map: crateTexture});

    cube = new THREE.Mesh(geometry, material);
    cube.castShadow = true;
    cube.position.set(0, 50, 0);
    scene.add(cube);
}

// RENDER
var render = function () {
    stats.update();

    // Cube scale rotation with guicontrols
    cube.rotation.y += guicontrols.rotationSpeed;

    // Render
    renderer.render(scene, camera);
    requestAnimationFrame(render);
};

// INIT
function init() {
    // scene
    createScene();

    // lights
    createLights();

    // object
    createBox();

    // render
    render();
}

window.addEventListener('load', init, false);