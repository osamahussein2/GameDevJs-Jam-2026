export class ControlsMenu extends Phaser.Scene 
{
    constructor()
    {
        super('ControlsMenu');
    }

    preload()
    {
        // Load the assets for the game
        this.load.setPath('assets');

        this.load.image('backButtonNormal', 'art/MM_BackButton.png');
    }

    create()
    {
        this.gameWidth = this.sys.game.canvas.width;
        this.gameHeight = this.sys.game.canvas.height;

        // Controls Title Text
        this.controlsTitleText = this.add.text(this.gameWidth / 2.0, 50.0, 
            'Controls', { fontFamily: 'Arial', fontSize: 50, color: '#FFFFFF' });

        this.controlsTitleText.setOrigin(0.5, 0.5);

        // Controls Text
        this.controlsText = this.add.text(this.gameWidth / 2.75, this.gameHeight / 2.0, 
            'WASD/Arrow keys - Move\nE - Heal at vending machine\nP - Pause Game', { fontFamily: 'Arial', fontSize: 30, color: '#FFFFFF' });

        this.controlsText.setOrigin(0.0, 0.5);

        this.initializeBackButton(this.gameWidth / 2.0, 650);
    }

    initializeBackButton(x, y)
    {
        this.backButton = this.add.nineslice(x, y, 'backButtonNormal');
        this.backButton.setScale(1.0, 1.5);

        this.backButton.setInteractive();

        this.backButton.on('pointerover', () => 
        {
            this.backButton.setTint(0xffff00);
        });

        this.backButton.on('pointerout', () => 
        {
            this.backButton.setTint(0xfffffff);
        });

        this.backButton.on('pointerdown', () => 
        {
            this.scene.stop(this);
            this.scene.start('MainMenu');
        });
    }
}