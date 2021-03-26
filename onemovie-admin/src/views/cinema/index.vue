<template>
  <div class="app-container">
    <el-card>
      <!-- 首行，搜索框、搜索按钮和添加影院按钮 -->
      <el-row :gutter="20" class="firstRow">
        <el-col :span="17" class="col-area">
          <area-cascader v-model="selectedAreaList" :level="1" :data="pcaa" type="all" size="large" @change="handleAreaChange" />
          <el-button type="primary" icon="el-icon-refresh" size="small" @click="handleClear">重置</el-button>
        </el-col>
        <el-col :span="5">
          <el-input v-model="queryInfo.query" placeholder="请输入影院名称" clearable @clear="handleSearchClearOrClick">
            <el-button slot="append" icon="el-icon-search" @click="handleSearchClearOrClick" />
          </el-input>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" @click="addCinema">添加影院</el-button>
        </el-col>
      </el-row>
      <!-- 非首行，影院列表表格区域 -->
      <el-table
        class="cinemaTable"
        :data="cinemaList"
        border
        style="width: 100%"
      >
        <el-table-column
          type="index"
          label="#"
        />
        <el-table-column
          prop="cinema_id"
          label="影院id"
          width="65"
        />
        <el-table-column
          prop="cinema_name"
          label="影院名称"
          width="300"
        />
        <el-table-column
          prop="cinema_hallNums"
          label="影院影厅"
          width="100"
        />
        <el-table-column
          prop="cinema_address"
          label="影院地址"
        />
        <el-table-column
          prop="cinema_phone"
          label="影院联系电话"
          width="130"
        />
        <el-table-column
          prop="createTime"
          label="创建时间"
          width="160"
        >
          <template slot-scope="scope">
            {{ scope.row.createTime }}
          </template>
        </el-table-column>
        <el-table-column
          prop="updateTime"
          label="修改时间"
          width="160"
        >
          <template slot-scope="scope">
            {{ scope.row.updateTime }}
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="120"
        >
          <!-- 作用域插槽 -->
          <template slot-scope="scope">
            <!-- 编辑影院按钮 -->
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="editCinema(scope.row.cinema_id)" />
            <!-- 删除影院按钮 -->
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="delCinema(scope.row.cinema_id)" />
          </template>
        </el-table-column>
      </el-table>
      <!-- 完整分页布局 -->
      <el-pagination
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-card>
    <!-- 添加影院 弹框 -->
    <el-dialog :title="isAddCinemaFlag ? '添加影院' : '修改影院信息'" :visible.sync="addCinemaDialogVisible">
      <el-form ref="addCinemaRef" :model="addCinemaObj" :rules="addCinemaRules" style="width: 60%;" class="form-addCinema">
        <el-form-item label="影院名称" label-width="100px" prop="cinema_name">
          <el-input v-model="addCinemaObj.cinema_name" />
        </el-form-item>
        <el-form-item label="影院影厅" label-width="100px" prop="cinema_hallNums">
          <el-tag
            v-for="tag in dynamicHallTags"
            :key="tag"
            closable
            :disable-transitions="false"
            @close="handleHallTagClose(tag)"
          >
            {{ tag }}
          </el-tag>
          <el-input
            v-if="hallInputVisible"
            ref="saveHallTagInput"
            v-model="hallInputValue"
            class="input-new-tag"
            size="small"
            @keyup.enter.native="handleHallInputConfirm"
            @blur="handleHallInputConfirm"
          />
          <el-button v-else class="button-new-tag" size="small" @click="showHallInput">添加影厅</el-button>
        </el-form-item>
        <el-form-item label="影院区域" label-width="100px" prop="">
          <area-cascader v-model="selectedAddCinAreaList" :level="1" :data="pcaa" type="all" size="large" @change="handleAddCinAreaChange" />
        </el-form-item>
        <el-form-item label="影院地址" label-width="100px" prop="cinema_address">
          <el-input v-model="addCinemaObj.cinema_address" type="textarea" />
        </el-form-item>
        <el-form-item label="联系电话" label-width="100px" prop="cinema_phone">
          <el-input v-model="addCinemaObj.cinema_phone" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addCinemaDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCinemaDialogSure">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { pcaa } from 'area-data'
