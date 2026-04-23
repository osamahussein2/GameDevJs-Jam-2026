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

        this.load.image('pauseIcon', 'art/creditsMenu/PauseIcon.png');
        this.load.image('playIcon', 'art/creditsMenu/PlayIcon.png');
    }

    create()
    {
        this.gameWidth = this.sys.game.canvas.width;
        this.gameHeight = this.sys.game.canvas.height;

        // Input key for controlling scroll credits
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        // Input key for going back to main menu
        this.enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
        
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

        // Music/Sound Composer Role Text
        this.audioRoleText = this.add.text(this.gameWidth / 2.0, this.gameHeight + 700.0, 
            'Music/Sound Composer', { fontFamily: 'Arial', fontSize: 60, color: '#FFFFFF' });

        this.audioRoleText.setOrigin(0.5, 0.5);

        // Music/Sound Composer Name Text
        this.audioNameText = this.add.text(this.gameWidth / 2.0, this.gameHeight + 800.0, 
            'JaneDukeMusic (https://janedukemusic.com/)', { fontFamily: 'Arial', fontSize: 40, 
            color: '#FFFFFF' }).setInteractive();
        
        this.audioNameText.on('pointerover', this.pointerOverJaneDukeName, this);
        this.audioNameText.on('pointerout', this.pointerOutJaneDukeName, this);
        this.audioNameText.on('pointerdown', this.openJaneDukeWebsite, this);

        this.audioNameText.setOrigin(0.5, 0.5);

        // Scroll credits parameters
        this.scrollCreditsAnimation = 0.0;
        this.scrollCreditsSpeed = 5.0;

        this.buttonScaleX = 0.8;
        this.buttonScaleY = 1.0;

        this.startingButtonScaleX = this.buttonScaleX;
        this.startingButtonScaleY = this.buttonScaleY;

        this.minButtonScaleX = 0.8;
        this.maxButtonScaleX = 1.1;

        this.buttonScaleDecreasing = false;

        this.initializeBackButton(this.gameWidth / 2.0, 650);

        this.shouldCreditsScroll = true;

        // Credits status icon image (for showing play/pause icon)
        this.creditsStatusIcon = this.add.image(60, 60, 'playIcon');

        this.janeDukeNamePointerOver = false;
    }

    update()
    {
        this.updateScaleOfBackButton();
        
        if (Phaser.Input.Keyboard.JustDown(this.spaceKey))
        {
            this.shouldCreditsScroll = !this.shouldCreditsScroll;

            if (!this.shouldCreditsScroll) 
            {
                if (this.janeDukeNamePointerOver) this.audioNameText.setColor('#1A73E8');
                this.creditsStatusIcon.setTexture('pauseIcon');
            }
            else 
            {
                if (this.audioNameText.color != '#FFFFFF') this.audioNameText.setColor('#FFFFFF');
                this.creditsStatusIcon.setTexture('playIcon');
            }
        }

        // Press ENTER to go back to main menu
        if (Phaser.Input.Keyboard.JustDown(this.enterKey))
        {
            this.scene.stop(this);
            this.scene.start('MainMenu');
        }

        if (this.shouldCreditsScroll)
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
            
            this.audioRoleText.setPosition(this.audioRoleText.getWorldPoint().x, 
                this.audioRoleText.getWorldPoint().y + this.scrollCreditsAnimation);
            
            this.audioNameText.setPosition(this.audioNameText.getWorldPoint().x, 
                this.audioNameText.getWorldPoint().y + this.scrollCreditsAnimation);
            
            // Check if all the credits texts went above the screen (value should be less than 0)
            if (this.allCreditsTextsWentAboveTheScreen(-300.0))
            {
                this.resetCreditsScrolling(); // Reset all credits texts positions back to their starting positions
            }
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
        this.audioRoleText.setPosition(this.gameWidth / 2.0, this.gameHeight + 700.0);
        this.audioNameText.setPosition(this.gameWidth / 2.0, this.gameHeight + 800.0);
        this.scrollCreditsAnimation = 0.0;
    }

    allCreditsTextsWentAboveTheScreen(y)
    {
        return this.programmerRoleText.getWorldPoint().y <= y && 
            this.programmerNameText.getWorldPoint().y <= y &&
            this.artistRoleText.getWorldPoint().y <= y &&
            this.artistNameText.getWorldPoint().y <= y && 
            this.audioRoleText.getWorldPoint().y <= y &&
            this.audioNameText.getWorldPoint().y <= y;
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

    pointerOverJaneDukeName()
    {
        this.janeDukeNamePointerOver = true;
        if (!this.shouldCreditsScroll) this.audioNameText.setColor('#1A73E8');
    }

    pointerOutJaneDukeName()
    {
        if (this.audioNameText.color != '#FFFFFF') this.audioNameText.setColor('#FFFFFF');
        this.janeDukeNamePointerOver = false;
    }

    openJaneDukeWebsite()
    {
        if (!this.shouldCreditsScroll)
        {
            this.description = 'Official Artist Website';

            this.janeDukeURL = `https://janedukemusic.com/?text=${encodeURIComponent(this.description)}`;

            this.janeDukeWebsite = window.open(this.janeDukeURL);
        }
    }
}