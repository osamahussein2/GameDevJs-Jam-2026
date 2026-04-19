export class Skeleton extends Phaser.Physics.Arcade.Sprite
{
    constructor(scene, x, y)
    {
        super(scene, x, y, 'EnemyIdle');

        scene.add.existing(this);

        this.setScale(2, 2);

        this.initializeSkeleton();
    }

    initializeSkeleton()
    {
        this.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNumbers('EnemyIdle', {start: 0, end: 5}),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'run',
            frames: this.anims.generateFrameNumbers('EnemyRun', {start: 0, end: 5}),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'attack',
            frames: this.anims.generateFrameNumbers('EnemyAttack', {start: 0, end: 5}),
            frameRate: 10,
            repeat: 0
        });

        this.anims.create({
            key: 'hurt',
            frames: this.anims.generateFrameNumbers('EnemyHurt', {start: 0, end: 1}),
            frameRate: 10,
            repeat: 0
        });

        this.anims.play('idle', true);

        this.playerX = 0.0;
        this.playerY = 0.0;

        this.playerSpeed = 100.0;

        this.skeletonPosX = this.getWorldPoint().x;
        this.skeletonPosY = this.getWorldPoint().y;

        this.movePosX = 0.0;
        this.movePosY = 0.0;

        this.skeletonSpeed = 50.0;
        this.attackingRange = 50.0;

        this.isDamaged = false;
        this.isAttacking = false;

        this.enemyHealth = 100.0;
    }

    moveToPlayer(player, game)
    {
        if (this == null || this.anims == null) return;

        if (!this.isAttacking && !this.isDamaged && !player.getIsDead())
        {
            if (this.getWorldPoint().x < player.getWorldPoint().x) 
            {
                this.movePosX += this.skeletonSpeed * (game.loop.delta / 1000.0);

                if (!this.flipX) this.flipX = true;
                if (this.anims.key != 'run') this.anims.play('run', true);
            }

            else if (this.getWorldPoint().x > player.getWorldPoint().x) 
            {
                this.movePosX -= this.skeletonSpeed * (game.loop.delta / 1000.0);

                if (this.flipX) this.flipX = false;
                if (this.anims.key != 'run') this.anims.play('run', true);
            }

            if (this.getWorldPoint().y < player.getWorldPoint().y) 
            {
                this.movePosY += this.skeletonSpeed * (game.loop.delta / 1000.0);
                if (this.anims.key != 'run') this.anims.play('run', true);
            }
            else if (this.getWorldPoint().y > player.getWorldPoint().y) 
            {
                this.movePosY -= this.skeletonSpeed * (game.loop.delta / 1000.0);
                if (this.anims.key != 'run') this.anims.play('run', true);
            }

            this.distanceToPlayerX = Math.abs(this.getWorldPoint().x - player.getWorldPoint().x);
            this.distanceToPlayerY = Math.abs(this.getWorldPoint().y - player.getWorldPoint().y);

            //console.log(this.distanceToPlayer);

            if (this.distanceToPlayerX <= this.attackingRange &&
                this.distanceToPlayerY <= this.attackingRange &&
                !player.getIsDead()) // Reached player location
            {
                //console.log('attack player');
                if (this.anims.key != 'attack') this.anims.play('attack', false);

                this.isAttacking = true;
            }
        }

        else if (this.isAttacking)
        {
            if (!this.anims.isPlaying) this.isAttacking = false;
        }

        else if (player.getIsDead())
        {
            // Move back to its starting position
            if (this.getWorldPoint().x < this.skeletonPosX - 1.0) 
            {
                this.movePosX += this.skeletonSpeed * (game.loop.delta / 1000.0);

                if (!this.flipX) this.flipX = true;
                if (this.anims.key != 'run') this.anims.play('run', true);
            }

            else if (this.getWorldPoint().x > this.skeletonPosX + 1.0) 
            {
                this.movePosX -= this.skeletonSpeed * (game.loop.delta / 1000.0);

                if (this.flipX) this.flipX = false;
                if (this.anims.key != 'run') this.anims.play('run', true);
            }

            else if (this.getWorldPoint().y < this.skeletonPosY - 1.0) 
            {
                this.movePosY += this.skeletonSpeed * (game.loop.delta / 1000.0);
                if (this.anims.key != 'run') this.anims.play('run', true);
            }
            else if (this.getWorldPoint().y > this.skeletonPosY + 1.0) 
            {
                this.movePosY -= this.skeletonSpeed * (game.loop.delta / 1000.0);
                if (this.anims.key != 'run') this.anims.play('run', true);
            }

            else // Reached destination, can stop moving and play its idle animation
            {
                if (this.anims.key != 'idle') this.anims.play('idle', true);
            }
        }
        
        //console.log(this.directionToPlayerX, ':', this.directionToPlayerY);

        //console.log(player.getWorldPoint().x, ':', player.getWorldPoint().y);

        //console.log(this.getWorldPoint().x, ':', this.getWorldPoint().y);
        
        this.setPosition(this.skeletonPosX + this.movePosX, this.skeletonPosY + this.movePosY);
    }

    IsWithinAttackingRange(player)
    {
        this.distanceToPlayerX = Math.abs(this.getWorldPoint().x - player.getWorldPoint().x);
        this.distanceToPlayerY = Math.abs(this.getWorldPoint().y - player.getWorldPoint().y);
        
        if (this.distanceToPlayerX <= this.attackingRange &&
            this.distanceToPlayerY <= this.attackingRange && this.isAttacking)
        {
            return true;
        }
        
        return false;
    }

    IsAttacking()
    {
        return this.isAttacking;
    }

    damageSkeleton(value)
    {
        this.enemyHealth -= value;
        this.isDamaged = true;

        if (this.anims != null && this.anims.key != 'hurt') this.anims.play('hurt', false);

        if (this.enemyHealth <= 0.0)
        {
            this.destroy();
        }
    }
}