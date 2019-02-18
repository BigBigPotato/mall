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
  /**
   * 增
   * @param {*} collectionName 
   * @param {*} parameter: [
   *    {}
   * ]
   * @param {*} cb 
   */
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
  /**
   * 删
   * @param {*} collectionName 
   * @param {*} parameter: {}
   * @param {*} cb 
   */
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
  /**
   * 更新多条数据
   * @param {*} collectionName 
   * @param {*} updateWhere: {} 
   * @param {*} parameter: {}
   * @param {*} cb 
   */
  updateManyData (collectionName, updateWhere, parameter, cb) {
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
  /**
   * 更新一条数据
   * @param {*} collectionName 
   * @param {*} updateWhere: {} 
   * @param {*} parameter: {
   *    $set: {}
   * }
   * @param {*} cb 
   */
  updateOneData (collectionName, updateWhere, parameter, cb) {
    this.connectSql()
      .then((db) => {
        db.db('mall').collection(collectionName).updateOne(updateWhere, parameter, function (err, res) {
          if (err) throw err
          db.close()
          cb(res)
        })
      })
  },
  /**
   * 查
   * @param {*} params: {
   *  collectionName,
   *  findWhat = {},
   *  backResult = null,
   *  sortParams = null,
   *  page = 0,
   *  limit = 20
   * }
   * @param {*} cb 
   */
  selectData (params, cb) {
    let {
      collectionName,
      findWhat = {},
      backResult = null,
      sortParams = null,
      page = 0,
      limit = 20
    } = params;
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
  },
  /**
   * 左关联查询
   * @param {*} collectionName 
   * @param {*} from：关联集合 
   * @param {*} localField：字段名
   * @param {*} foreignField：关联集合字段名
   * @param {*} as：新生成字段名
   */
  selectDataLeft (collectionName, from, localField, foreignField, as) {
    this.connectSql()
      .then((db) => {
        db.db('mall').collection(collectionName).aggregate([
          {
            $lookup: {
              from,
              localField,
              foreignField,
              as
            }
          }
        ]).toArray(function (err, res) {
          if (err) throw err
          db.close()
          cb(res)
        })
      })
  }
}