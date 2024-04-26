<script setup lang="ts">
import { ShowModalEvent } from '../constants';
import { emitter } from '../utils';
import ListComp from './list.vue';
import SettingsComp from './settings.vue';
import { inject, ref } from 'vue';

const inSetting = inject<boolean>("inSetting")!;

const showModal = ref(false);

emitter.on(ShowModalEvent, () => {
  showModal.value = true;
})

const close = () => {
  showModal.value = false;
}
</script>

<template>
  <div v-show="showModal" id="jandan-recorder-modal" @mousedown="showModal = false">
    <div class="inner" @mousedown="(e) => e.stopPropagation()">
      <div class="header">
        <button class="switcher" @click="inSetting = !inSetting">{{ inSetting ? '返回列表(设置会自动保存)' : '前往设置' }}</button>
        <span class="close" @click="close()">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 21L12 12M12 12L3 3M12 12L21.0001 3M12 12L3 21.0001" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </span>
      </div>
      <list-comp v-show="!inSetting" />
      <settings-comp v-show="inSetting" />
    </div>
  </div>
</template>

<style lang="scss">
#jandan-recorder-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 99999;
  background: rgba(0, 0, 0, .6);
  .inner {
    background: white;
    color: black;
    @include pc {
      min-width: 400px;
    }
    width: 70%;
    @include mobile {
      width: 90%;
    }
    height: calc(100% - 100px);
    margin: auto;
    margin-top: 50px;
    padding: 10px;
    border-radius: 12px;
    box-shadow: 0 0 12px rgba(0, 0, 0, 0.2);
    display: flex;
    align-items: center;
    flex-direction: column;
  }
  
  .header {
    position: relative;
    margin-bottom: 10px;
    width: 100%;
    .switcher {
      font-size: 15px;
      padding: 4px 8px;
      margin: auto;
    }
    .close {
      position: absolute;
      right: 0;
      cursor: pointer;
      svg {
        stroke: black;
        width: 25px;
        height: 25px;
      }
      &:hover {
        svg {
          stroke: red;
        }
      }
    }
  }
}
</style>