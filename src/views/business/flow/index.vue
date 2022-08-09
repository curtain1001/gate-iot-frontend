<template>
  <div class="app-container">
    <el-form v-show="showSearch" ref="queryForm" :model="queryParams" :inline="true" label-width="68px">
      <el-form-item label="车道" prop="laneId">
        <el-cascader v-model="queryParams.laneId" :show-all-levels="false" :props="{emitPath:false,value:'value',label:'label',children:'children'}" :options="laneList" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="流程名称" prop="flowName">
        <el-input
          v-model="queryParams.flowName"
          placeholder="请输入流程名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['business:flow:add']"
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['business:flow:edit']"
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['business:flow:remove']"
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['business:flow:export']"
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
        >导出</el-button>
      </el-col>
      <right-toolbar :show-search.sync="showSearch" @queryTable="getList" />
    </el-row>

    <el-table v-loading="loading" :data="flowList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="序号" align="center" prop="flowId" />
      <el-table-column label="车道" align="center" prop="laneId">
        <template slot-scope="scope">
          <GetLaneName v-model="scope.row.laneId" />
        </template>
      </el-table-column>
      <el-table-column label="流程名称" align="center" prop="flowName" />
      <el-table-column label="流程内容" align="center" prop="content" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <el-button type="primary" plain @click="dataView(scope.row.content)">点击查看</el-button>
        </template>
      </el-table-column>
      <el-table-column label="版本号" align="center" prop="version">
        <template slot-scope="scope">
          <el-tooltip
            v-if="checkDeploy(scope.row)"
            effect="dark"
            :content="versionTooltip(scope.row)"
            placement="top"
          >
            <span><i class="el-icon-question" />{{ scope.row.version }}</span>
          </el-tooltip>
          <span v-else>{{ scope.row.version }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="remark" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <el-tag v-if="isDeploy(scope.row)">已部署</el-tag>
          {{ scope.row.remark }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            v-hasPermi="['business:flow:edit']"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
          >修改</el-button>
          <el-button
            v-hasPermi="['business:flow:edit']"
            size="mini"
            type="text"
            icon="el-icon-s-open"
            @click="handleDraw(scope.row)"
          >绘制</el-button>
          <el-button
            v-hasPermi="['business:flow:edit']"
            size="mini"
            type="text"
            icon="el-icon-s-tools"
            :disabled="checkVersion(scope.row)"
            @click="deploy(scope.row)"
          >
            部署</el-button>
          <el-button
            v-hasPermi="['business:flow:remove']"
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改流程对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="车道号" prop="laneId">
          <el-cascader
            ref="cascader"
            v-model="form.laneId"
            :show-all-levels="false"
            :props="{emitPath:false,value:'value',label:'label',children:'children'}"
            :options="laneList"
            clearable
          />
        </el-form-item>
        <el-form-item label="流程名称" prop="flowName">
          <el-input v-model="form.flowName" placeholder="请输入流程名称" />
        </el-form-item>
        <!-- <el-form-item label="流程内容">
          <editor v-model="form.content" :min-height="192" />
        </el-form-item> -->
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 数据查看面板 -->
    <el-dialog
      title="数据"
      :visible.sync="dataVisible"
      width="50%"
    >
      <DataDialog :graph-data="jsonData" />
    </el-dialog>
  </div>
</template>

<script>
import DataDialog from '@/components/JsonDataDialog/index'
// import router from '@/router'
import api from './api/index'
import { laneAll } from '../area/api/index'
import { getLane } from '@/views/business/lane/api/index.js'
import GetLaneName from '@/views/business/lane/component/GetLaneName'
export default {
  name: 'Flow',
  components: {
    GetLaneName, DataDialog
  },
  data() {
    return {
      laneList: [],
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 流程表格数据
      flowList: [],
      flowDeployList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 字典
      flowIdOptions: [],
      // 创建者字典
      createByOptions: [],
      // 创建时间字典
      createTimeOptions: [],
      // 更新者字典
      updateByOptions: [],
      // 更新时间字典
      updateTimeOptions: [],
      dataVisible: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        laneId: null,
        flowName: null,
        content: null

      },
      jsonData: {},
      // 表单参数
      form: {
        laneId: 1,
        flowName: null,
        content: null
      },
      // 表单校验
      rules: {
      }
    }
  },
  async created() {
    const params = this.$route.query
    if (params && params.laneId) {
      this.queryParams.laneId = params.laneId
    }
    console.log(params)
    await this.getDeployAll()
    await this.getLaneList()
    await this.getList()
  },
  methods: {
    dataView(content) {
      this.jsonData = content
      this.dataVisible = true
    },

    getLaneList() {
      laneAll().then((rep) => {
        if (rep.code === 200) {
          this.laneList = rep.data
        }
      })
    },
    /** 查询流程列表 */
    getList() {
      this.loading = true
      api.listFlow(this.queryParams).then(response => {
        this.flowList = response.rows
        this.total = response.total
        this.loading = false
      })
    },
    getLaneName(laneId) {
      if (laneId) {
        getLane(laneId).then(rep => {
          return rep.data.laneName
        })
      }
    },
    getDeployAll() {
      api.getDeployAll().then(rep => {
        if (rep.code === 200) {
          this.flowDeployList = rep.data
        }
      })
    },
    /**
     * 校验部署流程的版本
     */
    checkVersion(row) {
      console.log(row)
      if (!this.flowDeployList && this.flowDeployList.length < 1) {
        return false
      }
      const f = this.flowDeployList.filter(flow => flow.laneId === row.laneId && flow.flowId === row.flowId)
      if (f && f.length > 0 && f[0].version === row.version) {
        return true
      } else {
        return false
      }
    },
    checkDeploy(row) {
      console.log(row)
      if (!this.flowDeployList && this.flowDeployList.length < 1) {
        return false
      }
      const f = this.flowDeployList.filter(flow => flow.laneId === row.laneId && flow.flowId === row.flowId)
      if (f && f.length > 0 && f[0].version !== row.version) {
        return true
      } else {
        return false
      }
    },
    isDeploy(row) {
      console.log(row)
      if (!this.flowDeployList && this.flowDeployList.length < 1) {
        return false
      }
      const f = this.flowDeployList.filter(flow => flow.laneId === row.laneId && flow.flowId === row.flowId)
      if (f && f.length > 0) {
        return true
      } else {
        return false
      }
    },

    /**
     * 版本不对的提示信息
     */
    versionTooltip(row) {
      if (!this.flowDeployList || this.flowDeployList.length < 1) {
        return ''
      }
      const f = this.flowDeployList.filter(flow => flow.laneId === row.laneId && flow.flowId === row.flowId)
      if (f && f.length > 0 && f[0].version !== row.version) {
        return '当前版本：' + row.version + '; 部署版本：' + f[0].version
      }
      return ''
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    // 表单重置
    reset() {
      this.form = {
        flowId: null,
        laneId: null,
        flowName: null,
        remark: null

      }
      this.resetForm('form')
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('queryForm')
      this.handleQuery()
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.flowId)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.open = true
      this.title = '添加流程'
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const flowId = row.flowId || this.ids
      api.getFlow(flowId).then(response => {
        this.form = response.data
        this.form.laneId = String(this.form.laneId)
        console.log(this.form)
        this.open = true
        this.title = '修改流程'
      })
    },
    handleDraw(row) {
      this.$router.replace({ path: `/business/flow-draw/index/${row.flowId}` })
      // router.replace()
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.flowId != null) {
            this.form.laneId = Number(this.form.laneId)
            api.updateFlow(this.form).then(response => {
              this.$modal.msgSuccess('修改成功')
              this.open = false
              this.getList()
            })
          } else {
            api.addFlow(this.form).then(response => {
              this.$modal.msgSuccess('新增成功')
              this.open = false
              this.getList()
            })
          }
        }
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const flowIds = row.flowId || this.ids
      this.$confirm('是否确认删除流程编号为"' + flowIds + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return api.delFlow(flowIds)
      }).then(() => {
        this.getList()
        this.$modal.msgSuccess('删除成功')
      }).catch((e) => {
        console.log('e', e)
        this.loading = false
      })
    },
    /**
     * 部署流程
     */
    deploy(row) {
      this.$confirm('是否确认部署流程名称为"' + row.flowName + ';版本为' + row.version + '的数据项?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true
        return api.deploy(row.laneId, row.flowId, row.version)
      }).then(async(rep) => {
        this.loading = false
        await this.getDeployAll()
        this.getList()
        this.$modal.msgSuccess('部署成功')
      }).catch((e) => {
        console.log('e', e)
        this.loading = false
      })
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams
      this.$confirm('是否确认导出所有流程数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return api.exportFlow(queryParams)
      }).then(response => {
        this.download(response.msg)
      })
    }
  }
}
</script>
<style scoped>
  .el-form-item .el-select {
    width: 100%;
  }
  .el-form-item .el-input {
    width: 100%;
  }
  .el-form-item .el-cascader {
    width: 100%;
  }
</style>
