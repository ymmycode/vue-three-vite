import * as THREE from 'three'
import {CSS3DObject} from 'three/examples/jsm/renderers/CSS3DRenderer'
import Experience from "../Experience";
import VideoMaterial from "./Material/VideoMaterial";

export default class Stage {
  constructor()
  {
    this.experience = new Experience()
    this.scene = this.experience.scene
    this.cssScene  = this.experience.cssScene
    this.resources = this.experience.resources
    this.stageModel = this.resources.items.stage

    this.debug = this.experience.debug

    this.stageScene = this.stageModel.scene
    this.screenPos = null

    this.scene.add(this.stageScene)

    this.setVideoTexture()
  }

  setVideoTexture()
  {
    this.screenStage = this.stageScene.children.find(child => child.name === "Layar")
    this.screenStage.material = new VideoMaterial().material

    // this.boundingBox = new THREE.Box3().setFromObject( this.screenStage  );
    // this.measure = new THREE.Vector3()
    // this.box = this.boundingBox.getSize(this.measure)
    // console.log(this.screenStage.position, this.measure)

    // this.screenPos = new THREE.Vector3()
    // this.screenPos.copy(this.screenStage.position)

    // this.createYoutubeVideo( 'byO-xihstdw');

    // if(this.debug)
    // {
    //   this.folder = this.debug.addFolder('locate')

    //   this.folder.add(this.cssobject.position, 'x', -20, 20, 0.001)
    // }
  }

  createYoutubeVideo (id) {

    this.div = document.createElement( 'div' );
    this.div.style.width = '480px';
    this.div.style.height = '360px';
    this.div.style.backgroundColor = '#000';
  
    this.iframe = document.createElement( 'iframe' );
    this.iframe.style.width = '100%';
    this.iframe.style.height = '100%';
    this.iframe.style.border = '0px';
    this.iframe.src = [ 'https://www.youtube.com/embed/', id, '?rel=0' ].join( '' );
    this.div.appendChild( this.iframe );
  
    this.cssobject = new CSS3DObject( this.div );
    // this.cssobject.position.copy( this.screenStage.position );
    this.cssobject.position.set( this.screenStage.position.x, this.screenStage.position.y, this.screenStage.position.z);
    this.cssobject.rotation.y = this.screenStage.rotation.y;
    this.cssobject.scale.set(0.005, 0.005, 0.005);
  
    this.cssScene.add(this.cssobject);
  
  }
}