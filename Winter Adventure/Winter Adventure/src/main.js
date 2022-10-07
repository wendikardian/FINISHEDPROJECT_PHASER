import Phaser from 'phaser'

import WinterAdventureScene from './scenes/WinterAdventure'

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
	scene: [WinterAdventureScene]
}

export default new Phaser.Game(config)
