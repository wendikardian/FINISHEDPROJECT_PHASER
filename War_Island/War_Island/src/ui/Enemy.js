import Phaser from 'phaser'
export default class FallingObject extends Phaser.Physics.Arcade.Sprite
{
   constructor(scene, x, y, texture)
{
   super(scene, x, y, texture)
   this.scene = scene
   this.speed = 60
}
   spawn(y) {
   const positionY = Phaser.Math.Between(0, 500)
   this.setPosition(y, positionY)
   this.setActive(true)
   this.setVisible(true)
   
}
   die() {
   this.destroy()
}
   update(time) {
   this.setVelocityX(-1 * this.speed)

    if (this.x < 0) {
    this.die()
  }
 }
}