var stats, scene, renderer, composer, camera, cameraControl, gui, currentSong, PIseconds;
var canvas = document.getElementsByTagName("canvas")[0];
var prepare = {};
var postFX = {};

// DANCER / SONG RELATED CODE IN HERE
var dancer = new Dancer();
dancer.intervals = [];
songs = {};

function bpm2ms(bpm) {
    return 1 / (bpm / 60000);
}

// events is an array of objects , each containing
// "time" , the value in seconds for when to trigger, &
// "handler", the function that actually modifies behavior
var SongSettings = function (options) {
    this.url = options.url;
    this.bpm = options.bpm;
    this.kick = dancer.createKick(options.kickSettings);
    this.events = options.events;
    this.renderLoop = options.renderLoop;
    this.setup = options.setup;
}

// extension methods for dancer.js follow
dancer.startNewSong = function (song) {                 // takes a SongSettings object
    console.log(song);
    currentSong = song;
    this.load({ src: song.url });
    song.events.forEach((event) => {
        dancer.onceAt(event.time, event.handler);       // register all custom events
    })
    song.kick.on();
    song.setup(() => {console.log("song setup done");});
    this.play();
}

dancer.setInterval = function (func) {
    this.intervals.push(setInterval(func));
}

dancer.clearAllIntervals = function () {
    this.intervals.forEach((e) => {
        clearInterval(e);
    });
}

// WEBGL / THREE.js CODE AFTER HERE
var randomIntTable = [];
for (var i = 1e4, randomIntTable = []; i--;) {
    var negative = 1;
    if (Math.random() > .5) { negative = -1;};
    randomIntTable.push((Math.random() * 32 | 0) * negative);
}
function randomInt() {
    return ++i >= randomIntTable.length ? randomIntTable[i = 0] : randomIntTable[i];
}

function makeRandomGeometries(sizes, count, geometryType, materialType) {
    for (var i = 1 ; i <= count; i++) {
        var geometry = new geometryType(sizes[0], sizes[1], sizes[2]);
        var material = new materialType({ ambient: 0x888880, color: Math.random() * 0xffffff });
        var mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);
        mesh.position.set(randomInt(), randomInt(), randomInt());
    }
}

function shuffle(chance) {
    scene.traverse(function (object3d, i) {
        if (object3d instanceof THREE.Mesh === false) return
        if (Math.random() < chance) {
            object3d.position.set(randomInt(), randomInt(), randomInt());
        }
    })
}

function moveUp(distance) {
    var chance = 0.5;
    scene.traverse(function (object3d, i) {
        if (object3d instanceof THREE.Mesh === false) return
        if (Math.random() < chance) {
            object3d.position.y += distance;
        }
    })
}

function moveObject(object, targetPosition) {
    new TWEEN.Tween(object.position.x)
    .to(targetPosition.x, 2000)
    .easing(TWEEN.Easing.Elastic.InOut)
    .onUpdate(render)
    .start();
};

prepare.renderer = function () {                // all these members of "prepare" run inside init()
    renderer = new THREE.WebGLRenderer({
        antialias: true,	                        // get smoother output
        //alpha: true                                 // allow transparency
    });
    renderer.setClearColor(0x000000, 0);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('container').appendChild(renderer.domElement);
}

prepare.camera = function () {
    var cameraH = 3;
    var cameraW = cameraH / window.innerHeight * window.innerWidth;
    camera = new THREE.PerspectiveCamera(-cameraW / 2, +cameraW / 2, cameraH / 2, -cameraH / 2, -10000, 10000);
    camera.position.set(0, 0, 460);
    scene.add(camera);
}

prepare.stats = function () {
    stats = new Stats();
    stats.domElement.style.opacity = 0.5;
    document.body.appendChild(stats.domElement);
}

