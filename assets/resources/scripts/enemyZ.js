var Enemy = require("enemy");

cc.Class({
    extends: Enemy,

    // 重写炸毁的部分
    blowUp() {
        cc.log('炸毁');
        // this.stop(); // 停止飞行动画
        // this.onBulletHitOrDisappeared(this.node); // 销毁自身节点
        this.getComponent(cc.Animation).play('e-z-b-u');
        // this.isBlowUp = true;
    },
});
