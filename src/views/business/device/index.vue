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
      <el-form-item label="设备名称" prop="deviceName">
        <el-input
          v-model="queryParams.deviceName"
          placeholder="请输入设备名称"
          clearable
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="设备产品类型" prop="product">
        <el-select v-model="queryParams.product" placeholder="请选择设备产品类型" clearable>
          <el-option
            v-for="product in productList"
            :key="product.value"
            :label="product.name"
            :value="product.value"
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
          v-hasPermi="['business:device:add']"
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['business:device:edit']"
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
          v-hasPermi="['business:device:remove']"
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
      :data="deviceList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="id" align="center" prop="id" />
      <el-table-column
        label="设备号"
        align="center"
        prop="deviceId"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="设备名称"
        align="center"
        prop="deviceName"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="通道号"
        align="center"
        prop="areaNo"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="scope">
          <GetLaneName v-model="scope.row.laneId" />
        </template>
      </el-table-column>
      <el-table-column
        label="设备产品类型"
        align="center"
        prop="customsLaneNo"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.product }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="设备配置"
        align="center"
        prop="type"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.configuration }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.status }}</span>
        </template>
      </el-table-column>
      <el-table-column
        key="enabled"
        label="开关"
        align="center"
        width="100"
        prop="enabled"
      >
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.enabled"
            :active-value="1"
            active-text="关"
            :inactive-value="0"
            inactive-text="开"
            active-color="#ff4949"
            inactive-color="#13ce66"
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
          <el-dropdown
            v-hasPermi="['business:device:instruction']"
            @command="handleCommand"
          >
            <span class="el-dropdown-link">
              指令列表<i class="el-icon-arrow-down el-icon--right" />
            </span>
            <el-dropdown-menu>
              <el-dropdown-item v-for="item in scope.row.instructions" :key="item.value" divided :disabled="item.insType !== 'down'" :command="{row:scope.row,command:item.value}"> {{ item.name }}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>

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
        <el-form-item label="设备号" prop="deviceId">
          <el-input v-model="form.deviceId" placeholder="请输入设备号" />
        </el-form-item>
        <el-form-item label="设备名称" prop="deviceName">
          <el-input v-model="form.deviceName" placeholder="请输入设备名称" />
        </el-form-item>
        <el-form-item label="设备产品类型" prop="product">
          <el-select v-model="form.product" placeholder="请设备产品类型" clearable @change="productChange">
            <el-option
              v-for="product in productList"
              :key="product.value"
              :label="product.name"
              :value="product.value"
            />
          </el-select>
        </el-form-item>
        <el-divider v-if="form.product" content-position="left">配置属性</el-divider>
        <PlcCreateInfo v-if="form.product==='PLC'" ref="config" v-model="form.configuration" @change="configChange" @input="configChange" />
        <LicensePlateCreateInfo v-else-if="form.product==='OCR_License_Plate'" ref="config" v-model="form.configuration" @change="configChange" @input="configChange" />
        <el-divider v-if="form.product" />
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
import api from './api/index'
import instrApi from '../instruction/api/index'
import { laneAll } from '@/views/business/area/api/index.js'
import { getLane } from '@/views/business/lane/api/index.js'
import PlcCreateInfo from './component/PlcCreateInfo'
import LicensePlateCreateInfo from './component/LicensePlateCreateInfo'
import GetLaneName from '@/views/business/lane/component/GetLaneName'

export default {
  name: 'Device',
  components: {
    PlcCreateInfo,
    LicensePlateCreateInfo,
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
      // 所有场站信息
      // 通道表格数据
      laneList: [],
      // 设备产品列表
      productList: [],
      // 设备列表
      deviceList: [],
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
        deviceName: undefined,
        laneId: undefined,
        product: undefined,
        configuration: undefined
      },
      instructionObj: {},
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        deviceName: [
          { required: true, message: '设备名称不能为空', trigger: 'blur' }
        ],
        laneId: [
          { required: true, message: '通道号不能为空', trigger: 'blur' }
        ],
        product: [
          { required: true, message: '产品类型不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  // activated() {
  //   const params = this.$route.query
  //   if (params && params.laneId) {
  //     this.queryParams.laneId = params.laneId
  //   }
  //   console.log(params)
  //   this.getLaneList()
  //   this.getProductList()
  //   this.getList()
  // },
  created() {
    const params = this.$route.query
    if (params && params.laneId) {
      this.queryParams.laneId = params.laneId
    }
    this.getLaneList()
    this.getProductList()
    this.getList()
  },
  methods: {
    /** 查询参数列表 */
    getList() {
      this.loading = true
      api.listDevice(this.queryParams).then(
        (response) => {
          this.deviceList = response.rows
          this.total = response.total
          this.loading = false
        }
      )
    },
    getLaneList() {
      laneAll().then((rep) => {
        this.laneList = rep.data
      })
    },

    getProductList() {
      api.listDeviceProduct().then((rep) => {
        this.productList = rep.data
      })
    },

    getLaneName(laneId) {
      if (laneId) {
        getLane(laneId).then(rep => {
          return rep.data.laneName
        })
      }
    },

    handleCommand(val) {
      instrApi.run(val.row.id, val.row.product, val.command).then((rep) => {
        console.log(rep)
        this.$modal.msgSuccess('执行完成')
      })
    },
    // getProductName(product) {
    //   const products = this.productList
    //   return products.filter(x => x.value === product)[0].name
    // },
    productChange(val) {
      if (!val) {
        this.form.configuration = undefined
      }
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

    handlerChange() {

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
        deviceId: undefined,
        deviceName: undefined,
        laneId: undefined,
        product: undefined,
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
      api.getDevice(id).then((response) => {
        this.form = response.data
        this.form.laneId = String(this.form.laneId)
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
            api.updateDevice(this.form).then((response) => {
              this.$modal.msgSuccess('修改成功')
              this.open = false
              this.getList()
            })
          } else {
            api.addDevice(this.form).then((response) => {
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
          return api.delDevice(ids)
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
