import { ShowModalEvent } from './constants';
import { _window,  emitter } from './utils';
import { createApp } from 'vue';
import AppComp from './App.vue';
import "../assets/style.scss";

createApp(AppComp).mount(
  (() => {
    const app = document.createElement('div');
    document.body.append(app);
    return app;
  })(),
);

const memberLink = document.querySelector('a[href="/member"]');
const myPost = document.createElement('a');
myPost.classList.add('nav-link', 'jandan-record-link')
myPost.innerText = '我的吐槽';
myPost.onclick = () => {
  emitter.emit(ShowModalEvent);
}
memberLink!.parentElement!.appendChild(myPost);

console.log('煎蛋吐槽记录器加载成功！');