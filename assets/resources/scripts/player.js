/**
 * 子弹类
 */
let Bullet = cc.Class({
  name: "Bullet",
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

/**
 * 玩家飞机类
 */
cc.Class({
  extends: cc.Component,

  properties: {
    bulletType: {
      default: 0, // ['普通子弹', '双弹道子弹']
      serializable: false
    },
    bulletPrefabs: [Bullet],
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
    let vm = this;
    this.timer = 0;
    this.isBlowUp = false;
    this.bulletMap = {};
    this.hold = false;
    this.isGameing = false;
    this.invincible = true;






    // 遍历子弹实例创建对象池及索引
    this.bulletPrefabs.forEach(bulletObj => {
      let { poolName, type, prefab } = bulletObj;
      // 创建子弹对象池
      this.createBulletPool(poolName, 20, type, prefab);
      // 创建子弹类型索引
      this.bulletMap[type] = {
        pool: this[poolName],
        prefab: prefab,
      };
    });





    this.node.on('touchstart', function () {
      vm.hold = true;
      vm.node.emit('hold');
    });
    this.node.on('touchmove', function (e) {
      if (vm.hold) {
        let { x, y } = e.getLocation();
        x -= vm.node.parent.width/2;
        y -= (vm.node.parent.height/2);
        vm.node.setPosition(x, y);
      }
    });
    this.node.on('touchend', function () {
      vm.hold = false;
    });

    this.node.parent.on('gameing', function() {
      vm.isGameing = true;
      // 开始前的三秒无敌状态
      setTimeout(function() {
        vm.invincible = false;
      },3000);
    })

    this.getComponent(cc.Animation).play('loop');
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
   * 当碰撞产生的时候调用
   * @param  {Collider} other 产生碰撞的另一个碰撞组件
   * @param  {Collider} self  产生碰撞的自身的碰撞组件
   */
  onCollisionEnter: function () {
    if (!this.invincible) {
      this.bleed();
    }
  },
  bleed() {
    this.lifeValue--;
    if(!this.health) {
        this.runBlowUpAnim();
    }
  },
  runBlowUpAnim() {
    this.getComponent(cc.Animation).play('blowUp');
    this.isBlowUp = true;
    this.active = false;
    this.node.emit('blowUp');
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
    if (!this.isBlowUp && this.isGameing) {
      let { pool, prefab } = this.bulletMap[this.bulletType];
      let node = pool.size() > 0 ? pool.get() : cc.instantiate(prefab);
      // 挂载节点
      this.node.parent.addChild(node);
      // 获取玩家飞机定位确定起始位置并执行动画
      let { position: { x, y } } = this.node;
      node.setPosition(cc.v2(x, y + 130));
      node.getComponent("bullet").fly();
    }
  },
  /**
   * 切换武器
   */
  switchBulletType() {
    this.bulletType = this.bulletType ? 0 : 1;
  }
});
