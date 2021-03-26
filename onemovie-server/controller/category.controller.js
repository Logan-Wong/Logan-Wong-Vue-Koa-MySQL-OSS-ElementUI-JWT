const Category = require('../model/category.model')
const {handleSuccess, handleError} = require("../middlewears/handle")

const CategoryController = {
  // 添加分类
  addCategory: async ctx => {
    let {cat_name} = ctx.request.body
    await Category.addCategory([cat_name]).then( res => {
      if(res.affectedRows > 0){
        handleSuccess({ctx, result: '新增分类成功', message: '新增分类成功'})
      }
    }).catch( err => {
      handleError({ctx, message: '新增分类失败', err})
    })
  },
  // 删除分类
  deleteCategory: async ctx => {
    let {cat_id} = ctx.request.body
    await Category.deleteCategory([cat_id]).then( res => {
      if(res.affectedRows > 0){
        handleSuccess({ctx, result: '删除分类成功', message: '删除分类成功'})
      }
    }).catch( err => {
      handleError({ctx, message: '删除分类失败', err})
    })
  },
  // 修改分类
  editCategory: async ctx => {
    let {cat_id, cat_name} = ctx.request.body
    await Category.editCategory([cat_name, cat_id]).then( res => {
      if(res.affectedRows > 0){
        handleSuccess({ctx, result: '修改分类成功', message: '修改分类成功'})
      }
    }).catch( err => {
      handleError({ctx, message: '修改分类失败', err})
    })
  },
  // 获取分类列表
  getCategoryList: async ctx => {
    let { query } = ctx.request.query
    await Category.getCategoryList([query]).then( res => {
      handleSuccess({ctx, result: res, message: '获取分类列表成功'})
    }).catch( err => {
      handleError({ctx, message: '获取分类列表失败', err})
    })
  },
  // 获取分类信息
  getCategoryInfo: async ctx => {
    let { cat_id, cat_name } = ctx.request.query
    await Category.getCategoryInfo([cat_id, cat_name]).then( res => {
      handleSuccess({ctx, result: res, message: '获取分类成功'})
    }).catch( err => {
      handleError({ctx, message: '获取分类失败', err})
    })
  }
}

module.exports = CategoryController
