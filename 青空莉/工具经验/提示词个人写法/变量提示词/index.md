# 变量提示词

{{ prolog }}

变量提示词由三个部分组成:

变量列表
: 变量的当前值是多少、意义是什么?

变量更新规则
: 变量在什么情况下应该被更新、更新成什么值?

变量更新格式
: AI 应该输出什么来更新变量?

**这些都只是提示词, 写法只取决于你的想象. 以下只是给你一个概念, 请不要照抄.** \
**这些都只是提示词, 写法只取决于你的想象. 以下只是给你一个概念, 请不要照抄.** \
**这些都只是提示词, 写法只取决于你的想象. 以下只是给你一个概念, 请不要照抄.** \
你可以在{doc}`门之主写卡助手 </青空莉/作品集/index>`中使用我的变量提示词模板, 另外有络络的{doc}`/络络/教程/手写mvu变量卡/index`教你怎么写, 但我每张卡其实都使用了不同的变量提示词写法:

- {lolodesu_path}`络络做的、我调整后的日记络络 <src/日记络络>`
- {stagedog_path}`萝莉元首自改版 <src/角色卡/萝莉元首>` (应该是提示词模板第一次被除作者外的人使用)
- {stagedog_path}`晚安络络 <src/角色卡/晚安络络>`
- {stagedog_path}`妹妹请求你保护她露出 <src/角色卡/妹妹请求你保护她露出>`

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

## 变量列表

如果需要 AI 更新变量, 则我们需要按照正确的变量结构在提示词里列出变量.

我的推荐做法是, 将需要 AI 更新的变量按结构一一列举出来, 利用变量的名称和 `# 注释` 来解释变量的意义:

```yaml
---
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
```

但是像好感度一类变量, 我们可能需要更详细的解释其意义; 想必你见过我的角色阶段写法: \
(只要用了 `associated variable` 或 `stage name` 的一般是源自我的写法, 虽然我很想吐槽啥都不改、连我为什么列这些都不知道就直接抄.)

:::{admonition} 为什么会有 `stage name`
:class: tip, dropdown
之所以会有 `stage name`, 是我不想只在状态栏显示一个无聊的好感度数值, 而想在状态栏根据好感度数值显示一个好感度阶段名.

我没有用酒馆助手前端界面, 因而不能用代码来根据好感度显示对应的好感度阶段名, 而只能依赖于 AI 来输出好感度阶段名.

但我们只会发送一个好感度阶段给 AI, 则 AI 只能知道当前好感度的阶段名, 没办法在好感度提高到下一个阶段时正确输出下一个阶段的名称. 因此我需要用蓝灯列一个 `stage name` 让 AI 知道所有的好感度阶段名, 这样它才能正确地输出好感度阶段名.
:::

```{code-block} yaml
:emphasize-lines: 8
---
角色阶段:
  descritpion: 角色阶段基于各角色的`角色关键信息`和`角色详情`词条，描述了经过剧情发展后角色成长得到的新人设
  associated variable: 各角色的阶段关联有不同的变量，仅用于判断其角色阶段是否应该发生变化，不影响阶段的具体人设
  行为指导: 角色在这个阶段会采取的行为
  变化倾向: 随着associated variable接近下一阶段，角色逐渐发生的变化
心爱:
  associated variable: 心爱.好感度(<%= getvar('stat_data.心爱.好感度') _%>)
  stage name:
    阶段1: 羞涩抗拒(24以下)
    阶段2: 欲拒还迎(25~49)
    阶段3: 共犯默契(50~74)
    阶段4: 沉沦释放(75~99)
    阶段5: 灵肉相许(100以上)
  羞涩抗拒:
    行为指导:
      - 露出时总是躲在哥哥身后，却又嘴硬说不需要保护
      - ...
    变化倾向:
      - 在拍摄时尝试更富表现力的构图，但仍避免自己入镜
      - ...
  ...
  灵肉相许:
    行为指导:
      - ...
```

提示词中 `associated variable` (关联变量) 一般是好感度. 这段角色阶段即是列出了变量的当前值, 并用一大段提示词来解释变量在不同区间下的意义.

变量列表不能随意列举, 否则可能出现 AI 上一楼才更新了变量, 下一楼又更新变量的情况. \
为了让 AI 知道变量列表中的值是最新的, 你有几种选择:

