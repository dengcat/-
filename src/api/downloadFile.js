import request from '@/utils/request'

export function downloadForFilename(filename) {
  return request({
    url: '/api/File/DownloadFile?name=' + filename, 
    method: 'get'
  })
}
