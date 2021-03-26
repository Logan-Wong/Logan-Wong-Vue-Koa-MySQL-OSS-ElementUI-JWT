<template>
  <div class="app-container">
    <el-card>
      <!-- 首行，搜索框、搜索按钮和添加电影按钮 -->
      <el-row :gutter="20" class="firstRow">
        <el-col :span="5">
          <el-input v-model="queryInfo.query" placeholder="请输入电影名称" clearable @clear="handleSearchClearOrClick">
            <el-button slot="append" icon="el-icon-search" @click="handleSearchClearOrClick" />
          </el-input>
        </el-col>
        <el-col :span="16">
          <el-button type="primary" @click="addMovie">添加电影</el-button>
        </el-col>
        <el-col :span="3">
          <el-select v-model="selectedCatId" placeholder="点击选择分类" clearable @change="selectedCat($event)">
            <el-option
              v-for="item in catList"
              :key="item.cat_id"
              :label="item.cat_name"
              :value="item.cat_id"
            />
          </el-select>
        </el-col>
      </el-row>
      <!-- 非首行，电影列表表格区域 -->
      <el-table
        :data="movieList"
        border
        style="width: 100%"
        :default-sort="{order: 'descending'}"
      >
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="电影编剧">
                <span>{{ props.row.movie_screenwriter }}</span>
              </el-form-item>
              <el-form-item label="电影主演">
                <!-- <span>
                  <el-tag></el-tag>
                </span> -->
                <el-tag
                  v-for="(item, index) in props.row.actorAndRoleList"
                  :key="index"
                  :type="index % 2 == 0 ? '' : 'warning'"
                  :style="index % 2 == 0 ? '' : 'margin-right: 10px;margin-left: 0px;'"
                >{{ item }}
                </el-tag>
                <!-- <span>{{ props.row.movie_actor }}</span> -->
              </el-form-item>
              <el-form-item label="电影别名">
                <span>{{ props.row.movie_alias }}</span>
              </el-form-item>
              <el-form-item label="IDMb链接">
                <span>{{ props.row.movie_IMDb }}</span>
              </el-form-item>
              <el-form-item label="剧情简介">
                <span>{{ props.row.movie_synopsis }}</span>
              </el-form-item>
              <el-form-item label="创建时间">
                <span>{{ props.row.createTime }}</span>
              </el-form-item>
              <el-form-item label="修改时间">
                <span>{{ props.row.updateTime }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column
          prop="movie_cover"
          label="电影封面"
          width="100"
        >
          <template slot-scope="scope">
            <div class="movieCover-box">
              <img :src="scope.row.movie_smallCovUrl" class="avatar">
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="movie_name"
          label="电影名称"
        />
        <el-table-column
          prop="movie_year"
          label="年份"
          sortable
          width="73"
        />
        <el-table-column
          prop="movie_director"
          label="导演"
          width="120"
        />
        <el-table-column
          prop="movie_type"
          label="类型"
          width="120"
        />
        <el-table-column
          prop="movie_country"
          label="制片国家"
          width="160"
        />
        <el-table-column
          prop="movie_language"
          label="语言"
          width="180"
        />
        <el-table-column
          prop="movie_releaseDate"
          label="上映日期"
          width="160"
        />
        <el-table-column
          prop="movie_duration"
          label="片长"
          sortable
          width="75"
        />
        <el-table-column
          prop="movie_score"
          label="热度"
          sortable
          width="75"
        />
        <el-table-column
          prop="movie_isSelling"
          label="是否正在热映"
          sortable
          width="130"
        />
        <el-table-column
          prop="movie_comment"
          label="电影评论"
          width="100"
        >
          <!-- 作用域插槽 -->
          <template slot-scope="scope">
            <!-- 查看评论按钮 -->
            <el-button type="primary" icon="el-icon-check" size="mini" @click="openCom(scope.row.movie_id, scope.row.movie_name)">打开</el-button>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="70"
        >
          <!-- 作用域插槽 -->
          <template slot-scope="scope">
            <!-- 编辑电影按钮 -->
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="editMovie(scope.row)" />
            <!-- 删除电影按钮 -->
            <el-button class="delBtn" style="margin: 10px 0 0 0;" type="danger" icon="el-icon-delete" size="mini" @click="delMovie(scope.row.movie_id)" />
          </template>
        </el-table-column>
      </el-table>
      <!-- 完整分页布局 -->
      <el-pagination
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 15, 30, 60]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-card>
    <!-- 添加/编辑电影 弹框 -->
    <el-dialog :title="addOrEdit ? '添加电影' : '编辑电影'" :visible.sync="addMovieDialogVisible">
      <el-form ref="addMovieRef" :model="addMovieObj" :rules="addMovieRules">
        <div class="cover-box">
          <!-- <div class="block"><el-avatar shape="square" :size="90" :src="editCoverObj.movieImg_url"></el-avatar></div> -->
          <img :src="editCoverObj.movieImg_url" alt="">
          <el-upload
            ref="coverUpload"
            class="upload"
            action="none"
            accept=".jpg,.jpeg,.png,.gif,.JPG,.JPEG,.GIF"
            :multiple="false"
            :limit="1"
            :show-file-list="false"
            :before-upload="coverIsLessThan8M"
            :http-request="selectedCover"
            :on-success="uploadSuccess"
          >
            <!-- <el-link type="primary">编辑</el-link> -->
            <el-button size="mini" type="primary">点击上传</el-button>
            <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
          </el-upload>
        </div>
        <el-form-item label="电影名称" style="width: 60%" label-width="100px" prop="movie_name">
          <el-input v-model="addMovieObj.movie_name" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="电影年份" label-width="100px" prop="movie_year">
          <el-date-picker
            v-model="addMovieObj.movie_year"
            type="year"
            placeholder="选择年份"
            value-format="yyyy"
          />
        </el-form-item>
        <el-form-item label="电影导演" label-width="100px" prop="movie_director">
          <el-tag
            v-for="tag in dynamicDirectorTags"
            :key="tag"
            closable
            :disable-transitions="false"
            @close="handleDirectorClose(tag)"
          >
            {{ tag }}
          </el-tag>
          <el-input
            v-if="directorInputVisible"
            ref="saveDirectorTagInput"
            v-model="directorInputValue"
            class="input-new-tag"
            size="small"
            @keyup.enter.native="handleDirectorInputConfirm"
            @blur="handleDirectorInputConfirm"
          />
          <el-button v-else class="button-new-tag" size="small" @click="showDirectorInput">+ 导演</el-button>
        </el-form-item>
        <el-form-item label="电影编剧" label-width="100px" prop="movie_screenwriter">
          <el-tag
            v-for="tag in dynamicWriterTags"
            :key="tag"
            closable
            :disable-transitions="false"
            @close="handleWriterClose(tag)"
          >
            {{ tag }}
          </el-tag>
          <el-input
            v-if="writerInputVisible"
            ref="saveWriterTagInput"
            v-model="writerInputValue"
            class="input-new-tag"
            size="small"
            @keyup.enter.native="handleWriterInputConfirm"
            @blur="handleWriterInputConfirm"
          />
          <el-button v-else class="button-new-tag" size="small" @click="showWriterInput">+ 编剧</el-button>
        </el-form-item>
        <el-form-item label="电影主演" style="width: 90%" label-width="100px" prop="movie_actor">
          <el-input v-model="actorAndRoleStr" placeholder="张涵予,欧豪.机长刘长健,副驾驶徐奕辰" />
        </el-form-item>
        <el-form-item label="电影类型" label-width="100px" prop="movie_type">
          <el-select v-model="selectedMovieTypeList" multiple placeholder="请选择" style="width: 240px">
            <el-option
              v-for="item in selectOptions"
              :key="item.cat_id"
              :label="item.cat_name"
              :value="item.cat_name"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="制片国家" label-width="100px" prop="movie_country">
          <el-tag
            v-for="tag in dynamicCountryTags"
            :key="tag"
            closable
            :disable-transitions="false"
            @close="handleCountryClose(tag)"
          >
            {{ tag }}
          </el-tag>
          <el-input
            v-if="countryInputVisible"
            ref="saveCountryTagInput"
            v-model="countryInputValue"
            class="input-new-tag"
            size="small"
            @keyup.enter.native="handleCountryInputConfirm"
            @blur="handleCountryInputConfirm"
          />
          <el-button v-else class="button-new-tag" size="small" @click="showCountryInput">+ 国家/地区</el-button>
        </el-form-item>
        <el-form-item label="电影语言" label-width="100px" prop="movie_language">
          <el-tag
            v-for="tag in dynamicLanguageTags"
            :key="tag"
            closable
            :disable-transitions="false"
            @close="handleLanguageClose(tag)"
          >
            {{ tag }}
          </el-tag>
          <el-input
            v-if="languageInputVisible"
            ref="saveLanguageTagInput"
            v-model="languageInputValue"
            class="input-new-tag"
            size="small"
            @keyup.enter.native="handleLanguageInputConfirm"
            @blur="handleLanguageInputConfirm"
          />
          <el-button v-else class="button-new-tag" size="small" @click="showLanguageInput">+ 语言</el-button>
        </el-form-item>
        <el-form-item label="上映日期" label-width="100px" prop="movie_releaseDate">
          <el-tag
            v-for="tag in dynamicReleaseTags"
            :key="tag"
            closable
            :disable-transitions="false"
            @close="handleReleaseClose(tag)"
          >
            {{ tag }}
          </el-tag>
          <el-input
            v-if="releaseInputVisible"
            ref="saveReleaseTagInput"
            v-model="releaseInputValue"
            class="input-new-tag"
            size="small"
            @keyup.enter.native="handleReleaseInputConfirm"
            @blur="handleReleaseInputConfirm"
          />
          <el-button v-else class="button-new-tag" size="small" @click="showReleaseInput">+ 新日期</el-button>
        </el-form-item>
        <el-form-item label="电影片长" style="width: 30%" label-width="100px" prop="movie_duration">
          <el-input v-model.number="addMovieObj.movie_duration" placeholder="请输入">
            <template slot="append">分钟</template>
          </el-input>
        </el-form-item>
        <el-form-item label="电影别名" label-width="100px" prop="movie_alias">
          <el-tag
            v-for="tag in dynamicAliasTags"
            :key="tag"
            closable
            :disable-transitions="false"
            @close="handleAliasClose(tag)"
          >
            {{ tag }}
          </el-tag>
          <el-input
            v-if="aliasInputVisible"
            ref="saveAliasTagInput"
            v-model="aliasInputValue"
            class="input-new-tag"
            size="small"
            @keyup.enter.native="handleAliasInputConfirm"
            @blur="handleAliasInputConfirm"
          />
          <el-button v-else class="button-new-tag" size="small" @click="showAliasInput">+ 新别名</el-button>
        </el-form-item>
        <el-form-item label="IDMb链接" style="width: 50%" label-width="100px" prop="movie_IMDb">
          <el-input v-model="addMovieObj.movie_IMDb" placeholder="https://www.imdb.com/title/tt123456/" />
        </el-form-item>
        <el-form-item label="电影热度" label-width="100px" prop="movie_score">
          <el-slider v-model="addMovieObj.movie_score" :format-tooltip="formatTooltip" />
        </el-form-item>
        <el-form-item label="是否热映" label-width="100px" prop="movie_isSelling">
          <el-switch
            v-model="addMovieObj.movie_isSelling"
            active-value="1"
            inactive-value="0"
          />
        </el-form-item>
        <el-form-item label="电影简介" label-width="100px" prop="movie_synopsis">
          <el-input v-model="addMovieObj.movie_synopsis" type="textarea" :rows="5" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addMovieDialogCancel">取 消</el-button>
        <el-button type="primary" @click="addMovieDialogSure">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 展示电影评论的 Drawer 抽屉 -->
    <el-drawer
      :title="movie_name + '的影评'"
      :visible.sync="drawerVisible"
    >
      <div v-if="comList.length > 0" ref="comBox" class="com-box">
        <div v-for="(item, index) in comList" :key="index" class="everyCom">
          <div class="userInfo">
            <img :src="item.user_avatarUrl" alt="">
            <span class="username">{{ item.user_nickname }}</span>
            <span class="comTime">{{ item.updateTime }}</span>
          </div>
          <div class="comTitle">
            <h4>{{ item.com_title }}</h4>
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="editCom(item, index)" />
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="delCom(item.com_id)" />
          </div>
          <div class="comContent">
            <p>{{ isDetailComList[index] ? detailComContentList[index] : item.com_content }}<span v-if="!isShorterThan180[index]" @click="handleCom(index, item.movie_id)">{{ isDetailComList[index] ? '收起' : '展开...' }}</span></p>
          </div>
          <div class="likeOrNot clearfix">
            <div class="likeOrNot-box">
              <i class="iconfont iconthumb-up like" />
              <span class="likeCount">{{ item.com_likeCount }}</span>
              <i class="iconfont iconthumb-up unlike" />
              <span class="unlikeCount">{{ item.com_notLikeCount }}</span>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="com-none">
        <i class="el-icon-warning" />
        <span>该电影没有影评！</span>
      </div>
    </el-drawer>
    <!-- 编辑评论 弹框 -->
    <el-dialog title="修改评论信息" :visible.sync="editComDialogVisible">
      <el-form ref="editComRef" :model="editComObj" :rules="editComRules">
        <el-form-item label="评论标题" label-width="100px" prop="com_title">
          <el-input v-model="editComObj.com_title" @input="editValChange($event)" />
        </el-form-item>
        <el-form-item label="评论内容" label-width="100px" prop="com_content">
          <el-input v-model="editComObj.com_content" type="textarea" :rows="12" @input="editValChange($event)" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editComDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editComDialogSure">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// import debounce from '@/utils/debounce'
