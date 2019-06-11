"use strict";
cc._RF.push(module, '9dcf7PmbmpBeqnb6aMRYuo3', 'player');
// resources/scripts/player.js

"use strict";

/**
 * 玩家飞机组件
 */
cc.Class({
    extends: cc.Component,

    properties: {
        bulletType: {
            default: 0, // ['普通子弹', '双弹道子弹']
            serializable: false
        },
        bulletMap: {
            default: [],
            displayName: "子弹预设",
            type: [cc.Prefab]
        },
        shootingInterval: {
            default: 0.2,
            displayName: "攻击间隔"
        },
        lifeValue: {
            default: 2,
            displayName: "生命值"
        },
        health: {
            get: function get() {
                return this.lifeValue !== 0;
            }
        }
    },

    onLoad: function onLoad() {
        var _this = this;

        this.bulletPoolMap = this.bulletMap.map(function (prefab) {
            return prefab.name.replace(/-([a-z])/g, function (m, $1) {
                return $1.toLocaleUpperCase();
            }) + 'Pool';
        });
        this.bulletPoolMap.forEach(function (name, index) {
            _this.createBulletPool(name, 20, index, _this.bulletMap[index]);
        });
        this.timer = 0;
        this.isBlowUp = false;

        this.node.on('touchstart', function (event) {
            console.log('touchstart');
        });
    },
    update: function update(dt) {
        if (this.timer >= this.shootingInterval) {
            this.shoot();
            this.timer = 0;
            return;
        }
        this.timer += dt;
    },

    /**
     * 消耗血量
     * @return {[type]} [description]
     */
    bleed: function bleed() {
        this.lifeValue--;
        if (!this.health) {
            this.runBlowUpAnim();
        }
    },

    /**
     * 炸毁动画
     * @return {[type]} [description]
     */
    runBlowUpAnim: function runBlowUpAnim() {
        this.getComponent(cc.Animation).play('blowUp');
        this.isBlowUp = true;
    },

    /**
     * 创建子弹对应的对象池
     * @param  {String}    poolName 对象池名称
     * @param  {Number}    Count    对象池容量
     * @param  {cc.Prefab} Prefab   预设对象
     * @return {undefined}
     */
    createBulletPool: function createBulletPool(poolName, Count, type, Prefab) {
        this[poolName] = new cc.NodePool();
        for (var i = 0; i < Count; ++i) {
            var node = cc.instantiate(Prefab);
            node.getComponent("bullet").player = this;
            node.getComponent("bullet").type = type;
            this[poolName].put(node);
        }
    },


    /**
     * 射击(向父节点添加子弹节点)
     * @return {undefined}
     */
    shoot: function shoot() {
        if (!this.isBlowUp) {
            var bulletPool = this[this.bulletPoolMap[this.bulletType]];
            var bulletPrefab = this.bulletMap[this.bulletType];
            var bulletNode = bulletPool.size() > 0 ? bulletPool.get() : cc.instantiate(bulletPrefab);

            // 挂载节点
            this.node.parent.addChild(bulletNode);
            // 获取玩家飞机定位确定起始位置并执行动画
            var _node$position = this.node.position,
                x = _node$position.x,
                y = _node$position.y;

            bulletNode.setPosition(cc.v2(x, y + 16));
            bulletNode.getComponent("bullet").fly();
        }
    },

    /**
     * 切换武器
     */
    switchBulletType: function switchBulletType() {
        this.bulletType = this.bulletType ? 0 : 1;
    }
});

cc._RF.pop();