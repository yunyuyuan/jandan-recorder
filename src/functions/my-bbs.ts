import { UserData } from "../types";
import { _window } from "../utils";

export default function(userData: UserData) {
  if (!document.getElementById("my-bbs-link") && _window.location.pathname === "/bbs" && userData) {
    const myBbs = document.createElement("a");
    myBbs.innerText = "我的贴子";
    myBbs.id = "my-bbs-link";
    myBbs.href = `/bbs#/user/${userData.id}`;
    myBbs.target = "_blank";
    document.querySelector(".list-header")?.appendChild(myBbs);
  }
}