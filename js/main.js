var stats, scene, renderer, composer;
var rgbEffect, dotScreen, Kaleido, Edge;
var camera, cameraControl;
var currentSong, PIseconds;
var spheres = [];

var canvas = document.getElementsByTagName("canvas")[0];
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
var SongSettings = function (url, bpm, kickSettings, renderLoop, events) {  
    this.url = url;
    this.bpm = bpm;
    this.kick = dancer.createKick(kickSettings);
    this.events = events;
    this.renderLoop = renderLoop;
}

// extension methodS for dancer.js follow 
// feed this one a SongSettings object
dancer.startNewSong = function (song) {
    currentSong = song;
    this.load({ src: song.url });                
    song.events.forEach(function (event) {          
        dancer.onceAt(event.time, event.handler);   // register custom events    
    })
    song.kick.on();
    this.play();      
}

dancer.setInterval = function (func) {
    this.intervals.push(setInterval(func));
}

dancer.clearAllIntervals = function () {
    this.intervals.forEach(function (e) {
        clearInterval(e);       // stop all the shufflin'
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

function shuffle(chance) {
    scene.traverse(function (object3d, i) {
        if (object3d instanceof THREE.Mesh === false) return
        if (Math.random() < chance) {
            object3d.position = new THREE.Vector3(randomInt(), randomInt(), randomInt());
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

function shuffleTween() {
    var chance = 0.05;
    scene.traverse(function (object3d, i) {
        if (object3d instanceof THREE.Mesh === false) return
        if (Math.random() < chance) {
            newPosition = new THREE.Vector3(randomInt(), randomInt(), randomInt());
            moveObject(object3d, newPosition);
        }
    })
}
function addMultipleRandom(geometryType, count, size) {
    for (var i = 1 ; i <= count; i++) {
        var geometry = new geometryType(size, size, size);
        var material = new THREE.MeshPhongMaterial({ ambient: 0x808080, color: Math.random() * 0xffffff });
        var mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);
        mesh.position = new THREE.Vector3(randomInt(), randomInt(), randomInt());
    }
}
function moveObject(object, targetPosition) {
    //TWEEN.removeAll();
    new TWEEN.Tween(object.position.x)
    .to(targetPosition.x, 2000)
    .easing(TWEEN.Easing.Elastic.InOut)
    .onUpdate(render)
    .start();
};

if (!init()) animate();

// init the scene
function init() {

    if (Detector.webgl) {
        renderer = new THREE.WebGLRenderer({
            antialias: true,	// to get smoother output
            preserveDrawingBuffer: true,	// to allow screenshot
            alpha: true                     // allow transparency
        });
        renderer.setClearColor(0x000000, 0);
    } else {
        Detector.addGetWebGLMessage();
        return true;
    }
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('container').appendChild(renderer.domElement);

    // add Stats.js - https://github.com/mrdoob/stats.js
    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.bottom = '0px';
    document.body.appendChild(stats.domElement);

    // TODO: break this out so we can create new scenes per song
    // create a scene
    scene = new THREE.Scene();

    // put a camera in the scene
    var cameraH = 3;
    var cameraW = cameraH / window.innerHeight * window.innerWidth;
    camera = new THREE.PerspectiveCamera(-cameraW / 2, +cameraW / 2, cameraH / 2, -cameraH / 2, -10000, 10000);
    camera.position.set(0, 0, 460);
    scene.add(camera);

    composer = new THREE.EffectComposer(renderer);
    composer.addPass(new THREE.RenderPass(scene, camera));

    dotScreen = new THREE.ShaderPass(THREE.DotScreenShader);
    dotScreen.uniforms['scale'].value = 4;
    composer.addPass(dotScreen);

    Kaleido = new THREE.ShaderPass(THREE.KaleidoShader);
    Kaleido.uniforms['sides'].value = 4;
    composer.addPass(Kaleido);

    //Edge = new THREE.ShaderPass(THREE.EdgeShader2);
    //Edge.uniforms['tDiffuse'].value = 20;
    //composer.addPass(Edge);

    rgbEffect = new THREE.ShaderPass(THREE.RGBShiftShader);
    rgbEffect.uniforms['amount'].value = 0.0033;
    rgbEffect.renderToScreen = true;
    composer.addPass(rgbEffect);

    // create a camera contol
    cameraControls = new THREEx.DragPanControls(camera)

    // transparently support window resize
    THREEx.WindowResize.bind(renderer, camera);
    // allow 'p' to make screenshot
    THREEx.Screenshot.bindKey(renderer);
    // allow 'f' to go fullscreen where this feature is supported
    if (THREEx.FullScreen.available()) {
        THREEx.FullScreen.bindKey();
        document.getElementById('inlineDoc').innerHTML += "- <i>f</i> for fullscreen";
    }

    var light = new THREE.AmbientLight(Math.random() * 0xffffff);
    scene.add(light);
    var light = new THREE.DirectionalLight(Math.random() * 0xffffff);
    light.position.set(Math.random(), Math.random(), Math.random()).normalize();
    scene.add(light);
    var light = new THREE.DirectionalLight(Math.random() * 0xffffff);
    light.position.set(Math.random(), Math.random(), Math.random()).normalize();
    scene.add(light);
    var light = new THREE.PointLight(Math.random() * 0xffffff);
    light.position.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5)
                .normalize().multiplyScalar(1.2);
    scene.add(light);
    /*var light = new THREE.PointLight(Math.random() * 0xffffff);
    light.position.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5)
                .normalize().multiplyScalar(1.2);
    scene.add(light);*/
    /*var light = new THREE.PointLight(Math.random() * 0xffffff);
    light.position.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5)
                .normalize().multiplyScalar(1.2);
    scene.add(light);*/

    for (var i = 1 ; i <= 240; i++) {
        var geometry = new THREE.BoxGeometry(.333, .333, .333);
        var material = new THREE.MeshLambertMaterial({ ambient: 0x888880, color: Math.random() * 0xffffff });
        var mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);
        mesh.position = new THREE.Vector3(randomInt(), randomInt(), randomInt());
    }
    for (var i = 1 ; i <= 200; i++) {
        var geometry = new THREE.BoxGeometry(.25, .25, .25);
        var material = new THREE.MeshLambertMaterial({ ambient: 0x888880, color: Math.random() * 0xffffff });
        var mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);
        mesh.position = new THREE.Vector3(randomInt(), randomInt(), randomInt());
    }
    for (var i = 1 ; i <= 200; i++) {
        var geometry = new THREE.BoxGeometry(.2, .2, .2);
        var material = new THREE.MeshLambertMaterial({ ambient: 0x888880, color: Math.random() * 0xffffff });
        var mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);
        mesh.position = new THREE.Vector3(randomInt(), randomInt(), randomInt());
    }

    // dat.gui code
    var gui = new dat.GUI();
    gui.add(rgbEffect.uniforms['amount'], 'value').name("RGB Shift value").listen();
    gui.add(dotScreen.uniforms['scale'], 'value').name("Dot Screen scale").listen();
    gui.add(Kaleido.uniforms['angle'], 'value').name("Kaledioscope angle").listen();
    gui.add(Kaleido.uniforms['sides'], 'value').name("Kaledioscope sides")
        .min(3).max(12).step(1).listen();
}

// animation loop
function animate() {
    requestAnimationFrame(animate);
    render();
    stats.update();
}

// render the scene
function render() {
    // variable which is increase by Math.PI every seconds - usefull for animation
    PIseconds = Date.now() * Math.PI;
    cameraControls.update();
    //song-specific code that goes in the render loop
    if (currentSong != null) {
        currentSong.renderLoop();    
    }
    // actually render the scene
    composer.render(scene, camera);
}