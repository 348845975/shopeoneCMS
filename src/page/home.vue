<template>
  <div>
    <div class="topbox">
      <div class="title">订单中心</div>
      <ul class="list">
        <li class="item">
          <router-link to="/orderwait" class="router">
          <div class="main">
            <div class="left">
              <h4>{{watting_delivery_count}}</h4>
              <p>待发货</p>
            </div>
            <div class="right">
              <i class="iconfont icon-dingdan icoPic"></i>
            </div>
            <div class="triangle"></div>
          </div>
           </router-link>
        </li>
        <li class="item">
          <router-link to="/orderreturn" class="router">
          <div class="main">
            <div class="left">
              <h4>{{refund_count}}</h4>
              <p>退货单</p>
            </div>
            <div class="right">
             <i class="iconfont icon-tuihuodan icoPic"></i>

            </div>
            <div class="triangle"></div>
          </div>
          </router-link>
        </li>
        <li class="item">
          <router-link to="/orderdeliver" class="router">
          <div class="main">
            <div class="left">
              <h4>{{delivery_count}}</h4>
              <p>发货单</p>
            </div>
            <div class="right">
              <i class="iconfont icon-wuliu icoPic"></i>
            </div>
            <div class="triangle"></div>
          </div>
          </router-link>
        </li>
      </ul>
      <div class="title">商品中心</div>
      <div class="cont">
        <div class="part1">
          <div class="left">
            <router-link style="font-size:20px;color:#4775e4;" to="/mygoods">
            <img src="../assets/img/ico1.png" style="zoom:.8" alt="图片加载失败">
            <h4>{{mygoods_count}}</h4>
            <p>我的商品</p>
            </router-link>
          </div>
          <div class="right">
            <img src="../assets/img/line.png"  alt="图片加载失败">
          </div>
        </div>
        <div class="part2">
          <ul class="newAdd">
            <li>
                <div><router-link class="num router" to="/mygoods?s=1">{{goods_in_count}}</router-link></div>
                <router-link class="num router" to="/mygoods?s=1"><div class="word">供货中</div></router-link>
                <div class="line"></div>
            </li>
            <li>
                <div><router-link class="num router" to="/mygoods?s=3">{{goods_notin_count}}</router-link></div>
                <router-link class="num router" to="/mygoods?s=3"><div class="word">未供货</div></router-link>
                 <div class="line"></div>
            </li>
            <li>
                <div><router-link class="num router" to="/mygoods?s=0">{{goods_audit_count}}</router-link></div>
                <router-link class="num router" to="/mygoods?s=0"><div class="word">审核中</div></router-link>
                 <div class="line"></div>
            </li>
            <li>
                <div><router-link class="num router" to="/mygoods?s=2">{{goods_refuse_count}}</router-link></div>
                <router-link class="num router" to="/mygoods?s=2"><div class="word">已拒绝</div></router-link>
                 <div class="line"></div>
            </li>
            <li>
                <div class="num">{{goods_delete_count}}</div>
                <div class="word">已失效</div>
            </li>
          </ul>
        </div>
      </div>
      <div class="title">账单中心</div>
      <div class="cont2">
        <div class="part1">
          <div class="left">
            <router-link style="font-size:20px;color:#4775e4;" to="/bill?t=total_amount">
            <img src="../assets/img/ico2.png" style="zoom:.8" alt="图片加载失败">
            <h4>{{total_amount}}</h4>
            <p>累计金额</p>
            </router-link>
          </div>
          <div class="right">
            <img src="../assets/img/line.png" alt="图片加载失败">
          </div>
        </div>
        <div class="part2">
          <div class="left">
            <router-link style="font-size:20px;color:#4775e4;" to="/bill?t=total_wait">
            <img src="../assets/img/pic1.png" alt="图片加载失败">
            <h4 >{{total_wait_amount}}</h4>
            <p>全部待结款</p>
            </router-link>
          </div>
          <div class="right">
            <router-link style="font-size:20px;color:#4775e4;" to="/bill?t=this_month">
            <img src="../assets/img/pic2.png" alt="图片加载失败">
            <h4>{{this_month_amount}}</h4>
            <p>本月结款</p>
            </router-link>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import {
  indexOrderData,
  indexGoodsData,
  indexBillData
} from "@/api/getData";
export default {
  data() {
    return {
      watting_delivery_count: '',// 待发货
      refund_count: '',// 退货单数量
      delivery_count: '',// 发货单数量
      mygoods_count: '',// 商品总数
      goods_in_count: '', // 上架商品数
      goods_notin_count: '',// 下架商品数
      goods_refuse_count: '',// 不通过商品数
      goods_audit_count: '',// 已售商品数
      goods_delete_count: '',// 失效商品数
      total_amount: '',// 累计金额
      total_wait_amount: '',// 全部待结款
      this_month_amount: '',// 本月已结款
      sevenDay: [],
      sevenDate: [[], [], []]
    };
  },
  components: {
  },
  mounted() {
    this.initData();
  },
  computed: {},
  methods: {
    async initData() {
       const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
      const res1 = await indexOrderData({
        token: this.$store.state.token
      });

      if (res1) {
        console.log("res1=", res1);
        this.watting_delivery_count = res1.result.watting_delivery_count;
        this.refund_count = res1.result.refund_count;
        this.delivery_count = res1.result.delivery_count;

      }

      const res2 = await indexGoodsData({
        token: this.$store.state.token
      });

      if (res2) {
        console.log("res2=", res2);
        this.mygoods_count = res2.result.mygoods_count;
        this.goods_in_count = res2.result.goods_in_count;
        this.goods_notin_count = res2.result.goods_notin_count;
        this.goods_refuse_count = res2.result.goods_refuse_count;
        this.goods_audit_count = res2.result.goods_audit_count;
        this.goods_delete_count = res2.result.goods_delete_count;


      }

      const res3 = await indexBillData({
        token: this.$store.state.token
      });

      if (res3) {
        console.log("res3=", res3);
        this.total_amount = res3.result.total_amount;
        this.total_wait_amount = res3.result.total_wait_amount;
        this.this_month_amount = res3.result.this_month_amount;

      }
      if(res1&&res2&&res3){
        loading.close();
      }
    }
  }
};
</script>

