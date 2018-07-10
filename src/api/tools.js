import request from '@/utils/request'

export function getIdCard(areacode, age, sex) {
  return request({
    url: '/idcards',
    method: 'get',
    params: { areacode, age, sex }
  })
}
