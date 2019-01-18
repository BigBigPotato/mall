<template>
  <div>
    <top-nav>
      <span class="active-page-name">Goods</span>
    </top-nav>
    <div class="goods-container">
      <section class="left-price">
        <h1 class="price-list-title">PRICE:</h1>
        <ul>
          <li class="price-list">All</li>
          <li class="price-list">1000 - 2000</li>
        </ul>
      </section>
      <ul class="goods-list-container clearfix">
        <li class="goods-list pull-left">
          <div class="goods-img-container">
            <img src="" alt="" class="goods-img"/>
          </div>
          <div class="detail-container">
            <p class="goods-title">name</p>
            <p class="goods-price">$1.00</p>
            <button type="button" class="add-car-btn">加入购物车</button>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import TopNav from '@/components/TopNav'
import httpRequest from '@/assets/js/request'
import { mapState } from 'vuex'

export default {
  name: 'GoodsList',
  components: {
    TopNav
  },
  data () {
    return {
      currentPage: 1
    }
  },
  computed: {
    ...mapState([
      'pageSize'
    ])
  },
  created () {
    this.getGoodsList()
  },
  methods: {
    getGoodsList () {
      let page = this.currentPage
      let limit = this.pageSize
      httpRequest.get('goodsList', {
        page,
        limit
      }).then((res) => {})
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/style/validate';
.active-page-name{
  color: $INFO-COLOR;
}
.goods-container{
  display: flex;
  width: $MAX-WIDTH;
  margin: 40px auto;
  .left-price{
    width: 200px;
    padding: 0 0 0 10px;
    .price-list-title{
      font-size: 16px;
    }
    .price-list{
      margin: 26px 0 0;
      padding: 0;
      transition: all 0.4s;
      &:hover{
        cursor: pointer;
      }
      &:hover,
      &.active{
        padding: 0 0 0 20px;
        border-left: 2px solid $INFO-COLOR;
        color: $INFO-COLOR;
      }
    }
  }
  .goods-list-container{
    flex: 1;
    .goods-list{
      position: relative;
      top: 0;
      width: 22%;
      margin: 0 4% 20px 0;
      border: 1px solid #e5e5e5;
      transition: all 0.5s;
      &:hover{
        top: -10px;
        box-shadow: 0 0 15px #e5e5e5;
        border-color: $INFO-COLOR;
      }
      &:nth-child(4n){
        margin-right: 0;
      }
      .goods-img-container{
        width: 100%;
        height: 0;
        padding: 0 0 100% 0;
        .goods-img{
          width: 100%;
          height: 100%;
        }
      }
    }
    .detail-container{
      padding: 10px;
      font-size: 18px;
      .goods-title{
        color: $FONT-COLOR / 2;
      }
      .goods-price{
        margin: 20px 0 0;
        color: $DANGER-COLOR;
      }
      .add-car-btn{
        width: 100%;
        height: 40px;
        line-height: 40px;
        margin: 20px 0 0;
        background: none;
        border: 2px solid $DANGER-COLOR;
        color: $DANGER-COLOR;
        font-weight: bold;
        &:hover{
          cursor: pointer;
        }
      }
    }
  }
}
</style>
