import $ from 'jquery'
function getPublicIp(ip){
  $('body').append('<script src="http://whois.pconline.com.cn/ipJson.jsp?ip='+ip+'&callback=getIpCallback"></script>');
}
function install(Vue, options = {}) {
  //权限校验方法
  let permissions;
  //字典缓存
  let dictionary = {};

  let f = function (_this){
    let parent = _this.parentElement;
    if(parent && (parent.nodeName === 'TR')){
      return parent;
    }
    if(parent) {
      return f(parent)
    }
    return null;
  }

  Vue.prototype.$table = {
    watchMultipleCbx: function (rowClass, val,  _this, opts){
      if(!opts){
        opts = {};
      }
      let multipleCbx = opts.multipleCbx || 'multipleCbx';
      let isIndeterminate = opts.isIndeterminate || 'isIndeterminate';
      let tableData = opts.tableData || 'tableData';
      let selectRow = opts.selectRow || 'selectRow';
      let tableRef = opts.tableRef || 'table';
      //未全选点击全选时选中所有
      if(!_this[multipleCbx] && _this[isIndeterminate]){
        _this[isIndeterminate] = false;
        _this.$nextTick(()=>{
          _this[multipleCbx] = true;
        })
        return;
      }
      if(_this.$refs[tableRef]){
        let elm = _this.$refs[tableRef].$el.getElementsByClassName(G.rowClass);
        for(let i=0; i< elm.length; i++){
          if(val){
            elm[i].classList.add('row-selected');
          }else {
            elm[i].classList.remove('row-selected');
          }
        }
        if(val){
          _this[selectRow] = G.copyVal(_this[tableData]);
        }else {
          _this[selectRow] = null;
        }
      }
      _this[isIndeterminate] = false;
    },

    rowClick : function (e, row, _this, opts){
      if(!opts){
        opts = {};
      }
      let multiple = opts.multiple || 'multiple';
      let multipleCbx = opts.multipleCbx || 'multipleCbx';
      let isIndeterminate = opts.isIndeterminate || 'isIndeterminate';
      let tableData = opts.tableData || 'tableData';
      let selectRow = opts.selectRow || 'selectRow';
      //阻止点击穿透
      if(e.target.classList){
        let cls = e.target.classList.toString();
        if(cls.indexOf('el-icon')>-1){
          cls = e.target.parentElement.classList.toString();
        }
        if(cls.indexOf('el-switch__core') > -1){
          return;
        }
        if(cls.indexOf('el-link') > -1){
          return;
        }
        if(cls.indexOf('el-button') > -1){
          return;
        }
      }

      if(_this[multiple] && _this[selectRow] == null){
        _this[selectRow] = [];
      }
      let tr = f(e.target);
      if(tr.classList.toString().indexOf('row-selected') > -1){
        tr.classList.remove('row-selected');
        if(_this[multiple]){
          _this[selectRow].splice(_this[selectRow].findIndex(v => v.id === row.id),1);
        }else {
          _this[selectRow] = null;
        }
      }else {
        if(!_this[multiple]){
          let selectedList = tr.parentNode.getElementsByClassName('row-selected');
          if(selectedList && selectedList.length > 0){
            for(let i=0; i< selectedList.length; i++){
              selectedList[i].classList.remove('row-selected');
            }
          }
          _this[selectRow] = row;
        }else {
          _this[selectRow].push(row);
        }
        tr.classList.add('row-selected');
      }
      if(_this[multiple]){
        if(_this[selectRow] && _this[selectRow].length === _this[tableData].length){
          _this[multipleCbx] = true;
          _this[isIndeterminate] = false;
          return;
        }
        if(_this[selectRow] == null || _this[selectRow].length === 0){
          _this[multipleCbx] = false;
          _this[isIndeterminate] = false;
          return;
        }
        _this[isIndeterminate] = true;
      }
    }
  }

  //解决大部分滚动条问题（单个页面不包含内部多标签页的形式）
  //主题定制
  Vue.mixin({
    data(){
      return {

      }
    },
    computed: {
      $perms(){
        return {
          has: function (code){
            if(permissions && permissions.length > 0){
              return permissions.indexOf(code) > -1;
            }
            let str = localStorage.getItem(G.permissions);
            if(str && str.substring(0,1) === '['){
              permissions = JSON.parse(str);
              return permissions.indexOf(code) > -1;
            }
            return false;
          },
          empty() {
            permissions = []
          }
        }
      },
      $dict(){
        return {
          list: function (dictCode){
            if(dictionary && dictionary.length > 0){
              return dictionary[dictCode];
            }
            let str = localStorage.getItem(G.dictionary);
            if(str && str.substring(0,1) === '{'){
              dictionary = JSON.parse(str);
              return dictionary[dictCode];
            }
          },
          name: function (dictCode, itemCode){
            if(dictionary && dictionary.length > 0 && dictionary[dictCode]){
              let s = dictionary[dictCode].filter(item => item.code == itemCode);
              return s && s.length === 1?s[0].name: '--';
            }
            let str = localStorage.getItem(G.dictionary);
            if(str && str.substring(0,1) === '{'){
              dictionary = JSON.parse(str);
              if(!dictionary[dictCode]){
                return '--';
              }
              let s = dictionary[dictCode].filter(item => item.code == itemCode);
              return s && s.length === 1?s[0].name: '--';
            }
          },
          empty(){
            dictionary = {}
          }
        }
      },
    },
    mounted: function () {
      if (this.$el && $(this.$el).is('div.page-wrapper')) {
        this.scrollMap= {};
        this.scrollSelector=[];
      }
      if (this.scrollMap !== undefined && this.scrollSelector !== undefined &&
          this.scrollMap instanceof Object && this.scrollSelector instanceof Array) {
        setTimeout(() => {
          this.findScroller(this.$el);
        },300)
      }
    },
    activated() {
      if (this.scrollMap !== undefined && this.scrollSelector !== undefined &&
          this.scrollMap instanceof Object && this.scrollSelector instanceof Array) {
        this.triggerScroller();
      }
    },
    deactivated() {
      if (this.scrollMap !== undefined && this.scrollSelector !== undefined &&
          this.scrollMap instanceof Object && this.scrollSelector instanceof Array) {
      }
    },
    methods: {
      $confirm2(text, title){
        return this.$confirm(text, title || '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          closeOnClickModal: false,
          type: 'warning'
        });
      },
      restoreData(){
        Object.assign(this.$data, this.$options.data.call(this))
      },
      findScroller(element){
        let srcMap = {
          'DIV': true,
          'TEXTAREA': true
        };
        if (srcMap[element.nodeName]) {
          $(element).on('scroll',(e) => {
            let $this = $(e.target);
            if (!$this.attr('data-scroll-key')) {
              $this.attr('data-scroll-key', 'UQ' + new Date().getTime());
              this.scrollSelector.push(e.target);
            }
            this.scrollMap[$this.attr('data-scroll-key') + "_TOP"] = $this.scrollTop();
            this.scrollMap[$this.attr('data-scroll-key') + "_LEFT"] = $this.scrollLeft();
          });
        }
        if(element.children) {
          Array.from(element.children).forEach((item, index) => {
            this.findScroller(item)
          });
        }
      },
      triggerScroller(scrollMap){
        if(!scrollMap){
          scrollMap = this.scrollMap;
        }
        this.scrollSelector.forEach((item, index) => {
          if(!$(item).is(":hidden")) {
            let top = scrollMap[$(item).attr('data-scroll-key') + "_TOP"];
            let left = scrollMap[$(item).attr('data-scroll-key') + "_LEFT"];
            //提前加载好，提前执行，可以有效的控制闪的效果
            $(item).scrollTop(top);
            $(item).scrollLeft(left);
            setTimeout(() => {
              $(item).scrollTop(top);
              $(item).scrollLeft(left);
            },100);
          }
        })
      }
    }
  });

  Vue.directive('openSearch', {
    inserted (el, binding) {
      let $moreBtn = $(el).find('.more-view'),
          $searchContent = $(el).find('.search-content');
      let $moreText = $moreBtn.find('.more-text');
      let singleW = 240;
      let rightW = 160;
      let calcLeftWidth = function (){
        let lw = 0;
        let w = $(el).width();
        let num = $(el).find('.el-form-item').length + $(el).find('.w-double').length * 2;
        for(let i =6; i>1; i--){
          if(w > (i * singleW + rightW)){
            lw = i * singleW;
            if(num < i){
              lw = num * singleW;
            }
            if(num <= i){
              $(el).find('.more-view').hide();
              setMore('hide');
            }else{
              $(el).find('.more-view').show()
            }
            return lw;
          }
        }
      }
      let setMore = function (type){
        if(type === 'hide' ){
          $(el).removeClass('open');
          $moreText.text('更多');
          $(el).animate({height:'90px'},100);
        }
        if(type === 'show' ){
          $(el).addClass('open');
          $moreText.text('收起');
          $(el).animate({height:'160px'},100,function (){
            $(el).css({height:'auto'});
          });
        }
      }
      $(window).resize(function (){
        $searchContent.width(calcLeftWidth());
      })
      setTimeout(()=>{
        $searchContent.width(calcLeftWidth());
      })
      if ($moreBtn && $moreBtn.length > 0) {
        $moreBtn[0].addEventListener('click', e => {
          if (!$(el).hasClass('open')) {
            setMore('show');
          }else{
            setMore('hide');
          }
        });
      }
    }
  });

  // v-dialogDrag: 弹窗拖拽
  Vue.directive('dialogDrag', {
    bind(el, binding, vnode, oldVnode) {
      const dialogHeaderEl = el.querySelector('.el-dialog__header');
      const dragDom = el.querySelector('.el-dialog');
      dialogHeaderEl.style.cursor = 'move';
      // 获取原有属性 ie dom元素.currentStyle 火狐谷歌 window.getComputedStyle(dom元素, null);
      const sty = dragDom.currentStyle || window.getComputedStyle(dragDom, null);
      dialogHeaderEl.onmousedown = (e) => {
        // 鼠标按下，计算当前元素距离可视区的距离
        const disX = e.clientX - dialogHeaderEl.offsetLeft;
        const disY = e.clientY - dialogHeaderEl.offsetTop;
        // 获取到的值带px 正则匹配替换
        let styL, styT;
        // 注意在ie中 第一次获取到的值为组件自带50% 移动之后赋值为px
        if (sty.left.includes('%')) {
          styL = +document.body.clientWidth * (+sty.left.replace(/\%/g, '') / 100);
          styT = +document.body.clientHeight * (+sty.top.replace(/\%/g, '') / 100);
        } else {
          styL = +sty.left.replace(/\px/g, '');
          styT = +sty.top.replace(/\px/g, '');
        }
        document.onmousemove = function (e) {
          // 通过事件委托，计算移动的距离
          const l = e.clientX - disX;
          const t = e.clientY - disY;
          // 移动当前元素
          dragDom.style.left = `${l + styL}px`;
          dragDom.style.top = `${t + styT}px`;
          //将此时的位置传出去
          //binding.value({x:e.pageX,y:e.pageY})
        };
        document.onmouseup = function (e) {
          document.onmousemove = null;
          document.onmouseup = null;
        };
      }
    }
  })
}

export {
  getPublicIp
}
export default install
