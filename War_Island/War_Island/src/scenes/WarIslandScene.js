import Phaser from 'phaser'
import Bullet from'../ui/Bullet.js'
import Enemy from '../ui/Enemy.js'
export default class WarIslandScene extends
Phaser.Scene
{
    constructor()
    {
        super('war-island-scene')
    }
    init(){
        this.player = undefined
        this.cursors = undefined
        this.speed = 150
        this.enemies = undefined
        this.enemySpeed = 60
        this.shoot = false
        this.bullet = undefined
        this.lastFired = 0
        this.scoreText = undefined
        this.score = 0
    }
    preload(){
        this.load.image('player', 'images/ship.png')
        this.load.image('bg', 'images/ocean.png')
        this.load.spritesheet('enemy', 'images/monster.png',
        {frameWidth: 288, frameHeight: 576/2})
        this.load.image('bullet', 'images/explode.png')

           
    }
    update(time){
        this.movePlayer(this.player, time)
    }
    create(){
        this.add.image(400,200, 'bg').setScale(2.4)
        this.player = this.createPlayer().setScale(0.6) 
        this.cursors = this.input.keyboard.createCursorKeys()
        this.bullet = this.physics.add.group({
            classType : Bullet,
            maxSize : 10,
            runChildUpdate: true
    })
    this.enemies = this.physics.add.group({
        classType : Enemy,
        maxSize : 10,
        runChildUpdate : true
    })
    this.time.addEvent({
        delay: 2000,
        callback: this.spawnEnemy,
        callbackScope: this,
        loop: true
    })
    this.physics.add.overlap(this.bullet, this.enemies, this.hitEnemy, null, this )
    this.scoreText = this.add.text(16, 16, 'score : 0', {
        fontSize: '32px', fill: 'yellow' 
    });
}
 createPlayer(){
    const player = this.physics.add.sprite(200, 450, 'player')
    player.setCollideWorldBounds(true)  
    return player
}
    movePlayer(player, time){
        if (this.cursors.left.isDown){
            this.player.setVelocityX(this.speed * -1)
        }else if (this.cursors.right.isDown){
            this.player.setVelocityX(this.speed)
        }else if(this.cursors.up.isDown){
            this.player.setVelocityY(this.speed * -1)
        }else if(this.cursors.down.isDown){
            this.player.setVelocityY(this.speed)
        }
        if ((this.shoot || this.cursors.space.isDown) && time > this.lastFired){
        const bullet = this.bullet.get(0, 0, 'bullet')
        if(bullet){
        bullet.fire(this.player.x, this.player.y)
        this.lastFired = time + 150
    }
   }
  }
  spawnEnemy(){
    
    const enemy = this.enemies.get(0,0,'enemy')
    if (enemy) {
    enemy.spawn(1300)
    }   
  }
  hitEnemy(bullet, enemy)
{
    bullet.erase()
    enemy.die()
    this.score+=10
    this.scoreText.setText('Score : '+ this.score)
}
}