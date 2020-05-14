var passport=require('passport')
const flash = require('connect-flash');
var serviceNoti=require('../services/noti.js');
var noti=require('../models/model_noti');
var event=require('../models/module_event');
var infoAc=require('../models/model_infoActivity')
const Excel = require('exceljs');
var mongoXlsx = require('mongo-xlsx');

module.exports.getLogin = function (req, res) {
 if(req.isAuthenticated('local-teacherLogin')&&req.user.LoaiTaiKhoan=="Giao Vien"){
  return res.render('./teacher_views/teacher');
 }
 if(req.isAuthenticated('local-studentLogin')&&req.user.LoaiTaiKhoan=="Sinh Vien"){
  return res.redirect('/student');
 }
 else{
  req.flash('error', 'Vui lòng đăng nhập lại');
 return   res.redirect('/');
 }
}
module.exports.postLogin = passport.authenticate('local-teacherLogin', {
    successRedirect : '/teacher_tructiep',
    failureRedirect : '/',
    failureFlash : true
  });

module.exports.logOut=async function(req,res){
  req.session.destroy(function (err) {
    res.redirect('/'); //Inside a callback… bulletproof!
  });
}
  
//Check auth
module.exports.isNotLogin_next = async function (req, res, next) {
  if (!req.isAuthenticated('local-teacherLogin')) return next();
  if(req.isAuthenticated('local-teacherLogin')) return next();
}

module.exports.isLogined_next = async function (req, res, next) {
  if (req.isAuthenticated('local-teacherLogin')) return next();
  return res.redirect('/');
}

//Work noti
module.exports.postCreateActivity = async function(req, res) {
  let name=req.body.name;
  let datetime=req.body.time;
  let lop=req.body.lop;
  let hocky=req.body.hocki;
  let checkNameEvent=serviceNoti.findNameEvent(name);
  if(checkNameEvent==null)
  {
    req.flash("Tên sự kiện không phù hợp")
  return res.redirect('/teacher_tructiep');
  }
  else{
      infoAc.insertMany({
      IDHoatDong:removeCharInStr('-',req.body.code),
      TenSuKien:name,
      Lop:lop,
      HocKy:hocky,
      ThoiGian:datetime,
      MSGV:req.user.IDTaiKhoan})
    // console.log(re[i].MSSV);
    
    // noti.insertMany(info);
    event.find({TenSuKien:name},(err,result)=>{
      result.forEach(element=>{
        //
        let info = {
          IDHoatDong: removeCharInStr('-',req.body.code),
          TenSuKien:name,
          Lop:lop,
          HocKy:hocky,
          ThoiGian:datetime,
          MSGV:req.user.IDTaiKhoan,
          MSSV:element.MSSV
        };
        noti.insertMany(info);
      })
    })
  }
  return  res.redirect('/teacher_tructiep');
}
module.exports.getHome = async function (req, res) {

  let activities = await serviceNoti.getAllMyActivities(req.user.IDTaiKhoan);
  let listJoin=await serviceNoti.getListJoin(req.user.IDTaiKhoan);
  return res.render('./teacher_views/teacher_tructiep', {
    user: req.user,
    act: activities,
    listStudent:listJoin,
    mess: req.flash('mess'),
    
   // actRD: activitiesReady
  });
}
module.exports.AJAX_createNewCodeAct = async function (req, res) {
  let now = new Date();
  let code = add0(now.getDate())+add0(now.getMonth()+1)+''+now.getFullYear()+''+randomNum(4)+''+randomNum(4);
  var check;
  do {
    check = await serviceNoti.isCodeNotExist_code(code,req.user.IDTaiKhoan);
  } while (!check);
  return res.send(check);
}


module.exports.AJAX_delActByCode=async function(req,res){
  let c=req.query.c;
  let i=await serviceNoti.delActByCode(c,req.user.IDTaiKhoan);
  console.log(i);
  return res.send(i);
}

module.exports.AJAX_reloadAct=async function(req,res){
  let a=await serviceNoti.getAllMyActivities(req.user.MSGV);
  return res.send(a);
}
//Export DiemDanh to excel
module.exports.AJAX_saveExcel=async function(req,res){

  var all=await serviceNoti.exportExcel(c);
  var workbook = new Excel.Workbook();

    // Some information about the Excel Work Book.
    workbook.creator = 'Mayank Sanghvi';
    workbook.lastModifiedBy = '';
    workbook.created = new Date().getTime();;
    workbook.modified = new Date();


    // Create a sheet
    var sheet = workbook.addWorksheet('Sheet1');
    // A table header
    sheet.columns = [
        { header: 'Id', key: 'IDHoatDong' },
        { header: 'Tên Hoạt động', key: 'TenSuKien' },
        { header: 'Thời Gian', key: 'ThoiGian' },
        { header: 'Họ Và Tên', key: 'HoVaTen' },
    ]

    // Add rows in the above header
    sheet.addRow({id: 1, course: 'HTML', url:'https://vlemonn.com/tutorial/html' });
    sheet.addRow({id: 2, course: 'Java Script', url: 'https://vlemonn.com/tutorial/java-script'});
    sheet.addRow({id: 3, course: 'Electron JS', url: 'https://vlemonn.com/tutorial/electron-js'});
    sheet.addRow({id: 4, course: 'Node JS', url: 'https://vlemonn.com/tutorial/node-js'});

    // Save Excel on Hard Disk
    workbook.xlsx.writeFile("My First Excel.xlsx")
    .then(function() {
       
    });
  


  
  
}
function randomNum(num) {
  var result           = '';
  var characters       = '0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < num; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function add0(n) {return (n<=9)?'0'+n:n;}
function removeCharInStr(c,s){
  var o='';
  for(var i=0;i<s.length;i++)
  o+=(s[i]!=c)?s[i]:'';
  return o;}