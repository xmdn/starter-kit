<script setup>
import { usePostsStore } from '@/plugins/2_pinia'
import { useConfigStore } from '@core/stores/config'
import { AppContentLayoutNav } from '@layouts/enums'
import { switchToVerticalNavOnLtOverlayNavBreakpoint } from '@layouts/utils'

const DefaultLayoutWithHorizontalNav = defineAsyncComponent(() => import('./components/DefaultLayoutWithHorizontalNav.vue'))
const DefaultLayoutWithVerticalNav = defineAsyncComponent(() => import('./components/DefaultLayoutWithVerticalNav.vue'))
const configStore = useConfigStore()

// ℹ️ This will switch to vertical nav when define breakpoint is reached when in horizontal nav layout

// Remove below composable usage if you are not using horizontal nav layout in your app
switchToVerticalNavOnLtOverlayNavBreakpoint()

const { layoutAttrs, injectSkinClasses } = useSkins()

injectSkinClasses()

// SECTION: Loading Indicator
const isFallbackStateActive = ref(false)
const refLoadingIndicator = ref(null)

const postsStore = usePostsStore()
const searchQuery = ref('')
const filter = ref('newest')

// Debounce helper
let debounceTimeout = null

const debouncedSearch = () => {
  clearTimeout(debounceTimeout)
  debounceTimeout = setTimeout(() => {
    postsStore.fetchPosts(filter.value, searchQuery.value)
  }, 300) // adjust delay as needed
}

watch([
  isFallbackStateActive,
  refLoadingIndicator,
], () => {
  if (isFallbackStateActive.value && refLoadingIndicator.value)
    refLoadingIndicator.value.fallbackHandle()
  if (!isFallbackStateActive.value && refLoadingIndicator.value)
    refLoadingIndicator.value.resolveHandle()
}, { immediate: true })
// !SECTION
</script>

<template>
  <Component
    v-bind="layoutAttrs"
    :is="configStore.appContentLayoutNav === AppContentLayoutNav.Vertical ? DefaultLayoutWithVerticalNav : DefaultLayoutWithHorizontalNav"
  >
    <AppLoadingIndicator ref="refLoadingIndicator" />

    <!-- 🔍 SearchBar component -->
    <div class="layout-header-search px-4 py-2">
      <VTextField
        v-model="searchQuery"
        placeholder="Search posts..."
        prepend-inner-icon="mdi-magnify"
        hide-details
        class="mb-4 max-w-md"
        @input="debouncedSearch"
      />
    </div>

    <RouterView v-slot="{ Component }">
      <Suspense
        :timeout="0"
        @fallback="isFallbackStateActive = true"
        @resolve="isFallbackStateActive = false"
      >
        <Component :is="Component" />
      </Suspense>
    </RouterView>
  </Component>
</template>

<style lang="scss">
// As we are using `layouts` plugin we need its styles to be imported
@use "@layouts/styles/auth-layout";
</style>
