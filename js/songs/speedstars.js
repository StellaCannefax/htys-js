// Speedstars, track 1
songs.Speedstars = new SongSettings(
    "audio/Speedstars.mp3",
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
    [
        {
            time: 2,
            handler: function () {
                for (var i = 1 ; i <= 100; i++) {
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
                for (var i = 1 ; i <= 140; i++) {
                    var geometry = new THREE.BoxGeometry(1, 1, 1);
                    var material = new THREE.MeshPhongMaterial({ ambient: 0x808080, color: Math.random() * 0xffffff });
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
                    var material = new THREE.MeshPhongMaterial({ ambient: 0x888880, color: Math.random() * 0xffffff });
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
                    var material = new THREE.MeshPhongMaterial({ ambient: 0x888880, color: Math.random() * 0xffffff });
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
                dancer.setInterval(function () { shuffle(0.1) }, 50);
            }
        },
        {
            time: 135.2,
            handler: dancer.clearAllIntervals
        }
    ]
);


