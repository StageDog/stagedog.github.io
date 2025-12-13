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

但对于角色卡

## `z.union([...])`: 接收几种情况

上面提到的 `.or(...)` 和 `z.union([...])` 并不只能用于

TODO: z.coerce.number 为例

## 尾声

TODO: 不过
