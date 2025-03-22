<script setup>
import { useAuthStore } from '@/utils/auth' // Import the auth store
import avatar1 from '@images/avatars/avatar-1.png'
import { computed } from 'vue' // Import computed to make the store reactive
import { redirect } from '../../plugins/1_router/index'


// Access the auth store
const authStore = useAuthStore()

// Call initializeAuth to load user info from cookies
onMounted(() => {
  authStore.initializeAuth()
})

// Create a computed property to access user data
const user = computed(() => authStore.user)
const isAuthenticated = computed(() => authStore.isAuthenticated)

// Call the handleLogout action when the logout button is clicked
const handleLogout = () => {
  authStore.handleLogout()
}

// Handle login redirection (only if not authenticated)
const handleLoginRedirect = () => {
  redirect('/login')
}
</script>

<template>
  <VBadge
    dot
    bordered
    location="bottom right"
    offset-x="3"
    offset-y="3"
    color="success"
  >
    <VAvatar
      class="cursor-pointer"
      color="primary"
      variant="tonal"
    >
      <VImg :src="avatar1" />

      <!-- SECTION Menu -->
      <VMenu
        activator="parent"
        width="230"
        location="bottom end"
        offset="14px"
      >
        <VList>
          <!-- 👉 User Avatar & Name -->
          <VListItem>
            <template #prepend>
              <VListItemAction start>
                <VBadge
                  dot
                  location="bottom right"
                  offset-x="3"
                  offset-y="3"
                  color="success"
                >
                  <VAvatar
                    color="primary"
                    variant="tonal"
                  >
                    <VImg :src="avatar1" />
                  </VAvatar>
                </VBadge>
              </VListItemAction>
            </template>

            <VListItemTitle class="font-weight-semibold">
              {{ isAuthenticated ? user?.name || 'No Name' : 'Not Loged' }}  <!-- Display user name if available -->
            </VListItemTitle>
            <VListItemSubtitle>{{ isAuthenticated ? user?.role || 'No Role' : 'Not Loged' }}</VListItemSubtitle>
          </VListItem>

          <VDivider class="my-2" />

          <!-- 👉 Profile -->
          <VListItem
            v-if="isAuthenticated"
            link
          >
            <template #prepend>
              <VIcon
                class="me-2"
                icon="bx-user"
                size="22"
              />
            </template>

            <VListItemTitle>Profile</VListItemTitle>
          </VListItem>

          <!-- 👉 Settings -->
          <VListItem
            v-if="isAuthenticated"
            link
          >
            <template #prepend>
              <VIcon
                class="me-2"
                icon="bx-cog"
                size="22"
              />
            </template>

            <VListItemTitle>Settings</VListItemTitle>
          </VListItem>

          <!-- 👉 Pricing -->
          <VListItem
            v-if="isAuthenticated"
            link
          >
            <template #prepend>
              <VIcon
                class="me-2"
                icon="bx-dollar"
                size="22"
              />
            </template>

            <VListItemTitle>Pricing</VListItemTitle>
          </VListItem>

          <!-- 👉 FAQ -->
          <VListItem link>
            <template #prepend>
              <VIcon
                class="me-2"
                icon="bx-help-circle"
                size="22"
              />
            </template>

            <VListItemTitle>FAQ</VListItemTitle>
          </VListItem>

          <!-- Divider -->
          <VDivider class="my-2" />

          <!-- 👉 Logout / Login -->
          <VListItem @click="isAuthenticated ? handleLogout() : handleLoginRedirect()">
            <template #prepend>
              <VIcon
                class="me-2"
                icon="bx-log-out"
                size="22"
              />
            </template>

            <VListItemTitle>{{ isAuthenticated ? 'Logout' : 'Login' }}</VListItemTitle>
          </VListItem>
          <VListItem @click="!isAuthenticated ? handleLogout() : handleLoginRedirect()">
            <template #prepend>
              <VIcon
                class="me-2"
                icon="bx-log-out"
                size="22"
              />
            </template>

            <VListItemTitle>{{ !isAuthenticated ? 'Logout' : 'Login' }}</VListItemTitle>
          </VListItem>
        </VList>
      </VMenu>
      <!-- !SECTION -->
    </VAvatar>
  </VBadge>
</template>
