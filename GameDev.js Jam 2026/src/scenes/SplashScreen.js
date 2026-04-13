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
    }

    update()
    {
        
    }
}