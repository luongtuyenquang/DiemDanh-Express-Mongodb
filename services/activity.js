var noti=require('../models/model_noti');
var event=require('../models/module_event');
var diemdanh=require('../models/model_diemdanh');
var infoAc=require('../models/model_infoActivity')
var students=require('../models/model_student');
//----------------------Activity Teacher--------------------------------- 
module.exports.createNewActivity = async function (i){
    let act = new noti(i);
    await act.save({}, err => {
      if(err) throw err;
    });
  }
  module.exports.getAllMyActivities = async function (a) {
    let all = await infoAc.find({MSGV: a});
    return all;
  }
  module.exports.isCodeNotExist_code = async function (c,a) {
    let countall = await noti.find({IDHoatDong: c,MSGV:a}).count();
    if(countall > 0) return null;
    return c;
  }
 module.exports.findNameEvent=function(c){
   let all=event.find({TenSuKien:c})
   return all;
 }
 //Work in student
 module.exports.getListJoin=function(c){
  let all=event.find({MSGV:c})
  return all;
}
module.exports.delActByCode=async function(c,a){

  let act=await infoAc.findOneAndDelete({IDHoatDong:c,MSGV:a});
  let actInfoActi=await noti.deleteMany({IDHoatDong:c,MSGV:a});
  if(act)return act.TenSuKien;
  return null;
}
module.exports.GetActStudent=async function(c,a){
  let all=await noti.find({MSSV:c});
  return all;
}
//Find student join
module.exports.findStudentJoin=async function(c,a){
  let all=await diemdanh.find({MSGV:c,ThoiGian:a});
  return all;
}
//Export to excel
module.exports.exportExcel=async function(c){
  let all=await diemdanh.find({IDHoatDong:c});
  return all;
}
//Refesh student điểm danh
module.exports.refresh=async function(c){
  let all=await diemdanh.find({IDHoatDong:c});
  return all;
}


//----------------------Activity Student--------------------------------- 
//Check student đã điểm danh chưa
module.exports.checkDone=async function(code,id,ten,thoigian){
  let all=await diemdanh.find({IDHoatDong:code,MSSV:id,TenSuKien:ten,ThoiGian:thoigian});
  return all;
}
module.exports.findNoti =async function (code) {
  let all =await noti.findOne({IDHoatDong: code});
  return all;
}
module.exports.findNameStudent=async function (name){
  let all=await students.findOne({MSSV:name});
  return all;
}