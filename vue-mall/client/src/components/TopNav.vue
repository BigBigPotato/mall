<template>
  <div class="top-nav clearfix">
    <div class="pull-left">
      <router-link tag="span" to="/">Home</router-link>
      <span>/</span>
      <slot></slot>
    </div>
    <div class="pull-right right-sort">
      <span>sortBy：</span>
      <span
        class="hover-style"
        :class="[sortBy === 'default' ? 'active' : '']"
        @click="sortGoodsByPrice('default')"
      >default</span>
      <div
        class="hover-style price-sort"
        :class="[sortBy === 'price' ? 'active' : '']"
        @click="sortGoodsByPrice('price')"
      >
        <span>price</span>
        <i class="arrow-icon" :class="[sortBy === 'price' ? (upDown === 1 ? 'sortUp' : 'sortDown') : '']"></i>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TopNav',
  props: {
    sortBy: String,
    upDown: Number
  },
  data () {
    return {}
  },
  methods: {
    sortGoodsByPrice (item) {
      this.$emit('sort-goods', item)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/style/validate';
@import '../assets/style/iconStyle.css';
.top-nav{
  width: $MAX-WIDTH;
  margin: 0 auto;
  padding: 20px;
  box-shadow: 0px 5px 15px #eee;
  span{
    margin: 0 6px;
  }
  .right-sort{
    display: flex;
    align-items: center;
    .hover-style{
      &:hover,
      &.active{
        color: $INFO-COLOR;
        span{
          color: inherit;
        }
        .arrow-icon{
          border-color: $INFO-COLOR transparent transparent;
        }
      }
      &:hover{
        cursor: pointer;
      }
      &.active{
        .sortUp{
          transform: rotate(180deg)
        }
        .sortDown{
          transform: rotate(0)
        }
      }
    }
    .price-sort{
      display: flex;
      align-items: center;
      .arrow-icon{
        border-width: 4px;
        border-color: #333 transparent transparent;
        border-style: solid;
        transition: all 0.25s;
      }
    }
  }
}
</style>
