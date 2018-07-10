<template>
  <div class="app-container">
    <el-table border stripe :data="suiteResultData" style="width: 100%">
      <el-table-column type="index"></el-table-column>
      <el-table-column prop="suitename" label="测试集名称" width="180px"></el-table-column>
      <el-table-column prop="project" label="项目" width="150px"></el-table-column>
      <el-table-column prop="passnumber" label="成功用例数" width="100px"></el-table-column>
      <el-table-column prop="failnumber" label="失败用例数" width="100px"></el-table-column>
      <el-table-column prop="successrate" label="成功率" width="80px"></el-table-column>
      <el-table-column prop="testresult" label="测试结果" width="80px">
        <template slot-scope="scope">
          <el-tag :type="scope.row.testresult === 'Pass'? 'success':'danger'" disable-transitions>
            {{scope.row.testresult}}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="runtime" label="测试时间" width="180px" :show-overflow-tooltip='true'></el-table-column>
      <el-table-column label="备注"></el-table-column>
    </el-table>
  </div>

</template>

<script>
    import { getRunTestSuiteResult } from '@/api/apitest'
    export default {
      // name: 'suiteresult.vue',
      data() {
        return {
          suiteResultData: []
        }
      },
      created() {
        getRunTestSuiteResult().then(response => {
          this.suiteResultData = response
        })
      }
    }
</script>

<style scoped>

</style>
