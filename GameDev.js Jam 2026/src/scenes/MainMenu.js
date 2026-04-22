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

        this.load.audio('mainMenuTheme', 'music/Main Menu Theme.wav');
    }

    create() 
    {
        this.initializePlayButton(200, 600);
        this.initializeCreditsButton(500, 600);
        this.initializeControlsButton(800, 600);
        this.initializeQuitButton(1100, 600);

        // Play the main menu theme music
        if (this.mainMenuTheme == null) 
        {
            this.mainMenuTheme = this.sound.add('mainMenuTheme');
            this.mainMenuTheme.play();
            this.mainMenuTheme.setLoop(true);
        }
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
            this.playButton.setTint(0xffff00);
        });

        this.playButton.on('pointerout', () => 
        {
            this.playButton.setTint(0xfffffff);
        });

        this.playButton.on('pointerdown', () => 
        {
            this.scene.stop(this);

            // Stop the main menu theme music and destroy it
            if (this.mainMenuTheme != null) 
            {
                this.mainMenuTheme.stop();
                this.mainMenuTheme.destroy();
                this.mainMenuTheme = null;
            }

            this.scene.start('GameScene');
        });
    }

    initializeCreditsButton(x, y)
    {
        this.creditsButton = this.add.nineslice(x, y, 'creditsButtonNormal');
        this.creditsButton.setScale(1.0, 1.5);

        this.creditsButton.setInteractive();

        this.creditsButton.on('pointerover', () => 
        {
            this.creditsButton.setTint(0xffff00);
        });

        this.creditsButton.on('pointerout', () => 
        {
            this.creditsButton.setTint(0xfffffff);
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
            this.controlsButton.setTint(0xffff00);
        });

        this.controlsButton.on('pointerout', () => 
        {
            this.controlsButton.setTint(0xfffffff);
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
            this.quitButton.setTint(0xffff00);
        });

        this.quitButton.on('pointerout', () => 
        {
            this.quitButton.setTint(0xfffffff);
        });

        this.quitButton.on('pointerdown', () => 
        {
            this.scene.stop(this);

            // Stop the main menu theme music and destroy it
            if (this.mainMenuTheme != null) 
            {
                this.mainMenuTheme.stop();
                this.mainMenuTheme.destroy();
                this.mainMenuTheme = null;
            }

            this.game = new Phaser.Game(this);
            this.game.destroy(true, true);
        });
    }
}