<template>
  <div class="app-container">
    <el-row>
    <el-button type="primary" @click="addSuite()">新增</el-button></el-row>
    <el-row style="padding-top: 10px">
      <el-table border :data="testSuiteData" style="width: 100%">
        <el-table-column type="index" label="#" width="50px"></el-table-column>
        <el-table-column prop="suitename" label="测试集" width="150px"></el-table-column>
        <el-table-column prop="projects" label="所属项目" width="150px"></el-table-column>
        <el-table-column prop="casenames" label="包含用例"></el-table-column>
        <el-table-column prop="ops" label="操作" width="220">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="handleRun(scope.row.id, JSON.parse(scope.row.caseids))">
              执行
            </el-button>
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row);">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>

    <el-dialog title="新建测试集" :visible.sync="suiteFormVisible">
      <el-form :model="suiteForm" label-position="left">
        <el-form-item label="测试集名称" :label-width="formLabelWidth">
          <el-input v-model="suiteForm.suiteName"></el-input>
        </el-form-item>
        <el-form-item label="选择用例" :label-width="formLabelWidth">
          <el-tree :props="props" :load="loadNode" ref="tree" lazy show-checkbox @check-change="handleCheckchange"></el-tree>
        </el-form-item>
        <el-form-item label="选择环境" :label-width="formLabelWidth">
          <el-select v-model="suiteForm.serverId">
            <el-option v-for="server in serverList" :key="server.id" :label="server.name"
                       :value="server.id"></el-option>
          </el-select>
        </el-form-item>


      </el-form>
      <div slot="footer" style="text-align: center">
        <el-button type="primary" @click="submitSuite()">提 交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { getTestSuiteList, getProjectList, getModuleListByProject, getTestcaseByProjectAndModule, getTestServerList,
    addTestSuite, runTestSuite, deleteTestSuite } from '@/api/apitest'

  export default {
    data() {
      return {
        active: 0,
        testSuiteData: [],
        props: {
          label: 'name',
          isLeaf: 'leaf'
        },
        projects: [],
        modules: [],
        caseids: [],
        suiteForm: {},
        suiteFormVisible: false,
        moduleData: [],
        formLabelWidth: '100px',
        serverList: []
      }
    },
    mounted: function() {
      this.showSuiteData()
      getProjectList().then(response => {
        console.log(response)
        this.projects = response
      }, response => {
        console.log(response)
      })
      getTestServerList().then(response => {
        console.log(response)
        this.serverList = response
      }, response => {
        console.log(response)
      })
    },
    methods: {
      showSuiteData() {
        getTestSuiteList().then(response => {
          this.testSuiteData = response
        }, response => {
          console.log(response)
        })
      },
      submitSuite() {
        var data
        data = this.generateTreeSubmitData()
        this.projects = data.projects
        addTestSuite(this.suiteForm.suiteName, this.projects, data.testcases, this.suiteForm.serverId).then(response => {
          console.log(response)
          this.suiteFormVisible = false
          this.$message.success('添加测试集成功！')
          this.showSuiteData()
        })
        console.log(JSON.stringify(data))
      },
      generateTreeSubmitData() {
        var projects = new Set()
        var modules = new Set()
        var testcases = new Set()
        this.$refs.tree.getCheckedNodes().forEach(node => {
          if ('project' in node) {
            projects.add(node.project)
            modules.add(node.name)
          } else if ('id' in node) {
            testcases.add(node.id)
          } else {
            projects.add(node.name)
          }
        })
        return { projects: projects, modules: modules, testcases: testcases }
      },
      loadNode(node, resolve) {
        if (node.level === 0) {
          var data = []
          console.log('projects:' + this.projects)
          this.projects.forEach(project => {
            if (project === 'all') return
            data.push({ name: project })
          })
          return resolve(data)
        }
        setTimeout(() => {
          var data = []
          if (node.level === 1) {
            getModuleListByProject(node.data.name).then(response => {
              this.modules = response
              this.modules.forEach(module => {
                data.push({ name: module, project: node.data.name })
              })
              resolve(data)
            })
          }
          if (node.level === 2) {
            var data2 = []
            console.log('moduleNodeData:' + JSON.stringify(node.data))
            getTestcaseByProjectAndModule(node.data.project, node.data.name).then(response => {
              this.caseids = response
              this.caseids.forEach(testcase => {
                data2.push({ name: testcase.name, leaf: true, id: testcase.id })
              })
              console.log('data2:' + data2)
              resolve(data2)
            })
          }
        }, 500)
        // return resolve([{ name: 'aaa', zones: 'regedit' }, { name: 'bbb' }])
      },
      handleCheckchange(data, checked, indeterminate) {
        console.log(data, checked, indeterminate)
        console.log(this.$refs.tree.getCheckedNodes())
      },
      addSuite() {
        this.suiteForm = {}
        this.suiteFormVisible = true
      },
      handleRun(id, caseIds) {
        runTestSuite(id, caseIds).then(response => {
          console.log(response)
        })
      },
      handleDelete(id) {
        deleteTestSuite(id).then(response => {
          console.log(response)
          this.$message.success('删除成功！')
          this.showSuiteData()
        })
      }
    }
  }
</script>
