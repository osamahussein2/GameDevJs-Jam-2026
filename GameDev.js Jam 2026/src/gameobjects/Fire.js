export class Fire extends Phaser.Physics.Arcade.Sprite
{
    constructor(scene, x, y)
    {
        super(scene, x, y, 'Fire');

        scene.add.existing(this);

        this.setScale(10.0, 10.0);

        this.initializeFire();
    }

    initializeFire()
    {
        this.anims.create({
            key: 'fire',
            frames: this.anims.generateFrameNumbers('Fire', {start: 0, end: 2}),
            frameRate: 10,
            repeat: -1
        });

        this.anims.play('fire', true);
    }
}