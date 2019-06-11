(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/resources/scripts/bullet.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '61cc6Hstm9NdaytSLJC7j4a', 'bullet', __filename);
// resources/scripts/bullet.js

"use strict";

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

  onLoad: function onLoad() {
    // 计算子弹飞行时长（射速 射程）s
    this.flyDuration = 0.5;
    this.flyAction = this.setFlyAction();
  },


  // 执行子弹飞行动作
  fly: function fly() {
    this.node.runAction(this.flyAction);
  },


  // 定义子弹飞行的动作
  setFlyAction: function setFlyAction() {
    var fly = cc.moveBy(this.flyDuration, cc.p(0, this.range));
    var callback = cc.callFunc(this.onBulletHitOrDisappeared, this);
    return cc.sequence(fly, callback);
  },

  // 当子弹击中或消失时
  onBulletHitOrDisappeared: function onBulletHitOrDisappeared(target) {
    var bulletPool = this.player[this.player.bulletPoolMap[this.type]];
    bulletPool.put(target);
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
        //# sourceMappingURL=bullet.js.map
        