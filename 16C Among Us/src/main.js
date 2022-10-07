import Phaser from 'phaser'

import AmongUsScene from './scenes/AmongUsScene.js'

const config = {
	type: Phaser.AUTO,
	width: 800,
	height: 600,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 200 }
		}
	},
	scene: [AmongUsScene]
}

export default new Phaser.Game(config)
