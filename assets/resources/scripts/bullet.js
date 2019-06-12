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

  /**
   * 当碰撞产生的时候调用
   * @param  {Collider} other 产生碰撞的另一个碰撞组件
   * @param  {Collider} self  产生碰撞的自身的碰撞组件
   */
  onCollisionEnter() {
      this.stop(); // 停止飞行动画
      this.onBulletHitOrDisappeared(this.node); // 销毁自身节点

      // 碰撞系统会计算出碰撞组件在世界坐标系下的相关的值，并放到 world 这个属性里面
      // var world = self.world;

      // 碰撞组件的 aabb 碰撞框
      // var aabb = world.aabb;

      // 上一次计算的碰撞组件的 aabb 碰撞框
      // var preAabb = world.preAabb;

      // 碰撞框的世界矩阵
      // var t = world.transform;

      // 以下属性为圆形碰撞组件特有属性
      // var r = world.radius;
      // var p = world.position;

      // 以下属性为 矩形 和 多边形 碰撞组件特有属性
      // var ps = world.points;
  },

  // 执行子弹飞行动作
  fly() {
    this.node.runAction(this.flyAction);
  },
  stop() {
    this.node.stopAction(this.flyAction);
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
