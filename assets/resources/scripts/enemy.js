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
    score: {
      default: 1000,
      displayName: "击杀得分",
    },
    // flyDuration: 10, // 待删除
    v: {
      default: 70,
      displayName: "初速度",
      tooltip: "起飞初速度（px/s）"
    },
    a: {
      default: 1,
      displayName: "加速度",
      tooltip: "随游戏时长的加速度（px/s²）"
    },
    fluctuation: {
      default: 10,
      displayName: "波动半径",
      tooltip: "飞行速度波动半径 (px/s)"
    },
    type: {
      default: 0,
      serializable: false
    },
    main: {
      default: null,
      serializable: false
    }
  },

  onLoad () {
    // this.flyAction = this.setFlyAction();
    this.__hp = this.hp;
    this.__flyAction = null;
    this.node.parent.on('doom', this.__handleDoom, this);
  },
  /**
   * 碰撞检测回调
   */
  onCollisionEnter() {
    if (this.main.state.isGameing) {
      this.bleed();
    }
  },
  /**
   * 掉血
   */
  bleed() {
    this.hp--;
    if(!this.health) {
        this.blowUp(1);
    }
  },
  /**
   * 监听父级末日事件 自爆
   * @param  {[type]} e.detail doom 方法调用来源 ['初始清屏', '道具清屏']
   */
  __handleDoom(e) {
    this.blowUp(e.detail);
  },

  takeOff() {
    this.__flyAction = this.setFlyAction();
    this.node.runAction(this.__flyAction);
  },

  landing() {
    this.node.stopAction(this.__flyAction);
  },
  /**
   * 飞行姿态
   * @return {cc.Action}
   */
  setFlyAction() {
    let { node, v, a, fluctuation } = this;
    let { node: { height }, state: { sts } } = this.main;
    let m = height + node.height;
    let duration = sts !== 0 ? Math.floor((Date.now() - sts)/1e3) : 0; // 游戏时长
    this.v = duration * a + v;
    // 加入速度波动生成起飞初始速度
    v = Math.floor(Math.random() * (fluctuation * 2 + 0.1) + (this.v-fluctuation));
    let fly = cc.moveBy(Math.floor(m/v), cc.p(0, -(height+node.height)));
    let callback = cc.callFunc(this.onEnemyHitOrDisappeared, this);
    return cc.sequence(fly, callback);
  },
  /**
   * 当飞机被击毁或者飞离屏幕
   */
  onEnemyHitOrDisappeared() {
    this.landing(); // 停止飞行
    this.hp = this.__hp; // 回复血量
    this.main.enemyMap[this.type].pool.put(this.node); // 回收
  },
  /**
   * 炸毁
   * @param  {Number} source [0: 清屏炸毁 !0: 击毁或遭受末日]
   */
  blowUp(source) {
    let vm = this;
    let act = this.getComponent(cc.Animation);
    // 清屏炸毁不触发 blowUp
    if (source) this.node.emit('blowUp', {type: this.type, score: this.score});

    act.on('finished', this.onEnemyHitOrDisappeared, vm);
    act.play(this.name.replace(/^(.+)<.+$/, (m, $1) => `${$1}-blow-up`));
  },
});
