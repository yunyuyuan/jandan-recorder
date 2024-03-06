<script setup lang="ts">
import { onMounted, reactive, toRaw, watch } from 'vue';
import { ListItem } from '../types';
import { emitter } from '../utils';
import { PushRecordEvent, SettingsStorageKey } from '../constants';

const props = defineProps({
  inSetting: {
    type: Boolean
  }
})

const StorageKey = 'jandan-recorder';

const list = reactive<ListItem[]>([]);

const refreshList = () => {
  const autoDeleteDay = parseInt(JSON.parse(localStorage.getItem(SettingsStorageKey) || '{}')['auto-delete-day']);
  list.splice(0, list.length, ...(JSON.parse(localStorage.getItem(StorageKey) || '[]') as ListItem[])
    .map(item => {
      return {
        ...item,
        time: new Date(item.timestamp)
      }
    })
    .filter(item => {
      if (item.time instanceof Date && typeof autoDeleteDay === 'number' && autoDeleteDay > 0) {
        return item.time.getTime() > Date.now() - 1000 * 60 * 60 * 24 * autoDeleteDay;
      }
      return true;
    })
  );
}
const saveList = () => {
  localStorage.setItem(StorageKey, JSON.stringify(toRaw(list)));
  refreshList();
}

// 新增
emitter.on(PushRecordEvent, (_, newItem?: ListItem) => {
  if (!newItem) return;
  list.unshift(newItem);
  saveList();
});

// 移除
const removeListItem = (idx: number) => {
  list.splice(idx, 1);
  saveList();
}

watch(() => props.inSetting, (inSetting) => {
  if (!inSetting) {
    refreshList();
    // 列表可能会自动删除，所以保存一次
    saveList();
  }
});
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
            <a target="_blank" :href="item.url">点击前往</a>
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