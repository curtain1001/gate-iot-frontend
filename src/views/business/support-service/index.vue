<template>
  <div class="app-container">
    <el-form
      v-show="showSearch"
      ref="queryForm"
      :model="queryParams"
      size="small"
      :inline="true"
      label-width="100px"
    >
      <el-form-item label="车道号" prop="laneId">
        <el-cascader v-model="queryParams.laneId" :props="{emitPath:false,value:'value',label:'label',children:'children'}" :options="laneList" clearable />
      </el-form-item>
      <el-form-item label="服务名称" prop="service">
        <el-select v-model="queryParams.service" placeholder="请选择服务" clearable>
          <el-option
            v-for="service in serviceList"
            :key="service.value"
            :label="service.name"
            :value="service.value"
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
          v-hasPermi="['business:support-service:add']"
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['business:support-service:edit']"
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
          v-hasPermi="['business:support-service:remove']"
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
      :data="list"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="主键" align="center" prop="id" />
      <el-table-column
        label="车道名称"
        align="center"
        prop="laneId"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="scope">
          <GetLaneName v-model="scope.row.laneId" />
        </template>
      </el-table-column>
      <el-table-column
        label="服务名称"
        align="center"
        prop="serviceName"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="设备"
        align="center"
        prop="devices"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="scope">
          <el-tag
            v-for="item in scope.row.devices"
            :key="item.key"
            type=""
            effect="dark"
          >
            {{ item.value }}
          </el-tag>
        </template>
      </el-table-column>
      <!-- <el-table-column
        label="组件名称"
        align="center"
        prop="networkName"
        :show-overflow-tooltip="true"
      /> -->
      <!-- <el-table-column
        label="设备配置"
        align="center"
        prop="type"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.configuration }}</span>
        </template>
      </el-table-column> -->
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
        width="240"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            v-hasPermi="['business:device:edit']"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
          >修改</el-button>
          <el-button
            v-hasPermi="['business:device:remove']"
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

      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="车道号" prop="laneId">
          <el-cascader
            ref="cascader"
            v-model="form.laneId"
            :show-all-levels="false"
            :props="{emitPath:false,value:'value',label:'label',children:'children'}"
            :options="laneList"
            clearable
            @change="handlerChange"
          />
        </el-form-item>
        <el-form-item label="服务类型" prop="serviceName">
          <el-select v-model="form.serviceName" placeholder="请服务类型" clearable @change="serviceChange">
            <el-option
              v-for="service in serviceList"
              :key="service.value"
              :label="service.name"
              :value="service"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="设备" prop="devices">
          <el-select v-model="form.deviceIds" placeholder="请选择设备" multiple clearable @change="deviceChange">
            <el-option
              v-for="device in deviceList"
              :key="device.id"
              :label="device.deviceName"
              :value="device.id"
            />
          </el-select>
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
import api from './api/index'
import deviceApi from '../device/api/index'
import { laneAll } from '@/views/business/area/api/index.js'
// import { getLane } from '@/views/business/lane/api/index.js'
import GetLaneName from '@/views/business/lane/component/GetLaneName'
export default {
  name: 'SupportService',
  components: {
    GetLaneName
  },
  props: {
    laneId: {
      type: Number,
      default: () => undefined
    }
  },
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
      laneList: [],
      list: [],
      // 设备列表
      deviceList: [],
      serviceList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 日期范围
      dateRange: [],
      plcCreate: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        product: undefined,
        networkType: undefined,
        configuration: undefined
      },
      instructionObj: {},
      // 表单参数
      form: {
        configuration: undefined
      },
      // 表单校验
      rules: {
        deviceName: [
          { required: true, message: '设备名称不能为空', trigger: 'blur' }
        ],
        laneId: [
          { required: true, message: '通道号不能为空', trigger: 'blur' }
        ],
        serviceCode: [
          { required: true, message: '服务类型不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getServiceSupports()
    this.getLaneList()
    this.getList()
  },
  methods: {
    getLaneList() {
      laneAll().then((rep) => {
        this.laneList = rep.data
      })
    },
    serviceChange(val) {
      if (val && val != null) {
        console.log(val)
        this.form.serviceCode = val.value
        this.form.serviceName = val.name
      }
    },
    getDevices() {
      if (!this.form.laneId) {
        this.$modal.msgWarning('请先选择车道')
        return
      }
      deviceApi.getDevices(this.form.laneId).then(rep => {
        if (rep && rep.code === 200) {
          this.deviceList = rep.data
        }
      })
    },
    getServiceSupports() {
      api.listServiceProduct().then(rep => {
        if (rep && rep.code === 200) {
          this.serviceList = rep.data
        }
      })
    },
    /** 查询参数列表 */
    getList() {
      this.loading = true
      api.lisSupport(this.queryParams).then(
        (response) => {
          this.list = response.rows
          this.total = response.total
        }
      )
      this.loading = false
    },
    deviceChange(val) {
      if (!this.form.laneId) {
        this.$modal.msgWarning('请先选择车道')
        return
      }
      console.log('设备选择', val)
    },
    handleStatusChange(row) {
      const text = row.enabled === 0 ? '启用' : '停用'
      this.$modal.confirm('确认要"' + text + '""' + row.deviceName + '"设备吗？').then(function() {
        return api.enabled(row.id, row.enabled)
      })
        .then(() => {
          this.$modal.msgSuccess(text + '成功')
        }).catch(function(e) {
          if (e === 'cancel') {
            // TODO 确认不通过执行逻辑

          } else if (e === 'close') {
            // TODO 右上角X的执行逻辑

          }
          row.enabled = row.enabled === 0 ? 1 : 0
        })
    },

    handlerChange(val) {
      console.log('车道选择：', val)
      if (val) {
        this.getDevices()
      } else {
        this.deviceList = []
      }
    },
    configChange(val) {
      this.form.configuration = val
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        product: undefined,
        networkType: undefined,
        networkId: undefined,
        configuration: undefined,
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
      this.title = '添加设备'
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const id = row.id || this.ids
      api.getSupport(id).then((response) => {
        this.form = response.data
        this.getNetworkList(this.form.networkType)
        this.open = true
        this.title = '修改设备信息'
      })
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.form.id !== undefined) {
            this.form.laneId = Number(this.form.laneId)
            api.updateSupport(this.form).then((response) => {
              this.$modal.msgSuccess('修改成功')
              this.open = false
              this.getList()
            })
          } else {
            api.addSupport(this.form).then((response) => {
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
      const ids = row.id || this.ids
      this.$modal
        .confirm('是否确认删除设备编号为"' + ids + '"的数据项？')
        .then(function() {
          return api.delSupport(ids)
        })
        .then((rep) => {
          this.getList()
          console.log('rep' + rep)
          if (rep.msg !== '' || rep.msg !== undefined) {
            this.$modal.msgWarning(rep.msg)
          } else {
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
