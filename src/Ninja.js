import World from "./World";
import * as THREE from "three";
import Light from "./Light";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import gsap from "gsap";

class Ninja {
  constructor() {
    const myDiv = document.createElement("div");
    myDiv.id = "myView";
    myDiv.innerHTML = "THE FORMER <span style='color:#9b1010ff'>RED</span> NINJA WRAPS IT UP";
    document.body.appendChild(myDiv);

    this.jumpFinished = true;

    this.world = new World({
      showCameraPos: false,
      setCameraPos: [0.1, 0.7, 8],
      showGrid: false,
      showAxes: false,
      ambientLight: true,
      orbitControl: false,
      showFloor: true,
    }); //end world

    //*** wall */
    const geometryWall = new THREE.PlaneGeometry(30, 10);
    const materialWall = new THREE.MeshPhongMaterial({
      color: 0xfff000,
      side: THREE.DoubleSide,
    });

    const wall = new THREE.Mesh(geometryWall, materialWall);
    wall.receiveShadow = true;
    wall.position.set(0, 5, -2);
    wall.rotation.x = 0;
    this.world.scene.add(wall);
    //** wall */

    new Light(this.world);

    const loader = new GLTFLoader();

    let modelAnim;

    loader.load("../assets/little_yellow.glb", (gltf) => {
      modelAnim = gltf.scene;
      modelAnim.position.set(0.1, 0.55, 3.5);
      modelAnim.rotation.y = 0.3;
      modelAnim.scale.set(0.4, 0.4, 0.4);

      modelAnim.traverse((n) => {

        if (n.isMesh) {
          n.castShadow = true;
          //n.receiveShadow = true;
         

          if (n.material) {
            n.material.metalness = 0.2; // fuldt metal
            n.material.roughness = 0;
            n.material.envMapIntensity = 1; // lidt blank
          }
        }
      });

      this.world.scene.add(modelAnim);

      this.mixer = new THREE.AnimationMixer(modelAnim);
      this.clips = gltf.animations;

      const clip = THREE.AnimationClip.findByName(this.clips, "breath");
      const breath = this.mixer.clipAction(clip);
      breath.timeScale = 1.5;
      breath.play();
    });

     this.world.interactionManager.add(this.world.scene);

  this.world.renderer.domElement.addEventListener("click", (event) => this.Jump(event, modelAnim));

    this.world.renderer.setAnimationLoop((time) => this.world.animation(time, this.mixer));
    //this.clock = new THREE.Clock();



  } //end constructor




  Jump(event, mesh) {

  const mouse = new THREE.Vector2();

      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
   // mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    console.log(mouse.x);


    if (this.jumpFinished) {
      if (this.actionJump) this.actionJump.reset();

      const clipJump = THREE.AnimationClip.findByName(this.clips, "jump");
      this.actionJump = this.mixer.clipAction(clipJump);
      this.actionJump.setLoop(THREE.LoopOnce);
      this.actionJump.play();

      gsap.to(mesh.position, {
        duration: 0.5,
        y: 1.5,
        repeat: 1,
        yoyo: true,
        ease: "Circ.easeInOut",
        onComplete: () => {
          this.jumpFinished = true;
        },
      });

      // rotation på X-aksen – bliver stående
      gsap.to(mesh.rotation, {
        duration: 0.5,
        x: mesh.rotation.x + Math.PI * 2,
        ease: "Circ.easeInOut",
      });
    }

    this.jumpFinished = false;
  }
}

export default Ninja;
