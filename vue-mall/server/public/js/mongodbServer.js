const MongoClient = require('mongodb').MongoClient;
const sqlUrl = 'mongodb://localhost:27017/mall';

module.exports = {
  connectSql () {
    //如果不存在数据库，则会创建数据库并建立连接
    return new Promise(function (resolve, reject) {
      MongoClient.connect(sqlUrl, { useNewUrlParser: true }, function (err, db) {
        if (err) {
          reject(err)
        } else {
          resolve(db)
        }
      })
    })
  },
  //增
  insertData (collectionName, parameter, cb) {
    this.connectSql()
      .then((db) => {
        db.db('mall').collection(collectionName).insertMany(parameter, function (err, res) {
          if (err) throw err
          db.close()
          cb(res)
        })
      })
  },
  //删
  deleteData (collectionName, parameter, cb) {
    this.connectSql()
      .then((db) => {
        db.db('mall').collection(collectionName).deleteMany(parameter, function (err, res) {
          if (err) throw err
          db.close()
          cb(res)
        })
      })
  },
  //改
  updateData (collectionName, updateWhere, parameter, cb) {
    this.connectSql()
      .then((db) => {
        db.db('mall').collection(collectionName).updateMany(updateWhere, {
          $set: parameter
        }, function (err, res) {
          if (err) throw err
          db.close()
          cb(res)
        })
      })
  },
  //查
  selectData (params, cb) {
    let {collectionName, findWhat = {}, backResult = null, sortParams = '', page = 0, limit = 20} = params;
    page = Number(page);
    limit = Number(limit);
    this.connectSql()
      .then((db) => {
        let findRes = db.db('mall').collection(collectionName).find(findWhat);
        findRes.count(function (err, num) {
          if (err) throw err
          if (backResult) {
            // 设置返回结果包含字段
            findRes = findRes.project(backResult)
          }
          if (sortParams) {
            // 排序
            findRes = findRes.sort(sortParams)
          }
          if (page) {
            // 分页
            let skipNum = (page - 1) * limit
            findRes = findRes.skip(skipNum).limit(limit)
          }
          findRes.toArray(function (err2, res) {
            if (err2) throw err2
            db.close()
            cb(res, num)
          })
        })
      })
  }
}