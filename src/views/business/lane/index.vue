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
      <el-form-item label="车道号" prop="laneNo">
        <el-input
          v-model="queryParams.laneNo"
          placeholder="请输入车道号"
          clearable
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="车道名称" prop="laneName">
        <el-input
          v-model="queryParams.laneName"
          placeholder="请输入车道名称"
          clearable
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="场站号" prop="areaId">
        <el-select v-model="queryParams.areaId" placeholder="请选择场站" clearable>
          <el-option
            v-for="area in areaList"
            :key="area.areaId"
            :label="area.areaNo"
            :value="area.areaId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="海关通道号" prop="customsLaneNo">
        <el-input
          v-model="queryParams.customsLaneNo"
          placeholder="请输入海关通道号"
          clearable
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="进出类型" prop="type">
        <el-select v-model="queryParams.type" placeholder="请选择车道进出类型" clearable>
          <el-option
            v-for="dict in dict.type.btp_lane_type"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
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
      <el-table-column label="id" align="center" prop="laneId" />
      <el-table-column
        label="通道名称"
        align="center"
        prop="laneName"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="通道号"
        align="center"
        prop="laneNo"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="场站号"
        align="center"
        prop="areaId"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="scope">
          <el-select v-model="scope.row.areaId" clearable disabled>
            <el-option
              v-for="area in areaList"
              :key="area.areaNo"
              :label="area.areaNo"
              :value="area.areaId"
            />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column
        label="海关通道号"
        align="center"
        prop="customsLaneNo"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="进出类型"
        align="center"
        prop="type"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.type==0?"进":"出" }}</span>
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
            v-hasPermi="['business:laneconfig:list']"
            size="mini"
            type="text"
            icon="el-icon-setting"
            @click="handleConfig(scope.row)"
          >配置信息</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-setting"
            @click="handleDevice(scope.row)"
          >设备管理</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-setting"
            @click="handleFlow(scope.row)"
          >流程管理</el-button>
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
        <el-form-item label="通道号" prop="laneNo">
          <el-input v-model="form.laneNo" placeholder="请输入通道号" />
        </el-form-item>
        <el-form-item label="通道名称" prop="laneName">
          <el-input v-model="form.laneName" placeholder="请输入通道名称" />
        </el-form-item>
        <el-form-item label="海关通道号" prop="customsLaneNo">
          <el-input v-model="form.customsLaneNo" placeholder="请输入通道名称" />
        </el-form-item>
        <el-form-item label="场站号" prop="areaId">
          <el-select v-model="form.areaId" placeholder="请选择场站" clearable style="">
            <el-option
              v-for="area in areaList"
              :key="area.areaId"
              :label="area.areaNo"
              :value="area.areaId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="进出类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择车道进出类型" clearable>
            <el-option
              v-for="dict in dict.type.btp_lane_type"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
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
    <router-view />
  </div>
</template>

<script>
import { listLane, delLane, addLane, updateLane, getLane } from './api/index'
import { getAreaLists } from '@/views/business/area/api/index.js'
import router from '@/router'

export default {
  name: 'Lane',
  dicts: ['btp_lane_type'],
  data() {
    return {
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
      // 所有场站信息
      areaList: [],
      // 通道表格数据
      laneList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 日期范围
      dateRange: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        laneName: undefined,
        laneNo: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        laneName: [
          { required: true, message: '通道名称不能为空', trigger: 'blur' }
        ],
        laneNo: [
          { required: true, message: '通道号不能为空', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '进出类型不能为空', trigger: 'blur' }
        ],
        areaNo: [
          { required: true, message: '场站号不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getAreaList()
    this.getList()
  },
  methods: {
    /** 查询参数列表 */
    getList() {
      this.loading = true
      listLane(this.addDateRange(this.queryParams, this.dateRange)).then(
        (response) => {
          this.laneList = response.rows
          this.total = response.total
          this.loading = false
        }
      )
    },
    getAreaList() {
      getAreaLists().then((rep) => {
        this.areaList = rep.data
      })
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    // 表单重置
    reset() {
      this.form = {
        areaId: undefined,
        areaName: undefined,
        remark: undefined
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
      this.dateRange = []
      this.resetForm('queryForm')
      this.handleQuery()
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.open = true
      this.title = '添加通道信息'
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.laneId)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const laneId = row.laneId || this.ids
      getLane(laneId).then((response) => {
        this.form = response.data
        this.open = true
        this.title = '修改通道信息'
      })
    },
    handleConfig(row) {
      router.push(`/business/lane-config/index/${row.laneId}`)
    },
    handleDevice(row) {
      // router.replace 强制刷新跳转的页面
      router.replace({ path: '/business/device', query: { laneId: row.laneId }})
    },
    handleFlow(row) {
      // router.replace 强制刷新跳转的页面
      router.replace({ path: '/business/flow', query: { laneId: row.laneId }})
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.form.laneId !== undefined) {
            updateLane(this.form).then((response) => {
              this.$modal.msgSuccess('修改成功')
              this.open = false
              this.getList()
              localStorage.removeItem('lane::laneId::' + this.form.laneId)
            })
          } else {
            addLane(this.form).then((response) => {
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
      const laneIds = row.laneId || this.ids
      this.$modal
        .confirm('是否确认删除通道编号为"' + laneIds + '"的数据项？')
        .then(function() {
          return delLane(laneIds)
        })
        .then((rep) => {
          this.getList()
          console.log('rep' + rep)
          if (rep.msg !== '' || rep.msg !== undefined) {
            this.$modal.msgWarning(rep.msg)
          } else {
            localStorage.removeItem('lane::laneId::' + row.laneId)
            this.$modal.msgSuccess('删除成功')
          }
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
</style>
