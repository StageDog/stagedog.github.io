# 酒馆助手: 监听变量更新、修改变量、用变量激活绿灯

{{ prolog }}

AI 很不会数值计算, 相比起将商店购物等功能交给 AI 来处理, 不如由我们的酒馆助手前端界面或脚本的代码来计算, 而将计算过程日志和结果发送给 AI. 酒馆助手前端界面或脚本的编写方法请参考{doc}`/青空莉/工具经验/实时编写前端界面或脚本/index`.

但也许你并不是想做商店购物之类复杂的事, 你只是想简单地:

修改变量值
: AI 笨到把好感度更新成了负数或者超过了上限 100. 我们得检测到这个错误, 修改回变量值.

监听变量更新情况
: 我们希望知道角色好感度在这次剧情中突破了 30, 并基于此用酒馆提示框弹出一条消息.

新增变量
: 我们想在好感度**第一次**超过 30 后发送某段提示词, 而即便之后好感度又下降到了 30 以下, 这段提示词也依旧发送. 这需要我们能在好感度第一次超过 30 时, 新增一个变量来记录这件事.

删除变量
: 角色死亡了! 我们得删除所有与该角色相关的变量.

:::{warning}
在使用下面的功能之前, 你需要先在代码中通过一行 `await waitGlobalInitialized('Mvu');` 等待 MVU 变量框架初始化完成. \
为了强调这一点, 以下所有例子开头都添加了 `await waitGlobalInitialized('Mvu');`; 如果你有更复杂的代码, 只需要在代码最开头添加一处 `waitGlobalInitialized('Mvu');` 即可, 不必多次添加.
:::

## 监听 MVU 事件

针对变量开始更新、某个变量发生更新、变量更新结束, MVU 都会发送 "事件". 我们只要新建一个酒馆助手脚本, 监听这些事件, 就能进行相应的功能:

::::{tabs}
:::{tab} 保持好感度不低于 0

```js
await waitGlobalInitialized('Mvu');
eventOn(Mvu.events.VARIABLE_UPDATE_ENDED, (variables) => {
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
await waitGlobalInitialized('Mvu');
eventOn(Mvu.events.SINGLE_VARIABLE_UPDATED, (stat_data, path, old_value, new_value) => {
  // ---如果被更新的变量不是 'stat_data.角色.络络.好感度', 则什么都不做直接返回 (return)---
  if (path !== '角色.络络.好感度') {
    return;
  }

  // ---被更新的变量是 'stat_data.角色.络络.好感度'---
  if (old_value < 30 && new_value >= 30) {
    toaster.success('络络好感度突破 30 了!');
  }
});
```

:::

:::{tab} 记录好感度第一次超过 30

```js
await waitGlobalInitialized('Mvu');
eventOn(Mvu.events.SINGLE_VARIABLE_UPDATED, (stat_data, path, old_value, new_value) => {
  // ---如果被更新的变量不是 '角色.络络.好感度', 则什么都不做直接返回 (return)---
  if (path !== '角色.络络.好感度') {
    return;
  }

  // ---被更新的变量是 '角色.络络.好感度'---
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
await waitGlobalInitialized('Mvu');
eventOn(Mvu.events.SINGLE_VARIABLE_UPDATED, (stat_data, path, old_value, new_value) => {
  // ---如果被更新的变量不是 'stat_data.角色.青空莉.死亡', 则什么都不做直接返回 (return)---
  if (path !== '角色.青空莉.死亡') {
    return;
  }

  // ---被更新的变量是 'stat_data.角色.青空莉.死亡'---
  // 如果新的值为 `true`, 则删除所有与青空莉相关的变量
  if (new_value === true) {
    _.unset(stat_data, '角色.青空莉');
  }
});
```

:::
::::

此外, MVU 还提供了更新命令解析完成事件, 你可以监听它, 对变量路径进行修复等:

```js
import { toSimplified } from 'chinese-simple2traditional';

await waitGlobalInitialized('Mvu');
eventOn(Mvu.events.COMMAND_PARSED, commands => {
  // 修复 gemini 在中文间加入的 '-'', 如将 '角色.络-络' 修复为 '角色.络络'
  commands.forEach(command => {
    command.args[0] = command.args[0].replace(/-/g, '');
  });

  // 修复繁体字, 如将 '絡絡' 修复为 '络络'
  commands.forEach(command => {
    command.args[0] = toSimplified(command.args[0]);
  });
});
```

:::{hint}
看不懂上面写的是啥? 没关系, 请阅读{doc}`/青空莉/工具经验/实时编写前端界面或脚本/index`, 然后把模板文件夹中的 `@types/iframe/exported.mvu.d.ts` 文件发给 ai 让它学着帮你写.
:::

## 在代码中自行获取、更新 MVU 变量

除了监听用户输入或 AI 输出时的 MVU 事件, 我们还可以自行获取、更新 MVU 变量, 或主动解析文本中的 `_.set(...)` 等更新命令.

::::{tabs}
:::{tab} 获取 MVU 变量

```js
await waitGlobalInitialized('Mvu');

// 获取第 5 楼的 MVU 变量
const variables = Mvu.getMvuData({ type: 'message', message_id: 5 });

// 获取最后一楼的 MVU 变量
const variables = Mvu.getMvuData({ type: 'message', message_id: -1 });  // 或 `message_id: 'latest'`

// 获取倒数第二楼的 MVU 变量
const variables = Mvu.getMvuData({ type: 'message', message_id: -2 });

// 在前端界面中, 获取前端界面所在楼层的 MVU 变量
const variables = Mvu.getMvuData({ type: 'message', message_id: getCurrentMessageId() });
```

:::

