import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/adlogin',
    method: 'post',
    data
  })
}

export function getInfo(id) {
  return request({
    url: '/getadinfo',
    method: 'get',
    params: { admin_id: id }
  })
}

export function logout() {
  return request({
    url: '/vue-element-admin/user/logout',
    method: 'post'
  })
}
