<template>
  <div v-if="inline" :style="{width: width}" class="inline-tree">
    <div v-if="loading">
      <i class="el-icon-loading"></i> 加载中...
    </div>
    <div class="tree-inline">
      <el-tree v-show="!loading" v-if="!firstLoad" node-key="id" :expand-on-click-node="false"
               :props="{label: 'name',children: 'children',isLeaf: 'leaf'}" ref="tree"
               :load="loadNode" lazy :default-expanded-keys="expandedKeys" @node-click="treeNodeClick">
        <span slot-scope="{ node, data }">
          <span style="font-size: 14px;" :title="node.label">{{ node.label }}</span>
        </span>
      </el-tree>
    </div>
  </div>
  <el-popover v-else v-model="visible" @after-enter="afterEnter" :placement="placement" popper-class="tree-popover-body"
              visible-arrow="true" :width="popoverWidth" trigger="click" :disabled="disabled">
    <div v-if="loading">
      <i class="el-icon-loading"></i> 加载中...
    </div>
    <div class="tree-popover">
      <el-tree v-show="!loading" v-if="!firstLoad" node-key="id" :expand-on-click-node="false"
               :props="{label: 'name',children: 'children',isLeaf: 'leaf'}"
               :load="loadNode" lazy :default-expanded-keys="expandedKeys" @node-click="treeNodeClick">
      </el-tree>
    </div>
    <el-input class="main-input" ref="input" slot="reference" v-model="label" :placeholder="initText || placeholder"
              :size="size"
              :clearable="clearable" @focus="readOnly" @clear="clearInput" :disabled="disabled"
              :style="'width:'+(width?(width.indexOf('px')>0?width:width+'px'):'100%')"></el-input>
  </el-popover>
</template>

<script>
import store from '@/utils/store'
import SysAreaApi from "@/views/admin/sys/area";
export default {
  name: "AreaTreeSelector",
  props: {
    disabled: Boolean,
    clearable: Boolean,
    width: String,
    search: {
      type: Boolean,
      default: false
    },
    //是否内嵌面板而不是选择框
    inline: {
      type: Boolean,
      default: false
    },
    //选中后关闭下拉框
    closeAfterCheck: {
      type: Boolean,
      default: false
    },
    value: {
      type: String,
      default: ''
    },
    name: String,
    areaName: String,
    labelProp: {
      type: String,
      default: 'areaName'
    },
    size: String,
    //是否显示根节点
    rootVisible: {
      type: Boolean,
      default: true
    },
    root: String, //最高级的机构ID，不传是本机构的ID，传入all 这是所有机构。
    placeholder: {
      type: String,
      default: '请选择地区'
    }
  },

  data() {
    return {
      state: store.state,
      loading: '',
      initText: '',
      currentId: '',
      rootId: '',
      firstLoad: true,
      visible: false,
      popoverWidth: 260,
      label: '',
      showRoot: true,
      emptyData: false,
      placement: 'bottom-start',
      treeData: [],
      rootData: {},
      expandedKeys: []
    }
  },
  created() {
    this.rootId = this.root === 'all' ? '1' : this.root;
    if (!this.root) {
      this.rootId = this.state.user.orgAreaId;
    }
    this.showRoot = this.rootVisible;
    if (this.root === 'all') {
      this.showRoot = false;
    }
  },
  mounted() {
    if (this.inline) {
      this.afterEnter();
      return;
    }
    if (this[this.labelProp]) {
      this.label = this[this.labelProp];
    }
    if(this.$refs && this.$refs.input){
      this.popoverWidth = this.$refs.input.$el.clientWidth;
      if (this.popoverWidth < 260) {
        this.popoverWidth = 260;
      }
    }
  },
  watch: {
    name(val) {
      if(this.labelProp === 'name'){
        this.label = val;
      }
    },
    areaName(val) {
      if(this.labelProp === 'areaName'){
        this.label = val;
      }
    }
  },
  methods:{
    afterEnter() {
      if (!this.firstLoad) {
        return;
      }
      this.loading = true;
      this.firstLoad = false;
    },

    loadNode(node, resolve) {
      let id = node.data ? node.data.id : this.rootId;
      if (this.showRoot && node.level === 1) {
        return resolve(this.rootData.children);
      }
      if (this.showRoot && node.level === 0) {
        let opts = G.getHttpOptions();
        opts.data = {id: id}
        opts.callback = data => {
          this.loading = false;
          this.rootData = data;
          console.log(data)
          resolve(data);
          this.expandedKeys = [data.id];
        }
        opts.complete = () => {
          this.loading = false;
        }
        SysAreaApi.getById(opts);
        return;
      }

      let opts = G.getHttpOptions();
      opts.data = {
        pid: id
      }
      opts.callback = data => {
        this.loading = false;
        resolve(data);
        this.$nextTick(()=>{
          if(this.$refs && this.$refs.tree){
            this.$refs.tree.setCurrentKey(this.value);
          }
        })
      }
      opts.complete = () => {
        this.loading = false;
      }
      SysAreaApi.children(opts);
    },
    treeNodeClick(item, node, e) {
      this.checkItem(item)
    },
    checkItem(item) {
      if(this.$refs && this.$refs.tree){
        this.$refs.tree.setCurrentKey(null);
      }
      if (item.id) {
        if(this.inline){
          if(this.value === item.id){
            this.setValue('');
            this.label = '';
            this.$emit('update:name', '')
            this.$emit('update:areaName', '')
            this.$emit('change', {});
            return;
          }
        }
        if(this.$refs && this.$refs.tree){
          this.$refs.tree.setCurrentKey(item.id);
        }
        this.setValue(item.id);
        this.label = item.name;
        this.$emit('update:name', item.name)
        this.$emit('update:areaName', item.areaName)
        this.$emit('change', item);
        if (this.closeAfterCheck) {
          this.visible = false
        }
      }
    },
    clearInput() {
      this.setValue('')
      this.label = ''
      this.$emit('change', {});
    },
    setValue(val) {
      this.$emit('input', val);
    },
    readOnly(e) {
      e.target.blur()
    }

  }

}
</script>
<style>
.tree-popover-body {
  height: 366px;
  overflow: hidden;
}
</style>
<style scoped lang="scss">
::v-deep {
  .main-input .el-input__inner {
    cursor: pointer;
  }
}

.inline-tree {
  height: 100%;
  font-size: 14px;

}
.tree-popover{
  height: 100%;
  overflow: auto;
  margin-bottom: 20px;
}

</style>