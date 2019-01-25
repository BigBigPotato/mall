const MongoClient = require('mongodb').MongoClient;
const sqlUrl = 'mongodb://localhost:27017/mall';

module.exports = {
  connectSql (nextStep) {
    //如果不存在数据库，则会创建数据库并建立连接
    MongoClient.connect(sqlUrl, function (err, db) {
      if (err) throw err
      let dbase = db.db('mall')
      nextStep(dbase)
    })
  },
  //增
  insertData (collectionName, parameter) {
    this.connectSql(function (mallDB) {
      mallDB.collection(collectionName).insertMany(parameter, function (err, res) {
        if (err) throw err
        mallDB.close()
        return res
      })
    })
  },
  //删
  deleteData (collectionName, parameter) {
    this.connectSql(function (mallDB) {
      mallDB.collection(collectionName).deleteMany(parameter, function (err, res) {
        if (err) throw err
        mallDB.close()
        return res
      })
    })
  },
  //改
  updateData (collectionName, updateWhere, parameter) {
    this.connectSql(function (mallDB) {
      mallDB.collection(collectionName).updateMany(updateWhere, {
        $set: parameter
      }, function (err, res) {
        if (err) throw err
        mallDB.close()
        return res
      })
    })
  },
  //查
  findData (collectionName, findWhat = {}, sortParams, page, limit = 20) {
    this.connectSql(function (mallDB) {
      let findRes = mallDB.collection(collectionName).find(findWhat);
      if (sortParams) {
        findRes = findRes.sort(sortParams)
      }
      if (page) {
        let skipNum = (page - 1) * limit
        findRes = findRes.skip(skipNum).limit(limit)
      }
      findRes.toArray(function (err, res) {
        if (err) throw err
        mallDB.close()
        return res
      })
    })
  }
}