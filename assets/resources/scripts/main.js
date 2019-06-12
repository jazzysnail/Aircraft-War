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
    prefab: cc.Prefab,
    poolName: {
      get: function() {
        if (this.prefab) {
          return this.prefab.name.replace(/-([a-z])/g, (m, $1) => $1.toLocaleUpperCase()) + 'Pool';
        } else {
          return '-'
        }
      }
    },
    probability: {
      default: 0.5,
      displayName: "出现的概率",
    }
  }
});


cc.Class({
  extends: cc.Component,
  properties: {
    player: {
      default: null,
      type: cc.Node
    },
    enemyPrefabs: [Enemy],
    enemyDensity: {
      default: 6,
      displayName: "敌机密度",
      tooltip: "敌机同时可在可视区域出现的数量"
    }
  },

  onLoad() {
    this.isGameing = false;
    this.timer = 0;
    this.enemyMap = {};
    this.probabilityLine = [];



    /**
     * 创建敌机对象池
     * 机种数量等于对象池数量
     * 池容量等于 敌机密度乘以敌机出现概率向上再取整
     */
    this.enemyPrefabs.forEach(enemyObj => {
      let { poolName, type, prefab, probability } = enemyObj;
      // 创建子弹对象池
      this.createObjPool(poolName, 20, type, prefab);
      // 创建子弹类型索引
      this.enemyMap[type] = {
        pool: this[poolName],
        prefab
      };
      this.probabilityLine = this.probabilityLine.concat(new Array(probability*10).fill(type));
    });

    if (this.probabilityLine.length > 10) {
      cc.log('敌机出现的概率大于1')
    }

    cc.director.getCollisionManager().enabled = true;
  },

  update(dt) {
    if (this.timer >= 1.5) {
      this.createEnemy();
      this.timer = 0;
      return;
    }
    this.timer += dt;
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

  createEnemy() {
    // 从对象池中获取敌机
    let random = Number.parseInt(Math.random()*10);
    let type = this.probabilityLine[random];
    let { pool, prefab } = this.enemyMap[type];
    let node = pool.size() > 0
                    ? pool.get()
                    : cc.instantiate(prefab);

    this.node.addChild(node);

    // 随机进入坐标
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
   * @return {undefined}
   */
  createObjPool(poolName, Count, type, Prefab) {
    this[poolName] = new cc.NodePool();
    for (let i = 0; i < Count; ++i) {
      let node = cc.instantiate(Prefab);
      node.getComponent("enemy").type = type;
      node.getComponent("enemy").main = this;
      this[poolName].put(node);
    }
  },
});
