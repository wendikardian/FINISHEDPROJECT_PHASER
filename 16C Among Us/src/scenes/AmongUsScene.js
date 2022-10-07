import Phaser from 'phaser'

export default class AmongUsScene extends Phaser.Scene {

    constructor(){
        super('among-us-scene')
    }

    preload(){
        this.load.image('maps', 'images/Maps.png')
    }

    create(){
        this.add.image(400, 300, 'maps')
    }

}