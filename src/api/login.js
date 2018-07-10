import request from '@/utils/request'

export function login(username, password) {
  return request({
    url: '/user/login',
    method: 'get',
    params: {
      username,
      password
    }
  })
}

export function getInfo(name) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { name }
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}
