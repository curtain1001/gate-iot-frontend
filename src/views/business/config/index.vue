<template>
  <div class="app-container">
    <el-form
      v-show="showSearch"
      ref="queryForm"
      :model="queryParams"
      size="small"
      :inline="true"
      label-width="85px"
    >
      <el-form-item label="车道号" prop="laneId">
        <el-cascader v-model="queryParams.laneId" :props="{emitPath:false,value:'value',label:'label',children:'children'}" :options="lanes" clearable />
      </el-form-item>
      <el-form-item label="配置参数" prop="key">
        <el-select v-model="queryParams.key" placeholder="配置参数" clearable>
          <el-option
            v-for="option in laneConfigOptions"
            :key="option.attribute"
            :label="option.label"
            :value="option.attribute"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
        >搜索</el-button>
        <el-button
          icon="el-icon-refresh"
          size="mini"
          @click="resetQuery"
        >重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['business:lane:add']"
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['business:lane:edit']"
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
          v-hasPermi="['business:lane:remove']"
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
        >删除</el-button>
      </el-col>
      <right-toolbar :show-search.sync="showSearch" @queryTable="getList" />
    </el-row>

    <el-table
      v-loading="loading"
      :data="laneList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="id" align="center" prop="laneConfigId" />
      <el-table-column
        label="车道名称"
        align="center"
        prop="areaNo"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="scope">
          <GetLaneName v-if="scope.row.laneId" v-model="scope.row.laneId" />
          <span v-else>公共</span>
        </template>
      </el-table-column>
      <el-table-column
        label="配置键名"
        align="center"
        prop="laneName"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="scope">
          <span>{{ getNameByLaneConfigOptions(scope.row.laneConfigKey) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="配置值"
        align="center"
        prop="laneConfigValue"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="scope">
          <span> {{ getNameByLaneConfigValue(scope.row) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="status">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            active-value="0"
            inactive-value="1"
            @change="handleStatusChange(scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column
        label="备注"
        align="center"
        prop="remark"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        width="180"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            v-hasPermi="['business:lane:edit']"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
          >修改</el-button>
          <el-button
            v-hasPermi="['business:lane:remove']"
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改参数配置对话框 -->
    <el-dialog
      :title="title"
      :visible.sync="open"
      width="500px"
      append-to-body
      :close-on-click-modal="false"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="车道号" prop="laneId">
          <el-cascader
            ref="cascader"
            v-model="form.laneId"
            :show-all-levels="false"
            :props="{emitPath:false,value:'value',label:'label',children:'children'}"
            :options="lanes"
            clearable
          />
        </el-form-item>
        <el-form-item label="配置参数" prop="laneConfigKey">
          <el-select v-model="form.laneConfigKey" placeholder="配置参数" clearable :disabled="formMethod==='update'" @change="selectChanges">
            <el-option
              v-for="option in laneConfigOptions"
              :key="option.attribute"
              :label="option.label"
              :value="option.attribute"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-if="selectAtt" label="配置值" prop="laneConfigValue">
          <el-input v-if="selectAtt&&selectAtt.type ==='string'" v-model="form.laneConfigValue" type="text" placeholder="配置值" />
          <el-input v-else-if="selectAtt&&selectAtt.type ==='number'" v-model="form.laneConfigValue" type="number" min="0" placeholder="配置值" />
          <el-select v-else-if="selectAtt&&(selectAtt.type ==='select'||selectAtt.type ==='boolean')" v-model="form.laneConfigValue" placeholder="配置参数" clearable>
            <el-option
              v-for="option in selectAtt.options"
              :key="option.key"
              :label="option.key"
              :value="option.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="form.remark"
            type="textarea"
            placeholder="请输入内容"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listLaneConfig, listLaneConfigOptions, delLaneConfig, editLaneConfigStatu, addLaneConfig, updateLaneConfig, getLaneConfig } from './api/index'
import { laneAll } from '@/views/business/area/api/index.js'
// import { getLane } from '@/views/business/lane/api/index.js'
import GetLaneName from '@/views/business/lane/component/GetLaneName'
export default {
  name: 'LaneConfig',
  dicts: ['btp_lane_type'],
  components: {
    GetLaneName
  },
  data() {
    return {
      selectAtt: undefined,
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
      // 所有配置信息
      laneConfigOptions: [],
      // 通道表格数据
      laneList: [],
      lanes: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 日期范围
      dateRange: [],
      formMethod: '',
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        laneConfigKey: undefined,
        laneId: undefined
      },
      laneId: undefined,
      // 表单参数
      form: {
        laneId: undefined,
        laneConfigKey: undefined,
        laneConfigValue: undefined
      },
      // 表单校验
      rules: {
        laneConfigKey: [
          { required: true, message: '配置参数不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getLaneList()
    const params = this.$route.query
    if (params && params.laneId) {
      this.queryParams.laneId = Number(params.laneId)
      this.form.laneId = params.laneId
    }

    this.getLaneConfigOptions()
    this.getList()
  },
  methods: {
    getNameByLaneConfigOptions(key) {
      return this.laneConfigOptions.filter(item => item.attribute === key)[0].label
    },
    getNameByLaneConfigValue(row) {
      const laneConfigOption = this.laneConfigOptions.filter(item => item.value === row.laneConfigKey)[0]
      if (laneConfigOption.type === 'select' || laneConfigOption.type === 'boolean') {
        return laneConfigOption.options !== '' && laneConfigOption.options !== undefined ? laneConfigOption.options.filter(item => item.value === row.laneConfigValue)[0].key : row.laneConfigValue
      }
      return row.laneConfigValue
    },
    // 用户状态修改
    handleStatusChange(row) {
      const label = this.getNameByLaneConfigOptions(row.laneConfigKey)
      const text = row.status === '0' ? '启用' : '停用'
      this.$modal.confirm('确认要"' + text + '""' + label + '"配置吗？').then(function() {
        return editLaneConfigStatu(row.laneConfigId, row.status)
      }).then(() => {
        this.$modal.msgSuccess(text + '成功')
      }).catch(function() {
        row.status = row.status === '0' ? '1' : '0'
      })
    },
    /**
     * 获取所有车道
     */
    getLaneList() {
      laneAll().then((rep) => {
        this.lanes = rep.data
      })
    },

    /** 查询参数列表 */
    getList() {
      this.loading = true
      listLaneConfig(this.queryParams).then(
        (response) => {
          this.laneList = response.rows
          this.total = response.total
          this.loading = false
        }
      )
    },
    getLaneConfigOptions() {
      listLaneConfigOptions().then((rep) => {
        this.laneConfigOptions = rep.data
      })
    },
    selectChanges(val) {
      this.selectAtt = this.laneConfigOptions.filter(item => item.attribute === val)[0]
      this.form.value = undefined
      console.log(this.selectAtt)
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    // 表单重置
    reset() {
      this.form = {
        laneConfigKey: undefined,
        laneConfigValue: undefined,
        laneId: this.laneId
      }
      this.selectAtt = undefined
      this.resetForm('form')
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = []
      this.resetForm('queryForm')
      this.handleQuery()
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.formMethod = 'add'
      this.open = true
      this.title = '添加通道信息'
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.laneConfigId)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      this.formMethod = 'update'
      const laneConfigId = row.laneConfigId || this.ids
      getLaneConfig(laneConfigId).then((response) => {
        this.form = response.data
        this.selectAtt = this.laneConfigOptions.filter(item => item.attribute === response.data.laneConfigKey)[0]
        this.open = true
        this.title = '修改通道信息'
      })
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.form.laneConfigId !== undefined) {
            updateLaneConfig(this.form).then((response) => {
              this.$modal.msgSuccess('修改成功')
              this.open = false
              this.getList()
            })
          } else {
            addLaneConfig(this.form).then((response) => {
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
      const laneConfigIds = row.laneConfigId || this.ids
      this.$modal
        .confirm('是否确认删除通道编号为"' + laneConfigIds + '"的数据项？')
        .then(function() {
          return delLaneConfig(laneConfigIds)
        })
        .then((rep) => {
          this.getList()
          this.$modal.msgSuccess('删除成功')
        })
        .catch(() => {})
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
  .el-dropdown-link {
  cursor: pointer;
  color: #409EFF;
  }
  .el-icon-arrow-down {
  font-size: 12px;
  }

</style>
