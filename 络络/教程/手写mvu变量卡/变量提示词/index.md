# 变量提示词: 让 AI 理解变量

{{ prolog }}

在上一章中, 我们成功设置和初始化了变量, 但这只是在酒馆层面给角色卡设定了变量, 我们还没让 AI 知道有变量. 嗯……打个比方的话, 角色卡一般有头像, 但你如果问 AI, 它并不知道你为角色卡设定了什么头像.

那么, 如何让AI "看" 到并根据我们的意图去操作这些变量呢? 这就需要我们在世界书里编写提示词, 告诉 AI 变量的三个基本信息了:

变量列表
: 变量当前的值是多少? 它有什么含义? 例如, `白娅.依存度`这个变量现在的数值是多少? 它是 0、是 100 分别代表什么意思?

变量更新规则
: 变量在什么情况下应该被更新、更新成什么值? 例如, `白娅.依存度`这个变量在发生什么剧情时应该上升, 什么情况下又该下降?

变量输出格式
: AI 应该输出什么来更新变量? 例如, 如果 AI 认为白娅和主角一起去约会所以`白娅.依存度`应该从 20 上升到 25, 那它该输出什么内容来告诉 MVU 脚本应该将`白娅.依存度`更新成 25?

……应该没有懵掉吧qwq 我、我再打个比方! 假如我们要让 AI 能根据剧情发展自己修改角色卡的头像:

变量列表
: 角色卡当前的头像是什么? 它有什么含义?

变量更新规则
: 角色卡的头像在什么情况下应该被更新、更新成什么头像?

变量输出格式
: AI 应该输出什么来更新头像? 也许是直接输出一张图片! 然后某个头像替换脚本会读取这个图片作为新的角色卡头像.

## 制作角色卡时的特殊设置

如果你在使用门之主写卡助手, 会看到输入框上方有个`启用/禁用提示词模板和酒馆助手宏`按钮; 如果没有使用, 你也可以{doc}`单独导入这个按钮 </青空莉/作品集/index>`:

- 在制作角色卡时你应该禁用它们, 这样 AI 才能看到原本的提示词而不是处理后的结果;
- 在测试、游玩角色卡时你应该启用它们, 这样 AI 才能看到处理后的结果, 例如看到 `好感度: 10` 而不是 `好感度: {{format_message_variable::络络.好感度}}`.

## 简单制作三大变量提示词

你可以近乎无脑地得到变量列表、变量更新规则和变量输出格式:

`[mvu_update]变量更新规则`
: 延续之前生成`变量结构设计`所使用的聊天, 切换成门之主写卡助手的`变量更新规则`条目, 输入你想要强调的一些更新规则 (如`白娅的称号必须反映白娅对主角的态度`) 然后让 AI 生成, 最后自己调整一下生成结果.

