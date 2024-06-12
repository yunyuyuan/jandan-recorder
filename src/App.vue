<script setup lang="ts">
import { onMounted, provide, reactive, ref, watch } from "vue";
import ModalComp from "./views/modal.vue";
import { AjaxSuccessEvent, DefaultSettings, SettingsKeyBBSReply, SettingsKeyRGBName, SettingsStorageKey } from "./constants";
import { _window, emitter } from "./utils";
import { addMyLink, initBBSReplyTooltipListener, postProcessBBSReplies } from "./functions/bbs";
import { addRGB, rmRGB } from "./functions/rgb-name";
import debounce from "lodash/debounce";
import initHttpInterception from "./functions/http-intercept";

const settings = reactive({
  ...DefaultSettings,
  ...JSON.parse(localStorage.getItem(SettingsStorageKey) || "{}")
});
const userData = reactive<{
  id?: number,
  nickname?: string,
  username?: string
}>({});

provide("settings", settings);
provide("inSetting", ref(false));
provide("userData", userData);

const documentMutation = debounce(() => {
  addMyLink(userData);
  if (settings[SettingsKeyRGBName]) {
    setTimeout(() => {
      addRGB(userData.nickname);      
    });
  }
}, 200);

watch(settings, ({[SettingsKeyRGBName]: rgbEnabled}) => {
  if (!rgbEnabled) {
    rmRGB();
  } else {
    addRGB(userData.nickname);
  }
});

onMounted(() => {
  // 获取登录用户信息
  fetch("/api/member/get_info").then(res => {
    if (res.ok) {
      res.json().then(res => {
        if (res.data?.id) {
          Object.assign(userData, res.data);
        }
      });
    }
  });

  emitter.on(AjaxSuccessEvent, documentMutation);
  const observer = new MutationObserver(documentMutation);
  observer.observe(document.body, { childList: true, subtree: true });

  documentMutation();
  initHttpInterception(settings[SettingsKeyBBSReply]);
  if (settings[SettingsKeyBBSReply]) {
    initBBSReplyTooltipListener();
    postProcessBBSReplies();
  }
});
</script>

<template>
  <modal-comp />
</template>