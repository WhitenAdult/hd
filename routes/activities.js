var express = require('express');
var router = express.Router();

const conn = require('./../db/db');


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

//获取活动列表
router.get('/api/getActsList', (req, res) => {
  let pageSize = req.query.pageSize;
  let pageNum = req.query.pageNum;

  let sqlStr = 'select * from activities limit ' + (pageNum-1)*pageSize +',' + pageSize + ';select count(*) from activities';
  conn.query(sqlStr,(error, results, fields) => {
    if(error){
      res.json({code: 0, message:'获取失败'});
    }else{
      results = JSON.parse(JSON.stringify(results));
      res.json({code: 200, data: results[0], total: results[1][0]['count(*)']});
    }
  })

})

//增加活动
router.post('/api/addActs', (req, res) => {
  const addSql = 'insert into activities(title,content,create_time) values(?,?,now())';
  const addSqlParams = [req.body.title,req.body.content];
  conn.query(addSql,addSqlParams,(error, results, fields) => {
    if(error){
      res.json({code: 0, message:'操作失败'});
    }else{
      results = JSON.parse(JSON.stringify(results));
      res.json({code: 200, data: results});
    }
  })
})

//删除活动
router.get('/api/delete', (req, res) => {
  const id = req.query.id
  const sqlStr = 'delete from activities where actsID = ?';
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

//获取活动详情
router.get('/api/getActInfo', (req, res) => {
  let id = req.query.id

  let sqlStr = "select * from activities where actsID = '" + id + "' LIMIT 1";
  conn.query(sqlStr,(error, results, fields) => {
    if(error){
      res.json({code: 0, message:'获取失败'});
    }else{
      results = JSON.parse(JSON.stringify(results));
      res.json({code: 200, data: results[0]});
    }
  })
})

module.exports = router;
