// Speedstars, track 1
songs.Speedstars = new SongSettings({
    url: "audio/Speedstars.mp3",
    bpm: 128,
    kickSettings: {
        decay: 0.002,
        threshold: 0.32,
        frequency: [0, 4],
        onKick: function (mag) {
            //shuffle(.333);
            //moveUp(1.25);
            //postFX.Kaleidoscope.uniform['sides'] += 1;
        }
    },
    renderLoop: function () {
        // hook into the FFT of the song
        if (dancer.isPlaying()) {
            // change background color
            renderer.setClearColor(dancer.getFrequency(160, 420) / songs.Speedstars.bgShiftDivider * 0xffffff, 0.333);

            postFX.rgbShift.uniforms['amount'].value = dancer.getFrequency(60, 80) * 4.20 - 0.01;
            postFX.rgbShift.uniforms['angle'].value = dancer.getFrequency(20, 40) * 200;
            rotationSpeed = 0.00333 + dancer.getFrequency(0, 5) / 2;
            postFX.DotScreen.uniforms['scale'].value = 15 - dancer.getFrequency(80, 100) * 420;
            // clamp angle values for kaledioscope
            if (postFX.Kaleidoscope.uniforms['angle'] >= 360) {
                postFX.Kaleidoscope.uniforms['angle'] -= 360;
            }
            //if (rotationSpeed < 0.08) { rotationSpeed = 0.005; }
            postFX.Kaleidoscope.uniforms['angle'].value += rotationSpeed;
        }
        // animation of all objects
        scene.traverse((object3d, i) => {
            if (object3d instanceof THREE.Mesh === false) return
            object3d.rotation.y = PIseconds * 0.0005 * (i % 2 ? 1 : -1);
            object3d.rotation.x = PIseconds * 0.0004 * (i % 2 ? 1 : -1);
            object3d.position.z += 1;
        });
        // animate PointLights
        scene.traverse((object3d, idx) => {
            if (object3d instanceof THREE.PointLight === false) return
            var angle = 0.0005 * PIseconds * (idx % 2 ? 1 : -1) + idx * Math.PI / 3;
            object3d.position.set(Math.cos(angle) * 3, Math.sin(angle * 3) * 2, Math.cos(angle * 2))
                .normalize().multiplyScalar(2);
        });
    },
    events: [
        {
            time: 2,
            handler: function () {
                setNewScreenRenderPass(postFX.badTV);
                songs.Speedstars.bgShiftDivider = 20;
                makeRandomGeometries([.5, .5, .5], 100, THREE.BoxGeometry, THREE.MeshPhongMaterial);
            }
        },
        {
            time: 7.5,
            handler: function () {
                setNewScreenRenderPass(postFX.Kaleidoscope);
                makeRandomGeometries([1, 1, 1], 80, THREE.BoxGeometry, THREE.MeshLambertMaterial);
                dancer.setInterval(() => { shuffle(0.025) }, 100);
            }
        },
        {
            time: 22.5,
            handler: function () {
                makeRandomGeometries([2, 2, 2], 80, THREE.BoxGeometry, THREE.MeshLambertMaterial);
                postFX.badTV.uniforms.distortion['value'] = 6;
                postFX.badTV.uniforms.distortion2['value'] = 30;
                postFX.hueSaturation.uniforms.saturation['value'] = 0.7;
            }
        },
        {
            time: 26.5,
            handler: function () {
                postFX.hueSaturation.uniforms.saturation['value'] = 0.6;
                postFX.Kaleidoscope.uniforms['sides'].value = 3;
                postFX.hueSaturation.uniforms.hue['value'] = -30;
            }
        },
        {
            time: 30.1,
            handler: function () {
                postFX.hueSaturation.uniforms.saturation['value'] = 0.7;
                postFX.Kaleidoscope.uniforms['sides'].value = 4;
            }
        },
        {
            time: 34,
            handler: function () {
                postFX.hueSaturation.uniforms.saturation['value'] = 0.6;
                postFX.Kaleidoscope.uniforms['sides'].value = 6;
            }
        },
        {
            time: 37.8,
            handler: function () {
                postFX.hueSaturation.uniforms.saturation['value'] = 0.7;
                postFX.Kaleidoscope.uniforms['sides'].value = 4;
            }
        },
        {
            time: 41.5,
            handler: function () {
                postFX.hueSaturation.uniforms.saturation['value'] = 0.6;
                postFX.Kaleidoscope.uniforms['sides'].value = 8;
            }
        },
        {
            time: 45.2,
            handler: function () {
                postFX.hueSaturation.uniforms.saturation['value'] = 0.75;
                postFX.Kaleidoscope.uniforms['sides'].value = 4;
            }
        },
        {
            time: 60,
            handler: function () {
                songs.Speedstars.bgShiftDivider = 64;
                setNewScreenRenderPass(postFX.rgbShift);
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
                postFX.Kaleidoscope.uniforms['sides'].value = 12;
                postFX.badTV.uniforms.distortion['value'] = 12;
                postFX.badTV.uniforms.distortion2['value'] = 42;
                dancer.setInterval(() => { shuffle(0.05) }, bpm2ms(currentSong.bpm) / 4);
            }
        },
        {
            time: 135.2,
            handler: dancer.clearAllIntervals
        }
    ],
    setup: function () {
        console.log("setting up / playing Speedstars...");
        makeRandomGeometries([1, 1, 1], 200, THREE.BoxGeometry, THREE.MeshLambertMaterial);
        setNewScreenRenderPass(postFX.hueSaturation);
    },
    // extra properties for speedstars
});
