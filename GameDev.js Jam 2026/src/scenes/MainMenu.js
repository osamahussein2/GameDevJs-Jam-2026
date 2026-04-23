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

        this.load.audio('mainMenuTheme', 'music/Main Menu Music (Remixed).wav');
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

        this.leftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        this.rightKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

        this.enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

        this.buttonScaleX = 0.8;
        this.buttonScaleY = 1.0;

        this.startingButtonScaleX = this.buttonScaleX;
        this.startingButtonScaleY = this.buttonScaleY;

        this.selectedOption = 0;
        this.showSelectedOption();

        this.minButtonScaleX = 0.8;
        this.maxButtonScaleX = 1.1;

        this.buttonScaleDecreasing = false;
    }

    update()
    {
        if (Phaser.Input.Keyboard.JustDown(this.leftKey) && this.selectedOption > 0)
        {
            this.selectedOption--;
            this.showSelectedOption();
        }
        
        if (Phaser.Input.Keyboard.JustDown(this.rightKey) && this.selectedOption < 3)
        {
            this.selectedOption++;
            this.showSelectedOption();
        }

        if (Phaser.Input.Keyboard.JustDown(this.enterKey))
        {
            this.pressSelectedOption();
        }

        this.updateScaleOfSelectedOption();
    }

    initializePlayButton(x, y)
    {
        this.playButton = this.add.nineslice(x, y, 'playButtonNormal');
        this.playButton.setScale(this.startingButtonScaleX, this.startingButtonScaleY);

        this.playButton.setInteractive();

        this.playButton.on('pointerover', () => 
        {
            this.selectedOption = 0;
            this.showSelectedOption();
        });

        this.playButton.on('pointerout', () => 
        {
            //this.playButton.setTint(0xfffffff);
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
        this.creditsButton.setScale(this.startingButtonScaleX, this.startingButtonScaleY);

        this.creditsButton.setInteractive();

        this.creditsButton.on('pointerover', () => 
        {
            this.selectedOption = 1;
            this.showSelectedOption();
        });

        this.creditsButton.on('pointerout', () => 
        {
            //this.creditsButton.setTint(0xfffffff);
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
        this.controlsButton.setScale(this.startingButtonScaleX, this.startingButtonScaleY);

        this.controlsButton.setInteractive();

        this.controlsButton.on('pointerover', () => 
        {
            this.selectedOption = 2;
            this.showSelectedOption();
        });

        this.controlsButton.on('pointerout', () => 
        {
            //this.controlsButton.setTint(0xfffffff);
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
        this.quitButton.setScale(this.startingButtonScaleX, this.startingButtonScaleY);

        this.quitButton.setInteractive();

        this.quitButton.on('pointerover', () => 
        {
            this.selectedOption = 3;
            this.showSelectedOption();
        });

        this.quitButton.on('pointerout', () => 
        {
            //this.quitButton.setTint(0xfffffff);
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

    showSelectedOption()
    {
        switch (this.selectedOption)
        {
            case 0: // PLAY
            this.playButton.setTint(0xffff00);
            this.creditsButton.setTint(0xfffffff);
            this.controlsButton.setTint(0xfffffff);
            this.quitButton.setTint(0xfffffff);

            if (this.buttonScaleX != this.startingButtonScaleX) this.buttonScaleX = this.startingButtonScaleX;
            if (this.buttonScaleY != this.startingButtonScaleY) this.buttonScaleY = this.startingButtonScaleY;

            if (this.buttonScaleDecreasing) this.buttonScaleDecreasing = false;

            this.playButton.setScale(this.buttonScaleX, this.buttonScaleY);
            this.creditsButton.setScale(this.startingButtonScaleX, this.startingButtonScaleY);
            this.controlsButton.setScale(this.startingButtonScaleX, this.startingButtonScaleY);
            this.quitButton.setScale(this.startingButtonScaleX, this.startingButtonScaleY);
            break;

            case 1: // CREDITS
            this.playButton.setTint(0xfffffff);
            this.creditsButton.setTint(0xffff00);
            this.controlsButton.setTint(0xfffffff);
            this.quitButton.setTint(0xfffffff);

            if (this.buttonScaleX != this.startingButtonScaleX) this.buttonScaleX = this.startingButtonScaleX;
            if (this.buttonScaleY != this.startingButtonScaleY) this.buttonScaleY = this.startingButtonScaleY;

            if (this.buttonScaleDecreasing) this.buttonScaleDecreasing = false;

            this.playButton.setScale(this.startingButtonScaleX, this.startingButtonScaleY);
            this.creditsButton.setScale(this.buttonScaleX, this.buttonScaleY);
            this.controlsButton.setScale(this.startingButtonScaleX, this.startingButtonScaleY);
            this.quitButton.setScale(this.startingButtonScaleX, this.startingButtonScaleY);
            break;

            case 2: // CONTROLS
            this.playButton.setTint(0xfffffff);
            this.creditsButton.setTint(0xfffffff);
            this.controlsButton.setTint(0xffff00);
            this.quitButton.setTint(0xfffffff);

            if (this.buttonScaleX != this.startingButtonScaleX) this.buttonScaleX = this.startingButtonScaleX;
            if (this.buttonScaleY != this.startingButtonScaleY) this.buttonScaleY = this.startingButtonScaleY;

            if (this.buttonScaleDecreasing) this.buttonScaleDecreasing = false;

            this.playButton.setScale(this.startingButtonScaleX, this.startingButtonScaleY);
            this.creditsButton.setScale(this.startingButtonScaleX, this.startingButtonScaleY);
            this.controlsButton.setScale(this.buttonScaleX, this.buttonScaleY);
            this.quitButton.setScale(this.startingButtonScaleX, this.startingButtonScaleY);
            break;

            case 3: // QUIT
            this.playButton.setTint(0xfffffff);
            this.creditsButton.setTint(0xfffffff);
            this.controlsButton.setTint(0xfffffff);
            this.quitButton.setTint(0xffff00);

            if (this.buttonScaleX != this.startingButtonScaleX) this.buttonScaleX = this.startingButtonScaleX;
            if (this.buttonScaleY != this.startingButtonScaleY) this.buttonScaleY = this.startingButtonScaleY;

            if (this.buttonScaleDecreasing) this.buttonScaleDecreasing = false;

            this.playButton.setScale(this.startingButtonScaleX, this.startingButtonScaleY);
            this.creditsButton.setScale(this.startingButtonScaleX, this.startingButtonScaleY);
            this.controlsButton.setScale(this.startingButtonScaleX, this.startingButtonScaleY);
            this.quitButton.setScale(this.buttonScaleX, this.buttonScaleY);
            break;

            default:
            break;
        }
    }

    pressSelectedOption()
    {
        switch (this.selectedOption)
        {
            case 0: // PLAY
            
                this.scene.stop(this);

                // Stop the main menu theme music and destroy it
                if (this.mainMenuTheme != null) 
                {
                    this.mainMenuTheme.stop();
                    this.mainMenuTheme.destroy();
                    this.mainMenuTheme = null;
                }

                this.scene.start('GameScene');

            break;

            case 1: // CREDITS
            
                this.scene.stop(this);
                this.scene.start('CreditsMenu');

            break;

            case 2: // CONTROLS

                this.scene.stop(this);
                this.scene.start('ControlsMenu');

            break;

            case 3: // QUIT

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

            break;

            default:
            break;
        }
    }

    updateScaleOfSelectedOption()
    {
        switch (this.selectedOption)
        {
            case 0: // PLAY

                if (!this.buttonScaleDecreasing)
                {
                    this.buttonScaleX += this.sys.game.loop.delta / 1000.0;
                    this.buttonScaleY += this.sys.game.loop.delta / 1000.0;

                    if (this.buttonScaleX >= this.maxButtonScaleX) this.buttonScaleDecreasing = true;
                }

                else
                {
                    this.buttonScaleX -= this.sys.game.loop.delta / 1000.0;
                    this.buttonScaleY -= this.sys.game.loop.delta / 1000.0;

                    if (this.buttonScaleX <= this.minButtonScaleX) this.buttonScaleDecreasing = false;
                }
                
                this.playButton.setScale(this.buttonScaleX, this.buttonScaleY);

            break;

            case 1: // CREDITS
            
                if (!this.buttonScaleDecreasing)
                {
                    this.buttonScaleX += this.sys.game.loop.delta / 1000.0;
                    this.buttonScaleY += this.sys.game.loop.delta / 1000.0;

                    if (this.buttonScaleX >= this.maxButtonScaleX) this.buttonScaleDecreasing = true;
                }

                else
                {
                    this.buttonScaleX -= this.sys.game.loop.delta / 1000.0;
                    this.buttonScaleY -= this.sys.game.loop.delta / 1000.0;

                    if (this.buttonScaleX <= this.minButtonScaleX) this.buttonScaleDecreasing = false;
                }
                
                this.creditsButton.setScale(this.buttonScaleX, this.buttonScaleY);

            break;

            case 2: // CONTROLS

                if (!this.buttonScaleDecreasing)
                {
                    this.buttonScaleX += this.sys.game.loop.delta / 1000.0;
                    this.buttonScaleY += this.sys.game.loop.delta / 1000.0;

                    if (this.buttonScaleX >= this.maxButtonScaleX) this.buttonScaleDecreasing = true;
                }

                else
                {
                    this.buttonScaleX -= this.sys.game.loop.delta / 1000.0;
                    this.buttonScaleY -= this.sys.game.loop.delta / 1000.0;

                    if (this.buttonScaleX <= this.minButtonScaleX) this.buttonScaleDecreasing = false;
                }
                
                this.controlsButton.setScale(this.buttonScaleX, this.buttonScaleY);

            break;

            case 3: // QUIT

                if (!this.buttonScaleDecreasing)
                {
                    this.buttonScaleX += this.sys.game.loop.delta / 1000.0;
                    this.buttonScaleY += this.sys.game.loop.delta / 1000.0;

                    if (this.buttonScaleX >= this.maxButtonScaleX) this.buttonScaleDecreasing = true;
                }

                else
                {
                    this.buttonScaleX -= this.sys.game.loop.delta / 1000.0;
                    this.buttonScaleY -= this.sys.game.loop.delta / 1000.0;

                    if (this.buttonScaleX <= this.minButtonScaleX) this.buttonScaleDecreasing = false;
                }
                
                this.quitButton.setScale(this.buttonScaleX, this.buttonScaleY);

            break;

            default:
            break;
        }
    }
}