`[mvu_update]变量输出格式` 和 `变量列表`
: 直接点击复制[`[mvu_update]变量输出格式`](https://github.com/StageDog/tavern_helper_template/blob/main/初始模板/角色卡/新建为src文件夹中的文件夹/世界书/变量/变量输出格式.yaml)和[`变量列表`](https://github.com/StageDog/tavern_helper_template/blob/main/初始模板/角色卡/新建为src文件夹中的文件夹/世界书/变量/变量列表.txt)里的内容.

由此我们就拥有了三大变量提示词条目. 我们按下图这样设置, AI 就能理解变量、更新变量了:

:::{figure} 变量提示词.png
变量提示词条目设置
:::

然后, 我们前往{menuselection}`酒馆右上角积木按钮 --> 正则`, 选择以下某个版本的三个正则导入到局部正则中:

- 美化版 ([点此查看演示](https://gitgud.io/StageDog/tavern_resource/-/raw/main/src/正则/变量更新/美化版.mp4)): {stagedog}`[不发送]去除变量更新 <src/正则/变量更新/regex-[不发送]去除变量更新.json>`、{stagedog}`[美化]变量更新中 <src/正则/变量更新/regex-[美化]变量更新中.json>`、{stagedog}`[美化]完整变量更新 <src/正则/变量更新/regex-[美化]完整变量更新.json>`
- 折叠版 ([点此查看演示](https://gitgud.io/StageDog/tavern_resource/-/raw/main/src/正则/变量更新/折叠版.mp4)): {stagedog}`[不发送]去除变量更新 <src/正则/变量更新/regex-[不发送]去除变量更新.json>`、{stagedog}`[折叠]变量更新中 <src/正则/变量更新/regex-[折叠]变量更新中.json>`、{stagedog}`[折叠]完整变量更新 <src/正则/变量更新/regex-[折叠]完整变量更新.json>`
- 仅提示版 (不能展开查看更新内容): {stagedog}`[不发送]去除变量更新 <src/正则/变量更新/regex-[不发送]去除变量更新.json>`、{stagedog}`[仅提示]变量更新中 <src/正则/变量更新/regex-[仅提示]变量更新中.json>`、{stagedog}`[仅提示]完整变量更新 <src/正则/变量更新/regex-[仅提示]完整变量更新.json>`

这样一来, 你就写好变量提示词, 可以进入下一章了! 但我建议你了解一下各个提示词到底做了啥, 又是怎么做到的:

## 变量列表

变量列表告诉 AI 变量当前的值是多少以及变量有什么含义.

但门之主写卡助手中的变量列表提示词写得非常简单:

```text
---
<status_current_variable>
{{format_message_variable::stat_data}}
</status_current_variable>
```

这为什么就能让 AI 知道变量当前的值是多少以及变量有什么含义呢?

因为当实际发送时, `{{format_message_variable::stat_data}}` 并不会原封不动地发送出去, 而是被替换成变量内容:

::::{tabs}

:::{tab} 提示词

```text
---
<status_current_variable>
{{format_message_variable::stat_data}}
</status_current_variable>
```

:::

:::{tab} 发送给 AI 的结果

```text
---
<status_current_variable>
世界:
  当前时间: 2024-04-08 10:45
  当前地点: 私立风祭学院 高中部 2年A班教室
  近期事务:
    转学生安置: 白娅刚刚转入，需要领取教材、熟悉校园环境
    座位调整: 班长正在确认最终的座位表，可能会有微调
    午休临近: 还有一节课就是午休，是接触白娅的机会
白娅:
  依存度: 35
  着装:
    上装: 整洁的深蓝色校服外套，一丝不苟地扣好每一颗纽扣
    下装: 规整的深蓝色百褶裙，长度恰好及膝
    内衣: 素白色内衣套装
    袜子: 黑色过膝袜，没有一丝皱褶
    鞋子: 黑色皮质学生鞋，擦得锃亮
    饰品: 无
  称号:
    行尸:
      效果: 日常行动带有明显的倦怠感与机械感
      自我评价: 活着本身就是惩罚
    逃避者:
      效果: 对来自青空黎的任何接触都会本能回避
      自我评价: 我不配出现在他的生活里
主角:
  物品栏:
    陈旧的创可贴:
      描述: 钱包夹层里放了两年的卡通创可贴，粘性大概已经失效了
      数量: 1
    薄荷糖:
      描述: 提神用的强力薄荷糖，以前她很讨厌这个味道
      数量: 1
</status_current_variable>
```

:::

:::{tab} 提示词查看器

:::{figure} 提示词查看器.png
:::

:::

::::

这不是我们第一次遇到这种提示词和实际发送内容不同的情况了. 请你打开一张角色卡, 看看它的开局消息: 明明开局消息里写的是 `<user>`, 但当显示和发给 AI 时却变成了具体的人名.

:::{figure} user宏.png
:::

也就是说, `{{format_message_variable::stat_data}}`、`<user>` 这些文本只是作为占位符, 而在实际显示或发送时会被替换成具体的内容.

<!-- markdownlint-disable MD032 MD007 -->
像这样的占位文本称为 "宏".
: - `<user>` 或 `{{user}}` 是酒馆宏, 你可以在酒馆输入框输入 `/help macros` 并{kbd}`回车`来了解酒馆提供了哪些酒馆宏;
  - 而 `{{format_message_variable::变量路径}}` 是酒馆助手新注册的宏.
<!-- markdownlint-enable MD032 MD007 -->

### 酒馆助手宏 `{{format_message_variable::变量路径}}`

为了扩展酒馆的功能、更好地支持变量, 酒馆助手允许你自己[注册酒馆助手宏](https://n0vi028.github.io/JS-Slash-Runner-Doc/guide/功能详情/酒馆助手宏.html), 并预先提供了 `{{format_message_variable::变量}}` 宏, 它的作用就是展示最新消息楼层的变量值.

其中, `变量路径`是要展示的变量路径. 也就是说 `{{format_message_variable::stat_data}}` 会展示 `stat_data` 路径下的变量内容……为什么是 `stat_data`? 让我们打开{menuselection}`酒馆输入框左边魔棒 --> 变量管理器 --> 消息楼层`看看:

:::{figure} stat_data结果.png
:::

`stat_data` 变量下正是我们设置的所有变量! 因此, `{{format_message_variable::stat_data}}` 将会按格式展示我们设定的所有变量! 变量列表正是利用了这一点:

```text
---
<status_current_variable>
{{format_message_variable::stat_data}}
</status_current_variable>
```

`{{format_message_variable::变量路径}}` 也可以使用别的路径, 我们去变量管理器复制一个路径试试: 点击 "当前时间", 然后编辑变量管理器上面的导航条, 将路径复制下来.

:::{figure} 复制变量路径.png
:::

我们得到的路径是 `stat_data.世界.当前时间`, 所以我们在酒馆输入框里填 `{{format_message_variable::stat_data.世界.当前时间}}` 发送出去试试:

:::{figure} 发送酒馆助手宏.png
:::

AI 回复中果然出现了 `2024-04-08 10:45` 这个时间!

:::{hint}

更多酒馆助手宏的用法, 请参考[酒馆助手宏](https://n0vi028.github.io/JS-Slash-Runner-Doc/guide/功能详情/酒馆助手宏.html)文档.

:::

(MVU_选择性地发给AI变量列表)=

### 选择性地发给 AI 变量列表

既然 `{{format_message_variable::变量路径}}` 是展示你所填变量路径下的变量, 如果我们知道自己的变量结构是怎么样的, 完全可以自己更细致地展示变量内容:

::::{tabs}

:::{tab} 泛用的变量列表

```text
---
<status_current_variable>
{{format_message_variable::stat_data}}
</status_current_variable>
```

:::

:::{tab} 我们知道变量结构, 可以单独展示某个路径

```text
---
<status_current_variable>
世界:
  {{format_message_variable::stat_data.世界}}
白娅:
  依存度: {{format_message_variable::stat_data.白娅.依存度}}
  着装:
    {{format_message_variable::stat_data.白娅.着装}}
  称号:
    {{format_message_variable::stat_data.白娅.称号}}
主角:
  {{format_message_variable::stat_data.主角}}
</status_current_variable>
```

:::

:::{tab} 发送给 AI 的结果

```text
---
<status_current_variable>
世界:
  当前时间: 2024-04-08 10:45
  当前地点: 私立风祭学院 高中部 2年A班教室
  近期事务:
    转学生安置: 白娅刚刚转入，需要领取教材、熟悉校园环境
    座位调整: 班长正在确认最终的座位表，可能会有微调
    午休临近: 还有一节课就是午休，是接触白娅的机会
白娅:
  依存度: 35
  着装:
    上装: 整洁的深蓝色校服外套，一丝不苟地扣好每一颗纽扣
    下装: 规整的深蓝色百褶裙，长度恰好及膝
    内衣: 素白色内衣套装
    袜子: 黑色过膝袜，没有一丝皱褶
    鞋子: 黑色皮质学生鞋，擦得锃亮
    饰品: 无
  称号:
    行尸:
      效果: 日常行动带有明显的倦怠感与机械感
      自我评价: 活着本身就是惩罚
    逃避者:
      效果: 对来自青空黎的任何接触都会本能回避
      自我评价: 我不配出现在他的生活里
主角:
  物品栏:
    陈旧的创可贴:
      描述: 钱包夹层里放了两年的卡通创可贴，粘性大概已经失效了
      数量: 1
    薄荷糖:
      描述: 提神用的强力薄荷糖，以前她很讨厌这个味道
      数量: 1
</status_current_variable>
```

:::

::::

也就是说, 你完全可以把变量列表拆成几个条目, 一些设置为蓝灯, 一些设置为绿灯, 来更细致地控制变量! 总之, 变量提示词只是提示词. 正常的世界书条目能怎么写, 变量提示词就也可以.

### 让 AI 知道变量列表中的值是最新的

变量列表列出了变量的当前值, 但 AI 仍可能认为变量列表中的值不是对应于最新剧情, 而是之前某个剧情的. 这是我们世界书条目插入位置导致的.

一般而言, 预设将提示词按照以下顺序发送给 AI:

```text
角色定义之前
角色定义之后
第 0 楼
第 1 楼
...
倒数第 4 楼 (上上次 AI 回复)
D3
倒数第 3 楼 (上一次用户输入)
D2
倒数第 2 楼 (上一次 AI 回复)
D1
倒数第 1 楼 (本次用户输入)
D0
```

从上往下读, 倒数第 4 楼是上上次 AI 回复, 而倒数第 2 楼是上一次 AI 回复. 如果我们将变量列表设置成 D3 或 D2, 它就被夹在了两次回复中间:

:::{code-block} text
:emphasize-lines: 2
上上次 AI 回复
变量列表😱
上一次 AI 回复
:::

让我们像人类一样来想想 (?), 如果我们看到这样的文本会是什么感觉: 上上次 AI 回复, 有个变量列表, 上一次 AI 回复……我们会觉得变量列表记录的是上一次 AI 回复之前的数据, 而不是最新的数据.

所以, 要让 AI 能直接理解变量列表对应于最新剧情 (上一次 AI 回复之后), 我们应该把变量列表设置在 D1 或者 D0 位置:

:::{figure} 变量提示词.png
:::

### 具体解释变量含义

变量列表除了告诉 AI 变量当前值是多少外, 还有告诉 AI 变量是什么含义的作用.

一些变量的含义从名字就能看出来, 比如`世界.当前时间`、`世界.当前地点`、`主角.物品栏`等; 一些变量则有着特殊含义, 需要我们进一步解释.

例如, 对于`白娅.依存度`, AI 虽然能从名字看出来是白娅对主角的依恋程度, 但在具体数值比如 23 下, 白娅应该是什么样的心理状态? 倾向于采取怎样的行为? 这些都需要我们进一步解释. \
这其实就是很多卡里所说的 "分段好感度" 机制: 针对不同的依存度, 白娅应该有不同的行为和心理状态.

目前而言, 我们可以新建一个`角色阶段`条目, 在其中简单列出不同依存度时白娅的表现:

```yaml
白娅当前行为: # 白娅当前依存度为{{format_message_variable::stat_data.白娅.依存度}}，因此将倾向于进行与以下示例类似的行为
  # 0~19 时
  消极自毁:
    ...
  # 20~39 时
  渴求注视:
    ...
  # 40~59 时
  暗中靠近:
    ...
  # 60~79 时
  忐忑相依:
  # 80~100 时
  柔软依存:
    ...
```

但这样做有很明显的问题: 虽然目前白娅的依存度是在 23, 但我们仍旧发送了 0~19、40~59 等阶段的提示词. 这不仅浪费了输入 token, 还可能占用 AI 注意力, 让 AI 困惑不知道该让白娅采取哪个阶段的行为表现.

在下一章中, 我会教你如何用提示词模板来解决这个问题. 现在请回过头来, 学习三大变量提示词中的第二个——变量更新规则.

## 变量更新规则

变量更新规则告诉 AI 变量在什么情况下应该被更新、更新成什么值.

:::{admonition} 生成的变量更新规则
:class: dropdown, note

```yaml
---
变量更新规则:
  世界:
    当前时间:
      format: YYYY年MM月DD日 星期X HH:MM
    近期事务:
      type: |-
        {
          [事务名: string]: string; // 事务描述
        }
      check:
        - 记录需要完成的任务、约定、重要事件等
        - 完成后从列表中移除，新增事务时及时添加
        - 最多保持5-8项活跃事务，避免过度复杂
  白娅:
    依存度:
      type: number
      range: 0~100
      check:
        - 根据白娅对<user>行为的感知和反应调整 ±(3~6)
        - 仅在白娅当前察觉到<user>的行为时才更新
    着装.${上装|下装|内衣|袜子|鞋子|饰品}:
      check:
        - 换装、衣物损坏、特殊场合时更新
        - 描述需包含颜色、材质、款式等细节
        - 体现白娅的心理状态和对<user>的在意程度
    称号:
      type: |-
        {
          [称号名: string]: {
            效果: string;
            自我评价?: string;  // 默认为 '待评价'
          }
        }
      check:
        - 基于白娅的重要行为、心理变化或与<user>的互动获得
        - 如果自我评价为'待评价'，则应立即更新自我评价
        - 称号应反映白娅当前的依存状态和心理发展
        - 最多保持Math.ceil(依存度/10)个称号，超出时移除最早获得的
  主角:
    物品栏:
      type: |-
        {
          [物品名: string]: {
            描述: string;
            数量?: number;  // 默认为 1
          }
        }
      check:
        - 获取、消耗、丢弃物品时更新数量
        - 数量归零后该条目不再显示
```

:::

门之主写卡助手的变量更新规则写法是和变量结构、变量初始值、变量列表类似的. 例如 `白娅.依存度` 和 `白娅.称号` 被列为:

::::{tabs}

:::{tab} 变量列表

```yaml
白娅:
  依存度: 15
  称号:
    转学生:
      效果: 初来乍到，对环境陌生，容易引起他人注意但本人倾向于保持低调
      自我评价: 又是一个新的开始，但我注定会再次搞砸一切
```

:::

:::{tab} 变量更新规则

```yaml
---
变量更新规则:
  白娅:
    依存度:
      type: number
      range: 0~100
      check:
        - 根据白娅对<user>行为的感知和反应调整 ±(3~6)
        - 仅在白娅当前察觉到<user>的行为时才更新
    称号:
      type: |-
        {
          [称号名: string]: {
            效果: string;
            自我评价?: string;  // 默认为 '待评价'
        }
      check:
        - 基于白娅的重要行为、心理变化或与<user>的互动获得
        - 如果自我评价为'待评价'，则应立即更新自我评价
        - 称号应反映白娅当前的依存状态和心理发展
        - 最多保持Math.ceil(依存度/10)个称号，超出时移除最早获得的
```

:::

::::

在变量更新规则中沿用变量结构的好处是显而易见的: AI 能轻易知道每个更新规则对应于哪个变量, 而同样的结构又进一步强化了 AI 对变量结构的理解.

### 各个字段的意义

在门之主写卡助手的变量更新规则中, AI 可能使用以下字段: \
(我建议你直接让门之主写卡助手生成它, 删去一些不需要的更新规则, 只对 `check` 部分进行一些改动.)

`type`: 变量支持的类型
: 比如`白娅.依存度`是数值 (`number`), 而`任务进度`可能是`'未领取'|'进行中'|'已完成'`. \
  虽然我们生成的变量结构已经规定了变量只支持哪些类型, 但 AI 还不知道, 为此我们在这里告诉它, 让它总是将变量更新为可接受的值.

`range`: 数值变量必须处于的某个范围
: 比如`白娅.依存度`必须在 0~100 之间. \
  这其实也在变量结构中有规定, 但我们告诉 AI 让它知道会更好: 比起 AI 把依存度更新成 128 而被修复成 100, 我们当然更希望 AI 直接知道依存度必须在 0~100 之间.

`format`: 变量必须满足的特定格式
: 比如`世界.当前时间`必须是 `YYYY年MM月DD日 星期X HH:MM`. \
  这也可以在变量结构中规定, 但在示例卡中没有这样做, 而只是在变量更新规则中写了一句 `format: YYYY年MM月DD日 星期X HH:MM` 让 AI 知道有这么回事. 为什么呢? 因为在[示例卡](https://github.com/StageDog/tavern_helper_template/tree/main/示例/角色卡示例)中, `世界.当前时间`只是为了让 AI 知道当前时间是多少, 没满足格式也没关系, 哪怕是 `HH:MM YYYY/MM/DD` 等依旧能满足我的需要. \
  换句话说, **变量结构是对变量的硬性要求, 而变量更新规则中的 `type`、`range`、`format` 是对 AI 应该把变量更新成什么值的希望建议.**

`check`: AI 在更新变量时应该考虑的因素
: 比如`白娅.依存度`应该`根据白娅对<user>行为的感知和反应调整 ±(3~6)`, 而`白娅.称号`应该`基于白娅的重要行为、心理变化或与<user>的互动获得`. \
  这其实就是我们在具体书写变量在什么情况下应该被更新、更新成什么值了, 用自然语言平铺直叙你的要求即可.

### 避免重复书写变量更新规则

我们当然可以按照变量列表, 对每个变量一一列举变量更新规则, 但这无疑带来大量的重复工作和一些困难:

- 像`世界.当前地点`这样的变量, 变量名字本身就告诉了 AI 该怎么更新, 没必要再特意写变量更新规则.
- 像`白娅.着装.上装`、`白娅.着装.下装`这样的变量, 它们的更新规则几乎是一样的, 没必要重复书写.
- 像`称号`这样的变量, 其内有什么物品是未知的, 我们不可能在变量更新规则中一一列举.

如果你查看示例卡中的变量更新规则, 你会发现门之主写卡助手已经考虑了以上问题:

- 它会尝试省略`世界书.当前地点`这种名字已经告诉 AI 该怎么更新的变量——你在手写时也应该这么做;
- 它会尝试合并`白娅.着装.上装`、`白娅.着装.下装`这样的变量, 直接为`白娅.着装.${上装|下装|内衣|袜子|鞋子|饰品}`编写更新规则——你在手写时也应该这么做;
- 它能理解`称号`下面的`称号名`是任意的, 将`称号名`放在`type`部分进行解释; 你在手写时……没关系, 还不会写 `type` 是正常的, 附录里会教你哦!

### 将变量结构直接用于变量更新规则

除了让门之主写卡助手为你编写变量更新规则外, 另一种取巧的方法是直接将生成出的变量结构用于变量更新规则.

这从前面我解释变量更新规则中的字段时就能看出来: `type`、`range`、`format` 这些字段都是变量结构有规定的内容, 我们唯一需要填写的是 `check` 部分.

例如, 对于`白娅.依存度`, 它的变量结构是这样的:

```{code-block} js
:emphasize-lines: 6
import { registerMvuSchema } from 'https://testingcf.jsdelivr.net/gh/StageDog/tavern_resource/dist/util/mvu_zod.js';

export const Schema = z.object({
  白娅: z
    .object({
      依存度: z.coerce.number().transform(v => _.clamp(v, 0, 100)),
    })
});

$(() => {
  registerMvuSchema(Schema);
});
```

我们可以直接将它用于变量更新规则的 `type` 部分:

```{code-block} yaml
:emphasize-lines: 5
---
变量更新规则:
  白娅:
    依存度:
      type: z.coerce.number().transform(v => _.clamp(v, 0, 100))
      check:
        - 根据白娅对<user>行为的感知和反应调整 ±(3~6)
        - 仅在白娅当前察觉到<user>的行为时才更新
```

或者, 我们可以把整个变量结构复制成变量更新规则, 用 `/** 更新说明 */` 来解释每个变量应该如何更新:

```{code-block} yaml
:emphasize-lines: 6-10
---
变量更新规则: |-
  z.object({
    白娅: z
      .object({
        /**
         * check:
         *   - 根据白娅对<user>行为的感知和反应调整 ±(3~6)
         *   - 仅在白娅当前察觉到<user>的行为时才更新
         */
        依存度: z.coerce.number().transform(v => _.clamp(v, 0, 100)),
      })
  });
```

### 变量更新规则的插入位置

和变量列表必须与最新剧情相绑定不同, 变量更新规则不会影响 AI 对以前剧情的理解, 因此没必要非要插入到 D1 或 D0 位置——你完全可以将变量更新规则插入到剧情发展无关的位置, 比如:

- 角色定义之后、角色定义之前;
- 或者对于 claude 可以插入到 D3、D4 等位置, 然后利用{doc}`深度条目排斥器 </青空莉/作品集/index>`实现 claude、gemini 的同时适配.

这些位置占用 AI 更少的注意力, 让 AI 能更专注于其他提示词; 当然你也可以图省事放在 D0（

但是让 AI 更少注意变量更新规则, 不会让 AI 更新变量时更容易出错吗? 会的, 但变量输出格式里的思维链 (Chain of Thought, CoT) 会帮我们弥补这一点.

## 变量输出格式

变量输出格式告诉 AI 应该输出什么来更新变量.

门之主写卡助手中的变量输出格式采用了青空莉的{doc}`/青空莉/工具经验/提示词个人写法/额外输出格式/index`写法, `rule` 部分是输出规则, `format` 部分是输出格式. \
AI 于是在回复中按`变量输出格式`所指定的格式更新变量:

::::{tabs}

:::{tab} 英文提示词

```yaml
---
变量输出格式:
  rule:
    - you must output the update analysis and the actual update commands at once in the end of the next reply
    - the update commands works like the **JSON Patch (RFC 6902)** standard, must be a valid JSON array containing operation objects, but supports the following operations instead:
      - replace: replace the value of existing paths
      - delta: update the value of existing number paths by a delta value
      - insert: insert new items into an object or array (using `-` as array index intends appending to the end)
      - remove
      - move
    - don't update field names starts with `_` as they are readonly, such as `_变量`
  format: |-
    <UpdateVariable>
    <Analysis>$(IN ENGLISH, no more than 80 words)
    - ${calculate time passed: ...}
    - ${decide whether dramatic updates are allowed as it's in a special case or the time passed is more than usual: yes/no}
    - ${analyze every variable based on its corresponding `check`, according only to current reply instead of previous plots: ...}
    </Analysis>
    <JSONPatch>
    [
      { "op": "replace", "path": "${/path/to/variable}", "value": "${new_value}" },
      { "op": "delta", "path": "${/path/to/number/variable}", "value": "${positive_or_negative_delta}" },
      { "op": "insert", "path": "${/path/to/object/new_key}", "value": "${new_value}" },
      { "op": "insert", "path": "${/path/to/array/-}", "value": "${new_value}" },
      { "op": "remove", "path": "${/path/to/object/key}" },
      { "op": "remove", "path": "${/path/to/array/0}" },
      { "op": "move", "from": "${/path/to/variable}", "to": "${/path/to/another/path}" },
      ...
    ]
    </JSONPatch>
    </UpdateVariable>
```

:::

:::{tab} 中文提示词

```yaml
---
变量输出格式:
  rule:
    - 你必须在回复末尾输出更新分析和实际的更新命令
    - 更新命令效果与**JSON Patch (RFC 6902)**标准类似，有效的 JSON 数组，其中每个元素都是表示单个操作的对象，但支持的是以下操作而不是标准操作：
      - replace: 替换已存在变量的值
      - delta: 用一个变动值更新已存在的数值变量
      - insert: 插入新元素到对象或数组中 (使用`-`作为数组索引则表示追加到末尾)
      - remove
    - 不要更新以`_`开头的变量，因为它们是只读的，例如`_变量`
  format: |-
    <UpdateVariable>
    <Analysis>$(按英文输出，不超过80词)
    - ${计算经过的时间: ...}
    - ${根据当前情节是否足够特殊、时间跨度是否远超正常情况，判断是否允许变量值发生戏剧性变化: 是/否}
    - ${基于变量对应的`check`，仅根据当前回复而不是之前的剧情来分析每个变量是否需要更新: ...}
    </Analysis>
    <JSONPatch>
    [
      { "op": "replace", "path": "${/到/变量/的路径}", "value": "${新值}" },
      { "op": "delta", "path": "${/到/数值/变量/的路径}", "value": "${正或负的变动值}" },
      { "op": "insert", "path": "${/到/对象/新键/的路径}", "value": "${新值}" },
      { "op": "insert", "path": "${/到/数组/-}", "value": "${新值}" },
      { "op": "remove", "path": "${/到/对象/键/的路径}" },
      { "op": "remove", "path": "${/到/数组/的路径/0}" },
      ...
    ]
    </JSONPatch>
    </UpdateVariable>
```

:::

:::{tab} AI 输出结果

```text
剧情部分...

<UpdateVariable>
<Analysis>
- Time advanced by 10 minutes (from 10:47 to 10:57) for the class break and the subsequent interaction.
- Special Case? No, routine plot progression, no dramatic time skips.
- 白娅.依存度: Baiya showed a strong reaction to Qingkong Li (trembling, calling him "brother", self-denial but accepting the candy secretly). She definitely noticed his attention and action. This indicates a significant emotional impact, warranting an increase.
- 白娅.称号: The "哥哥" slip-up and the immediate self-punishment reinforce her internal conflict, but doesn't necessarily grant a new title yet. Her current titles are still very relevant.
- 主角.物品栏: The mints were placed on Baiya's desk. The item should be removed from inventory.
- 世界.近期事务: "转学生安置" is ongoing but the specific interaction happened. "午休临近" is becoming more relevant as break continues.
</Analysis>
<JSONPatch>
[
  { "op": "replace", "path": "/世界/当前时间", "value": "2024-04-08 10:57" },
  { "op": "replace", "path": "/白娅/依存度", "value": 40 },
  { "op": "remove", "path": "/主角/物品栏/薄荷糖" }
]
</JSONPatch>
</UpdateVariable>
```

:::

::::

注意到了吗, AI 输出结果与提示词的 `format` 部分几乎是一一对应的! 所以青空莉这套{doc}`/青空莉/工具经验/提示词个人写法/额外输出格式/index`真的很好用捏.

### 解释

让我们依次看看变量输出格式提示词是怎么写的吧!

它分成了 `rule` 和 `format` 两部分:

- `rule` 是输出规则. AI 只会读取这些要求, 而不会输出它们. 在这里, 青空莉为 AI:
  - 规定了变量输出格式应该输出到哪个位置 (`在回复末尾`);
  - 强调了输出的更新命令应该遵循 JSON Patch 规范; 而 MVU 能够解析 AI 回复中的 JSON Patch 命令来实际更新变量.
- `format` 是输出格式. 其内青空莉采用了 AI 能听懂的几种特殊格式来描述该如何输出:
  - `${描述}`: AI 需要根据 "描述" 将它替换为对应的内容. 例如 `衣着: ${具体描述角色当前衣着}` 可能输出 `衣着: 粉金色宽松T恤睡裙`;
  - `$(要求)`: AI 只会听从 "要求" 而不对它进行输出. 例如 `$(以下内容应该按英文输出)` 会让 AI 更倾向于用英文输出之后的内容;
  - `...`: AI 需要仿照之前给定的规则和内容补充输出. 例如 `其他角色: ...` 会让 AI 根据前面给定的 `白娅` 的输出格式, 补充其他角色的输出;
  - 其他内容原封不动地进行输出, 所以 AI 原封不动地输出了 `<UpdateVariable>`、`<Analysis>`、`<JSONPatch>` 等标签.

现在再回过头来看刚刚的提示词和 AI 输出结果, 是不是能够理解它们之间的关系了呢?

::::{tabs}

:::{tab} 英文提示词

```yaml
---
变量输出格式:
  rule:
    - you must output the update analysis and the actual update commands at once in the end of the next reply
    - the update commands works like the **JSON Patch (RFC 6902)** standard, must be a valid JSON array containing operation objects, but supports the following operations instead:
      - replace: replace the value of existing paths
      - delta: update the value of existing number paths by a delta value
      - insert: insert new items into an object or array (using `-` as array index intends appending to the end)
      - remove
      - move
    - don't update field names starts with `_` as they are readonly, such as `_变量`
  format: |-
    <UpdateVariable>
    <Analysis>$(IN ENGLISH, no more than 80 words)
    - ${calculate time passed: ...}
    - ${decide whether dramatic updates are allowed as it's in a special case or the time passed is more than usual: yes/no}
    - ${analyze every variable based on its corresponding `check`, according only to current reply instead of previous plots: ...}
    </Analysis>
    <JSONPatch>
    [
      { "op": "replace", "path": "${/path/to/variable}", "value": "${new_value}" },
      { "op": "delta", "path": "${/path/to/number/variable}", "value": "${positive_or_negative_delta}" },
      { "op": "insert", "path": "${/path/to/object/new_key}", "value": "${new_value}" },
      { "op": "insert", "path": "${/path/to/array/-}", "value": "${new_value}" },
      { "op": "remove", "path": "${/path/to/object/key}" },
      { "op": "remove", "path": "${/path/to/array/0}" },
      { "op": "move", "from": "${/path/to/variable}", "to": "${/path/to/another/path}" },
      ...
    ]
    </JSONPatch>
    </UpdateVariable>
```

:::

:::{tab} 中文提示词

```yaml
---
变量输出格式:
  rule:
    - 你必须在回复末尾输出更新分析和实际的更新命令
    - 更新命令效果与**JSON Patch (RFC 6902)**标准类似，有效的 JSON 数组，其中每个元素都是表示单个操作的对象，但支持的是以下操作而不是标准操作：
      - replace: 替换已存在变量的值
      - delta: 用一个变动值更新已存在的数值变量
      - insert: 插入新元素到对象或数组中 (使用`-`作为数组索引则表示追加到末尾)
      - remove
    - 不要更新以`_`开头的变量，因为它们是只读的，例如`_变量`
  format: |-
    <UpdateVariable>
    <Analysis>$(按英文输出，不超过80词)
    - ${计算经过的时间: ...}
    - ${根据当前情节是否足够特殊、时间跨度是否远超正常情况，判断是否允许变量值发生戏剧性变化: 是/否}
    - ${基于变量对应的`check`，仅根据当前回复而不是之前的剧情来分析每个变量是否需要更新: ...}
    </Analysis>
    <JSONPatch>
    [
      { "op": "replace", "path": "${/到/变量/的路径}", "value": "${新值}" },
      { "op": "delta", "path": "${/到/数值/变量/的路径}", "value": "${正或负的变动值}" },
      { "op": "insert", "path": "${/到/对象/新键/的路径}", "value": "${新值}" },
      { "op": "insert", "path": "${/到/数组/-}", "value": "${新值}" },
      { "op": "remove", "path": "${/到/对象/键/的路径}" },
      { "op": "remove", "path": "${/到/数组/的路径/0}" },
      ...
    ]
    </JSONPatch>
    </UpdateVariable>
```

:::

:::{tab} AI 输出结果

```text
剧情部分...

<UpdateVariable>
<Analysis>
- Time advanced by 10 minutes (from 10:47 to 10:57) for the class break and the subsequent interaction.
- Special Case? No, routine plot progression, no dramatic time skips.
- 白娅.依存度: Baiya showed a strong reaction to Qingkong Li (trembling, calling him "brother", self-denial but accepting the candy secretly). She definitely noticed his attention and action. This indicates a significant emotional impact, warranting an increase.
- 白娅.称号: The "哥哥" slip-up and the immediate self-punishment reinforce her internal conflict, but doesn't necessarily grant a new title yet. Her current titles are still very relevant.
- 主角.物品栏: The mints were placed on Baiya's desk. The item should be removed from inventory.
- 世界.近期事务: "转学生安置" is ongoing but the specific interaction happened. "午休临近" is becoming more relevant as break continues.
</Analysis>
<JSONPatch>
[
  { "op": "replace", "path": "/世界/当前时间", "value": "2024-04-08 10:57" },
  { "op": "replace", "path": "/白娅/依存度", "value": 40 },
  { "op": "remove", "path": "/主角/物品栏/薄荷糖" }
]
</JSONPatch>
</UpdateVariable>
```

:::

::::

接下来我们再来看看 `format` 部分是怎么设计的吧!

`format` 的所有输出内容被包裹在了 `<UpdateVariable>` 标签中, 这会方便我们马上要提及的 "酒馆正则" 处理. \
而在它里面有 `<Analysis>` 和 `<JSONPatch>` 两个部分, 分别对应了对变量更新进行分析和实际输出变量命令.

我们让 AI 先输出对变量更新的分析, 再实际输出变量更新命令. 这种先让 AI "打草稿" 再输出正式内容的方式, 就是思维链 (Chain of Thought, CoT) 的典型应用. \
注意哦, `<Analysis>` 就是思维链了, 而且是专门用于变量更新的思维链! 不要被人误导, 以为变量更新还需要额外加思维链啦.

在 `<Analysis>` 部分有三个思考内容, 是青空莉常用的三个, 我也觉得挺好用x:

::::{tabs}

:::{tab} 英文提示词

```{code-block} yaml
:caption: 计算剧情时间变化
- ${calculate time passed: ...}
```

```{code-block} yaml
:caption: 允许变量因剧情而发生剧烈变动
- ${decide whether dramatic updates are allowed as it's in a special case or the time passed is more than usual: yes/no}
```

```{code-block} yaml
:caption: 回忆变量更新所需的 `check`, 据此分析该如何更新
- ${analyze every variable based on its corresponding `check`, according only to current reply instead of previous plots: ...}
```

:::

:::{tab} 中文提示词

```{code-block} yaml
:caption: 计算剧情时间变化
- ${计算经过的时间: ...}
```

```{code-block} yaml
:caption: 允许变量因剧情而发生剧烈变动 (好感度从 100 直接掉到 0)
- ${根据当前情节是否足够特殊、时间跨度是否远超正常情况，判断是否允许变量值发生戏剧性变化: yes/no}
```

```{code-block} yaml
:caption: 回忆变量更新所需的 `check`, 据此分析该如何更新
- ${基于变量对应的`check`，仅根据当前回复而不是之前的剧情来分析每个变量是否需要更新: ...}
```

:::

::::

其中最值得学习的是`` 回忆变量更新所需的`check`, 据此分析该如何更新 ``.
: 还记得我们在 "变量更新规则" 部分遗留的问题吗? 变量更新规则可以放在角色定义之前、D4 之类更不占用注意力的位置, 从而让 AI 更注意其他提示词和剧情. 但是由于 AI 更少去注意变量更新规则, 它在更新变量时更容易出错了.
: 变量更新规则的核心是 `check`, 它告诉 AI 应该根据什么来更新变量、更新成什么值. 而我们在变量输出格式的 `<Analysis>` 部分要求 AI 输出思维链来回忆 `check`, 也就是在 "召回" 它对变量更新规则的注意力, 从而稳定变量更新.

(MVU_让AI知道以前的变量更新情况)=

### 酒馆正则

有了变量输出格式, AI 将会在回复时输出 `<UpdateVariable>` 来更新变量. 但这个输出会放在楼层里, 如果我们不加以处理, 玩家后续游玩时, 酒馆会将每楼的 `<UpdateVariable>` 也发给 AI.

但显然, AI 输出的 `<UpdateVariable>` 没必要再发给 AI: `<UpdateVariable>` 中的更新命令已经被 MVU 脚本解析使用了, 而 AI 在后续回复中很少需要参考它来稳定变量更新格式——我们已经在世界书里给了变量输出格式了.

如果我们保留所有楼层的 `<UpdateVariable>` 发给 AI:

- 首先, 这浪费了 token;
- 其次, AI 可能不必要地花费注意力去学习之前的 `<UpdateVariable>` 而更少地将注意力放在剧情上;
- 最后, AI 可能偷懒直接照抄之前的 `<UpdateVariable>` 而不真的分析思考该如何更新变量!

因此, 我们需要在后续生成时不发送 `<UpdateVariable>` 部分给 AI——这就用到了酒馆正则.

酒馆正则能够捕获 AI 回复和用户输入中的特定文本, 让它在某些用途下被替换为指定内容:

- {menuselection}`仅格式提示词`: 在发送给 AI 时被替换为指定内容
- {menuselection}`仅格式显示`: 在酒馆中显示时被替换为指定内容
- 两个都不勾选: 在 AI 输出接收到时或用户输入发送出去时就被**永久**替换掉

:::{figure} 酒馆正则.png
:::

:::{hint}
如果你还不够理解以上说明, 也许可以看看自己酒馆中的预设配套正则或者角色卡里的美化正则.
:::

为了便于大家操作, 青空莉已经提前制作了处理 `<UpdateVariable>` 变量更新的酒馆正则, 你只需下载导入其中一个版本的三个正则即可:

- 美化版 ([点此查看演示](https://gitgud.io/StageDog/tavern_resource/-/raw/main/src/正则/变量更新/美化版.mp4)): {stagedog}`[不发送]去除变量更新 <src/正则/变量更新/regex-[不发送]去除变量更新.json>`、{stagedog}`[美化]变量更新中 <src/正则/变量更新/regex-[美化]变量更新中.json>`、{stagedog}`[美化]完整变量更新 <src/正则/变量更新/regex-[美化]完整变量更新.json>`
- 折叠版 ([点此查看演示](https://gitgud.io/StageDog/tavern_resource/-/raw/main/src/正则/变量更新/折叠版.mp4)): {stagedog}`[不发送]去除变量更新 <src/正则/变量更新/regex-[不发送]去除变量更新.json>`、{stagedog}`[折叠]变量更新中 <src/正则/变量更新/regex-[折叠]变量更新中.json>`、{stagedog}`[折叠]完整变量更新 <src/正则/变量更新/regex-[折叠]完整变量更新.json>`
- 仅提示版 (不能展开查看更新内容): {stagedog}`[不发送]去除变量更新 <src/正则/变量更新/regex-[不发送]去除变量更新.json>`、{stagedog}`[仅提示]变量更新中 <src/正则/变量更新/regex-[仅提示]变量更新中.json>`、{stagedog}`[仅提示]完整变量更新 <src/正则/变量更新/regex-[仅提示]完整变量更新.json>`

其中,

- `去除变量更新`是利用了正则的{menuselection}`仅格式提示词`功能, 在发送给 AI 时将整个 `<UpdateVariable>` 部分替换成空.
- `变量更新中`和`完整变量更新`是利用了正则的{menuselection}`仅格式显示`功能, 美化 `<UpdateVariable>` 的显示, 方便玩家查看是否发生了更新但隐藏更新了什么.

不过, `去除变量更新`默认是使得所有楼层的 `<UpdateVariable>` 都不发送给 AI, 但有时候保留最后一两层发给 AI 也是一种选择: 如果所有楼层的 `<UpdateVariable>` 都不发送给 AI, AI 可能误以为是要根据所有剧情来更新变量, 从而重复之前本应做过的更新.

例如, 在上一次回复中, AI 已经根据 "白娅和主角去约会" 这一剧情更新过了白娅的依存度, 但它在这次回复时看不到以前的 `<UpdateVariable>`, 于是它可能会再次根据 "白娅和主角去约会" 这一剧情更新白娅的依存度.

如果你遇到这种重复依据剧情更新变量的情况, 那么你可以选择保留最后一两层变量发给 AI.

要做到这一点, 你可以使用酒馆正则的`最小深度`功能, 它限制酒馆正则只对深度至少是特定数值的楼层有效:

```text
...
深度 3: 倒数第 4 楼, 一般是 AI 回复
深度 2: 倒数第 3 楼, 一般是用户输入
深度 1: 倒数第 2 楼, 一般是最后一条 AI 回复 
深度 0: 倒数第 1 楼, 一般是最后一条用户输入
```

也就是说, 如果我们将`去除变量更新`的最小深度设置成`4`, 那么它只对倒数第 5 楼及以上的楼层有效……这样一来, 我们就保留了最后一两层的变量更新情况发给 AI 了呢! \
(当然代价是前面所说的浪费 token、浪费注意力以及 AI 可能偷懒学习以前的 `<UpdateVariable>` 而不真的分析思考该如何更新变量😭)

### 变量更新强调

即便我们在 D0 设置了变量输出格式, 一些模型、预设可能依旧不会按要求输出 `<UpdateVariable>...</UpdateVariable>` 来更新变量.

如果你遇到了这种情况, 可以像青空莉在{doc}`/青空莉/工具经验/提示词个人写法/额外输出格式/index`中提的那样, 在 D0 给变量输出格式添加一个输出格式强调:

```yaml
---
变量输出格式强调:
  rule: The following must be inserted to the end of reply, and cannot be omitted
  format: |-
    <UpdateVariable>
    ...
    </UpdateVariable>
```

(为不同开局设置不同变量初始值_增量方案)=

### 为不同开局设置不同变量初始值 (增量方案)

在{ref}`为不同开局设置不同变量初始值_全量方案` 中, 我介绍了如何用 `<initvar>...</initvar>` 块为不同开局设置不同的变量初始值.

但这种方法要求我们在每个开局都完整写一遍变量初始值. 例如, 明明 `[initvar]` 条目和开局 2 只有`挫折模式开关`不同, 但我们不得不在开局 2 中填写完整的变量结构:

::::{tabs}

:::{tab} [initvar] 条目

```{code-block} yaml
:emphasize-lines: 6
白川璃:
  好感度: 25
  孤独感: 60
  恋人关系: false
  死亡: false
  挫折剧情开关: false
```

:::

:::{tab} 开局 2

````{code-block} text
:emphasize-lines: 11
开局 2 剧情...

<UpdateVariable>
<initvar>
```yaml
白川璃:
  好感度: 25
  孤独感: 60
  恋人关系: false
  死亡: false
  挫折剧情开关: true
```
</initvar>
</UpdateVariable>
````

:::

::::

好麻烦啊! 有的时候我们只是想改一两个变量而已qwq \
……除了使用 `<initvar>...</initvar>` 块来在开局完全重新设置变量初始值, 我们也可以只对 `[initvar]` 条目所设定的变量初始值进行部分修改.

这需要我们再重新理解一下变量输出格式是怎么生效的:

- AI 根据变量输出格式, 首先输出对变量更新的分析, 再实际输出变量更新命令;
- MVU 读取消息中的变量更新命令, 更新对应的变量.
- 这个更新过程在每个楼层都会进行: `initvar 设定的变量值` -> `第 0 楼更新后的变量值` -> `第 1 楼更新后的变量值` -> ...
- 每个楼层都会保存自己楼层的变量值, 所以你能在{menuselection}`酒馆输入框左边魔棒 --> 变量管理器 --> 消息楼层`中看到每个楼层的变量值, 而且删除楼层时变量也能够正常回退.

再重复一遍, "这个更新过程在每个楼层都会进行". \
是的! 在开局消息 (第 0 楼) 中, 你也可以用变量更新命令来更新变量!

```{code-block} text
:emphasize-lines: 6
开局 2 剧情...

<UpdateVariable>
<JSONPatch>
[
  { "op": "replace", "path": "/白川璃/挫折剧情开关", "value": true }
]
</JSONPatch>
</UpdateVariable>
```

可是 `<JSONPatch>` 部分看起来好复杂啊——没关系! 我们已经有了变量输出格式. 你可以把开局剧情发给 AI, 让 AI 给你生成对应的变量更新命令.

## 适配两种变量更新方式

为了让 AI 能专注于剧情, MVU 支持两种变量更新方式, 可供玩家自由选择:

- 随 AI 输出: AI 先输出剧情再输出变量更新命令;
- 额外模型解析: 先由一个 AI 专门输出剧情, 再由一个 AI 专门解析剧情输出变量更新命令.

:::{figure} 变量更新方式.png
:::

你如果是通过门之主写卡助手生成的三大变量提示词, 就会注意到生成的条目名字是`变量列表`、`[mvu_update]变量更新规则`、`[mvu_update]变量输出格式`. `[mvu_update]` 这个前缀其实就是为了适配两种变量更新方式:

- 随 AI 输出: 所有条目正常发给 AI.
- 额外模型解析:
  - 名字中有 `[mvu_plot]` 的条目只会发给负责输出剧情的 AI
  - 名字中有 `[mvu_update]` 的条目只会发给负责更新变量的 AI, 因此`变量更新规则`和`变量输出格式`前面添加了 `[mvu_update]`
  - 名字中既没有 `[mvu_plot]` 也没有 `[mvu_update]` 的条目将会发送给两个 AI

也就是说, 如果你按照本教程, 用`变量列表`、`[mvu_update]变量更新规则`、`[mvu_update]变量输出格式`来填写变量提示词, 那么你的这张角色卡已经适配两种变量更新方式了!

当然, 你可以再对其他条目名字中添加 `[mvu_plot]` 或 `[mvu_update]` , 来进一步控制 "额外模型解析" 更新方式下要发送哪些提示词. \
比如如果你有其他输出格式，为了不对变量更新 AI 产生干扰，你可以用 `[mvu_plot]` 指定它只发给负责输出剧情的 AI: `[mvu_plot]剧情思维链`.

这样修改名字只是区分条目会发给哪个 AI, 世界书条目的绿灯等功能依旧会生效.

:::{hint}
只要名字中包含 `[mvu_plot]` 或 `[mvu_update]` 就可以! `[mvu_update]变量更新规则` 和 `变量更新规则[mvu_update]` 效果是一样的.
:::

## 变量提示词只是提示词

变量提示词, 无论是变量列表、变量更新规则还是变量输出格式, **只是我们写在世界书里的提示词**而已. 上面的教程中我给出了门之主写卡助手使用的版本, 但你完全可以自己调整或者重新设计一套!

比如, 一些变量可能只在某些情况下被需要: 如果任务系统只和某个角色绑定, 那么明显我们只需要角色出场时才发送任务系统的提示词.

按照{ref}`MVU_选择性地发给AI变量列表`的思路, 我们当然可以做到:

```{code-block} yaml
:emphasize-lines: 5-8
---
<status_current_variable>
角色:
  {{format_message_variable::stat_data.角色}}
# ⬇️⬇️⬇️⬇️⬇️利用绿灯或之后介绍的功能, 我们可以只在特定情况发送下面这段提示词
任务系统:
  {{format_message_variable::stat_data.任务系统}}
# ⬆️⬆️⬆️⬆️⬆️
</status_current_variable>
```

而任务系统的变量更新规则也可以同样处理.

又比如, 我们的变量很少而且很简单, 那么完全没必要单独列一个 `[mvu_update]变量更新规则`, 而是可以直接把它塞到 `[mvu_update]变量输出格式` 中:

```{code-block} yaml
:emphasize-lines: 8
---
变量输出格式:
  rule: you must output <UpdateVariable> at the end of each reply
  format: |-
    <UpdateVariable>
    <JSONPatch>
    [
      { op: "delta", path: "/白娅/依存度", value: ${根据白娅对<user>当前行为的态度变化} }
    ]
    </JSONPatch>
    </UpdateVariable>
```

这样简化了的变量列表、变量输出格式, 显然比让 AI 输出文字状态栏:

- 更省 token: 文字状态栏需要 AI 知道完整的状态栏格式, 包括那些其实不会变化的部分; 而变量输出格式只需要 AI 知道应该变化的部分.
- 更不容易掉格式: AI 不需要自己输出特定的状态栏格式, 而是输出它很熟悉的 JSON 格式

归根结底, 变量提示词, 无论是变量列表、变量更新规则还是变量输出格式, 只是我们写在世界书里的提示词而已. 正常的世界书条目能怎么写, 变量提示词就也可以: 绿灯、黏性……以及下一章我会教你的提示词模板.

## 测试变量提示词

现在有了变量提示词, 你可以打开日志查看器在一旁, 随便要求 AI 推进剧情 (如, 发送一句`推进剧情`) 来查看变量提示词有没有生效:

如果 AI 回复中没有 `<UpdateVariable>`
: 可能是你其他提示词占用了过多注意力, 或者你的变量提示词没有正确生效. \
  请关闭全局世界书, 调整其他提示词的注意力, 并验证变量提示词有没有按本章正确设置好.

如果 AI 回复了 `<UpdateVariable>` 说明你的变量提示词设置正常, 可以实际游玩来测试变量更新的稳定性了!

- 让我们打开变量管理器挂在旁边, 方便我们确认变量更新情况;
- 让我们启用 MVU 变量框架中的{menuselection}`变量更新出错时通知`, 方便我们知道游玩过程中变量更新出错了:

  :::{figure} 变量更新出错时通知.png
  :::

:::{hint}
如果你的角色卡支持中途新增角色, 又给每个角色设计了几十个变量, 那么 AI 在为新角色设置变量时很可能遗漏某些变量, 从而无法成功新增角色.

为此, 你可以要求 AI 在变量结构脚本中为角色的变量设置默认值 `待初始化` (或你想要的其他默认值), 这样一来, AI 哪怕遗漏角色的某些变量, 整个角色依旧能够新增到角色列表中, 而 AI 可以在后续回复中初始化这些 `待初始化` 变量.
:::

## 回顾

至此, 我们的变量环境已经搭建完毕:

- 我们生成并新建了`变量结构`脚本, 它定义了我们的角色卡有哪些变量;
- 我们用 `[initvar]变量初始化勿开` 条目和开局里的 `<initvar>` 块为每个开局设置了初始值;
- 我们设计了变量提示词, 让 AI 了解了变量:
  - 通过变量列表, 了解了当前的变量情况;
  - 通过变量更新规则, 了解了变量在什么情况下应该被更新, 以及该被更新成什么值;
  - 通过变量输出格式, 了解了应该输出什么来更新变量.
- 我们导入了一套酒馆正则, 使得之前的 `<UpdateVariable>` 块不会再发送给 AI, 防止 AI 过拟合.

这套环境已经能有效替代传统的、需要每层都完整输出所有文本的状态栏, 能够精准地提醒 AI 当前的剧情状态啦!

——但变量能做到的不仅仅是这些.

前面提到, 对于`白娅.依存度`, AI 虽然能从名字看出来是白娅对主角的依恋程度, 但在具体数值比如 23 下, 白娅应该是什么样的心理状态? 倾向于采取怎样的行为? 这些都需要我们进一步解释.

当时我们的选择是新建一个`角色阶段`条目, 在其中列举出每个依存度阶段下白娅的行为:

```yaml
白娅当前行为: # 白娅当前依存度为{{format_message_variable::stat_data.白娅.依存度}}，因此将倾向于进行与以下示例类似的行为
  # 0~19 时
  消极自毁:
    ...
  # 20~39 时
  渴求注视:
    ...
  # 40~59 时
  暗中靠近:
    ...
  # 60~79 时
  忐忑相依:
  # 80~100 时
  柔软依存:
    ...
```

但这样做有很明显的问题: 虽然目前白娅的依存度是在 23, 但我们仍旧发送了 0~19、40~59 等阶段的提示词. 这不仅浪费了输入 token, 还可能占用 AI 注意力, 让 AI 困惑不知道该让白娅采取哪个阶段的行为表现.

如果我们能根据当前的依存度, 只发送与当前依存度对应的提示词, 那该多好啊! \
如果我们能在依存度达到 100 时触发一个预先写好的表白剧情, 那该多好啊! \
……我们当然能😈.
