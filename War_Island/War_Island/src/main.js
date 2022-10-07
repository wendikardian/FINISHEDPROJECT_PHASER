import Phaser from 'phaser'

import WarIslandScene from './scenes/WarIslandScene'

const config = {
	type: Phaser.AUTO,
	width: 1300,
	height: 400,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 0 }
		},
	scale: {
		mode: Phaser.Scale.FIT,
		autoCenter: Phaser.Scale.CENTER_BOTH
		}
	},
	scene: [WarIslandScene]
}

export default new Phaser.Game(config)
