const argv = require('yargs').argv

exports.MYSQL = {
  DATABASE: argv.DB_NAME || 'onemovie',
  USERNAME: argv.DB_USERNAME || 'root',
  PASSWORD: argv.DB_PASSWORD || 'root',
  PORT: argv.DB_PORT || '3306',
  HOST: argv.DB_HOST || '127.0.0.1'
}

exports.QINIU = {
  accessKey: argv.qn_accessKey || 'your_qn_accessKey',
  secretKey: argv.qn_secretKey || 'your_qn_secretKey',
  bucket: argv.qn_bucket || 'blog',
  origin: argv.qn_origin || 'http://blog.u.qiniudn.com',
  uploadURL: argv.qn_uploadURL || 'http://up.qiniu.com/'
}

exports.OSS = {
  accessKeyID: argv.oss_accessKeyID || 'LTAI4GBnWVQR7fx6aLgxKsaL',
  accessKeySecret: argv.oss_accessKeySecret || 'CYpCWqnrYP0VmkrNm3Arp1Cs98Ypsv',
  bucket: argv.oss_bucket || 'onemovie-img',
  origin: argv.oss_origin || 'oss-cn-guangzhou',
  uploadURL: argv.oss_uploadURL || 'http://up.qiniu.com/'
}

exports.USER = {
  jwtSecret: argv.user_key || 'onemovie',
  pwdSalt: argv.pwd_salt || 'onemovie',
  defaultUsername: argv.user_default_username || 'user_default_username',
  defaultPassword: argv.user_default_password || 'user_default_password'
}

exports.ADMIN = {
  jwtTokenSecret: argv.user_key || 'admin_key',
  pwdSalt: argv.pwd_salt || 'pwd_salt',
  defaultAdminname: argv.admin_default_adminname || 'admin_default_adminname',
  defaultPassword: argv.admin_default_password || 'admin_default_password'
}

// exports.EMAIL = {
//   account: argv.EMAIL_account || 'your_email_account',
//   password: argv.EMAIL_password || 'your_email_password'
// }

// exports.BAIDU = {
//   site: argv.baidu_site || 'your_baidu_site',
//   token: argv.baidu_token || 'your_baidu_token'
// }

exports.APP = {
  ROOT_PATH: '/api',
  PORT: 3500
}

exports.INFO = {
  name: 'OneMovie',
  version: '1.0.0',
  author: 'Logan',
  site: '',
  powered: ['Vue2', 'Node.js', 'Mysql', 'koa', 'Nginx']
}
