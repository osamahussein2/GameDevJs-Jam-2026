import {Player} from '../gameobjects/Player.js'

export class GameScene extends Phaser.Scene 
{
    constructor()
    {
        super('GameScene');
    }

    preload()
    {
        // Load the assets for the game
        this.load.setPath('assets');

        this.load.image('HealthVendingMachine', 'art/VendingMachine_Health.png');

        // Load player character sprites
        this.load.spritesheet('PlayerIdle', 'art/Player/IdlePlayerCharacter.png', 
            { frameWidth: 32, frameHeight: 45 });
        
        this.load.spritesheet('PlayerWalk', 'art/Player/WalkPlayerCharacter.png', 
            { frameWidth: 32, frameHeight: 45 });
    }

    create()
    {
        this.gameWidth = this.sys.game.canvas.width;
        this.gameHeight = this.sys.game.canvas.height;

        // Set up input keys
        this.dKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.aKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.wKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.sKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);

        this.healthVendingMachine = this.add.image(400, 300, 'HealthVendingMachine');

        this.player = new Player(this, 400, 200);
    }

    update()
    {
        if (this.aKey.isDown)
        {
            this.player.moveLeft(this.sys.game);
        }

        if (this.dKey.isDown)
        {
            this.player.moveRight(this.sys.game);
        }

        else if (this.aKey.isUp && this.dKey.isUp)
        {
            this.player.idle();
        }
    }

    initializeBackButton(x, y)
    {
        
    }
}