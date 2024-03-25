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
  </div>
</template>

<style lang="scss">
.settings-container {
  width: 100%;
  > div {
    padding: 20px 0;
    border-bottom: 1px solid gray;
  }
}
</style>