import config from '../../config/index'
import OSS from 'ali-oss'

export default {
  data() {
    // 验证用户名（手机号）
    const validateComTitle = (rule, value, callback) => {
      if (!this.editComObj.com_title) {
        callback(new Error('请输入标题'))
      } else {
        callback()
      }
    }
    // 验证密码
    const validateComContent = (rule, value, callback) => {
      if (!this.editComObj.com_content) {
        callback(new Error('请输入内容'))
      } else {
        callback()
      }
    }
    return {
      // 电影列表
      movieList: [],
      // 获取电影列表时所需的参数
      queryInfo: {
        query: '',
        // 当前页
        pagenum: 1,
        // 一页展示数据条数
        pagesize: 5
      },
      // 总数据条数
      total: null,
      // 搜索框双向绑定的数据
      searchInput: '',
      // ali-oss Client
      ossClient: null,
      // 已选择的上传文件列表
      fileList: [],
      // 控制添加电影弹框是否显示
      addMovieDialogVisible: false,
      addMovieObj: {
        movie_name: '',
        movie_year: '',
        movie_director: '',
        movie_screenwriter: '',
        movie_actor: '',
        movie_roleName: '',
        movie_type: '',
        movie_country: '',
        movie_language: '',
        movie_releaseDate: '',
        movie_duration: '',
        movie_alias: '',
        movie_IMDb: '',
        movie_synopsis: '',
        movie_score: 72,
        movie_isSelling: 0
      },
      actorAndRoleStr: '',
      // 导演 - 动态标签数据
      dynamicDirectorTags: [],
      directorInputVisible: false,
      directorInputValue: '',
      // 编剧 - 动态标签数据
      dynamicWriterTags: [],
      writerInputVisible: false,
      writerInputValue: '',
      // 制片国家 - 动态标签数据
      dynamicCountryTags: [],
      countryInputVisible: false,
      countryInputValue: '',
      // 语言 - 动态标签数据
      dynamicLanguageTags: [],
      languageInputVisible: false,
      languageInputValue: '',
      // 上映日期 - 动态标签数据
      dynamicReleaseTags: [],
      releaseInputVisible: false,
      releaseInputValue: '',
      // 电影别名 - 动态标签数据
      dynamicAliasTags: [],
      aliasInputVisible: false,
      aliasInputValue: '',
      // select 选择器中选中值所组成的数组
      selectedMovieTypeList: [],
      // 所有分类数据
      selectOptions: [],
      // 表单的验证规则对象
      addMovieRules: {
        // 验证电影名称
        movie_name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        // 验证电影年份
        movie_year: [
          { required: true, message: '请选择电影年份', trigger: 'blur' }
        ],
        // 验证电影主演
        // movie_actor: [
        //   { required: true, message: '请输入演员和饰演角色', trigger: 'blur' }
        // ],
        // 验证电影片长
        movie_duration: [
          { required: true, message: '请输入电影片长', trigger: 'blur' }
        ],
        // 验证电影简介
        movie_synopsis: [
          { required: true, message: '请输入电影简介', trigger: 'blur' }
        ]
      },
      editCoverObj: {
        movie_name: '',
        movieImg_url: ''
      },
      // 当前是在添加电影还是编辑电影
      // true：添加，false：编辑
      addOrEdit: true,
      movie_id: 0,
      catList: [],
      selectedCatId: '',
      // 控制 Drawer 抽屉是否显示
      drawerVisible: false,
      // 单部电影的评论列表
      comList: [],
      // 当前需要查看评论/正在修改封面的电影名
      movie_name: '',
      // 是否显示详细评论数组
      isDetailComList: [],
      // 详细评论内容数组
      detailComContentList: [],
      // 标记评论内容是否短于180的数组
      isShorterThan180: [],
      editComObj: {},
      editComDialogVisible: false,
      editComRules: {
        // 验证评论标题
        com_title: [
          { validator: validateComTitle, trigger: 'blur' }
        ],
        com_content: [
          { validator: validateComContent, trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getMovieList()
    this.getCatList()
  },
  methods: {
    // 获取电影列表
    async getMovieList() {
      const { data: res } = await this.$http.get('getmovielist', {
        params: this.queryInfo
      })
      if (res.code !== 1) return this.$message.error(res.message)
      this.movieList = res.result[0]

      // 处理后端返回的 movieList，方便展示
      this.handleMovieList()

      this.total = res.result[1][0].total
    },
    // 获取分类电影列表
    async getCatMovListDetail() {
      // 重置一下 queryInfo
      this.queryInfo = {
        query: '',
        // 当前页
        pagenum: 1,
        // 一页展示数据条数
        pagesize: 5
      }
      const { data: res } = await this.$http.get('getcatmovlistdet', { params: { ...this.queryInfo, cat_id: this.selectedCatId }})
      if (res.code !== 1) return this.$message.error(res.message)
      this.movieList = res.result[0]
      // console.log('this.movieList: ', this.movieList);

      // 处理后端返回的 movieList，方便展示
      this.handleMovieList()

      this.total = res.result[1][0].total
    },
    // 获取分类列表
    async getCatList() {
      const { data: res } = await this.$http.get('getcatlist')
      if (res.code !== 1) return this.$message.error(res.message)
      // 页面右上角的分类数据
      this.catList = res.result
      // 添加/编辑电影弹框中的分类数据
      this.selectOptions = res.result
      // console.log('this.catList: ', this.catList)
    },
    // 获取电影评论列表
    async getMovComList(id) {
      this.detailComContentList = []
      const { data: res } = await this.$http.get('getmovcomlist', { params: { movie_id: id }})
      if (res.code !== 1) return this.$message.error(res.message)
      this.comList = res.result
      // 原本的 comList 中的 com_content 字段存放简要内容，详细内容存在 detailComContentList 中
      for (let i = 0; i < this.comList.length; i++) {
        if (this.comList[i].com_content.length <= 180) this.isShorterThan180[i] = true
        this.detailComContentList[i] = this.comList[i].com_content
        this.comList[i].com_content = this.comList[i].com_content.slice(0, 150)
      }
      // console.log('this.comList: ', this.comList)
    },
    // 获取电影小封面
    async getMovSmallCov(movie_name) {
      const { data: res } = await this.$http.get('getmovsmallcov', { params: { movie_name }})
      if (res.code !== 1) return this.$message.error(res.message)
      // this.$message.success(res.message)
      console.log('res.result: ', res.result)
      this.editCoverObj.movieImg_url = res.result.movieImg_url
      console.log('this.editCoverObj: ', this.editCoverObj)
    },
    // 处理后端返回的 movieList，方便展示
    async handleMovieList() {
      for (const key of this.movieList) {
        // 增加 movie_smallCovUrl 字段
        const { data: res_cover } = await this.$http.get('getmovsmallcov', { params: { movie_name: key.movie_name }})
        // if (res_cover.code !== 1) return this.$message.error(res_cover.message)
        // 有可能该电影没有小封面在数据库
        if (res_cover.result.length > 0) {
          key.movie_smallCovUrl = res_cover.result[0].movieImg_url
        }
        // 处理是否正在热映
        key.movie_isSelling = key.movie_isSelling === 0 ? '否' : '是'
        // 处理电影时长
        key.movie_duration += '分钟'
        // 原 movie_actor 和 movie_roleName 以英文逗号分隔成数组
        key.movie_actor = key.movie_actor.split(',')
        key.movie_roleName = key.movie_roleName.split(',')
        for (let i = 0; i < key.movie_roleName.length; i++) {
          key.movie_roleName[i] = '饰 ' + key.movie_roleName[i]
        }
        // 新增一个拼接 movie_actor 和 movie_roleName 的数组，方便数据展示
        key.actorAndRoleList = []
        for (let i = 0; i < key.movie_actor.length; i++) {
          key.actorAndRoleList.push(key.movie_actor[i])
          key.actorAndRoleList.push(key.movie_roleName[i])
        }
      }
    },
    // 当前页要展示的数据条数发生改变 触发
    handleSizeChange(val) {
      this.queryInfo.pagesize = val
      this.getMovieList()
    },
    // 当前页码改变 触发
    handleCurrentChange(val) {
      this.queryInfo.pagenum = val
      this.getMovieList()
    },
    // 点击清除搜索框或者搜索按钮 触发
    handleSearchClearOrClick() {
      // 重置一下 pagenum 和 pagesize
      this.queryInfo.pagenum = 1
      this.queryInfo.pagesize = 5

      this.getMovieList()
    },
    // 创建 OSS Client
    async initOSSClient() {
      const { data: res } = await this.$http.get('ststoken')
      if (res.code !== 1) return this.$message.error(res.message)

      this.ossClient = new OSS({
        accessKeyId: res.result.AccessKeyId,
        accessKeySecret: res.result.AccessKeySecret,
        stsToken: res.result.SecurityToken,
        bucket: config.OSS.bucket,
        region: config.OSS.origin
      })
    },
    // 已选择封面 触发
    async selectedCover(param) {
      console.log('param: ', param)
      if (!this.ossClient) await this.initOSSClient()
      const fileNameAndPath = 'img/' + this.formatDate() + '.' + param.file.type.split('/')[1]
      // 封面上传到 OSS
      const OSSRes = await this.ossClient.put(fileNameAndPath, param.file)
      console.log('ossClientRes: ', OSSRes)
      // 将 OSS 返回来的图片 url 保存到数据库
      this.editCoverObj.movieImg_url = OSSRes.url

      const { data: res } = await this.$http.put('editmovsmallcov', this.editCoverObj)
      if (res.code !== 1) return this.$message({ message: '封面修改失败！', type: 'error' })
      this.$message({ message: '封面修改成功~', type: 'success' })
      // this.getMovSmallCov(this.movie_name)
    },
    // 解决不刷新页面，只能上传一次的问题
    // 每次上传成功，清空缓存中的文件
    uploadSuccess() {
      this.$refs.coverUpload.clearFiles()
    },
    // 上传之前 触发
    // 用于校验图片大小，这里设置超过 8 MB 就阻止上传！
    coverIsLessThan8M(file) {
      const flag = file.size / 1024 / 1024 < 8
      if (!flag) {
        this.$message.error('图片大小不可超过3MB!')
        return false
      } else {
        return true
      }
    },
    // 格式化日期
    formatDate() {
      const date = new Date(+new Date())
      const YYYY = date.getFullYear()
      const MM = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1)
      const DD = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
      const hh = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
      const mm = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
      const ss = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
      let ms = date.getMilliseconds()
      if (ms < 10) {
        ms += '00'
      } else if (ms < 100) {
        ms += '0'
      }
      return YYYY + MM + DD + hh + mm + ss + ms
    },
    // 点击删除电影按钮 触发
    async delMovie(id) {
      // 弹出 MessageBox 弹框
      const confirmData = await this.$confirm('此操作将永久删除该电影, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      // 点击 取消， confirmData 为 cancel
      // 点击 确定， confirmData 为 confirm
      // 用户点击了取消按钮
      if (confirmData !== 'confirm') {
        return this.$message.info('已取消删除~')
      }
      // 执行到这里，代表用户点了确定
      const { data: res } = await this.$http.delete('delmovie', { data: { movie_id: id }})
      // console.log(res)
      if (res.code !== 1) return this.$message.error(res.message)
      this.$message.success(res.message)
      this.getMovieList()
    },
    // 按下添加电影按钮
    async addMovie() {
      // 切换状态：当前在添加电影
      this.addOrEdit = true
      this.addMovieDialogVisible = true
      // 清空 addMovieObj 以及所有展示的数据
      this.addMovieObj = {}
      this.dynamicDirectorTags = []
      this.dynamicWriterTags = []
      this.dynamicCountryTags = []
      this.dynamicLanguageTags = []
      this.dynamicReleaseTags = []
      this.dynamicAliasTags = []
      this.selectedMovieTypeList = []
      this.actorAndRoleStr = ''
      this.editCoverObj.movieImg_url = ''
      // 请求电影分类数据，便以展示
      this.getCatList()
    },
    // 按下编辑电影按钮
    async editMovie(movieItem) {
      // 切换状态：当前在编辑电影
      this.addOrEdit = false
      // 显示编辑电影信息弹框
      this.addMovieDialogVisible = true
      // 缓存电影 ID 电影名称和电影小封面
      this.movie_id = movieItem.movie_id
      this.editCoverObj.movie_name = movieItem.movie_name
      this.editCoverObj.movieImg_url = movieItem.movie_smallCovUrl
      // 获取电影小封面
      // this.getMovSmallCov(movieItem.movie_name)
      // 请求电影分类数据，便以展示
      this.getCatList()
      // 根据 movie_id 查询电影信息，保存到 editMovieObj，用于渲染到编辑电影信息弹框
      const { data: res } = await this.$http.get('getmovinfo', { params: { movie_id: movieItem.movie_id }})
      if (res.code !== 1) return
      this.addMovieObj = res.result[0]
      // console.log('this.addMovieObj: ', this.addMovieObj)

      // 电影年份、导演、编剧、主演等信息需要进行逆向处理才能渲染到表单中
      // 衔接电影年份
      this.addMovieObj.movie_year += ''
      // 衔接主演、饰演角色与 addMovieObj 中的数据
      this.actorAndRoleStr = this.addMovieObj.movie_actor + '.' + this.addMovieObj.movie_roleName
      // 衔接导演、编剧、制片国家等与 addMovieObj 中的数据
      this.dynamicDirectorTags = this.addMovieObj.movie_director.split(',')
      this.dynamicWriterTags = this.addMovieObj.movie_screenwriter.split(',')
      this.dynamicCountryTags = this.addMovieObj.movie_country.split(',')
      this.dynamicLanguageTags = this.addMovieObj.movie_language.split(',')
      this.dynamicReleaseTags = this.addMovieObj.movie_releaseDate.split(',')
      this.dynamicAliasTags = this.addMovieObj.movie_alias.split(',')
      this.selectedMovieTypeList = this.addMovieObj.movie_type.split(',')
      // 衔接电影热度、是否正在热映与 addMovieObj 中的数据
      this.addMovieObj.movie_score *= 10
      this.addMovieObj.movie_isSelling += ''
    },
    // 点击添加/编辑电影弹框中的取消按钮
    addMovieDialogCancel() {
      this.addMovieDialogVisible = false
      this.getMovieList()
    },
    // 点击添加/编辑电影弹框中的确定按钮
    addMovieDialogSure() {
      // 表单预检验
      this.$refs.addMovieRef.validate(async valid => {
        if (!valid) return
        // 衔接主演、饰演角色与 addMovieObj 中的数据
        const tmpArr = this.actorAndRoleStr.split('.')
        this.addMovieObj.movie_actor = tmpArr[0]
        this.addMovieObj.movie_roleName = tmpArr[1]
        // 衔接导演、编剧、制片国家等标签与 addMovieObj 中的数据
        this.addMovieObj.movie_director = this.dynamicDirectorTags.join(',')
        this.addMovieObj.movie_screenwriter = this.dynamicWriterTags.join(',')
        this.addMovieObj.movie_country = this.dynamicCountryTags.join(',')
        this.addMovieObj.movie_language = this.dynamicLanguageTags.join(',')
        this.addMovieObj.movie_releaseDate = this.dynamicReleaseTags.join(',')
        this.addMovieObj.movie_type = this.selectedMovieTypeList.join(',')
        this.addMovieObj.movie_alias = this.dynamicAliasTags.join(',')
        // 衔接电影热度、是否正在热映与 addMovieObj 中的数据
        this.addMovieObj.movie_score /= 10
        this.addMovieObj.movie_isSelling -= 0

        // 判断当前是添加电影还是编辑电影
        if (this.addOrEdit) { // 添加
          const { data: addRes } = await this.$http.post('addmovie', this.addMovieObj)
          if (addRes.code !== 1) return this.$message.error(addRes.message)
          this.$message.success(addRes.message)
        } else { // 编辑
          const { data: editRes } = await this.$http.put('editmovie', { movie_id: this.movie_id, ...this.addMovieObj })
          // console.log('editRes: ', editRes)
          if (editRes.code !== 1) return this.$message.error(editRes.message)
          this.$message.success(editRes.message)
        }

        // 让添加/编辑电影弹框隐藏
        this.addMovieDialogVisible = false
        // 清空表单
        this.$refs.addMovieRef.resetFields()
        this.getMovieList()
      })
    },
    // 关闭导演标签 触发
    handleDirectorClose(tag) {
      this.dynamicDirectorTags.splice(this.dynamicDirectorTags.indexOf(tag), 1)
    },
    // 显示导演输入框
    showDirectorInput() {
      this.directorInputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveDirectorTagInput.$refs.input.focus()
      })
    },
    // 确定添加导演标签 触发
    handleDirectorInputConfirm() {
      const directorInputValue = this.directorInputValue
      if (directorInputValue) {
        this.dynamicDirectorTags.push(directorInputValue)
      }
      this.directorInputVisible = false
      this.directorInputValue = ''
    },
    // 关闭编剧标签 触发
    handleWriterClose(tag) {
      this.dynamicWriterTags.splice(this.dynamicWriterTags.indexOf(tag), 1)
    },
    // 显示编剧输入框
    showWriterInput() {
      this.writerInputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveWriterTagInput.$refs.input.focus()
      })
    },
    // 确定添加编剧标签 触发
    handleWriterInputConfirm() {
      const writerInputValue = this.writerInputValue
      if (writerInputValue) {
        this.dynamicWriterTags.push(writerInputValue)
      }
      this.writerInputVisible = false
      this.writerInputValue = ''
    },
    // 关闭制片国家标签 触发
    handleCountryClose(tag) {
      this.dynamicCountryTags.splice(this.dynamicCountryTags.indexOf(tag), 1)
    },
    // 显示制片国家输入框
    showCountryInput() {
      this.countryInputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveCountryTagInput.$refs.input.focus()
      })
    },
    // 确定添加制片国家标签 触发
    handleCountryInputConfirm() {
      const countryInputValue = this.countryInputValue
      if (countryInputValue) {
        this.dynamicCountryTags.push(countryInputValue)
      }
      this.countryInputVisible = false
      this.countryInputValue = ''
    },
    // 关闭电影语言标签 触发
    handleLanguageClose(tag) {
      this.dynamicLanguageTags.splice(this.dynamicLanguageTags.indexOf(tag), 1)
    },
    // 显示电影语言输入框
    showLanguageInput() {
      this.languageInputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveLanguageTagInput.$refs.input.focus()
      })
    },
    // 确定添加电影语言标签 触发
    handleLanguageInputConfirm() {
      const languageInputValue = this.languageInputValue
      if (languageInputValue) {
        this.dynamicLanguageTags.push(languageInputValue)
      }
      this.languageInputVisible = false
      this.languageInputValue = ''
    },
    // 关闭上映日期标签 触发
    handleReleaseClose(tag) {
      this.dynamicReleaseTags.splice(this.dynamicReleaseTags.indexOf(tag), 1)
    },
    // 显示上映日期输入框
    showReleaseInput() {
      this.releaseInputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveReleaseTagInput.$refs.input.focus()
      })
    },
    // 确定添加上映日期标签 触发
    handleReleaseInputConfirm() {
      const releaseInputValue = this.releaseInputValue
      if (releaseInputValue) {
        this.dynamicReleaseTags.push(releaseInputValue)
      }
      this.releaseInputVisible = false
      this.releaseInputValue = ''
    },
    // 关闭电影别名标签 触发
    handleAliasClose(tag) {
      this.dynamicAliasTags.splice(this.dynamicAliasTags.indexOf(tag), 1)
    },
    // 显示电影别名输入框
    showAliasInput() {
      this.aliasInputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveAliasTagInput.$refs.input.focus()
      })
    },
    // 确定添加电影别名标签 触发
    handleAliasInputConfirm() {
      const aliasInputValue = this.aliasInputValue
      if (aliasInputValue) {
        this.dynamicAliasTags.push(aliasInputValue)
      }
      this.aliasInputVisible = false
      this.aliasInputValue = ''
    },
    // 滑动电影热度滑块 触发
    formatTooltip(val) {
      return val / 10
    },
    // 选中一个分类或者点击清空按钮 触发
    selectedCat(e) {
      // 选中一个分类
      if (e !== '') {
        this.getCatMovListDetail()
      } else { // 点击清空按钮
        this.getMovieList()
      }
    },
    // 点击打开电影评论按钮 触发
    openCom(id, name) {
      // 显示 Drawer 抽屉
      this.drawerVisible = true
      // 缓存一下电影名字
      this.movie_name = name
      // 获取电影评论列表
      this.getMovComList(id)
    },
    // 展开收起评论 触发
    handleCom(i, id) {
      this.isDetailComList[i] = !this.isDetailComList[i]
      // 手动刷新 获取电影评论列表
      this.getMovComList(id)
    },
    // 点击编辑评论按钮 触发
    editCom(comItem, i) {
      console.log('comItem: ', comItem)
      this.editComDialogVisible = true
      this.editComObj = comItem
      // 更改评论内容，因为 comitem 中的评论内容只是简易的，详细的内容在 detailComContentList 中
      this.editComObj.com_content = this.detailComContentList[i]
    },
    // 点击编辑评论确定按钮 触发
    async editComDialogSure() {
      // console.log('this.editComObj: ', this.editComObj)
      // 表单预检验
      this.$refs.editComRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put('editcom', this.editComObj)
        // // console.log(res)
        if (res.code !== 1) return this.$message.error(res.message)
        this.$message.success(res.message)
        // 让修改评论弹框隐藏
        this.editComDialogVisible = false
        // 清空表单
        // this.$refs.editComRef.resetFields()
        // 刷新电影评论列表
        // this.getMovComList()
        // 关闭 Drawer 抽屉
        this.drawerVisible = false
      })
    },
    // 点击删除评论按钮 触发
    async delCom(id) {
      // 弹出 MessageBox 弹框
      const confirmData = await this.$confirm('此操作将永久删除该评论, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      // 点击 取消， confirmData 为 cancel
      // 点击 确定， confirmData 为 confirm
      // 用户点击了取消按钮
      if (confirmData !== 'confirm') {
        return this.$message.info('已取消删除~')
      }
      // 执行到这里，代表用户点了确定
      const { data: res } = await this.$http.delete('delcom', { data: { com_id: id }})
      // console.log(res)
      if (res.code !== 1) return this.$message.error(res.message)
      this.$message.success(res.message)
      // this.getMovComList()
      // 关闭 Drawer 抽屉
      this.drawerVisible = false
    },
    // 解决输入框无法输入问题
    // 可能是因为嵌入太深，这个弹框是从 Drawer 抽屉弹出的
    // 同时校验规则会失效，因为本来就是数据没有变化
    // 需要自定义校验规则，别使用参数 value 来判断，用 this.editComObj
    editValChange(e) {
      this.$forceUpdate()
    }
  }
}
</script>

