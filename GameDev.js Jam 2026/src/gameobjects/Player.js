export class Player extends Phaser.Physics.Arcade.Sprite
{
    constructor(scene, x, y)
    {
        super(scene, x, y, 'PlayerIdle');

        scene.add.existing(this);

        this.setScale(2, 2);

        this.initializePlayer();
    }

    initializePlayer()
    {
        this.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNumbers('PlayerIdle', {start: 0, end: 16}),
            frameRate: 30,
            repeat: -1
        });

        this.anims.create({
            key: 'run',
            frames: this.anims.generateFrameNumbers('PlayerRun', {start: 0, end: 6}),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'damaged',
            frames: this.anims.generateFrameNumbers('PlayerDamaged', {start: 0, end: 2}),
            frameRate: 20,
            repeat: 0
        });

        this.anims.create({
            key: 'death',
            frames: this.anims.generateFrameNumbers('PlayerDeath', {start: 0, end: 1}),
            frameRate: 20,
            repeat: 0
        });

        this.anims.play('idle', true);

        this.playerX = 0.0;
        this.playerY = 0.0;

        this.playerSpeed = 150.0;

        this.playerPosX = this.getWorldPoint().x;
        this.playerPosY = this.getWorldPoint().y;

        this.minXPoint = 60.0;
        this.maxXPoint = 1225.0;

        this.minYPoint = 50.0;
        this.maxYPoint = 640.0;

        this.isDead = false;
    }

    moveLeft(game, isDamaged)
    {
        if (this.getWorldPoint().x > this.minXPoint) this.playerX -= this.playerSpeed * (game.loop.delta / 1000.0);

        this.setPosition(this.playerPosX + this.playerX, this.playerPosY + this.playerY);

        if (!this.flipX) this.flipX = true;
        if (this.anims.key != 'run' && isDamaged == null) this.anims.play('run', true);
    }

    moveRight(game, isDamaged)
    {
        if (this.getWorldPoint().x < this.maxXPoint) this.playerX += this.playerSpeed * (game.loop.delta / 1000.0);

        this.setPosition(this.playerPosX + this.playerX, this.playerPosY + this.playerY);

        if (this.flipX) this.flipX = false;
        if (this.anims.key != 'run' && isDamaged == null) this.anims.play('run', true);
    }

    moveUp(game, isDamaged)
    {
        if (this.getWorldPoint().y > this.minYPoint) this.playerY -= this.playerSpeed * (game.loop.delta / 1000.0);

        this.setPosition(this.playerPosX + this.playerX, this.playerPosY + this.playerY);

        if (this.anims.key != 'run' && isDamaged == null) this.anims.play('run', true);
    }

    moveDown(game, isDamaged)
    {
        if (this.getWorldPoint().y < this.maxYPoint) this.playerY += this.playerSpeed * (game.loop.delta / 1000.0);

        this.setPosition(this.playerPosX + this.playerX, this.playerPosY + this.playerY);

        if (this.anims.key != 'run' && isDamaged == null) this.anims.play('run', true);
    }

    animatePlayerDamage()
    {
        if (this.anims.key != 'damaged' && !this.isDead) this.anims.play('damaged', true);
    }

    idle()
    {
        if (this.flipX) this.flipX = false;
        if (this.anims.key != 'idle') this.anims.play('idle', true);
    }

    preventPlayerFromMovingOffscreen()
    {
        if (this.getWorldPoint().x < this.minXPoint) this.setPosition(this.minXPoint, this.getWorldPoint().y);
        else if (this.getWorldPoint().x > this.maxXPoint) this.setPosition(this.maxXPoint, this.getWorldPoint().y);
        
        else if (this.getWorldPoint().y < this.minYPoint) this.setPosition(this.getWorldPoint().x, this.minYPoint);
        else if (this.getWorldPoint().y > this.maxYPoint) this.setPosition(this.getWorldPoint().x, this.maxYPoint);
    }

    getIsDead()
    {
        return this.isDead;
    }

    setPlayerToDead()
    {
        this.isDead = true;
        if (this.anims.key != 'death') this.anims.play('death', true);
    }

    deathAnimationFinished()
    {
        return this.isDead && !this.anims.isPlaying();
    }

    pauseAnimations()
    {
        if (!this.anims.isPaused) this.anims.pause();
    }

    resumeAnimations()
    {
        if (this.anims.isPaused) this.anims.resume();
    }
}