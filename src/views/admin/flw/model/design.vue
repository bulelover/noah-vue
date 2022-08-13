<template>
  <div class="page-wrapper">
    <div class="white-box full-height" v-loading="loading">
      <span class="page-title mb16">工作流模型设计（{{view?'查看':this.id?'修改':'新增'}}）</span>
      <!--    <my-process-palette />-->
      <my-process-designer
          :view="view"
          :key="`designer-${reloadIndex}`"
          :options="{
        taskResizingEnabled: true,
        eventResizingEnabled: true,
        minimap: {
          open: true
        }
      }"
          v-model="xmlString"
          v-bind="controlForm"
          keyboard
          ref="processDesigner"
          @element-click="elementClick"
          @element-contextmenu="elementContextmenu"
          @init-finished="initModeler"
          @saveModel="saveModel"
      >
      </my-process-designer>
      <my-properties-panel :key="`penal-${reloadIndex}`" :bpmn-modeler="modeler" :prefix="controlForm.prefix"
                           class="process-panel" :id-edit-disabled="id !== '' && id != undefined"/>
      <!-- demo config -->
<!--      <div class="demo-control-bar">
        <div class="open-model-button" @click="controlDrawerVisible = true"><i class="el-icon-setting"></i></div>
      </div>-->
      <el-drawer :visible.sync="controlDrawerVisible" size="400px" title="偏好设置" append-to-body destroy-on-close>
        <el-form :model="controlForm" size="small" label-width="100px" class="control-form" @submit.native.prevent>
          <el-form-item label="流程ID">
            <el-input v-model="controlForm.processId" @change="reloadProcessDesigner(true)"/>
          </el-form-item>
          <el-form-item label="流程名称">
            <el-input v-model="controlForm.processName" @change="reloadProcessDesigner(true)"/>
          </el-form-item>
<!--          <el-form-item label="流转模拟">
            <el-switch v-model="controlForm.simulation" inactive-text="停用" active-text="启用"
                       @change="reloadProcessDesigner()"/>
          </el-form-item>-->
          <el-form-item label="禁用双击">
            <el-switch v-model="controlForm.labelEditing" inactive-text="停用" active-text="启用"
                       @change="changeLabelEditingStatus"/>
          </el-form-item>
          <el-form-item label="自定义渲染">
            <el-switch v-model="controlForm.labelVisible" inactive-text="停用" active-text="启用"
                       @change="changeLabelVisibleStatus"/>
          </el-form-item>
<!--          <el-form-item label="流程引擎">
            <el-radio-group v-model="controlForm.prefix" @change="reloadProcessDesigner()">
              <el-radio label="camunda">camunda</el-radio>
              <el-radio label="flowable">flowable</el-radio>
              <el-radio label="activiti">activiti</el-radio>
            </el-radio-group>
          </el-form-item>-->
<!--          <el-form-item label="工具栏">
            <el-radio-group v-model="controlForm.headerButtonSize">
              <el-radio label="mini">mini</el-radio>
              <el-radio label="small">small</el-radio>
              <el-radio label="medium">medium</el-radio>
            </el-radio-group>
          </el-form-item>-->
<!--          <el-switch v-model="pageMode" active-text="dark" inactive-text="light" @change="changePageMode"></el-switch>-->
        </el-form>
      </el-drawer>

    </div>
  </div>
</template>

<script>
import translations from "@/translations";
// 自定义渲染（隐藏了 label 标签）
import CustomRenderer from "./custom-renderer";
// 自定义元素选中时的弹出菜单（修改 默认任务 为 用户任务）
import CustomContentPadProvider from "@/components/bpmn/designer/plugins/content-pad";
// 自定义左侧菜单（修改 默认任务 为 用户任务）
import CustomPaletteProvider from "@/components/bpmn/designer/plugins/palette";
import Log from "@/components/bpmn/Log";
// 任务resize
import resizeTask from "bpmn-js-task-resize/lib";
// bpmn theme plugin
import sketchyRendererModule from "bpmn-js-sketchy";
// 小地图
import minimapModule from "diagram-js-minimap";
import UserSql from "./extension/user.json";

// clickoutside
import clickoutside from "element-ui/lib/utils/clickoutside";
import RewriteAutoPlace from "./auto-place/rewriteAutoPlace";
import FlwModelApi from './'
import store from "@/utils/store";

