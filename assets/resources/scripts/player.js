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
            default:[],
            displayName: "子弹预设",
            type:[cc.Prefab]
        },
        shootingInterval: {
            default: 0.2,
            displayName: "攻击间隔",
        },
        lifeValue: {
            default: 2,
            displayName: "生命值",
        },
        health: {
            get: function() {
                return (this.lifeValue !== 0)
            }
        }
    },

    onLoad () {
        this.bulletPoolMap = this.bulletMap.map(prefab => {
            return prefab.name.replace(/-([a-z])/g, (m, $1) => $1.toLocaleUpperCase()) + 'Pool';
        });
        this.bulletPoolMap.forEach((name, index) => {
            this.createBulletPool(name, 20, index, this.bulletMap[index]);
        });
        this.timer = 0;
        this.isBlowUp = false;

        // this.node.on('touchstart', function ( event ) {
        //     console.log('touchstart');
        // });
        // this.node.on('touchstart', function ( event ) {
        //     console.log('touchstart');
        // });
    },

    update(dt) {
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
    bleed() {
        this.lifeValue--;
        if(!this.health) {
            this.runBlowUpAnim();
        }
    },
    /**
     * 炸毁动画
     * @return {[type]} [description]
     */
    runBlowUpAnim() {
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
    createBulletPool(poolName, Count, type, Prefab) {
      this[poolName] = new cc.NodePool();
      for (let i = 0; i < Count; ++i) {
        let node = cc.instantiate(Prefab);
        node.getComponent("bullet").player = this;
        node.getComponent("bullet").type = type;
        this[poolName].put(node);
      }
    },

    /**
     * 射击(向父节点添加子弹节点)
     * @return {undefined}
     */
    shoot() {
        if (!this.isBlowUp) {
            let bulletPool = this[this.bulletPoolMap[this.bulletType]];
            let bulletPrefab = this.bulletMap[this.bulletType];
            let bulletNode = bulletPool.size() > 0
                            ? bulletPool.get()
                            : cc.instantiate(bulletPrefab);

            // 挂载节点
            this.node.parent.addChild(bulletNode);
            // 获取玩家飞机定位确定起始位置并执行动画
            let { position: { x, y } } = this.node;
            bulletNode.setPosition(cc.v2(x, y + 16));
            bulletNode.getComponent("bullet").fly();
        }
    },
    /**
     * 切换武器
     */
    switchBulletType() {
        this.bulletType = this.bulletType ? 0 : 1;
    }
});
