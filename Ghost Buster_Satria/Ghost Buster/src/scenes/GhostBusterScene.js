import Phaser from 'phaser'

var player
export default class GhostBusterScene extends
Phaser.Scene
{
constructor()
{
 super('ghost-buster-scene')
}
init()
{
    this.player = undefined
    this.ground = undefined
    this.speed = 100;
    this.cursors = undefined
    this.bomb = undefined
    this.shoot = false
}
preload()
{
    this.load.image('background', 'images/background.png')
    this.load.spritesheet(`player`, `images/player.png`, {
        frameWidth : 32, frameHeight : 32
    })

    this.load.spritesheet('ground','images/ground.png',{
        frameWidth:32, frameHeight:32
    })
    this.load.image('ghost','images/ghost.png')
    this.load.image('bomb','images/bomb.png')
    this.load.image('enemy','images/enemy.png')
    this.load.image('gameover','images/gameover.png')
    this.load.image('replay','images/replay.png')
}
create()
{
    this.player = this.createPlayer()
    const gameWidth = this.scale.width * 0.5
    const gameheight = this.scale.width * 0.5
    this.add.image(gameWidth, gameheight, 'background')
    this.ground = this.physics.add.staticImage(gameWidth, this.scale.height -10, `ground`).setOffset(0.35);
    this.player = this.physics.add.sprite(100,450, 'player')
    this.physics.add.collider(this.ground,this.player)
    this.player.setBounce(0.2)
    this.cursors = this.input.keyboard.createCursorKeys()
}
update(time)
{
 this.movePlayer(this.player, time)
}
createPlayer()
{
    const player = this.physics.add.sprite(250, 250, `player`);
    player.setCollideWorldBounds(true);

    this.anims.create({
        key : `stanby`, 
        frames : this.anims.generateFrameNumbers(`player`,{
            start : 0, end : 2
        }),
        frameRate : 10
    })

    return player;
}

movePlayer(player, time)
{
    if (this.cursors.left.isDown){
        this.player.setVelocityX(this.speed * -1)
        this.player.anims.play('left', true) 
        this.player.setFlipX(false)
        //this.sound.play(`move`)
   }else if  (this.cursors.right.isDown){
    this.player.setVelocityX(this.speed)
    this.player.anims.play('right', true)
    this.player.setFlipX(true)
    //this.sound.play(`move`)
   }
   else {
    this.player.setVelocityX(0)
    this.player.anims.play('turn')
    }

    if ((this.shoot || this.cursors.space.isDown) && time > this.lastFired){
       const laser = this.get(0, 0,'bomb')
       if(this.bomb){
           this.bomb.fire(this.player.x, this.player.y)
           this.lastFired = time + 150
            this.sound.play('laserSound')
        }
}
}

}

