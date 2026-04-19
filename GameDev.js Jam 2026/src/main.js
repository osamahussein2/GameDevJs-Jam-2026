import { SplashScreen } from './scenes/SplashScreen.js';
import { MainMenu } from './scenes/MainMenu.js';
import { CreditsMenu } from './scenes/CreditsMenu.js';
import { ControlsMenu } from './scenes/ControlsMenu.js';
import { GameScene } from './scenes/GameScene.js';
import { GameOverMenu } from './scenes/GameOverMenu.js';

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
        SplashScreen,
        MainMenu,
        CreditsMenu,
        ControlsMenu,
        GameScene,
        GameOverMenu
    ],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
}

new Phaser.Game(config);
            