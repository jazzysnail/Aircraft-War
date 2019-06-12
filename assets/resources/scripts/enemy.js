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
    },
    flyDuration: 3,
    type: {
      default: 0
    },
    main: {
      default: null,
      serializable: false
    }
  },

  onLoad () {
    this.flyAction = this.setFlyAction();
    this.__hp = this.hp;
  },

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

  // 执行子弹飞行动作
  fly() {
    this.node.runAction(this.flyAction);
  },
  stop() {
    this.node.stopAction(this.flyAction);
  },
  // 定义子弹飞行的动作
  setFlyAction() {
    let node = this.node;
    let fly = cc.moveBy(this.flyDuration, cc.p(0, -(node.parent.height+node.height)));
    let callback = cc.callFunc(this.onEnemyHitOrDisappeared, this);
    return cc.sequence(fly, callback);
  },

  onEnemyHitOrDisappeared(e) {
    this.stop(); // 停止飞行动画
    this.hp = this.__hp;
    this.main.enemyMap[this.type].pool.put(this.node);
  },

  // 炸毁 多态的部分
  blowUp() {
    let vm = this;
    let act = this.getComponent(cc.Animation);
    act.on('finished', this.onEnemyHitOrDisappeared, vm);
    act.play(this.name.replace(/^(.+)<.+$/, (m, $1) => `${$1}-blow-up`));
  },
});