<style lang="less" scoped>
@import "../style/mixin";
@titSize: 14px;
@titColor: #333;
@h4Size: 20px;
@pSize: 12px;
@fontColor: #fff;
@blueColor: #4775e4;
.icoPic{
  font-size:50px;
}
.data_section {
  padding: 20px;
  margin-bottom: 40px;
  .section_title {
    text-align: center;
    font-size: 30px;
    margin-bottom: 10px;
  }
  .data_list {
    text-align: center;
    font-size: 12px;

    border-radius: 6px;
    background: #e5e9f2;
    .data_num {
      color: #333;
      font-size: 26px;
    }
    .head {
      border-radius: 6px;
      font-size: 22px;
      padding: 4px 0;
      color: #fff;
      display: inline-block;
    }
  }
  .today_head {
    background: #ff9800;
  }
  .all_head {
    background: #20a0ff;
  }
}
.wan {
  .sc(16px, #333);
}

.topbox {
  margin-top: 15px;
  padding:0 30px;
  .title {
    font-size: @titSize;
    color: @titColor;
    padding: 0 10px;
    margin:6px 0 8px 0;
    border-left: 4px solid @blueColor;
  }
  .list {
    display: flex;
    .item {
      flex: 1;
      align-content: space-around;
      background-color: #fff;
      border-radius: 5px;
      padding: 15px 27px 20px 34px;
      position: relative;
      .main {
        overflow: hidden;
        h4 {
          font-size: @h4Size;
          color: #e33946;
        }
        p {
          font-size: @pSize;

        }
        .triangle {
          width: 0;
          height: 0;
          border: 15px solid #4571da;
          border-color: transparent transparent transparent #4571da;
          position: absolute;
          right: -30px;
          top: 50%;
          transform: translate(0, -50%);
          display: none;
        }
      }
    }
    .item:nth-of-type(2) {
      margin: 0 3%;
    }
    .item:hover {
      background-color: #4571da;
      color: @fontColor;
      .main {
        h4 {
          color: @fontColor;
        }
        p {
          color: @fontColor;
        }
        .triangle {
          display: block;
        }
        .right{
          i{
            color: @fontColor;
          }
        }
      }
    }
  }
  .cont {
    padding:0 15px;
    background-color: #fff;
    display: flex;
    .part1 {
      flex: 1;
      display: flex;
      .left {
        flex: 90%;
        text-align: center;
        img {
          text-align: center;
          margin: 30px 0;
        }
        h4 {
          text-align: center;
          font-size: @h4Size;
          color: @blueColor;
        }
        p {
          text-align: center;
          margin: 10px 0;
        }
      }
      .right {
        flex: 10%;
        height: 100%;
        display: table-cell;
        vertical-align: middle;
        text-align: center;
        position: relative;
        img {
          position: absolute;
          top: 50%;
          margin-top: -95px;
        }
      }
    }
    .part2 {
      flex: 2;
      margin-left: 30px;

      .newAdd{
        overflow: hidden;
        margin:78px auto;
        margin-left:40px;
        li{
            width: 12%;
            float: left;
            padding-right:20px;
            margin-right: 30px;
            position: relative;
            .num{
              font-size:20px;
              text-align: center;
              color:#4775e4;
            }
            .router{
              display:inline-block;
              width:100%;
              height:100%;
            }
            .word{
               text-align: center;
              // font-size:20px;
              margin: 10px 0;
            }
            .line{
              position: absolute;
              right:0;
              top:50%;
              transform: translateY(-50%);
              width: 1px;
              height: 30px;
              background-color: #999;
            }
        }
      }
    }
  }

  .cont2 {
    padding:0 15px;
    background-color: #fff;
    display: flex;
    .part1 {
      flex: 1;
      display: flex;
      .left {
        flex: 90%;
        text-align: center;
        img {
          text-align: center;
          margin: 30px 0;
        }
        h4 {
          text-align: center;
          font-size: @h4Size;
          color: @blueColor;
        }
        p {
          text-align: center;
          margin: 10px 0;
        }
      }
      .right {
        flex: 10%;
        height: 100%;
        display: table-cell;
        vertical-align: middle;
        text-align: center;
        position: relative;
        img {
          position: absolute;
          top: 50%;
          margin-top: -95px;
        }
      }
    }
    .part2 {
      flex: 2;
      margin-left: 30px;
      display: flex;
      padding: 30px 0;
      justify-content: center;
      align-items: center;
      .left {
        flex: 1;
        text-align: center;
        img{
          margin:30px 0;
        }
        p {
          font-size: @pSize;

        }
        h4 {
          font-size: @h4Size;
          color: @blueColor;

        }
      }
      .right {
        flex: 1;
        text-align: center;
         img{
          margin:30px 0;
        }
        p {
          font-size: @pSize;

        }
        h4 {
          font-size: @h4Size;
          color: @blueColor;
        }
      }
    }
  }
}
</style>
