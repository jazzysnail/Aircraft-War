(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/resources/scripts/main.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '2415dG9QJZOaoO9y5JpR107', 'main', __filename);
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
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=main.js.map
        