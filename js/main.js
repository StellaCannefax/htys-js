var stats, scene, renderer, composer;
var camera, cameraControl;
var cubes = [];

var randomIntTable = [];
for (var i = 1e4, randomIntTable = []; i--;) {
    var negative = 1;
    if (Math.random() > .5) { negative = -1;};
    randomIntTable.push((Math.random() * 43 | 0) * negative);
}
function randomInt() {
    return ++i >= randomIntTable.length ? randomIntTable[i = 0] : randomIntTable[i];
}

function shuffle() {
    var chance = 0.1;
    scene.traverse(function (object3d, i) {
        if (object3d instanceof THREE.Mesh === false) return
        if (Math.random() < chance) {
            object3d.position = new THREE.Vector3(randomInt(), randomInt(), randomInt());
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
            preserveDrawingBuffer: true	// to allow screenshot
        });
        renderer.setClearColor(0xbbbbbb);
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

    // create a scene
    scene = new THREE.Scene();

    // put a camera in the scene
    var cameraH = 3;
    var cameraW = cameraH / window.innerHeight * window.innerWidth;
    camera = new THREE.PerspectiveCamera(-cameraW / 2, +cameraW / 2, cameraH / 2, -cameraH / 2, -10000, 10000);
    camera.position.set(0, 0, 500);
    scene.add(camera);

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

    // here you add your objects
    // - you will most likely replace this part by your own
    var light = new THREE.AmbientLight(Math.random() * 0xffffff);
    scene.add(light);
    var light = new THREE.DirectionalLight(Math.random() * 0xffffff);
    light.position.set(Math.random(), Math.random(), Math.random()).normalize();
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
    var light = new THREE.PointLight(Math.random() * 0xffffff);
    light.position.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5)
                .normalize().multiplyScalar(1.2);
    scene.add(light);
    var light = new THREE.PointLight(Math.random() * 0xffffff);
    light.position.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5)
                .normalize().multiplyScalar(1.2);
    scene.add(light);

    for (var i = 1 ; i <= 200; i++) {
        var geometry = new THREE.BoxGeometry(2, 2, 2);
        var material = new THREE.MeshPhongMaterial({ ambient: 0x888880, color: Math.random() * 0xffffff });
        var mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);
        mesh.position = new THREE.Vector3(randomInt(), randomInt(), randomInt());
    }
    for (var i = 1 ; i <= 360; i++) {
        var geometry = new THREE.BoxGeometry(1, 1, 1);
        var material = new THREE.MeshPhongMaterial({ ambient: 0x808080, color: Math.random() * 0xffffff });
        var mesh = new THREE.Mesh(geometry, material);
        cubes.push(mesh);
        scene.add(mesh);
        mesh.position = new THREE.Vector3(randomInt(), randomInt(), randomInt());
    }
    for (var i = 1 ; i <= 420; i++) {
        var geometry = new THREE.BoxGeometry(.5, .5, .5);
        var material = new THREE.MeshPhongMaterial({ ambient: 0x888880, color: Math.random() * 0xffffff });
        var mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);
        mesh.position = new THREE.Vector3(randomInt(), randomInt(), randomInt());
    }
    for (var i = 1 ; i <= 420; i++) {
        var geometry = new THREE.BoxGeometry(.333, .333, .333);
        var material = new THREE.MeshPhongMaterial({ ambient: 0x888880, color: Math.random() * 0xffffff });
        var mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);
        mesh.position = new THREE.Vector3(randomInt(), randomInt(), randomInt());
    }
    for (var i = 1 ; i <= 420; i++) {
        var geometry = new THREE.BoxGeometry(.25, .25, .25);
        var material = new THREE.MeshPhongMaterial({ ambient: 0x888880, color: Math.random() * 0xffffff });
        var mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);
        mesh.position = new THREE.Vector3(randomInt(), randomInt(), randomInt());
    }
    for (var i = 1 ; i <= 666; i++) {
        var geometry = new THREE.BoxGeometry(.2, .2, .2);
        var material = new THREE.MeshPhongMaterial({ ambient: 0x888880, color: Math.random() * 0xffffff });
        var mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);
        mesh.position = new THREE.Vector3(randomInt(), randomInt(), randomInt());
    }
}

// animation loop
function animate() {

    // loop on request animation loop
    // - it has to be at the begining of the function
    // - see details at http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
    requestAnimationFrame(animate);

    // do the render
    render();

    // update stats
    stats.update();
}

// render the scene
function render() {
    // variable which is increase by Math.PI every seconds - usefull for animation
    var PIseconds = Date.now() * Math.PI;

    // update camera controls
    cameraControls.update();

    // animation of all objects
    scene.traverse(function (object3d, i) {
        if (object3d instanceof THREE.Mesh === false) return
        object3d.rotation.y = PIseconds * 0.0003 * (i % 2 ? 1 : -1);
        object3d.rotation.x = PIseconds * 0.0002 * (i % 2 ? 1 : -1);
    })
    // animate DirectionalLight
    /*scene.traverse(function (object3d, idx) {
        if (object3d instanceof THREE.DirectionalLight === false) return
        var ang = 0.0005 * PIseconds * (idx % 2 ? 1 : -1);
        object3d.position.set(Math.cos(ang), Math.sin(ang), Math.cos(ang * 2)).normalize();
    })*/
    // animate PointLights
    scene.traverse(function (object3d, idx) {
        if (object3d instanceof THREE.PointLight === false) return
        var angle = 0.0005 * PIseconds * (idx % 2 ? 1 : -1) + idx * Math.PI / 3;
        object3d.position.set(Math.cos(angle) * 3, Math.sin(angle * 3) * 2, Math.cos(angle * 2)).normalize().multiplyScalar(2);
    })

    // actually render the scene
    renderer.render(scene, camera);
}