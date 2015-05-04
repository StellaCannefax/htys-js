songs.Slideways = new SongSettings({
    url: "audio/Slideways.mp3",
    bpm: 90,     
    kickSettings: {
        decay: 0.001,
        threshold: 0.55,
        frequency: [0, 5],
        onKick: function (mag) {
            console.log("kick event");
        }
    },
    renderLoop: function () {
        // hook into the FFT of the song
        if (dancer.isPlaying()) {
            renderer.setClearColor(dancer.getFrequency(160, 420) / 64 * 0xffffff, 0.333);
            rgbEffect.uniforms['amount'].value = dancer.getFrequency(60, 80) * 4.20 * 1.5 - 0.005;
            rgbEffect.uniforms['angle'].value = postFX.Kaleidoscope.uniforms['angle'].value * -6;
            rotationSpeed = 0.0025 + dancer.getFrequency(0, 5) / 3;
            dotScreen.uniforms['scale'].value = 15 - dancer.getFrequency(80, 100) * 420 * 2;
            // clamp angle values for kaledioscope
            if (postFX.Kaleidoscope.uniforms['angle'] >= 360) {
                postFX.Kaleidoscope.uniforms['angle'] -= 360;
            }
            if (rotationSpeed < 0.05) { rotationSpeed = 0.0025; }
            postFX.Kaleidoscope.uniforms['angle'].value += rotationSpeed;
        }
        // animation of all objects
        scene.traverse(function (object3d, i) {
            if (object3d instanceof THREE.Mesh === false) return
            object3d.rotation.y = PIseconds * 0.0005 * (i % 2 ? 1 : -1);
            object3d.rotation.x = PIseconds * 0.0004 * (i % 2 ? 1 : -1);
        });
        // animate PointLights
        scene.traverse(function (object3d, idx) {
            if (object3d instanceof THREE.PointLight === false) return
            var angle = 0.0005 * PIseconds * (idx % 2 ? 1 : -1) + idx * Math.PI / 3;
            object3d.position.set(Math.cos(angle) * 3, Math.sin(angle * 3) * 2, Math.cos(angle * 2))
                .normalize().multiplyScalar(2);
        });
    },
    events: [
        {
            time: 2.2,
            handler: function () {
                for (var i = 1 ; i <= 420; i++) {
                    var geometry = new THREE.BoxGeometry(.666, .666, .666);
                    var material = new THREE.MeshLambertMaterial({
                        ambient: 0x808080,
                        color: Math.random() * 0xffffff,
                        wireframe: true
                    });
                    var mesh = new THREE.Mesh(geometry, material);
                    scene.add(mesh);
                    mesh.position = new THREE.Vector3(randomInt(), randomInt(), randomInt());
                }
            }
        },
        {
            time: 11,
            handler: function () {
                dancer.setInterval(function () { shuffle(.08); }, bpm2ms(currentSong.bpm) / 4);
            }
        },
        {
            time: 43,
            handler: function () {
                postFX.Kaleidoscope.uniforms['sides'].value = 6;
            }
        },
        {
            time: 64,
            handler: function () {
                postFX.Kaleidoscope.uniforms['sides'].value = 8;
            }
        },
        {
            time: 79,
            handler: dancer.clearAllIntervals
        }
    ],
    setup: function(){
        //$("html").css("background-image", "url(" + )
    }
);
