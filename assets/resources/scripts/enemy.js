cc.Class({
    extends: cc.Component,

    properties: {
        hp: {
            default: 1,
            displayName: "生命值",
        },
        health: {
            get: function() {
                return (this.hp !== 0)
            }
        }
    },

    // onLoad () {},

    // update (dt) {},

    onCollisionEnter() {
        this.bleed();
    },

    // 耗血
    bleed() {
        this.hp--;
        if(!this.health) {
            this.blowUp();
        }
    },

    // 炸毁 多态的部分
    blowUp() {
        cc.log('炸毁');
        // this.stop(); // 停止飞行动画
        // this.onBulletHitOrDisappeared(this.node); // 销毁自身节点
        // this.getComponent(cc.Animation).play('blowUp');
        // this.isBlowUp = true;
    },
});
