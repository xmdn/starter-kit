<script setup>
import { useAuthStore } from '@/utils/auth'
import { useTheme } from 'vuetify'

const { global } = useTheme()
const authStore = useAuthStore()

const authProviders = [
  {
    icon: 'bx-bxl-facebook-circle',
    color: '#4267b2',
    colorInDark: '#497CE2',
  },
  {
    icon: 'bx-bxl-twitter',
    color: '#1da1f2',
    colorInDark: '#1da1f2',
  },
  {
    icon: 'bx-bxl-github',
    color: '#272727',
    colorInDark: '#fff',
  },
  {
    icon: 'bx-bxl-google',
    color: '#dd4b39',
    colorInDark: '#db4437',
  },
]
</script>

<template>
  <div class="d-flex justify-center flex-wrap gap-1">
    <VBtn
      v-for="link in authProviders"
      :key="link.icon"
      icon
      variant="text"
      size="small"
      :color="global.name.value === 'dark' ? link.colorInDark : link.color"
      @click="authStore.handleOAuthLogin(link.name)"
    >
      <VIcon
        size="20"
        :icon="link.icon"
      />
    </VBtn>
  </div>
</template>
