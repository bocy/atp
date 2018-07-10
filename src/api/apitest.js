import request from '@/utils/request'

export function getTestCaseList(name, project, offset, size) {
  return request({
    url: '/testcase',
    method: 'get',
    params: { name, project, offset, size }
  })
}

export function getTestServerList() {
  return request({
    url: '/serverlist',
    method: 'get'
  })
}

export function getProjectList() {
  return request({
    url: '/projectlist',
    method: 'get'
  })
}

export function getModuleListByProject(project) {
  return request({
    url: '/getmodule',
    method: 'get',
    params: { project }
  })
}

export function getTestcaseByProjectAndModule(project, module) {
  return request({
    url: '/gettestcase',
    method: 'get',
    params: { project, module }
  })
}

export function getModuleList() {
  return request({
    url: '/modulelist',
    method: 'get'
  })
}

export function getRunResult(params) {
  return request({
    url: '/runresult',
    method: 'get',
    params: params
  })
}

export function deleteTestcase(id) {
  return request({
    url: '/testcase/' + id + '/',
    method: 'delete'
  })
}

export function deleteServer(id) {
  return request({
    url: '/testserver/' + id + '/',
    method: 'delete'
  })
}

export function addServer(data) {
  return request({
    url: '/serverlist/',
    method: 'post',
    data: data
  })
}

export function addTestcase(data) {
  return request({
    url: '/testcase',
    method: 'post',
    data: data
  })
}

export function updateTestcase(id, data) {
  return request({
    url: '/testcase/' + id + '/',
    method: 'put',
    data
  })
}

export function runTest(caseIds, serverId) {
  return request({
    url: '/runtest',
    method: 'post',
    data: {
      caseIds,
      serverId
    }
  })
}

export function getTestSuiteList() {
  return request({
    url: '/testsuite',
    method: 'get'
  })
}

export function addTestSuite(suiteName, project, testcases, serverId) {
  return request({
    url: '/testsuite',
    method: 'post',
    data: { suiteName, project, testcases, serverId }
  })
}

export function runTestSuite(id, caseids) {
  return request({
    url: '/runtestsuite',
    method: 'post',
    data: { id, caseids }
  })
}

export function getRunTestSuiteResult() {
  return request({
    url: '/runtestsuite',
    method: 'get'
  })
}

export function deleteTestSuite(id) {
  return request({
    url: '/testsuite/' + id + '/',
    method: 'delete'
  })
}

