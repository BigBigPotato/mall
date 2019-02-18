<template>
  <div class="header-container">
    <div class="header-wrapper">
      <img src="../assets/images/smile.png" class="left-icon"/>
      <div class="right-content">
        <span v-show="!hasLogin" class="behave" @click="handleLogin">Login</span>
        <span v-show="!hasLogin" class="behave" @click="handleRegister">Register</span>
        <span v-show="hasLogin">[{{userNameCookie}}]</span>
        <router-link to="/cart" tag="span"  class="behave" v-show="hasLogin">Cart</router-link>
        <span v-show="hasLogin" class="behave" @click="toLogout">logout</span>
      </div>
    </div>
    <pop
      :showPop="showPop"
      popWidth="36%"
      :popTitle="popTitle"
      :sureButtonText="sureButtonText"
      @close-pop="toClosePop"
      @sure-pop="loginORregister"
    >
      <input type="text" placeholder="用户名" class="login-input" v-model.trim="userName"/>
      <input type="password" placeholder="密码" class="login-input" v-model.trim="userPwd"/>
    </pop>
  </div>
</template>

<script>
import { setCookie, delCookie } from '@/assets/js/util'
import { mapState, mapGetters, mapMutations } from 'Vuex'
import Pop from '@/components/Pop'
import httpRequest from '@/assets/js/request'

export default {
  name: 'CommonHeader',
  components: {
    Pop
  },
  data () {
    return {
      showPop: false,
      popTitle: '',
      sureButtonText: '',
      userName: '',
      userPwd: ''
    }
  },
  computed: {
    ...mapState([
      'userNameCookie'
    ]),
    ...mapGetters([
      'hasLogin'
    ])
  },
  methods: {
    ...mapMutations([
      'toChangeUserName'
    ]),
    handleLogin () {
      this.resetPopData(true, '登录')
    },
    handleRegister () {
      this.resetPopData(true, '注册')
    },
    resetPopData (showPopFlag, titleName) {
      this.showPop = showPopFlag
      this.popTitle = titleName
      this.sureButtonText = titleName
      this.userName = ''
      this.userPwd = ''
    },
    toClosePop () {
      this.resetPopData(false, '')
    },
    toLogout () {
      delCookie('userName')
      delCookie('userId')
      this.toChangeUserName(false)
    },
    loginORregister () {
      let {
        userName,
        userPwd
      } = this.$data
      // console.log(userName, userPwd)
      if (!userName || !userPwd) return
      let api = 'login'
      if (this.popTitle === '注册') {
        api = 'register'
      }
      httpRequest.post(api, {
        userName,
        userPwd
      }).then((res) => {
        if (res.data.code === 1000) {
          let infoText = res.data.msg
          this.$message({
            type: 'success',
            infoText
          })
          if (this.popTitle === '登录') {
            let user = res.data.result[0]
            setCookie('userId', user.userId)
            setCookie('userName', user.userName)
            this.toChangeUserName()
          }
          this.toClosePop()
        } else {
          this.$message({
            type: 'error',
            infoText: res.data.msg
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/style/validate';
.header-container{
  background: $MAIN-COLOR;
  .header-wrapper{
    display: flex;
    align-items: center;
    width: $MAX-WIDTH;
    margin: 0 auto;
    padding: 10px 0;
    background: inherit;
    .left-icon{
      width: 50px;
    }
    .right-content{
      flex: 1;
      text-align: right;
      font-size: 16px;
      span{
        margin: 0 10px;
        color: #fff;
      }
      .behave:hover{
        cursor: pointer;
        color: $INFO-COLOR;
      }
    }
  }
  .login-input{
    width: 100%;
    height: 40px;
    border: none;
    outline: none;
    border-bottom: 1px solid #e5e5e5;
    &:last-child{
      margin: 20px 0 0;
    }
  }
}
</style>
