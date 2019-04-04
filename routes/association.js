var express = require('express');
var router = express.Router();

const conn = require('./../db/db');


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

//获取社团列表
router.get('/api/getAsssList', (req, res) => {
  let pageSize = req.query.pageSize;
  let pageNum = req.query.pageNum;

  let sqlStr = 'select * from association limit ' + (pageNum-1)*pageSize +',' + pageSize + ';select count(*) from association';
  conn.query(sqlStr,(error, results, fields) => {
    if(error){
      res.json({code: 0, message:'获取失败'});
    }else{
      results = JSON.parse(JSON.stringify(results));
      res.json({code: 200, data: results[0], total: results[1][0]['count(*)']});
    }
  })

})

//增加社团
router.post('/api/addAsss', (req, res) => {
  const addSql = 'insert into association(asssName,create_time) values (?,now())';
  const addSqlParams = [req.body.assName];
  conn.query(addSql,addSqlParams,(error, results, fields) => {
    if(error){
      res.json({code: 0, message:'操作失败'});
    }else{
      results = JSON.parse(JSON.stringify(results));
      res.json({code: 200, data: results});
    }
  })
})

//删除社团
router.get('/api/delete', (req, res) => {
  const id = req.query.id
  const sqlStr = 'delete from association where asssID = ?';
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

//获取社团详情
router.get('/api/getAssInfo', (req, res) => {
  // let userId = req.session.userId;
  let id = req.query.id

  let sqlStr = "select * from association where id = '" + id + "' LIMIT 1";
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