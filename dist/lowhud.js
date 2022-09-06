"use strict";
const common = require("./common.js");
const _sfc_main = {
  data() {
    return {
      count: 0
    };
  }
};
const App_vue_vue_type_style_index_0_scoped_dd6865cd_lang = "";
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common.openBlock(), common.createElementBlock("button", {
    onClick: _cache[0] || (_cache[0] = ($event) => $data.count++)
  }, "Count is: " + common.toDisplayString($data.count), 1);
}
const App = /* @__PURE__ */ common._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-dd6865cd"]]);
common.vue.createApp(App).mount("#app");
