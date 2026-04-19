export class GameOverMenu extends Phaser.Scene 
{
    constructor()
    {
        super('GameOverMenu');
    }

    preload()
    {
        // Load the assets for the game
        this.load.setPath('assets');
    }

    init(data)
    {
        this.score = data.score;
    }

    create()
    {
        this.gameWidth = this.sys.game.canvas.width;
        this.gameHeight = this.sys.game.canvas.height;

        this.enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

        // Game Over text
        this.enterText = this.add.text(this.gameWidth / 2.0, this.gameHeight / 10.0, 
            'Game Over', { fontFamily: 'Arial', fontSize: 60, color: '#FF0000' });
        
        this.enterText.setOrigin(0.5, 0.5);
        
        // Enter text
        this.enterText = this.add.text(this.gameWidth / 2.0, this.gameHeight / 1.1, 
            'Press ENTER to go back to main menu!', { fontFamily: 'Arial', fontSize: 30, color: '#FFFFFF' });
        
        this.enterText.setOrigin(0.5, 0.5);

        // Score
        this.scoreText = this.add.text(this.gameWidth / 2.0, this.gameHeight / 2.0, 'Score: ' + this.score, 
            { fontSize: '40px', fill: '#FFFFFF' });

        this.scoreText.setOrigin(0.5, 0.5);
    }

    update()
    {
        if (this.enterKey.isDown)
        {
            this.scene.stop(this);
            this.scene.start('MainMenu');
        }
    }
}