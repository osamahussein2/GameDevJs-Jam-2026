export class Player extends Phaser.Physics.Arcade.Sprite
{
    constructor(scene, x, y)
    {
        super(scene, x, y, 'PlayerIdle');

        scene.add.existing(this);

        this.initAnimations();
    }

    initAnimations()
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

        this.anims.play('idle', true);

        this.playerX = 0.0;
        this.playerSpeed = 5.0;
    }

    moveLeft(game)
    {
        this.playerX -= this.playerSpeed * (game.loop.delta / 1000.0);

        this.setPosition(this.getWorldPoint().x + this.playerX, this.getWorldPoint().y);

        if (!this.flipX) this.flipX = true;
        this.anims.play('walk', true);
    }

    moveRight(game)
    {
        this.playerX += this.playerSpeed * (game.loop.delta / 1000.0);

        this.setPosition(this.getWorldPoint().x + this.playerX, this.getWorldPoint().y);

        if (this.flipX) this.flipX = false;
        this.anims.play('walk', true);
    }

    idle()
    {
        if (this.playerX != 0.0) this.playerX = 0.0;

        if (this.flipX) this.flipX = false;
        this.anims.play('idle', true);
    }
}