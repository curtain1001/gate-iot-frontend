<template>
  <div class="app-container">
    <el-form v-show="showSearch" ref="queryForm" :model="queryParams" :inline="true" label-width="68px">
      <el-form-item label="组件id" prop="networkId">
        <el-input
          v-model="queryParams.networkId"
          placeholder="组件id"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="组件名" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入组件名"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="type" prop="组件类型">
        <el-select v-model="queryParams.type" placeholder="请网络组件类型" clearable>
          <el-option
            v-for="network in supportsList"
            :key="network.id"
            :label="network.name"
            :value="network.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['business:network:add']"
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['business:network:edit']"
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
          v-hasPermi="['business:network:remove']"
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
          v-hasPermi="['business:network:export']"
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
        >导出</el-button>
      </el-col>
      <right-toolbar :show-search.sync="showSearch" @queryTable="getList" />
    </el-row>

    <el-table v-loading="loading" :data="networkList" @selection-change="handleSelectionChange">
      <el-table-column
        label="车道名称"
        align="center"
        prop="areaNo"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="scope">
          <GetLaneName v-model="scope.row.laneId" />
        </template>
      </el-table-column>
      <el-table-column label="组件id" align="center" prop="networkId" />
      <el-table-column label="组件名称" align="center" prop="name" />
      <el-table-column label="类型" align="center" prop="type">
        <template slot-scope="scope">
          {{ scope.row.type? supportsList.find(x=>x.id ===scope.row.type).name :"" }}
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="status">
        <template slot-scope="scope">
          {{ scope.row.status==='enabled'? '已启动':(scope.row.status==='paused'?'已暂停':scope.row.status==='reboot'?'重启中': '已停止') }}
        </template>
      </el-table-column>

      <el-table-column label="配置" align="center" prop="configuration" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          {{ scope.row.configuration? JSON.stringify(scope.row.configuration):'' }}
        </template>
      </el-table-column>
      <el-table-column
        key="enabled"
        label="开关"
        align="center"
        width="100"
        prop="status"
      >
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.enabled"
            :disabled="scope.row.control==='own'"
            :active-value="1"
            active-text="关"
            :inactive-value="0"
            inactive-text="开"
            active-color="#ff4949"
            inactive-color="#13ce66"
            @change="(val)=>handleStatusChange(val,scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            v-hasPermi="['business:network:edit']"
            :disabled="scope.row.control==='own'"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
          >修改</el-button>
          <el-button
            v-hasPermi="['business:network:remove']"
            :disabled="scope.row.control==='own'"
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

    <!-- 添加或修改网络组件配置信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body :close-on-click-modal="false">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
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
        <el-form-item label="组件号" prop="networkId">
          <el-input v-model="form.networkId" placeholder="请输入组件号" />
        </el-form-item>
        <el-form-item label="组件名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入组件名称" />
        </el-form-item>
        <el-form-item label="组件类型" prop="type">
          <el-select v-model="form.type" placeholder="请网络组件类型" clearable @change="typeChange">
            <el-option
              v-for="network in supportsList"
              :key="network.id"
              :label="network.name"
              :value="network.id"
            />
          </el-select>
        </el-form-item>
        <el-divider v-if="form.type" content-position="left">配置属性</el-divider>
        <CustomizedSetting v-if="form.type" :value="form.configuration" :customize-datas="supportsList.find(x=> x.id===form.type).basicForm" @input="configurationInput" />
        <el-divider v-if="form.type" />
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
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
import api from './api/index'
import { laneAll } from '@/views/business/area/api/index.js'
import CustomizedSetting from '@/components/CustomizedSetting'
import GetLaneName from '@/views/business/lane/component/GetLaneName'
export default {
  name: 'Network',
  components: {
    CustomizedSetting,
    GetLaneName
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
      // 网络组件配置信息表格数据
      networkList: [],
      supportsList: [],
      laneList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        networkId: null,
        name: null,
        enabled: null,
        type: null,
        status: null,
        configuration: null

      },
      // 表单参数
      form: {
        networkId: null,
        name: null,
        enabled: null,
        type: null,
        status: null,
        configuration: null,
        remark: null
      },
      // 表单校验
      rules: {
      }
    }
  },
  watch: {
    'form.type'(val) {
      if (this.form.type) {
        var config = {}
        const customizeDatas = this.supportsList.find(p => p.id === val).basicForm
        if (customizeDatas != null) {
          customizeDatas.map(f => {
            config[f.value] = f.default
          })
        }
        this.form.configuration = { ...config, ...this.form.configuration }
      }
      console.log('form:', this.form)
    }
  },
  created() {
    this.getLaneList()
    this.getSupports()
    this.getList()
  },
  methods: {
    getLaneList() {
      laneAll().then((rep) => {
        this.laneList = rep.data
      })
    },

    getSupports() {
      api.getSupports().then(resp => {
        if (resp.code === 200) {
          this.supportsList = resp.data
        }
      })
    },
    typeChange(val) {
      if (val != null) {
        console.log(val)
      }
    },
    /** 查询网络组件配置信息列表 */
    getList() {
      this.loading = true
      api.listNetwork(this.queryParams).then(response => {
        if (response.code === 200) {
          this.networkList = response.rows
          this.total = response.total
          this.loading = false
        } else {
          this.loading = false
          this.msgError(response.msg)
        }
      })
    },

    configurationInput(val) {
      console.log(val)
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    handlerChange() {

    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        networkId: null,
        name: null,
        enabled: null,
        type: null,
        status: null,
        configuration: null,
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
    handleStatusChange(val, row) {
      const text = val === 0 ? '启用' : '停用'
      this.$modal.confirm('确认要"' + text + '" "' + row.name + '"网络组件吗？').then(function() {
        return api.action(row.id, val === 0 ? 'start' : 'shutdown')
      })
        .then(() => {
          this.$modal.msgSuccess(text + '成功')
          this.getList()
        }).catch(function(e) {
          if (e === 'cancel') {
            // TODO 确认不通过执行逻辑
          } else if (e === 'close') {
            // TODO 右上角X的执行逻辑
          }
          row.enabled = val === 0 ? 1 : 0
          this.getList()
        })
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.open = true
      this.title = '添加网络组件配置信息'
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const id = row.id || this.ids
      api.getNetwork(id).then(response => {
        this.form = response.data
        this.open = true
        this.title = '修改网络组件配置信息'
      })
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            api.updateNetwork(this.form).then(response => {
              this.$modal.msgSuccess('修改成功')
              this.open = false
              this.getList()
            })
          } else {
            api.addNetwork(this.form).then(response => {
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
      this.$confirm('是否确认删除网络组件配置信息编号为"' + ids + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return api.delNetwork(ids)
      }).then(() => {
        this.getList()
        this.$modal.msgSuccess('删除成功')
      })
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams
      this.$confirm('是否确认导出所有网络组件配置信息数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return api.exportNetwork(queryParams)
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

  .el-dropdown-link {
  cursor: pointer;
  color: #409EFF;
  }
  .el-icon-arrow-down {
  font-size: 12px;
  }
</style>
