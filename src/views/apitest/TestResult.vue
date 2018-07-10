<template>
  <div class="app-container">
    <el-form v-model="searchForm" :inline="true">
      <el-form-item>
        <el-input v-model="searchForm.name" placeholder="用例名称"></el-input>
      </el-form-item>
      <el-form-item >
        <el-input v-model="searchForm.testsuite" placeholder="测试集"></el-input>
      </el-form-item>
      <el-form-item label-width="100" placeholder="测试结果">
        <el-select v-model="searchForm.testresult" clearable placeholder="全部">
          <el-option label="Pass" value="Pass"></el-option>
          <el-option label="Fail" value="Fail"></el-option>
        </el-select>
      </el-form-item>
      <el-button type="primary" @click="submitSearch()">查询</el-button>
    </el-form>
    <el-row style="padding-top: 2px">
      <el-table stripe border :data="tableResult" style="width: 100%">
        <el-table-column type="index" label="#" width="50"></el-table-column>
        <el-table-column prop="casename" label="用例名称" width="100"></el-table-column>
        <el-table-column prop="request" label="请求数据" width="350" :show-overflow-tooltip='true'></el-table-column>
        <el-table-column prop="response" label="返回数据" :show-overflow-tooltip='true'></el-table-column>
        <el-table-column prop="testsuite" label="测试集" :show-overflow-tooltip='true'></el-table-column>
        <el-table-column prop="testresult" label="测试结果" width="100" :filters="[
                        { text: 'Pass', value: 'Pass' },
                        { text: 'Fail', value: 'Fail' }]"
                         :filter-method="filterTestResult" filter-placement="bottom-end">
          <template slot-scope="scope">
            <el-tag :type="scope.row.testresult === 'Pass'? 'success':'danger'" disable-transitions>
              {{scope.row.testresult}}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="runtime" label="执行时间" width="150" :show-overflow-tooltip='true'></el-table-column>
      </el-table>

    </el-row>
    <el-row style="padding-top: 10px;float: right">
      <div>
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
                       :page-sizes="[20,50,100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper"
                       :total="total">
        </el-pagination>
      </div>
    </el-row>
  </div>
</template>

<script>
  import { getRunResult } from '@/api/apitest'

  export default {
    // name: 'test-result.vue',
    data() {
      return {
        tableResult: [{
          id: 0,
          casename: '',
          request: '',
          response: '',
          testresult: '',
          runtime: ''
        }],
        state: '',
        searchForm: {},
        pageSize: 20,
        total: 0,
        currentPage: 1
      }
    },
    mounted: function() {
      this.showData()
    },
    methods: {
      filterTestResult(value, row) {
        return row.testresult === value
      },
      showData() {
        var params = {}
        params.size = this.pageSize
        params.offset = this.currentPage
        getRunResult(params).then(response => {
          this.tableResult = response.data
          this.total = response.total
        }, response => {
          console.log(response)
        })
      },
      handleSizeChange(val) {
        this.pageSize = val
        this.showData()
        console.log(val)
      },
      handleCurrentChange(val) {
        console.log(val)
        this.currentPage = val
        this.showData()
      },
      submitSearch() {
        var params = {}
        params.size = this.pageSize
        params.offset = this.currentPage
        params.name = this.searchForm.name
        params.testsuite = this.searchForm.testsuite
        params.testresult = this.searchForm.testresult
        getRunResult(params).then(response => {
          console.log(response)
          this.tableResult = response.data
          this.total = response.total
        })
      }
    }
  }
</script>

<style scoped>

</style>
