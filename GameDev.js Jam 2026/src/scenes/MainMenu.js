export class MainMenu extends Phaser.Scene 
{
    constructor()
    {
        super('MainMenu');
    }

    preload() 
    {
        // Load the assets for the game
        this.load.setPath('assets');

        this.load.image('playButtonNormal', 'art/MMStartButton.png');
        this.load.image('creditsButtonNormal', 'art/MMCreditButton.png');
        this.load.image('controlsButtonNormal', 'art/MMControlsButton.png');
        this.load.image('quitButtonNormal', 'art/MMQuitButton.png');
    }

    create() 
    {
        this.initializePlayButton(200, 600);
        this.initializeCreditsButton(500, 600);
        this.initializeControlsButton(800, 600);
        this.initializeQuitButton(1100, 600);
    }

    update()
    {
        
    }

    initializePlayButton(x, y)
    {
        this.playButton = this.add.nineslice(x, y, 'playButtonNormal');
        this.playButton.setScale(1.0, 1.5);

        this.playButton.setInteractive();

        this.playButton.on('pointerover', () => 
        {
            
        });

        this.playButton.on('pointerout', () => 
        {
            
        });

        this.playButton.on('pointerdown', () => 
        {
            //this.scene.stop(this);
            //this.scene.start('GameScene');
        });
    }

    initializeCreditsButton(x, y)
    {
        this.creditsButton = this.add.nineslice(x, y, 'creditsButtonNormal');
        this.creditsButton.setScale(1.0, 1.5);

        this.creditsButton.setInteractive();

        this.creditsButton.on('pointerover', () => 
        {
            
        });

        this.creditsButton.on('pointerout', () => 
        {
            
        });

        this.creditsButton.on('pointerdown', () => 
        {
            this.scene.stop(this);
            this.scene.start('CreditsMenu');
        });
    }

    initializeControlsButton(x, y)
    {
        this.controlsButton = this.add.nineslice(x, y, 'controlsButtonNormal');
        this.controlsButton.setScale(1.0, 1.5);

        this.controlsButton.setInteractive();

        this.controlsButton.on('pointerover', () => 
        {
            
        });

        this.controlsButton.on('pointerout', () => 
        {
            
        });

        this.controlsButton.on('pointerdown', () => 
        {
            this.scene.stop(this);
            this.scene.start('ControlsMenu');
        });
    }

    initializeQuitButton(x, y)
    {
        this.quitButton = this.add.nineslice(x, y, 'quitButtonNormal');
        this.quitButton.setScale(1.0, 1.5);

        this.quitButton.setInteractive();

        this.quitButton.on('pointerover', () => 
        {
            
        });

        this.quitButton.on('pointerout', () => 
        {
            
        });

        this.quitButton.on('pointerdown', () => 
        {
            this.scene.stop(this);

            this.game = new Phaser.Game(this);
            this.game.destroy(true, true);
        });
    }
}