<script setup lang="ts">
import { reactive, toRaw, watch } from 'vue';
import { SettingsKeyAutoDeleteDay, SettingsKeyAutoDelete404, SettingsStorageKey } from '../constants';

const props = defineProps({
  inSetting: {
    type: Boolean
  }
})
const settings = reactive<Record<string, any>>({});

const refreshSettings = () => {
  Object.assign(settings, JSON.parse(localStorage.getItem(SettingsStorageKey) || '{}'));
}

const inputAutoDeleteDay = (e: Event) => {
  const val = parseInt((e.target! as HTMLInputElement).value || "");
  localStorage.setItem(SettingsStorageKey, JSON.stringify({
    ...toRaw(settings),
    [SettingsKeyAutoDeleteDay]: isNaN(val) || val < 1 ? 0 : val
  }));
}

const inputAutoDelete404 = (e: Event) => {
  localStorage.setItem(SettingsStorageKey, JSON.stringify({
    ...toRaw(settings),
    [SettingsKeyAutoDelete404]: (e.target! as HTMLInputElement).checked
  }));
  refreshSettings();
}

watch(() => props.inSetting, (inSetting) => {
  if (inSetting) {
    refreshSettings();
  }
}, {immediate: true});
</script>

<template>
  <div class="settings-container">
    <div>
      自动删除
      <input type="number" min="0" step="1" v-model="settings[SettingsKeyAutoDeleteDay]" @input="inputAutoDeleteDay" @focusout="refreshSettings" />
      天前的记录(默认设置为0则不自动删除)
    </div>
    <div>
      <input type="checkbox" v-model="settings[SettingsKeyAutoDelete404]" @change="inputAutoDelete404" />
      自动删除已失效(404)的记录
    </div>
    <div>
      <a class="github" target="_blank" href="https://github.com/yunyuyuan/jandan-recorder">
        <svg viewBox="0 0 16 16">
          <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"></path>
        </svg>
      </a>
    </div>
  </div>
</template>

<style lang="scss">
.settings-container {
  width: 100%;
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