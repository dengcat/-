import store from '@/store'

/**
 * @param {Array} value
 * @returns {Boolean}
 * @example see @/views/permission/directive.vue
 */
export default function checkPermission(value) {
  // if (value && value instanceof Array && value.length > 0) {
  //   const roles = store.getters && store.getters.roles
  //   const permissionRoles = value

  //   const hasPermission = roles.some(role => {
  //     return permissionRoles.includes(role)
  //   })

  //   if (!hasPermission) {
  //     return false
  //   }
  //   return true
  // } else {
  //   return false
  // }
  const roles = store.getters && store.getters.roles
  if (roles.isAdmin) {
    return true
  }
  // value [{functionCode: "1001", actionCodes: ''}]  权限指令
  if (value && value instanceof Array && value.length > 0) {
    const permissionRoles = value
    const hasPermission = roles.prmission.some(prmission => {
      const isHavePrmission = permissionRoles.some(permissionRole => {
        return permissionRole.functionCode === prmission.functionCode && prmission.actionCodes.includes(permissionRole.actionCodes)
      })
      return isHavePrmission
    })

    return hasPermission
  } else {
    // throw new Error(`请配置权限!`)
    return false
  }
}
