<template>
  <div>
    <top-nav :sortBy="sortBy" :upDown="upDown" @sort-goods="sortGoodsByPrice">
      <span class="active-page-name">Goods</span>
    </top-nav>
    <div class="goods-container">
      <section class="left-price">
        <h1 class="price-list-title">PRICE:</h1>
        <ul>
          <li
            class="price-list"
            :class="[checkedPriceRange === 'all' ? 'active' : '']"
            @click="filterGoodsByPrice('all')"
          >All</li>
          <li
            class="price-list"
            :class="[checkedPriceRange === index ? 'active' : '']"
            v-for="(item, index) of goodsPriceRange"
            :key="index"
            @click="filterGoodsByPrice(index)"
          >
            {{item.startPrice}} - {{item.endPrice}}
          </li>
        </ul>
      </section>
      <ul class="goods-list-container clearfix">
        <li class="goods-list pull-left" v-for="item of goodsList" :key="item.productId">
          <div class="goods-img-container">
            <img :src="item.productImage | imgPrefix" :alt="item.productName" class="goods-img"/>
          </div>
          <div class="detail-container">
            <p class="goods-title">{{item.productName}}</p>
            <p class="goods-price">${{item.salePrice}}</p>
            <button type="button" class="add-car-btn">加入购物车</button>
          </div>
        </li>
      </ul>
    </div>
    <p class="no-msg" v-show="noMsg">没有更多数据了</p>
    <div class="loading-icon" ref="loadingIcon">
      <img src="../assets/images/loading-bars.svg" />
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
      currentPage: 1,
      goodsList: [],
      count: 0,
      noMsg: false,
      loadingDataFlag: false,
      goodsPriceRange: [],
      checkedPriceRange: 'all',
      sortBy: 'default',
      upDown: 1 // 1：价格升序，-1：降序
    }
  },
  computed: {
    ...mapState([
      'pageSize'
    ])
  },
  mounted () {
    this.getGoodsList()
    this.getGoodsPriceRange()
    this.addScrollListener()
  },
  methods: {
    addScrollListener () {
      window.addEventListener('scroll', this.handleScroll)
    },
    removeScrollListener () {
      window.removeEventListener('scroll', this.handleScroll)
    },
    handleScroll () {
      let scrollTop = document.documentElement.scrollTop
      let clientH = document.documentElement.clientHeight
      let totalH = document.documentElement.scrollHeight
      if (scrollTop + clientH > totalH - 100) {
        ++this.currentPage
        this.getGoodsList()
      }
    },
    getGoodsList () {
      if (this.loadingDataFlag) return
      this.loadingDataFlag = true
      let page = this.currentPage
      let limit = this.pageSize
      let parameter = {
        page,
        limit
      }
      if (this.checkedPriceRange !== 'all') {
        parameter.priceRange = this.goodsPriceRange[this.checkedPriceRange]
      }
      if (this.sortBy !== 'default') {
        parameter.sortBy = { 'salePrice': this.upDown }
      }
      document.documentElement.style.overflow = 'hidden'
      this.$refs.loadingIcon.style.display = 'flex'
      httpRequest.get('goodsList', parameter).then((res) => {
        this.loadingDataFlag = false
        switch (res.data.code) {
          case 1002:
            // 无数据，注销监听滚动事件
            this.removeScrollListener()
            this.noMsg = true
            break
          case 1001:
            // 数据少于一页，注销监听滚动事件
            this.removeScrollListener()
            this.noMsg = true
          case 1000:
            document.documentElement.style.overflow = 'auto'
            this.$refs.loadingIcon.style.display = 'none'
            let rs = res.data.result
            this.goodsList = this.goodsList.concat(rs.list)
            this.count = rs.count
            break
        }
      })
    },
    getGoodsPriceRange () {
      httpRequest.get('priceRange').then((res) => {
        this.goodsPriceRange = res.data.result
      })
    },
    resetData () {
      this.noMsg = false
      this.currentPage = 1
      this.goodsList = []
      this.addScrollListener()
    },
    filterGoodsByPrice (item) {
      this.checkedPriceRange = item
      this.resetData()
      this.getGoodsList()
    },
    sortGoodsByPrice (item) {
      this.sortBy = item
      if (item === 'price') {
        this.upDown = this.upDown === 1 ? -1 : 1
      }
      this.resetData()
      this.getGoodsList()
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/style/validate';
.active-page-name{
  color: $INFO-COLOR;
}
.loading-icon{
  display: none;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba($color: #000000, $alpha: 0.4);
  img{
    width: 4%;
  }
}
.no-msg{
  margin: 20px 0;
  text-align: center;
  font-size: 12px;
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
