// @ts-ignore
import { unsafeWindow } from "monkeyClient";

export const _window = unsafeWindow || window;

export const $: JQueryStatic = _window?.jQuery || _window?.$;