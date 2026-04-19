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

        this.initializeBackButton(this.gameWidth / 2.0, 650);
    }

    update()
    {
        
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