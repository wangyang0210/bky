<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElNotification } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import request from './utils/request'
const loginForm = ref<FormInstance>()

const info = reactive({
  email: '',
  password: '',
  verifyCode: '',
  loading: false,
  verifyLoading: false
})

// 处理密码校验
const validatePassword = (rule: any, value: any, callback: any) => {
  const reg = /^[A-Za-z0-9][A-Za-z0-9_]{5,14}$/
  if (!value.match(reg)) {
    callback(new Error('密码长度6~15位，由字母或数字开头，且只能为字母,数字,_'))
  } else {
    callback()
  }
}

// 表单校验
const rules = reactive<FormRules>({
  email: [
    { required: true, message: '邮箱不能为空', trigger: 'blur' },
    { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
  ],
  password: [{ validator: validatePassword, trigger: 'blur' }]
})

// 获取验证码
const getVerifyCode = () => {
  info.verifyLoading = true
  request(`https://api.wangyangyang.vip/getVerifyCode?email=${info.email}`).then((r: any) => {
    if (r?.status) {
      ElNotification({
        title: 'Success',
        message: '验证码已发送，请查看邮箱✨',
        type: 'success'
      })
    } else {
      ElNotification({
        title: 'Error',
        message: '验证码发送失败，请联系管理员😥',
        type: 'error'
      })
    }
    let tid = setTimeout(() => {
      info.verifyLoading = false
      clearTimeout(tid)
    }, 60000)
  })
}

// 表单提交
const submit = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  info.loading = true
  formEl.validate((valid) => {
    if (valid) {
      request('https://api.wangyangyang.vip/register', {}, 'POST', {
        username: info.email,
        password: info.password,
        verifyCode: info.verifyCode
      }).then((r: any) => {
        if (r?.status) {
          ElNotification({
            title: 'Success',
            message: '注册成功，正在跳转到umami🎉',
            type: 'success'
          })
          window.location.href = '//umami.wangyangyang.vip'
        } else {
          ElNotification({
            title: 'Error',
            message: r.msg,
            type: 'error'
          })
        }
      })
    }
    info.loading = false
  })
}
</script>

<template>
  <div class="login">
    <el-form class="form" :model="info" :rules="rules" ref="loginForm">
      <h1 class="title">umami</h1>
      <el-form-item prop="email">
        <el-input
          class="text"
          v-model="info.email"
          prefix-icon="User"
          clearable
          placeholder="请输入邮箱"
        />
      </el-form-item>
      <el-form-item class="w-50" prop="verifyCode">
        <el-input
          style="width: 70%"
          class="text"
          v-model="info.verifyCode"
          prefix-icon="ReadingLamp"
          placeholder="请输入验证码"
        />
        <el-button
          class="verify"
          type="primary"
          @click="getVerifyCode()"
          :disabled="info.verifyLoading"
        >
          获取验证码
        </el-button>
      </el-form-item>

      <el-form-item prop="password">
        <el-input
          class="text"
          v-model="info.password"
          prefix-icon="Lock"
          show-password
          clearable
          placeholder="请输入密码"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          :loading="info.loading"
          type="primary"
          class="btn"
          size="large"
          @click="submit(loginForm)"
        >
          注册
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<style lang="scss" scoped>
.login {
  transition: transform 1s;
  transform: scale(1);
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #2d3a4b;
  .form {
    width: 520px;
    max-width: 100%;
    padding: 0 24px;
    box-sizing: border-box;
    margin: 160px auto 0;
    :deep(.el-input__wrapper) {
      box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.1) inset;
      background: rgba(0, 0, 0, 0.1);
    }
    :deep(.el-input-group--append > .el-input__wrapper) {
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
    }
    :deep(.el-input-group--prepend > .el-input__wrapper) {
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
    }
    .title {
      color: #fff;
      text-align: center;
      font-size: 24px;
      margin: 0 0 24px;
    }
    .verify {
      width: 26.5%;
      height: 48px;
      margin-left: 10px;
    }
    .text {
      font-size: 16px;
      :deep(.el-input__inner) {
        color: #fff;
        height: 48px;
        line-height: 48px;
        &::placeholder {
          color: rgba(255, 255, 255, 0.2);
        }
      }
    }
    .btn {
      width: 100%;
    }
  }
}
</style>
