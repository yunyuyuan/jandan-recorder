<script setup lang="ts">
import { reactive, ref, toRaw, watch } from 'vue';
import { ListItem } from '../types';
import { emitter } from '../utils';
import { PushRecordEvent, SettingsKeyAutoDelete404, SettingsKeyAutoDeleteDay, SettingsStorageKey } from '../constants';

const props = defineProps({
  inSetting: {
    type: Boolean
  }
})

const ListStorageKey = 'jandan-recorder';

const list = reactive<ListItem[]>([]);
const oneDay = 1000 * 60 * 60 * 24;

const getListFromStorage = () => {
  list.splice(0, list.length, ...(JSON.parse(localStorage.getItem(ListStorageKey) || '[]') as ListItem[]).map(item => {
    return {
      ...item,
      time: new Date(item.timestamp)
    }
  }));
}

const saveList = () => {
  localStorage.setItem(ListStorageKey, JSON.stringify(toRaw(list)));
  getListFromStorage();
}

// 新增
emitter.on(PushRecordEvent, (newItem?: any) => {
  if (!newItem) return;
  list.unshift(newItem);
  saveList();
});

// 移除
const removeListItem = (idx: number) => {
  list.splice(idx, 1);
  saveList();
}
  
const processed = ref(false);

watch(() => props.inSetting, (inSetting) => {
  if (!inSetting) {
    getListFromStorage();
    // 处理自动删除，只在进入页面时处理一次
    if (!processed.value) {
      processed.value = true;
      
      const now = Date.now();
      const settings = JSON.parse(localStorage.getItem(SettingsStorageKey) || '{}');
      const autoDeleteDay = parseInt(settings[SettingsKeyAutoDeleteDay]);
      const autoDelete404 = settings[SettingsKeyAutoDelete404];
      
      // 自动删除n天前
      if (typeof autoDeleteDay === 'number' && autoDeleteDay > 0) {
        list.splice(0, list.length, ...list.filter(item => {
          if (item.time instanceof Date) {
            return item.time.getTime() > now - oneDay * autoDeleteDay;
          }
          return true;
        }));
      }

      // 自动删除404
      if (autoDelete404) {
        const allUrls = new Set(list.map(item => item.url));
        
        (async () => {
          for (const url of allUrls) {
            const res = await fetch(url);
            if (res.status === 404) {
              list.splice(0, list.length, ...list.filter(item => {
                return item.url !== url;
              }));
              saveList();
            }
            await (new Promise(resolve => setTimeout(resolve, 1000)));
          }
        })();
      }
      saveList();
    }
  }
}, {immediate: true});
</script>

<template>
  <div class="table-container">
    <table>
      <thead>
        <tr>
          <th v-for="i of ['日期', '类型', '内容', '网址', '操作']">{{ i }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item,idx of list">
          <td>{{ item.time?.toLocaleString() }}</td>
          <td>{{ item.isCreate ? '自己创建' : '评论吐槽' }}</td>
          <td>{{ item.content }}</td>
          <td>
            <a target="_blank" :href="item.urlWithAnchor || item.url">点击前往</a>
          </td>
          <td>
            <button @click="removeListItem(idx)">删除</button>
          </td>
        </tr>
        <span v-if="list.length === 0">一条都没有，赶快去吐槽吧！</span>
      </tbody>
    </table>
  </div>
</template>

<style lang="scss" scoped>
.table-container {
  overflow: auto;
  flex-grow: 1;
  align-self: stretch;
}
table {
  width: 100%;
  border-collapse: collapse;
  thead {
    border-radius: 12px 12px 0 0;
  }
  thead th { 
    padding: 10px 0;
    font-size: 16px;
    position: sticky; 
    top: 0; 
    z-index: 1; 
    background: rgb(200, 200, 200);
  }
  tbody td {
    font-size: 14px;
    padding: 8px 0;
    border-bottom: 1px solid rgb(218, 218, 218);
    @include pc {
      min-width: 80px;
    }
  }
}
</style>../types