:::{tab} 更新 MVU 变量

```js
await waitGlobalInitialized('Mvu');

// 获取本前端界面所在楼层的 MVU 变量
const mvu_data = Mvu.getMvuData({ type: 'message', message_id: getCurrentMessageId() });

// 将络络好感度增加 5
_.update(mvu_data, 'stat_data.角色.络络.好感度', value => value + 5);

// 将更新后的结果写回楼层
await Mvu.replaceMvuData(mvu_data, { type: 'message', message_id: getCurrentMessageId() });
```

:::

:::{tab} 解析文本中的更新命令

```js
await waitGlobalInitialized('Mvu');

const mvu_data = Mvu.getMvuData({ type: 'message', message_id: -1 });

// 解析从某处得到的文本中的更新命令, 此处假设文本是 `'_.set('角色.络络.好感度', 30);'`, 但你也可以从 `generate` 等地方获取
const content = '_.set('角色.络络.好感度', 30);';
const new_data = await Mvu.parseMessage(content, mvu_data);

await Mvu.replaceMvuData(new_data, { type: 'message', message_id: getCurrentMessageId() });
```

:::
::::

需要注意的是, 虽然你在聊天变量中也能看到 MVU 变量, 但那只是 MVU 变量框架的遗留问题; 你应该总是对某个消息楼层即 `{ type: 'message', message_id: 楼层号 }` 更新 MVU 变量.

## 用变量激活绿灯

我们甚至可以利用{doc}`/青空莉/工具经验/酒馆如何处理世界书/激活/index`中提到的 "自行编写代码控制条目的激活" 方法之一——`injectPrompts` 来将变量值转换为预扫描文本, 从而能够用来激活绿灯条目:

```ts
await waitGlobalInitialized('Mvu');
eventOn(Mvu.events.VARIABLE_UPDATE_ENDED, async variables => {
  // 将整个 stat_data 转换为绿灯的预扫描文本
  const data = _.get(variables, 'stat_data');
  injectPrompts([
    {
      id: 'mvu_variables',  // 这里的 id 是提示词的唯一标识符
                            // 如果我们之后再对同样的 id 进行 injectPrompts, 则会替换掉之前的提示词
      content: JSON.stringify(data),
      position: 'none',
      depth: 0,
      role: 'user',
      should_scan: true,
    },
  ]);
});
```

我们只需要新建一个酒馆助手脚本, 将上面一段代码粘贴进去, 则会添加一段和 `{{get_message_variable::stat_data}}` 替换结果相同的文本, 仅用于绿灯激活.

如果你需要更精确的控制, 则可以不是转换整个 `stat_data` 而是转换某个变量, 或者自己填写如何注入这个仅用于绿灯激活的提示词:

```ts
await waitGlobalInitialized('Mvu');
eventOn(Mvu.events.VARIABLE_UPDATE_ENDED, async variables => {
  // 在预扫描文本中注入一句 `络络好感度: 好感度具体数值`
  const content = `络络好感度: ${_.get(variables, 'stat_data.角色.络络.好感度', 0)}`;
  injectPrompts([
    {
      id: 'mvu_lolo_affection',
      content,
      position: 'none',
      depth: 0,
      role: 'user',
      should_scan: true,
    },
  ]);

  // 如果好感度大于 30, 设置 `条目关键字` 仅用于激活绿灯
  if (_.get(variables, 'stat_data.角色.络络.好感度', 0) > 30) {
    injectPrompts([
      {
        id: 'mvu_lolo_trigger',
        content: '条目关键字',
        position: 'none',
        depth: 0,
        role: 'user',
        should_scan: true,
      },
    ]);
  }
});
```

另外{doc}`/青空莉/工具经验/酒馆如何处理世界书/index`中还给了别的方式.

## 在脚本中请求 AI 生成并用结果更新变量

你当然可以在前端界面或脚本中直接请求 AI 生成, 而生成结果中如果有 `_.set` 等文本, 你也可以解析它并更新变量.

```ts
await waitGlobalInitialized('Mvu');

// 获取旧变量
const old_data = Mvu.getMvuData({ type: 'message', message_id: getCurrentMessageId() });

// 请求 AI 生成
const content = await generate({ user_input: '你好' });

// 解析生成结果
const new_data = await Mvu.parseMessage(content, old_data);

// 将更新后的变量写回楼层
await Mvu.replaceMvuData(new_data, { type: 'message', message_id: getCurrentMessageId() });
```

自然地, 你也可以用这种方式直接让玩家在界面里玩 AI, 具体请参考{doc}`/青空莉/工具经验/实时编写前端界面或脚本/index`.

## 用脚本实现更多变量控制

请阅读{doc}`/青空莉/工具经验/实时编写前端界面或脚本/index`, 然后把模板文件夹中的 `@types/iframe/exported.mvu.d.ts` 文件发给 ai 让它学着帮你写.

## 仅用于脚本的 MVU 变量

有的时候, 我们并不希望 AI 能更新某个变量, 而只希望脚本能更新它. \
例如, 角色卡在开局设定了角色性别, 而你不希望在游玩过程中 AI 发蠢把它改变了.

这需要我们回顾 MVU 变量框架是如何起作用的:

- 我们通过 initvar 设置了有哪些 MVU 变量
- 我们通过编写变量提示词让 AI 知道了有哪些变量 (变量列表)、该如何更新它们 (变量更新规则) 以及输出什么来更新它们 (输出规则).
- 我们使用提示词模板编写 `<%_ _%>` 和 `<%= _%>` 来用变量编写动态提示词

那么, 我们只要不在编写变量提示词时书写某个变量, AI 就没办法知道有它, 也就没办法更新它.
