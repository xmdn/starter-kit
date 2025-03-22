import { subject } from '@casl/ability'
import { ofetch } from 'ofetch'
import { ability, defineAbilityFor } from '../@layouts/plugins/casl'

export const $api = ofetch.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  async onRequest({ request, options }) {
    const accessToken = useCookie('accessToken').value
    if (accessToken)
      options.headers.append('Authorization', `Bearer ${accessToken}`)

    const authStore = useAuthStore()

    // const userId = authStore?.user?.id

    // Infer action from HTTP method
    const method = options.method?.toUpperCase() || 'GET'

    const methodToAction = {
      GET: 'read',
      POST: 'create',
      PUT: 'update',
      PATCH: 'update',
      DELETE: 'delete',
    }

    const action = String(methodToAction[method] || 'read')

    // Infer subject from URL (e.g., /api/posts/1 -> Post)
    const match = request.match(/^\/([^/]+)/)
    const subjectRaw = match?.[1] || ''

    const subjectType = String(
      subjectRaw.endsWith('s')
        ? subjectRaw.slice(0, -1).charAt(0).toUpperCase() + subjectRaw.slice(1, -1)
        : subjectRaw.charAt(0).toUpperCase() + subjectRaw.slice(1),
    )

    let userId
    if (options.body && typeof options.body === 'object') {
      userId = options.body.user_id || options.body.userId
    }

    let postId
    if (options.body && typeof options.body === 'object') {
      postId = options.body.id || options.body.Id
    }

    // Set default conditions (e.g., only allow if current user matches)
    // const conditions = { userId }

    const abilityUsr = defineAbilityFor(authStore?.user)

    ability.update(abilityUsr.rules)
    
    const post = { id: postId, user_id: userId }

    const needsCondition = ['update', 'delete'].includes(action)

    let isAllowed = undefined

    if (action && subject) {
      if(needsCondition) {
        isAllowed = ability.can(String(action), subject(String(subjectType), post))
        
      } else {
        isAllowed = ability.can(String(action), String(subjectType))
      }

      if (!isAllowed && isAllowed !== undefined) {
        throw new Error(`Permission denied for ${action} on ${subject}`)
      }
    }
  },
})
