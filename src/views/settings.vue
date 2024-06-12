<script setup lang="ts">
import { UnwrapNestedRefs, inject, onMounted, toRaw } from "vue";
import { SettingsKeyAutoDeleteDay, SettingsKeyAutoDelete404, SettingsKeyFoldItem, SettingsStorageKey, DefaultSettings, SettingsKeyRGBName, SettingsKeyBBSReply } from "../constants";
import { Settings } from "../types";

const version = import.meta.env.jandan_recorder_version_name;
const settings = inject<UnwrapNestedRefs<Settings>>("settings")!;

const refreshSettings = () => {
  Object.assign(settings, {
    ...DefaultSettings,
    ...JSON.parse(localStorage.getItem(SettingsStorageKey) || "{}")
  });
};

const updateSettings = (newSettings: Partial<Settings>) => {
  localStorage.setItem(SettingsStorageKey, JSON.stringify({
    ...toRaw(settings),
    ...newSettings
  }));
};

const inputAutoDeleteDay = (e: Event) => {
  const val = parseInt((e.target! as HTMLInputElement).value || "");
  updateSettings({
    [SettingsKeyAutoDeleteDay]: isNaN(val) || val < 1 ? "0" : val.toString()
  });
};

const inputAutoDelete404 = (e: Event) => {
  updateSettings({
    [SettingsKeyAutoDelete404]: (e.target! as HTMLInputElement).checked
  });
  refreshSettings();
};

const toggleFoldItem = (e: Event) => {
  updateSettings({
    [SettingsKeyFoldItem]: (e.target! as HTMLInputElement).checked
  });
  refreshSettings();
};

const toggleRGBName = (e: Event) => {
  updateSettings({
    [SettingsKeyRGBName]: (e.target! as HTMLInputElement).checked
  });
  refreshSettings();
};

const toggleBBSReply = (e: Event) => {
  updateSettings({
    [SettingsKeyBBSReply]: (e.target! as HTMLInputElement).checked
  });
  refreshSettings();
  alert("刷新网页后生效");
};

onMounted(() => {
  refreshSettings();
});
</script>

<template>
  <div class="settings-container">
    <div title="每次打开网站时检查">
      自动删除
      <input
        v-model="settings[SettingsKeyAutoDeleteDay]"
        type="number"
        min="0"
        step="1"
        @input="inputAutoDeleteDay"
        @focusout="refreshSettings"
      >
      天前的记录(默认设置为0则不自动删除)
    </div>
    <div title="每天自动检查一次">
      <input
        v-model="settings[SettingsKeyAutoDelete404]"
        type="checkbox"
        @change="inputAutoDelete404"
      >
      自动删除已失效(404)的记录
    </div>
    <div title="在同一个贴子下面有多个吐槽，则自动折叠，但依然可以手动展开">
      <input
        v-model="settings[SettingsKeyFoldItem]"
        type="checkbox"
        @change="toggleFoldItem"
      >
      折叠主题相同的项目
    </div>
    <div title="给自己的昵称加上牛逼闪闪的RGB特效">
      <input
        v-model="settings[SettingsKeyRGBName]"
        type="checkbox"
        @change="toggleRGBName"
      >
      🪄<span class="jandan-record-rainbow-text">个人名称RGB特效</span>🪄
    </div>
    <div title="给BBS加上回复按钮，修复楼层显示，气泡显示引用内容">
      <input
        v-model="settings[SettingsKeyBBSReply]"
        type="checkbox"
        @change="toggleBBSReply"
      >
      <span>BBS增强</span>
    </div>
    <div>
      <p>
        <a
          class="github"
          target="_blank"
          href="https://github.com/yunyuyuan/jandan-recorder"
        >
          <svg viewBox="0 0 16 16">
            <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z" />
          </svg>
        </a>
      </p>
      <p>
        当前版本：{{ version }}<span style="color: grey;margin: 0 10px;">|</span><a
          target="_blank"
          href="https://update.greasyfork.org/scripts/488975/%E7%85%8E%E8%9B%8B%E5%90%90%E6%A7%BD%E8%AE%B0%E5%BD%95%E5%99%A8.user.js"
        >检查更新</a>
      </p>
    </div>
  </div>
</template>

<style lang="scss">
.settings-container {
  width: 100%;
  overflow: auto;
  text-align: center;

  > div {
    padding: 20px 0;
    border-bottom: 1px solid gray;
  }

  .github {
    svg {
      height: 30px;
      width: 30px;
    }
  }
}
</style>