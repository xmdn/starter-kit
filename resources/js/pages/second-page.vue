

<script setup>
import { subject } from '@casl/ability'
import AppCardCode from '@core/components/cards/AppCardCode.vue'
import { onMounted, ref } from 'vue'
import { formatDate } from '../@core/utils/formatters'
import ConfirmDialog from '../components/dialogs/ConfirmDialog.vue'
import CreateAppDialog from '../components/dialogs/CreateAppDialog.vue'
import PostAddEditDialog from '../components/dialogs/PostAddEditDialog.vue'
import { usePostsStore } from '../plugins/2_pinia'


const postsStore = usePostsStore()

// const postsStore = computed(() => usePostsStore())
const posts = computed(() => postsStore.posts)

const showConfirmDialog = ref(false)
const showAddPostDialog = ref(false)  // Define showAddPostDialog here
const showCreateDialog = ref(false)
const showCardAction = ref(false)

const postDetails = ref({
  id: null,
  title: '',
  description: '',
})

const selectedDate = ref('')

// Fetch posts when the component is mounted
onMounted(() => {
  // fetchPosts('newest');
  fetchPostDetails()
})

const fetchPostDetails = async (filter = 'newest') => {
  await postsStore.fetchPosts( filter )
  posts.value = postsStore.posts

  // Simulating an API call that fetches post details including timestamp
  // postDetails.value = {
  //   id: 1,
  //   title: 'Sample Post',
  //   description: 'This is a sample post.',
  //   date: '2025-03-19 12:00:00',  // Example timestamp
  // };
}

const code = ref({
  ts: '// TypeScript code const greet = (name: string) => { return \Hello, \name;};console.log(greet(World));',
  vue: '<template><div>Hello, Vue!</div></template>',
  js: '// JavaScript codeconst greet = () => {console.log(Hello, JavaScript!);};greet();',
})



// const fetchPosts = async (filter) => {
//   await postsStore.fetchPosts(filter); 
//   posts.value = postsStore.posts;
// };


const openDeleteDialog = post => {
  // showConfirmDialog.value = true // Open the confirmation dialog
  console.log('OPEN POST DIALOG: ', post)
  if (post) {
    console.log('OPEN POST DIALOG SECOND: ', post)
    postDetails.value = { ...post }
  } else {
    postDetails.value = null
  }
  showConfirmDialog.value = true
}

const handleDeletePost = async postDetails => {
  console.log('Post deletion CALLED')
  if (postDetails.id) {
    try {
      // Replace this with your delete API function
      await postsStore.deletePost(postDetails.id)

      // await deletePostAPI(postId) // Assuming you have this API function
      console.log('Post deleted successfully')
    } catch (error) {
      console.error('Error deleting post:', error)
    }
  }
  showConfirmDialog.value = false // Close the dialog after action
}

// Open post creation dialog
const openCreatePostDialog = () => {
  showCreateDialog.value = true
}

// Open post creation dialog
const openActionDialog = () => {
  showCardAction.value = true
}

// Open post edit dialog
const openEditPostDialog = post => {
  console.log('OPEN POST DIALOG: ', post)
  if (post) {
    console.log('OPEN POST DIALOG SECOND: ', post)
    postDetails.value = { ...post }
  } else {
    postDetails.value = null
  }
  showAddPostDialog.value = true
}

// Handle submitting the post (create or update)
const handleSubmitPost = async postDetails => {
  console.log(postDetails)
  if (postDetails.id) {
    // If the post has an ID, it's an update
    try {
      await postsStore.updatePost(postDetails)
      showAddPostDialog.value = false

      // fetchPostDetails()
    } catch (error) {
      console.error('Error creating post:', error)
    }
    console.log('Post updated successfully')
  } else {
    // Otherwise, it's a new post
    await createPostAPI(postDetails) // Your create API
    console.log('Post created successfully')
  }
  showAddPostDialog.value = false // Close dialog after submit
}

// Handle create post dialog submission
const handleCreatePost = async postDetails => {
  await createPostAPI(postDetails) // Your create API function
  console.log('Post created successfully')
  showCreateDialog.value = false // Close dialog after submission
}

const createPostAPI = async postData => {
  try {
    const req = await postsStore.createPost(postData)

    console.log('POST RESPONSE: ', req)

    postsStore.posts.push(req)

    // this.posts.push(data)
    showAddPostDialog.value = false

    // fetchPostDetails()
  } catch (error) {
    console.error('Error creating post:', error)
  }
}

// Handle create post dialog submission
const handleCardPost = async postDetails => {
  await createPostAPI(postDetails) // Your create API function
  console.log('Post created successfully')
  showCardAction.value = false // Close dialog after submission
}
</script>

<template>
  <div>
    <h1>Posts</h1>
    <!-- ConfirmDialog for deletion confirmation -->
    <ConfirmDialog
      v-if="showConfirmDialog"
      confirmation-question="Are you sure you want to delete this post?"
      :is-dialog-visible="showConfirmDialog"
      confirm-title="Post Deleted"
      confirm-msg="The post has been deleted successfully."
      cancel-title="Cancel"
      cancel-msg="You canceled the deletion action."
      :post-details="postDetails"
      @update:is-dialog-visible="showConfirmDialog = $event"
      @confirm="handleDeletePost"
    />

    

    <!-- Filter buttons -->
    <div>
      <button @click="fetchPostDetails('newest')">
        Newest
      </button>
      <button @click="fetchPostDetails('oldest')">
        Oldest
      </button>
    </div>

    <!-- PostAddEditDialog for creating/editing posts -->
    <PostAddEditDialog
      v-if="showAddPostDialog"
      :is-dialog-visible="showAddPostDialog"
      :post-details="postDetails"
      @update:is-dialog-visible="showAddPostDialog = $event"
      @submit="handleSubmitPost"
    />
    <!-- CREATE A AND EDIT POST -->


    <!-- CreateAppDialog for creating posts when no posts available -->
    <CreateAppDialog
      v-if="showCreateDialog"
      :is-dialog-visible="showCreateDialog"
      @submit="handleCreatePost"
      @update:is-dialog-visible="showCreateDialog = $event"
    />


    <AppCardCode 
      v-if="showCardAction && false"
      title="This code working, and will work everyday"
      :code="code"
      :card-data="postDetails"
      :is-dialog-visible="showCardAction"
      @submit="handleCardPost"
      @update:is-dialog-visible="showCardAction = $event"
    />

    <!-- Display posts -->
    <div v-if="posts">
      <div v-if="posts.length">
        <div
          v-for="post in posts"
          :key="post?.id"
          class="post-card"
        >
          <h2>Title: {{ post?.title }}</h2>
          <p><strong>Created at:</strong> {{ formatDate(post?.created_at) }}</p>
          <p><strong>Description:</strong> {{ post?.description.substring(0, 100) }}...</p>
          <VBtn
            v-if="$can('update', subject('Post', post))"
            @click="openEditPostDialog(post)"
          >
            Edit Post
          </VBtn>
          <VBtn
            v-if="$can('update', subject('Post', post))"
            @click="openDeleteDialog(post)"
          >
            Delete Post
          </VBtn>
        </div>
      </div>
    </div>
    <div v-else>
      <p>No posts available.</p>
    </div>
  </div>
</template>

<style scoped>
.post-card {
  padding: 16px;
  border: 1px solid #ddd;
  margin-block-end: 16px;
}

button {
  margin-inline-end: 10px;
}
</style>
