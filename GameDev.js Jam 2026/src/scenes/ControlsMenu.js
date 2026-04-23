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

        // Input key for going back to main menu
        this.enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

        // Controls Title Text
        this.controlsTitleText = this.add.text(this.gameWidth / 2.0, 50.0, 
            'Controls', { fontFamily: 'Arial', fontSize: 50, color: '#FFFFFF' });

        this.controlsTitleText.setOrigin(0.5, 0.5);

        // Controls Text
        this.controlsText = this.add.text(this.gameWidth / 2.75, this.gameHeight / 2.0, 
            'WASD/Arrow keys - Move\nE - Heal at vending machine\nP - Pause Game' + 
            '\nSPACE - Play/Pause Credits Scroll', { fontFamily: 'Arial', fontSize: 30, color: '#FFFFFF' });

        this.controlsText.setOrigin(0.0, 0.5);

        this.buttonScaleX = 0.8;
        this.buttonScaleY = 1.0;

        this.startingButtonScaleX = this.buttonScaleX;
        this.startingButtonScaleY = this.buttonScaleY;

        this.minButtonScaleX = 0.8;
        this.maxButtonScaleX = 1.1;

        this.buttonScaleDecreasing = false;

        this.initializeBackButton(this.gameWidth / 2.0, 650);
    }

    update()
    {
        this.updateScaleOfBackButton();

        // Press ENTER to go back to main menu
        if (Phaser.Input.Keyboard.JustDown(this.enterKey))
        {
            this.scene.stop(this);
            this.scene.start('MainMenu');
        }
    }

    initializeBackButton(x, y)
    {
        this.backButton = this.add.nineslice(x, y, 'backButtonNormal');
        this.backButton.setScale(this.startingButtonScaleX, this.startingButtonScaleY);

        this.backButton.setInteractive();
        this.backButton.setTint(0xffff00);

        this.backButton.on('pointerover', () => 
        {
            //this.backButton.setTint(0xffff00);
        });

        this.backButton.on('pointerout', () => 
        {
            //this.backButton.setTint(0xfffffff);
        });

        this.backButton.on('pointerdown', () => 
        {
            this.scene.stop(this);
            this.scene.start('MainMenu');
        });
    }

    updateScaleOfBackButton()
    {
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
        
        this.backButton.setScale(this.buttonScaleX, this.buttonScaleY);
    }
}