<script setup lang="ts">
import { reactive, toRaw, watch } from 'vue';
import { SettingsStorageKey } from '../constants';

const props = defineProps({
  inSetting: {
    type: Boolean
  }
})
const settings = reactive<Record<string, any>>({});

const refreshSettings = () => {
  Object.assign(settings, JSON.parse(localStorage.getItem(SettingsStorageKey) || '{}'));
}

const inputNumber = (e: Event) => {
  const val = parseInt((e.target! as HTMLInputElement).value || "");
  localStorage.setItem(SettingsStorageKey, JSON.stringify({
    ...toRaw(settings),
    'auto-delete-day': isNaN(val) || val < 1 ? 0 : val
  }));
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
      <input type="number" min="0" step="1" v-model="settings['auto-delete-day']" @input="inputNumber" @focusout="refreshSettings" />
      天前的记录(设置为0则不自动删除)
    </div>
  </div>
</template>

<style lang="scss">

</style>