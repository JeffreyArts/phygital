import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"


export interface vpg3dRenderer extends THREE.WebGLRenderer {
    destroyed: boolean
}

const view3D  = {
    init: (opts = {} as any) => {
        const dimensions = {
            width: 36,
            height: 36,
            depth: 36
        }

        const renderer = new THREE.WebGLRenderer({
            alpha: true,
            powerPreference: "low-power",
            antialias: true
        }) as vpg3dRenderer
        // if (window.innerWidth > window.innerHeight) {
            
        //     renderer.setSize( window.innerWidth*.8, window.innerHeight*.8 )
        // } else {

        //     renderer.setSize( window.innerWidth*.8, window.innerHeight*.8 )
        // }
        // renderer.shadowMapEnabled = true;
        // renderer.shadowMapType = THREE.PCFSoftShadowMap;

        const scene             = new THREE.Scene()
        const camera            = new THREE.PerspectiveCamera( 35, 1, 0.1, 1000 )
        camera.position.set( 0, 8, 0)
        camera.lookAt( 0, 0, 0)

        const cameraHelper = new THREE.CameraHelper(camera)
        // scene.add(cameraHelper)
        // Lights
        const ambientLight      = new THREE.AmbientLight( "#fffaea", .2)
        const spotLight         = new THREE.SpotLight("#fff", .64, 0 ,Math.PI/360*100 ,0,2)

        spotLight.castShadow = true
        spotLight.shadow.mapSize.width = 1024 // default
        spotLight.shadow.mapSize.height = 1024

        spotLight.position.x = dimensions.width
        spotLight.position.y = dimensions.height
        spotLight.position.z = dimensions.depth/2
        spotLight.lookAt(0,0,0)
        const spotLight2 = spotLight.clone()
        spotLight.position.x -= dimensions.width*2
        spotLight.position.z -= dimensions.depth
        spotLight.lookAt(0,0,0)


        scene.add(ambientLight, spotLight,spotLight2)


        function animate() {
            // if mouse down
            if (renderer.destroyed) {
                return
            }
            
            requestAnimationFrame( animate )
            renderer.render(scene, camera)
        }
        animate()
        let orbitControls = undefined
        
        if (opts.orbitControls) {
            orbitControls = new OrbitControls( camera, renderer.domElement )
        }

        const results = {
            scene: scene,
            renderer:renderer,
            camera: camera,
        } as {
            scene: THREE.Scene,
            renderer: vpg3dRenderer,
            camera: THREE.PerspectiveCamera,
            orbitControls?: any
        }
        
        if (orbitControls) {
            results.orbitControls = orbitControls
        }
        return results as {
            scene: THREE.Scene,
            renderer: vpg3dRenderer,
            camera: THREE.PerspectiveCamera,
            orbitControls?: any
        }
    },
}

export default view3D