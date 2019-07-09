import request from '@/utils/request'

export function getPagedSuppliers(data) {
  return request({
    url: '/api/services/app/supplier/GetPagedSuppliers',
    method: 'post',
    data
  })
}

export function getSupplierById(data) {
  return request({
    url: `/api/services/app/supplier/GetSupplierById?SupplierGuid=${data}`,
    method: 'post'
  })
}
