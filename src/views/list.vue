<script setup lang="ts">
import { inject, reactive, toRaw, watch, readonly, computed, onMounted, UnwrapNestedRefs, Ref } from "vue";
import { ListItem, Settings } from "../types";
import { emitter } from "../utils";
import { OneDay, PushRecordEvent, SettingsKeyAutoDelete404, SettingsKeyAutoDeleteDay, SettingsKeyFoldItem } from "../constants";


const settings = readonly(inject<UnwrapNestedRefs<Settings>>("settings")!);
const inSetting = readonly(inject<Ref<boolean>>("inSetting")!);

const ListStorageKey = "jandan-recorder";

const list = reactive<ListItem[]>([]);
const openedUrls = reactive<Set<string>>(new Set());
const listWithFold = computed(() => {
  if (settings[SettingsKeyFoldItem]) {
    const result: ListItem[] = [];
    for (const item of list) {
      const sameUrlItemIdx = result.findIndex(i => i.url === item.url);
      if (sameUrlItemIdx > -1) {
        const sameUrlItem = result[sameUrlItemIdx];
        sameUrlItem.childrenNum! += 1;
        result.splice(sameUrlItemIdx+sameUrlItem.childrenNum!, 0, { ...item, isChild: true });
      } else {
        result.push({ ...item, childrenNum: 0 });
      }
    }
    return result;
  } else {
    return list;
  }
});

const getListFromStorage = () => {
  list.splice(0, list.length, ...(JSON.parse(localStorage.getItem(ListStorageKey) || "[]") as ListItem[]));
};

const saveList = () => {
  localStorage.setItem(ListStorageKey, JSON.stringify(toRaw(list)));
  getListFromStorage();
};

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
};

const toggleOpened = (url: string) => {
  if (openedUrls.has(url)) {
    openedUrls.delete(url);
  } else {
    openedUrls.add(url);
  }
};

watch(inSetting, (inSetting) => {
  if (!inSetting) {
    getListFromStorage();
  }
});

onMounted(() => {
  getListFromStorage();
  // 处理自动删除，只在进入页面时处理一次
  const now = Date.now();
  const autoDeleteDay = parseInt(settings[SettingsKeyAutoDeleteDay]);

  // 自动删除n天前
  if (typeof autoDeleteDay === "number" && autoDeleteDay > 0) {
    list.splice(0, list.length, ...list.filter(item => {
      return item.timestamp > now - OneDay * autoDeleteDay;
    }));
  }
  saveList();

  // 自动删除404
  if (settings[SettingsKeyAutoDelete404]) {
    const allUrls = new Set(list.map(item => item.url));

    (async () => {
      for (const url of allUrls) {
        const biggest = list.filter(item => item.url === url)
          .map(item => item.lastCheck404 || 0)
          .sort((a, b) => a - b)
          .pop()!;
        if (biggest < now - OneDay) {
          const res = await fetch(url);
          if (res.status === 404) {
            list.splice(0, list.length, ...list.filter(item => {
              return item.url !== url;
            }));
          }
          list.forEach(item => {
            if (item.url === url) {
              item.lastCheck404 = now;
            }
          });
          await (new Promise(resolve => setTimeout(resolve, 1000)));
        }
        saveList();
      }
    })();
  }
});
</script>

<template>
  <div class="table-container">
    <table>
      <thead>
        <tr>
          <th
            v-for="i of ['日期', '类型', '内容', '网址', '操作']"
            :key="i"
          >
            {{ i }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="item, idx of listWithFold"
          :key="item.timestamp"
          :class="{'is-child': item.isChild}"
        >
          <template v-if="!item.isChild || openedUrls.has(item.url)">
            <td>{{ new Date(item.timestamp).toLocaleString() }}</td>
            <td>{{ item.isCreate ? '楼主' : '吐槽' }}</td>
            <td>
              {{ item.content }}
              <template v-if="settings[SettingsKeyFoldItem] && item.childrenNum">
                <br>
                <button @click="toggleOpened(item.url)">
                  {{ openedUrls.has(item.url) ? '收起':'展开' }}{{ item.childrenNum }}条
                </button>
              </template>
            </td>
            <td>
              <a
                target="_blank"
                :href="item.urlWithAnchor || item.url"
              >前往</a>
            </td>
            <td>
              <button @click="removeListItem(idx)">
                删除
              </button>
            </td>
          </template>
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
  border: 1px solid #c1c1c1;
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
    background: rgb(200 200 200);
  }

  tbody {
    tr {
      &.is-child {
        td {
          border-color: transparent;
        }
      }
    }
  }

  tbody td {
    font-size: 14px;
    padding: 8px 0;
    border-top: 1px solid rgb(218 218 218);

    @include pc {
      min-width: 80px;
    }
  }
}
</style>