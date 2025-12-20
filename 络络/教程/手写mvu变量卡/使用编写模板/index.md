# 附.在电脑上使用编写模板写卡

{{ prolog }}

打开这一章节, 意味着你已经阅读了解了青空莉的

- {doc}`/青空莉/工具经验/实时编写前端界面或脚本/index`: 允许 AI 在 VSCode/Cursor 中直接查看酒馆网页, 边看边制作前端界面或脚本
- {doc}`/青空莉/工具经验/实时编写角色卡、世界书或预设/index`: 允许 AI 在 VSCode/Cursor 中直接批量修改世界书或预设

## 如果你还没有变量结构脚本

其实你已经能够使用[编写模板](http://github.com/StageDog/tavern_helper_template)一键写卡.

例如, 让我们打开某个 {doc}`AI 编程助手 </青空莉/工具经验/实时编写前端界面或脚本/环境准备/index>` (目前推荐使用 Claude Code、Codex), 然后输入:

```text
为我新建一张 mvu 角色卡，它应该有夏霖孤独感、物品栏等变量，并有扁平化的状态栏
```

:::{figure} 输入.png
:::

等 AI 执行完成, 正常情况下 AI 已经帮你写好变量结构脚本、initvar、变量更新命令、变量列表、变量输出格式、状态栏等了!

:::{hint}
为了泛用, 编写模板里并没有内置人设模板之类的x, 你可以参考[咩咩的 Gemini CLI 全自动写卡工作流](https://discord.com/channels/1291925535324110879/1425536223291904151/1425536223291904151)之类的, 自己给 VSCode/Cursor 添加 "世界书" (说白了把提示词发给 AI 就行了, 或者{doc}`加入到 "全局世界书" 里始终发给 AI </青空莉/工具经验/实时编写前端界面或脚本/环境配置/index>`w).
:::

## 如果你已经有变量结构脚本

你可以直接像上面没有变量结构脚本那样操作, 只是在和 AI 对话时把变量结构脚本发给它.

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

## 更多使用说明

更多使用说明也请参考青空莉的文档哦:

- {doc}`/青空莉/工具经验/实时编写前端界面或脚本/index`: 允许 AI 在 VSCode/Cursor 中直接查看酒馆网页, 边看边制作前端界面或脚本
- {doc}`/青空莉/工具经验/实时编写角色卡、世界书或预设/index`: 允许 AI 在 VSCode/Cursor 中直接批量修改世界书或预设

不过, 如果你对{doc}`/青空莉/工具经验/实时编写前端界面或脚本/index`和{doc}`/青空莉/工具经验/实时编写角色卡、世界书或预设/index`里的操作还有印象, 那应该能想起来它们启用实时监听的命令是不同的qwq:

- 实时编写前端界面或脚本是在终端执行 `pnpm watch`;
- 实时编写角色卡、世界书或预设是在终端执行 `node tavern_sync.mjs watch 所有 -f`.

编写模板统一了这两个命令, 你只需要在终端执行 `pnpm watch` 就可以啦! (当然别忘了修改 `tavern_sync.yaml`, 还有酒馆那边也要开启对应开关x)