export default {
  data() {
    return {
      // 影院列表
      cinemaList: [],
      // 获取影院列表时所需的参数
      queryInfo: {
        query: '',
        // 当前页
        pagenum: 1,
        // 一页展示数据条数
        pagesize: 5,
        country_id: ''
      },
      // 总数据条数
      total: null,
      pcaa,
      selectedAreaList: [],
      // 控制添加影院弹框是否显示
      addCinemaDialogVisible: false,
      selectedAddCinAreaList: [],
      dynamicHallTags: [],
      hallInputVisible: false,
      hallInputValue: '',
      addCinemaObj: {
        cinema_name: '',
        cinema_hallNums: '',
        cinema_address: '',
        cinema_phone: '',
        country_id: ''
      },
      // 表单的验证规则对象
      addCinemaRules: {
        // 验证影院名称
        cinema_name: [
          { required: true, message: '请输入影院名称', trigger: 'blur' }
        ],
        // 验证影院地址
        cinema_address: [
          { required: true, message: '请输入影院地址', trigger: 'blur' }
        ],
        // 验证联系电话
        cinema_phone: [
          { required: true, message: '请输入联系电话', trigger: 'blur' }
        ]
      },
      isAddCinemaFlag: true,
      // 控制编辑影院弹框是否显示
      editCinemaDialogVisible: false
    }
  },
  created() {
    this.getCinemaList()
  },
  methods: {
    // 获取影院列表
    async getCinemaList() {
      const { data: res } = await this.$http.get('getcinlist', {
        params: this.queryInfo
      })
      const { result } = res
      // console.log('result: ', result);
      if (res.code !== 1) return this.$message.error(res.message)
      this.cinemaList = result[0]
      console.log('this.cinemaList: ', this.cinemaList)
      this.total = result[1][0].total
    },
    // 获取影院信息
    async getCinemaInfo(cinema_id) {
      const { data: res } = await this.$http.get('getcininfo', { params: { cinema_id }})
      if (res.code !== 1) return this.$message({ message: res.message, type: 'error' })
      console.log('res: ', res)
      this.addCinemaObj = res.result[0]
      this.dynamicHallTags = res.result[0].cinema_hallNums.split(',')
    },
    // 当前页要展示的数据条数发生改变 触发
    handleSizeChange(val) {
      this.queryInfo.pagesize = val
      this.getCinemaList()
    },
    // 当前页码改变 触发
    handleCurrentChange(val) {
      this.queryInfo.pagenum = val
      this.getCinemaList()
    },
    // 选中一个区域 触发
    handleAreaChange() {
      for (const key in this.selectedAreaList[2]) {
        if (Object.hasOwnProperty.call(this.selectedAreaList[2], key)) {
          this.queryInfo.country_id = key
          this.getCinemaList()
        }
      }
      // this.queryInfo.country_id = this.selectedAreaList
    },
    // 重置区域 触发
    handleClear() {
      this.queryInfo.country_id = ''
      this.getCinemaList()
    },
    // 点击清除搜索框或者搜索按钮 触发
    handleSearchClearOrClick() {
      // 重置一下 pagenum 和 pagesize
      this.queryInfo.pagenum = 1
      this.queryInfo.pagesize = 5

      this.getCinemaList()
    },
    // 点击删除影院按钮 触发
    async delCinema(id) {
      // 弹出 MessageBox 弹框
      const confirmData = await this.$confirm('此操作将永久删除该影院, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      // 点击 取消， confirmData 为 cancel
      // 点击 确定， confirmData 为 confirm
      // 影院点击了取消按钮
      if (confirmData !== 'confirm') {
        return this.$message.info('已取消删除~')
      }
      // 执行到这里，代表点了确定
      const { data: res } = await this.$http.delete('delcin', { data: { cinema_id: id }})
      // // console.log(res)
      if (res.code !== 1) return this.$message.error(res.message)
      this.$message.success(res.message)
      this.getCinemaList()
    },
    // 按下添加影院按钮
    addCinema() {
      this.addCinemaDialogVisible = true
    },
    // 选择一个区域 触发
    handleAddCinAreaChange() {
      for (const key in this.selectedAddCinAreaList[2]) {
        if (Object.hasOwnProperty.call(this.selectedAddCinAreaList[2], key)) {
          this.addCinemaObj.country_id = key
        }
      }
    },
    // 删除任一影厅标签 触发
    handleHallTagClose(tag) {
      this.dynamicHallTags.splice(this.dynamicHallTags.indexOf(tag), 1)
    },
    // 显示影厅输入框
    showHallInput() {
      this.hallInputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveHallTagInput.$refs.input.focus()
      })
    },
    // 确定输入的影厅 触发
    handleHallInputConfirm() {
      const hallInputValue = this.hallInputValue
      if (hallInputValue) {
        this.dynamicHallTags.push(hallInputValue)
      }
      this.hallInputVisible = false
      this.hallInputValue = ''
    },
    // 点击添加影院弹框中的确定按钮
    addCinemaDialogSure() {
      // 表单预检验
      this.$refs.addCinemaRef.validate(async valid => {
        if (!valid) return
        this.addCinemaObj.cinema_hallNums = this.dynamicHallTags.join(',')
        console.log('this.addCinemaObj: ', this.addCinemaObj)
        // 当前是添加影院
        if (this.isAddCinemaFlag) {
          const { data: res } = await this.$http.post('addcin', this.addCinemaObj)
          if (res.code !== 1) return this.$message.error('添加影院失败!!')
          this.$message.success('添加影院成功~')
        } else { // 当前是修改影院信息
          const { data: res } = await this.$http.put('editcin', this.addCinemaObj)
          if (res.code !== 1) return this.$message.error(res.message)
          this.$message.success(res.message)
        }
        // 让添加影院弹框隐藏
        this.addCinemaDialogVisible = false
        // 清空表单
        this.$refs.addCinemaRef.resetFields()
        this.getCinemaList()
      })
    },
    // 按下编辑影院信息按钮
    async editCinema(id) {
      // emaObj.cinema_nickname
      this.isAddCinemaFlag = false
      // 显示编辑影院信息弹框
      this.addCinemaDialogVisible = true
      // 根据 id 查询影院信息，保存到 editCinemaObj，用于渲染到编辑影院信息弹框
      this.getCinemaInfo(id)
    }
  }
}
</script>

<style lang="scss" scoped>
.firstRow {
  margin-bottom: 15px;
  .col-area {
    display: flex;
    .el-button {
      margin-left: 20px;
    }
  }
}
</style>
<style lang="scss">
.form-addCinema {
  .area-select {
    height: 36px;
  }
  .area-select .area-selected-trigger {
    line-height: 18px;
  }
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
}
</style>