export default {
  directives: {
    clickoutside: clickoutside
  },
  data() {
    return {
      id: "",
      xmlString: "",
      loading: false,
      modeler: null,
      view: false,
      reloadIndex: 0,
      controlDrawerVisible: false,
      infoTipVisible: false,
      pageMode: false,
      translationsSelf: translations,
      controlForm: {
        processId: "",
        processName: "",
        simulation: false,
        labelEditing: false,
        labelVisible: false,
        prefix: "flowable",
        headerButtonSize: "small",
        events: ["element.click", "element.contextmenu"],
        // additionalModel: []
        moddleExtension: {user: UserSql},
        additionalModel: [
          CustomContentPadProvider,
          CustomPaletteProvider,
          minimapModule,
          {
            __init__: ["autoPlaceSelectionBehavior"],
            autoPlace: ["type", RewriteAutoPlace]
          }
        ]
      },
      addis: {
        CustomContentPadProvider,
        CustomPaletteProvider
      }
    };
  },
  mounted() {
    let params = G.getRouterParams(this.$route.params);
    this.id = params.id;
    this.view = !!params.view;
    if(this.id){
      this.loading = true;
      FlwModelApi.getById({
        data: {
          id: this.id
        },
        callback: data => {
          this.xmlString = data.editor
          this.$refs.processDesigner.createNewDiagram(this.xmlString)
          this.idEditDisabled = true
          this.controlForm.processId = data.key
          this.controlForm.processName = data.name
        },
        complete: () => {
          this.loading = false;
        }
      })
    }
  },
  methods: {
    saveModel(xml, that){
      that.saveLoading = true;
      FlwModelApi.save({
        data: {
          id: this.id,
          editor: xml,
        },
        callback: (d,msg) => {
          this.id = msg;
          G._freshParent();
          this.$message.success("保存成功");
        },
        complete: () => {
          that.saveLoading = false;
        }
      })
    },
    initModeler(modeler) {
      setTimeout(() => {
        this.modeler = modeler;
        const canvas = modeler.get("canvas");
        const rootElement = canvas.getRootElement();
        // Log.prettyPrimary("Process Id:", rootElement.id);
        // Log.prettyPrimary("Process Name:", rootElement.businessObject.name);
      }, 10);
    },
    reloadProcessDesigner(notDeep) {
      this.controlForm.additionalModel = [];
      for (let key in this.addis) {
        if (this.addis[key]) {
          this.controlForm.additionalModel.push(this.addis[key]);
        }
      }
      !notDeep && (this.xmlString = undefined);
      this.reloadIndex += 1;
      this.modeler = null; // 避免 panel 异常
    },
    changeLabelEditingStatus(status) {
      this.addis.labelEditing = status ? {labelEditingProvider: ["value", ""]} : false;
      this.reloadProcessDesigner();
    },
    changeLabelVisibleStatus(status) {
      this.addis.customRenderer = status ? CustomRenderer : false;
      this.reloadProcessDesigner();
    },
    elementClick(element) {
      // console.log(element);
      this.element = element;
    },
    elementContextmenu(element) {
      // console.log("elementContextmenu:", element);
    },
    changePageMode(mode) {
      const theme = mode
          ? {
            // dark
            stroke: "#ffffff",
            fill: "#333333"
          }
          : {
            // light
            stroke: "#000000",
            fill: "#ffffff"
          };
      const elements = this.modeler.get("elementRegistry").getAll();
      this.modeler.get("modeling").setColor(elements, theme);
    },
    toggle() {
      // console.log(this.modeler);
      // console.log(this.modeler.get("toggleMode"));
      this.modeler.get("toggleMode").toggleMode();
    }
  }
};
</script>

<style lang="scss">
body {
  overflow: hidden;
  margin: 0;
  box-sizing: border-box;
}

.demo-info-bar {
  position: fixed;
  right: 8px;
  bottom: 108px;
  z-index: 1;
}

.demo-control-bar {
  position: fixed;
  right: 8px;
  bottom: 48px;
  z-index: 1;
}

.open-model-button {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  font-size: 32px;
  background: rgba(64, 158, 255, 1);
  color: #ffffff;
  cursor: pointer;
}

.zoom-in-right-enter-active,
.zoom-in-right-leave-active {
  opacity: 1;
  transform: scaleY(1) translateY(-48px);
  transition: all 300ms cubic-bezier(0.23, 1, 0.32, 1);
  transform-origin: right center;
}

.zoom-in-right-enter,
.zoom-in-right-leave-active {
  opacity: 0;
  transform: scaleX(0) translateY(-48px);
}

.info-tip {
  position: absolute;
  width: 480px;
  top: 0;
  right: 64px;
  z-index: 10;
  box-sizing: border-box;
  padding: 0 16px;
  color: #333333;
  background: #f2f6fc;
  transform: translateY(-48px);
  border: 1px solid #ebeef5;
  border-radius: 4px;

  &::before,
  &::after {
    content: "";
    width: 0;
    height: 0;
    border-width: 8px;
    border-style: solid;
    position: absolute;
    right: -15px;
    top: 50%;
  }

  &::before {
    border-color: transparent transparent transparent #f2f6fc;
    z-index: 10;
  }

  &::after {
    right: -16px;
    border-color: transparent transparent transparent #ebeef5;
    z-index: 1;
  }
}

.control-form {
  .el-radio {
    width: 100%;
    line-height: 32px;
  }
}

.element-overlays {
  box-sizing: border-box;
  padding: 8px;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 4px;
  color: #fafafa;
}

</style>
