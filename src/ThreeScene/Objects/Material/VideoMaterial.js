import Experience from "../../Experience";
import * as THREE from 'three'

export default class VideoMaterial {
  constructor()
  {
    this.experience = new Experience()
    this.resources = this.experience.resources
    this.vid = this.experience.videoEl
    this.material = null

    this.setMaterial()
  }

  setMaterial()
  {
    this.texture = new THREE.VideoTexture(this.vid)
    this.texture.flipY = false

    this.texture.minFilter = THREE.LinearFilter
    this.texture.magFilter = THREE.LinearFilter

    this.material = new THREE.MeshBasicMaterial({
      map: this.texture,
      side: THREE.FrontSide,
      toneMapped: false
    })
  }
}