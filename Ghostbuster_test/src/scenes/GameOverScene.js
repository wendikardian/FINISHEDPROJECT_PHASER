import Phaser from 'phaser';

export default class GameOVerScene extends Phaser.Scene{
    constructor(){
        super(`game-over-scene`);
    }

    init(data){
        this.halfWidth = this.scale.width * 0.5;
        this.halfHeight = this.scale.height * 0.5;
        this.replayButton = undefined;
        this.score = data.score;
    }
    preload(){
        this.load.image(`bg`, `images/background.png`)
        this.load.image(`gameover`, `images/gameover.png`)
        this.load.image(`replay`, `images/replay.png`)
    }

    create(){
        this.add.image(this.halfWidth, this.halfHeight, `bg`);
        this.add.image(this.halfWidth, this.halfHeight, `gameover`).setScale(0.3);
        this.add.text(this.halfWidth-100, 30, `Your score is : ${this.score}`)
        this.replayButton = this.add.image(this.halfWidth, this.halfHeight+100, `replay`).setScale(0.15).setInteractive();
        this.replayButton.once('pointerup', () => { this.scene.start('ghost-buster-scene') }, this)
    }
}