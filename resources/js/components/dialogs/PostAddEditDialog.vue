<script setup>
const props = defineProps({
  postDetails: {
    type: Object,
    required: false,
    default: () => ({
      title: '',
      description: '',
    }),
  },
  isDialogVisible: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits([
  'submit',
  'update:isDialogVisible',
])

const postDetails = ref({ ...toRaw(props.postDetails) })

watch(props, () => {
  console.log('POSTADDEDIT PROPS: ', props)
  postDetails.value = structuredClone(toRaw(props.postDetails))
})

const formSubmit = () => {
  emit('submit', postDetails.value)
}

const dialogModelValueUpdate = val => {
  emit('update:isDialogVisible', val)
}
</script>

<template>
  <VDialog
    :width="$vuetify.display.smAndDown ? 'auto' : 600"
    :model-value="props.isDialogVisible"
    @update:model-value="dialogModelValueUpdate"
  >
    <!-- Dialog close btn -->
    <DialogCloseBtn @click="dialogModelValueUpdate(false)" />

    <VCard class="pa-2 pa-sm-10">
      <!-- 👉 Title -->
      <VCardTitle class="text-center">
        <h4 class="text-h4 mb-2">
          {{ props.postDetails.title ? 'Edit Post' : 'Add New Post' }}
        </h4>
      </VCardTitle>
      <p class="text-body-1 mb-0">
        {{ props.postDetails.title ? 'Edit your post details' : 'Add a new post' }}
      </p>

      <VCardText class="pt-6">
        <VForm @submit.prevent="() => {}">
          <VRow>
            <!-- 👉 Post Title -->
            <VCol cols="12">
              <AppTextField
                v-model="postDetails.title"
                label="Post Title"
                placeholder="Enter post title"
                type="text"
              />
            </VCol>

            <!-- 👉 Post Description -->
            <VCol
              cols="12"
              md="6"
            >
              <AppTextField
                v-model="postDetails.description"
                label="Post Description"
                placeholder="Enter post description"
                type="text"
              />
            </VCol>

            <!-- 👉 Card actions -->
            <VCol
              cols="12"
              md="3"
              class="text-center"
            >
              <VBtn
                class="me-4"
                type="submit"
                @click="formSubmit"
              >
                Submit
              </VBtn>
              <VBtn
                color="secondary"
                variant="tonal"
                @click="$emit('update:isDialogVisible', false)"
              >
                Cancel
              </VBtn>
            </VCol>
          </VRow>
        </VForm>
      </VCardText>
    </VCard>
  </VDialog>
</template>