- 将变量列表放在 D1, 这样的变量列表会置于之前所有 AI 输出之后 (也就是最新剧情之后), 因此 AI 能直接理解它是最新的
- 将变量列表放在 D4 等位置, 然后精心设计变量更新格式及分析思维链提示词:
  - 告诉 AI 发送给它的变量是最新的: 一般变量列表会用 xml 标签包裹, 因此可以告诉 AI `<标签>` 里的变量是最新的, 甚至让 AI 在变量更新思维链里列一遍 ``我已经知道 `<标签>` 中的变量是最新的``
  - 让 AI 仅基于当前回复更新变量: 玄学点可以在变量更新思维链里加一个 `仅根据当前回复而不是之前的剧情来分析每个变量是否需要更新`
- (应最有效但很占 token) 取消对变量更新的“仅格式提示词”正则, 把变量更新情况发给 AI, 这样 AI 能知道变量更新过了; 为了减少 token, 你可以单独为变量更新中的思维链做一个“仅格式提示词”正则, 仅保留变量更新命令 (`_.set(...)` 等) 发给 AI

## 变量更新规则

一些简单的变量可以直接由 AI 根据名称来理解如何更新, 无须专门编写变量更新规则提示词.

但你可能想对好感度一类变量自己限定一些更新规则:

```{code-block} yaml
:emphasize-lines: 9-10
---
角色:
  络络:
    好感度: {{get_message_variable::stat_data.角色.络络.好感度}} # 0-100
    心情: {{get_message_variable::stat_data.角色.络络.心情}} # 仅有开心、难过、哭泣、生气四种心情
  青空莉:
    好感度: {{get_message_variable::stat_data.角色.青空莉.好感度}}
    心情: {{get_message_variable::stat_data.角色.青空莉.心情}}
check:
  - 如果角色注意到了<user>的行为，根据他们的态度将'好感度'更新±(1~4)
```

或者更复杂地:

```yaml
---
变量更新规则:
  好感度:
    type: number
    range: 限定于0~100之间，如果达到了100则不再变化
    check: 如果角色注意到了<user>的行为，根据他们的态度将'好感度'更新±(1~4)
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

变量更新规则没必要放在 D1 (论为什么我讨厌 MVU 示例卡, 以及不自己理解提示词写法直接照抄提示词), 你完全可以将它置于 D4 等位置, 让 AI 在输出变量更新时先在思维链中回想`check`、分析变量更新, 再实际输出更新命令.

## 变量更新格式

就像{doc}`络络手写 MVU 变量卡教程 </络络/教程/手写mvu变量卡/变量提示词/index>`中所说, AI 输出和用户输入中任意位置的 `_.set(...)` 都会被 MVU 脚本读取, 因此变量更新其实并没有固定的格式, 没必要必须放在 `<UpdateVariable>` 之类的块中统一更新.

但一般而言, 你会用上我在 [2024/11/21](https://discord.com/channels/1134557553011998840/1308984948794982421) 设计的一类变量更新格式提示词. 它最初的版本其实没有复杂思维链, 只在尾部有一个 `reason` 帮助 AI 提高注意力:

```yaml
---
变量更新格式:
  rule: 你必须在每次回复的最底部，输出<UpdateVariable>包裹的变量更新命令
  format: |-
    <UpdateVariable>
    _.set('${path}', ${old value}, ${new value}); // ${reason}
    ...
    </UpdateVariable>
```

后来为了让 AI 更愿意更新变量, 我加入了思维链, 即 `<Analysis>` 块. **思维链不一定要在 AI 输出的开头, 这里的 `<Analysis>` 也是思维链, 即在实际输出前让 AI 先打草稿.**

```{code-block} yaml
:emphasize-lines: 6-8
---
变量更新格式:
  rule: 你必须在每次回复的最底部，输出<UpdateVariable>包裹的变量更新命令
  format: |-
    <UpdateVariable>
    <Analysis>
    某些思维链...
    </Analysis>
    _.set('${path}', ${old value}, ${new value}); // ${reason}
    ...
    </UpdateVariable>
