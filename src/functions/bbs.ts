import { keyBy } from "lodash";
import { UserData } from "../types";
import { _window } from "../utils";

export const currentBBSConfig: {
  id: number,
  total: number,
  isAsc: boolean,
  replies: Record<string, any>
} = {
  id: 0,
  total: 0,
  isAsc: true,
  replies: {}
};

export function addMyLink(userData: UserData) {
  if (!document.getElementById("my-bbs-link") && _window.location.pathname === "/bbs" && userData) {
    const myBbs = document.createElement("a");
    myBbs.innerText = "我的贴子";
    myBbs.id = "my-bbs-link";
    myBbs.href = `/bbs#/user/${userData.id}`;
    myBbs.target = "_blank";
    document.querySelector(".list-header")?.appendChild(myBbs);
  }
}

export function postProcessBBSReplies(data?: {response: any, isAsc: boolean}) {
  setTimeout(() => {
    const threadContainer = document.getElementById("thread-container");
    if (threadContainer && _window.location.pathname.startsWith("/bbs")) {
      const bbsId = parseInt(_window.location.href.replace(/^.*?jandan.net\/bbs#\/topic\/(\d+)$/, "$1"));
      if (bbsId !== currentBBSConfig.id) {
        currentBBSConfig.replies = {};
      }
      currentBBSConfig.id = bbsId;
      if (data) {
        currentBBSConfig.total = data.response.total;
        currentBBSConfig.isAsc = data.isAsc;
        Object.assign(currentBBSConfig.replies, keyBy(data.response.list, "reply_id"));
      }
    
      const currentPage = parseInt(threadContainer.querySelector(".page-nav li button.active")?.innerHTML || "");
      if (currentPage > 0) {
        const refPages = new Set();
        threadContainer.querySelectorAll(".reply-container > div").forEach((reply, index) => {
          // 纠正楼号
          const actualFloor = (currentPage - 1) * 40 + index + 1;
          reply.querySelector<HTMLElement>(".floor-number")!.innerText = `${currentBBSConfig.isAsc ? actualFloor : currentBBSConfig.total - actualFloor + 1}楼`;
          // 增加回复按钮
          if (!reply.querySelector(".topic-function .reply-button")) {
            const replyBtn = document.createElement("span");
            replyBtn.classList.add("reply-button");
            replyBtn.style.cursor = "pointer";
            replyBtn.innerText = "回复";
            replyBtn.onclick = function () {
              const headEl = (this as HTMLElement).parentElement!.parentElement!.querySelector(".topic-author");
              const replyName = headEl?.querySelector("b")?.innerHTML;
              const floorNum = headEl?.querySelector(".floor-number")?.innerHTML.replace(/^(\d+).*?$/, "$1");
              const textarea = document.querySelector<HTMLTextAreaElement>("#thread-container .thread-form textarea")!;
              textarea.value += `${textarea.value ? "\n\n" : ""}@${replyName} ${(this as HTMLElement).nextElementSibling?.innerHTML}(${floorNum}楼) `;
              textarea.scrollIntoView();
              textarea.focus();
            };
            reply.querySelector(".topic-function")?.prepend(" / ");
            reply.querySelector(".topic-function")?.prepend(replyBtn);
          }
          // 计算引用
          const replyContentEl = reply.querySelector<HTMLDivElement>(".topic-content")!;
          replyContentEl.innerHTML = replyContentEl.innerHTML.replaceAll(/(^|<br>)(@.*?\s+#(\d+)\((\d+)楼\))/g, (_, _1, _2, _3, _4) => {
            const reply_id = _3;
            const floor = +_4;
            const page = Math.ceil(floor/40);
            if (!currentBBSConfig.replies[reply_id]) {
              refPages.add(page);
            }
            return `${_1}<span class='jandan-record-reply-ref'>${_2}</span>`;
          });
        });
        refPages.forEach(page => _window.axios.get(`/api/forum/replies/${currentBBSConfig.id}?order=asc&page=${page}`).then());
      }
    }
  }, 500);
}

function tooltipListener(event: MouseEvent) {
  let tooltip = document.getElementById("jandan-record-reply-tooltip");
  const target = event.target as HTMLElement;

  if (target.classList?.contains("jandan-record-reply-ref")) {
    if (!tooltip) {
      tooltip = document.createElement("div");
      tooltip.id = "jandan-record-reply-tooltip";
      document.body.appendChild(tooltip);
    }
    if (tooltip.style.display == "block") return;
    const reply_id = parseInt(target.innerText.replace(/^.*?\s+#(\d+)\(\d+楼\)$/, "$1"));
    const corresponding = currentBBSConfig.replies[reply_id];
    tooltip.innerHTML = corresponding ? corresponding.content : "loading...";
    const rect = target.getBoundingClientRect();
    tooltip.style.display = "block";
    tooltip.style.left = `${rect.left}px`;
    tooltip.style.top = `${rect.top - tooltip.offsetHeight}px`;
  } else if (target.id === "jandan-record-reply-tooltip") { 
    /* empty */
  } else if (tooltip) {
    tooltip.style.display = "none";
  }
}

export function initBBSReplyTooltipListener() {
  document.addEventListener("mousemove", tooltipListener);
  document.addEventListener("click", tooltipListener);
}
