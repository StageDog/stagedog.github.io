# 酒馆助手界面: 显示和允许玩家修改变量

{{ prolog }}

MVU 有一个便利的设计: 它会在 AI 回复结束后, 自动在回复末尾附加一串特殊文本: `<StatusPlaceHolderImpl/>`. \
这串文本本身只是一个占位符, 没有任何作用. 但你可以用酒馆正则捕获它, 将它——

- {menuselection}`仅格式提示词` 为空, 这样一来, 这段文本不会被发送给 AI——也就是说它不会占用任何 token!
- {menuselection}`仅格式显示` 为我们想要展示的任何内容: 可以是单纯一句话, 也可以是一个可互动的前端界面.

## 仅格式提示词: 不发送界面占位符

我们新增一个局部正则, 命名为 `[不发送]界面占位符` (按照青空莉的正则命名习惯, `[不发送]` 表示不发送给 AI, `[隐藏]` 表示不显示给玩家, 或者 `[按作用命名]`):

::::{tabs}

:::{tab} 正则设置

```yaml
脚本名称: [不发送]界面占位符
查找正则表达式: <StatusPlaceHolderImpl/>
替换为:
作用范围:
  - [ ] 用户输入
  - [x] AI输出
短暂:
  - [ ] 仅格式显示
  - [x] 仅格式提示词
```

:::

:::{tab} 图片参考
:::{figure} 正则_不发送界面占位符.png
:::
:::

::::

## 仅格式显示: 显示界面

同样地, 我们新建一个局部正则, 命名为 `[界面]状态栏`. 这次我们将勾选 {menuselection}`仅格式显示`, 将占位符替换为我们要显示的状态栏:

::::{tabs}

:::{tab} 正则设置

```yaml
脚本名称: [界面]状态栏
查找正则表达式: <StatusPlaceHolderImpl/>
替换为: 见下文
作用范围:
  - [ ] 用户输入
  - [x] AI输出
短暂:
  - [x] 仅格式显示
  - [ ] 仅格式提示词
```

:::

:::{tab} 图片参考

照着图片的话, 会显示成`见下文`三个字, 但不会作为提示词发给 AI:

:::{figure} 正则_界面状态栏.png
:::

:::

::::

### 纯文本界面

与 `<user>`、`{{user}}` 等酒馆宏相同, `{{format_message_variable::变量}}` 除了作为提示词在发送给 ai 时被替换, 也会在显示时被替换. \
因此我们可以将 `<StatusPlaceHolderImpl/>` 替换为一串带有 `{{format_message_variable::变量}}` 的文本, 来显示变量值:

```text
💖 白娅当前依存度: {{format_message_variable::stat_data.白娅.依存度}}
```

这样, 每次 AI 回复的下方都会自动显示这行文字, 并显示正确的数值:

:::{figure} 纯文本状态栏.png
:::

当然, 你也可以使用 HTML 和 CSS 进行美化:

```html
<style>
/* 在这里写你的CSS样式 */
.status-bar {
  font-size: 14px;
  color: #ff69b4;
  border: 1px solid #ff69b4;
  padding: 5px;
  border-radius: 8px;
}
</style>
<div class="status-bar">
💖 白娅当前依存度: {{format_message_variable::stat_data.白娅.依存度}}
</div>
```

:::{figure} 美化状态栏.png
:::

不过, 我其实非常不建议你只为了显示变量值而做个状态栏: 想看变量值的玩家会自己开变量管理器看. \
比起只显示数值, 你可以做更多有趣的事情:

:::{video} 折叠状态栏.mp4
:align: center
:::

### 前端界面

至于包含复杂代码的前端界面状态栏, 这已超出本教程范围……但其实用{doc}`/青空莉/工具经验/实时编写前端界面或脚本/index`拷打 AI 写起来很简单!

在前端界面中, 你不仅仅可以显示变量值或做一些简单的美化——你还能让玩家和界面交互! 比如通过界面发布任务、请求 AI 生成、直接玩杀戮尖塔等 (是的, 有很多这类角色卡)!

