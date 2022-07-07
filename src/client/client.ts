import * as THREE from 'three'
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls'
import Stats from 'three/examples/jsm/libs/stats.module'

const scene = new THREE.Scene()
// scene.add(new THREE.AxesHelper(5))

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
)
camera.position.z = 4

// const renderer = new THREE.WebGLRenderer()
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setClearColor(0xFFFFFF)
renderer.setSize(window.innerWidth, window.innerHeight)
scene.fog = new THREE.Fog( 0xFFFFFF, 1, 7);
document.body.appendChild(renderer.domElement)

const controls = new TrackballControls(camera, renderer.domElement)

// Create geometry
var geom = new THREE.SphereGeometry( 2, 4, 4 );
const material = new THREE.MeshBasicMaterial({
    color: 0xdddddd,
    wireframe: true,
})

const mesh = new THREE.Mesh(geom, material);
mesh.position.set(0,0,0);
scene.add(mesh);

const labels: any = []

// Draw each vertex with style and labels
function drawVertices(mesh: THREE.Mesh, name: string) {

    const root      = new THREE.Object3D();

    var verts       = (mesh.geometry.attributes.position.array)
    const sph       = new THREE.SphereGeometry( 0.1, 16, 16 )
    const mat       = new THREE.MeshBasicMaterial( {color: 0xcccccc} )
    
    for (var i = 0; i < verts.length; i = i + 3)
    {
        const point = new THREE.Mesh( sph, mat )
        console.log("scene.add( cube )")
        root.add( point );
        point.translateX(verts[i])
        point.translateY(verts[i+1])
        point.translateZ(verts[i+2])

        const canvas        = makeLabelCanvas(name);
        const texture       = new THREE.CanvasTexture(canvas);
        texture.minFilter   = THREE.LinearFilter;
        texture.wrapS       = THREE.ClampToEdgeWrapping;
        texture.wrapT       = THREE.ClampToEdgeWrapping;
    
        const labelMaterial = new THREE.SpriteMaterial({
            map: texture,
            side: THREE.DoubleSide,
            transparent: true,
        });

        const label = new THREE.Sprite(labelMaterial);
        label.position.x = verts[i]
        label.position.y = verts[i + 1]
        label.position.z = verts[i + 2]
        
        label.scale.set(4, 1, 1)
        labels.push( label )
        root.add(label);
    }
    scene.add( root )
}

drawVertices(mesh, "Hello!");

function makeLabelCanvas(name: string) {
    const canvas        = document.createElement('canvas')
    const ctx           = canvas.getContext('2d')!
    ctx.canvas.width    = ctx.canvas.width * 2
    ctx.fillStyle       = "black"
    ctx.font            = 'bold 24px Helvetica'

    // Hack to move the text to the right of the center point
    ctx.fillText(name, 325, canvas.height / 2 + 10)
    
    // // for debugging
    // ctx.globalCompositeOperation = "destination-over";
    // ctx.fillStyle = "#00FFFF";
    // ctx.fillRect(0, 0, canvas.width, canvas.height)
    // ctx.globalCompositeOperation = "source-over"
    // ctx.lineWidth = 2
    // ctx.strokeStyle = "#FF0000"
    // ctx.strokeRect(0, 0, canvas.width, canvas.height)

    return ctx.canvas;
  }

// Boilerplate responsive and rendering
const stats = Stats()
document.body.appendChild(stats.dom)

window.addEventListener('resize', onWindowResize, false)
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    render()
}

// animate
function animate() {
    requestAnimationFrame(animate)

    // for (var i = 0; i < labels.length; i++)
    // {
    //     labels[i].material.opacity = labels[i].position.z
    // }
    render()
}

// render
function render() {
    controls.update()
    stats.update()
    renderer.render(scene, camera)
}


console.log (labels.length)
animate()