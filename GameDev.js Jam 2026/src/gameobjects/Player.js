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
            frames: this.anims.generateFrameNumbers('PlayerIdle', {start: 0, end: 6}),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNumbers('PlayerWalk', {start: 0, end: 7}),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'damaged',
            frames: this.anims.generateFrameNumbers('PlayerDamaged', {start: 0, end: 3}),
            frameRate: 20,
            repeat: 0
        });

        this.anims.create({
            key: 'death',
            frames: this.anims.generateFrameNumbers('PlayerDeath', {start: 0, end: 3}),
            frameRate: 20,
            repeat: 0
        });

        this.anims.play('idle', true);

        this.playerX = 0.0;
        this.playerY = 0.0;

        this.playerSpeed = 100.0;

        this.playerPosX = this.getWorldPoint().x;
        this.playerPosY = this.getWorldPoint().y;

        this.minLeftPoint = 30.0;
        this.maxRightPoint = 1170.0;

        this.minYPoint = 50.0;
        this.maxYPoint = 650.0;

        this.isDead = false;
    }

    moveLeft(game, isDamaged)
    {
        if (this.getWorldPoint().x > this.minLeftPoint) this.playerX -= this.playerSpeed * (game.loop.delta / 1000.0);

        this.setPosition(this.playerPosX + this.playerX, this.playerPosY + this.playerY);

        if (!this.flipX) this.flipX = true;
        if (this.anims.key != 'walk' && isDamaged == null) this.anims.play('walk', true);
    }

    moveRight(game, isDamaged)
    {
        if (this.getWorldPoint().x < 1170.0) this.playerX += this.playerSpeed * (game.loop.delta / 1000.0);

        this.setPosition(this.playerPosX + this.playerX, this.playerPosY + this.playerY);

        if (this.flipX) this.flipX = false;
        if (this.anims.key != 'walk' && isDamaged == null) this.anims.play('walk', true);
    }

    moveUp(game, isDamaged)
    {
        if (this.getWorldPoint().y > this.minYPoint) this.playerY -= this.playerSpeed * (game.loop.delta / 1000.0);

        this.setPosition(this.playerPosX + this.playerX, this.playerPosY + this.playerY);

        if (this.anims.key != 'walk' && isDamaged == null) this.anims.play('walk', true);
    }

    moveDown(game, isDamaged)
    {
        if (this.getWorldPoint().y < this.maxYPoint) this.playerY += this.playerSpeed * (game.loop.delta / 1000.0);

        this.setPosition(this.playerPosX + this.playerX, this.playerPosY + this.playerY);

        if (this.anims.key != 'walk' && isDamaged == null) this.anims.play('walk', true);
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
        if (this.getWorldPoint().x < this.minLeftPoint) this.setPosition(this.minLeftPoint, this.getWorldPoint().y);
        else if (this.getWorldPoint().x > this.minRightPoint) this.setPosition(this.minRightPoint, this.getWorldPoint().y);
        
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