"use strict";
cc._RF.push(module, '2415dG9QJZOaoO9y5JpR107', 'main');
// resources/scripts/main.js

"use strict";

/**
 * 飞机大战程序入口组件
 */
cc.Class({
  extends: cc.Component,

  properties: {
    player: {
      default: null,
      type: cc.Node
    },
    enemyPrefab: cc.Prefab, // 敌机预设
    enemyDensity: {
      default: 6,
      displayName: "敌机密度",
      tooltip: "敌机同时可在可视区域出现的数量"
    }
  },

  onLoad: function onLoad() {
    // 创建敌机对象池
    // this.enemyPool = new cc.NodePool();
    // let enemyCount = this.enemyDensity;
    // for (let i = 0; i < enemyCount; ++i) {
    //   let enemy = cc.instantiate(this.enemyPrefab);
    //   this.enemyPool.put(enemy);
    // }
  }
});

cc._RF.pop();