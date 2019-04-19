<template>
  <div class="address-container">
    <step :activeStep="0"/>
    <section class="address-box">
      <h1 class="box-title">Shiping Address</h1>
      <ul class="clearfix">
        <li class="box-item pull-left active" v-for="item of addressList" :key="item.addressId">
          <i class="delete-address">X</i>
          <p class="receiver">name</p>
          <p class="receive-address">address</p>
          <p>编码</p>
          <p class="default-tag">Default Address</p>
        </li>
        <li class="box-item add-address pull-left" @click="handleAddAddress">
          <p class="add-icon">+</p>
          <p>Add new address</p>
        </li>
      </ul>
      <p class="more-address" v-if="addressList.length > 4">
        <span>more</span>
        <i class="arrow-icon"></i>
      </p>
    </section>
    <section class="address-box">
      <h1 class="box-title">Shiping Method</h1>
      <ul>
        <li class="box-item active">
          <p>Standard shipping</p>
          <p class="shiping-price">Free</p>
          <p class="ps">Once shipped，Order should arrive in the destination in 1-7 business days</p>
        </li>
      </ul>
    </section>
    <div class="next-btn-container">
      <button type="button" class="next-btn">Next</button>
    </div>
    <pop
      :showPop="showAddAddress"
      popTitle="添加地址"
      popWidth="40%"
      @close-pop="toClosePop"
      @sure-pop="toAddAddress"
    >
      <div>
        <input type="text" placeholder="收货人" class="address-input" v-model="receiveUser"/>
        <address-link @get-data="getSelectedAddress"></address-link>
        <input type="text" placeholder="详细地址" class="address-input" v-model="addressDetail"/>
      </div>
    </pop>
  </div>
</template>

<script>
import Step from '@/components/Step'
import Pop from '@/components/Pop'
import AddressLink from '@/components/AddressLink'
import newRequest from '@/assets/js/request'

export default {
  name: 'Address',
  components: {
    Step,
    Pop,
    AddressLink
  },
  data () {
    return {
      addressList: [],
      showAddAddress: false,
      receiveUser: '',
      addressDetail: '',
      province: '',
      city: '',
      area: ''
    }
  },
  mounted () {
    this.getAddressList()
  },
  methods: {
    getAddressList () {
      newRequest.post('addressList').then((res) => {
        if (res.data.code === 1000) this.addressList = res.data.result
      })
    },
    handleAddAddress () {
      this.showAddAddress = true
    },
    getSelectedAddress (address) {
      this.province = address.province
      this.city = address.city
      this.area = address.area
    },
    toClosePop () {
      this.showAddAddress = false
    },
    toAddAddress () {
      let {
        receiveUser,
        addressDetail,
        province,
        city,
        area
      } = this.$data
      if (!receiveUser || !addressDetail || !province || !city || !area) {
        this.$message({
          type: 'error',
          infoText: '请填写完整地址'
        })
      }
      newRequest.post('addAddress', {
        receiveUser,
        addressDetail,
        province,
        city,
        area
      }).then((res) => {
        if (res.data.code === 1000) {
          this.$message({
            type: 'success',
            infoText: '添加成功'
          })
          this.toClosePop()
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/style/validate';
.address-container{
  width: $MAX-WIDTH;
  margin: 0 auto;
  .address-box{
    .box-title{
      padding: 20px 0;
      font-size: 14px;
    }
    .more-address{
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      color: $INFO-COLOR;
      &:hover{
        cursor: pointer;
      }
      span{
        color: inherit;
      }
      .arrow-icon{
        margin: 4px 0 0 4px;
        border-width: 4px;
        border-style: solid;
        border-color: $INFO-COLOR transparent transparent;
      }
    }
    .box-item{
      position: relative;
      display: inline-block;
      width: 20%;
      height: 130px;
      margin: 20px;
      padding: 8px 12px;
      border: 2px solid #e5e5e5;
      font-size: 12px;
      &:hover,
      &.active{
        border-color: $INFO-COLOR;
      }
      &:hover{
        cursor: pointer;
      }
      &.add-address{
        text-align: center;
        .add-icon{
          font-size: 60px;
          font-weight: 100;
        }
      }
      .delete-address{
        position: absolute;
        top: 10px;
        right: 10px;
        font-size: 14px;
        &:hover{
          cursor: pointer;
          color: $INFO-COLOR;
        }
      }
      .receiver{
        font-size: 14px;
        color: #333
      }
      .receive-address{
        margin: 10px 0 30px;
      }
      .default-tag{
        margin: 20px 0 0;
        color: $INFO-COLOR;
      }
      .shiping-price{
        margin: 12px 0 22px;
        font-weight: bold;
        font-size: 14px;
      }
      .ps{
        line-height: 1.2;
        color: #999;
      }
    }
  }
  .next-btn-container{
    text-align: right;
    .next-btn{
      width: 190px;
      padding: 10px 0;
      border: none;
      font-size: 16px;
      background: $DANGER-COLOR;
      color: #fff;
      text-align: center;
      transition: background 0.25s;
      &:hover{
        background: #f16f75;
        cursor: pointer;
      }
    }
  }
  .address-input{
    width: 70%;
    height: 30px;
    border: none;
    border-bottom: 1px solid #e5e5e5;
    outline: none;
  }
}
</style>
