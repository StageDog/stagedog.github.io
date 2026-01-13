# 附.手写变量结构

{{ prolog }}

在教程正文中, 我们使用门之主写卡助手中的变量结构提示词来让 AI 生成变量结构, 但你也许:

- 想要自己编写;
- 想要能不依靠 AI 直接读懂 AI 生成出来的变量结构.

这就是本章会教学的内容.

:::{hint}
对于电脑, 为了更方便地编写变量结构, 请通过{doc}`/青空莉/工具经验/实时编写前端界面或脚本/index`配置好 VSCode, 在编写模板中新建一个 `schema.ts` 文件来编写.
:::

## 引入

### 变量结构脚本的结构

让我们实际看看一个只有`依存度`变量的变量结构脚本:

```js
import { registerMvuSchema } from 'https://testingcf.jsdelivr.net/gh/StageDog/tavern_resource/dist/util/mvu_zod.js';

export const Schema = z.object({
  白娅: z.object({
    依存度: z.coerce.number(),
  }),
})

$(() => {
  registerMvuSchema(Schema);
});
```

拿这个脚本与之前教程正文中的脚本对比就会发现, 脚本顶部的一行 `import ...` 和底部的一块 `$(...)` 总是一样的, 我们唯一需要了解的是如何用 [zod 库](https://zod.dev/)编写 `export const Schema`.

但如果你不了解代码, 哪怕只是 `export const Schema` 这三行代码也可能对你是比较复杂的. 因此, 让我们先来看看变量初始化 `[initvar]` 所使用的格式, 再回过头来类比地学习 `export const Schema` 的写法.

### `[initvar]` 所使用的 YAML 语法

对于上面那个只有`依存度`变量的变量结构, 它所对应的 `[initvar]` 可以是:

```yaml
白娅:
  依存度: 0
```

这种格式叫作 YAML. 在 YAML 中, 英文冒号 (`:`) 用于建立从属关系, 而缩进则用来表示层级.

什么叫层级呢……简单来说就是文件夹和文件的关系! 在上面的 `[initvar]` 中, 我们创建了一个名为 "白娅" 的文件夹, 其中有个叫作 "依存度" 的文件, 它的文件内容是数字 `0.4`.

我们当然可以 "文件夹" 里再套 "文件夹", 或者在一个 "文件夹" 里有多个 "文件":

```yaml
白娅:
  依存度: 0.4
  着装:
    上装: 整洁的深蓝色校服外套，一丝不苟地扣好每一颗纽扣
  受孕: true
```

从这一个 `[initvar]` 中你可以看到三种文件类型: \
(实际不止, 但对我们写角色卡而言, 你只需要了解这三种; 其他的要么复杂、要么对 AI 不方便)

- 数值 (number): 任意数字, 如 `依存度: 0.4`;
- 文本 (string): 任意文本, 如 `上装: 整洁的深蓝色校服外套，一丝不苟地扣好每一颗纽扣`;
- 真假值 (boolean): 只有真 (`true`) 或假 (`false`) 两种情况, 如 `受孕: true`.

## 初试 zod schema

`export const Schema` 是使用 [zod 库](https://zod.dev/)编写, 基本结构其实与上面的 YAML 相同: "文件夹" 里套 "文件夹" 和 "文件".

YAML 中的 "文件夹" 对应于 zod 库中的 `z.object({ ... })`, 其中 `...` 就是文件夹的具体内容, 如果我们不填写则文件夹为空——让我们规定变量结构是一个空的文件夹:

```js
export const Schema = z.object({});
```

最顶层的文件夹规定好了, 我们现在来规定这个文件夹里有一个`白娅`文件夹:

```js
export const Schema = z.object({
  白娅: z.object({}),  // <-- 注意每个文件夹、文件之间都要有逗号间隔
});
```

然后, 我们来规定`白娅`文件夹内有`依存度`这个数值文件、`着装.上装`这个文本文件和`受孕`这个真假值文件:

- 数值文件对应于 `z.number()`;
- 文本文件对应于 `z.string()`;
- 真假值文件对应于 `z.boolean()`.

```js
export const Schema = z.object({
  白娅: z.object({
    依存度: z.number(),
    着装: z.object({
      上装: z.string(),
    }),
    受孕: z.boolean(),
  }),
});
```

不过, 由于 AI 经常莫名其妙把数值变量 (`依存度: 0`) 更新成文本变量 (`依存度: "0"`), 我们应该让依存度不只能接收数值变量, 还能尝试将文本变量转换为数值变量——我们总是使用 `z.coerce.number()` 而不是 `z.number()`:

```{code-block} js
:emphasize-lines: 3

export const Schema = z.object({
  白娅: z.object({
    依存度: z.coerce.number(),
    着装: z.object({
      上装: z.string(),
    }),
    受孕: z.boolean(),
  }),
});
```

总之, 你现在已经了解了 `zod` 的几种类型:

- `z.object({...})` 用于规定变量能接收一个对象 (文件夹), 而这个对象内必须有 `{...}` 指定的那些字段 (文件或子文件夹);
- `z.string()` 用于规定变量能接收任意文本;
- `z.boolean()` 用于规定变量只能是真值 (`true`) 或假值 (`false`);
- `z.coerce.number()`: 用于规定变量能接收数值, 并且会尝试将文本转换成数值来接收.

## 限制文本变量的内容

很多时候, 我们不希望文本变量能接收任意文本, 例如:

- `任务状态`只可能是 "进行中"、"已失败"、"已完成" 中的一种;
- `当前章节`必须满足 "D1.C1.E1.S2" 这样的格式.

### `z.literal('文本')`: 只能是固定文本

我们可以用 `z.literal('文本')` 来规定变量只接收某个固定文本, 其他任何文本都不能被接收:

```js
export const Schema = z.object({
  变量: z.literal('你好'),
}),
```

当然, 对于写角色卡, 我们很少会遇到变量只能是某个固定文本的情况: 如果变量只能是某个固定文本, 那为什么还费心费力把它作为变量、编写规则让 AI 更新它?

但 `z.literal('文本')` 是 "基石". 我们能限制变量只接收某个固定文本, 那么就能限制变量接收固定文本 A 或者 (or) 接收固定文本 B:

```js
export const Schema = z.object({
  变量: z.literal('你好').or(z.literal('我好')),
}),
```

但如果我们要接收的固定文本有很多, 我们就得一直 `.or(...).or(...)`——可以用 `z.union([...])` 改善这种情况:

```js
export const Schema = z.object({
  任务状态: z.union([z.literal('进行中'), z.literal('已失败'), z.literal('已完成')]),
});
```

### `z.enum([...])`: 只接收几种固定文本

但要在 `z.union([...])` 里给每个固定文本添加 `z.literal('文本')` 太麻烦了! zod 为此提供了 `z.enum([...])`:

```js
export const Schema = z.object({
  任务状态: z.enum(['进行中', '已失败', '已完成']),
});
```

### `z.templateLiteral([...])`: 接收特定格式文本

通过 `z.templateLiteral([...])`, 我们可以规定要接收的文本必须由几个子部分组成. 例如, `体重`必须是一个数值和一个 "kg" 文本.

```js
export const Schema = z.object({
  体重: z.templateLiteral([z.coerce.number(), z.literal('kg')]),
});
```

而当前章节不过是这种情况的重复:

```js
export const Schema = z.object({
  当前事件: z.templateLiteral([
    z.literal('D'),
    z.coerce.number(),
    z.literal('.C'),
    z.coerce.number(),
    z.literal('.E'),
    z.coerce.number(),
    z.literal('.S'),
    z.coerce.number(),
  ]);
});
```

### 更多更多

当然, zod 库不止能像上面那样限制文本值, 例如你还可以用 `z.regex(...)` 来限定文本必须满足一个正则表达式.

不过一般 `z.enum([...])` 已经足够我们写变量卡, 有更多需要可以让 AI 给你写或者翻找 [zod 文档](https://zod.dev/).

## 限制数值变量的内容

同样的, 我们很多时候不希望数值变量能接收任意数值, 例如:

- `约会次数`必须是整数
- `依存度`最低只能是 0, 最高只能是 100

### `.int()`: 只接收整数

```js
export const Schema = z.object({
  约会次数: z.coerce.number().int(),
});
```

### `.min()`、`.max()`: 最大最小值

通过同时使用 `.min(...)` 和 `.max(...)`, 我们能限定变量只接收某个范围的数值:

```js
export const Schema = z.object({
  依存度: z.coerce.number().min(0).max(100),
});
```

但对于角色卡, AI 很可能不听要求输出 -3、104 等数值. 相比起只接收 0 到 100 之间的数值, 我们更可能希望 0 到 100 之外的数值也能被接收, 在接收之后被限制回 0 到 100 之间 (接收到 -3 时限制成 0, 接收到 104 时限制成 100). \
也就是说, 我们依旧允许变量接收任意数值, 只是在接收到数值后, 对它进行转化 (transform):

```js
export const Schema = z.object({
  依存度: z.coerce.number().transform(value => _.clamp(value, 0, 100));
});
```

`.transform(接收到的值 => 处理后结果)` 已经算是必须要一定代码基础才能使用的功能了, 你可以让 AI 辅助你编写.

不过, 单纯 `.transform(value => _.clamp(value, 0, 100))` 还是能读懂的: 我们将接收到的值命名为 `value`, 把它限制到 0 和 100 之间 (`_.clamp(要限制的值, 可以取的最小值, 可以取的最大值)`).

又比如, 我们可以这样限制约会次数最少是 0 次:

```js
export const Schema = z.object({
  约会次数: z.coerce.number().int().transform(value => Math.max(value, 0));
});
```

其中, `Math.max(值1, 值2)` 的结果会是两个值中最大 (max) 的那个值, 也就是说 `Math.max(-3, 0)` 的结果会是 `0`.

## `z.union([...])`: 接收几种情况

在文本变量部分提到的 `.or(...)` 和 `z.union([...])` 并不只能用于文本. 例如, 你可以规定一个变量既能接收数值, 又能接收`'待初始化'`:

```js
export const Schema = z.object({
  依存度: z.coerce.number().or(z.literal('待初始化')),
});
```

如果你的角色卡开局无法确定某些变量的初始值, 比如你是让玩家填写人物信息、选择天赋等再生成开局和变量情况, 那么像这样允许变量能接收`'待初始化'`是很方便的. 这样一来, 你可以把 `[initvar]` 写成:

```yaml
依存度: 待初始化
```

当然, 如果你是在开局制作了一个**专门的前端界面**让玩家设置主角出身、选择开局, 可以直接按{doc}`/络络/教程/手写mvu变量卡/脚本控制变量/index`和{doc}`/络络/教程/手写mvu变量卡/状态栏/index`**在前端界面中直接修改变量, 而不必指望 AI 正确输出.**

## `z.record(键, 值)`: 字段不固定的对象

我们前面只提及了使用 `z.object({...})` 来创建一个对象 (文件夹), 但这样创建的对象里面有什么字段 (文件) 是完全固定的. 例如, `白娅`对象内只有一个`依存度`字段:

```js
export const Schema = z.object({
  白娅: z.object({
    依存度: z.coerce.number(),
  }),
});
```

但我们会想做类似物品栏的变量, 它里面有什么字段是不固定的, 例如:

```yaml
物品栏:
  陈旧的创可贴:
    描述: 钱包夹层里放了两年的卡通创可贴，粘性大概已经失效了
    数量: 1
  薄荷糖:
    描述: 提神用的强力薄荷糖，以前她很讨厌这个味道
    数量: 1
```

`z.record(键, 值)` 允许我们设定这样的变量:

```js
export const Schema = z.object({
  物品栏: z.record(
    z.string(),
    z.object({
      描述: z.string(),
      数量: z.coerce.number().int(),
    }),
  ),
});
```

其中,

- `z.string()` 规定了物品栏对象里能接收什么键名 (文件名), 在这里我们规定它可以是任意文本;
- `z.object({...})` 规定了能接收什么值 (文件内容), 在这里我们规定值必须是一个对象, 其内有 "描述" 和 "数量" 两个字段.

当然, 单纯说物品栏对象能接收任意文本作为键名有些奇怪: 这个键名到底表达什么含义? \
对于物品栏而言, 我们往往在意两个部分: 物品名称和物品的具体信息. 因此, 我们将物品名称作为键名, 而物品的具体信息 (在这里是 "描述" 和 "数量") 作为值.

为了方便我们以后看变量结构时也知道键名是物品名称, 我们使用 `.describe('描述这个变量的作用')`:

```{code-block} js
:emphasize-lines: 3

export const Schema = z.object({
  物品栏: z.record(
    z.string().describe('物品名'),
    z.object({
      描述: z.string(),
      数量: z.coerce.number().int(),
    }),
  ),
});
```

当然, 我们也可以限制键名只能是某几种情况, 前面限制文本变量内容的手段, 在这里都可以使用! 比如主角的能力面板只能是力量、敏捷、体质、智力、感知、魅力:

```js
export const Schema = z.object({
  能力面板: z.record(
    z.enum(['力量', '敏捷', '体质', '智力', '感知', '魅力']),
    z.coerce.number().describe('能力数值'),
  ),
});
```

不过, `z.record(z.enum([...]), ...)` 要求 `enum` 列出的字段必须存在, 比如上面的例子中, 能力面板里只能**且必须有**力量、敏捷、体质、智力、感知、魅力这几个字段. \
如果我们只是想限制只能有, 但希望字段是可有可无的, 则应该使用 `z.partialRecord(z.enum([...]), ...)`:

```js
export const Schema = z.object({
  羁绊: z.partialRecord(
    z.enum(['青空莉', '络络', '白娅']),
    z.coerce.number().describe('羁绊值'),
  ),
});
```

而有的时候, 我们会希望对象像 `z.object` 那样有几个字段必须存在, 又能像 `z.record` 那样任意扩展字段——我们用 `z.intersection(一种情况, 另一种情况)`:

```js
export const Schema = z.object({
  变量: z.intersection(
    z.object({...}),
    z.record(键, 值),
  ),
});
```

## `z.prefault('内容')`: 为对象设定默认值

一些角色卡连 NPC 都是实时生成而不是预先在世界书写好的, 每个 NPC 有着性别、好感度、外貌、身体状态、位置、心声、当前计划等等大量变量:

```js
export const Schema = z.object({
  npc: z.record(
    z.string().describe('npc名'),
    z.object({
      身份: z.string(),
      好感度: z.coerce.number(),
      已死亡: z.boolean(),
      当前位置: z.string(),
      当前行动: z.string(),
      /* 编不出来了, 总之有十多个字段 */
    })
  ),
});
```

如果你这么设计, 很可能遇到 AI 不能正常生成新 npc 变量的问题——字段实在太多了, 它哪怕疏忽掉其中一个字段, 也会导致生成失败!

为了让 AI 能很容易创建新的 npc, 我们可以为一些不重要的字段设置默认值: 如果 AI 在创建新 npc 时没有输出这个字段, 那么它会被设置成默认值:

```js
export const Schema = z.object({
  npc: z.record(
    z.string().describe('npc名'),
    z.object({
      身份: z.string().prefault('待初始化'),
      好感度: z.coerce.number().prefault(0),
      已死亡: z.boolean().prefault(false),
      当前位置: z.string().prefault('待初始化'),
      当前行动: z.string().prefault('待初始化'),
      /* 编不出来了, 总之有十多个字段 */
    })
  ),
});
```

嗯……我干脆给所有字段设置了默认值, 你可以按自己的需求来设置.

## 尾声

如此, 你已经了解了如何简单地用 zod 编写变量结构.

在写好 `export const Schema` 后, 我们还需要把它注册到 MVU 中. 在脚本开头结尾添加上固定代码即可:

```{code-block} js
:emphasize-lines: 1,7-9
import { registerMvuSchema } from 'https://testingcf.jsdelivr.net/gh/StageDog/tavern_resource/dist/util/mvu_zod.js';

export const Schema = z.object({
  ...
});

$(() => {
  registerMvuSchema(Schema);
})
```

如果你有一些更复杂的需求, 比如移除数量为 0 的物品、删除已经死亡的 npc、从好感度数值计算好感度阶段字段等, 可以阅读 [zod 文档](https://zod.dev/)、使用{doc}`/青空莉/工具经验/实时编写前端界面或脚本/index`或让 AI 帮你写.
