<template>
  <div class="app-container">
    <div>
      <Carousel :img-src="imgSrc" :images-list="imagesList" />
    </div>
    <el-form v-show="showSearch" ref="queryForm" :model="queryParams" :inline="true" label-width="72px">
      <el-form-item label="进出类型" prop="inExitFlag">
        <el-select v-model="queryParams.inExitFlag" clearable style="width:100px" placeholder="请选择" @keyup.enter.native="handleQuery">
          <el-option key="I" label="进闸" value="I">进闸</el-option>
          <el-option key="E" label="出闸" value="E">出闸</el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="上传状态" prop="laneId">
        <el-select v-model="queryParams.inExitFlag" clearable style="width:100px" placeholder="请选择" @keyup.enter.native="handleQuery">
          <el-option key="success" label="成功" value="success">成功</el-option>
          <el-option key="fail" label="失败" value="fail">失败</el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="车牌号" prop="licensePlate">
        <el-input
          v-model="queryParams.licensePlate"
          placeholder="请输入"
          clearable
          style="width:150px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="车架号" prop="framePlate">
        <el-input
          v-model="queryParams.framePlate"
          placeholder="请输入车架号"
          clearable
          style="width:150px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="前箱号" prop="framePlate">
        <el-input
          v-model="queryParams.framePlate"
          placeholder="请输入前箱号"
          clearable
          style="width:150px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="后箱号" prop="framePlate">
        <el-input
          v-model="queryParams.framePlate"
          placeholder="请输入后箱号"
          clearable
          style="width:150px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="采集时间" prop="startTime">
        <el-date-picker
          v-model="queryParams.endTime"
          style="width:300px"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
      </el-form-item>
      <el-form-item label="结束时间" prop="endTime">
        <el-input
          v-model="queryParams.endTime"
          placeholder="请输入结束时间"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <right-toolbar :show-search.sync="showSearch" :columns="tableHead" @queryTable="getList" />
    <!-- 正文表格 -->
    <el-table
      style="width: 100%"
      border
      :data="tableData"
      max-height="340"
      :row-style="{height: '0'}"
      :cell-style="{padding: '0'}"
    >
      <el-table-column type="index" />
      <template v-for="(item,index) in tableHead">
        <el-table-column v-if="item.columnValue != 'id'" :key="index" align="center" :prop="item.columnValue" :label="item.columnName" />
        <el-table-column v-if="item.columnValue === 'laneNo'" :key="index" align="center" :prop="item.columnValue" :label="item.columnName">
          <template slot-scope="scope">
            <GetLaneName v-model="scope.row.laneNo" />
          </template>
        </el-table-column>
      </template>
      <el-table-column label="操作" fixed="right" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            v-hasPermi="['system:instance:edit']"
            size="mini"
            type="text"
            icon="el-icon-details"
            @click="handleDetails(scope.row)"
          >详情</el-button>
          <el-button
            v-hasPermi="['system:instance:edit']"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
          >修改</el-button>
          <el-button
            v-hasPermi="['system:instance:remove']"
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

    <!-- <el-table v-loading="loading" :data="instanceList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="主键" align="center" prop="instanceId" />
      <el-table-column label="流程图部署信息主键" align="center" prop="deployId" />
      <el-table-column label="车道名称" align="center" prop="laneId">
        <template slot-scope="scope">
          <GetLaneName v-model="scope.row.laneId" />
        </template>
      </el-table-column>
      <el-table-column label="实例状态" align="center" prop="status">
        <template slot-scope="scope">
          {{ statusList.find(x=>x.key===scope.row.status).value }}
        </template>
      </el-table-column>
      <el-table-column label="开始时间" align="center" prop="startTime" />
      <el-table-column label="结束时间" align="center" prop="endTime" />
    </el-table> -->

    <!-- 添加或修改流程运行实例对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="流程图部署信息主键" prop="deployId">
          <el-input v-model="form.deployId" placeholder="请输入流程图部署信息主键" />
        </el-form-item>
        <el-form-item label="车道id" prop="laneId">
          <el-input v-model="form.laneId" placeholder="请输入车道id" />
        </el-form-item>
        <el-form-item label="开始时间" prop="startTime">
          <el-input v-model="form.startTime" placeholder="请输入开始时间" />
        </el-form-item>
        <el-form-item label="结束时间" prop="endTime">
          <el-input v-model="form.endTime" placeholder="请输入结束时间" />
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
import GetLaneName from '@/views/business/lane/component/GetLaneName'
import Carousel from '@/components/Carousel/index'
const instanceStatus = [
  { key: 'IN_PROGRESS', value: '进行中' },
  { key: 'FINISHED', value: '已完成' },
  { key: 'TERMINATED', value: '已终止' }
]
export default {
  name: 'Instance',
  components: {
    GetLaneName,
    Carousel
  },
  data() {
    return {
      imgSrc: require('../../../assets/images/profile.jpg'), // 默认显示大图
      imagesList: [
        // 缩略图：
        { url: require('../../../assets/images/profile.jpg') },
        { url: require('../../../assets/images/profile.jpg') },
        { url: require('../../../assets/images/profile.jpg') },
        { url: require('../../../assets/images/profile.jpg') },
        { url: require('../../../assets/images/profile.jpg') }
      ],
      // 遮罩层
      loading: true,
      statusList: instanceStatus,
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
      // 流程运行实例表格数据
      instanceList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        deployId: null,

        laneId: null,

        status: null,

        startTime: null,

        endTime: null

      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      },
      tableHead: [
        {
          columnValue: 'column_name', columnName: '姓名'
        },
        {
          columnValue: 'column_age', columnName: '年龄'
        },
        {
          columnValue: 'column_sex', columnName: '性别'
        }
      ],
      // 表格数据
      tableData: [{
        column_age: '3',
        column_name: '鞠婧祎',
        column_sex: '女'
      },
      {
        column_age: '25',
        column_name: '魏大勋',
        column_sex: '男'
      },
      {
        column_age: '25',
        column_name: '魏大勋',
        column_sex: '男'
      },
      {
        column_age: '25',
        column_name: '魏大勋',
        column_sex: '男'
      },
      {
        column_age: '25',
        column_name: '魏大勋',
        column_sex: '男'
      },
      {
        column_age: '25',
        column_name: '魏大勋',
        column_sex: '男'
      },
      {
        column_age: '25',
        column_name: '魏大勋',
        column_sex: '男'
      },
      {
        column_age: '25',
        column_name: '魏大勋',
        column_sex: '男'
      },
      {
        column_age: '25',
        column_name: '魏大勋',
        column_sex: '男'
      },
      {
        column_age: '18',
        column_name: '关晓彤',
        column_sex: '女'
      }]
    }
  },
  created() {
    // this.getList()
  },
  methods: {
    /** 查询流程运行实例列表 */
    getList() {
      this.loading = true
      api.listInstance(this.queryParams).then(response => {
        this.instanceList = response.rows
        this.total = response.total
        this.loading = false
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
        instanceId: null,

        deployId: null,

        laneId: null,

        status: '0',

        startTime: null,

        endTime: null

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
      this.ids = selection.map(item => item.instanceId)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.open = true
      this.title = '添加流程运行实例'
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const instanceId = row.instanceId || this.ids
      api.getInstance(instanceId).then(response => {
        this.form = response.data
        this.open = true
        this.title = '修改流程运行实例'
      })
    },
    /** 详情信息 */
    handleDetails(row) {
      this.$router.replace({ path: `/business/flow-process-record/index/${row.instanceId}` })
      // router.replace()
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.instanceId != null) {
            api.updateInstance(this.form).then(response => {
              this.$modal.msgSuccess('修改成功')
              this.open = false
              this.getList()
            })
          } else {
            api.addInstance(this.form).then(response => {
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
      const instanceIds = row.instanceId || this.ids
      this.$confirm('是否确认删除流程运行实例编号为"' + instanceIds + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return api.delInstance(instanceIds)
      }).then(() => {
        this.getList()
        this.$modal.msgSuccess('删除成功')
      })
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams
      this.$confirm('是否确认导出所有流程运行实例数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return api.exportInstance(queryParams)
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
  .el-form-item {
    margin-bottom: 0px;
}
</style>
