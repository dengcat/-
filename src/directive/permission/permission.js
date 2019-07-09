
import store from '@/store'

export default{
  inserted(el, binding, vnode) {
    const { value } = binding
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

      if (!hasPermission) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    } else {
      throw new Error(`请配置权限!`)
    }
  }
}
