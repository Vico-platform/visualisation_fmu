class VisualizationApp {

    constructor() {

        let that = this
        this.water = undefined
        this.objects = {}
        this.trailObjects = []
        this.MAX_LINE_POINTS = 5000
        this.container = document.getElementById('canvas')

        this.updateStats = new Stats()
        this.updateStats.showPanel(1)
        this.updateStats.domElement.style.position = 'absolute'
        document.getElementById('updateStats').appendChild(this.updateStats.dom)

        this.fpsStats = new Stats()
        this.fpsStats.domElement.style.position = 'absolute'
        document.getElementById('fpsStats').appendChild(this.fpsStats.dom)

        this.clock = new THREE.Clock()

        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color("aliceblue")
        this.scene.add(new THREE.AmbientLight())

        this.camera = new THREE.PerspectiveCamera(75, this.container.clientWidth / this.container.clientHeight, 0.1, 1000);
        this.camera.position.set(50, 50, 50)

        this.renderer = new THREE.WebGLRenderer({antialiasing: true});
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.container.appendChild(this.renderer.domElement);

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);

        const socket = new WebSocket('ws://' + window.location.hostname + ':9090');

        socket.addEventListener('open', function (event) {
            console.log("Websocket connection opened..")
            send(socket, "subscribe")
        });

        socket.addEventListener('close', function (event) {
            console.log("Websocket connection closed..")
        });

        socket.addEventListener('message', function (event) {
            let obj;
            let payload = JSON.parse(event.data)
            console.log(payload)
            const action = payload.action

            switch (action) {
                case "add":
                    that.setup([payload.data])
                    break
                case "remove":
                    obj = that.objects[payload.data]
                    that.scene.remove(obj)
                    break
                case "setup":
                    that.setup(payload.data)
                    const id = setInterval(function () {
                        if (!send(socket, "update")) {
                            clearInterval(id)
                        }
                    }, 50)
                    break
                case "update":
                    that.update(payload.data)
                    that.updateStats.update()
                    break
                case "visibilityChanged":
                    obj = that.objects[payload.data.name]
                    obj.visible = payload.data.visible
                    break
                case "wireframeChanged":
                    obj = that.objects[payload.data.name]
                    obj.traverse(function (o) {
                        if (o instanceof THREE.Mesh) {
                            o.material.wireframe = payload.data.wireframe
                        }
                    })
                    break
                case "colorChanged":
                    obj = that.objects[payload.data.name]
                    obj.traverse(function (o) {
                        if (o instanceof THREE.Mesh) {
                            o.material.color.setHex(payload.data.color)
                        }
                    })
                    break
            }

        });

        this.updateProjectionMatrix = function () {
            that.camera.aspect = that.container.offsetWidth / that.container.offsetHeight
            that.camera.updateProjectionMatrix()
        }

        let onWindowResize = function () {
            that.updateProjectionMatrix()
            that.renderer.setSize(that.container.offsetWidth, that.container.offsetHeight)
        }

        window.addEventListener('resize', onWindowResize, false);

    }

    setup(transforms) {

        let mat;
        console.log(transforms)

        for (let key in transforms) {

            const transform = transforms[key]

            let obj = new THREE.Object3D()
            obj.name = entity.name

            obj.position.x = transform.position.x
            obj.position.y = transform.position.y
            obj.position.z = transform.position.z

                //     case "geometry":
                //         obj.visible = data.visible
                //         mat = new THREE.MeshBasicMaterial({
                //             color: data.color,
                //             wireframe: data.wireframe
                //         })
                //         if (data.opacity < 1) {
                //             mat.opacity = data.opacity
                //             mat.transparent = true
                //         }
                //         createMesh(data.shape, mat, function (mesh) {
                //             mesh.matrixAutoUpdate = false
                //             if (data.offset) {
                //                 mesh.matrix.elements = data.offset
                //             }
                //             obj.add(mesh)
                //         })
                //         break
                //     case "water":
                //         const waterGeometry = new THREE.PlaneGeometry(data.width, data.height);
                //         this.water = new THREE.Water(
                //             waterGeometry,
                //             {
                //                 textureWidth: 512,
                //                 textureHeight: 512,
                //                 waterNormals: new THREE.TextureLoader().load('/textures/waternormals.jpg', function (texture) {
                //                     texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                //                 }),
                //                 alpha: 1.0,
                //                 sunDirection: new THREE.Vector3(),
                //                 sunColor: 0xffffff,
                //                 waterColor: 0x001e0f,
                //                 distortionScale: 3.7,
                //                 fog: this.scene.fog !== undefined
                //             }
                //         );
                //
                //         this.water.rotation.x = -Math.PI / 2;
                //         obj.add(this.water)
                //         break
                //     case "camera":
                //         this.camera.fov = data.fov
                //         this.camera.position.x = components["transform"].position.x
                //         this.camera.position.y = components["transform"].position.y
                //         this.camera.position.z = components["transform"].position.z
                //         this.controls.update()
                //         this.updateProjectionMatrix()
                //         break
                //     case "trail":
                //         mat = new THREE.LineBasicMaterial({
                //             color: data.color
                //         })
                //         obj.userData.trail = {
                //             "points": [],
                //             "mat": mat,
                //             "line": undefined
                //         }
                //         this.trailObjects.push(obj)
                //         break
                // }
            // }

            this.scene.add(obj)
            this.objects[transform.name] = obj
        }
        this.update(transforms)
    }

    update(transforms) {
        for (let key in transforms) {
            const transform = transforms[key]
            let obj = this.objects[transform.name]
            if (obj) {

                obj.position.x = transform.position.x
                obj.position.y = transform.position.y
                obj.position.z = transform.position.z
                // obj.quaternion.x = data.quaternion.x
                // obj.quaternion.y = data.quaternion.y
                // obj.quaternion.z = data.quaternion.z
                // obj.quaternion.w = data.quaternion.w

            }
        }
    }

    animate = () => {
        requestAnimationFrame(this.animate);
        if (this.water) {
            this.water.material.uniforms['time'].value += 1.0 / 60.0;
        }
        const elapsed = this.clock.getElapsedTime()
        if (elapsed > 1.0 / 20) {
            for (let i = 0; i < this.trailObjects.length; i++) {
                const trailObject = this.trailObjects[i]
                const trail = trailObject.userData.trail
                const points = trail.points
                points.push(trailObject.position.clone())

                if (points.length < 2) continue
                if (points.length > this.MAX_LINE_POINTS) {
                    points.shift()
                }

                const geometry = new THREE.BufferGeometry().setFromPoints(points)
                if (trail.line !== undefined) {
                    trail.line.geometry.dispose()
                    trail.line.geometry = geometry
                    geometry.attributes.position.needsUpdate = true
                } else {
                    console.log(points)
                    trail.line = new THREE.Line(geometry, trail.mat)
                    this.scene.add(trail.line)
                }
            }
            this.clock.start()
        }
        this.renderer.render(this.scene, this.camera)
        this.fpsStats.update()
    };

}