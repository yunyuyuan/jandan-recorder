import { _window } from "../utils";

export const addRGB = (nickname?: string) => {
  getAllNickNameEl().forEach(el => {
    if (el.innerText == nickname) {
      el.classList.add("jandan-record-rainbow-text");
    } else {
      el.classList.remove("jandan-record-rainbow-text");
    } 
  });
};

export const rmRGB = () => {
  getAllNickNameEl().forEach(el => {
    el.classList.remove("jandan-record-rainbow-text");
  });
};

const getAllNickNameEl = () => {
  const result: HTMLElement[] = [];
  const url = _window.location.pathname.replace(/^(\/[^/]+).*?$/, "$1");
  switch (url) {
    case "/dzh":
      result.push(...document.querySelectorAll<HTMLElement>(".tucao-author-bar .tucao-author"));
      break;
    case "/bbs":      
      result.push(...document.querySelectorAll<HTMLElement>(".topic-author .author-link"));
      result.push(...document.querySelectorAll<HTMLElement>(".thread-info .author-link,.reply .topic-author >b"));
      break;
    case "/p":
      result.push(...document.querySelectorAll<HTMLElement>(".reply-container .jdcomment-author >b"));
      break;
    default:
      result.push(...document.querySelectorAll<HTMLElement>(".row >.author >strong[title]"));
      result.push(...document.querySelectorAll<HTMLElement>(".tucao-author >span:first-of-type"));
      result.push(...document.querySelectorAll<HTMLElement>("#comments .comment-topic >b:first-of-type"));
      result.push(...document.querySelectorAll<HTMLElement>(".commentlist >li[id] > b:first-of-type"));
      break;
  }
  return result;
};