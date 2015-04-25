songs.Slideways = new SongSettings(
    "audio/Slideways.mp3",
    {
        decay: 0.002,
        threshold: 0.32,
        frequency: [0, 5],
        onKick: function (mag) {
            //shuffle(.333);
            //moveUp(1.25);
            //Kaleido.uniform['sides'] += 1;
        }
    },
    [
        {
            time: 2,
            handler: function () {
                for (var i = 1 ; i <= 300; i++) {
                    var geometry = new THREE.BoxGeometry(.5, .5, .5);
                    var material = new THREE.MeshPhongMaterial({ ambient: 0x808080, color: Math.random() * 0xffffff });
                    var mesh = new THREE.Mesh(geometry, material);
                    cubes.push(mesh);
                    scene.add(mesh);
                    mesh.position = new THREE.Vector3(randomInt(), randomInt(), randomInt());
                }
            }
        }
    ]
);
