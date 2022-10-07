import Phaser from 'phaser'

import GhostBusterScene from './scenes/GhostBusterScene'
import GameOverScene from './scenes/GameOverScene'

const config = {
	type: Phaser.AUTO,
	width: 512,
	height: 500,
	scale: {
		mode : Phaser.Scale.FIT,
		autoCenter : Phaser.Scale.CENTER_BOTH
	},
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 200 }
		}
	},
	scene: [GhostBusterScene, GameOverScene]
}

export default new Phaser.Game(config)