prepare.lights = function() {
    scene.add(new THREE.AmbientLight(Math.random() * 0xffffff));
    for (var i = 0; i < 2; i++) {
        var light = new THREE.DirectionalLight(Math.random() * 0xffffff);
        light.position.set(Math.random(), Math.random(), Math.random()).normalize();
        scene.add(light);
    }
    var light = new THREE.PointLight(Math.random() * 0xffffff);
    light.position.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5)
                .normalize().multiplyScalar(1.2);
    scene.add(light);
}

prepare.shaderPostFX = function() {
    postFX.DotScreen = new THREE.ShaderPass(THREE.DotScreenShader);
    postFX.DotScreen.uniforms['scale'].value = 4;
    postFX.Kaleidoscope = new THREE.ShaderPass(THREE.KaleidoShader);
    postFX.Kaleidoscope.uniforms['sides'].value = 4;
    postFX.hueSaturation = new THREE.ShaderPass(THREE.HueSaturationShader);
    postFX.rgbShift = new THREE.ShaderPass(THREE.RGBShiftShader);
    postFX.badTV = new THREE.ShaderPass(THREE.BadTVShader);
}

prepare.fxComposer = function() {
    composer = new THREE.EffectComposer(renderer, new THREE.WebGLRenderTarget(
        window.innerWidth, window.innerHeight, {
            format: THREE.RGBAFormat,               // necessary for transparent rendering
            minFilter: THREE.LinearFilter
        }));
    composer.addPass(new THREE.RenderPass(scene, camera));
}

prepare.datGUI = function() {
    gui = new dat.GUI();
    gui.add(postFX.rgbShift.uniforms['amount'], 'value').name("RGB Shift value").listen();
    gui.add(postFX.rgbShift.uniforms['angle'], 'value').name("RGB Shift angle").listen();
    gui.add(postFX.hueSaturation.uniforms['hue'], 'value').name("Hue").listen();
    gui.add(postFX.hueSaturation.uniforms['saturation'], 'value').name("Saturation").listen()
        .min(0).max(10).step(0.05).listen();
    gui.add(postFX.DotScreen.uniforms['scale'], 'value').name("Dot Screen scale").listen();
    gui.add(postFX.Kaleidoscope.uniforms['angle'], 'value').name("Kaledioscope angle").listen();
    gui.add(postFX.Kaleidoscope.uniforms['sides'], 'value').name("Kaledioscope sides")
        .min(3).max(12).step(1).listen();
    gui.add(postFX.badTV.uniforms['distortion'], 'value').min(1).max(100).step(1).listen().name("distortion");
    gui.add(postFX.badTV.uniforms['distortion2'], 'value').name("distortion 2").min(1).max(100).step(1).listen();
}


function init() {
    scene = new THREE.Scene();
    prepare.renderer();
    prepare.camera();
    prepare.stats();
    prepare.lights();
    prepare.shaderPostFX();
    prepare.fxComposer();
    prepare.datGUI();

    THREEx.WindowResize.bind(renderer, camera);                 // support window resizing
    cameraControls = new THREEx.DragPanControls(camera)

    makeRandomGeometries([.333, .333, .333], 200, THREE.BoxGeometry, THREE.MeshLambertMaterial);
    makeRandomGeometries([.5, .5, .5], 200, THREE.BoxGeometry, THREE.MeshLambertMaterial);
    makeRandomGeometries([1, 1, 1], 200, THREE.BoxGeometry, THREE.MeshLambertMaterial);
}

function animate() {
    requestAnimationFrame(animate);
    render();
    stats.update();
}

function render() {
    PIseconds = Date.now() * Math.PI;
    cameraControls.update();

    if (currentSong != null) {
        currentSong.renderLoop();           // song specific code here
    }

    if (composer.passes.length > 1) {           // if we only have a RenderPass in the composer,
        composer.render(scene, camera);         // skip it and render from the renderer directly
    } else {                                    // this allows instantiating the composer
        renderer.render(scene, camera);         // before we want to use effects, which
    }                                           // makes it easier to change on the fly
}

if (Detector.webgl) {                       // do stuff if we're WebGL compatible
    init();
    animate();
} else {
    Detector.addGetWebGLMessage();
}
