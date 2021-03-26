<template>
  <div class="app-container">
    <el-card>
      <!-- 首行，搜索框、搜索按钮和添加分类按钮 -->
      <el-row :gutter="20" class="firstRow">
        <el-col :span="5">
          <el-input v-model="queryInfo.query" placeholder="请输入内容" clearable @clear="getCatList">
            <el-button slot="append" icon="el-icon-search" @click="getCatList" />
          </el-input>
        </el-col>
        <el-col :span="18">
          <el-button type="primary" @click="addCat">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 非首行，分类列表表格区域 -->
      <el-table
        :data="catList"
        style="width: 100%"
      >
        <el-table-column
          type="index"
          label="#"
        />
        <el-table-column
          prop="cat_id"
          label="分类id"
          width="180"
        />
        <el-table-column
          prop="cat_name"
          label="分类名称"
          width="180"
        />
        <el-table-column
          prop="createTime"
          label="创建时间"
          width="380"
        >
          <template slot-scope="scope">
            {{ scope.row.createTime }}
          </template>
        </el-table-column>
        <el-table-column
          prop="updateTime"
          label="修改时间"
          width="380"
        >
          <template slot-scope="scope">
            {{ scope.row.updateTime }}
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="180"
        >
          <!-- 作用域插槽 -->
          <template slot-scope="scope">
            <!-- 编辑分类按钮 -->
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="editCat(scope.row.cat_id)" />
            <!-- 删除分类按钮 -->
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="delCat(scope.row.cat_id)" />
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加分类 弹框 -->
    <el-dialog title="添加分类" :visible.sync="addCatDialogVisible">
      <el-form ref="addCatRef" :model="addCatObj" :rules="addCatRules">
        <el-form-item label="分类名称" style="width: 80%" label-width="100px" prop="cat_name">
          <el-input v-model="addCatObj.cat_name" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addCatDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCatDialogSure">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑分类 弹框 -->
    <el-dialog title="修改分类信息" :visible.sync="editCatDialogVisible">
      <el-form ref="editCatRef" :model="editCatObj" :rules="editCatRules">
        <el-form-item label="分类名称" style="width: 80%" label-width="100px" prop="cat_name">
          <el-input v-model="editCatObj.cat_name" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editCatDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCatDialogSure">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 分类列表
      catList: [],
      // 获取分类列表时所需的参数
      queryInfo: {
        query: ''
      },
      // 控制添加分类弹框是否显示
      addCatDialogVisible: false,
      addCatObj: {
        cat_name: ''
      },
      // 表单的验证规则对象
      addCatRules: {
        // 验证分类名称
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      // 控制编辑分类弹框是否显示
      editCatDialogVisible: false,
      editCatObj: {
        cat_id: '',
        cat_name: ''
      },
      // 表单的验证规则对象
      editCatRules: {
        // 验证分类名称
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getCatList()
  },
  methods: {
    async getCatList() {
      const { data: res } = await this.$http.get('getcatlist', { params: this.queryInfo })
      this.catList = res.result
      console.log('this.catList: ', this.catList)
      if (res.code !== 1) return this.$message.error(res.message)
    },
    // 点击删除分类按钮 触发
    async delCat(id) {
      // 弹出 MessageBox 弹框
      const confirmData = await this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      // 点击 取消， confirmData 为 cancel
      // 点击 确定， confirmData 为 confirm
      // 分类点击了取消按钮
      if (confirmData !== 'confirm') {
        return this.$message.info('已取消删除~')
      }
      // 执行到这里，代表分类点了确定
      const { data: res } = await this.$http.delete('delcat', { data: { cat_id: id }})
      // // console.log(res)
      if (res.code !== 1) return this.$message.error(res.message)
      this.$message.success(res.message)
      this.getCatList()
    },
    // 按下添加分类按钮
    addCat() {
      this.addCatDialogVisible = true
    },
    // 点击添加分类弹框中的确定按钮
    addCatDialogSure() {
      // 表单预检验
      this.$refs.addCatRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('addcat', this.addCatObj)
        // // console.log(res)
        if (res.code !== 1) return this.$message.error('添加分类失败!!')
        this.$message.success('添加分类成功~')
        // 让添加分类弹框隐藏
        this.addCatDialogVisible = false
        // 清空表单
        this.$refs.addCatRef.resetFields()
        this.getCatList()
      })
    },
    // 按下编辑分类信息按钮
    async editCat(cat_id) {
      // 显示编辑分类信息弹框
      this.editCatDialogVisible = true
      // 根据 cat_id 查询分类信息，保存到 editCatObj，用于渲染到编辑分类信息弹框
      const { data: res } = await this.$http.get('getcatinfo', { params: { cat_id }})
      if (res.code !== 1) return
      this.editCatObj = res.result[0]
    },
    // 按下编辑分类弹框的确定按钮
    async editCatDialogSure() {
      // 表单预检验
      this.$refs.editCatRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put('editcat', this.editCatObj)
        // // console.log(res)
        if (res.code !== 1) return this.$message.error(res.message)
        this.$message.success(res.message)
        // 让修改分类弹框隐藏
        this.editCatDialogVisible = false
        // 清空表单
        // this.$refs.editCatRef.resetFields()
        // 刷新分类列表
        this.getCatList()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.firstRow {
  margin-bottom: 15px;
}
.cat-avatar {
  width: 40px;
  height: 40px;
}
</style>
