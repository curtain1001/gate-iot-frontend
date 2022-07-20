<template>
  <div class="app-container">
    <el-form
      v-show="showSearch"
      ref="queryForm"
      :model="queryParams"
      size="small"
      :inline="true"
      label-width="68px"
    >
      <el-form-item label="产品类型" prop="product">
        <el-select v-model="queryParams.product" placeholder="请设备产品类型" clearable>
          <el-option
            v-for="product in productList"
            :key="product.value"
            clearable
            :label="product.name"
            :value="product.value"
            @keyup.enter.native="handleQuery"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="指令名称" prop="commandName">
        <el-input
          v-model="queryParams.commandName"
          placeholder="请输入指令名称"
          clearable
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="指令类型" prop="type">
        <el-input
          v-model="queryParams.type"
          placeholder="请输入指令名称"
          clearable
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
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
          v-hasPermi="['business:instruction:add']"
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['business:instruction:edit']"
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
          v-hasPermi="['business:instruction:remove']"
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
        >删除</el-button>
      </el-col>
      <right-toolbar
        :show-search.sync="showSearch"
        @queryTable="getList"
      />
    </el-row>

    <el-table
      v-loading="loading"
      :data="instructionList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="主键ID" align="center" prop="instrId" />
      <el-table-column
        label="指令名称"
        align="center"
        prop="commandName"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="指令键值"
        align="center"
        prop="commandValue"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="产品类型"
        align="center"
        prop="product"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="指令类型"
        align="center"
        prop="type"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="报文内容"
        align="center"
        prop="content"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="报文格式"
        align="center"
        prop="format"
        :show-overflow-tooltip="true"
      />
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
            v-hasPermi="['business:instruction:edit']"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
          >修改</el-button>
          <el-button
            v-hasPermi="['business:instruction:remove']"
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
      width="680px"
      append-to-body
      :close-on-click-modal="false"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="设备产品类型" prop="product">
              <el-select v-model="form.product" placeholder="请设备产品类型" clearable>
                <el-option
                  v-for="product in productList"
                  :key="product.value"
                  :label="product.name"
                  :value="product.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="指令类型" prop="type">
              <el-select v-model="form.type" placeholder="请选择指令类型" clearable>
                <el-option label="上行" value="up" />
                <el-option label="下行" value="down" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="指令名称" prop="areaName">
              <el-input v-model="form.commandName" placeholder="请输入指令名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="commandValue">
              <span slot="label">
                <el-tooltip content="对报文进行唯一匹配" placement="top">
                  <i class="el-icon-question" />
                </el-tooltip>
                指令键值
              </span>
              <el-input v-model="form.commandValue" placeholder="请输入指令键值" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item prop="content">
              <span slot="label">
                <el-tooltip content="16进制字节数组请勿添加Ox" placement="top">
                  <i class="el-icon-question" />
                </el-tooltip>
                指令报文
              </span>
              <el-input v-model="form.content" type="textarea" placeholder="请输入指令报文" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="报文格式" prop="format">
              <el-select v-model="form.format" placeholder="请选择报文格式" clearable>
                <el-option label="JSON" value="JSON" />
                <el-option label="字符串" value="STRING" />
                <el-option label="字节数组" value="BINARY" />
                <el-option label="哈希" value="HEX" />
                <el-option label="未知类型" value="UNKNOWN" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input
                v-model="form.remark"
                type="textarea"
                placeholder="请输入内容"
              />
            </el-form-item>
          </el-col>
        </el-row>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import api from './api/index'
import deviceApi from '../device/api/index'

export default {
  name: 'Instruction',
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
      // 指令表格数据
      instructionList: [],
      // 产品类型
      productList: [],
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
        product: undefined,
        commandValue: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        product: [
          { required: true, message: '产品类型不能为空', trigger: 'blur' }
        ],
        commandName: [
          { required: true, message: '指令名称不能为空', trigger: 'blur' }
        ],
        commandValue: [
          { required: true, message: '指令键值不能为空', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '指令类型不能为空', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '指令报文不能为空', trigger: 'blur' }
        ],
        format: [
          { required: true, message: '指令报文格式不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getProductList()
    this.getList()
  },
  methods: {
    /** 查询参数列表 */
    getList() {
      this.loading = true
      api.listInstruction(this.queryParams).then(
        (response) => {
          this.instructionList = response.rows
          this.total = response.total
          this.loading = false
        }
      )
    },
    // 获取产品类型
    getProductList() {
      deviceApi.listDeviceProduct().then((rep) => {
        console.log(rep)
        this.productList = rep.data
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
        product: undefined,
        commandName: undefined,
        commandValue: undefined,
        type: undefined,
        content: undefined,
        format: undefined,
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
      this.title = '添加指令信息'
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.areaId)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const instrId = row.instrId || this.ids
      api.getInstruction(instrId).then((response) => {
        this.form = response.data
        this.open = true
        this.title = '修改场站信息'
      })
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.form.areaId !== undefined) {
            api.updateInstruction(this.form).then((response) => {
              this.$modal.msgSuccess('修改成功')
              this.open = false
              this.getList()
            })
          } else {
            api.addInstruction(this.form).then((response) => {
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
      const instrIds = row.instrId || this.ids
      this.$modal
        .confirm('是否确认删除指令编号为"' + instrIds + '"的数据项？')
        .then(function() {
          return api.delInstruction(instrIds)
        })
        .then(() => {
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
</style>
