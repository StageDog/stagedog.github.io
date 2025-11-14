# 变量提示词: 让 AI 理解变量

{{ prolog }}

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

## 编写

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
check:
  - 如果角色注意到了<user>的行为，根据他们的态度将'好感度'更新±(1~4)
  - 根据剧情和人设适当地调整'心情'
  - 根据当前日期时间更新'日期'和'时间'
format: |-
  <update>
  <update_analysis>$(使用不超过120个英语单词)
  - ${计算经过的时间: ...}
  - ${根据当前情节是否足够特殊、时间跨度是否远超正常情况，判断是否允许变量值发生戏剧性变化: 是/否}
  - ${基于变量对应的`check`，仅根据当前回复而不是之前的剧情来分析每个变量是否需要更新: ...}
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
check:
  - update '好感度' by ±(1~4) according to characters' attitudes towards <user>'s behavior respectively only if they're currently aware of it
  - update '心情' according to current plot and the character setting
  - update '日期' and '时间' to the current date and day of the week respectively
format: |-
  <update>
  <update_analysis>$(IN ENGLISH, no more than 120 words)
  - ${calculate time passed: ...}
  - ${decide whether dramatic updates are allowed as it's in a special case or the time passed is more than usual: yes/no}
  - ${analyze every variable based on its corresponding item in `check`, according only to current reply instead of previous plots: ...}
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

## 解释

### 酒馆助手宏 `{{get_message_variable::变量}}`

要在酒馆中插入动态变化的内容, 我们通常会使用"宏". \
一个每个人都用过的宏是 `{{user}}`: 当发送给 ai 时, 它会被替换为我们的玩家角色名. (我更建议你用等效的 `<user>`, 它支持嵌套到其他宏里面.) 同理, `{{char}}` 会被替换为角色卡名. \
你可以通过在酒馆输入框输入 `/help macros` 并 {kbd}`回车` 来了解酒馆提供了哪些宏.

为了扩展酒馆的功能、更好地支持变量, 酒馆助手允许你自己注册酒馆助手宏, 并预先提供了 `{{get_message_variable::变量}}` 宏.

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
      - 表示络络此时对<user>的认可程度
```

要获取数组中的其中一个, 我们使用中括号加上序号. 序号从 `0` 开始计数, `[0]` 代表数组中的第一个元素:

- `{{get_message_variable::stat_data.角色.络络.心情[0]}}` 将会替换为 `60`
- `{{get_message_variable::stat_data.角色.络络.心情[1]}}` 将会替换为 `开心`

如果你实在不理解某个变量的路径是什么, 请在酒馆助手的变量管理器中点击该变量. 这样一来, 变量管理器上方菜单的导航条将会显示出可复制的路径:

:::{figure} 通过变量管理器查看路径.png
:::

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

当然, 你可能没有要依次列变量然后单独用 `#` 对值进行说明的需求, 那么我更建议你用下面的代码而不是 `{{get_message_variable::stat_data}}`:

::::{tabs}
:::{tab} 填写的提示词

```{code-block} yaml
:force:
---
<status_description>
<%= YAML.stringify(getvar(stat_data), { blockQuote: 'literal' }) _%>
</status_description>
```

:::
:::{tab} 发送给 AI 的结果

```yaml
---
<status_description>
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
</status_description>
```

:::
::::

### 输出格式提示词写法

在书写输出格式提示词 (`format` 部分) 时, 我采用了我们惯用而 AI 能听懂的几种特殊格式:

- `${描述}`: AI 需要根据 "描述" 将它替换为对应的内容. 例如 `衣着: ${具体描述角色当前衣着}` 可能输出 `衣着: 粉金色宽松T恤睡裙`;
- `$(要求)`: AI 仅会听从 "要求" 而不对它进行输出. 例如 `$(以下内容应该按英文输出)` 会让 AI 更倾向于用英文输出下面的内容;
- `...`: AI 需要仿照之前给定的规则和内容补充输出. 例如 `其他角色: ...` 会让 AI 根据前面给定的 `络络` 输出格式, 补充其他角色的输出;
- 其他内容原封不动地进行输出.

```yaml
format: |-
  <update>
  <update_analysis>$(使用不超过120个英语单词)
  - ${计算经过的时间: ...}
  - ${根据当前情节是否足够特殊、时间跨度是否远超正常情况，判断是否允许变量值发生戏剧性变化: 是/否}
  - ${根据`check`中列出的对应规则，分析每个变量是否需要更新: ...}
  </update_analysis>
  _.set('${变量, 例如'角色.络络.好感度'}', ${旧值}, ${新值}); // ${简述更新原因}
  _.set('${变量}, ${新值}); // ${简述更新原因}
  ...
  </update>
```

其中 `<update_analysis>` 是变量更新的思维链, 而下方的 `_.set(...)` 是在思维链进行分析后实际输出变量更新命令.

需要注意的是 ``${根据`check`中列出的对应规则，分析每个变量是否需要更新: ...}`` 一句, 这是青空莉的 recall 变量更新规则方式, 它要求 AI 在此时重新回想 `check` 中的内容并列举出来, 也就相当于将 `check` 中的内容加入到思维链里:

```{code-block} yaml
:force:
:emphasize-lines: 6-9
---
<status_description>
略
</status_description>
rule: 你必须在下次回复的末尾输出变量更新分析
check:
  - 如果角色注意到了<user>的行为，根据他们的态度将'好感度'更新±(1~4)
  - 根据剧情和人设适当地调整'心情'
  - 根据当前日期时间更新'日期'和'时间'
format: |-
  <update>
  <update_analysis>$(使用不超过120个英语单词)
  - ${计算经过的时间: ...}
  - ${根据当前情节是否足够特殊、时间跨度是否远超正常情况，判断是否允许变量值发生戏剧性变化: 是/否}
  - ${基于变量对应的`check`，仅根据当前回复而不是之前的剧情来分析每个变量是否需要更新: ...}
  </update_analysis>
  _.set('${变量, 例如'角色.络络.好感度'}', ${旧值}, ${新值}); // ${简述更新原因}
  _.set('${变量}, ${新值}); // ${简述更新原因}
  ...
  </update>
```

你可能会想: 可明明 `check` 就在 `<update_analysis>` 不远处啊, 那为什么要单独拆出来, 而不是直接列在 `<update_analysis>` 中呢?

首先要知道的是, {doc}`在 D1/D0 等地方填入大量 token 是不好的 </青空莉/工具经验/酒馆如何处理世界书/插入/index>`. \
如果你的变量很多很复杂, 你可能会用更结构化的方式描述变量更新规则, 比如:

```yaml
---
变量更新规则:
  药物依赖度:
    type: number
    range: 0~100
    check:
      - 每8分钟提升1点艾莉卡的药物依赖度
      - 每15分钟提升1点伊薇特和伊丽莎白的药物依赖度
      - 如果她们被注射苍白之夜，将她们的药物依赖度清零
  背包:
    type: |-
      z.array(z.object({
        物品: z.string(),
        数量: z.number().min(1).describe('物品数量少于1时应该移除物品'),
      }));
    略
```

而这时, 占用 token 较多的变量更新规则应该放置更次要的地方, 尽量不影响 AI 对剧情的连贯理解, 而不是放在*用于列出变量的变量列表*和*用于指示用什么格式更新变量的输出规则*旁边. \
在这种情况下, `<update_analysis>` 内的`` 基于变量对应的`check` `` 将会发挥它应有的作用——让 AI 重新回想 `check` 中的内容用于更新变量.

这就引入了变量提示词编写最重要的一个理解: **变量提示词只是提示词**.

## 这只是提示词

当前的变量情况、更新规则和输出格式等**只是提示词, 写法只取决于你的想象**; 这里只是列了一种方便讲解的变量更新提示词. \
如果你熟悉 MVU 原帖下的提示词, 你可以发现这里提示词与它们有很大区别: 这里的提示词引入了 check、recall 和更多的思维链 (Chain of Thought, CoT) 要求, 并且没在 `format` 之后还补充一个变量更新输出示例 `example`.

你还能在{doc}`青空莉的个人变量提示词写法 </青空莉/工具经验/提示词个人写法/变量提示词/index>`中看到几种完全不同的提示词写法, **他推荐的写法思路**, 以及这里示例写法的非简化版.

## 酒馆正则: 不发送变量更新文本

有了变量提示词, AI 将会在回复时输出 `<update>` 部分, 在其中先对变量该如何更新进行分析, 然后输出 `_.set(...)` 语句. \
而 MVU 脚本将会读取 AI 回复和用户输入中的 `_.set(...)`, 对变量在该楼层的值进行实际更新.

也就是说:

重复一遍, 变量提示词的写法只取决于你的想象
: 你不必拘泥于将变量更新命令 `_.set(...)` 放在 `<update>` 中, 因为 MVU 脚本会读取 AI 回复和用户输入中任意位置的 `_.set(...)`.

你可以为不同开局设置不同的初始变量
: "MVU 脚本会读取 AI 回复和用户输入中的 `_.set(...)`". 也就是说, 你写在开局消息中的 `_.set(...)` 也会被读取.

<!-- markdownlint-disable MD032 MD007 -->
AI 输出的 `<update>` 没必要再发给 AI
: `<update>` 已经被 MVU 脚本使用了, 而 AI 在后续回复中不需要参考它: 我们会发给 AI 变量更新规则, 不是吗?
: 如果我们保留所有楼层的 `<update>` 还发给 AI:
  - 首先, 这浪费了 token
  - 其次, AI 可能不必要地花费注意力去学习之前的 `<update>` 而更少地将注意力放在剧情上
  - 最后, AI 可能偷懒直接照抄之前的 `<update>` 而不真的分析思考该如何更新变量!
  <!-- markdownlint-enable MD032 MD007 -->

因此, 我们需要在后续生成时不发送 `<update>` 部分给 AI——这就用到了酒馆正则.

酒馆正则能够捕获 AI 回复和用户输入中的特定文本, 让它在某些用途下被替换为指定内容:

- {menuselection}`仅格式提示词`: 在发送给 AI 时被替换为指定内容
- {menuselection}`仅格式显示`: 在酒馆中显示时被替换为指定内容
- 两个都不勾选: 在 AI 输出接收到时或用户输入发送出去时就被**永久**替换掉

:::{figure} 酒馆正则.png
:::

:::{hint}
如果你还不够理解以上说明, 也许可以看看自己酒馆中的预设配套正则或者角色卡里的美化正则.
:::

为了便于大家操作, 青空莉已经提前制作了可作用于 `<update>` 和 MVU 原帖的 `<UpdateVariable>` 风格变量更新输出的酒馆正则, 你只需下载导入其中一个版本的三个正则即可:

- 美化版 ([点此查看演示](https://gitgud.io/StageDog/tavern_resource/-/raw/main/src/正则/变量更新/美化版.mp4)): {stagedog}`[不发送]去除变量更新 <src/正则/变量更新/regex-[不发送]去除变量更新.json>`、{stagedog}`[美化]变量更新中 <src/正则/变量更新/regex-[美化]变量更新中.json>`、{stagedog}`[美化]完整变量更新 <src/正则/变量更新/regex-[美化]完整变量更新.json>`
- 折叠版 ([点此查看演示](https://gitgud.io/StageDog/tavern_resource/-/raw/main/src/正则/变量更新/折叠版.mp4)): {stagedog}`[不发送]去除变量更新 <src/正则/变量更新/regex-[不发送]去除变量更新.json>`、{stagedog}`[折叠]变量更新中 <src/正则/变量更新/regex-[折叠]变量更新中.json>`、{stagedog}`[折叠]完整变量更新 <src/正则/变量更新/regex-[折叠]完整变量更新.json>`
- 仅提示版 (不能展开查看更新内容): {stagedog}`[不发送]去除变量更新 <src/正则/变量更新/regex-[不发送]去除变量更新.json>`、{stagedog}`[提示]变量更新中 <src/正则/变量更新/regex-[提示]变量更新中.json>`、{stagedog}`[提示]完整变量更新 <src/正则/变量更新/regex-[提示]完整变量更新.json>`

## 回顾

至此, 我们的变量环境已搭建完毕:

- 我们在 `[initvar]` 条目中正确设置了变量和它们的初始值
- AI 通过 `<status_description>` 了解了当前的变量状态, 这是变量提示词的**变量列表**部分
- AI 通过 `check` 了解了变量更新规则, 这是变量提示词的**变量更新规则**部分
- AI 通过 `format` 知晓了更新变量所需的输出格式, 这是变量提示词的**变量更新格式**部分
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