:::{video} 任务界面状态栏.mp4
:align: center
:::

当然, 如果你是手机端不方便使用{doc}`/青空莉/工具经验/实时编写前端界面或脚本/index`, 可以用{doc}`门之主写卡助手 </青空莉/作品集/index>`或[咩咩的 Gemini CLI 全自动写卡工作流](https://discord.com/channels/1291925535324110879/1425536223291904151/1425536223291904151)等写卡助手; \
或者直接给 AI 发送以下提示词, 然后……祈祷🙏:

:::{admonition} 推荐的前端界面模板
:class: hint, dropdown

- 使用 `const all_variables = getAllVariables()` 获取整个变量, 然后用 `_.get(all_variables, 'stat_data.角色.络络.好感度')` 获取具体某个变量.
- 使用 jquery 处理显示逻辑

**当然我更建议你用{doc}`/青空莉/工具经验/实时编写前端界面或脚本/index`来让 AI 边自己看酒馆网页边编写状态栏.**

````{code-block} html
:force:
```html
<head>
  <style>
  ${设计样式}
  </style>
  <script type="module">
    ${
      逻辑代码
      example: |-
        function populateCharacterData() {
          const all_variables = getAllVariables();

          const property_value = _.get(all_variables, 'stat_data.${variable path}', 'N/A');
          $('#${character}-${variable path}').text(property_value);
          ...
        }

        function toggleSection($header) {
          const $content = $header.next('.section-content');
          $content.toggleClass('expanded');

          const $arrow = $header.find('span:last-child');
          $arrow.text($content.hasClass('expanded') ? '▼' : '►');
        }

        async function init() {
          await waitGlobalInitialized('Mvu');
          populateCharacterData();

          $('.section-header').on('click', function () {
            toggleSection($(this));
          });
        }

        $(errorCatched(init));
    }
  </script>
</head>
<body>
  <div class="card-body">
    <div class="section">
      <div class="section-header">
        <span>${角色名} 核心状态</span>
        <span>▼</span>
      </div>
      <div class="section-content expanded">
        <div class="property">
          <div class="property-name">${variable name in Chinese}</div>
          <div class="property-value-container">
            <span class="property-value" id="${character}-${variable path}">--</span>
          </div>
        </div>
        <div class="property">
          <div class="property-name">${...}</div>
          <div class="property-value-container">
            <span class="property-value" id="${...}">--</span>
          </div>
        </div>
        ...
      </div>
    </div>
    <div class="section">
      <div class="section-header">
        <span>世界状态</span>
        <span>►</span>
      </div>
      <div class="section-content">${...}</div>
    </div>
    ...
  </div>
</body>
```
````

:::

## 回顾

至此, 我们利用 `<StatusPlaceHolderImpl/>` 占位符制作了这样一个界面:

- 显示不消耗任何 token;
- AI 对它只需要更新需要更新的变量, 而不需要像传统状态栏一样每次都输出所有信息.

**但不要让这里的界面教程限制了你的想象力.**

你没必要非要用 `<StatusPlaceHolderImpl/>` 来显示界面, 你可以用其他任何方式来显示它: 你可以自己定义一个输出格式, 让 AI 输出其他必要信息, 然后通过酒馆正则捕获它, 替换为你的界面.

## 在消息开头显示界面

此外, 即便使用 `<StatusPlaceHolderImpl/>` 占位符, 你也可以调整酒馆正则, 来在消息开头而不是结尾 `<StatusPlaceHolderImpl/>` 实际位置显示界面:

::::{tabs}

:::{tab} 正则设置

```yaml
脚本名称: [界面]状态栏
查找正则表达式: /(.*)<StatusPlaceHolderImpl/>/s
替换为:
  你的界面
  $1
作用范围:
  - [ ] 用户输入
  - [x] AI输出
短暂:
  - [x] 仅格式显示
  - [ ] 仅格式提示词
```

:::

:::{tab} 结果

:::{figure} 显示在开头.png
:::

:::

::::

以此为例, **不要让这里的界面教程限制了你的想象力.**
