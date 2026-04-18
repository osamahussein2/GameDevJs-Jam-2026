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
            frames: this.anims.generateFrameNumbers('EnemyRun', {start: 0, end: 7}),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'attack',
            frames: this.anims.generateFrameNumbers('EnemyAttack', {start: 0, end: 5}),
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

        this.isAttacking = false;
    }

    moveToPlayer(player, game)
    {
        if (!this.isAttacking)
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

            console.log(this.distanceToPlayer);

            if (this.distanceToPlayerX <= this.attackingRange &&
                this.distanceToPlayerY <= this.attackingRange) // Reached player location
            {
                player.isDamaged = false;

                console.log('attack player');
                if (this.anims.key != 'attack') this.anims.play('attack', false);

                this.isAttacking = true;
            }
        }

        else
        {
            if (!this.anims.isPlaying) this.isAttacking = false;
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
}