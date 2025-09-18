# 附录

{{ prolog }}

## 关于世界书条目的深度

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

因此, 在 D0/D1 甚至 D2/D3 等部分塞太多东西会让 ai 对上下文剧情不连贯! 具体解释见于{doc}`/青空莉/工具经验/酒馆如何处理世界书/插入/index`.

为了让 AI 理解变量是最新的, 你可以偷懒地 (注意, **只是因为你偷懒不想具体研究你的变量在哪最好!**) 将当前变量情况放在 D1, 但变量更新规则完全没必要放这么低!

:::{figure} 世界书条目深度建议.png
离在 2024/06/10 时的深度建议
:::

## MVU 作者 mag 的变量更新规则是怎么生效的

MVU 作者 mag 在其示例中, 采用了直接插入整个 `stat_data` 的方法. 让我们看看他的提示词结构: (青空莉调整格式版)

```yaml
<status_description> // do not output following content
{{get_message_variable::stat_data}}
</status_description> // do not output content below directly
<Analysis>$(IN ENGLISH)
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
我个人认为, 其中 `<Analysis>$(IN ENGLISH)</Analysis>` 的部分虽然意图是作为思维链引导, 但在实际运行中, AI 很可能因为 `example` 部分的存在而直接模仿其格式, 忽略了独立的分析步骤. 因此, 尽管它也能正常工作, 但我个人更推荐本教程开头所介绍的、规则更明确的写法.

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

## 提示词模板 EJS 语法进阶技巧

掌握了基础的 `if`、`else` 和 `getvar()` 后, 我们需要深入了解更多实用的 EJS 技巧, 这些技巧将让你的动态提示词系统更加稳定和强大.

当然, 你也可以[让 AI 编写 EJS 代码](#让AI为你编写EJS代码).

### 逻辑运算符详解

EJS 支持多种逻辑运算符, 让你能构建复杂的判断条件:

### 等于与不等于

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

### 数值比较运算符

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

### 逻辑组合运算符

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

### 复杂条件的组合

使用小括号 `()` 来明确优先级, 构建更复杂的逻辑:

```{code-block} js
:force:
<%_ if ((getvar('stat_data.角色.络络.好感度') > 70 && getvar('stat_data.世界.地点') === '咖啡厅') || (getvar('stat_data.角色.络络.心情') === '开心' && getvar('stat_data.世界.天气') === '晴朗')) { _%>
络络今天特别愿意聊天，脸上带着明媚的笑容
<%_ } _%>
```

### 变量范围检查

检查 `20 <= 数值 < 60`:

```{code-block} js
:force:
<%_ if (20 <= getvar('stat_data.角色.络络.好感度') && getvar('stat_data.角色.络络.好感度') < 60) { _%>
络络处于观察阶段，对林雪既不疏远也不过分亲近。
<%_ } _%>
```

或者, 等价地:

```{code-block} js
:force:
<%_ if (_.inRange(getvar('stat_data.角色.络络.好感度'), 20, 60)) { _%>
络络处于观察阶段，对林雪既不疏远也不过分亲近。
<%_ } _%>
```

### 字符串匹配技巧

处理字符串变量时的常用模式:

```{code-block} js
:force:
<%_ if (['学生', '实习生'].includes(getvar('stat_data.角色.络络.职业'))) { _%>
作为年轻人，络络对新鲜事物总是充满好奇。
<%_ } _%>
```

### 多层嵌套的条件判断

有时你需要构建多层嵌套的逻辑, 你可以尝试用空行和缩进来让结构更清晰, 或者你可以用青空莉的{doc}`/青空莉/工具经验/实时编写角色卡、世界书或预设/index`来写.

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
