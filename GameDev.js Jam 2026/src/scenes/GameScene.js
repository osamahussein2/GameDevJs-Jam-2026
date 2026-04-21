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
        
        this.load.spritesheet('PlayerRun', 'art/Player/RunPlayerCharacter.png', 
            { frameWidth: 33, frameHeight: 45 });
        
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

        this.leftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        this.rightKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        this.upKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        this.downKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);

        this.eKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E); // Interact

        this.pKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);
        this.enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

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

        this.spawnTimer = 0.0;
        this.timeToSpawnEnemies = 2.0;

        // Used to reset player damage value once the callback function is called
        this.timeToResetPlayerDamage = 0.5;

        this.timeToShowGameOver = 2.0;

        // Initialize empty array
        this.enemies = [];

        this.enemiesSpawned = 0;
        this.maxEnemiesToSpawn = 100;

        // Score
        this.score = 0;

        this.scoreText = this.add.text(50, 100, 'Score: ' + this.score, { fontSize: '32px', fill: '#FFFFFF' });

        this.isGamePaused = false;

        // Vending machine cooldown time
        this.vendingMachineCooldownTime = 30.0;

        this.vendingMachineTimer = this.vendingMachineCooldownTime;
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

            // Call the show game over callback function
            this.gameOverTimer = this.time.delayedCall(this.timeToShowGameOver * 1000.0, 
                this.onShowGameOver, [], this);
        }

        if (!this.player.getIsDead()) // If player isn't dead
        {
            if (!this.isGamePaused)
            {
                // Increment vending machine timer so the player can use it to heal their health
                if (this.vendingMachineTimer <= this.vendingMachineCooldownTime) 
                {
                    this.vendingMachineTimer += this.sys.game.loop.delta / 1000.0;
                }

                this.player.resumeAnimations();

                // Pause game input
                if (Phaser.Input.Keyboard.JustDown(this.pKey))
                {
                    this.initializePauseMenu();
                    this.isGamePaused = true;
                }

                // Movement input
                if (this.aKey.isDown || this.leftKey.isDown)
                {
                    this.player.moveLeft(this.sys.game, this.damageTimer);
                }

                if (this.dKey.isDown || this.rightKey.isDown)
                {
                    this.player.moveRight(this.sys.game, this.damageTimer);
                }

                if (this.wKey.isDown || this.upKey.isDown)
                {
                    this.player.moveUp(this.sys.game, this.damageTimer);
                }

                if (this.sKey.isDown|| this.downKey.isDown)
                {
                    this.player.moveDown(this.sys.game, this.damageTimer);
                }

                // Not holding any of the movement keys
                else if (this.aKey.isUp && this.dKey.isUp && this.wKey.isUp && this.sKey.isUp &&
                    this.leftKey.isUp && this.rightKey.isUp && this.upKey.isUp && this.downKey.isUp)
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

            else
            {
                this.player.pauseAnimations();

                if (this.enterKey.isDown) // Press ENTER to go to main menu
                {
                    this.scene.stop(this);
                    this.scene.start('MainMenu');
                }

                if (Phaser.Input.Keyboard.JustDown(this.pKey)) // Press P to resume
                {
                    this.destroyPauseMenu();
                    this.isGamePaused = false;
                }
            }
        }

        if (!this.isGamePaused)
        {
            // Player inside of vending machine
            if (this.playerInsideOfHealthVendingMachine())
            {
                //console.log('Collided with health vending machine');

                if (this.healthVendingMachine.tint != 0xFF0000 && 
                    this.vendingMachineTimer >= this.vendingMachineCooldownTime)
                {
                    this.eKeyImage = this.add.image(400, 200, 'EKeyImage');
                    this.eKeyImage.setScale(0.05, 0.05);

                    this.healthVendingMachine.setTint(0xFF0000);
                }

                if (this.eKey.isDown && this.playerHealth < 100.0 && this.eKeyImage != null)
                {
                    // Set vending machine back to white
                    if (this.healthVendingMachine.tint != 0xFFFFFF)
                    {
                        this.eKeyImage.destroy();
                        this.eKeyImage = null;

                        this.healthVendingMachine.setTint(0xFFFFFF);
                    }

                    this.playerHealth = 100.0; // Reset to player's max health

                    // Update health bar width to reflect health change
                    this.healthBarFill.width = 300 * (this.playerHealth / 100.0);

                    this.vendingMachineTimer = 0.0; // Reset vending machine timer to 0
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

            this.spawnTimer += this.sys.game.loop.delta / 1000.0;
            
            if (this.enemiesSpawned < this.maxEnemiesToSpawn && 
                this.spawnTimer >= this.timeToSpawnEnemies) 
            {
                this.spawnEnemies();
                this.spawnTimer = 0.0;

                this.enemiesSpawned++;

                if (this.enemiesSpawned == 5) this.timeToSpawnEnemies = 1.0;
                else if (this.enemiesSpawned == 10) this.timeToSpawnEnemies = 0.5;
            }

            // Resume all animations and update enemies logic
            this.resumeAllAnimations();
            this.updateEnemies();

            // Prevent the player from being able to move offscreen
            this.player.preventPlayerFromMovingOffscreen();
        }

        else // If game is paused, pause all animations
        {
            this.pauseAllAnimations();
        }
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
        if (entity.getWorldPoint().x > this.fire1.getWorldPoint().x - 35.0 &&
            entity.getWorldPoint().x < this.fire1.getWorldPoint().x + 35.0 &&
            entity.getWorldPoint().y > this.fire1.getWorldPoint().y - 30.0 &&
            entity.getWorldPoint().y < this.fire1.getWorldPoint().y + 50.0)
        {
            return true;
        }

        else if (entity.getWorldPoint().x > this.fire2.getWorldPoint().x - 35.0 &&
            entity.getWorldPoint().x < this.fire2.getWorldPoint().x + 35.0 &&
            entity.getWorldPoint().y > this.fire2.getWorldPoint().y - 30.0 &&
            entity.getWorldPoint().y < this.fire2.getWorldPoint().y + 50.0)
        {
            return true;
        }

        else if (entity.getWorldPoint().x > this.fire3.getWorldPoint().x - 35.0 &&
            entity.getWorldPoint().x < this.fire3.getWorldPoint().x + 35.0 &&
            entity.getWorldPoint().y > this.fire3.getWorldPoint().y - 30.0 &&
            entity.getWorldPoint().y < this.fire3.getWorldPoint().y + 50.0)
        {
            return true;
        }

        else if (entity.getWorldPoint().x > this.fire4.getWorldPoint().x - 35.0 &&
            entity.getWorldPoint().x < this.fire4.getWorldPoint().x + 35.0 &&
            entity.getWorldPoint().y > this.fire4.getWorldPoint().y - 30.0 &&
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

    onShowGameOver()
    {
        this.gameOverTimer = null;

        if (this.eKeyImage != null) 
        {
            this.eKeyImage.destroy();
            this.eKeyImage = null;
        }

        for (this.enemy of this.enemies) 
        {
            if (this.enemy != null)
            {
                this.enemy.destroy();
                this.enemy = null;
            }
        }

        if (this.enemies.length > 0) this.enemies.pop();

        this.scene.stop(this);
        this.scene.start('GameOverMenu', { score: this.score });
    }

    spawnEnemies()
    {
        this.randomizedPositionX = Phaser.Math.FloatBetween(150, 1000);
        this.randomizedPositionY = Phaser.Math.FloatBetween(100, 600);
        
        // Add the skeleton enemy to the enemies array
        Phaser.Utils.Array.Add(this.enemies, new Skeleton(this, this.randomizedPositionX, this.randomizedPositionY));
    }

    resumeAllAnimations()
    {
        this.fire1.resumeAnimations();
        this.fire2.resumeAnimations();
        this.fire3.resumeAnimations();
        this.fire4.resumeAnimations();
    }

    updateEnemies()
    {
        for (const enemy of this.enemies) 
        {
            if (enemy != null)
            {
                enemy.resumeAnimations();

                // Play player hit damage animation
                if (enemy.IsWithinAttackingRange(this.player) && this.damageTimer == null)
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
                enemy.moveToPlayer(this.player, this.sys.game);

                if (this.movingEntityInsideOfFire(enemy))
                {
                    enemy.damageSkeleton(1.0);                    
                }

                // If enemy's health reaches 0, decrement enemies spawned and increment the score
                if (enemy.getHealth() <= 0.0)
                {
                    this.enemiesSpawned--;
                    this.score++;

                    this.scoreText.setText('Score: ' + this.score);

                    enemy.destroy(); // Also destroy this enemy and remove it from the enemies array

                    Phaser.Utils.Array.Remove(this.enemies, enemy);
                }
            }
        }
    }

    pauseAllAnimations()
    {
        for (const enemy of this.enemies) 
        {
            if (enemy != null)
            {
                enemy.pauseAnimations();
            }
        }

        this.fire1.pauseAnimations();
        this.fire2.pauseAnimations();
        this.fire3.pauseAnimations();
        this.fire4.pauseAnimations();
    }

    initializePauseMenu()
    {
        // Add a semi-transparent image as an overlay for pause menu
        this.semiTransparentImage = this.add.rectangle(this.gameWidth / 2.0, this.gameHeight / 2.0, this.gameWidth, 
            this.gameHeight, 0x000000, 0.5);
        
        this.semiTransparentImage.setOrigin(0.5, 0.5);

        // Add a fully opaque black image as overlay for the texts (not including the pause menu title)
        this.blackImage = this.add.rectangle(this.gameWidth / 2.0, this.gameHeight / 1.15, 500, 150, 0x000000);
        
        this.blackImage.setOrigin(0.5, 0.5);

        // Pause Menu text
        this.pauseMenuText = this.add.text(this.gameWidth / 2.0, this.gameHeight / 10.0, 
            'Pause Menu', { fontFamily: 'Arial', fontSize: 60, color: '#FFFFFF' });
        
        this.pauseMenuText.setOrigin(0.5, 0.5);
        
        // P key text
        this.pKeyText = this.add.text(this.gameWidth / 2.0, this.gameHeight / 1.2, 
            'Press P to resume!', { fontFamily: 'Arial', fontSize: 30, color: '#FFFFFF' });

        this.pKeyText.setOrigin(0.5, 0.5);
        
        // Enter key text
        this.enterKeyText = this.add.text(this.gameWidth / 2.0, this.gameHeight / 1.1, 
            'Press ENTER to quit to main menu!', { fontFamily: 'Arial', fontSize: 30, color: '#FFFFFF' });
        
        this.enterKeyText.setOrigin(0.5, 0.5);
    }

    destroyPauseMenu()
    {
        // Destroy every pause menu object
        if (this.pauseMenuText != null)
        {
            this.pauseMenuText.destroy();
            this.pauseMenuText = null;
        }

        if (this.pKeyText != null)
        {
            this.pKeyText.destroy();
            this.pKeyText = null;
        }

        if (this.enterKeyText != null)
        {
            this.enterKeyText.destroy();
            this.enterKeyText = null;
        }

        if (this.blackImage != null)
        {
            this.blackImage.destroy();
            this.blackImage = null;
        }

        if (this.semiTransparentImage != null)
        {
            this.semiTransparentImage.destroy();
            this.semiTransparentImage = null;
        }
    }
}