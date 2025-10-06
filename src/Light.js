import gsap from "gsap";
import * as THREE from "three";

class Light {

  constructor(world) {

    const ligthBox = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    const ligtMaterial = new THREE.MeshNormalMaterial();

    const ligthMesh = new THREE.Mesh(ligthBox, ligtMaterial);
    ligthMesh.visible = false;
    ligthMesh.position.set(0, 0.5, 2.5);
    world.scene.add(ligthMesh);

    const spotlightDown = new THREE.SpotLight(0xffffff, 200);
    spotlightDown.position.set(1.5, 20, 7.5);
    spotlightDown.angle = 0.314; //spreading
    spotlightDown.penumbra = 0.4; //blur in my world
    //spotLightDown.decay=2;
    spotlightDown.distance = 0;
    spotlightDown.castShadow = true;
    spotlightDown.target = ligthMesh;
    //spotlightDown.shadow.bias = -0.0005;
    //spotlightDown.shadow.mapSize.width = 2048; // default
    //spotlightDown.shadow.mapSize.height = 2048; // default
    const slHelper = new THREE.SpotLightHelper(spotlightDown);
    //world.scene.add(slHelper);

    world.scene.add(spotlightDown);

    gsap.to(spotlightDown.position, {
      duration: 8,
      y: 0.3,
      repeat: -1,
      yoyo: true,
    });

    world.scene.add(new THREE.HemisphereLight(0x443333, 0x111122));
  }
}

export default Light;
