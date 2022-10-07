import Phaser from 'phaser'
export default class Laser extends Phaser.Physics.Arcade.Sprite{
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture)
        this.setScale(0.5)
        this.speed = 200
        
        
    }
fire(x,y){
    this.setPosition(x, y)
    this.setActive(true)
    this.setVisible(true)
}
erase()
{
    this.destroy()
}
update(time) 
{
    this.setVelocityX(this.speed )
    if(this.x> 2000) {
    this.erase()
    }
  }
}