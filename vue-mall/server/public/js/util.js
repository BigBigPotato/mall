/*
 * Created by yny on 2019/4/24
 */
 exports.createId = function () {
     return String(new Date().getTime()) + Math.round(Math.random() * 10)
 }