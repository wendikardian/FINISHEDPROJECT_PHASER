import Phaser from 'phaser';
import Carrot from '../game/Carrot.js';

var platforms;
var player;
var cursors; 
var carrots;
var carrotsCollected;
var carrotsCollectedText;

export default class BunnyJumpScene extends Phaser.Scene{
    constructor(){
        super("bunny-jump-scene");
    }

    preload(){
        this.load.image(`background`, `images/bg_layer1.png`);
        this.load.image(`platform`, `images/ground_grass.png`);
        this.load.image(`carrot`, `images/carrot.png`);
        this.load.image(`bunny_jump`, `images/bunny1_jump.png`);
        this.load.image(`bunny_stand`, `images/bunny1_stand.png`);
        this.load.audio(`jumpSound`, `sfx/phaseJump1.ogg`);
    }

    create(){
        this.carrotsCollected  = 0;
        this.add.image(240,320, `background`).setScrollFactor(1,0);
        this.platforms = this.physics.add.staticGroup();
        this.carrots = this.physics.add.group({
            classType : Carrot
        })

        this.physics.add.collider(this.platforms, this.carrots);
        for(let i = 0; i< 5; i++){
            const x = Phaser.Math.Between(80,400);
            const y= 150*i;

            const platformChild = this.platforms.create(x,y,`platform`);
            platformChild.setScale(0.5);
            platformChild.refreshBody();
            const body = platformChild.body;
            body.updateFromGameObject();
        }

        this.player = this.physics.add.sprite(240, 320, `bunny_stand`).setScale(0.5);
        this.physics.add.collider(this.player, this.platforms);


        this.player.body.checkCollision.up =false;
        this.player.body.checkCollision.left = false;
        this.player.body.checkCollision.right = false;

        this.cameras.main.startFollow(this.player);

        this.cursors = this.input.keyboard.createCursorKeys();

        this.cameras.main.setDeadzone(this.scale.width*1.5);

        this.physics.add.overlap(this.player, this.carrots, this.handleCollectCarrot, undefined, this);


        const style = {color : `red`, fontSize : 26};
        this.carrotsCollectedText = this.add.text(240,10, `Carrots : 0`, style)
            .setScrollFactor(0)
            .setOrigin(0.5, 0)

    }

    update(){
        

        const touchingDown = this.player.body.touching.down;
        if(touchingDown){
            this.player.setVelocityY(-330);
            this.player.setTexture(`bunny_jump`);
            this.sound.play(`jumpSound`);
        }

        const vy = this.player.body.velocity.y;
        if(vy > 0 && this.player.texture.key !== `bunny_stand`){
            this.player.setTexture(`bunny_stand`);
        }


        if(this.cursors.left.isDown && !touchingDown){
            this.player.setVelocityX(-200)
        }else if(this.cursors.right.isDown && !touchingDown){
            this.player.setVelocityX(200);
        }else{
            this.player.setVelocityX(0);
        }


        this.platforms.children.iterate(child => {
            const platformChild  = child;
            const scrollY = this.cameras.main.scrollY;
            if(platformChild.y >= scrollY + 700){
                platformChild.y = scrollY - Phaser.Math.Between(50,100);
                platformChild.body.updateFromGameObject();
                this.addCarrotAbove(platformChild);
            }    

        })

        this.horizontalWrap(this.player);
        
        const bottomPlatform = this.findBottomMostPlatform();
        if(this.player.y > bottomPlatform.y + 200){
            this.scene.start(`game-over-scene`);
        }

    }

    horizontalWrap(sprite){
        const halfWidth = sprite.displayWidth * 0.5;
        const gameWidth = this.scale.width ;

        if(sprite.x < -halfWidth){
            sprite.x = gameWidth + halfWidth ;
        }else if(sprite.x > gameWidth + halfWidth){
            sprite.x = -halfWidth ;
        }
    }

    addCarrotAbove(sprite){
        const y = sprite.y - sprite.displayHeight;
        const carrot = this.carrots.get(sprite.x,y, `carrot`);
        carrot.setActive(true);
        carrot.setVisible(true);
        this.add.existing(carrot);
        carrot.body.setSize(carrot.height, carrot.width);

        this.physics.world.enable(carrot);
        return carrot;
    }

    handleCollectCarrot(player, carrot){
        this.carrots.killAndHide(carrot);
        this.physics.world.disableBody(carrot.body);
        this.carrotsCollected +=1;

        const value = `Carrots : ${this.carrotsCollected}`
        // const value = 'Carrots : ' + this.carrotsCollected;
        this.carrotsCollectedText.text = value;
    }

    findBottomMostPlatform(){
        const platforms = this.platforms.getChildren();
        let bottomPlatform = platforms[0];

        for(let i = 1; i< platforms.length ; i++){
            const platform = platforms[i];

            if(platform.y < bottomPlatform.y){
                continue;
            }

            bottomPlatform = platform;
        }

        return bottomPlatform;
    }

}