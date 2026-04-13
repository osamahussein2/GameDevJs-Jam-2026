import { SplashScreen } from './scenes/SplashScreen.js';

const config = {
    type: Phaser.AUTO,
    title: 'GameDev.js Jam 2026',
    description: '',
    parent: 'game-container',
    width: 1280,
    height: 720,
    backgroundColor: '#000000',
    pixelArt: false,
    scene: 
    [
        SplashScreen
    ],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
}

new Phaser.Game(config);
            