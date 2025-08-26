# 进阶技巧

请选择你感兴趣的部分进行阅读.

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

酒馆在显示代码块时会使用 `highlight.js` 对它进行着色高亮处理, 但前端界面的 html 代码块多则几万字, 在被处理时会非常卡顿. 而且对前端界面的 html 代码块进行着色高亮处理本就没有意义: 它马上就会被酒馆助手渲染成前端界面.

为了避免前端界面正则替换时的卡顿, 我们应该使用 text 代码块来包裹前端界面:

````{code-block} html
:emphasize-lines: 1
```text
前端界面打包结果...
```
````

## 发布会自动更新的前端界面或脚本

还记得我们是如何实现实时修改前端界面或脚本的吗? 我们利用 {menuselection}`Go Live` 将本地文件夹转换为了网络链接, 而正则或脚本通过网络链接来加载最新打包内容.

既然这样, 我们完全可以发布一个网络链接给玩家, 从而让玩家永远加载到最新的前端界面或脚本!

最简单的方式是利用 [jsDelivr](https://www.jsdelivr.com/) 为 github 文件提供的 CDN 功能. 对于上传在 `github.com/组织名/仓库名` 中 `路径` 下的文件, 你可以直接用 `https://testingcf.jsdelivr.net/gh/组织名/仓库名/路径` 来访问它们.

酒馆助手内置库即采用了这种方法. 例如, 如果你从{menuselection}`酒馆助手 --> 脚本库 --> 内置库`中导入[`标签化`](https://github.com/StageDog/tavern_resource/blob/main/src/酒馆助手/标签化/index.ts), 编辑它就会发现它的代码里仅有一行:

```js
import 'https://testingcf.jsdelivr.net/gh/StageDog/tavern_resource/dist/酒馆助手/标签化/index.js'
```

然而, jsDelivr 的服务器和玩家的浏览器都会缓存文件, 因此并不是 github 上文件更新后, 这个链接就会立即得到最新的打包结果.

你可以通过以下方式来刷新缓存:

- 从 <https://github.com/StageDog/tavern_helper_template> {menuselection}`Use this template` 来创建新仓库而不是仅在本地使用模板文件夹, 这个仓库配置了自动工作流, 会自动打包结果并在每次更新时都修改版本号，可以做到 12h 刷新服务器缓存
- 更新版本号后，在 <https://www.testingcf.com/tools/purge> 中输入链接, 将 `testingcf.jsdelivr` 改成 `cdn.jsdelivr`, 然后点击确认, 能立即刷新服务器缓存
- 玩家主动清除浏览器缓存

或者, 你可以在使用网络链接时尾附 `?time=时间戳`, 不同的时间戳将被视为访问不同的链接, 因此会独立缓存:

```{code-block} js
:caption: 永远最新 (但永远缓存不上需要从网上获取)
import `https://testingcf.jsdelivr.net/gh/StageDog/tavern_resource/dist/酒馆助手/标签化/index.js?time=${Date.now()}`
```

```{code-block} js
:caption: 每日刷新
import `https://testingcf.jsdelivr.net/gh/StageDog/tavern_resource/dist/酒馆助手/标签化/index.js?time=${new Date().setHours(0, 0, 0, 0)}`
```

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

要做到这一点, 我们可以监听的事件有很多, 如 `tavern_events.GENERATE_AFTER_DATA`、`tavern_events.CHAT_COMPLETION_PROMPT_READY` 和 `tavern_events.CHAT_COMPLETION_SETTINGS_READY`.

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

:::{admonition} 注意修改方式
:class: warning

不要用 `event_data.chat = event_data.chat.map(message => ...)` 之类的方法, 这是让 `event_data.messages` 指向一个新数组, 而不是修改 `event_data.messages` 原本指向的数组.

你应该使用：

- lodash 中的某些原地修改函数
- 数组的 `splice`、`push` 等函数
- 上面代码中给出的 `assignInplace` 函数
:::

## 与外部应用程序通信

酒馆助手脚本可以安装和使用 `socket.io-client`, 从而和外部应用程序进行通信. {doc}`/青空莉/工具经验/实时编写角色卡、世界书或预设/index` (<http://github.com/StageDog/tavern_sync>) 就是如此实现的.

## 流式传输前端界面

### 简单方案

要简单做流式传输, 我们使用酒馆助手的前端界面, 在其中设计{menuselection}`发送`按钮来触发酒馆助手的`generate`函数.

也就是说:

- 玩家只在一个前端界面内进行游玩
- 对于玩家的输入, 我们通过前端助手的 `generate`、`generateRaw` 命令自行要求 ai 回复, 并监听 `iframe_events.STREAM_TOKEN_RECEIVED_FULLY` 和 `iframe_events.STREAM_TOKEN_RECEIVED_INCREMENTALLY` 事件来获取流式传输文本
- 为了记录剧情, 我们使用酒馆助手的世界书、消息楼层接口, 直接将剧情写入世界书条目或新建消息楼层.

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

## 仅当代码不报错时才能成功打包

无论是前端界面还是脚本都需要我们编写 typescript 代码. 当代码有语法错误时, 我们会在 Cursor 中看到报错:

:::{figure} 代码出错.png
:::

显然, 我们应该先解决代码的语法错误, 再进行打包. 但当 AI 用 `pnpm build` 或 `pnpm watch` 验证打包是否成功时, 你会惊讶地发现即便代码里有报错依然能成功打包. 这是因为在打包时检查语法错误消耗的内存和时间都太多了 (我的仓库 <http://github.com/StageDog/tavern_resource> 需要耗费不开启时 10 倍的时间). 出于性能考虑, 模板文件夹默认关闭了这一功能.

要开启这个功能, 你需要打开 `webpack.config.ts` 文件, 将其中的两处 `transpileOnly: true` 改为 `transpileOnly: false`.

## 自定义项目配置

- 在 `.cursor/rules` 中, 我预先为项目配置了一些编程助手编写规则 (相当于给编程助手添加了一个全局世界书). 你完全可以自行编写更多规则
- 在 `.cursor/mcp.json` 中, 我预先设置了 BrowserTools MCP 来让 AI 能够查看酒馆网页. 你完全可以为 AI 找更多好用的 MCP
- 在 `package.json` 中, 我预先为项目代码添加了 jquery、zod 等方便的第三方库. 你可以让 AI 或自己用 `pnpm add 第三方库` 添加更多需要的第三方库, 它们一般添加上就能直接使用

## 常用资源网站

### 免费字体

你可以从 [ZeoSeven Fonts](https://fonts.zeoseven.com/) 中找到很多免费字体.

以 `Sarasa Gothic 更纱黑体 Mono` 为例, 我们搜索到它, 进入它的页面, 点击右上角的{menuselection}`嵌入到 Web 项目`即会跳转到对应内容, 选择{menuselection}`常规 CSS` 然后点击复制即可.

:::{figure} 免费字体.png
:::

### 免费图标

你可以从 [FontAwesome](https://fontawesome.com/) 中找到很多免费图标. 它们在前端界面中直接可用.

### 免费 CDN

[jsDelivr](https://www.jsdelivr.com/) 中有很多库或文件的 CDN. 你可以直接在脚本或界面中引用它们.

需要注意的是, 你应该用 `https://testingcf.jsdelivr.net` 这个国内也能访问的镜像, 而不是直接用 `https://cdn.jsdelivr.net`.

:::{hint}
如果是需要第三方库, 推荐直接通过 `pnpm add 第三方库` 来添加它们, 模板文件夹已经配置好会在打包时将第三方库转换为 jsDelivr 链接, 从而避免在多个脚本或界面中重复打包它们.
:::
