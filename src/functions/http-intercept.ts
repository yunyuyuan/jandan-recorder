import { AjaxSuccessEvent, InterceptUrls, PushRecordEvent } from "../constants";
import { ListItem } from "../types";
import { _window, emitter } from "../utils";

function processResponse(url: typeof InterceptUrls[number], requestData: any, res: any) {
  let item: ListItem | null = null;
  const now = Date.now();
  switch(url) {
    case "/jandan-comment.php":
    case "/api/comment/create":
      item = {
        url: `/t/${res}`,
        urlWithAnchor: `/t/${res}`,
        isCreate: true,
        content: requestData.comment,
        timestamp: now,
        lastCheck404: now,
      };
      break;
    case "/api/tucao/create":
      if (res.msg == "success") {
        // 一种特殊情况——在首页文章里的吐槽
        const isPost = _window.location.pathname.startsWith("/p/");
        item = {
          url: isPost ? `/p/${requestData.comment_post_ID}` : `/t/${requestData.comment_id}`,
          urlWithAnchor: isPost ? `/p/${requestData.comment_post_ID}#${res.data.comment_ID}` : `/t/${requestData.comment_id}#tucao-${res.data.comment_ID}`,
          isCreate: false,
          content: requestData.content,
          timestamp: now,
          lastCheck404: now,
        };
      }
      break;
    case "/api/forum/replies":
      if (res.msg == "success") {        
        item = {
          url: `/bbs#/topic/${requestData.post_id}`,
          urlWithAnchor: `/bbs#/topic/${requestData.post_id}`,
          isCreate: false,
          content: requestData.content,
          timestamp: now,
          lastCheck404: now,
        };
      }
      break;
  }
  item && emitter.emit(PushRecordEvent, item);
}

function parseRequestData(requestData: any) {
  let result = requestData;
  const parsedObj: any = {};
  if (typeof requestData == "string") {
    try {
      return JSON.parse(requestData);
    } catch {
      for (const [key, value] of new URLSearchParams(requestData)) {
        parsedObj[key] = value;
      }
      result = parsedObj;
    }
  } else if (requestData instanceof FormData) {
    requestData.forEach(function(value, key){
      parsedObj[key] = value;
    });
    result = parsedObj;
  }
  return result;
}

export default function initHttpInterception() {
  if ($) {
    $(document).on("ajaxSuccess", function(_event: any, _jqXHR: JQuery.jqXHR, settings: JQuery.AjaxSettings, data: any) {
      try {
        emitter.emit(AjaxSuccessEvent);
        const url = settings.url! as any;
        if (InterceptUrls.includes(url)) {
          processResponse(url, parseRequestData(settings.data), data);
        }
      } catch {/* empty */}
    });

  }

  if (_window.axios) {
    _window.axios.interceptors.response.use((response: any) => {
      try {
        emitter.emit(AjaxSuccessEvent);
        processResponse(response.config.url, parseRequestData(response.config.data), response.data);
      } catch {/* empty */}
      return response;
    });
  }
}