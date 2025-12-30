# 附.在电脑上使用编写模板写卡

{{ prolog }}

打开这一章节, 意味着你已经阅读了解了青空莉的

- {doc}`/青空莉/工具经验/实时编写前端界面或脚本/index`: 允许 AI 在 VSCode/Cursor 中直接查看酒馆网页, 边看边制作前端界面或脚本
- {doc}`/青空莉/工具经验/实时编写角色卡、世界书或预设/index`: 允许 AI 在 VSCode/Cursor 中直接批量修改世界书或预设

## 开始编写

### 如果你还没有变量结构脚本

其实你已经能够使用[编写模板](http://github.com/StageDog/tavern_helper_template)一键写卡.

例如, 让我们打开某个 {doc}`AI 编程助手 </青空莉/工具经验/实时编写前端界面或脚本/环境准备/index>` (目前推荐使用 Claude Code、Codex), 然后输入:

```text
请参考`初始模板/角色卡`和`src/角色卡示例`, 为我新建一张 mvu 角色卡，它应该有夏霖孤独感、物品栏等变量，并有扁平化的状态栏
```

:::{figure} 输入.png
:::

等 AI 执行完成, 正常情况下 AI 已经帮你写好变量结构脚本、initvar、变量更新命令、变量列表、变量输出格式、状态栏等了!

:::{hint}
为了泛用, 编写模板里并没有内置人设模板之类的x, 你可以参考[咩咩的 Gemini CLI 全自动写卡工作流](https://discord.com/channels/1291925535324110879/1425536223291904151/1425536223291904151)之类的, 自己给 VSCode/Cursor 添加 "世界书" (说白了把提示词发给 AI 就行了, 或者{doc}`加入到 "全局世界书" 里始终发给 AI </青空莉/工具经验/实时编写前端界面或脚本/环境配置/index>`w).
:::

### 如果你已经有变量结构脚本

你依然可以直接像上面没有变量结构脚本那样操作, 只是在和 AI 对话时把变量结构脚本发给它.

如果你还想更多手动操作……可以手动去`初始模板/角色卡`里复制`新建为src文件夹中的文件夹`到`src`文件夹中, 重命名成你想要的名字, 然后打开里面的 `schema.ts` 文件, 把你自己的变量结构脚本粘贴进去. 如:

```ts
import { registerMvuSchema } from 'https://testingcf.jsdelivr.net/gh/StageDog/tavern_resource/dist/util/mvu_zod.js';

export const Schema = z.object({
  好感度: z.coerce.number().transform(value => _.clamp(0, 100));
});

$(() => {
  registerMvuSchema(Schema);
});
```

然后, 删除开头的 `import` 行和尾部的 `$(() => ...)`:

```ts
export const Schema = z.object({
  好感度: z.coerce.number().transform(value => _.clamp(0, 100));
});
```

这样以后, AI 就能知道角色卡的变量结构是什么样的, 你也可以继续在`你重命名了的文件夹/世界书/变量`文件夹中让 AI 或自行完成 initvar 和其他变量提示词.

## 实际使用

之前在{doc}`/青空莉/工具经验/实时编写前端界面或脚本/index`中, 我们是直接在 `src` 文件夹下新建脚本或前端界面. \
但 MVU 角色卡写起来有所不同, 为了更好地组织它, 青空莉为它写的初始模板是这样的:

:::{figure} 角色卡初始模板结构.png
:::

### 脚本、界面和世界书

可以看到, 角色卡初始模板文件夹里直接包括了三个文件夹:

- `界面`和`脚本`文件夹: 在这两个文件夹里面, 你可以像{doc}`/青空莉/工具经验/实时编写前端界面或脚本/index`那样写前端界面或脚本, 并在 `dist` 中得到打包出的代码——**变量结构脚本**也应该用 `dist` 中打包出的结果;
- `世界书`文件夹: 在这个文件夹里面, 你可以像{doc}`/青空莉/工具经验/实时编写角色卡、世界书或预设/index`那样写世界书——当然别忘了填写 `tavern_helper.yaml` 文件.

### 变量结构及变量结构脚本

另外还有个 `schema.ts` 文件, 这其实就是变量结构脚本……的主要部分.

为什么说是主要部分呢? 因为 `schema.ts` 只包含变量结构脚本的 `export const Schema` 部分:

```ts
export const Schema = z.object({
  ...
});
export type Schema = z.output<typeof Schema>;
```

而没有变量结构脚本开头的 `import` 和结尾的 `$(() => ...)`——它们被放在了 `脚本/变量结构/index.ts` 中:

```ts
import { registerMvuSchema } from 'https://testingcf.jsdelivr.net/gh/StageDog/tavern_resource/dist/util/mvu_zod.js';
import { Schema } from '../../schema';

$(() => {
  registerMvuSchema(Schema);
});
```

原本门之主写卡助手所写的变量结构脚本有两个功能:

- `export const Schema` 规定了我们角色卡的 MVU 变量结构是什么;
- 而开头的 `import` 和结尾的 `$(() => ...)` 把这个变量结构实际注册给 MVU.

而编写模板将这两个功能拆分:

- `schema.ts` 规定了我们角色卡的 MVU 变量结构是什么;
- `脚本/变量结构/index.ts` 把这个变量结构实际注册给 MVU.

既然 `脚本/变量结构/index.ts` 是脚本, 你自然可以实时修改它. 但为什么要拆分出 `schema.ts` 呢? 因为变量结构并不只有变量结构脚本需要:

- 状态栏等`界面`也需要了解变量结构, 才能正常显示变量;
- 世界书中的 `[initvar]` 条目也需要基于变量结构编写. 不同于在酒馆里我们只能祈祷 AI 生成别犯错, 在 VSCode/Cursor 中我们可以让软件检查 `[initvar]` 有没有错!

也就是说, 不止变量结构脚本需要用到 `schema.ts`, 因此青空莉选择了把它拆分出来, 让其他脚本、界面乃至世界书能直接使用它; 而变量结构脚本只负责将它实际注册给 MVU.

### 利用 `schema.ts` 编写 initvar

如果你已经复制初始模板到 `src` 文件夹中, 并运行了 `pnpm build` 或 `pnpm watch`, 会发现 `schema.ts` 旁边多了一个 `schema.json` 文件:

:::{figure} schema_json.png
:::

这个文件可以辅助 AI 或我们手写 initvar.

很简单! 让我们打开 `世界书/变量/initvar.yaml` 文件, 就会发现开头有一句 `# yaml-language-server: $schema=../../schema.json`. 这一句意思就是这个 YAML 文件必须满足 `schema.json` 的规定——我们的变量结构规定!

好吧, 如果你已经创建了变量结构, 其实也不需要我废话了w 你打开 `世界书/变量/initvar.yaml` 时应该已经看到了一个报错:

:::{figure} 编写initvar.png
:::

这个报错告诉我, 我的变量结构里规定了要有`世界`变量, 但我 initvar 里没有写, 于是我加上 `世界: {}`; 然后软件又告诉我我缺了另一个变量……你就可以这样一个个填写变量直到 initvar 文件不再报错! 当然也可以依旧让 AI 写x

## 更多使用说明

更多使用说明也请参考青空莉的文档哦:

- {doc}`/青空莉/工具经验/实时编写前端界面或脚本/index`: 允许 AI 在 VSCode/Cursor 中直接查看酒馆网页, 边看边制作前端界面或脚本
- {doc}`/青空莉/工具经验/实时编写角色卡、世界书或预设/index`: 允许 AI 在 VSCode/Cursor 中直接批量修改世界书或预设

不过, 如果你对{doc}`/青空莉/工具经验/实时编写前端界面或脚本/index`和{doc}`/青空莉/工具经验/实时编写角色卡、世界书或预设/index`里的操作还有印象, 那应该能想起来它们启用实时监听的命令是不同的qwq:

- 实时编写前端界面或脚本是在终端执行 `pnpm watch`;
- 实时编写角色卡、世界书或预设是在终端执行 `node tavern_sync.mjs watch 所有 -f`.

编写模板统一了这两个命令, 你只需要在终端执行 `pnpm watch` 就可以啦! (当然别忘了修改 `tavern_sync.yaml`, 还有酒馆那边也要开启对应开关x)
