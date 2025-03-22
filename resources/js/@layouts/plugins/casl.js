
import { AbilityBuilder, createMongoAbility } from '@casl/ability'


export const ability = createMongoAbility()


/**
 * Define role-based permissions
 * @param {Object} user - The authenticated user object
 * @returns {Ability} - CASL ability instance
 */
export function defineAbilityFor(user) {
  const { can, cannot, rules } = new AbilityBuilder(createMongoAbility)

  // Define role-based permissions
  const rolePermissions = {
    admin: () => {
      can('manage', 'Post')
    },
    user: user => {
      can('read', 'Post')
      can('create', 'Post')
      can('update', 'Post', { user_id: user.id })
      can('delete', 'Post', { user_id: user.id })
    },
    guest: () => {
      can('read', 'Post')
      cannot('create', 'Post')
      cannot('update', 'Post')
      cannot('delete', 'Post')
    },
    unauthenticated: () => {
      can('read', 'Auth')
      cannot('read', 'Post')
      cannot('create', 'Post')
      cannot('update', 'Post')
      cannot('delete', 'Post')
    },
  }

  const role = user?.role || 'unauthenticated'

  // Apply permissions based on the user's role
  if (rolePermissions[role]) {
    rolePermissions[role](user)
  } else {
    console.warn(`Unknown role: ${role}`)
  }

  // return build()
  return createMongoAbility(rules)
}

export default ability


/**
 * Returns ability result if ACL is configured or else just return true
 * We should allow passing string | undefined to can because for admin ability we omit defining action & subject
 *
 * Useful if you don't know if ACL is configured or not
 * Used in @core files to handle absence of ACL without errors
 *
 * @param {string} action CASL Actions // https://casl.js.org/v4/en/guide/intro#basics
 * @param {string} subject CASL Subject // https://casl.js.org/v4/en/guide/intro#basics
 */
export const can = (action, subject) => {
  const vm = getCurrentInstance()
  if (!vm)
    return false
  const localCan = vm.proxy && '$can' in vm.proxy
    
  return localCan ? vm.proxy?.$can(action, subject) : true
}

/**
 * Check if user can view item based on it's ability
 * Based on item's action and subject & Hide group if all of it's children are hidden
 * @param {object} item navigation object item
 */
export const canViewNavMenuGroup = item => {
  const hasAnyVisibleChild = item.children.some(i => can(i.action, i.subject))

  // If subject and action is defined in item => Return based on children visibility (Hide group if no child is visible)
  // Else check for ability using provided subject and action along with checking if has any visible child
  if (!(item.action && item.subject))
    return hasAnyVisibleChild
  
  return can(item.action, item.subject) && hasAnyVisibleChild
}

export const canNavigate = to => {
  // const ability = useAbility()

  if (!ability) {
    console.error('CASL Ability is not available yet')
    
    return false
  }

  // Get the most specific route (last one in the matched array)
  const targetRoute = to.matched[to.matched.length - 1]

  // If the target route has specific permissions, check those first
  if (targetRoute?.meta?.action && targetRoute?.meta?.subject) {
    return ability.can(targetRoute.meta.action, targetRoute.meta.subject)
  }

  const hasAnyPermissionMeta = to.matched.some(route =>
    route.meta?.action && route.meta?.subject,
  )

  // If no permissions required, allow navigation
  if (!hasAnyPermissionMeta) return true
    
  // If no specific permissions, fall back to checking if any parent route allows access
    
  return to.matched.some(route => ability.can(route.meta.action, route.meta.subject))
}
