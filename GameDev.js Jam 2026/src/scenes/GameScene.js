import {Player} from '../gameobjects/Player.js'
import {Skeleton} from '../gameobjects/Skeleton.js'

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

        // Load enemy sprites
        this.load.spritesheet('EnemyIdle', 'art/enemy/Skeleton_Default_Idle_Unarmed.png', 
            { frameWidth: 64, frameHeight: 64 });
        
        this.load.spritesheet('EnemyRun', 'art/enemy/Skeleton_Default_Run_Unarmed.png', 
            { frameWidth: 64, frameHeight: 64 });
        
        this.load.spritesheet('EnemyAttack', 'art/enemy/Skeleton_Default_Attack_Unarmed.png', 
            { frameWidth: 64, frameHeight: 64 });
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

        // Load enemy skeleton
        this.skeletonEnemy = new Skeleton(this, 600, 200);
    }

    update()
    {
        // Update player's health
        if (this.playerHealth > 0.0 && this.playerHealth <= 100.0)
        {
            this.healthBarFill.width = 300 * (this.playerHealth / 100.0);
        }

        if (!this.isDamaged)
        {
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
        }

        // Play player hit damage animation
        if (this.skeletonEnemy.IsWithinAttackingRange(this.player) && !this.player.isDamaged)
        {
            this.player.animatePlayerDamage();

            this.playerHealth -= 2.0;
            this.player.isDamaged = true;
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

        // Move the enemy towards the player
        this.skeletonEnemy.moveToPlayer(this.player, this.sys.game);

        // Prevent the player from being able to move offscreen
        this.player.preventPlayerFromMovingOffscreen();
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