```

我喜欢加上的思维链项目有:

::::{tabs}

:::{tab} 中文

```{code-block} yaml
:caption: 计算剧情时间变化
- ${计算经过的时间: ...}
```

```{code-block} yaml
:caption: 允许变量因剧情而发生剧烈变动 (好感度从 100 直接掉到 0)
- ${根据当前情节是否足够特殊、时间跨度是否远超正常情况，判断是否允许变量值发生戏剧性变化: yes/no}
```

```{code-block} yaml
:caption: 回忆变量更新所需的`check`, 据此分析该如何更新
- ${基于变量对应的`check`，仅根据当前回复而不是之前的剧情来分析每个变量是否需要更新: ...}
```

:::

:::{tab} 英文

```{code-block} yaml
:caption: 计算剧情时间变化
- ${calculate time passed: ...}
```

```{code-block} yaml
:caption: 允许变量因剧情而发生剧烈变动
- ${decide whether dramatic updates are allowed as it's in a special case or the time passed is more than usual: yes/no}
```

```{code-block} yaml
:caption: 回忆变量更新所需的`check`, 据此分析该如何更新
- ${analyze every variable based on its corresponding `check`, according only to current reply instead of previous plots: ...}
```

:::

::::

思维链或者所有提示词怎么写完全由你自己说了算, 你也许会得到:

::::{tabs}
:::{tab} AI 自己搞定

不为变量编写任何`check`规则, 而是直接让 AI 自己搞定:

```text
<update>
<update_analysis>$(IN ENGLISH, no more than 80 words)
- ${calculate time passed: ...}
- ${decide whether dramatic updates are allowed as it's in a special case or the time passed is more than usual: yes or no}
- ${what variables should be updated, accoring only to current reply instead of previous plots: ...}
</update_analysis>

_.set('${path}', ${old}, ${new}); // ${reason}
...
</update>
```

:::

:::{tab} 我没多少变量

变量很少, 直接在思维链里列举它们该如何更新:

```text
<update>
<update_analysis>$(IN ENGLISH, no more than 80 words)
- ${calculate time passed: ...}
- ${decide whether dramatic updates are allowed as it's in a special case or the time passed is more than usual: yes or no}
- ${update variables suffixed with '次数' when a corresponding event occurs but don't update them any more during that event: ...}
- ${update variables suffixed with '好感度' according to characters' attitudes towards <user>'s behavior respectively only if they're currently aware of it (±(3~6); but '好感度' must be capped in 0~100 and remains unchange when it's 100): ...}
- ${switch variables suffixed with '处女', '受孕' or '被<user>接受感情' between '是' and '否': ...}
</update_analysis>

_.set('${path}', ${old}, ${new}); // ${reason}
...
</update>
```

:::

:::{tab} 回忆检查

在思维链中让 AI 回忆`check`规则, 据此分析该如何更新变量:

```text
<update>
<update_analysis>$(IN ENGLISH, no more than 80 words)
- ${calculate time passed: ...}
- ${decide whether dramatic updates are allowed as it's in a special case or the time passed is more than usual: yes or no}
- ${analyze every variable based on its corresponding `check`, according only to current reply instead of previous plots: ...}
</update_analysis>

_.set('${path}', ${old}, ${new}); // ${reason}
...
</update>
```

:::

:::{tab} 依次检查

在思维链中不是让 AI 回忆`check`, 而是让它原封不动地列举所有`check`内容, 再进行分析:

```text
<update>
<update_analysis>$(IN ENGLISH, no more than 80 words)
- ${calculate time passed: ...}
- ${decide whether dramatic updates are allowed as it's in a special case or the time passed is more than usual: yes or no}
- ${list every item in every `check` of `变量更新规则` document before actual variable analysis: ...}
  - ${analyze corresponding variables that are based on this item, according only to current reply instead of previous plots: ...}
</update_analysis>

_.set('${path}', ${old}, ${new}); // ${reason}
...
</update>
```

:::

:::{tab} 周全列举

由于思维链中列举`check`和基于`check`进行分析放置地过于紧密, AI 可能偷懒, 则你可以将这两句话隔离一下:

```text
<update>
${display every `check` in `变量更新规则` document before actual variable analysis}
<update_analysis>$(IN ENGLISH, no more than 80 words)
- ${calculate time passed: ...}
- ${decide whether dramatic updates are allowed as it's in a special case or the time passed is more than usual: yes or no}
- ${analyze variables based on `check`, according only to current reply instead of previous plots: ...}
</update_analysis>

_.set('${path}', ${old}, ${new}); // ${reason}
...
</update>
```

:::
::::

变量更新格式说白了也是{doc}`/青空莉/工具经验/提示词个人写法/额外输出格式/index`, 因此完全可以放在 D4 而在 D1/D0 用变量更新格式强调来保证 AI 输出.
