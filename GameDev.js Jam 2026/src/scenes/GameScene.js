import {Player} from '../gameobjects/Player.js'
import {Skeleton} from '../gameobjects/Skeleton.js'
import {Fire} from '../gameobjects/Fire.js'

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
        
        this.load.spritesheet('PlayerDeath', 'art/Player/DeathPlayerCharacter.png', 
            { frameWidth: 41, frameHeight: 45 });
        
        // Load keyboard input images
        this.load.image('EKeyImage', 'art/KeyImages/EKey.png');

        // Load enemy sprites
        this.load.spritesheet('EnemyIdle', 'art/enemy/Skeleton_Default_Idle_Unarmed.png', 
            { frameWidth: 64, frameHeight: 64 });
        
        this.load.spritesheet('EnemyRun', 'art/enemy/Skeleton_Default_Run_Unarmed.png', 
            { frameWidth: 64, frameHeight: 64 });
        
        this.load.spritesheet('EnemyAttack', 'art/enemy/Skeleton_Default_Attack_Unarmed.png', 
            { frameWidth: 64, frameHeight: 64 });
        
        this.load.spritesheet('EnemyHurt', 'art/enemy/Skeleton_Default_Hurt.png', 
            { frameWidth: 64, frameHeight: 64 });
        
        // Load fire animation
        this.load.spritesheet('Fire', 'art/fire_animation.png', 
            { frameWidth: 32, frameHeight: 20 });
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

        // Create background level
        this.dungeonLevel = this.add.image(0.0, -695.0, 'Dungeon1');
        this.dungeonLevel.setOrigin(0.0, 0.0);
        this.dungeonLevel.setScale(2.5, 2.75);

        // Create fire
        this.fire1 = new Fire(this, 200, 100);
        this.fire2 = new Fire(this, 200, 530);
        this.fire3 = new Fire(this, 1080, 100);
        this.fire4 = new Fire(this, 1080, 530);

        // Create health vending machine for healing
        this.healthVendingMachine = this.add.image(400, 300, 'HealthVendingMachine');
        this.healthVendingMachine.setScale(1.5, 1.5);

        // Create player
        this.player = new Player(this, 400, 200);

        // Create a progress bar background and fill for health bar
        this.healthBarBackground = this.add.rectangle(200, 50, 300, 50, 0xFF0000);
        this.healthBarFill = this.add.rectangle(200, 50, 300, 50, 0x00FF00);

        this.playerHealth = 100.0;

        // Load enemy skeleton
        this.skeletonEnemy = new Skeleton(this, 600, 200);

        // Used to reset player damage value once the callback function is called
        this.timeToResetPlayerDamage = 0.5;
    }

    update()
    {
        // Check if the player's health is 0 and if they're not in a dead state yet
        if (this.playerHealth <= 0.0 && !this.player.getIsDead())
        {
            this.playerHealth = 0.0;

            // Update health bar width to reflect health change
            this.healthBarFill.width = 300 * (this.playerHealth / 100.0);
            
            // Set player to dead once their health reaches 0 and trigger death animation
            this.player.setPlayerToDead();
        }

        if (!this.player.getIsDead()) // If player isn't dead
        {
            // Movement input
            if (this.aKey.isDown)
            {
                this.player.moveLeft(this.sys.game, this.damageTimer);
            }

            if (this.dKey.isDown)
            {
                this.player.moveRight(this.sys.game, this.damageTimer);
            }

            if (this.wKey.isDown)
            {
                this.player.moveUp(this.sys.game, this.damageTimer);
            }

            if (this.sKey.isDown)
            {
                this.player.moveDown(this.sys.game, this.damageTimer);
            }

            else if (this.aKey.isUp && this.dKey.isUp && this.wKey.isUp && this.sKey.isUp)
            {
                this.player.idle();
            }

            // If the player is inside the fire, damage them
            if (this.movingEntityInsideOfFire(this.player) && this.damageTimer == null)
            {
                this.player.animatePlayerDamage();

                // Call the reset player damage callback function to reset player damage value
                this.damageTimer = this.time.delayedCall(this.timeToResetPlayerDamage * 1000.0, 
                    this.onResetPlayerDamaged, [], this);
                
                this.playerHealth -= 20.0;

                // Update health bar width to reflect health change
                this.healthBarFill.width = 300 * (this.playerHealth / 100.0);
            }
        }

        // Player inside of vending machine
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

                // Update health bar width to reflect health change
                this.healthBarFill.width = 300 * (this.playerHealth / 100.0);
            }
        }

        // Else player left vending machine
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

        if (this.skeletonEnemy != null)
        {
            // Play player hit damage animation
            if (this.skeletonEnemy.IsWithinAttackingRange(this.player) && this.damageTimer == null)
            {
                this.player.animatePlayerDamage();

                // Call the reset player damage callback function to reset player damage value
                this.damageTimer = this.time.delayedCall(this.timeToResetPlayerDamage * 1000.0, 
                    this.onResetPlayerDamaged, [], this);

                this.playerHealth -= 2.0;

                // Update health bar width to reflect health change
                this.healthBarFill.width = 300 * (this.playerHealth / 100.0);
            }
            
            // Move the enemy towards the player
            this.skeletonEnemy.moveToPlayer(this.player, this.sys.game);

            if (this.movingEntityInsideOfFire(this.skeletonEnemy))
            {
                this.skeletonEnemy.damageSkeleton(1.0);
            }
        }

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

    movingEntityInsideOfFire(entity)
    {
        if (entity.getWorldPoint().x > this.fire1.getWorldPoint().x - 10.0 &&
            entity.getWorldPoint().x < this.fire1.getWorldPoint().x + 20.0 &&
            entity.getWorldPoint().y > this.fire1.getWorldPoint().y - 50.0 &&
            entity.getWorldPoint().y < this.fire1.getWorldPoint().y + 50.0)
        {
            return true;
        }

        else if (entity.getWorldPoint().x > this.fire2.getWorldPoint().x - 10.0 &&
            entity.getWorldPoint().x < this.fire2.getWorldPoint().x + 20.0 &&
            entity.getWorldPoint().y > this.fire2.getWorldPoint().y - 50.0 &&
            entity.getWorldPoint().y < this.fire2.getWorldPoint().y + 50.0)
        {
            return true;
        }

        else if (entity.getWorldPoint().x > this.fire3.getWorldPoint().x - 10.0 &&
            entity.getWorldPoint().x < this.fire3.getWorldPoint().x + 20.0 &&
            entity.getWorldPoint().y > this.fire3.getWorldPoint().y - 50.0 &&
            entity.getWorldPoint().y < this.fire3.getWorldPoint().y + 50.0)
        {
            return true;
        }

        else if (entity.getWorldPoint().x > this.fire4.getWorldPoint().x - 10.0 &&
            entity.getWorldPoint().x < this.fire4.getWorldPoint().x + 20.0 &&
            entity.getWorldPoint().y > this.fire4.getWorldPoint().y - 50.0 &&
            entity.getWorldPoint().y < this.fire4.getWorldPoint().y + 50.0)
        {
            return true;
        }

        return false;
    }

    onResetPlayerDamaged()
    {
        this.damageTimer = null;
    }
}