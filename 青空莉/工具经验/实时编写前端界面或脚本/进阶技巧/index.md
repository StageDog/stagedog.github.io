# 进阶技巧

{{ prolog }}

请选择你感兴趣的部分进行阅读.

## 自定义项目配置

:::{video} figma.mp4
:align: center
:caption: 在 figma 中用预制组件像做 PPT 一样设计界面
:::

- 在 `.cursor/rules` 中, 我预先为项目配置了一些编程助手编写规则 (相当于给编程助手添加了一个全局世界书). 你完全可以自行编写更多规则
- 在 `.cursor/mcp.json` 中, 我预先设置了 Browser MCP 来让 AI 能够查看酒馆网页. 你完全可以为 AI 找更多好用的 MCP, 如通过 figma MCP, 你可以**用大量预制好的组件像做 PPT 一样设计好界面**, 然后让 AI 生成代码结果.
- 在 `package.json` 中, 我预先为项目代码添加了 jquery、zod 等方便的第三方库 (具体请查看 `dependencies` 部分). 你可以让 AI 或自己用 `pnpm add 第三方库` 添加更多需要的第三方库, 它们一般添加上就能直接使用

## 用 figma 设计界面

除了上面提到 figma 允许你用大量预制好的组件像做 PPT 一样进行界面设计外, figma 也自带 AI 功能. 它是专业的前端原型设计软件, 因此用它的 AI 设计出的界面一般比其他 AI 好看许多. 具体配置方法请自行研究.

## 常用资源网站

### 免费字体

