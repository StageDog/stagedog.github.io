# 手写 MVU 变量卡教程

> 如何在不使用 AI 的情况下, 编写用变量与 EJS 控制的提示词?

:::{raw} html
<div class="responsive-video-container">
  <iframe
    src="https://www.youtube.com/embed/YEr6ivYzpqY?si=JNOK3sqkk-07xUtC"
    frameborder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    allowfullscreen>
  </iframe>
</div>
:::

上方视频若无法查看, <a href="https://www.youtube.com/watch?v=YEr6ivYzpqY" target="_blank" rel="noopener noreferrer">点击跳转 Youtube</a>.

如今, 越来越多的人会使用 AI 写卡工具写卡, 而自己对酒馆、提示词缺乏理解 (**忆涟杯参赛作品绿灯错误率高达 70%**). \
结果是, 一些人的有趣想法只能经由 AI 生成的、质量无法保证的提示词来实现. \
这样的提示词往往不够定制化, 因而效果不理想或占用过多的注意力.

MVU 变量框架的结构更为特殊, 更是这种情况的重灾区.

因此, 我决定教你如何不使用任何工具来制作一张 MVU 变量卡, 从而帮助你更好地理解酒馆、世界书 (请阅读[世界书条目的激活](https://sillytavern-stage-girls-dog.readthedocs.io/工具经验/世界书条目的激活/))、MVU 和提示词.

**文章理解起来并不困难, 请不要看到不认识的名词或字母就放弃, 遇到不懂的可以复制下来发送给 AI 并进行询问.** \
**如果需要示例卡, 目前请参考{lolodesu}`日记络络 <src/日记络络/白化蓝染的日记本.png>`.**

## 安装插件和导入脚本

我们需要安装以下插件:

- [酒馆助手安装教程](https://n0vi028.github.io/JS-Slash-Runner-Doc/guide/关于酒馆助手/安装与更新.html)
- 提示词模板: `https://codeberg.org/zonde306/ST-Prompt-Template/`

然后我们新建一个角色卡, 在{menuselection}`酒馆右上角积木按钮 --> 酒馆助手 --> 脚本库`中{guilabel}`+ 脚本`来新建一个新的局部脚本, 命名随意, 内容填写为:

```ts
import 'https://testingcf.jsdelivr.net/gh/MagicalAstrogy/MagVarUpdate@master/artifact/bundle.js';
```

## 设置与初始化变量

当使用 MVU 变量框架时, 我们在同一个地方完成变量设置和初始化: 一个名字里包含 `[initvar]` 的世界书条目.

:::{figure} initvar名字.png
:::

脚本会自动识别该条目中的 JSON5、TOML 或 YAML 代码, 并将其解析为变量.

为了方便编写和维护, 我个人强烈推荐使用 **YAML** 格式.

### 构建变量结构

让我们以一个包含多角色的复杂角色卡为例. 一个清晰的变量结构不仅能帮助 AI 更好地理解设定, 也能让你自己在后续的修改中一目了然. 因此, 我们不妨先从分类开始:

```yaml
角色:
世界:
```

在 YAML 中, 英文冒号 (`:`) 用于建立归属关系, 而缩进则用来表示层级. 你可以将上面的代码理解为: 我们创建了名为 "角色" 和 "世界" 的两个顶层 "文件夹".

::::{hint}
如果实在不想手动写 YAML

- 你可以用 <https://guifier.com/yaml> 网站图形化地编写 YAML (就像你在电脑新建文件夹那样!)
- 也可以用[我在类脑的直播教程](https://discord.com/channels/1134557553011998840/1372487825471176805)或[青空莉的文档](https://sillytavern-stage-girls-dog.readthedocs.io/工具经验/酒馆助手编写环境配置/)配置好 Cursor, 创建一个 `initvar.yaml` 文件, 让 ai 帮你写和改正 (青空莉说你甚至可以这样让 ai 直接帮你写世界书qwq)
:::
::::

### 填充变量内容

当然, 空的文件夹没有意义, 我们需要向其中填充内容.

```yaml
角色:
  络络:
    好感度: 30
世界:
```

这里有几个关键点需要注意：

层级关系
: 我们通过缩进来表示层级. `络络:` 前面有两个空格, 意味着它被包含在 `角色:` 这个层级之下; `好感度:` 前面有四个空格, 意味着它属于 `络络:`.

缩进规范
: YAML 对格式要求严格, 请务必使用**偶数个空格** (通常是2个) 进行缩进.

赋值
: 像 `30` 这样直接跟在冒号和空格后面的值, 就是 `好感度` 这个变量的具体数值.

依照这个逻辑, 我们可以轻松地构建出一个内容丰富的变量结构:

```yaml
角色:
  络络:
    好感度: 30
    心情: 开心
  青空莉:
    好感度: 60
    心情: 郁闷
世界:
  日期: 2025-07-26
  时间: 21:00
```

### 变量可以是数组

一个变量可以拥有多个值, 这样的变量称为数组:

:::{code-block} yaml
:caption: 法一: 中括号包裹并用英文逗号区分
角色:
  络络:
    心情: [60, 开心]
:::

:::{code-block} yaml
:caption: 法二: 换行缩进用 `-` 开头
角色:
  络络:
    心情:
      - 60
      - 开心
:::

### 结构是可选的

当然, 前面所给的只是一种推荐的结构. 如果你觉得更直观, 也可以选择 "平铺式" 的结构, 完全不使用层级:

```yaml
络络的好感度: 30
络络的心情: 开心
青空莉的好感度: 60
青空莉的心情: 郁闷
日期: 2025-07-26
时间: 21:00
```

选择哪种结构取决于你的个人偏好, 核心原则是保持清晰易懂. 但无论如何请注意, **变量的路径不是为了让你看起来清楚, 而是让AI容易理解.** \
因此, 我极度推荐你使用结构清晰、分类正确的变量结构.

### 禁用条目并验证

当你在带有 `[initvar]` 的世界书条目中编辑好你的 YAML 代码后, 请务必注意以下几点:

保持该条目处于【禁用】状态
: 这一点至关重要! 这个条目的内容是专为 MVU 脚本读取并设置初始变量而设计的, 它**不应该作为文本发送给AI**.

重开聊天以应用变量
: 你需要 API 配置 (左上角插头) 里选为 {guilabel}`聊天补全`, 开启一个有第一条消息的新聊天来让设置生效.

检查变量是否生效
: 你可以点击输入栏左侧的 {guilabel}`魔棒` 图标, 在 {menuselection}`变量管理器 --> 聊天` 选项卡中，查看所有变量是否已按你的设定正确加载. 如果你认为你写的没错, 但是管理器中什么都没有, 请重复第二步.

:::{hint}
至于如何根据不同的开局设定不同的初始变量, 我们将在后续的教程中进行讲解.
:::

## 变量提示词: 让 AI 理解变量

在上一章节, 我们在 `[initvar]` 条目中设置了初始化变量, 但该条目处于禁用状态并未发送给 AI. 那么, 如何让AI "看" 到并根据我们的意图去操作这些变量呢? 答案是在其他条目中编写相应的提示词.

所有已初始化的变量都存放在一个名为 `stat_data` 的数据块中 (你可以在变量编辑器里确认这一点). 要向 AI 展示这些变量的当前状态, 我们可以使用酒馆助手的一个强大宏: `{{get_message_variable::stat_data}}`.

这个宏能将 `stat_data` 中的所有内容以 JSON 格式直接插入到它所在的位置. 例如, 如果我们已经成功设置和初始化了变量, 则在开启的蓝灯条目中书写 `{{get_message_variable::stat_data}}` 将会发送给 AI 以下结果:

:::::{tabs}
::::{tab} 设置的变量

```yaml
角色:
  络络:
    好感度: 30
    心情: 开心
  青空莉:
    好感度: 60
    心情: 郁闷
世界:
  日期: 2025-07-26
  时间: 21:00
```

::::

::::{tab} 在蓝灯中书写的内容

```text
<status_description>
{{get_message_variable::stat_data}}
</status_description>
```

::::

::::{tab} 发送给 AI 的结果

```text
<status_description>
{"角色":{"络络":{"好感度":30,"心情":"开心"},"青空莉":{"好感度":60,"心情":"郁闷"}},"世界":{"日期":"2025-07-26","时间":"21:00"}}
</status_description>
```

::::
:::::

虽然 AI 能够理解这样发送的 JSON, 但这样直接抛一整个数据块并不方便我们控制.

### 编写

为了实现更精准的控制, 我们推荐一种更结构化的方法. 请看下面的示例 (仅仅是示例!), 它与我们之前设置的变量一一对应:

:::::{tabs}
::::{tab} 中文

```yaml
---
<status_description>
# 以下内容是当前的状态数值，你可以通过命令进行操作修改，但绝对不要将以下内容直接输出在你的回复中
角色:
  络络:
    好感度: {{get_message_variable::stat_data.角色.络络.好感度}} # 0-100
    心情: {{get_message_variable::stat_data.角色.络络.心情}} # 仅有开心、难过、哭泣、生气四种心情
  青空莉:
    好感度: {{get_message_variable::stat_data.角色.青空莉.好感度}}
    心情: {{get_message_variable::stat_data.角色.青空莉.心情}}
世界:
  日期: {{get_message_variable::stat_data.世界.日期}}
  时间: {{get_message_variable::stat_data.世界.时间}}
</status_description>
rule: 你必须在下次回复的末尾输出变量更新分析
check list:
  - 如果角色注意到了<user>的行为，根据他们的态度将'好感度'更新±(1~4)
  - 根据剧情和人设适当地调整'心情'
  - 根据当前日期时间更新'日期'和'时间'
format: |-
  <update>
  <update_analysis>/*使用不超过120个英语单词*/
  - ${计算经过的时间: ...}
  - ${根据当前情节是否足够特殊、时间跨度是否远超正常情况，判断是否允许变量值发生戏剧性变化: 是/否}
  - ${根据`check list`中列出的对应规则，分析每个变量是否需要更新: ...}
  </update_analysis>
  _.set('${变量, 例如'角色.络络.好感度'}', ${旧值}, ${新值}); // ${简述更新原因}
  _.set('${变量}, ${新值}); // ${简述更新原因}
  ...
  </update>
```

::::

::::{tab} 英文

```yaml
---
<status_description>
# 以下内容是当前的状态数值，你可以通过命令进行操作修改，但绝对不要将以下内容直接输出在你的回复中
角色:
  络络:
    好感度: {{get_message_variable::stat_data.角色.络络.好感度}} # 0-100
    心情: {{get_message_variable::stat_data.角色.络络.心情}} # 仅有开心、难过、哭泣、生气四种心情
  青空莉:
    好感度: {{get_message_variable::stat_data.角色.青空莉.好感度}}
    心情: {{get_message_variable::stat_data.角色.青空莉.心情}}
世界:
  日期: {{get_message_variable::stat_data.世界.日期}}
  时间: {{get_message_variable::stat_data.世界.时间}}
</status_description>
rule: you must output variable update analysis in the end of the next reply
check list:
  - update '好感度' by ±(1~4) according to characters' attitudes towards <user>'s behavior respectively only if they're currently aware of it
  - update '心情' according to current plot and the character setting
  - update '日期' and '时间' to the current date and day of the week respectively
format: |-
  <update>
  <update_analysis>/*IN ENGLISH, no more than 120 words*/
  - ${calculate time passed: ...}
  - ${decide whether dramatic updates are allowed as it's in a special case or the time passed is more than usual: yes/no}
  - ${analyze every variable based on its corresponding item in `check list`: ...}
  </update_analysis>
  _.set(${variable, such as '角色.络络.好感度'}, ${old_value}, ${new_value}); // ${brief reason for change}
  _.set(${variable}, ${new_value}); // ${brief reason for change}
  ...
  </update>
```

::::
:::::

这个示例清晰地告诉了 AI 三件事: 当前的变量情况、更新规则和输出格式; 其中只有输出格式必须是 `_.set('变量', 值)`, 而其他部分都是高度可自定义的.

为了完全理解上述提示词，你需要掌握

- 酒馆助手宏 `{{get_message_variable::变量}}`
- 我们的输出格式提示词 (`format` 部分) 写法

#### 解释: 酒馆助手宏 `{{get_message_variable::变量}}`

> 这一部分在视频中讲解的可能更清晰

要在酒馆中插入动态变化的内容, 我们通常会使用"宏". \
一个每个人都用过的宏是 `{{user}}` (我更建议你用等效的 `<user>`): 当发送给 ai 时, 它会被替换为我们的玩家角色名. 同理, `{{char}}` 会被替换为角色卡名. \
你可以通过在酒馆输入框输入 `/help macros` 并 {kbd}`回车` 来了解酒馆提供了哪些宏.

为了扩展酒馆的功能、更好地支持变量, 酒馆助手允许你自己注册酒馆助手宏, 并提供了 `{{get_message_variable::变量}}` 宏.

我们前面提到过 `{{get_message_variable::stat_data}}` 可以将整个 `stat_data` "文件夹" 以 JSON 格式插入到世界书中:

:::::{tabs}
::::{tab} 设置的变量

```yaml
角色:
  络络:
    好感度: 30
    心情: 开心
  青空莉:
    好感度: 60
    心情: 郁闷
世界:
  日期: 2025-07-26
  时间: 21:00
```

::::

::::{tab} 在蓝灯中书写的内容

```text
<status_description>
{{get_message_variable::stat_data}}
</status_description>
```

::::

::::{tab} 发送给 AI 的结果

```text
<status_description>
{"角色":{"络络":{"好感度":30,"心情":"开心"},"青空莉":{"好感度":60,"心情":"郁闷"}},"世界":{"日期":"2025-07-26","时间":"21:00"}}
</status_description>
```

::::
:::::

这其实是我们将 `{{get_message_variable::变量}}` 的 `变量` 部分填写为 `stat_data`, 因而酒馆助手会将该宏替换为 `stat_data` "文件夹" 下的所有变量.

显然我们也可以只指定某个部分, 假设络络的好感度现在是 `30`、心情是 `开心`:

- `{{get_message_variable::stat_data.角色.络络}}` 将会替换为 `{"好感度":30,"心情":"开心"}`
- `{{get_message_variable::stat_data.角色.络络.好感度}}` 将会替换为 `30`

可对于数组呢? 我们该如何选择其中第一个元素?

```yaml
角色:
  络络:
    心情:
      - 60  <-- 我们怎么选择它?
      - 开心
```

要获取数组中的其中一个, 我们使用中括号加上序号. 序号从 `0` 开始计数, `[0]` 代表数组中的第一个元素:

- `{{get_message_variable::stat_data.角色.络络.心情[0]}}` 将会替换为 `60`
- `{{get_message_variable::stat_data.角色.络络.心情[1]}}` 将会替换为 `开心`

由此, 在前面的变量提示词中, 我们无非是依次列举了变量名和对应的值, 并在其后 "偷懒地" 用 YAML 风格注释 `#` 对其值进行说明.

```yaml
---
<status_description>
# 以下内容是当前的状态数值，你可以通过命令进行操作修改，但绝对不要将以下内容直接输出在你的回复中
角色:
  络络:
    好感度: {{get_message_variable::stat_data.角色.络络.好感度}} # 0-100
    心情: {{get_message_variable::stat_data.角色.络络.心情}} # 仅有开心、难过、哭泣、生气四种心情
  青空莉:
    好感度: {{get_message_variable::stat_data.角色.青空莉.好感度}}
    心情: {{get_message_variable::stat_data.角色.青空莉.心情}}
世界:
  日期: {{get_message_variable::stat_data.世界.日期}}
  时间: {{get_message_variable::stat_data.世界.时间}}
</status_description>
```

#### 解释: 输出格式提示词写法

在书写输出格式提示词 (`format` 部分) 时, 我采用了我们惯用而 AI 能听懂的几种特殊格式:

- `${描述}`: AI 需要根据 "描述" 将它替换为对应的内容. 例如 `衣着: ${具体描述角色当前衣着}` 可能输出 `衣着: 粉金色宽松T恤睡裙`;
- `/*要求*/`: AI 仅会听从 "要求" 而不对它进行输出. 例如 `/*以下内容应该按英文输出*/` 会让 AI 更倾向于用英文输出下面的内容;
- `...`: AI 需要仿照之前给定的规则和内容补充输出. 例如 `其他角色: ...` 会让 AI 根据前面给定的 `络络` 输出格式, 补充其他角色的输出;
- 其他内容原封不动地进行输出.

```yaml
format: |-
  <update>
  <update_analysis>/*使用不超过120个英语单词*/
  - ${计算经过的时间: ...}
  - ${根据当前情节是否足够特殊、时间跨度是否远超正常情况，判断是否允许变量值发生戏剧性变化: 是/否}
  - ${根据`check list`中列出的对应规则，分析每个变量是否需要更新: ...}
  </update_analysis>
  _.set('${变量, 例如'角色.络络.好感度'}', ${旧值}, ${新值}); // ${简述更新原因}
  _.set('${变量}, ${新值}); // ${简述更新原因}
  ...
  </update>
```

### 这只是提示词

当前的变量情况、更新规则和输出格式等**只是提示词, 写法只取决于你的想象**; 这里只是列了一种方便讲解的变量更新提示词. \
如果你熟悉 MVU 原帖下的提示词或 Nova Creator 写卡预设, 你可以发现这里提示词与它们有很大区别: 这里的提示词引入了 checklist、recall 和更多的思维链 (Chain of Thought, CoT) 要求, 并且没在 `format` 之后还补充一个变量更新输出示例 `example`.

你还能在以下地方看到完全不同的提示词写法:

- {lolodesu_path}`日记络络 <src/日记络络>`
- {stagedog_path}`萝莉元首自改版 <src/角色卡/萝莉元首>` (应该是提示词模板第一次被除作者外的人使用)
- {stagedog_path}`晚安络络 <src/角色卡/晚安络络>`
- {stagedog_path}`妹妹请求你保护她露出 <src/角色卡/妹妹请求你保护她露出>`
- [角色阶段 - 附录: 变量更新规则的其他写法](https://sillytavern-stage-girls-dog.readthedocs.io/工具经验/角色阶段/复杂版/#id19)

:::::{tabs}
::::{tab} 日记络络

- 所有变量提示词都在 D1
- 补充一个 D0 recall 来稳定格式

:::{figure} 变量提示词_日记络络.png
:::
::::

::::{tab} 萝莉元首自改版

- 变量更新规则和输出格式在 D4
- 当前变量情况在 D1
- 补充一个 D0 recall 来稳定格式

:::{figure} 变量提示词_萝莉元首自改版.png
:::
::::

::::{tab} 妹妹请求你保护她露出

- 当前变量情况在 D4, 角色变量常驻而露出系统变量仅在心爱、一果在场时发送
- 变量更新规则也在 D4, 和当前变量情况放在一起
  - 常驻变量的更新规则由 check list 给出
  - 露出系统变量的更新规则仅在 check list 中要求 `参考露出系统输出的<ExposurePrompt>来更新`; 而露出系统会根据剧情在正文中插入`<ExposurePrompt>`来提示任务完成、获得积分等
- 输出格式在 D0 中给出

:::{figure} 变量提示词_妹妹请求你保护她露出.png
:::
::::
:::::

### 酒馆正则: 不发送变量更新文本

有了变量提示词, AI 将会在回复时输出 `<update>` 部分, 在其中先对变量该如何更新进行分析, 然后输出 `_.set(...)` 语句. \
而 MVU 脚本将会读取 AI 回复和用户输入中的 `_.set(...)`, 对变量在该楼层的值进行实际更新.

也就是说:

重复一遍, 变量提示词的写法只取决于你的想象
: 你甚至不必拘泥于放在 `<update>` 中, 因为 MVU 脚本会读取 AI 回复和用户输入中任意位置的 `_.set(...)`.

你可以为不同开局设置不同的初始变量
: "MVU 脚本会读取 AI 回复和用户输入中的 `_.set(...)`". 也就是说, 你写在开局消息中的 `_.set(...)` 也会被读取.

AI 输出的 `<update>` 没必要再发给 AI
: `<update>` 已经被 MVU 脚本使用了, 而 AI 在后续回复中不需要参考它: 我们会发给 AI 变量更新规则, 不是吗?
: 如果我们保留所有楼层的 `<update>` 还发给 AI:
  <!-- markdownlint-disable MD032 MD007 -->
  - 首先, 这浪费了 token
  - 其次, AI 可能不必要地花费注意力去学习之前的 `<update>` 而更少地将注意力放在剧情上
  - 最后, AI 可能偷懒直接照抄之前的 `<update>` 而不真的分析思考该如何更新变量!
  <!-- markdownlint-enable MD032 MD007 -->

因此, 我们需要在后续生成时不发送 `<update>` 部分给 AI——这就用到了酒馆正则.

酒馆正则能够捕获 AI 回复和用户输入中的特定文本, 让它在某些用途下被替换为指定内容:

- {guilabel}`仅格式提示词`: 在发送给 AI 时被替换为指定内容
- {guilabel}`仅格式显示`: 在酒馆中显示时被替换为指定内容
- 两个都不勾选: 在 AI 输出接收到时或用户输入发送出去时就被**永久**替换掉

:::{figure} 酒馆正则.png
:::

:::{hint}
如果你还不够理解以上说明, 也许可以看看自己酒馆中的预设配套正则或者角色卡里的美化正则.
:::

为了便于大家操作, 青空莉已经提前制作了可作用于 `<update>` 和 MVU 原帖的 `<UpdateVariable>` 风格变量更新输出的酒馆正则, 你只需下载导入其中一个版本即可:

- 美化版 ([点此查看演示](https://gitgud.io/StageDog/tavern_resource/-/raw/main/src/正则/变量更新/美化版.mp4))
  - [[不发送]去除变量更新](https://gitgud.io/StageDog/tavern_resource/-/raw/main/src/正则/变量更新/regex-[不发送]去除变量更新.json?inline=false)
  - [[美化]变量更新中](https://gitgud.io/StageDog/tavern_resource/-/raw/main/src/正则/变量更新/regex-[美化]变量更新中.json?inline=false)
  - [[美化]完整变量更新](https://gitgud.io/StageDog/tavern_resource/-/raw/main/src/正则/变量更新/regex-[美化]完整变量更新.json?inline=false)
- 折叠版 ([点此查看演示](https://gitgud.io/StageDog/tavern_resource/-/raw/main/src/正则/变量更新/折叠版.mp4))
  - [[不发送]去除变量更新](https://gitgud.io/StageDog/tavern_resource/-/raw/main/src/正则/变量更新/regex-[不发送]去除变量更新.json?inline=false)
  - [[折叠]变量更新中](https://gitgud.io/StageDog/tavern_resource/-/raw/main/src/正则/变量更新/regex-[折叠]变量更新中.json?inline=false)
  - [[折叠]完整变量更新](https://gitgud.io/StageDog/tavern_resource/-/raw/main/src/正则/变量更新/regex-[折叠]完整变量更新.json?inline=false)
- 仅提示版 (不能通过点击来展开变量更新文本)
  - [[不发送]去除变量更新](https://gitgud.io/StageDog/tavern_resource/-/raw/main/src/正则/变量更新/regex-[不发送]去除变量更新.json)
  - [[提示]变量更新中](https://gitgud.io/StageDog/tavern_resource/-/raw/main/src/正则/变量更新/regex-[提示]变量更新中.json?inline=false)
  - [[提示]完整变量更新](https://gitgud.io/StageDog/tavern_resource/-/raw/main/src/正则/变量更新/regex-[提示]完整变量更新.json?inline=false)

### 回顾

至此, 我们的变量环境已搭建完毕:

- 我们在 `[initvar]` 条目中正确设置了变量和它们的初始值
- AI 通过 `<status_description>` 了解了当前的变量状态
- AI 通过 `check list` 了解了变量更新规则
- AI 通过 `format` 知晓了更新变量所需的输出格式
- 我们用酒馆正则让 AI 之前输出的变量更新文本不会再发送给 AI, 防止 AI 过拟合

这套环境已经能有效替代传统的、需要每层都完整输出所有文本的状态栏, 能够精准地提醒 AI 当前的剧情状态.

但是玩家还看不到这些. 也许我们想为玩家显示好感度数值, 或者更好地, 根据当前好感度数值所在区间, 显示一个特殊的好感度阶段名称. 这要怎么做呢?

:::::{tabs}
::::{tab} 角色好感度阶段名称

```yaml
心语:
  associated variable: 心语好感度({{getvar::心语好感度}})
  stage name:
    阶段1: 甜蜜试探(24以下)
    阶段2: 甘甜陷阱(25~49)
    阶段3: 虚实交错(50~74)
    阶段4: 坦诚相见(75~99)
    阶段5: 完美恋人(100以上)
```

::::

::::{tab} 状态栏

:::{figure} 状态栏示例.png
:::
::::
:::::

## 为玩家显示变量状态栏

MVU有一个巧妙的设计: 它会在 AI 回复结束后, 自动在回复末尾附加一串特殊字符: `<StatusPlaceHolderImpl/>`. \
这串字符本身只是一个占位符, 没有任何作用. 但你可以用酒馆正则捕获它, 将它

- {guilabel}`仅格式提示词` 为空, 从而不对 AI 发送这段文本, 防止 AI 模仿这串特殊字符而在后续自己输出它
- {guilabel}`仅格式显示` 为我们想要展示的任何内容

### 仅格式提示词: 不发送状态栏占位符

我们新增一个局部正则, 命名为 `[不发送]状态栏` (按照青空莉的正则命名习惯, `[不发送]` 表示不发送给 AI, `[隐藏]` 表示不显示给玩家, 另有其他 `[按作用命名]`):

:::::{tabs}
::::{tab} 正则设置

```yaml
脚本名称: [不发送]状态栏
查找正则表达式: <StatusPlaceHolderImpl/>
替换为:
作用范围:
  - [ ] 用户输入
  - [x] AI输出
短暂:
  - [ ] 仅格式显示
  - [x] 仅格式提示词
```

::::

::::{tab} 图片参考
:::{figure} 正则_不发送状态栏.png
:::
::::
:::::

### 仅格式显示: 显示状态栏

同样地, 我们新建一个局部正则, 命名为 `[界面]状态栏`. 这次我们将勾选 {guilabel}`仅格式显示`, 将占位符替换为我们要显示的状态栏:

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

#### 文本状态栏

与酒馆宏相同, `{{get_message_variable::变量}}` 除了作为提示词在发送给 ai 时被替换, 也会在显示时被替换. \
因此我们可以将 `<StatusPlaceHolderImpl/>` 替换为一串带有 `{{get_message_variable::变量}}` 的文本, 来显示变量值:

```text
💖 络络当前好感度: {{get_message_variable::stat_data.角色.络络.好感度}}
```

这样, 每次 AI 回复的下方都会自动显示这行文字, 并显示正确的数值.

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
💖 络络当前好感度: {{get_message_variable::stat_data.角色.络络.好感度}}
</div>
```

#### 前端状态栏

至于包含复杂脚本的 HTML 状态栏, 这已超出本教程范围. \
你可以尝试请 AI 辅助编写 ([我在类脑的直播教程](https://discord.com/channels/1134557553011998840/1372487825471176805)/[青空莉的文档](https://sillytavern-stage-girls-dog.readthedocs.io/工具经验/酒馆助手编写环境配置/)), 或直接使用 Nova Creator 等成熟预设.

:::{admonition} 推荐的 HTML 状态栏获取变量和控制显示方法
:class: hint, dropdown

```{code-block} html
<html>
  <head></head>
  <body>
    <div class="card-body">
      <div class="section">
        <div class="section-header">
          <span>[角色名] 核心状态</span>
          <span>▼</span>
        </div>
        <div class="section-content expanded">
          <div class="property">
            <div class="property-name">好感度</div>
            <div class="property-value-container">
              <span class="value-main" id="[charname-lowercase]-affection">--</span>
            </div>
          </div>
          <div class="property">
            <div class="property-name">[某属性名称]</div>
            <div class="property-value-container">
              <span class="value-main" id="[charname-lowercase]-[variable-name]">--</span>
            </div>
          </div>
        </div>
      </div>
      <div class="section">
        <div class="section-header">
          <span>世界状态</span>
          <span>►</span>
        </div>
        <div class="section-content"></div>
      </div>
    </div>
    <script>
      function toggleSection($header) {
        const $content = $header.next('.section-content');
        $content.toggleClass('expanded');
        const $arrow = $header.find('span:last-child');
        $arrow.text($content.hasClass('expanded') ? '▼' : '►');
      }

      function populateCharacterData() {
        // 用 `getAllVariables()` 获取变量
        const all_variables = getAllVariables();

        // 用 `_.get` 提取具体某个变量
        const affection_value = _.get(all_variables, 'stat_data.[角色名].好感度', 'N/A');
        // 用 jquery 设置文本
        $('#[charname-lowercase]-affection').text(affection_value);

        const another_value = _.get(all_variables, 'stat_data.[角色名].[变量名]', 'N/A');
        $('#[charname-lowercase]-[variable-name]').text(another_value);
      }

      $(() => {
        populateCharacterData();

        // 用 jquery 处理点击事件
        $('.section-header').on('click', function () {
          toggleSection($(this));
        });
      });
    </script>
  </body>
</html>
```

:::

### 回顾

至此, 我们制作了这样一个状态栏:

- 显示不消耗任何 token
- AI 对它只需要更新需要更新的变量, 而不需要像传统状态栏一样每次都输出所有信息

**但不要让这里的状态栏教程限制了你的想象力.** 你可能会想: 既然如此, 那我是不是该把原来传统状态栏会展示的一些细节信息 (如衣着、周围地点等) 也弄成变量, 每次都在变量列表里发给 AI 哪怕它们没 `角色.络络.好感度` 那么重要, 而仅仅为了在状态栏里能以变量的形式替换、展示它?

- 你可以不在变量列表中列出某些变量, 只要求 AI 更新它. 也就是说, 你不在提示词里写 `{{get_message_variable::stat_data.细节信息.周围地点}}` 来告诉 AI 它现在的值是多少, 而只在 `format` 中要求 AI `_.set('细节信息.周围地点', ${用一句话列出几个地点，旨在引导<user>下一步行动})` 来更新它.
- 你没必要非要用 `<StatusPlaceHolderImpl/>` 来显示状态栏, 你可以用其他任何方式来显示它. 你可以自己定义一个输出格式, 在里面要求 AI 输出周围地点等细节信息, 而用酒馆正则捕获这个格式, 替换为带变量的状态栏. 如{stagedog_path}`妹妹请求你保护她露出 <src/角色卡/妹妹请求你保护她露出>`中的状态栏, 好感度等来自变量, 衣着等来自 ai 本次输出.

总之, 通过设置变量, 我们已经可以动态展示剧情状态, 实现稳定更新的状态栏. 这是一个很棒的起点, **但也仅仅是一个起点.**

## 提示词模板: 选择性发送提示词

### 理论篇

在传统的角色卡编写中, 我们通常会录入角色的固定人设和世界的故事背景. 更用心的作者或许还会进一步设想角色在不同阶段下的反应: 在恋爱后与初识时截然不同的态度, 或是在某个重大事件发生前后世界的变迁.

然而在实际应用中, 要实现这种动态变化相当困难. 因为 AI 在每次交互时都会读取你所提供的全部信息, 但它的注意力分配是随机的, 非常容易混淆不同情境下的设定.

举个例子: 我先是设定了 100 字的现代背景, 之后又根据主角穿越后的情况, 补充了 300 字的古代背景. \
我的设想是, 只有在角色触发“穿越”事件后, AI 才应采用古代背景进行描述. \
但结果往往是, AI 仅仅因为古代背景的篇幅更长, 就错误地将其作为当前的主要设定, 导致整个故事线陷入混乱, 无法按预期展开.

要解决这个问题, 思路其实非常直接: **让 AI 在特定条件下 "看" 不到那部分暂时无关的设定.**

下面是一份典型的 "全蓝灯" 提示词:

```text
【这是一个现代世界，故事发生在中国】   // 背景或世界观
【络络：女、17岁、高中生、喜欢吃炸鸡】 // 人物设定
【络络在与user熟悉之前，会非常拘谨】   // 低好感度时候的表现
【络络与user熟悉之后，会非常话痨】     // 高好感度时候的表现
```

对于如此简短的描述, AI 或许还能分辨出络络当前应处于何种状态. 但当设定变得复杂, 比如世界观冗长或角色众多时, AI 就往往难以准确处理了.

这时, 我们便可以利用提示词模板插件所提供的 EJS 语法, **将提示词的发送与否和当前变量情况进行关联**.

当**好感度较低**时，我们只发送：

```text
【这是一个现代世界，故事发生在中国】
【络络：女、17岁、高中生、喜欢吃炸鸡】
【络络现在的好感度是{{get_message_variable::络络.好感度}}，因此她应当表现得非常拘谨】 // 低好感度时候的表现
```

而**随着好感度的不断升高**, 发送的提示词则变为:

```text
【这是一个现代世界，故事发生在中国】
【络络：女、17岁、高中生、喜欢吃炸鸡】
【络络现在的好感度是{{get_message_variable::络络.好感度}}，因此她应当表现得像个话痨】 // 高好感度时候的表现
```

这样一来, AI 就不会再混淆络络在两种状态下的表现了.

当然, 上面的例子只是为了说明原理. 在实际创作中, 为了避免让玩家察觉到角色性格的突兀转变, 我们可能需要追求更平滑的过渡.

因此, 一个更优的设计可以是这样:

```text
【这是一个现代世界，故事发生在中国】
【络络：女、17岁、高中生、喜欢吃炸鸡】

当好感度为0~40时发送：
【络络现在的好感度是{{get_message_variable::络络.好感度}}。在此阶段，她应当表现得非常拘谨。随着好感度的提升，她可能会慢慢变得愿意与人交谈。】

当好感度为40~80时发送：
【络络现在的好感度是{{get_message_variable::络络.好感度}}。在此阶段，她表现得相对平和，已经能与{{user}}进行简单的交流。随着好感度的提升，她甚至可能会主动和user开玩笑。】

当好感度为80~100时发送：
【络络现在的好感度是{{get_message_variable::络络.好感度}}。在此阶段，她对于陌生人可能依旧拘谨，但对于熟人，尤其是user，一定会表现得非常话痨。】
```

像这样分阶段、渐进式的提示词, 其效果显然比“一刀切”的状态切换要自然得多.

**不过一切提示词都取决于你的实际需求.** 如果你想要实现的是世界的突变而非角色的动态成长, 例如一觉醒来世界从现代变为古代, 那么你的提示词自然也无需进行这样平滑的过渡.

理解了以上内容, 你便掌握了利用 EJS 选择性发送提示词的核心理论.

### 实操篇

:::{hint}
建议使用成熟的代码软件并用 AI 辅助编写 ([我在类脑的直播教程](https://discord.com/channels/1134557553011998840/1372487825471176805)/[青空莉的文档](https://sillytavern-stage-girls-dog.readthedocs.io/工具经验/酒馆助手编写环境配置/)), 你也可以下载 webstorm, 它对 `.ejs` 结尾的提示词模板语法文件有直接的报错检查.
:::

接下来, 让我们进入实操环节. 我们将继续以 "好感度动态人设" 为例, 亲手实现根据好感度的不同, 发送不同提示词的功能.

在开始之前, 请放轻松. 如果你没有任何编程基础, 可能会觉得下面的符号有些陌生. **这完全正常!**

我们的目标是理解其原理. 在学会之后, 你就可以使用 Nova Creator 等写卡预设或自己更准确地指挥 AI 进行编写代码, 并且能够自己看看他出错在什么地方.

#### 区分代码与文本的核心语法: `<%_ _%>`

首先我们要明白, 提示词模板扩展的 EJS 语法是一种能将 "代码指令" 嵌入到 "普通文本" 中的技术. 为了让系统知道哪部分是给它下达指令的代码, 哪部分是需要发送给 AI 的故事情节, 我们需要一个特殊的标记. 这个标记就是 `<%_ _%>`.

你可以把它想象成一对 "特殊的括号". 所有被这对括号包裹起来的内容, 都会被系统理解为一条需要执行的代码指令; 而括号外面的所有内容, 则被视为普通的提示词文本, 和正常世界书编写内容无异.

#### 用 `if` 设置条件

在 EJS 中, 我们最常使用的指令就是 `if`.

其基本结构是:

```{code-block} js
:force:
if (设定的条件) {
  这里是条件成立时，才会被发送的提示词
}
```

这行代码的意思是: **如果 (if)** 括号里的 "条件" 成立了, 那么花括号 `{}` 里的提示词就会被发送.

现在, 我们将这个结构用 EJS 的 "特殊括号" 包裹起来. 请注意, `if (...) {` 是指令的开始部分, 而 `}` 是指令的结束部分, 它们需要被分别包裹:

```{code-block} js
:force:
<%_ if (设定的条件) { _%>
这里是条件成立时，才会被发送的提示词
<%_ } _%>
```

你看, 通过换行, 整个结构变得清晰易读. 现在, 你再回头看之前 MVU 卡中的代码, 是不是感觉变得能看懂些了?

#### 用 `getvar()` 获取变量

但在实际代码中, `if` 后的括号里并不是 "某个条件" 这几个字, 而是一长串代码. 我们就是通过编写这长串代码, 将提示词与变量情况相关联, 从而判断提示词是否该被发送: 比如角色好感度大于 30.

`getvar()` 函数就是我们获取变量数据的信使. 它能准确地从我们之前设置的变量文件夹 (`stat_data`) 中, 取出我们需要的那个变量值. ~~令人惊讶地是,~~ 用它获取变量值的方法和 `{{get_message_variable::变量}}` 差不多!

还记得我们之前是怎么获取络络好感度的吗? `{{get_message_variable::stat_data.角色.络络.好感度}}`. 与之相应地, 我们用 `getvar()` 获取络络好感度的方法是 `getvar('stat_data.角色.络络.好感度')`.

#### 组装一个完整的EJS代码块

现在, 我们将所有部件组装起来, 看看一个完整、正确的 EJS 代码块是什么样的:

```{code-block} js
:force:
<%_ if (getvar('stat_data.角色.络络.好感度') < 30) { _%>
这里是当络络的好感度小于30时，我们希望AI看到的专属描述
<%_ } _%>
```

#### 用 `matchChatMessages()` 模拟绿灯

除了 `getvar()`, 你也可以在 `if` 中使用 `matchChatMessages()` 来像绿灯那样, 只在正文最后一次用户输入和最后一次 AI 回复中提到了某个关键字时发送一段提示词. 例如:

```{code-block} js
:force:
<%_ if (matchChatMessages(['络络', '笨蛋'])) { _%>
这里是当正文最后一次用户输入和最后一次 AI 回复中提到了 "络络" 或 "笨蛋" 时，我们希望AI看到的专属描述
<%_ } _%>
```

#### 用 `else` 表示条件不成立时发送提示词

你已经学会了 `if`, 它可以处理 "条件成立时发送提示词". 但如果我们的逻辑不止 "条件成立时发送提示词", 还有 "条件不成立时发送提示词" 的情况呢? 让我们用 `else` (否则) 来处理:

```{code-block} js
:force:
if (设定的条件) {
  这里是条件成立时，才会被发送的提示词
} else {
  这里是条件不成立时，才会被发送的提示词
}
```

这样一来, 我们可以对络络低好感度和高好感度的情况分别发送提示词:

```{code-block} js
:force:
<%_ if (getvar('stat_data.角色.络络.好感度') < 30) { _%>
这里是当络络的好感度小于30时，我们希望AI看到的专属描述
<%_ } else { _%>
这里是当络络的好感度大于等于30时，我们希望AI看到的专属描述
<%_ } _%>
```

#### 用 `else if` 构建多层逻辑

为了让好感度变化更加平滑, 我们可以增加更多条件判断, 让不同区间下的好感度 (低好感、中好感、高好感) 对应有完全不同的提示词.

```{code-block} js
:force:
if (设定的条件1) {
  这里是条件1成立时，才会被发送的提示词
} else if (设定的条件2) {
  这里是上面的条件1不成立，而条件2成立时，才会被发送的提示词
} else {
  这里是所有条件都不成立时，才会被发送的提示词
}
```

`else if`
: 可以理解为 **"否则，如果……"**. 它在**前一个 `if` 条件不成立**时, 提供一个新的判断条件. 你可以添加任意多个 `else if` 来构建更复杂的逻辑链.

`else`
: 可以理解为 **"在其他所有情况下"**. 它总是放在逻辑链的最后, 当前面所有的 `if` 和 `else if` 条件**都不成立**时, 它会提供一个最终的、默认的备用方案.

让我们用络络好感度来举一个更生动的例子:

```{code-block} js
:force:
<%_ if (getvar('stat_data.角色.络络.好感度') < 30) { _%>
【络络对你态度平淡，甚至有些冷漠。】
<%_ } else if (getvar('stat_data.角色.络络.好感度') < 60) { _%>
【络络对你抱有好感，但仍保持着一些距离。】
<%_ } else { _%>
【络络现在非常信任你，愿意和你分享她的小秘密。】
<%_ } _%>
```

这段代码的逻辑非常清晰, 而且是**按顺序执行**的:

首先检查 `if`
: 程序会先判断 "络络的好感度" 是否小于 30. \
**如果成立** (比如好感度是 20), 则发送第一段描述, 然后**整个逻辑块结束**, 后面的 `else if` 和 `else` 都不会被执行.

然后检查 `else if`
: 如果第一个 `if` 条件**不成立** (比如好感度是 45), 程序会接着判断 `else if` 的条件, 即好感度是否小于 60. \
**如果成立**, 则发送第二段描述, 然后逻辑块结束.

最后执行 `else`
: 如果前面的 `if` 和 `else if` 条件**都不成立** (比如好感度是 80), 程序就会执行 `else` 部分, 发送最后那段默认的描述.

你看, 通过 `if`、`else if` 和 `else` 的组合, 我们可以像搭建阶梯一样, 构建出层次分明、逻辑严谨的互动反应.

再举一个判断文本是否相等的简单例子:

```{code-block} js
:force:
<%_ if (getvar('stat_data.事件.天气') === '晴天') { _%>
【今天阳光明媚，适合出门散步。】
<%_ } else if (getvar('stat_data.事件.天气') === '雨天') { _%>
【外面下着雨，记得带伞。】
<%_ } else { _%>
【今天天气一般。】
<%_ } _%>
```

我们用 `===` 来判断变量是否 "等于" 某个值 (这里是 `'晴天'` 或 `'雨天'`).

- **如果**天气是 "晴天", AI 会看到第一句话.
- **否则，如果**天气是 "雨天", AI 会看到第二句话.
- **在其他所有情况下** (比如天气是 "多云" 或 "阴天"), AI 看到的都会是最后那句 "天气一般".

恭喜你! 现在, 你已经掌握了利用 EJS 编写动态提示词的核心逻辑. 通过 `if`、`else if` 和 `else` 的组合, 你已经可以构建出丰富多变的互动逻辑了.

#### 变量不存在该怎么办

你也许已经用上了 MVU beta, 可以在游玩中途新插入变量. 那么你会遇到一个问题: 该如何处理变量不存在的情况? 你可以:

判断变量是否存在
  :::{code-block} js
  getvar('stat_data.角色.络络.好感度') !== undefined
  :::

变量存在则使用值，不存在则使用默认值
  :::{code-block} js
  getvar('stat_data.角色.络络.好感度', { defaults: 0 })
  :::

### 另.用 `<%= _%>` 填写提示词

除了用 `<%_ 代码 _%>` 执行代码逻辑, 提示词模板还支持用 `<%= 表达式 _%>` 来将表达式的值直接填入提示词. 也就是说, `<%= getvar('stat_data.角色.络络.好感度') _%>` 和 `{{get_message_variable::stat_data.角色.络络.好感度}}` 是等价的.

当然 `<%= 表达式 _%>` 能执行代码因而更为灵活. 假设 `stat_data.角色` 中存储了其他角色, 我们可以这样列出好感度低于 30 的所有角色: (只是展示可以做到, 具体你可以让 ai 编写)

```{code-block} js
:force:
当前好感度在 30 以下的人物:
<%=
  _(Object.entries(getvar(data, 'stat_data.角色')))
    .filter(([_key, value]) => value.好感度 < 30)
    .map(([key]) => key)
    .value();
_%>
```

### 验证发送结果

你可以通过*酒馆后台*或*酒馆助手的查看提示词发送情况功能*来查看结果是否被正确发送.

## 用酒馆助手脚本增、删、改、查变量

AI 很不会数值计算, 相比起将商店购物等功能交给 AI 来处理, 不如由我们的酒馆助手前端界面或脚本的代码来计算, 而将计算过程日志和结果发送给 AI. 酒馆助手前端界面或脚本的编写方法请参考[我在类脑的直播教程](https://discord.com/channels/1134557553011998840/1372487825471176805)或[青空莉的文档](https://sillytavern-stage-girls-dog.readthedocs.io/工具经验/酒馆助手编写环境配置/).

但也许你并不是想做商店购物之类复杂的事, 你只是想简单地:

修改变量值
: AI 笨到把好感度更新成了负数或者超过了上限 100. 我们得检测到这个错误, 修改回变量值.

查询变量更新情况
: 我们希望知道角色好感度在这次剧情中突破了 30, 并基于此用酒馆提示框弹出一条消息.

新增变量
: 我们想在好感度**第一次**超过 30 后发送某段提示词, 而即便之后好感度又下降到了 30 以下, 这段提示词也依旧发送. 这需要我们能在好感度第一次超过 30 时, 新增一个变量来记录这件事.

删除变量
: 角色死亡了! 我们得删除所有与该角色相关的变量.

针对变量开始更新、某个变量发生更新、变量更新结束, MVU 都会发送 "事件". 我们只要监听这些事件, 就能进行相应的功能:

:::{hint}
看不懂下面写的是啥? 没关系, 请阅读[我在类脑的直播教程](https://discord.com/channels/1134557553011998840/1372487825471176805)或[青空莉的文档](https://sillytavern-stage-girls-dog.readthedocs.io/工具经验/酒馆助手编写环境配置/), 然后把下面的代码发给 ai 让它学着帮你写.

不过就我看来, 目前让 ai 写这些还不怎么友好, 等 mag 改. 另外有个在自己的界面/脚本中调用 MVU 来解析文本中的 `_.set(...)` 从而更新变量, 但我根本不好解释.
:::

::::{tabs}
:::{tab} 保持好感度不低于 0

```js
eventOn('mag_variable_update_ended', (variables) => {
  if (_.get(variables, 'stat_data.角色.络络.好感度') < 0) {
    _.set(variables, 'stat_data.角色.络络.好感度', 0);
  }
  if (_.get(variables, 'stat_data.角色.青空莉.好感度') < 0) {
    _.set(variables, 'stat_data.角色.青空莉.好感度', 0);
  }
});
```

:::

:::{tab} 好感度突破 30

```js
eventOn('mag_variable_updated', (stat_data, path, old_value, new_value) => {
  // 如果被更新的变量不是 'stat_data.角色.络络.好感度', 则什么都不做直接返回 (return)
  if (path === '角色.络络.好感度') {
    return;
  }

  // --被更新的变量是 'stat_data.角色.络络.好感度'---
  if (old_value < 30 && new_value >= 30) {
    toaster.success('络络好感度突破 30 了!');
  }
});
```

:::

:::{tab} 记录好感度第一次超过 30

```js
eventOn('mag_variable_updated', (stat_data, path, old_value, new_value) => {
  // 如果被更新的变量不是 '角色.络络.好感度', 则什么都不做直接返回 (return)
  if (path === '角色.络络.好感度') {
    return;
  }

  // --被更新的变量是 '角色.络络.好感度'---
  // 如果新的值大于 30, 则记录 'flag.络络好感度突破30' 为 `true`
  //   这可以通过 {{get_message_variable::stat_data.flag.络络好感度突破30}} 来获取
  if (new_value > 30) {
    _.set(stat_data, 'flag.络络好感度突破30', true);
  }
});
```

:::

:::{tab} 青空莉死了!

```js
eventOn('mag_variable_updated', (stat_data, path, old_value, new_value) => {
  // 如果被更新的变量不是 'stat_data.角色.青空莉.死亡', 则什么都不做直接返回 (return)
  if (path === '角色.青空莉.死亡') {
    return;
  }

  // --被更新的变量是 'stat_data.角色.青空莉.死亡'---
  // 如果新的值为 `true`, 则删除所有与青空莉相关的变量
  if (new_value === true) {
    _.unset(stat_data, '角色.青空莉');
  }
});
```

:::
::::

## MVU beta: 允许 AI 在游玩中途增加、删除变量

目前仅提供试运行视频:

:::{raw} html
<div class="responsive-video-container">
  <iframe
    src="https://www.youtube.com/embed/Roh8oa2kbas?si=fEm_U27qU2h3Be15"
    frameborder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    allowfullscreen>
  </iframe>
</div>
:::

上方视频若无法查看, <a href="https://www.youtube.com/watch?v=Roh8oa2kbas" target="_blank" rel="noopener noreferrer">点击跳转 Youtube</a>.

## 附录

### 关于世界书条目的深度

不要滥用深度条目, 它们是插入在对话之间的:

```text
...
D3 条目
用户倒数第二条输入
D2 条目
AI 最后一条回复
D1 条目
用户最后一条输入
D0 条目
```

因此, 在 D0/D1 甚至 D2/D3 等部分塞太多东西会让 ai 对上下文剧情不连贯!

为了让 AI 理解变量是最新的, 你可以偷懒地 (注意, **只是因为你偷懒不想具体研究你的变量在哪最好!**) 将当前变量情况放在 D1, 但变量更新规则完全没必要放这么低!

:::{figure} 世界书条目深度建议.png
:caption: 离在 2024/06/10 时的深度建议
:::

### MVU 作者 mag 的变量更新规则是怎么生效的

MVU 作者 mag 在其示例中, 采用了直接插入整个 `stat_data` 的方法. 让我们看看他的提示词结构: (青空莉调整格式版)

```yaml
<status_description> // do not output following content
{{get_message_variable::stat_data}}
</status_description> // do not output content below directly
<Analysis>/*IN ENGLISH*/
  - calculate time passed: ...
  - decide whether dramatic updates are allowed as it's in a special case or the time passed is more than usual: yes or no
  - list every variable in `<status_description>` section before actual variable analysis: ...
  - Analyze whether this variable satisfies its change conditions, do not output reason:...
  - Ignore summary related content when evaluate.
</Analysis>
rule:
  description: You should output the update analysis in the end of the next reply
  analysis:
    - You must rethink what variables are defined in <status_description> property, and analyze how to update each of them accordingly
    - For counting variables, change it when the corresponding event occur but don't change it any more during the same event
    - When a numerical variable changes, check if it crosses any stage threshold and update to the corresponding stage
    - if dest element is an array, only update and only output the first element, not `[]` block.
  format: |-
    <UpdateVariable>
    <Analysis>
    ${path}: Y/N
    ...
    </Analysis>
    _.set('${path}', ${old}, ${new}); // ${reason}
    </UpdateVariable>
  example: |-
    <UpdateVariable>
    <Analysis>
    悠纪.好感度: Y
    暮莲.日程.周三.上午: Y
    ...
    </Analysis>
    _.set('悠纪.好感度', 33,35); // 愉快的一次讨论，悠纪觉得与你一起是开心的
    _.set('暮莲.日程.周三.上午', "空", "地点：data_center_zone.数据服务器室 行为：检查"); // 暮莲规划了周三上午的日程
    </UpdateVariable>
```

这份提示词实际上是从青空莉的{stagedog_path}`妹妹请求你保护她露出 <src/角色卡/妹妹请求你保护她露出>`改造而来. \
我个人认为, 其中 `<Analysis>/*IN ENGLISH*/</Analysis>` 的部分虽然意图是作为思维链引导, 但在实际运行中, AI 很可能因为 `example` 部分的存在而直接模仿其格式, 忽略了独立的分析步骤. 因此, 尽管它也能正常工作, 但我个人更推荐本教程开头所介绍的、规则更明确的写法.

但请注意到, 这份提示词中并没有描述好感度等变量该如何更新, 那 AI 是怎么知道的呢? 因为 mag 选择了发送整个 `{{get_message_variable::stat_data}}`, 而将变量更新规则作为数组第二个元素, 写在 `[initvar]` 条目中:

```yaml
日期:
  - 03月15日
  - 今天的日期，格式为mm月dd日
时间:
  - 09:00
  - 按照进行行动后实际经历的时间进行更新，每次行动后更新，格式为hh:mm
理:
  情绪状态:
    pleasure:
      - 0.1
      - "[-1,1]之间，情绪变化时更新：−1 - 极端痛苦、悲伤、厌恶；1 - 极端喜悦、满足、陶醉。"
```

这样, 变量更新规则作为数组变量的第二个元素被设置, 而通过 `{{get_message_variable::stat_data}}` 发送给了 AI:

:::::{tabs}
::::{tab} 蓝灯中书写的内容

```text
<status_description>
{{get_message_variable::stat_data}}
</status_description>
```

::::

::::{tab} 发送给 AI 的结果

```text
<status_description>
{"日期":["03月15日","今天的日期，格式为mm月dd日"],"时间":["09:00","按照进行行动后实际经历的时间进行更新，每次行动后更新，格式为hh:mm"],"理":{"情绪状态":{"pleasure":[0.1,"[-1,1]之间，情绪变化时更新：−1 - 极端痛苦、悲伤、厌恶；1 - 极端喜悦、满足、陶醉。"]}}}
</status_description>
```

::::
:::::

最后, 我必须强调一点: **无论选择参考或借鉴何种方法, 都请务必先理解提示词中每一个部分的作用.** 这将使你在创作过程中游刃有余.

### 提示词模板 EJS 语法进阶技巧

掌握了基础的 `if`、`else` 和 `getvar()` 后, 我们需要深入了解更多实用的 EJS 技巧, 这些技巧将让你的动态提示词系统更加稳定和强大.

#### 逻辑运算符详解

EJS 支持多种逻辑运算符, 让你能构建复杂的判断条件:

#### 等于与不等于

- `==`: 判断两个值是否相等
- `!=`: 判断两个值是否不相等
- `===`: 严格等于 (推荐使用)
- `!==`: 严格不等于 (推荐使用)

```{code-block} js
:force:
<%_ if (getvar('stat_data.角色.络络.状态') === '生气') { _%>
络络双手抱胸，一脸不悦地看向别处
<%_ } else if (getvar('stat_data.角色.络络.状态') !== '生气') { _%>
络络的表情平静自然
<%_ } _%>
```

#### 数值比较运算符

- `>`: 大于
- `<`: 小于
- `>=`: 大于等于
- `<=`: 小于等于

```{code-block} js
:force:
<%_ if (getvar('stat_data.角色.络络.好感度') >= 80) { _%>
络络对林雪已经非常信任
<%_ } else if (getvar('stat_data.角色.络络.好感度') >= 50) { _%>
络络对林雪的态度正在转暖
<%_ } else if (getvar('stat_data.角色.络络.好感度') > 0) { _%>
络络对林雪还保持着基本的礼貌
<%_ } _%>
```

#### 逻辑组合运算符

- `&&`: 并且, 两个条件都必须成立
- `||`: 或者, 任一条件成立即可
- `!`: 反过来, 条件成立时反而不成立

```{code-block} js
:force:
<%_ if (getvar('stat_data.角色.络络.好感度') > 60 && getvar('stat_data.世界.时间') === '夜晚') { _%>
夜深了，络络主动走向林雪，眼中带着温柔的光芒
<%_ } _%>

<%_ if (getvar('stat_data.角色.络络.体力') < 20 || getvar('stat_data.角色.络络.心情') === '疲惫') { _%>
络络看起来很累，需要好好休息
<%_ } _%>

<%_ if (!(getvar('stat_data.角色.络络.状态') === '忙碌')) { _%>
络络现在有空闲时间
<%_ } _%>
```

#### 复杂条件的组合

使用小括号 `()` 来明确优先级, 构建更复杂的逻辑:

```{code-block} js
:force:
<%_ if ((getvar('stat_data.角色.络络.好感度') > 70 && getvar('stat_data.世界.地点') === '咖啡厅') || (getvar('stat_data.角色.络络.心情') === '开心' && getvar('stat_data.世界.天气') === '晴朗')) { _%>
络络今天特别愿意聊天，脸上带着明媚的笑容
<%_ } _%>
```

#### 变量范围检查

检查数值是否在特定范围内:

```{code-block} js
:force:
<%_ if (getvar('stat_data.角色.络络.好感度') >= 20 && getvar('stat_data.角色.络络.好感度') < 60) { _%>
络络处于观察阶段，对林雪既不疏远也不过分亲近。
<%_ } _%>
```

#### 字符串匹配技巧

处理字符串变量时的常用模式:

```{code-block} js
:force:
<%_ if (getvar('stat_data.角色.络络.职业') === '学生' || getvar('stat_data.角色.络络.职业') === '实习生') { _%>
作为年轻人，络络对新鲜事物总是充满好奇。
<%_ } _%>
```

#### 多层嵌套的条件判断

有时你需要构建多层嵌套的逻辑, 你可以尝试用空行和缩进来让结构更清晰, 或者你可以用青空莉的[世界书同步脚本](https://sillytavern-stage-girls-dog.readthedocs.io/工具经验/世界书同步脚本/)来写.

```{code-block} js
:force:
<%_ if (getvar('stat_data.角色.络络.好感度') > 60) { _%>

  <%_ if (getvar('stat_data.世界.时间') === '夜晚') { _%>

    <%_ if (getvar('stat_data.角色.络络.心情') === '开心') { _%>
夜色中，络络愉快地与林雪分享着一天的见闻
    <%_ } else { _%>
虽然是夜晚，但络络似乎有些心事重重
    <%_ } _%>

  <%_ } else { _%>
白天的络络显得格外有活力
  <%_ } _%>

<%_ } _%>
```

其他的诸如 const、switch 等语句, 可以自行通过学习 JavaScript 了解, 或是让 AI 来写.
