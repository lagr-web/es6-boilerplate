import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { InteractionManager } from "three.interactive";

class World {
  
  constructor(settings = {}) {

 const defaults = {//defualt setting
      showCameraPos: false,
      setCameraPos: [0, 0, 0],
      showGrid: false,
      showAxes: false,
      ambientLight: false,
      orbitControl: false,
      showFloor: false
    };

    this.settings = { ...defaults, ...settings }; // spread operator ->merge og overskriver default til settings, hvis de eksisterer i settings (undgår undefined)
    

    console.log(this.settings);

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x000000);

    this.setupCamera();
    this.setupRenderer();
    this.setupControls();
    this.setupHelpers();
    this.setupLights();
    this.setupFloor();

    this.interactionManager = new InteractionManager(
      this.renderer,
      this.camera,
      this.renderer.domElement
    );

  
   // settings.useAnimationLoop && this.renderer.setAnimationLoop((time) => this.animation(time));
    this.clock = new THREE.Clock();

    window.addEventListener("resize", () =>
      this.onWindowResized(this.renderer, this.camera)
    );
  } //end constructor

  animation(time, mixer) {

     mixer && mixer.update(this.clock.getDelta());

     this.interactionManager && this.interactionManager.update(); // vigtigt!

     this.renderer.render(this.scene, this.camera);
  }

  onWindowResized() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  setupCamera() {
    this.camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.5,
      150
    );

    if (Array.isArray(this.settings.setCameraPos)) {
      this.camera.position.set(...this.settings.setCameraPos);
    }

    //this.camera.lookAt(this.scene.position);
    this.scene.add(this.camera);
  }

  setupRenderer() {

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ReinhardToneMapping;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);
    
  }

  setupControls() {

    if (!this.settings.orbitControl) return;

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    if (this.settings.showCameraPos) {
      this.controls.addEventListener("change", () => {

        const pos = this.controls.object.position;
        console.log(
          `Camera Position → x:${pos.x.toFixed(1)} y:${pos.y.toFixed(1)} z:${pos.z.toFixed(1)}`
        );

      });
    }
  }

  setupHelpers() {

    if (this.settings.showGrid) {
      const gridHelper = new THREE.GridHelper(20, 20);
      this.scene.add(gridHelper);
    }

    if (this.settings.showAxes) {
      const axesHelper = new THREE.AxesHelper(5);
      this.scene.add(axesHelper);
    }
  }

  setupLights() {
    if (this.settings.ambientLight) {
      const al = new THREE.AmbientLight(0xffffff, 0.5);
      this.scene.add(al);
    }
  }

  setupFloor() {

    if (!this.settings.showFloor) return;

    const geometryFloor = new THREE.PlaneGeometry(25, 20);
    const materialFloor = new THREE.MeshPhongMaterial({
      color: 0xFFF000,
      side: THREE.DoubleSide,
    });

    const floor = new THREE.Mesh(geometryFloor, materialFloor);
    floor.receiveShadow = true;
    floor.rotation.x = Math.PI / 2;
    this.scene.add(floor);
  }
}

export default World;
