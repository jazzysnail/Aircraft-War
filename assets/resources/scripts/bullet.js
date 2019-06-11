/**
 * 子弹行为组件
 */
cc.Class({
  extends: cc.Component,

  properties: {
    range: {
      default: 600,
      displayName: "射程",
      tooltip: "子弹射出后开始消亡的距离（px）"
    },
    type: {
      default: 0,
      serializable: false
    },
    player: {
      default: null,
      serializable: false
    }
  },

  onLoad() {
    // 计算子弹飞行时长（射速 射程）s
    this.flyDuration = 0.5;
    this.flyAction = this.setFlyAction();
  },

  // 执行子弹飞行动作
  fly() {
    this.node.runAction(this.flyAction);
  },

  // 定义子弹飞行的动作
  setFlyAction() {
    let fly = cc.moveBy(this.flyDuration, cc.p(0, this.range));
    let callback = cc.callFunc(this.onBulletHitOrDisappeared, this);
    return cc.sequence(fly, callback);
  },
  // 当子弹击中或消失时
  onBulletHitOrDisappeared(target) {
    let { pool } = this.player.bulletMap[this.type];
    pool.put(target);
  }
});
