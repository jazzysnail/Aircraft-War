 /**
  * 敌机类
  */
let Enemy = cc.Class({
  name: "Enemy",
  properties: {
    type: {
      default: -1,
      type: cc.Integer
    },
    score: {
      default: 1,
      type: cc.Integer
    },
    prefab: cc.Prefab,
    poolName: {
      get: function() {
        if (this.prefab) {
          return (this.prefab.name.replace(/-([a-z])/g, function(m, $1) {
            return $1.toLocaleUpperCase()
          }) + 'Pool');
        } else {
          return '-'
        }
      }
    },
    probability: {
      default: 0,
      displayName: "出现概率",
      tooltip: "多机型概率之和应为 1"
    }
  }
});


cc.Class({
  extends: cc.Component,
  ctor: function() {
    this.state = {
      isGameing: false, // 游戏进行时状态标志
      timer: 0, // 计时器
      sts: 0, // 开始时间用于计算速度随时间的变化
      get score() {
        return this.__score || '0000000';
      },
      set score(val) {
        let str = '0000000';
        let sub = `${val}`;
        this.__score = str.substring(0, 7-sub.length) + sub;
      }
    }

    this.enemyMap = [];// 敌机节点属性映射
    this.probabilityLine = []; // 权重对比线

  },

  properties: {
    player: {
      default: null,
      type: cc.Node
    },
    scoreDisplay: {
      default: null,
      type: cc.Label
    },
    title: {
      default: null,
      type: cc.Node
    },
    enemyPrefabs: [Enemy],
    enemyDensity: {
      default: 20,
      displayName: "敌机密度",
      tooltip: "敌机同时可在可视区域出现的数量"
    }
  },

  onLoad() {
    let vm = this;
    this.player.zIndex = 2;
    /**
     * 创建敌机对象池，对象池数量等于机种数量
     * 池容量等于 20，将角标作为 type
     */
    this.enemyPrefabs.forEach((enemyObj, index) => {
      let { poolName, prefab, probability } = enemyObj;
      // 创建子弹对象池
      this.createObjPool(poolName, 20, index, prefab);
      // 创建子弹类型索引
      this.enemyMap.push({ pool: this[poolName], prefab });
      this.probabilityLine.push([probability, index]);
    });
    /**
     * 1. 排序
     * 2. 斐波那锲加得到概率线
     */
    this.probabilityLine.sort((a,b) => (a[0] - b[0])).forEach((item, index) => {
      let pre = this.probabilityLine[index-1] || [0];
      item[0] = pre[0] + item[0];
    });
    // 开启碰撞检测
    cc.director.getCollisionManager().enabled = true;
    // 监听飞机按压事件断定开始并初始化
    this.player.on('hold', function() {
      if (!vm.state.isGameing) {
        vm.sts = Date.now();
        vm.doom(0);
        vm.title.removeFromParent();
        vm.state.isGameing = true;
        vm.node.emit('gameing');
      }
    });
    // 玩家飞机炸毁后将该节点移除（不销毁）
    this.player.on('blowUp', function() {
      vm.player.removeFromParent();
    });
  },

  update(dt) {
    if (this.state.timer >= 1.5) {
      this.createEnemy();
      this.state.timer = 0;
      return;
    }
    this.state.timer += dt;
  },

  pause() {
    if(cc.director.isPaused()) {
      cc.director.resume();
    } else {
      cc.director.pause();
    }
  },

  restart() {
    cc.game.restart();
    cc.director.resume();
  },

  /**
   * 计分
   * @param  {Number} num 本次消灭得分
   */
  scoring(num) {
    this.state.score = +this.state.score + + num;
    this.scoreDisplay.string = this.state.score;
  },

  /**
   * 末日 (击杀屏幕上所有的敌机)
   * @param  {Number} source 末日产生来源 ['初始清屏', '道具清屏']
   */
  doom(source) {
    this.node.emit('doom', source);
  },

  /**
   * 创建敌机
   */
  createEnemy() {
    // 随机得到敌机类型
    let random = Math.random();
    let type = this.probabilityLine.find(item => (random < item[0]))[1];
    // 从对象池中取出敌机节点并添加
    let { pool, prefab } = this.enemyMap[type];
    let node = pool.size() > 0
                    ? pool.get()
                    : cc.instantiate(prefab);

    this.node.addChild(node);

    // 随机位置从屏幕上方飞入
    let randomX = Math.random()*(this.node.width - node.width);
    let y = this.node.height/2;
    node.setPosition(randomX-this.node.width/2, y);
    node.opacity = 255;
    node.getComponent("enemy").fly();
  },

  /**
   * 创建子弹对应的对象池
   * @param  {String}    poolName 对象池名称
   * @param  {Number}    Count    对象池容量
   * @param  {cc.Prefab} Prefab   预设对象
   * @param  {Number}    type     类型
   * @return {undefined}
   */
  createObjPool(poolName, Count, type, Prefab) {
    this[poolName] = new cc.NodePool();
    for (let i = 0; i < Count; ++i) {
      let node = cc.instantiate(Prefab);
      node.getComponent("enemy").type = type;
      node.getComponent("enemy").main = this;
      // 监听摧毁事件统计得分
      node.on('blowUp', e => {
        // 初始清屏炸毁不计分
        // 道具清屏计分
        if(this.state.isGameing) this.scoring(e.detail.score);
      });
      this[poolName].put(node);
    }
  },
});
