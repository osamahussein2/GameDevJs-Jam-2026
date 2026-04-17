export class CreditsMenu extends Phaser.Scene 
{
    constructor()
    {
        super('CreditsMenu');
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
        
        // Programmer Role Text
        this.programmerRoleText = this.add.text(this.gameWidth / 2.0, this.gameHeight + 100.0, 
            'Phaser Programmer', { fontFamily: 'Arial', fontSize: 60, color: '#FFFFFF' });

        this.programmerRoleText.setOrigin(0.5, 0.5);

        // Programmer Name Text
        this.programmerNameText = this.add.text(this.gameWidth / 2.0, this.gameHeight + 200.0, 
            'Osama Hussein', { fontFamily: 'Arial', fontSize: 40, color: '#FFFFFF' });

        this.programmerNameText.setOrigin(0.5, 0.5);

        // Artist Role Text
        this.artistRoleText = this.add.text(this.gameWidth / 2.0, this.gameHeight + 400.0, 
            '2D Artist', { fontFamily: 'Arial', fontSize: 60, color: '#FFFFFF' });

        this.artistRoleText.setOrigin(0.5, 0.5);

        // Artist Name Text
        this.artistNameText = this.add.text(this.gameWidth / 2.0, this.gameHeight + 500.0, 
            'Celeste', { fontFamily: 'Arial', fontSize: 40, color: '#FFFFFF' });

        this.artistNameText.setOrigin(0.5, 0.5);

        // Scroll credits parameters
        this.scrollCreditsAnimation = 0.0;
        this.scrollCreditsSpeed = 5.0;

        this.initializeBackButton(this.gameWidth / 2.0, 650);
    }

    update()
    {
        // Update scroll credits animation
        this.scrollCreditsAnimation -= this.sys.game.loop.delta / (1000.0 * this.scrollCreditsSpeed);

        // Update all credits texts positions using scroll credits animation value
        this.programmerRoleText.setPosition(this.programmerRoleText.getWorldPoint().x, 
            this.programmerRoleText.getWorldPoint().y + this.scrollCreditsAnimation);
        
        this.programmerNameText.setPosition(this.programmerNameText.getWorldPoint().x, 
            this.programmerNameText.getWorldPoint().y + this.scrollCreditsAnimation);
        
        this.artistRoleText.setPosition(this.artistRoleText.getWorldPoint().x, 
            this.artistRoleText.getWorldPoint().y + this.scrollCreditsAnimation);
        
        this.artistNameText.setPosition(this.artistNameText.getWorldPoint().x, 
            this.artistNameText.getWorldPoint().y + this.scrollCreditsAnimation);
        
        // Check if all the credits texts went above the screen (value should be less than 0)
        if (this.allCreditsTextsWentAboveTheScreen(-300.0))
        {
            this.resetCreditsScrolling(); // Reset all credits texts positions back to their starting positions
        }

        // Only printing this below for testing of the text position updating working
        //console.log(this.programmerRoleText.getWorldPoint());
    }

    resetCreditsScrolling()
    {
        this.programmerRoleText.setPosition(this.gameWidth / 2.0, this.gameHeight + 100.0);
        this.programmerNameText.setPosition(this.gameWidth / 2.0, this.gameHeight + 200.0);
        this.artistRoleText.setPosition(this.gameWidth / 2.0, this.gameHeight + 400.0);
        this.artistNameText.setPosition(this.gameWidth / 2.0, this.gameHeight + 500.0);
        this.scrollCreditsAnimation = 0.0;
    }

    allCreditsTextsWentAboveTheScreen(y)
    {
        return this.programmerRoleText.getWorldPoint().y <= y && 
            this.programmerNameText.getWorldPoint().y <= y &&
            this.artistRoleText.getWorldPoint().y <= y &&
            this.artistNameText.getWorldPoint().y <= y;
    }

    initializeBackButton(x, y)
    {
        this.backButton = this.add.nineslice(x, y, 'backButtonNormal');
        this.backButton.setScale(1.0, 1.5);

        this.backButton.setInteractive();

        this.backButton.on('pointerover', () => 
        {
            //this.backButton.setTexture('');
        });

        this.backButton.on('pointerout', () => 
        {
            //this.backButton.setTexture('backButtonNormal');
        });

        this.backButton.on('pointerdown', () => 
        {
            this.scene.stop(this);
            this.scene.start('MainMenu');
        });
    }
}