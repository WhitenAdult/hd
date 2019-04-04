var express = require('express');
var router = express.Router();
const multer = require('multer');

const upload = multer({ dest: 'public/uploads/' });

const conn = require('./../db/db');


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

//上传图片
router.post('/api/uploads', upload.single('file'), (req, res) => {
  const pic = req.file;

  res.json({code: 200, imageUrl:pic.path});
})


//修改个人信息
router.post('/api/modifyInfo', (req, res) => {
  let id = req.body.id;
  let nickName = req.body.nickName;
  let phone = req.body.phone;
  let imgUrl = req.body.imgUrl;

  let sqlStr = "update users set nickname = ?,phone = ?, picURL = ? where id = ?";
  const SqlParams = [nickName,phone,imgUrl,id];
  conn.query(sqlStr,SqlParams,(error, results, fields) => {
    if(error){
      res.json({code: 0, message:'操作失败'});
    }else{
      results = JSON.parse(JSON.stringify(results));
      res.json({code: 200, message:'操作成功！'});
    }
  })
})


//登录
router.post('/api/login', (req, res) => {
  const userName = req.body.userName;
  const pwd = req.body.password;

  let sqlStr = "select * from users where userName = '" + userName + "' LIMIT 1";
  conn.query(sqlStr,(error, results, fields) => {
    if(error){
      res.json({code: 0, message:'用户名或密码不正确'});
    }else{
      results = JSON.parse(JSON.stringify(results));
      if(results[0]) {
        if(results[0].pwd !== pwd){
          res.json({code: 0, message:'用户名或密码不正确'});
        } else {
          req.session.userId = results[0].id;
          res.json({
            data: {id: results[0].id, userType:results[0].userType},
            code: 200,
            info:'登录成功！'
          })
        }
      }
    }
  })
})

//个人资料获取
router.get('/api/getPersonalInfo', (req, res) => {
  let userId = req.query.id

  let sqlStr = "select userName,roles,picURL,stID,nickName,phone,create_time from users where id = '" + userId + "' LIMIT 1";
  conn.query(sqlStr,(error, results, fields) => {
    if(error){
      res.json({code: 0, message:'获取失败'});
    }else{
      results = JSON.parse(JSON.stringify(results));
      res.json({code: 200, data: results[0],message:'获取成功'});
    }
  })
})

//获取用户信息(vuex用)
router.get('/api/info', (req, res) => {
  // let userId = req.session.userId;
  let userId = req.query.token

  let sqlStr = "select id,userName,roles,picURL,stID from users where id = '" + userId + "' LIMIT 1";
  conn.query(sqlStr,(error, results, fields) => {
    if(error){
      res.json({code: 0, message:'获取失败'});
    }else{
      results = JSON.parse(JSON.stringify(results));
      if(!results[0]){
        delete req.session.userId;
        res.json({code: 0, message:'请先登录'});
      }
      else{
        let arr = [];
        arr.push(results[0].roles);
        results[0].roles = arr;
        res.json({code: 200, data: results[0]});
      }
    }
  })
})

//获取用户列表
router.get('/api/getUserInfo', (req, res) => {
  let pageSize = req.query.pageSize;
  let pageNum = req.query.pageNum;

  let sqlStr = 'select * from users limit ' + (pageNum-1)*pageSize +',' + pageSize + ';select count(*) from users';
  conn.query(sqlStr,(error, results, fields) => {
    if(error){
      res.json({code: 0, message:'获取失败'});
    }else{
      results = JSON.parse(JSON.stringify(results));
      res.json({code: 200, data: results[0], total: results[1][0]['count(*)']});
    }
  })

})

//增加用户
router.post('/api/addUsers', (req, res) => {
  const addSql = 'insert into users(userName,pwd,roles,create_time) values(?,?,?,now())';
  const addSqlParams = [req.body.userName,'123456',req.body.roles];
  conn.query(addSql,addSqlParams,(error, results, fields) => {
    if(error){
      res.json({code: 0, message:'操作失败'});
    }else{
      results = JSON.parse(JSON.stringify(results));
      res.json({code: 200, data: results});
    }
  })
})

//重置密码
router.post('/api/reset', (req, res) => {
  const id = req.body.id
  const sqlStr = 'update users set pwd = 123456 where id = ?';
  const sqlParams = [id];
  conn.query(sqlStr,sqlParams,(error, results, fields) => {
    if(error){
      res.json({code: 0, message:'操作失败'});
    }else{
      results = JSON.parse(JSON.stringify(results));
      res.json({code: 200, data: results});
    }
  })
})

//删除用户
router.post('/api/delete', (req, res) => {
  const id = req.body.id
  const sqlStr = 'delete from users where id = ?';
  const sqlParams = [id];
  conn.query(sqlStr,sqlParams,(error, results, fields) => {
    if(error){
      res.json({code: 0, message:'操作失败'});
    }else{
      results = JSON.parse(JSON.stringify(results));
      res.json({code: 200, data: results});
    }
  })
})

//注册
router.post('/api/register', (req, res) => {
  const userName = req.body.userName;
  const sql = "select * from users where userName = '"+ userName +"'";
  conn.query(sql,(error, results, fields) => {
    if(error){
      res.json({code: 0, message:'操作失败'});
    }else{
      results = JSON.parse(JSON.stringify(results));
      if(results.length > 0){
        res.json({code: 0, message:'用户名已经存在'});
      }
      else{
        const addSql = 'insert into users(userName,pwd,roles,create_time) values(?,?,?,now())';
        const addSqlParams = [req.body.userName,req.body.pwd,'user'];
        conn.query(addSql,addSqlParams,(error, results, fields) => {
          if(error){
            res.json({code: 0, message:'操作失败'});
          }else{
            results = JSON.parse(JSON.stringify(results));
            res.json({code: 200, message:"注册成功"});
          }
        })
      }
    }
  })
})

//登出
router.get('/api/logout', (req, res) => {
  delete req.session.userId;
  res.json({code: 200, message: '登出成功'});
})

module.exports = router;
