let Interval = cc.Class({
  name: 'Interval',
  properties: {
    l: {
      default: 1,
      type: cc.Integer
    },
    r: {
      default: 1,
      type: cc.Integer
    }
  },
});

let Article = cc.Class({
  name: 'Article',
  properties: {
    prefab: cc.Prefab
  },
});

cc.Class({
  extends: cc.Component,

  properties: {
    refreshRateFluctuation: {
      default: null,
      type: Interval
    },
    approach: {
      default: 1,
      type: cc.Integer,
      tooltip: '趋近值，该值位于区间中某位置'
    },
    RRF: {
      get: function() {
        let { l, r } = this.refreshRateFluctuation;
        return this.refreshRateFluctuation ? [l, r] : [];
      }
    },
    articles: [Article]
  },

  onLoad() {
    // cc.log(this.RRF);
    // this.servingArticle(true);
    cc.log(this.getServingTime());
  },

  servingArticle(start) {
    if (!start) {
      // 1. 投放
    }
    // 2. 投放后随机出下一次投放点
    let servingTime = this.getServingTime();
    // 3. 如此递归
    this.schedule(function() {
      this.servingArticle();
    }, servingTime, 1, 10);
  },

  getServingTime() {
    let { RRF, approach } = this;
    let left = [RRF[0], approach];
    let right = [approach, RRF[1]];
    let isLeft = Boolean(Math.random() < 0.5);
    let random = Math.random() * Math.random();

    if (isLeft) {
      random = random * (left[1] - left[0] + 0.1) + approach;
    } else {
      random = random * (right[1] - right[0] + 0.1) + approach;
    }

    random = Math.floor(random);

    return isLeft ? (left[0] + approach + random) : random;
  }
});