你可以从 [ZeoSeven Fonts](https://fonts.zeoseven.com/) 中找到很多免费字体.

以 `Sarasa Gothic 更纱黑体 Mono` 为例, 我们搜索到它, 进入它的页面, 点击右上角的{menuselection}`嵌入到 Web 项目`即会跳转到对应内容, 选择{menuselection}`常规 CSS` 然后点击复制即可.

:::{figure} 免费字体.png
:::

### 免费图标

你可以从 [FontAwesome](https://fontawesome.com/) 中找到很多免费图标. 它们在前端界面中直接可用.

### 免费 CDN

[jsDelivr](https://www.jsdelivr.com/) 为所有 npm 库和 github 文件提供了 CDN 支持, 你可以直接在脚本或界面中引用它们.

需要注意的是, 你应该用 `https://testingcf.jsdelivr.net` 这个国内也能访问的镜像, 而不是直接用 `https://cdn.jsdelivr.net`.

:::{hint}
如果是需要 npm 第三方库, 推荐直接通过 `pnpm add 第三方库` 来添加它们, 模板文件夹已经配置好会在打包时将第三方库转换为 jsDelivr 链接, 从而避免在多个脚本或界面中重复打包它们.

部分第三方库用 jsDelivr 的 cdn 链接导入可能无法使用, 则可以尝试在 webpack.config.ts 最后的 `cdn` 变量中为它指定可用的 cdn 链接.
:::

## 前端界面正则的推荐写法

### 提高正则容错率

你的前端界面可能对应于 AI 很复杂的输出格式, 但这些格式应该由前端界面的代码通过 `getChatMessages` 获取楼层消息内容后处理, 而不应该由酒馆正则处理.

**前端界面正则唯一要做的是定位前端界面应该在的位置, 而不是处理输出数据**.

例如, 如果你的输出格式是: (并不是说我推荐这种格式)

```text
<status>
心情:→(平静通话)
衣着:居家长T恤
角色阶段:暗中观察
位置:自己房间
行动:结束与user通话
下一步行动:准备就寝
身体:及腰银发散落,深紫色的眼眸中带着一丝遗憾,白皙的肌肤在月光下泛着珍珠般的光泽,散发着淡淡的茶香
内心:心爱找他有什么事呢...不知道他会不会陪我过生日...
求签问卦:月下逢君意/花开并蒂时/缘定三生后
</status>
```

前端界面正则只需要定位这一段文本即可:

```yaml
脚本名称: [界面]状态栏
查找正则表达式: <status>.*</status> # 里面具体是什么不由正则在意
替换为: 前端界面的 html 代码块
作用范围:
  - [x] 用户输入
  - [x] AI输出
短暂:
  - [x] 仅格式显示
  - [ ] 仅格式提示词
```

### 避免渲染卡顿

酒馆助手需要酒馆正则先将内容替换成代码块再进行渲染. 当代码内容过多时, 代码块本身的显示就会很卡.

为此像下文 "发布会自动更新的前端界面或脚本" 那样, 将 html 转换为链接而正则代码块里只加载链接. 这样酒馆需要渲染的代码块内容没多少, 自然不会卡顿.

## 使用 Vue 编写前端界面

酒馆助手前端界面和脚本可以直接使用 Vue, 它会让数据显示变得更为简单. `src/界面示例` 就是这么做的.

除了 [`vue`](https://cn.vuejs.org/) 之外, 我还配置了 [`gsap`](https://gsap.com/)、[`pinia`](https://pinia.vuejs.org/)、[`vue-router`](https://router.vuejs.org/)、[vueuse](https://vueuse.org/) 等库, 让你无论是实现打字机效果、做可调整元素顺序并及时保存结果的列表、给设置做浏览器缓存、让界面全屏、发送系统通知等等都异常简单. **AI 很会, 拷打 AI.**

你可以安装 [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd), 从而在 {kbd}`F12` 所打开的开发者工具中新增 vue 选项卡, 得到 vue 更多调试功能.

::::{admonition} 几行代码实现打字机效果
:class: hint, dropdown

:::{video} 打字机.mp4
:align: center
:::

```ts
gsap.registerPlugin(SplitText);
split = SplitText.create('.text', { type: 'chars' });
gsap.set(split.chars, {
  opacity: 1,
  duration: 0.7,
  ease: 'power4',
  stagger: 0.04,
});
```

::::

:::::{admonition} 给界面设置浏览器缓存
:class: hint, dropdown

::::{tabs}
:::{tab} 不使用 Vue

```ts
// 我们需要从 localStorage 中获取 count 的值
let count = localStorage.getItem('count');

// 我们得转换值为字符串再赋值给 count🤢
count = String(5);

// 我们得记住保存变量结果回 localStorage🤢
localStorage.setItem('count', count);
```

:::

:::{tab} 使用 Vue

```ts
import { useLocalStorage } from '@vueuse/core';

// 对 `count` 的改变都会被直接保存到浏览器缓存中, 我们可以随便用 `count` 变量!
const count = useLocalStorage<number>('count', 0);

// 而且变量类型就是我们需要的类型!
count.value = 5;
```

:::
::::

:::::

:::{admonition} 我觉得很有用的 vueuse 功能
:class: hint, dropdown

更多请自行查阅文档([英文](https://vueuse.org/guide/)/[中文](https://vueuse.nodejs.cn/guide/)); 当然你可以直接问 ai, 它也许知道.

<!-- markdownlint-disable MD032 MD007 -->
@vueuse/core - 状态 (State)
: - 共享 composable 状态: [useSharedComposable](https://vueuse.org/shared/createSharedComposable/)
  - 自动缓存数据到浏览器: [useLocalStorage](https://vueuse.org/core/useLocalStorage/)

@vueuse/core - 元素 (Elements)
: - 可拖动元素: [useDraggable](https://vueuse.org/core/useDraggable/)
  - 元素大小: [useElementSize](https://vueuse.org/core/useElementSize/)
  - 检测元素大小发生改变: [useResizeObserver](https://vueuse.org/core/useResizeObserver/)
  - 检测 DOM 发生改变: [useMutationObserver](https://vueuse.org/core/useMutationObserver/)
  - 检测页面滚动: [useWindowScroll](https://vueuse.org/core/useWindowScroll/)
  - 标签页间、iframe 间通信: [useBroadcastChannel](https://vueuse.org/core/useBroadcastChannel/)

@vueuse/core - 浏览器 (Browser)
: - 剪贴板: [useClipboard](https://vueuse.org/core/useClipboard/) 和 [useClipboardItems](https://vueuse.org/core/useClipboardItems/)
  - 监听事件, 支持组件卸载时自动释放: [useEventListener](https://vueuse.org/core/useEventListener/)
  - 点击导入文件时打开的文件选择框: [useFileDialog](https://vueuse.org/core/useFileDialog/)
  - 全屏化: [useFullscreen](https://vueuse.org/core/useFullscreen/)
  - 从 Blob 创建 URL, 支持组件卸载时自动释放: [useObjectUrl](https://vueuse.org/core/useObjectUrl/)
  - 向页面加载 `<script>`, 支持 `type: 'module'`, 支持组件卸载时自动释放: [useScriptTag](https://vueuse.org/core/useScriptTag/)
  - 向页面加载 `<style>`, 支持组件卸载时自动释放: [useStyleTag](https://vueuse.org/core/useStyleTag/)
  - 自动适配输入框大小: [useTextareaAutosize](https://vueuse.org/core/useTextareaAutosize/)
  - 使用网页通知功能 (我嘞个 AI 回复结束后通知): [useWebNotification](https://vueuse.org/core/useWebNotification/)

@vueuse/core - 传感器 (Sensors)
: - 点击了选定元素之外的地方: [useClickOutside](https://vueuse.org/core/useClickOutside/)
  - 某个元素被移除: [useElementRemoval](https://vueuse.org/core/useElementRemoval/)
  - 某个键盘按键: [onKeyStroke](https://vueuse.org/core/onKeyStroke/)
  - 键盘修饰符: [useKeyModifier](https://vueuse.org/core/useKeyModifier/)
  - 按键组合: [useMagicKeys](https://vueuse.org/core/useMagicKeys/)
  - 长按按钮: [onLongPress](https://vueuse.org/core/onLongPress/)
  - 按键时自动聚焦到输入框: [onStartTyping](https://vueuse.org/core/onStartTyping/)
  - 当前鼠标所在的元素: [useElementByPoint](https://vueuse.org/core/useElementByPoint/)
  - 元素是否被鼠标悬停: [useElementHover](https://vueuse.org/core/useElementHover/)
  - 元素是否被聚焦: [useElementFocus](https://vueuse.org/core/useElementFocus/) 和 [useFocusWithin](https://vueuse.org/core/useFocusWithin/)
  - 显示帧数: [useFps](https://vueuse.org/core/useFps/)
  - 用户处于空闲状态, 多少秒没和界面交互过: [useIdle](https://vueuse.org/core/useIdle/)
  - 让元素可以无限滑动: [useInfiniteScroll](https://vueuse.org/core/useInfiniteScroll/)
  - 鼠标位置: [useMouse](https://vueuse.org/core/useMouse/)
  - 鼠标点击: [useMousePressed](https://vueuse.org/core/useMousePressed/)
  - 鼠标不在网页内: [usePageLeave](https://vueuse.org/core/usePageLeave/)
  - 鼠标长按滑动: [usePointerSwipe](https://vueuse.org/core/usePointerSwipe/)
  - 触控滑动: [useSwipe](https://vueuse.org/core/useSwipe/)
  - 元素内的滚动: [useScroll](https://vueuse.org/core/useScroll/)
  - 锁定元素内的滚动: [useScrollLock](https://vueuse.org/core/useScrollLock/)

@vueuse/core - 网络 (Network)
: - 响应式请求 url 内容, 可简单取消请求, 会在 url 变更时重新请求: [useFetch](https://vueuse.org/core/useFetch/)

@vueuse/core - 动画 (Animation)
: - 你可以使用 gsap
  - 过一段时间后触发: [useTimeout](https://vueuse.org/shared/useTimeout/) 和 [useTimeoutFn](https://vueuse.org/shared/useTimeoutFn/)
  - 每过一段时间触发: [useInterval](https://vueuse.org/shared/useInterval/) 和 [useIntervalFn](https://vueuse.org/shared/useIntervalFn/)
  - 当前时间: [useNow](https://vueuse.org/core/useNow/)

@vueuse/core - 组件 (Component)
: - 自己写代码才需要, 可能全都能用上, 因此自行查阅
  - 同时进行 `computed` 和 `inject`: [computedInject](https://vueuse.org/core/computedInject/)
  - 在组件中创建可复用的 template: [createReusableTemplate](https://vueuse.org/core/createReusableTemplate/)
  - 在组件中将 template 设置为异步渲染: [createAsyncComponent](https://vueuse.org/core/createAsyncComponent/)
  - 对 `v-for` 绑定 ref: [useTemplateRefsList](https://vueuse.org/core/useTemplateRefsList/)
  - 虚拟列表, 仅渲染实际可见的部分: [VueVirtualScroller](https://github.com/Akryum/vue-virtual-scroller)

@vueuse/core - 监听 (Watch)
: - 自己写代码才需要, 可能全都能用上, 因此自行查阅
  - 等待条件满足: [util](https://vueuse.org/shared/until/)
  - 监听数组, 相比于 `watch` 还能得到数组新增元素和移除元素情况: [watchArray](https://vueuse.org/shared/watchArray/)
  - 监听最多 n 次: [watchAtMost](https://vueuse.org/shared/watchAtMost/) 和 [watchOnce](https://vueuse.org/shared/watchOnce/)
  - 防抖监听 (仅当一定时间内监听没触发后, 监听所回调的函数才会执行): [watchDebounced](https://vueuse.org/shared/watchDebounced/)
  - 节流监听 (一定时间内仅能执行一次函数): [watchThrottled](https://vueuse.org/shared/watchThrottled/)
  - 可在一定情况下忽略的监听: [watchIgnorable](https://vueuse.org/shared/watchIgnorable/)
  - 可暂停的监听: [watchPausable](https://vueuse.org/shared/watchPausable/)
  - 可主动触发的监听: [watchTriggerable](https://vueuse.org/shared/watchTriggerable/)
  - 仅在条件满足时才触发的监听: [watchWithFilter](https://vueuse.org/shared/watchWithFilter/)

@vueuse/core - 响应性 (Reactivity)
: - 自己写代码才需要, 可能全都能用上, 因此自行查阅
  - 异步的计算属性: [computedAsync](https://vueuse.org/core/computedAsync/)
  - 自行定义依赖项的计算属性: [computedWithControl](https://vueuse.org/shared/computedWithControl/)
  - 将非响应式函数转换为响应式函数: [reactify](https://vueuse.org/shared/reactify/)
  - 将对象内的非响应式函数转换为响应式函数: [reactifyObject](https://vueuse.org/shared/reactifyObject/)
  - 响应性地忽略响应式对象中的某些字段: [reactiveOmit](https://vueuse.org/shared/reactiveOmit/)
  - 响应性地提取响应式对象中的某些字段: [reactivePick](https://vueuse.org/shared/reactivePick/)
  - 过段时间后将会重置成默认值的 ref: [refAutoReset](https://vueuse.org/shared/refAutoReset/)
  - 可以自行重置成默认值的 ref: [refManualReset](https://vueuse.org/shared/refManualReset/)
  - 如果值为 undefined 则采用默认值的 ref: [refDefault](https://vueuse.org/shared/refDefault/)
  - 允许自行控制是否触发响应的 ref: [refWithControl](https://vueuse.org/shared/refWithControl/)
  - 防抖响应 (仅当一定时间内 ref 没被改变后, ref 才会被修改): [refDebounced](https://vueuse.org/shared/refDebounced/)
  - 节流响应 (一定时间内 ref 仅能被修改一次): [refThrottled](https://vueuse.org/shared/refThrottled/)
  - 将两个 ref 的响应性同步, 指向同一个响应性对象: [syncRef](https://vueuse.org/shared/syncRef/) 和 [syncRefs](https://vueuse.org/shared/syncRefs/)

@vueuse/core - 数组 (Array)
: - 自己写代码才需要, 可能全都能用上, 因此自行查阅
  - 简单地说就是数组各个函数的响应性版本

@vueuse/core - Time (时间)
: - 倒计时: [useCountdown](https://vueuse.org/core/useCountdown/)
  - 格式化日期时间: [useDateFormat](https://vueuse.org/shared/useDateFormat/)
  - 计算时间差: [useTimeAgo](https://vueuse.org/core/useTimeAgo/) 和 [useTimeAgoIntl](https://vueuse.org/core/useTimeDiff/)

@vueuse/core - 工具 (Utilities)
: - 自己写代码才需要, 可能全都能用上, 因此自行查阅
  - 让不接受 ref 的函数能接受 ref (但依旧不是响应式执行): [createUnrefFn](https://vueuse.org/core/createUnrefFn/)
  - 获取变量的 base64 字符串: [useBase64](https://vueuse.org/core/useBase64/)
  - 计数器: [useCounter](https://vueuse.org/shared/useCounter/)
  - 确认框: [useConfirmDialog](https://vueuse.org/core/useConfirmDialog/)
  - 防抖执行 (仅当一定时间内不调用某个函数后, 函数才会执行): [useDebounceFn](https://vueuse.org/shared/useDebounceFn/)
  - 节流执行 (一定时间内仅能执行一次函数): [useThrottleFn](https://vueuse.org/shared/useThrottleFn/)
  - 记忆执行 (执行后, 以后对函数的调用直接返回结果): [useMemoize](https://vueuse.org/core/useMemoize/)
  - 记录 ref 的上一个值 (需要提前创建 ref): [usePrevious](https://vueuse.org/core/usePrevious/)
  - 多步骤向导界面: [useStepper](https://vueuse.org/core/useStepper/)
  - 开关 boolean 值: [useToggle](https://vueuse.org/shared/useToggle/)
  - 响应式转换字符串为数字: [useToNumber](https://vueuse.org/shared/useToNumber/)
  - 响应式转换数字为字符串: [useToString](https://vueuse.org/shared/useToString/)

@vueuse/integrations
: - 表单检验: [useAsyncValidator](https://vueuse.org/integrations/useAsyncValidator/)
  - 模糊搜索: [useFuse](https://vueuse.org/integrations/useFuse/)
  - 可调整元素顺序的列表: [useSortable](https://vueuse.org/integrations/useSortable/)

@vueuse/sound
: - 播放声音: [useSound](https://github.com/vueuse/sound#examples)

<!-- markdownlint-enable MD032 MD007 -->
:::

## 与外部应用程序通信

酒馆助手脚本可以安装和使用 `socket.io-client` 乃至所有浏览器环境支持的第三方库, 从而和外部应用程序进行通信. {doc}`/青空莉/工具经验/实时编写角色卡、世界书或预设/index` (<http://github.com/StageDog/tavern_sync>) 就是如此实现的.

如果你要传输数据, 请注意调整服务器端的 [`maxHttpBufferSize`](https://socket.io/docs/v4/server-options/#maxhttpbuffersize) 参数, 它默认仅为 1mb.

## 在脚本中用 jquery 修改页面元素

在脚本中, 你可以用 jquery 来修改页面元素. 酒馆助手内置库中的[`预设条目更多按钮`](https://github.com/StageDog/tavern_resource/tree/main/src/酒馆助手/预设条目更多按钮)、[`预设防误触`](https://github.com/StageDog/tavern_resource/tree/main/src/酒馆助手/预设防误触)等脚本都是通过这种方式来实现的:

```{code-block} ts
:caption: 预设防误触
function lock_inputs(enable: boolean) {
  // 用 jquery 访问酒馆页面元素, 让它们不能被修改
  $('#range_block_openai :input').prop('disabled', enable);
  $('#openai_settings > div:first-child :input').prop('disabled', enable);
  $('#stream_toggle').prop('disabled', false);
  $('#openai_show_thoughts').prop('disabled', false);
}

$(() => {
  // 启用脚本时锁定预设设置, 防止误触预设
  lock_inputs(true);
});

$(window).on('pagehide', () => {
  // 卸载脚本时解锁预设设置, 允许修改预设
  lock_inputs(false)
});
```

甚至, 你可以不使用酒馆助手的前端界面渲染方式, 而是自己用 jquery 将代码块替换为要渲染的界面. [文生图](https://github.com/StageDog/tavern_resource/tree/main/src/酒馆助手/文生图)和[行动选择框](https://github.com/StageDog/tavern_resource/tree/main/src/世界书/可点击的选择框)等脚本就是如此:

```{code-block} ts
:caption: 替换第 0 楼中含 `<galgame>` 的代码块为 galgame 界面
const $galgame = extract_galgame_element();

const $mes_text = retrieveDisplayedMessage(0);
$mes_text.find('pre:contains("<galgame>")').replaceWith($galgame);
```

## 在脚本中对发送出的提示词进行修改

除了通过 jquery 修改页面元素, 脚本也可以监听酒馆的提示词发送事件, 进而自行修改提示词.

要做到这一点, 我们可以监听的事件有很多, 如 (按请求生成时事件发生先后顺序) `tavern_events.GENERATE_AFTER_COMBINE_PROMPTS`、`tavern_events.GENERATE_AFTER_DATA` (提示词模板、酒馆助手宏发生在这里)、`tavern_events.CHAT_COMPLETION_PROMPT_READY` 和 `tavern_events.CHAT_COMPLETION_SETTINGS_READY`.

此处以 `tavern_events.CHAT_COMPLETION_PROMPT_READY` 为例:

```ts
eventOn(
  tavern_events.CHAT_COMPLETION_PROMPT_READY,
  async (event_data: Parameters<ListenerType['chat_completion_prompt_ready']>[0]) => {
    // 移除非 user 提示词
    assignInplace(
      event_data.messages,
      event_data.messages.filter(message => message.role === 'user'),
    );
  },
);

function assignInplace<T>(destination: T[], new_array: T[]): T[] {
  destination.length = 0;
  destination.push(...new_array);
  return destination;
}
```

noass 等压缩相邻消息、合并消息的功能就是这么做的, 例如{doc}`压缩相邻消息 </青空莉/作品集/index>`.

:::{admonition} 注意修改方式
:class: warning

不要用 `event_data.chat = event_data.chat.map(message => ...)` 之类的方法, 这是让 `event_data.messages` 指向一个新数组, 而不是修改 `event_data.messages` 原本指向的数组.

你应该使用：

- lodash 中的某些原地修改函数
- 数组的 `splice`、`push` 等函数
- 上面代码中给出的 `assignInplace` 函数
:::

## 在脚本中控制世界书条目的激活

见于{doc}`/青空莉/工具经验/酒馆如何处理世界书/index`.

## 流式传输、同层前端界面

### 简单方案

要简单做流式传输, 我们使用酒馆助手的前端界面, 在其中设计{menuselection}`发送`按钮来触发酒馆助手的`generate`函数.

也就是说:

- 玩家只在一个前端界面内进行游玩
- 对于玩家的输入, 我们通过前端助手的 `generate`、`generateRaw` 命令自行要求 ai 回复, 并监听 `iframe_events.STREAM_TOKEN_RECEIVED_FULLY` 和 `iframe_events.STREAM_TOKEN_RECEIVED_INCREMENTALLY` 事件来获取流式传输文本
- 为了记录剧情, 我个人建议将前端界面正则调成最大深度 `0`, 然后用 `setChatMessages`、`createChatMessages`、`deleteChatMessages` 等函数的 `{ refresh: 'none' }` 参数来修改消息楼层但不刷新显示. 由于不会刷新显示, 玩家可以继续游玩你的界面, 但剧情记录等又能直接利用酒馆的消息楼层功能, **你不需要写一堆额外的代码来制作记录剧情功能**.

### 更自由的办法

前面提到我们可以在酒馆助手脚本中用 jquery 修改页面元素, 那么我们完全可以把酒馆的楼层显示隐藏起来, 自己在它原本的位置制作一个楼层显示:

- 监听 `tavern_events.MESSAGE_SEND -> message_id`, 我们可以知道玩家要求酒馆调用 ai 生成;
- 监听 `tavern_events.STREAM_TOKEN_RECEIVED -> text`, 我们可以获取流式传输文本;
- 监听 `tavern_events.MESSAGE_RECEIVED -> message_id`, 我们可以知道酒馆结束了回复.

这样一来, 我们是自己获取流式传输文本, 自己控制该怎么显示界面.

例如, 假设我们让 AI 以 YAML 的形式发送对话, 流式过程中可能得到:

```{code-block} yaml
:emphasize-lines: 6
- 角色: 络络
  对话: 杂鱼喵
- 角色: 青空莉
  对话: 杂鱼哦
- 角色: 络络 
  对
```

我们可以在还没收到消息时就显示 Galgame 对话界面, 而只将已经完全发送的消息添加到界面中, 允许玩家翻页阅读.

:::{video} 流式界面.mp4
:align: center
:caption: <code class="docutils literal notranslate">@hakoyukaya</code> 的流式 Galgame 界面
:::

## 发布会自动更新的前端界面、脚本或美化样式

还记得我们是如何实现实时修改前端界面或脚本的吗? 我们利用 {menuselection}`Go Live` 将本地文件夹转换为了网络链接, 而正则或脚本通过网络链接来加载最新打包内容.

既然这样, 我们完全可以发布一个网络链接给玩家, 从而让玩家永远加载到最新的前端界面或脚本!

:::{hint}
如果使用自己的服务器部署链接, 请注意设置 https, 否则使用 https 的云酒馆玩家将不可访问.
:::

最简单的方式是利用 [jsDelivr](https://www.jsdelivr.com/) 为 github 文件提供的 CDN 功能. 对于上传在 `github.com/组织名/仓库名` 中 `路径` 下的文件, 你可以直接用 `https://testingcf.jsdelivr.net/gh/组织名/仓库名/路径` 来访问它们.

酒馆助手内置库即采用了这种方法. 例如, 如果你从{menuselection}`酒馆助手 --> 脚本库 --> 内置库`中导入[`标签化`](https://github.com/StageDog/tavern_resource/blob/main/src/酒馆助手/标签化/index.ts), 编辑它就会发现它的代码里仅有一行:

```js
import 'https://testingcf.jsdelivr.net/gh/StageDog/tavern_resource/dist/酒馆助手/标签化/index.js'
```

同理, 你也可以用 jsDelivr 发布会自动更新的酒馆美化:

```css
@import url("https://testingcf.jsdelivr.net/gh/lolo-desu/lolocard/src/思维链美化/酒馆自带推理块版/暗色.css");
```

然而, jsDelivr 服务器、jsDelivr 镜像服务器 (为了国内直连) 和玩家的浏览器都会缓存文件, 因此并不是 github 上文件更新后, 这个链接就会立即得到最新的打包结果.

除了等待服务器自行刷新缓存, 你可以通过以下方式来加快缓存刷新:

- 从 <https://github.com/StageDog/tavern_helper_template> {menuselection}`Use this template` 来创建新仓库而不是仅在本地使用模板文件夹, 这个仓库配置了自动工作流, 会自动打包结果并在每次更新时都修改版本号，可以做到 12h 刷新服务器缓存
- 更新版本号后，在 <https://www.testingcf.com/tools/purge> 中输入链接, 将 `testingcf.jsdelivr` 改成 `cdn.jsdelivr`, 然后点击确认, 能立即刷新 jsDelivr 服务器缓存, 但镜像服务器缓存不会刷新
- 玩家主动清除浏览器缓存

或者, 你可以暂时换个镜像来访问, 如果这个镜像没有缓存:

```text
testingcf.jsdelivr.net
fastly.jsdelivr.net
gcore.jsdelivr.net
```

## 导入文件文本内容

你可能需要在代码里获取本地 json 等文件内容, 那么可以直接用 `import string from './文件?raw'` 来将文件内容作为字符串导入.

## 混淆代码

无论前端界面还是脚本, 你都可以在 `index.ts` 中添加一行 `// @obfuscate` 来指示打包时应该混淆代码.

混淆后的代码依旧能正常使用, 只是代码本身很难辨认. (当然我更建议你将源代码分享出来供人学习, 我添加这个功能只是因为我将预设及破限塞进了代码里, 如果在 github 仓库里直接发布可能会被注意到)

:::{figure} 混淆代码.png
混淆后的代码
:::

## 不自动打包代码

如果你是从模板新建仓库的形式使用编写模板, 那么可以在 `index.ts` 中添加一行 `// @no-ci` 来指示 CI 工作流不自动打包某个前端界面或脚本.

## 允许代码分块

默认情况下, 前端界面或脚本会打包成单个文件, 但如果你以网络链接的形式发布前端界面或脚本, 则可以打包成多个文件块让玩家在游玩中按需加载.

为了允许代码分块, 你需要删去 `webpack.config.ts` 中的 `new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 1 })` 这一句.

## 自定义 tailwindcss 配置

tailwindcss 提供了许多组件类, 允许你不总是自定义类然后设置样式:

::::{tabs}
:::{tab} 不使用 tailwindcss

```html
<p class="content-text">Hello, world!</p>
```

```css
.content-text {
  font-size: 30px;
  line-height: 36px;
  --tw-font-weight: 500;
  font-weight: 500;
  color: #030712;
}
```

:::

:::{tab} 使用 tailwindcss

```html
<p class="text-3xl font-medium text-gray-950">Hello, world!</p>
```

:::
::::

模板并不强制你用 tailwindcss, 因此没有开启 tailwindcss 很多检查. 如果需要, 你可以自行去 eslint.config.mjs 调整它.

```{code-block} ts
:emphasize-lines: 2,10-15,17-22,31
{
  files: ['src/**/*.{html,vue,js,ts}'],  // 调整检查范围
  plugins: {
    'better-tailwindcss': eslintPluginBetterTailwindcss,
  },
  rules: {
    ...eslintPluginBetterTailwindcss.configs['recommended-warn'].rules,
    ...eslintPluginBetterTailwindcss.configs['recommended-error'].rules,

    // class 过长时自动换行
    //   这和 Ctrl + S 所触发的自动格式化软件 Prettier 相冲突, 需要时必须在 html 标签上一行加一句 <!-- prettier-ignore-attribute -->
    'better-tailwindcss/enforce-consistent-line-wrapping': [
      'off',  // 改为 `warn` 或 `error` 则开启
      { printWidth: 120 }
    ],

    // 禁止在 html 中使用未经 tailwindcss 注册的类
    //   由此, 如果写了 tailwindcss 不支持的类, 将会报错
    'better-tailwindcss/no-unregistered-classes': [
      'off',
      { ignore: ['fa-*'] }  // FontAwesome 图标类没有被 tailwindcss 注册, 我们应该让检查忽略它避免报错
    ],
  },
  settings: {
    'better-tailwindcss': {
      entryPoint: 'src/global.css',
      tailwindConfig: 'tailwind.config.js',
    },
  },
},
// 你可以复制上面的 {} 块, 通过改变 `files` 为不同范围设置不同检查
```
