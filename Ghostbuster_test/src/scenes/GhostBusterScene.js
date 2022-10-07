import Phaser from 'phaser';
import Bomb from '../UI/Bomb'
import Ghost from '../UI/Ghost';

export default class GhostBusterScene extends Phaser.Scene{
    constructor(){
        super(`ghost-buster-scene`);
    }

    init(){
        this.halfWidth = this.scale.width * 0.5;
        this.halfHeight = this.scale.height * 0.5;
        this.player = undefined;
        this.ground = undefined;
        this.ghost = undefined;
        this.bomb = undefined;
        this.cursors = undefined;
        this.speed = 100;
        this.lastFired = 0;
        this.score = 0;
        this.scoreText = undefined;
    }


    preload(){
        this.load.image('bg', `images/background.png`);
        this.load.image(`bomb`, `images/bomb.png`);
        this.load.image(`enemy`, `images/enemy.png`);
        this.load.image(`ghost`, `images/ghost.png`);
        this.load.image(`ground`, `images/ground.png`);
        this.load.spritesheet(`player`, `images/player.png`, {
            frameWidth : 32, frameHeight : 32
        })
    }

    create(){
        this.add.image(this.halfWidth, this.halfHeight, `bg`);
        this.ground = this.physics.add.staticImage(this.halfWidth, this.scale.height -4, `ground`).setOffset(0.35);
        this.player = this.createPlayer().setBounce(0.2);
        this.physics.add.collider(this.ground, this.player);
        this.cursors = this.input.keyboard.createCursorKeys();
        this.bomb = this.physics.add.group({
            classType: Bomb,
            runChildUpdate : true,
        })
        this.ghost = this.physics.add.group({
            classType: Ghost, 
            maxSize : 10, 
            runChildUpdate : true
        })
        
        this.time.addEvent({
            delay :1000, 
            callback : this.spawnEnemy,
            callbackScope : this,
            loop : true
        })

        this.physics.add.overlap(this.ghost, this.bomb, this.hitGhost, undefined, this);
        this.scoreText = this.add.text(this.halfWidth + 100, 10, `Score : 0`, {
            color : `#FFFFFF`,
            fontSize : 24
        });

        this.physics.add.overlap(this.player, this.ghost, this.gameOver, undefined, this);
    }

    update(time){
        this.movePlayer(this.player, time);
    }

    createPlayer(){
        const player = this.physics.add.sprite(250, 250, `player`);
        player.setCollideWorldBounds(true);

        this.anims.create({
            key : `stanby`, 
            frames : this.anims.generateFrameNumbers(`player`,{
                start : 0, end : 2
            }),
            frameRate : 10
        })

        this.anims.create({
            key : `left`,
            frames : this.anims.generateFrameNumbers(`player`, {
                start :3, end : 5
            }),
            frameRate : 10
        })

        this.anims.create({
            key : `right`,
            frames : this.anims.generateFrameNumbers(`player`,{
                start : 6, end : 8
            }),
            frameRate : 10
        })

        return player
    }

    movePlayer(player, time){
        if(this.cursors.left.isDown){
            this.player.setVelocityX(this.speed * -1);
            this.player.anims.play(`left`, true);
        }else if(this.cursors.right.isDown){
            this.player.setVelocityX(this.speed);
            this.player.anims.play(`right`, true);
        }else{
            this.player.setVelocityX(0);
            this.player.anims.play(`stanby`,true);
        }


        if(this.cursors.space.isDown && time > this.lastFired){
            const bomb = this.bomb.get(0,0, `bomb`);
            if(bomb){
                bomb.fire(this.player.x, this.player.y)
                this.lastFired =  time+150;
            }
        }
    }

    spawnEnemy(){
        const config = {
            speed: 30, 
            rotation: 0
        }

        const ghost = this.ghost.get(0,0,`ghost`, config);
        const positionX = Phaser.Math.Between(10, this.scale.width - 1);
        if(ghost){
            ghost.spawn(positionX)
        }
    }

    hitGhost(ghost, bomb) {
        ghost.die()
        bomb.erase()
        this.score +=1;
        this.scoreText.setText(`Score : ${this.score}`)

    }

    gameOver() {
        // this.score = 0;
        this.scene.start(`game-over-scene`, {score : this.score})
    }
}