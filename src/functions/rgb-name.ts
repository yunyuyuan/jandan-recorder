import { _window } from "../utils";

export const addRGB = (nickname?: string) => {
  // add之前，先remove一遍
  rmRGB();
  getAllNickNameEl().filter(el => el.innerText == nickname).forEach(el => {
    el.classList.add("rainbow-text");
  })
}

export const rmRGB = () => {
  getAllNickNameEl().forEach(el => {
    el.classList.remove("rainbow-text");
  })
}

const getAllNickNameEl = () => {
  const result: HTMLElement[] = [];
  const url = _window.location.pathname.replace(/^(\/[^\/]+).*?$/, '$1');
  switch (url) {
    case "/treehole":
    case "/qa":
    case "/ooxx":
    case "/pic":
    case "/top":
    case "/t":
      result.push(...document.querySelectorAll<HTMLElement>('.row >.author >strong[title]'))
      result.push(...document.querySelectorAll<HTMLElement>('.tucao-author >span:first-of-type'))
      result.push(...document.querySelectorAll<HTMLElement>('#comments .comment-topic >b:first-of-type'))
      break;
    case "/dzh":
      result.push(...document.querySelectorAll<HTMLElement>('.tucao-author-bar .tucao-author'))
      result.push(...document.querySelectorAll<HTMLElement>('.tucao-author-bar .tucao-author'))
      break;
    case "/bbs":      
      result.push(...document.querySelectorAll<HTMLElement>('.topic-author .author-link'))
      result.push(...document.querySelectorAll<HTMLElement>('.thread-info .author-link,.reply .topic-author >b'))
      break;
    case "/p":
      result.push(...document.querySelectorAll<HTMLElement>('.reply-container .jdcomment-author >b'))
      break;
  }
  return result;
}