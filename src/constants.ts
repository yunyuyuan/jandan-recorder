import { type Settings } from "./types";

export const InterceptUrls = [
  /**
   * TODO 文章发布: N/A
  */

  /**
   * 创建 问答/树洞/随手拍/无聊图 : /api/comment/create, /jandan-comment.php
    request 
    {
      author: "",
      email: "",
      comment: "",
      comment_post_ID: ""
    }
    response string(id)
   */
  "/api/comment/create", 
  "/jandan-comment.php", 
  /**
   * 楼中回复: /api/tucao/create
    request 
    {
      content: "",
      comment_id?: 5637737, // 树洞id
      comment_post_ID: 102312
    }
    response
    {
      "code": 0,
      "msg": "success",
      "data": {
        "comment_ID": 12039174,
        "comment_author": "xiaoc",
        "comment_content": "祝福！",
        "comment_date": "2024-03-04T15:53:55.267675774+08:00",
        "comment_date_int": 1709538835,
        "comment_post_ID": 5637795,
        "comment_parent": 102312,
        "comment_reply_ID": 0,
        "is_jandan_user": 0,
        "is_tip_user": 0,
        "vote_negative": 0,
        "vote_positive": 0
      }
    }
   */
  "/api/tucao/create", 
  /**
   * BBS发布: /api/forum/posts
    request
    {
      "title": "",
      "content": "",
      "page_id": 112928
    }
    response 
    {
        "code": 0,
        "msg": "success",
        "data": ""
        "post_id": ???
    }
   */
  // TODO "/api/forum/posts", 没有返回id，所以暂时不做
  /**
   * BBS吐槽: /api/forum/replies
    request
    {
      "content": "",
      "post_id": 1282,
      "page_id": 112928
    }
   */
  "/api/forum/replies", 
] as const;

export const OneDay = 1000 * 60 * 60 * 24;
export const ShowModalEvent = 'show-modal' as const;
export const PushRecordEvent = 'push-record' as const;
export const SettingsStorageKey = 'jandan-recorder-settings';

export const SettingsKeyAutoDeleteDay = 'auto-delete-day';
export const SettingsKeyAutoDelete404 = 'auto-delete-404';
export const SettingsKeyFoldItem = 'fold-item';

export const DefaultSettings: Settings = {
  [SettingsKeyAutoDeleteDay]: "0",
  [SettingsKeyAutoDelete404]: false,
  [SettingsKeyFoldItem]: true,
}