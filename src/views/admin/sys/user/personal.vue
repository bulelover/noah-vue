<template>
  <div class="page-wrapper">
    <div class="white-box mga" v-loading="loading" style="width: 900px;">
      <span class="page-title mb16">个人头像</span>
      <div style="padding-left: 120px">
        <img v-if="imageUrl" :src="imageUrl" class="avatar" alt="头像" style="float: left;">
        <el-button type="primary" style="margin-left: 16px;" @click="visible = true">修改头像</el-button>
        <div style="clear: both;"></div>
      </div>
      <span class="page-title mb16 mt32">基本信息</span>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px" style="width: 800px;">
        <el-form-item class="w-ib w-50" label="登录名" prop="loginName">
          <el-input v-model="form.loginName" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item class="w-ib w-50" label="真实姓名" prop="realName"maxlength="30">
          <el-input v-model="form.realName" placeholder="请输入真实姓名"></el-input>
        </el-form-item>
        <el-form-item class="w-ib w-50" label="性别" prop="sex">
          <el-radio-group v-model="form.sex">
            <el-radio v-for="item in $dict.list('sys-gender')" :key="item.code" :label="item.code">{{item.name}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item class="w-ib w-50" label="联系电话" prop="phone" maxlength="20" :rules="[]">
          <el-input v-model="form.phone" placeholder="请输入真实姓名"></el-input>
        </el-form-item>
        <el-form-item class="w-ib w-50" label="身份证号" prop="idNo" maxlength="20" :rules="[]">
          <el-input v-model="form.idNo" placeholder="请输入身份证号"></el-input>
        </el-form-item>
        <el-form-item class="w-ib w-50" label="岗位" prop="position">
          <el-input v-model="form.position" placeholder="请输入岗位"></el-input>
        </el-form-item>
        <el-form-item class="w-ib w-50" label="邮箱" prop="mail">
          <el-input v-model="form.mail" maxlength="50" placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <el-form-item class="w-ib w-50" label="状态" prop="state">
          <el-switch v-model="form.state" active-text="正常" inactive-text="锁定" active-value="1"
                     inactive-value="0"></el-switch>
        </el-form-item>
        <el-form-item>
          <el-button :disabled="loading" type="primary" @click="save" :loading="saveLoading">保存</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-dialog title="头像上传"
               :append-to-body="true"
               width="880px"
               :visible.sync="visible"
               :close-on-click-modal="false"
               :close-on-press-escape="false"
               v-dialog-drag>
      <div class="avatar-uploader form-container same-padding">
        <div style="height: 380px;position: relative;">
          <vue-cropper style="width: 600px;"
                       ref="cropper"
                       :img="option.img"
                       :outputSize="option.size"
                       :outputType="option.outputType"
                       :info="true"
                       :full="option.full"
                       :canMove="option.canMove"
                       :canScale="option.canScale"
                       :canMoveBox="option.canMoveBox"
                       :fixed="option.fixed"
                       :fixedNumber="option.fixedNumber"
                       :fixedBox="option.fixedBox"
                       :original="option.original"
                       :autoCrop="option.autoCrop"
                       :autoCropWidth="option.autoCropWidth"
                       :autoCropHeight="option.autoCropHeight"
                       :centerBox="option.centerBox"
                       :high="option.high"
                       :infoTrue="option.infoTrue"
                       :enlarge="option.enlarge"
                       @realTime="realTime">
          </vue-cropper>
          <div class="head-img-preview first" :style="previewStyle1" alt="预览1"></div>
          <div class="head-img-preview last" :style="previewStyle2" alt="预览2"></div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <input id="uploads" type="file" title="" style="display: none;"
               accept="image/png, image/jpeg, image/gif, image/jpg"
               @change="uploadImg"/>
        <label class="el-button el-button--primary el-button--medium" style="vertical-align: top;" for="uploads">上传头像</label>
        <el-button type="primary" @click="rotateImg(false)" icon="el-icon-refresh-left"></el-button>
        <el-button type="primary" @click="rotateImg(true)" icon="el-icon-refresh-right"></el-button>
        <el-button type="primary" @click="saveImg" :loading="saveImgLoading">提交头像</el-button>
        <el-button :disabled="saveImgLoading" @click="visible = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import SysUserApi from './'
import store from '@/utils/store'
import { VueCropper }  from 'vue-cropper'
export default {
  components: {
    VueCropper
  },
  data() {
    return {
      visible: false,
      loading: false,
      saveLoading: false,
      saveImgLoading: false,
      rules:{
        loginName: [{required:true, trigger: 'blur', message: '不能为空'}],
        realName: [{required:true, trigger: 'blur', message: '不能为空'}],
        phone: [{validator: this.$valid.checkPhone, trigger: 'blur'}]
      },
      state: store.state,
      imageUrl: '',
      form: {
        id: '',
        loginName: '',
        realName: '',
        sex: '',
        phone: '',
        position: '',
        mail: '',
        idNo: '',
        state: '1'
        // orderBy: 10,
      },
      previewStyle1: {
        backgroundImage: '',
      },
      previewStyle2: {
        backgroundImage: '',
      },
      option: {
        img: "", // 裁剪图片的地址  空 url 地址 || base64 || blob
        outputSize: 1, // 裁剪生成图片的质量 1 0.1 - 1
        outputType: "jpeg", //  裁剪生成图片的格式 jpg (jpg 需要传入jpeg)  jpeg || png || webp
        info: true, //  裁剪框的大小信息  true  true || false
        canScale: true, // 图片是否允许滚轮缩放  true  true || false
        autoCrop: true, //是否默认生成截图框 false true || false
        autoCropWidth: 200, //默认生成截图框宽度 容器的80%  0~max
        autoCropHeight: 200, //默认生成截图框高度  容器的80%  0~max
        fixed: true, //是否开启截图框宽高固定比例  true  true | false
        fixedNumber: [1, 1], //截图框的宽高比例 [1, 1]  [宽度, 高度]
        full: false, //是否输出原图比例的截图  false true | false
        fixedBox: false, //固定截图框大小 不允许改变  false true | false
        canMove: false, //上传图片是否可以移动  true  true | false
        canMoveBox: true, //截图框能否拖动 true  true | false
        original: false, //上传图片按照原始比例渲染 false true | false
        centerBox: true, //截图框是否被限制在图片里面  false true | false
        high: true, //是否按照设备的dpr 输出等比例图片  true  true | false
        infoTrue: true, //true 为展示真实输出图片宽高 false 展示看到的截图框宽高 false true | false
        maxImgSize: 2000, //限制图片最大宽度和高度 2000  0-max
        enlarge: 1, //图片根据截图框输出比例倍数 1 0-max(建议不要太大不然会卡死的呢)
        mode: "contain" //图片默认渲染方式  contain contain , cover, 100px, 100% auto
      },
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init(){
      this.loading = true;
      SysUserApi.getById({
        data: {
          id: this.state.user.id
        },
        callback: d => {
          this.form = d;
          this.imageUrl = this.$api.preview(d.headImgPath)
        },
        complete: () => {
          this.loading = false;
        }
      });
    },
    save() {
      let opts = {
        data: this.form,
        callback: (d, msg) => {
          this.$message.success(msg);
        },
        complete: () => {
          this.saveLoading = false;
        }
      };
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.saveLoading = true;
          SysUserApi.savePersonalInfo(opts);
        } else {
          return false
        }
      })
    },
    rotateImg(isRight){
      if(isRight){
        this.$refs.cropper.rotateRight();
      }else{
        this.$refs.cropper.rotateLeft();
      }
    },
    saveImg() {
      if(this.option.img === ""){
        this.$message.warning("请先上传图片！");
        return;
      }
      this.$refs.cropper.getCropBlob(data => {
        data.name = "HeadImg_"+new Date().getTime()+"." + this.option.outputType;
        data.lastModifiedDate = new Date();
        this.saveImgLoading = true;
        let file = new window.File([data], data.name, {type: this.option.outputType})
        // 拿到上传的文件
        let formData = new FormData();
        // 创建一个表单数据
        formData.append("file", file);
        formData.append("linkName", "用户头像");
        formData.append("single", "1");
        formData.append("linkId", this.state.user.id);
        this.$api.upload({
          data: formData,
          // onUploadProgress:e=> {
          //   console.log(Math.floor(e.loaded / e.total * 100))
          //   // 上传进度
          //   // this.pre = Math.floor(e.loaded / e.total * 100);// e.loaded 已经上传的字节数据，e.total 字节数据  转换为1-100的比例值 赋值个pre
          // },
          callback: (res, msg) => {
            SysUserApi.saveHeadImg({
              data: {
                id: this.state.user.id,
                imgId: res.id
              },
              callback: (d, msg) => {
                this.state.user.headImgPath = res.id;
                this.imageUrl = this.$api.preview(res.id)
                this.$message.success(msg);
                this.visible = false;
              },
              complete: () => {
                this.saveImgLoading = false;
              }
            });
          },
          failure: e => {
            this.saveImgLoading = false;
          }
        });
      })
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 20;
      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 20MB!');
      }
      return isJPG && isLt2M;
    },
    uploadImg(e){
      let file = e.target.files[0];
      this.$tools.getBase64(file, (imgUrl) => {
        this.option.img = imgUrl;
      });
    },
    realTime(data) {
      this.$refs.cropper.getCropBlob(data => {
        // do something
        this.$tools.getBase64(data, (imgUrl) => {
          this.previewStyle1.backgroundImage = "url(\""+imgUrl+"\")";
          this.previewStyle2.backgroundImage = "url(\""+imgUrl+"\")";
        });
      })
    }
  }
}
</script>

<style scoped lang="scss">
  .avatar-uploader ::v-deep .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader ::v-deep .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
  .head-img-preview{
    position: absolute;
    background-position-x: 1px;
    background-position-y: 1px;
    background-size: cover;
  }
  .head-img-preview.first{
    right: 6px;
    top : 0;
    width: 180px;
    height: 180px;
    border: 1px solid #DEDEDE;
  }
  .head-img-preview.last{
    width: 180px;
    height: 180px;
    right: 6px;
    top : 200px;
    border: 1px solid #DEDEDE;
    border-radius: 50%;
  }
</style>
