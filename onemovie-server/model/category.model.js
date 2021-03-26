let query = require('../db/mysql')

const Category = {
  // 添加分类
  addCategory(params) {
    let _sql = "insert into category set cat_name = ?;"
    return query(_sql, params)
  },
  // 删除分类
  deleteCategory(params) {
    let _sql = "delete from category where cat_id = ?;"
    return query(_sql, params)
  },
  // 修改分类
  editCategory(params) {
    let _sql = "update category set cat_name = ? where cat_id = ?;"
    return query(_sql, params)
  },
  // 获取分类列表（按 cat_id 升序排）
  getCategoryList(params) {
    let _sql = `select cat_id, cat_name, createTime, updateTime from category where cat_name like '%${params}%' order by cat_id;`
    return query(_sql, params)
  },
  // 获取分类信息
  getCategoryInfo(params) {
    let _sql = `select cat_id, cat_name from category where cat_id = "${params}";`
    return query(_sql, params)
  },
  // 通过 cat_name 查找
  findByCatName(params) {
    let _sql = `select cat_id, cat_name from category where cat_name = "${params}";`
    return query(_sql, params)
  }
}

module.exports = Category