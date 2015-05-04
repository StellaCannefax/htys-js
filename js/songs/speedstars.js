// Speedstars, track 1
songs.Speedstars = new SongSettings(
    "audio/Speedstars.mp3",
    128,    
    {
        decay: 0.002,
        threshold: 0.32,
        frequency: [0, 4],
        onKick: function (mag) {
            //shuffle(.333);
            moveUp(1.25);
            //Kaleido.uniform['sides'] += 1;
        }
    },
    function () {
        // hook into the FFT of the song
        if (dancer.isPlaying()) {
            renderer.setClearColor(dancer.getFrequency(160, 420) / 64 * 0xffffff, 0.333);
            rgbEffect.uniforms['amount'].value = dancer.getFrequency(60, 80) * 4.20 * 1.5 - 0.005;
            rotationSpeed = 0.005 + dancer.getFrequency(0, 5);
            dotScreen.uniforms['scale'].value = 15 - dancer.getFrequency(80, 100) * 420;
            // clamp angle values for kaledioscope
            if (Kaleido.uniforms['angle'] >= 360) {
                Kaleido.uniforms['angle'] -= 360;
            }
            //if (rotationSpeed < 0.08) { rotationSpeed = 0.005; }
            Kaleido.uniforms['angle'].value += rotationSpeed;
        }
        // animation of all objects
        scene.traverse(function (object3d, i) {
            if (object3d instanceof THREE.Mesh === false) return
            object3d.rotation.y = PIseconds * 0.0005 * (i % 2 ? 1 : -1);
            object3d.rotation.x = PIseconds * 0.0004 * (i % 2 ? 1 : -1);
            object3d.position.z += 1;
        });
        // animate PointLights
        scene.traverse(function (object3d, idx) {
            if (object3d instanceof THREE.PointLight === false) return
            var angle = 0.0005 * PIseconds * (idx % 2 ? 1 : -1) + idx * Math.PI / 3;
            object3d.position.set(Math.cos(angle) * 3, Math.sin(angle * 3) * 2, Math.cos(angle * 2))
                .normalize().multiplyScalar(2);
        });
    },
    [
        {
            time: 2,
            handler: function () {
                for (var i = 1 ; i <= 40; i++) {
                    var geometry = new THREE.BoxGeometry(.5, .5, .5);
                    var material = new THREE.MeshPhongMaterial({ ambient: 0x808080, color: Math.random() * 0xffffff });
                    var mesh = new THREE.Mesh(geometry, material);
                    scene.add(mesh);
                    mesh.position = new THREE.Vector3(randomInt(), randomInt(), randomInt());
                }
            }
        },
        {
            time: 7.5,
            handler: function () {
                dancer.setInterval(function () { shuffle(0.05) }, 100);
                for (var i = 1 ; i <= 80; i++) {
                    var geometry = new THREE.BoxGeometry(1, 1, 1);
                    var material = new THREE.MeshLambertMaterial({ ambient: 0x808080, color: Math.random() * 0xffffff });
                    var mesh = new THREE.Mesh(geometry, material);
                    scene.add(mesh);
                    mesh.position = new THREE.Vector3(randomInt(), randomInt(), randomInt());
                }
            }
        },
        {
            time: 22.5,
            handler: function () {
                for (var i = 1 ; i <= 80; i++) {
                    var geometry = new THREE.BoxGeometry(2, 2, 2);
                    var material = new THREE.MeshLambertMaterial({ ambient: 0x888880, color: Math.random() * 0xffffff });
                    var mesh = new THREE.Mesh(geometry, material);
                    scene.add(mesh);
                    mesh.position = new THREE.Vector3(randomInt(), randomInt(), randomInt());
                }
            }
        },
        {
            time: 60,
            handler: function () {
                for (var i = 1 ; i <= 80; i++) {
                    var geometry = new THREE.SphereGeometry(1);
                    var material = new THREE.MeshLambertMaterial({ ambient: 0x888880, color: Math.random() * 0xffffff });
                    var mesh = new THREE.Mesh(geometry, material);
                    scene.add(mesh);
                    mesh.position = new THREE.Vector3(randomInt(), randomInt(), randomInt());
                }
            }
        },
        {
            time: 104.5,
            handler: function () {
                //$("canvas").toggleClass("wtf");
                dancer.setInterval(function () { shuffle(0.1) }, bpm2ms(currentSong.bpm) / 4);
            }
        },
        {
            time: 135.2,
            handler: dancer.clearAllIntervals
        }
    ],
    //setup
    function () {
        console.log("setting up / playing Speedstars...");
        for (var i = 1 ; i <= 200; i++) {
            var geometry = new THREE.BoxGeometry(1, 1, 1);
            var material = new THREE.MeshLambertMaterial({ ambient: 0x808080, color: Math.random() * 0xffffff });
            var mesh = new THREE.Mesh(geometry, material);
            scene.add(mesh);
            mesh.position = new THREE.Vector3(randomInt(), randomInt(), randomInt());
        }
    }
);


