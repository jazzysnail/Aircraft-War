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
    this.__parent = this.node.parent;
  },
  /**
   * 碰撞检测回调
   */
  onCollisionEnter() {
    if (this.node.parent.isGameing) {
      this.bleed();
    }
  },
  /**
   * 掉血
   */
  bleed() {
    this.hp--;
    if(!this.health) {
        this.blowUp();
    }
  },
  /**
   * 起飞
   */
  fly() {
    this.node.runAction(this.flyAction);
    // 监听父级末日事件 自爆
    let vm = this;
    this.node.parent.on('doom', function() {
      vm.blowUp();
    });
  },
  /**
   * 停止飞行
   */
  stop() {
    this.node.stopAction(this.flyAction);
  },
  /**
   * 飞机的飞行姿态
   * @return {cc.Action}
   */
  setFlyAction() {
    let node = this.node;
    let fly = cc.moveBy(this.flyDuration, cc.p(0, -(node.parent.height+node.height)));
    let callback = cc.callFunc(this.onEnemyHitOrDisappeared, this);
    return cc.sequence(fly, callback);
  },
  /**
   * 当飞机被击毁或者飞出屏幕
   */
  onEnemyHitOrDisappeared() {
    this.stop(); // 停止飞行动画
    this.hp = this.__hp;
    this.main.enemyMap[this.type].pool.put(this.node);
  },
  /**
   * 炸毁
   */
  blowUp() {
    let vm = this;
    let act = this.getComponent(cc.Animation);
    act.on('finished', this.onEnemyHitOrDisappeared, vm);
    act.play(this.name.replace(/^(.+)<.+$/, (m, $1) => `${$1}-blow-up`));
  },
});
