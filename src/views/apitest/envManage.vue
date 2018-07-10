<template>
  <div class="app-container">
    <el-col style="padding: 4px 0px">
      <el-button size="mini" @click="createHost()">新增</el-button>
      <el-button size="mini" type="danger">删除</el-button>
    </el-col>
    <el-col style="padding-top: 2px">
      <el-table border :data="testserver" style="width: 100%">
        <el-table-column type="selection" :show-overflow-tooltip='true'></el-table-column>
        <el-table-column prop="id" label="#"></el-table-column>
        <el-table-column prop="name" label="服务器名称"></el-table-column>
        <el-table-column prop="protocol" label="使用协议"></el-table-column>
        <el-table-column prop="ip" label="域名或ip" :show-overflow-tooltip='true'></el-table-column>
        <el-table-column prop="port" label="端口"></el-table-column>
        <el-table-column prop="ops" label="操作" width="220">
          <template slot-scope="scope">
            <el-button size="mini" @click="EditSer(scope.$index, scope.row)">修改</el-button>
            <el-button size="mini" type="danger" @click="DeleteSer(scope.$index, scope.row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-col>
    <el-dialog :title="title" :visible.sync="envFormVisible">
      <el-form :model="envForm">
        <el-form-item label="服务器名称" :label-width="formLabelWidth">
          <el-input v-model="envForm.name"></el-input>
        </el-form-item>
        <el-form-item label="使用协议" :label-width="formLabelWidth">
          <el-select v-model="envForm.protocol" placeholder="请选择协议" style="width: 100%;">
            <el-option label="http" value="http"></el-option>
            <el-option label="https" value="https"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="域名或ip" :label-width="formLabelWidth">
          <el-input v-model="envForm.ip"></el-input>
        </el-form-item>
        <el-form-item label="端口" prop="port" :label-width="formLabelWidth"
                      :rules="[
                                  { required: true, message: '端口不能为空'},
                                  { type: 'number', message: '端口必须为数字值'}
                                ]">
          <el-input type="port" v-model.number="envForm.port"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="envFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitEnv(envForm)">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { getTestServerList, deleteServer, addServer } from '@/api/apitest'
  export default {
    name: 'envmanage',
    data() {
      return {
        envFormVisible: false,
        formLabelWidth: '150px',
        testserver: [{
          id: '1',
          name: 'uat',
          ip: '127.0.0.1',
          port: '8083'
        }],
        envForm: {
          // id: '',
          name: '',
          protocol: 'http',
          ip: '',
          port: 0
        },
        title: '新增服务器'
      }
    },
    mounted: function() {
      // this.showData()
      this.showServerList()
    },
    methods: {
      showServerList: function() {
        // 获取服务器信息列表
        getTestServerList().then(response => {
          console.log(response)
          this.testserver = response
        }).catch(e => {})
      },
      createHost: function() {
        this.envFormVisible = true
      },
      submitEnv: function(envForm) {
        addServer(envForm).then(response => {
          this.envFormVisible = false
          this.$message({
            message: '添加服务器成功',
            type: 'success'
          })
          this.showServerList()
        }, response => {
          this.$message({
            message: '添加服务器失败',
            type: 'error'
          })
          // console.log(response)
        })
      },
      EditSer: function(index, row) {
        this.envForm = this.testserver[index]
        this.title = '编辑服务器'
        this.envFormVisible = true
        // this.server = row.id
      },
      DeleteSer: function(index, row) {
        this.$confirm('确认删除？')
          .then(_ => {
            deleteServer(row.id).then((response) => {
              // console.log(response.body)
              this.dialogFormVisible = false
              this.$message({
                message: '删除成功',
                type: 'success'
              })
              this.showServerList()
            }, (response) => {
              this.$message({
                message: '删除失败' + response.body,
                type: 'error'
              })
              // console.log(response.body)
            })
          })
          .catch(_ => {
          })
      }
    }

  }
</script>

<style scoped>

</style>
