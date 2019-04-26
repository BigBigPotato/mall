<template>
  <div class="address-container">
    <step :activeStep="0"/>
    <section class="address-box">
      <h1 class="box-title">Shiping Address</h1>
      <ul class="clearfix">
        <li
          class="box-item pull-left"
          :class="[item.addressId === selectedAddress ? 'active' : '']"
          v-for="(item, index) of filterAddress"
          :key="item.addressId"
          @click="toCheckAddress(item.addressId)"
        >
          <i class="delete-address" @click="toDeleteAddress(item.addressId, index)">X</i>
          <p class="receiver">{{item.receiveUser}}</p>
          <p class="receive-address">{{item.province}}{{item.city}}{{item.area}} {{item.addressDetail}}</p>
          <p>{{item.addressMail}}</p>
          <p class="default-tag" v-if="item.setDefault">Default Address</p>
        </li>
        <li class="box-item add-address pull-left" @click="handleAddAddress">
          <p class="add-icon">+</p>
          <p>Add new address</p>
        </li>
      </ul>
      <p
        class="more-address"
        :class="[showAddressNum === addressList.length ? 'active' : '']"
        v-if="addressList.length >= showAddressNum"
        @click="toggleAddress"
      >
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
      <custom-button
        text="Next"
        @handle-click="toNextStep"
        :hasActive="true"
      ></custom-button>
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
        <address-link
          :province="province"
          :city="city"
          :area="area"
          @send-data="getSelectedAddress"
        ></address-link>
        <input type="text" placeholder="详细地址" class="address-input" v-model="addressDetail"/>
        <input type="text" placeholder="邮政编码" class="mail-address" v-model="addressMail"/>
        <div class="default-address">
          <custom-checkbox
            :checked="setDefault"
            @handle-check="toggleDefault(true)"
            @handle-cancel="toggleDefault(false)"
          >
            <label>设为默认地址</label>
          </custom-checkbox>
        </div>
      </div>
    </pop>
  </div>
</template>

<script>
import Step from '@/components/Step'
import Pop from '@/components/Pop'
import AddressLink from '@/components/AddressLink'
import CustomCheckbox from '@/components/CustomCheckbox'
import CustomButton from '@/components/CustomButton'
import newRequest from '@/assets/js/request'

export default {
  name: 'Address',
  components: {
    Step,
    Pop,
    AddressLink,
    CustomCheckbox,
    CustomButton
  },
  data () {
    return {
      addressList: [],
      showAddAddress: false,
      receiveUser: '',
      addressDetail: '',
      province: '',
      city: '',
      area: '',
      addressMail: '',
      setDefault: false,
      showAddressNum: 3,
      selectedAddress: 0
    }
  },
  computed: {
    filterAddress () {
      return this.addressList.filter((val, index) => {
        return index < this.showAddressNum
      })
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
    initData () {
      this.receiveUser = ''
      this.addressDetail = ''
      this.addressMail = ''
      this.setDefault = false
      this.province = ''
      this.city = ''
      this.area = ''
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
    toggleDefault (flag) {
      this.setDefault = flag
    },
    toAddAddress () {
      let {
        receiveUser,
        addressDetail,
        province,
        city,
        area,
        addressMail,
        setDefault
      } = this.$data
      setDefault = setDefault ? 1 : 0
      if (!receiveUser || !addressDetail || !province || !city || !area || !addressMail) {
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
        area,
        addressMail,
        setDefault
      }).then((res) => {
        if (res.data.code === 1000) {
          this.$message({
            type: 'success',
            infoText: '添加成功'
          })
          this.toClosePop()
          this.initData()
          this.getAddressList()
        }
      })
    },
    toDeleteAddress (id, index) {
      newRequest.post('deleteAddress', {
        deleteId: id
      }).then((res) => {
        if (res.data.code === 1000) {
          this.$message({
            type: 'success',
            infoText: '删除成功'
          })
          this.addressList.splice(index, 1)
        }
      })
    },
    toggleAddress () {
      let addressListLen = this.addressList.length
      this.showAddressNum = this.showAddressNum !== addressListLen ? addressListLen : 3
    },
    toCheckAddress (id) {
      this.selectedAddress = id
    },
    toNextStep () {
      let selectedAddress = this.selectedAddress
      let ordersId = this.$route.query.ordersId
      if (selectedAddress) {
        newRequest.post('chooseAddress', {
          addressId: selectedAddress,
          ordersId
        }).then((res) => {
          if (res.data.code === 1000) {
            this.$router.push(`/confirmOrder?ordersId=${ordersId}`)
          }
        })
      } else {
        this.$message({
          type: 'error',
          infoText: '请选择收件地址'
        })
      }
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
      &.active{
        .arrow-icon{
          transform: rotate(180deg);
        }
      }
      span{
        color: inherit;
        &:hover{
          cursor: pointer;
        }
      }
      .arrow-icon{
        margin: 4px 0 0 4px;
        border-width: 4px;
        border-style: solid;
        border-color: $INFO-COLOR transparent transparent;
        transition: transform linear 0.3s;
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
        position: absolute;
        bottom: 10px;
        left: 10px;
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
  }
  .address-input,
  .mail-address{
    width: 70%;
    height: 30px;
    border: none;
    border-bottom: 1px solid #e5e5e5;
    outline: none;
  }
  .mail-address{
    width: 50%;
    margin: 20px 0 40px;
  }
}
</style>
