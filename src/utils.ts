// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { unsafeWindow } from "monkeyClient";
import mitt from "mitt";

export const emitter = mitt();

export const _window = unsafeWindow || window;

export const $: JQueryStatic = _window?.jQuery || _window?.$;