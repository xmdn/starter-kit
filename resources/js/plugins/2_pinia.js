import { createPinia, defineStore } from 'pinia'
import { $api } from '../utils/api'


export const usePostsStore = defineStore('posts', {
  state: () => ({
    posts: [],
  }),

  actions: {
    async fetchPosts(filter = 'newest', search = '') {
      
      try {
        // const { users } = await ofetch("/api/users", {
        //   method: "POST",
        //   body: { some: "json" },
        // });
        const { data } = await $api('/posts', { query: { filter: filter, search: search } })

        this.posts = data // Store fetched posts
      } catch (error) {
        console.error('Error fetching posts:', error)
      }
    },

    // Create a new post by sending a POST request
    async createPost(postData) {
      try {
        // Send POST request to create a new post
        return await $api('/posts', {
          method: "POST",
          body: postData,
        }) // Add the new post to the store
      } catch (error) {
        console.error('Error creating post:', error)
      }
    },
    async updatePost(postData) {
      try {
        const updatedPost = await $api(`/posts/${postData.id}`, {
          method: "PUT",
          body: postData,
        })
    
        if (!Array.isArray(this.posts)) {
          this.posts = []
        }
    
        const index = this.posts.findIndex(p => p.id === updatedPost.id)
        if (index !== -1) {
          this.posts[index] = updatedPost
        } else {
          this.posts.push(updatedPost)
        }
    
        return updatedPost
      } catch (error) {
        console.error("Error updating post:", error)
      }
    },
    async deletePost(postId) {
      try {
        const response = await $api(`/posts/${postId}`, {
          method: "DELETE",
        })
    
        if (response || response === undefined) {
          // 204 means "No Content" — successful delete
    
          // Ensure `posts` exists before modifying
          if (!Array.isArray(this.posts)) {
            this.posts = []
          }
    
          // Filter out the deleted post by ID
          this.posts = this.posts.filter(post => post.id !== postId)
        } else {
          alert("ERROR HTTP: " + response.status)
        }
      } catch (error) {
        console.error("Error deleting post:", error)
      }
    },
  },
})


export const store = createPinia()
export default function (app) {
  app.use(store)
}