<style lang="scss" scoped>
.firstRow {
  margin-bottom: 15px;
}
.movie-avatar {
  width: 40px;
  height: 40px;
}
// 展开行样式
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 100%;
}
// 动态标签样式
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
// 电影封面样式
.movieCover-box {
  width: 80px;
  height: 110px;
  .avatar {
    width: 100%;
    height: 100%;
  }
}
.el-dialog__body {
  position: relative;
  // 编辑电影弹框中的小封面盒子
  .cover-box {
    position: absolute;
    top: 85px;
    right: 55px;
    width: 250px;
    height: 175px;
    // background-color: pink;
    img {
      width: 128px;
      height: 100%;
    }
    .el-upload .el-button {
      position: absolute;
      bottom: 0;
      left: 145px;
    }
  }
}
// 电影评论样式
.com-box {
  // height: 1100px;
  height: 100%;
  padding-right: 10px;
  overflow: auto;
  .everyCom {
    border-bottom: 1px #E6E6E6 solid;
    padding-bottom: 15px;
    margin-bottom: 15px;
    .userInfo {
      height: 30px;
      img {
        float: left;
        width: 30px;
        height: 30px;
      }
      span {
        float: left;
        line-height: 30px;
        font-size: 16px;
      }
      .username {
        margin-left: 15px;
      }
      .comTime {
        margin-left: 40px;
        font-size: 14px;
        color: #999;
      }
    }
    .comTitle {
      position: relative;
      h4 {
        color: #111;
        // font-size: 20px;
      }
      .el-button {
        position: absolute;
        top: -7px;
        right: 0;
      }
      .el-button:nth-child(2) {
        right: 50px;
      }
    }
    .comContent {
      p {
        font-size: 16px;
        text-indent: 2em;
        line-height: 18px;
        span {
          margin-left: 15px;
          font-size: 14px;
          color: #E50914;
          cursor: pointer;
        }
      }
    }
    .likeOrNot {
      // position: relative;
      height: 18px;
      color: #E50914;
      .likeOrNot-box {
        float: right;
        // width: 160px;
        height: 100%;
        margin-right: 30px;
        // .iconyidongduan_dianzan {
        //   color: #E50914;
        // }
        .like {
          float: left;
          margin-right: 8px;
          font-size: 14px;
        }
        // .like {
        //   float: left;
        //   width: 16px;
        //   height: 16px;
        //   margin-right: 8px;
        // }
        .likeCount {
          float: left;
          line-height: 18px;
          margin-right: 25px;
        }
        .unlike {
          float: left;
          display: inline-block;
          transform: rotate(180deg);
          margin-right: 8px;
          font-size: 14px;
        }
        // .unlike {
        //   float: left;
        //   display: inline-block;
        //   width: 16px;
        //   height: 16px;
        //   line-height: 10px;
        //   transform: rotate(180deg);
        //   margin-right: 8px;
        // }
        .unlikeCount {
          float: left;
          line-height: 18px;
        }
      }
    }
  }
}
.com-none {
  position: absolute;
  top: 300px;
  left: 50%;
  transform: translateX(-50%);
  width: 147px;
  height: 24px;
  // background-color: pink;
  i {
    margin-right: 3px;
  }
}
</style>
<style lang="scss">
.el-drawer.rtl {
  width: 35% !important;
  overflow: scroll;
}
.el-drawer__header {
  font-size: 20px;
  :focus {
    outline:0;
  }
}
.el-drawer__body {
  margin: 0 20px;
}
.upload {
  width: 0;
  height: 0;
}
</style>
