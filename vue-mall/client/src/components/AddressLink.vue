<template>
  <div class="select-container">
    <select v-model="selectedProvince" @change="handleProvinceChange">
      <option disabled value="">请选择省</option>
      <option v-for="item of provinces" :key="item.code" :value="item.name">{{item.name}}</option>
    </select>
    <select v-model="selectedCity" @change="handleCityChange">
      <option disabled value="">请选择市</option>
      <option v-for="item of cities" :key="item.code" :value="item.name">{{item.name}}</option>
    </select>
    <select v-model="selectedArea" @change="handleAreaChange">
      <option disabled value="">请选择区</option>
      <option v-for="item of areas" :key="item.code" :value="item.name">{{item.name}}</option>
    </select>
  </div>
</template>

<script>
import newRequest from '@/assets/js/request'

export default {
  name: 'AddressLink',
  data () {
    return {
      provinces: [],
      cities: [],
      areas: [],
      selectedProvince: '',
      selectedCity: '',
      selectedArea: ''
    }
  },
  mounted () {
    this.getProvince()
  },
  methods: {
    getProvince () {
      newRequest.get('province').then((res) => {
        if (res.data.code === 1000) this.provinces = res.data.result
      })
    },
    getCity () {
      newRequest.get('city', {
        province: this.selectedProvince
      }).then((res) => {
        if (res.data.code === 1000) this.cities = res.data.result
      })
    },
    getArea () {
      newRequest.get('area', {
        city: this.selectedCity
      }).then((res) => {
        if (res.data.code === 1000) this.areas = res.data.result
      })
    },
    handleProvinceChange () {
      this.selectedCity = ''
      this.cities = []
      this.selectedArea = ''
      this.areas = []
      this.getCity()
      this.$emit('get-data', {
        province: this.selectedProvince,
        city: '',
        area: ''
      })
    },
    handleCityChange () {
      this.selectedArea = ''
      this.areas = []
      this.getArea()
      this.$emit('get-data', {
        province: this.selectedProvince,
        city: this.selectedCity,
        area: ''
      })
    },
    handleAreaChange () {
      this.$emit('get-data', {
        province: this.selectedProvince,
        city: this.selectedCity,
        area: this.selectedArea
      })
    }
  }
}
</script>

<style scoped lang="scss">
  .select-container{
    display: flex;
    align-items: center;
    margin: 14px 0;
    select{
      margin: 0 20px 0 0;
      padding: 0 10px;
      height: 30px;
      option{
        height: 30px;
      }
    }
  }
</style>
