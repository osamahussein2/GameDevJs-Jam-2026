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

        this.load.image('Dungeon1', 'art/levels/Dungeon1.png');

        this.load.image('HealthVendingMachine', 'art/VendingMachine_Health.png');

        // Load player character sprites
        this.load.spritesheet('PlayerIdle', 'art/Player/IdlePlayerCharacter.png', 
            { frameWidth: 32, frameHeight: 45 });
        
        this.load.spritesheet('PlayerWalk', 'art/Player/WalkPlayerCharacter.png', 
            { frameWidth: 32, frameHeight: 45 });
        
        this.load.spritesheet('PlayerDamaged', 'art/Player/DamagedPlayerCharacter.png', 
            { frameWidth: 32, frameHeight: 45 });
        
        // Load keyboard input images
        this.load.image('EKeyImage', 'art/KeyImages/EKey.png');
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

        this.eKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E); // Interact

        this.dungeonLevel = this.add.image(0.0, -695.0, 'Dungeon1');
        this.dungeonLevel.setOrigin(0.0, 0.0);
        this.dungeonLevel.setScale(2.5, 2.75);

        this.healthVendingMachine = this.add.image(400, 300, 'HealthVendingMachine');
        this.healthVendingMachine.setScale(1.5, 1.5);

        this.player = new Player(this, 400, 200);

        this.healthBarBackground = this.add.rectangle(200, 50, 300, 50, 0xFF0000);
        this.healthBarFill = this.add.rectangle(200, 50, 300, 50, 0x00FF00);

        this.playerHealth = 100.0;
    }

    update()
    {
        // Update player's health
        if (this.playerHealth > 0.0 && this.playerHealth <= 100.0)
        {
            this.healthBarFill.width = 300 * (this.playerHealth / 100.0);
            this.playerHealth -= 0.016;
        }

        // Movement input
        if (this.aKey.isDown)
        {
            this.player.moveLeft(this.sys.game);
        }

        if (this.dKey.isDown)
        {
            this.player.moveRight(this.sys.game);
        }

        if (this.wKey.isDown)
        {
            this.player.moveUp(this.sys.game);
        }

        if (this.sKey.isDown)
        {
            this.player.moveDown(this.sys.game);
        }

        else if (this.aKey.isUp && this.dKey.isUp && this.wKey.isUp && this.sKey.isUp)
        {
            this.player.idle();
        }

        if (this.playerInsideOfHealthVendingMachine())
        {
            //console.log('Collided with health vending machine');

            if (this.healthVendingMachine.tint != 0xFF0000)
            {
                if (this.eKeyImage == null)
                {
                    this.eKeyImage = this.add.image(400, 200, 'EKeyImage');
                    this.eKeyImage.setScale(0.05, 0.05);
                }

                this.healthVendingMachine.setTint(0xFF0000);
            }

            if (this.eKey.isDown && this.playerHealth < 100.0)
            {
                //console.log('healed');

                this.playerHealth = 100.0;
            }
        }

        else
        {
            if (this.healthVendingMachine.tint != 0xFFFFFF)
            {
                if (this.eKeyImage != null) 
                {
                    this.eKeyImage.destroy();
                    this.eKeyImage = null;
                }

                this.healthVendingMachine.setTint(0xFFFFFF);
            }
        }

        this.player.preventPlayerFromMovingOffscreen();
    }

    initializeBackButton(x, y)
    {
        
    }

    playerInsideOfHealthVendingMachine()
    {
        if (this.player.getWorldPoint().x > this.healthVendingMachine.getWorldPoint().x - 10.0 &&
        this.player.getWorldPoint().x < this.healthVendingMachine.getWorldPoint().x + 20.0 &&
        this.player.getWorldPoint().y > this.healthVendingMachine.getWorldPoint().y - 50.0 &&
        this.player.getWorldPoint().y < this.healthVendingMachine.getWorldPoint().y + 50.0)
        {
            return true;
        }

        return false;
    }
}