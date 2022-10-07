import Phaser, { Create } from "phaser";

export default class WinterAdventureScene extends
Phaser.Scene
{
    constructor()
    {
        super('winter-adventure-scene')
    }

    init(){
        this.platform = undefined
        this.player = undefined
        this.cursors = undefined
        this.candy = undefined
        this.score = 0;
        this.scoreText = undefined
        this.ghost = undefined;
    }
    preload()
    {
        this.load.image('background','images/background.jpg')
        this.load.image('platform','images/platform.png')
        this.load.spritesheet('dude','images/Dude.png', {
            frameWidth : 192/6, frameHeight: 32/1
        })
        this.load.image('ghost', 'images/ghost.png')
        this.load.image('candy', 'images/Candy.png')
        this.load.image('ghost', 'images/ghost.png')
    }
    create()
    {
        this.add.image(400,300,'background')
        this.platform = this.physics.add.staticGroup()
       this.platform.create(600,400,'platform').setScale(0.7).refreshBody()
        this.platform.create(50,250,'platform').setScale(0.7).refreshBody()
        this.platform.create(750,220,'platform').setScale(0.7).refreshBody()
        this.platform.create(400,568,'platform').setScale(1.5).refreshBody()
        this.player = this.physics.add.sprite(100,450,'Dude')
        this.player.setCollideWorldBounds(true)
        this.player.setBounce(0.2)
        this.player.setScale(1.5)
        this.cursors = this.input.keyboard.createCursorKeys();
        this.anims.create({
            key : "left",
            frames : this.anims.generateFrameNumbers(`dude`, {
                start : 0,
                end : 4
            }),
            frameRate : 10,
            repeat: -1
        })
        this.anims.create({
            key : "turn",
            frames : [{key : `dude`, frame : 5}],
            frameRate : 20
        })
        this.physics.add.collider(this.player, this.platform);
        this.candy = this.physics.add.group({
            key : 'candy', 
            repeat : 11,
            setXY : {
                x : 12,
                y : 0,
                stepX : 70
            },
        })
        this.scoreText = this.add.text(16,16, `Score : 0` , {
            fontSize : `32px`,
            color : `black`
        })
        this.candy.children.iterate((child) => {
            child.setScale(0.2);
            child.setBounceY(Phaser.Math.FloatBetween(0.4,0.8));
          });
          this.ghost = this.physics.add.group();
        this.physics.add.collider(this.candy, this.platform);
        this.physics.add.overlap(this.player,this.candy, this.getCandy, null, this);
        this.physics.add.collider(this.ghost, this.platform);
        this.physics.add.collider(this.player, this.ghost, this.lose, null, this);
    }

    lose(player, ghost){
        this.physics.pause();
        player.setTint(0xff0000);
        player.anims.play(`turn`);
        this.gameOver = true;
    }
    getCandy(player, candy){
        candy.disableBody(true,true);
        this.score += 10;
        this.scoreText.setText(`Score : ${this.score}`);

        if(this.candy.countActive(true) === 0 ){
            this.candy.children.iterate(function(child) {
                child.enableBody(true,
                    child.x,
                    0,
                    true,
                    true )
            })
        }
        var x = (player.x < 400)?
        Phaser.Math.Between(400,800) :
        Phaser.Math.Between(0,400)

        if(this.score % 40 == 0){
            var enemy = this.ghost.create(x, 0, `ghost`);
            enemy.setScale(0.1).refreshBody()
            enemy.setBounce(1)
            enemy.setCollideWorldBounds(true)
            enemy.setVelocity(Phaser.Math.Between(20,40)),20;
        }
        
    }
    update(){
        if(this.cursors.left.isDown){
            this.player.setVelocityX(-160);
            this.player.anims.play("left", true);
            this.player.setFlipX(true);
        }else if(this.cursors.right.isDown){
            this.player.setVelocityX(160);
            this.player.anims.play("left", true);
            this.player.setFlipX(false);
        }else{
            this.player.setVelocityX(0);
            this.player.anims.play(`turn`);
        }
 
        if(this.cursors.up.isDown){
            this.player.setVelocityY(-250);
        }
    }
}