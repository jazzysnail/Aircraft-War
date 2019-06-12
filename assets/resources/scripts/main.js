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
    },
  },

  onLoad() {
    /**
     * 创建敌机对象池
     * 机种数量等于对象池数量
     * 池容量等于 敌机密度乘以敌机出现概率向上再取整
     */
    this.enemyMap = {};
    // 遍历敌机实例创建对象池及索引
    this.enemyPrefabs.forEach(enemyObj => {
      let { poolName, type, prefab } = enemyObj;
      // 创建子弹对象池
      this.createObjPool(poolName, 20, type, prefab);
      // 创建子弹类型索引
      this.enemyMap[type] = {
        pool: this[poolName],
        prefab: prefab,
      };
    });

    let manager = cc.director.getCollisionManager();
    manager.enabled = true;
    manager.enabledDebugDraw = true;
  },

  update(dt) {

  },

  createEnemy() {
    // 从对象池中获取敌机

    // 随机从屏幕上方进入


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
      // node.getComponent("bullet").type = type;
      this[poolName].put(node);
    }
  },
});
