"use strict";
const common = require("./common.js");
const _sfc_main = {
  data() {
    return {
      count: 0
    };
  }
};
const App_vue_vue_type_style_index_0_scoped_7d449671_lang = "";
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Button = common.resolveComponent("Button");
  return common.openBlock(), common.createElementBlock(common.Fragment, null, [
    common.createVNode(_component_Button, {
      onClick: _cache[0] || (_cache[0] = ($event) => $data.count++)
    }, {
      default: common.withCtx(() => [
        common.createTextVNode("Count is: " + common.toDisplayString($data.count), 1)
      ]),
      _: 1
    }),
    common.createVNode(_component_Button, {
      onActivate: _cache[1] || (_cache[1] = ($event) => $data.count++),
      class: "Red"
    }, {
      default: common.withCtx(() => [
        common.createTextVNode(common.toDisplayString($data.count), 1)
      ]),
      _: 1
    })
  ], 64);
}
const App = /* @__PURE__ */ common._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-7d449671"]]);
common.vue.createApp(App).mount("#app");
