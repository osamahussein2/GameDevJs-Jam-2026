export class SplashScreen extends Phaser.Scene 
{
    constructor()
    {
        super('SplashScreen');
    }

    preload() 
    {
        this.load.image('phaser', 'assets/phaser.png');
    }

    create() 
    {
        this.phaserImage = this.add.image(640, 375, 'phaser');
        this.phaserImage.alpha = 0.0;
        
        this.timeToFadeImage = 2.0; // in seconds
        this.timeToGoToMainMenu = 1.0; // in seconds

        this.millisecondsToSeconds = 1000.0;

        this.shouldImageFade = false;
        this.shouldGoToMainMenu = false;
    }

    update()
    {
        // When once image should fade is true, decrease its alpha to load the main menu
        if (this.shouldImageFade)
        {
            this.phaserImage.alpha -= this.sys.game.loop.delta / this.millisecondsToSeconds;
            
            if (this.phaserImage.alpha <= 0.0 && !this.shouldGoToMainMenu)
            {
                this.shouldGoToMainMenu = true;

                // Call the on go to main menu callback function once the image fully disappears
                this.sceneTimer = this.time.delayedCall(this.timeToGoToMainMenu * this.millisecondsToSeconds, 
                    this.onGoToMainMenu, [], this);
            }
        }

        // If the image shouldn't fade yet, increase its alpha to show it on screen
        else
        {
            this.phaserImage.alpha += this.sys.game.loop.delta / this.millisecondsToSeconds;
            
            if (this.phaserImage.alpha >= 1.0 && this.sceneTimer == null)
            {
                console.log('Phaser Image is fully visible');

                // Call the on start image fade callback function once the image fully pops up
                this.sceneTimer = this.time.delayedCall(this.timeToFadeImage * this.millisecondsToSeconds, 
                    this.onStartImageFade, [], this);
            }
        }
    }

    onStartImageFade()
    {
        if (!this.shouldImageFade) this.shouldImageFade = true;
        if (this.sceneTimer != null) this.sceneTimer = null;
    }

    onGoToMainMenu()
    {
        this.scene.stop(this);
        this.scene.start('MainMenu');

        if (this.sceneTimer != null) this.sceneTimer = null;
    }
}