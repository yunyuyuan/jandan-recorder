import { InterruptUrls } from './constants';
import { initUI } from './ui';
import { StorageItem, storageInit, updateStorage } from './storage';
import { unsafeWindow } from '$';

declare global {
  interface Window {
    [key: string]: any;
  }
}


(() => {
  function getCallback(url: string, requestData: any): (_: any) => any {
    return (res: any) => {
      let item: StorageItem | null = null;
      switch(url) {
        case '/api/comment/create':
          item = {
            url: `/t/${res}`,
            isCreate: true,
            content: requestData.comment,
            timestamp: Date.now() 
          }
          break;
        case '/api/tucao/create':
          if (res.msg == 'success') {
            // 一种特殊情况——在首页文章里的吐槽
            const isPost = unsafeWindow.location.pathname.startsWith('/p/');
            item = {
              url: isPost ? `/p/${requestData.comment_post_ID}#${res.data.comment_ID}` : `/t/${requestData.comment_id}#tucao-${res.data.comment_ID}`,
              isCreate: false,
              content: requestData.content,
              timestamp: Date.now()
            }
          }
          break;
      }
      item && updateStorage(item);
    }
  }

  const $: JQueryStatic | null = unsafeWindow.jQuery || unsafeWindow.$ || null;
  if ($) {
    const originAjax = $.ajax;
    $.ajax = function (settings?: string | JQuery.AjaxSettings): JQuery.jqXHR {
      // 目前煎蛋都是 $.ajax(settings) 来调用的，所以不考虑单独传入 url 的情况
      if (typeof settings == 'object') {
        const url = settings.url! as typeof InterruptUrls[number];
        if (InterruptUrls.includes(url)) {
          const originCallback = settings.success!;
          let requestData = settings.data;
          if (typeof requestData == 'string') {
            const serializedObject: any = {};
            for (const [key, value] of new URLSearchParams(requestData)) {
              serializedObject[key] = value;
            }
            requestData = serializedObject;
          }
          const callback = getCallback(url, requestData);
          settings.success = Array.isArray(originCallback) ? originCallback.splice(0, 0, callback) : [originCallback, callback];
        }
      }
      return originAjax(...arguments);
    }

    if (unsafeWindow.axios) {
      unsafeWindow.axios.interceptors.response.use((response: any) => {
        const requestData: any = {};
        (response.config.data as FormData)?.forEach(function(value, key){
          requestData[key] = value;
        });
        const callback = getCallback(response.config.url, requestData);
        callback(response.data);
        return response;
      });
    }

    initUI();

    storageInit();
  }
})();