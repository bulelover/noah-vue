//表单校验函数
const validate = {
  checkPhone : function (rule, value, callback){
    if(g.isEmpty(value)){callback();return;}
    //座机号码
    let tel = /^(0d{2,3})-?(d{7,8})$/;
    //手机号码  严格规则 /^(13[0-9]|14[01456879]|15[0-3,5-9]|16[2567]|17[0-8]|18[0-9]|19[0-3,5-9])d{8}$/
    let phone = /^(1[0-9][0-9])d{8}$/;
    if(phone.test(value)) {
      callback()
    }else if(tel.test(value)){
      callback()
    }else {
      callback(new Error("请输入正确的电话号码"))
    }
  }
}

export default validate;