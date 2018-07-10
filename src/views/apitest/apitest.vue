<template>
  <div class="app-container">
    <el-row style="padding: 4px 0px">
      <div style="border-radius: 3px;border:1px">
        <el-form v-model="searchForm" :inline="true" size="small" style="border: 1px;border-radius: 3px">
          <el-form-item label-width="100">
            <el-input clearable v-model="searchForm.name" placeholder="用例名"></el-input>
          </el-form-item>
          <el-form-item label-width="100">
            <el-select v-model="searchForm.project" placeholder="全部">
              <el-option v-for="project in projects" :key="project" :label="project"
                         :value="project"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitSearch()">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-row>
    <el-col style="padding: 4px 0px">
      <el-button size="mini" @click="createCase()">新增</el-button>
      <el-button size="mini" type="primary" @click="batchRun()">执行</el-button>
      <el-button size="mini" type="danger" @click="batchDelete()">删除</el-button>
      <el-button size="mini" @click="handleCopy()">复制</el-button>
    </el-col>
    <el-col style="padding-top: 8px">
      <el-table border :data="CaseData" style="width: 100%" ref="caseTable" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="50" :show-overflow-tooltip='true'></el-table-column>
        <el-table-column prop="name" label="用例名称" width="150"></el-table-column>
        <el-table-column prop="project" label="所属项目" width="100"></el-table-column>
        <el-table-column prop="module" label="模块" width="100" :show-overflow-tooltip='true'></el-table-column>
        <el-table-column prop="method" label="请求方法" width="90"></el-table-column>
        <el-table-column prop="uri" label="请求URI" width="150" :show-overflow-tooltip='true'>></el-table-column>
        <el-table-column prop="params" label="请求参数" :show-overflow-tooltip='true'></el-table-column>
        <el-table-column prop="expects" label="预期结果" placeholder="输入预期返回包含内容"
                         :show-overflow-tooltip='true'></el-table-column>
        <el-table-column prop="ops" label="操作" width="220">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="handleRun(scope.row)"
            >执行
            </el-button>
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row);">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-col>
    <el-row style="padding-top: 10px;float: right">
      <div class="block">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
                       :page-sizes="[20,50,100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper"
                       :total="total">
        </el-pagination>
      </div>
    </el-row>
    <el-dialog :title="title" :visible.sync="dialogFormVisible">
      <el-form :model="caseForm" size="small">
        <el-tabs v-model="activeTabName" @table-click="handleClickTab">
          <el-tab-pane label="接口信息" name="interface_info">
            <el-form-item label="接口名称" :label-width="formLabelWidth">
              <el-input v-model="caseForm.name"></el-input>
            </el-form-item>
            <el-form-item label="所属项目" :label-width="formLabelWidth">
              <el-input v-model="caseForm.project"></el-input>
            </el-form-item>
            <el-form-item label="所属模块" :label-width="formLabelWidth">
              <el-input v-model="caseForm.module"></el-input>
            </el-form-item>
            <el-form-item label="请求方式" :label-width="formLabelWidth">
              <el-select v-model="caseForm.method" placeholder="请选择请求方式" style="width: 100%;">
                <el-option label="POST" value="POST"></el-option>
                <el-option label="GET" value="GET"></el-option>
                <el-option label="PUT" value="PUT"></el-option>
                <el-option label="DELETE" value="DELETE"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="接口URI" :label-width="formLabelWidth">
              <el-input v-model="caseForm.uri"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="接口数据" name="interface_data">
            <el-form-item label="数据类型" :label-width="formLabelWidth">
              <el-radio-group v-model="caseForm.dataformat" @change="changedataformat(caseForm.dataformat)">
                <el-radio label="form">Form data</el-radio>
                <el-radio label="json">Json data</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="请求数据" :label-width="formLabelWidth">
              <el-input v-if="caseForm.dataformat === 'json'" type="textarea" v-model="caseForm.params" placeholder="输入期望请求参数"></el-input>
              <template v-else>
                <el-col :span="5">
                  <el-button icon="el-icon-plus" size="mini" @click="addParam()">添加请求参数</el-button>
                </el-col>
                <el-col :span="1">&nbsp;</el-col>
                <el-col :span="4">
                  <el-button icon="el-icon-plus" size="mini" @click="addFileParam()">添加文件</el-button>
                </el-col>
              </template>
            </el-form-item>
            <el-form-item v-for="param,index in params" align="center" :key="index"
                           :label-width="formLabelWidth">
              <el-col :span="8">
                <el-input v-model="param.name" placeholder="参数名称"></el-input>
              </el-col>
              <el-col :span="1">-</el-col>
              <el-col :span="8">
                <el-input v-model="param.value" placeholder="参数值"></el-input>
              </el-col>
              <el-col :span="1" style="padding-left: 10px">
                <el-button size="mini" type="danger" icon="el-icon-close" @click="removeParam(param)"></el-button>
              </el-col>
            </el-form-item>
            <el-form-item v-for="param,index in fileParams" align="center" :key="index"
                          :label-width="formLabelWidth">
              <el-col :span="4">
                <el-input v-model="param.name" placeholder="参数名称"></el-input>
              </el-col>
              <el-col :span="4">
                <el-upload action="https://jsonplaceholder.typicode.com/posts/" :name="param.name">
                  <el-button size="mini" type="primary">点击上传</el-button>
                </el-upload>
              </el-col>
              <el-col :span="1">
                <el-button size="mini" type="danger" icon="el-icon-close" @click="removeFileParam(param)"></el-button>
              </el-col>
            </el-form-item>
            <el-form-item label="头部信息" :label-width="formLabelWidth">
              <el-button icon="el-icon-plus" size="mini" @click="addCaseHeader()">添加HTTP头部信息</el-button>
            </el-form-item>
            <el-form-item v-for="(header, index) in headerList" :key="index" align="center"
                          :label-width="formLabelWidth">
              <el-col :span="8">
                <el-input v-model="header.name" placeholder="HTTP头部名称"></el-input>
              </el-col>
              <el-col class="line" :span="1">-</el-col>
              <el-col :span="8">
                <el-input v-model="header.value" placeholder="HTTP头部值"></el-input>
              </el-col>
              <el-col :span="1" style="padding-left: 10px">
                <el-button size="mini" type="danger" icon="el-icon-close" @click="removeCaseHeader(header)"></el-button>
              </el-col>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="结果检查" name="interface_check">
            <el-form-item label="期望结果" :label-width="formLabelWidth">
              <el-button size="small" icon="el-icon-plus" @click="addExpect()">添加检查规则</el-button>
            </el-form-item>
            <el-form-item v-for="(expect, index) in expects" :key="index" :label-width="formLabelWidth">
              <el-col :span="4">
                <el-select v-model="expect.field" placeholder="选择内容区域">
                  <el-option v-for="field,index in responseField" :value="field.value" :key="index" :label="field.label"></el-option>
                </el-select>
              </el-col>
              <el-col :span="4" style="margin-left: 10px">
                <el-input v-if="expect.field === 'responseKey'" label="指定字段" v-model="expect.specifiedField"></el-input>
              </el-col>
              <el-col :span="4" style="margin-left: 10px">
                <el-select v-model="expect.matchRule" placeholder="选择匹配方法">
                  <el-option v-for="match,index in matchRules" :value="match.value" :key="index" :label="match.label"></el-option>
                </el-select>
              </el-col>
              <el-col :span="4" style="margin-left: 10px">
                <el-input v-model="expect.assertString"></el-input>
              </el-col>
              <el-col :span="1" style="padding-left: 10px">
                <el-button size="small" type="danger" icon="el-icon-close" @click="delExpect(expect)"></el-button>
              </el-col>
            </el-form-item>
            <el-form-item label="前置用例">
              <el-select v-model="caseForm.caseid" placeholder="请选择前置用例">
                <el-option v-for="testcase in caselist" :label="testcase.name" :value="testcase.id" :key="testcase.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-tab-pane>
        </el-tabs>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align: center">
        <el-button @click="dialogFormVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="postData()" size="small">确 定</el-button>
        <el-button type="primary" @click="dryRun()" size="small">试 跑</el-button>
      </div>
    </el-dialog>


    <el-dialog title="单接口测试" :visible.sync="runFormVisible">
      <el-form :model="runForm">
        <el-form-item label="选择环境" :label-width="formLabelWidth">
          <el-select v-model="runForm.serverId" placeholder="请选择要测试的环境">
            <el-option v-for="server in serverList" :key="server.id" :label="server.name"
                       :value="server.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="参数测试" :label-width="formLabelWidth">
          <el-checkbox-group v-model="runForm.params">
            <el-checkbox label="参数为空" name="empty"></el-checkbox>
            <el-checkbox label="参数超长" name="long"></el-checkbox>
            <el-checkbox label="参数为特殊字符" name="spec"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align: center">
        <el-button @click="runFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitRun()">确 定</el-button>
      </div>
    </el-dialog>


    <el-dialog title="测试结果" :visible.sync="resultFormVisible">
      <el-form :model="resultForm">
        <el-table border :data="resultData">
          <el-table-column type="index" label="#" width="50"></el-table-column>
          <el-table-column prop="casename" label="用例名称" width="100"></el-table-column>
          <el-table-column prop="request" label="请求数据" width="200" :show-overflow-tooltip='true'></el-table-column>
          <el-table-column prop="response" label="返回数据" :show-overflow-tooltip='true'></el-table-column>
          <el-table-column prop="testresult" label="测试结果" width="80">
            <template slot-scope="scope">
              <el-tag :type="scope.row.testresult === 'Pass'? 'success':'danger'" disable-transitions>
                {{scope.row.testresult}}
              </el-tag>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align: center">
        <el-button @click="runDone()">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import axios from 'axios'
  import { getTestCaseList, getTestServerList, getProjectList, deleteTestcase, addTestcase, updateTestcase, runTest } from '@/api/apitest'
  export default {
    data() {
      return {
        CaseData: [],
        caseId: 0,
        title: '',
        caseForm: {
          name: '',
          project: '',
          module: '',
          method: 'POST',
          uri: '',
          params: [],
          expects: [],
          field: '',
          matchRule: '',
          dataformat: 'form',
          headers: ''
        },
        runForm: {
          serverId: '',
          headers: [],
          params: []
        },
        resultForm: {
          casename: '',
          request: '',
          response: '',
          testresult: ''
        },
        caseIds: [],
        resultData: [],
        formLabelWidth: '70px',
        dialogFormVisible: false,
        runFormVisible: false,
        resultFormVisible: false,
        multipleSelection: [],
        currentPage: 1,
        pageSize: 20,
        total: 0,
        searchForm: {
          name: '',
          project: 'all'
        },
        headerList: [],
        activeTabName: 'interface_info',
        projects: [],
        serverList: [],
        params: [{
          name: '',
          value: ''
        }],
        expects: [{
          field: 'content',
          specifiedField: '',
          matchRule: 'contains',
          assertString: ''
        }],
        isFileParam: false,
        fileParams: [],
        responseField: [{
          label: '响应文本',
          value: 'content'
        }, {
          label: '响应代码',
          value: 'status'
        }, {
          label: '响应头',
          value: 'header'
        }, {
          label: '指定响应字段',
          value: 'responseKey'
        }],
        matchRules: [{
          label: '包含',
          value: 'contains'
        }, {
          label: '相等',
          value: 'equals'
        }, {
          label: '大于',
          value: 'gt'
        }, {
          label: '小于',
          value: 'lt'
        }],
        caselist: []
      }
    },
    mounted: async function() {
      this.showCaseData()
      getProjectList().then(response => {
        this.projects = response
      })
      // 获取服务器信息列表
      getTestServerList().then(response => {
        this.runForm.testserver = response
        this.serverList = this.runForm.testserver
      }, response => {
        this.$message({
          message: '获取服务器列表失败',
          type: 'error'
        })
        console.log(response)
      })
    },
    methods: {
      handleEdit(index, row) {
        this.caseForm = this.CaseData[index]
        this.headerList = JSON.parse(row.headers)
        this.title = '编辑'
        this.dialogFormVisible = true
        this.caseId = row.id
        this.params = JSON.parse(row.params)
        this.expects = JSON.parse(row.expects)
        console.log(this.CaseData)
        // console.log(index, row)
      },
      postDelete(id) {
        deleteTestcase(id).then((response) => {
          // console.log(response.body)
          this.dialogFormVisible = false
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.showCaseData()
        }, (response) => {
          this.$message({
            message: '删除失败',
            type: 'error'
          })
          // console.log(response.body)
        })
      },
      handleDelete(index, row) {
        this.$confirm('确认删除用例？')
          .then(_ => {
            this.postDelete(row.id)
          })
          .catch(_ => {
          })
      },
      showCaseData(name, project) {
        name = name || ''
        project = project || ''
        var offset = this.currentPage
        var size = this.pageSize
        // this.params = { name, project, offset, size }
        getTestCaseList(name, project, offset, size).then(response => {
          console.log(response)
          this.CaseData = response.data
          this.total = response.total
        }).catch(response => {
          console.log(response)
        })
      },
      postData() {
        // console.log('提交数据data')
        this.caseForm.headers = JSON.stringify(this.headerList)
        console.log('提交数据data:' + this.caseForm)
        if (this.title === '编辑') {
          updateTestcase(this.caseId, this.caseForm).then((response) => {
            console.log(response.body)
            this.dialogFormVisible = false
            this.showCaseData()
          }, (response) => {
            console.log(response.body)
          })
        }
        if (this.title === '新增') {
          // var paramsData = {}
          // var paramsList = []
          // this.params.forEach(param => {
          //   paramsData[param.name] = param.value
          //   paramsList.push(paramsData)
          // })
          this.caseForm.expects = JSON.stringify(this.expects)
          if (this.caseForm.dataformat === 'form') {
            this.caseForm.params = JSON.stringify(this.params)
          }
          addTestcase(this.caseForm).then((response) => {
            // console.log(response.body)
            this.dialogFormVisible = false
            this.$message({
              message: '新增用例成功',
              type: 'success'
            })
            this.showCaseData()
          }, (response) => {
            console.log(response)
            this.$message.error('新增用例失败')
          })
        }
      },
      submitRun(serverId) {
        console.log('caseId:' + this.caseId + 'serverId:' + serverId)
        if (this.caseId !== 0) {
          this.caseIds.push(this.caseId)
        }
        runTest(this.caseIds, this.runForm.serverId).then(response => {
          console.log(response)
          this.runFormVisible = false
          this.resultData = response
          this.resultFormVisible = true
          if (response.status !== 200) {
            this.$message({
              message: '用例执行失败，请到结果页面查看原因',
              type: 'error'
            })
          } else {
            this.$message({
              message: '用例执行成功',
              type: 'success'
            })
          }
        }, response => {
          console.log(response)
        })
      },
      handleRun(row) {
        this.runFormVisible = true
        console.log(row)
        this.caseId = row.id
      },
      handleSelectionChange(val) {
        this.multipleSelection = val
      },
      batchRun() {
        if (this.multipleSelection.length === 0) {
          this.$message({
            message: '请选择用例执行测试',
            type: 'error'
          })
          return
        }
        this.runFormVisible = true
        console.log(this.multipleSelection)
        this.multipleSelection.forEach(casedata => {
          this.caseIds.push(casedata['id'])
        })
        console.log(this.caseIds)
      },
      batchDelete() {
        if (this.multipleSelection.length === 0) {
          this.$message({
            message: '请选择用例再删除',
            type: 'error'
          })
          return
        }
        this.$confirm('确认删除所选用例？')
          .then(_ => {
            this.multipleSelection.forEach(casedata => {
              this.postDelete(casedata['id'])
            })
          })
          .catch(_ => {
          })
      },
      createCase() {
        this.title = '新增'
        this.params = []
        this.caseForm = {
          name: '',
          project: '',
          module: '',
          method: 'POST',
          uri: '/',
          params: '',
          expects: '',
          dataformat: 'form',
          headers: ''
        }
        this.headerList = []
        this.dialogFormVisible = true
      },
      handleCopy() {
        if (this.multipleSelection.length === 0) {
          this.$message({
            message: '请选择用例再做复制',
            type: 'error'
          })
          return
        }
        if (this.multipleSelection.length > 1) {
          this.$message({
            message: '只能选择1条用例做复制',
            type: 'error'
          })
          return
        }
        this.caseForm = this.multipleSelection[0]
        this.title = '新增'
        this.dialogFormVisible = true
        console.log(this.CaseData)
      },
      removeHeader(item) {
        var index = this.runForm.headers.indexOf(item)
        if (index !== -1) {
          this.runForm.headers.splice(index, 1)
        }
      },
      runDone() {
        this.resultFormVisible = false
        // this.multipleSelection.splice(0, this.multipleSelection.length)
        this.caseIds.splice(0, this.caseIds.length)
      },
      handleSizeChange(val) {
        this.pageSize = val
        this.showCaseData()
        console.log(val)
      },
      handleCurrentChange(val) {
        console.log(val)
        this.currentPage = val
        this.showCaseData()
      },
      submitSearch() {
        this.showCaseData(this.searchForm.name, this.searchForm.project)
        console.log(this.searchForm)
      },
      handleClickTab(tab, event) {
        console.log(tab, event)
      },
      addCaseHeader() {
        this.headerList.push({
          name: '',
          value: ''
        })
      },
      removeCaseHeader(item) {
        var index = this.headerList.indexOf(item)
        if (index !== -1) {
          this.headerList.splice(index, 1)
        }
      },
      changedataformat(value) {
        this.caseForm.dataformat = value
      },
      addParam() {
        this.params.push({
          name: '',
          value: ''
        })
      },
      removeParam(item) {
        var index = this.params.indexOf(item)
        if (index !== -1) {
          this.params.splice(index, 1)
        }
      },
      addFileParam() {
        this.fileParams.push({
          name: '',
          value: ''
        })
      },
      removeFileParam(item) {
        var index = this.fileParams.indexOf(item)
        if (index !== -1) {
          this.fileParams.splice(index, 1)
        }
      },
      dryRun() {
        axios.get('http://localhost:8000/serverlist').then(response => {
          console.log(response)
        })
      },
      addExpect() {
        this.expects.push({
          field: '',
          specifiedField: '',
          matchRule: '',
          value: ''
        })
      },
      delExpect(item) {
        var index = this.expects.indexOf(item)
        if (index !== -1) {
          this.expects.splice(index, 1)
        }
      }
    }
  }
</script>
<style>
  /*.el-dialog { width: 560px; }*/
  /*.runDialog { width: 560px; }*/
</style>
