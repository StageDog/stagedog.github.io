# 酒馆助手脚本: 后台控制和利用变量

{{ prolog }}

我们通过变量结构已经能对变量更新进行很多限制, 例如, 这是我们之前要求门之主写卡助手制作的变量结果:

```text
请制作变量！
- 在世界路径下记录当前时间、当前日期和近期事务
- 记录主角妹妹白娅当前对主角的依存度、着装和称号
  - 依存度必须在0~100之间
  - 着装包括上装、下装、内衣、袜子、鞋子和饰品
  - 称号应该记录称号的效果和白娅对称号的自我评价，如果没填写自我评价则默认设置为"待评价"
  - 称号有数量上限，依存度越高可以拥有的称号越多（依存度为0时不能拥有称号，1~10时只能拥有1个称号，依次类推），如果称号超过可以拥有的数量，应该移除最旧的称号
- 记录主角物品栏当前有的物品：它的描述、数量，如果没有填写数量则默认数量为1，如果数量不为正数应该直接删除物品
```

可以发现, 我们在变量结构中已经做到了很多:

- 限定变量只能是某些值: "依存度必须在0~100之间"
- 变量值出现某些错误时自动修正: "如果数量不为正数应该直接删除物品"
- 当 AI 插入变量省略了某个字段时, 为字段设置默认值: "如果没有填写数量则默认数量为1"
- 变量数量上限: "称号有数量上限……"
- ……

但变量结构只能用于检验和修复更新后的变量值, 不能获取酒馆其他信息, 不能获取更新前的变量值进行对比, 不能跟酒馆进行其他交互或修改酒馆内容……因此有很多功能是不能做到的, 这时就需要我们用到酒馆助手脚本或酒馆助手界面了.

例如, 我们希望利用变量制作商品购物等功能, 那么与其让玩家打字输入要买什么商品, 然后由 AI 计算能否购买、扣除金额, 我们完全可以用酒馆助手制作一个前端界面或脚本, 在界面中显示出商品名称、图片、价格, 让玩家可以点击按钮购买, 在所有购买完成后, 才把购买过程日志和结果发送给 AI.

:::{figure} 界面示例.png
:::

酒馆助手前端界面或脚本的具体编写方法请参考青空莉的{doc}`/青空莉/工具经验/实时编写前端界面或脚本/index`; 在这里, 我会为你介绍一些 MVU 额外提供的代码功能以及对应的例子, 帮助你了解前端界面或脚本可以怎样控制和利用变量. \
(但这并不意味着前端界面或脚本只能做到这些功能, 例如, MVU 本身也是一个酒馆助手脚本!)

## 监听 MVU 事件

让我们再简单回忆一下 MVU 变量框架是怎么工作的:

- MVU 读取 `[initvar]` 和 `<initvar>` 块, 初始化变量
- AI 根据变量输出格式输出变量更新命令, MVU 解析这些命令从而更新变量

你可以从这个过程中看到很多个阶段:

1. (仅新开聊天时) 变量初始化完成 (`VARIABLE_INITIALIZED`)
2. 变量更新开始 (`VARIABLE_UPDATE_STARTED`)
3. 变量更新命令解析完成 (`COMMAND_PARSED`)
4. 脚本使用解析出的更新命令依次更新变量, 每次更新后都使用变量结构检验/转换结果
5. 变量更新结束 (`VARIABLE_UPDATE_ENDED`)
6. 脚本将变量结果存储到对应楼层中之前 (`BEFORE_MESSAGE_UPDATE`)

针对这些阶段, MVU 都会发送 "事件和相应的信息". 我们只要新建一个酒馆助手脚本, 监听这些事件, 就能在对应阶段执行额外功能或调整 MVU 的更新过程:

:::{hint}
看不懂下面写的是啥? 没关系, 你现在重要的是知道能做到什么! 然后你就能阅读{doc}`/青空莉/工具经验/实时编写前端界面或脚本/index`, 把编写模板中的 `@types/iframe/exported.mvu.d.ts` 文件和这里的示例发给 AI 让它学着帮你写.
:::

:::{warning}
在使用下面的功能之前, 你需要在代码开头添加一行 `await waitGlobalInitialized('Mvu');` 等待 MVU 变量框架初始化完成. \
为了强调这一点, 以下所有例子开头都添加了 `await waitGlobalInitialized('Mvu');`; 如果你有更复杂的代码, 只需要在代码最开头添加一处 `waitGlobalInitialized('Mvu');` 即可, 不必多次添加.
:::

### COMMAND_PARSED: 变量更新命令解析完成

通过监听 "变量更新命令解析完成" 事件 (`Mvu.events.COMMAND_PARSED`), 你可以获取到对应的变量更新命令, 并对其进行修复.

例如, 修复 gemini 在中文间加入的 `-`, 如将`角色.络-络`修复为`角色.络络`:

```js
await waitGlobalInitialized('Mvu');
eventOn(Mvu.events.COMMAND_PARSED, commands => {
  commands.forEach(command => {
    command.args[0] = command.args[0].replaceAll('-', '');
  });
});
```

又比如, 将繁体字修复为简体字, 如将`絡絡`修复为`络络`:

```js
import { toSimplified } from 'chinese-simple2traditional';

await waitGlobalInitialized('Mvu');
eventOn(Mvu.events.COMMAND_PARSED, commands => {
  commands.forEach(command => {
    command.args[0] = toSimplified(command.args[0]);
  });
});
```

### VARIABLE_UPDATE_ENDED: 变量更新结束

通过监听 "变量更新结束" 事件 (`Mvu.events.VARIABLE_UPDATE_ENDED`), 你可以获取到更新前后的变量, 可以对更新结果进行额外处理.

比如, 我们可以这样弹窗显示更新前后的变量值:

```js
await waitGlobalInitialized('Mvu');
eventOn(Mvu.events.VARIABLE_UPDATE_ENDED, (new_variables, old_variables) => {
  toastr.info(`更新前的白娅依存度是: ${_.get(old_variables, 'stat_data.白娅.依存度')}`);
  toastr.info(`更新后的白娅依存度是: ${_.get(new_variables, 'stat_data.白娅.依存度')}`);
});
```

或者, 我们可以这样修改更新后的变量值:

```js
await waitGlobalInitialized('Mvu');
eventOn(Mvu.events.VARIABLE_UPDATE_ENDED, variables => {
  // 不管更新成了多少, 强行把白娅依存度改成 0
  _.set(variables, 'stat_data.白娅.依存度', 0);
});
```

由此我们可以做非常多功能.

其中一些是在变量结构也能做到的:

::::{tabs}

:::{tab} 限制依存度在 0 和 100 之间

```js
await waitGlobalInitialized('Mvu');
eventOn(Mvu.events.VARIABLE_UPDATE_ENDED, variables => {
  _.update(variables, 'stat_data.白娅.依存度', value => _.clamp(value, 0, 100));
});
```

:::

:::{tab} 如果数量不为正数应该直接删除物品

```js
await waitGlobalInitialized('Mvu');
eventOn(Mvu.events.VARIABLE_UPDATE_ENDED, variables => {
  _.update(variables, 'stat_data.主角.物品栏', data => _.pickBy(data, ({数量}) => 数量 > 0));
});
```

:::

:::{tab} 称号有数量上限，依存度越高越多

```js
await waitGlobalInitialized('Mvu');
eventOn(Mvu.events.VARIABLE_UPDATE_ENDED, variables => {
  _.update(variables, 'stat_data.白娅.称号', data =>
    _(data)
      .entries()
      .takeRight(Math.ceil(_.get(variables, 'stat_data.白娅.依存度') / 10))
      .value(),
  );
});
```

:::

:::{tab} 记录好感度第一次超过 30

```js
await waitGlobalInitialized('Mvu');
eventOn(Mvu.events.VARIABLE_UPDATE_ENDED, variables => {
  if (_.get(variables, 'stat_data.白娅.依存度') > 30) {
    _.set(variables, 'stat_data.$flag.白娅依存度突破30', true);
  }
});
```

:::

:::{tab} 青空莉死了!

```js
await waitGlobalInitialized('Mvu');
eventOn(Mvu.events.VARIABLE_UPDATE_ENDED, variables => {
  if (_.get(variables, 'stat_data.青空莉.死亡') === true) {
    // 删除所有与青空莉相关的变量
    _.unset(variables, 'stat_data.青空莉');
  }
});
```

:::

::::

但变量结构脚本无法获取以前的变量情况, 因此无法利用 `old_variables` 做到下面这些, 而酒馆助手脚本能做到:

::::{tabs}

:::{tab} 限制依存度变动幅度不超过 3

```js
await waitGlobalInitialized('Mvu');
eventOn(Mvu.events.VARIABLE_UPDATE_ENDED, (new_variables, old_variables) => {
  const old_value = _.get(old_variables, 'stat_data.白娅.依存度');

  // 新的好感度必须在 旧好感度-3 和 旧好感度+3 之间
  _.update(new_variables, 'stat_data.白娅.依存度', value => _.clamp(value, old_value - 3, old_value + 3));
});
```

:::

:::{tab} 检测依存度突破 30

```js
await waitGlobalInitialized('Mvu');
eventOn(Mvu.events.VARIABLE_UPDATE_ENDED, (new_variables, old_variables) => {
  const old_value = _.get(old_variables, 'stat_data.白娅.依存度');
  const new_value = _.get(new_variables, 'stat_data.白娅.依存度');
  if (old_value < 30 && new_value >= 30) {
    toastr.success('白娅依存度突破 30 了!');
  }
});
```

:::

:::{tab} 让 AI 不能更新变量

```js
await waitGlobalInitialized('Mvu');
eventOn(Mvu.events.VARIABLE_UPDATE_ENDED, (new_variables, old_variables) => {
  // 强行将新的白娅依存度设置为旧的, 从而取消 AI 对它的更新
  _.set(new_variables, 'stat_data.白娅.依存度', _.get(old_variables, 'stat_data.白娅.依存度'));
});
```

:::

::::

## 仅用于脚本的 MVU 变量

既然脚本能做到这么多功能, 那么我们很可能会想设置一些变量只给脚本用……

还记得在{ref}`让变量不能被AI更新或对AI不可见`吗? 我们可以在变量名字前面添加 `_` 来让它不能被 AI 更新, 添加 `$` 来让它对 AI 不可见!

当然, 刚刚其实我们也演示了, 怎么用 `VARIABLE_UPDATE_ENDED` 来让一个变量不能被 AI 更新:

```js
await waitGlobalInitialized('Mvu');
eventOn(Mvu.events.VARIABLE_UPDATE_ENDED, (new_variables, old_variables) => {
  // 强行将新的白娅依存度设置为旧的, 从而取消 AI 对它的更新
  _.set(new_variables, 'stat_data.白娅.依存度', _.get(old_variables, 'stat_data.白娅.依存度'));
});
```

## 在代码中自行获取、更新 MVU 变量

除了监听 MVU 事件, 我们还可以自行获取、更新 MVU 变量, 或主动解析文本中的 `<JSONPatch>` 等更新命令.

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

// 将白娅依存度增加 5
_.update(mvu_data, 'stat_data.白娅.依存度', value => value + 5);

// 将更新后的结果写回楼层
await Mvu.replaceMvuData(mvu_data, { type: 'message', message_id: getCurrentMessageId() });
```

:::

:::{tab} 解析文本中的更新命令

```js
await waitGlobalInitialized('Mvu');

const mvu_data = Mvu.getMvuData({ type: 'message', message_id: -1 });

// 解析从某处得到的文本中的更新命令, 此处假设了一段文本, 但你也可以从 `generate` 等地方获取
const content = "<JSONPatch>略</JSONPatch>";
const new_data = await Mvu.parseMessage(content, mvu_data);

await Mvu.replaceMvuData(new_data, { type: 'message', message_id: getCurrentMessageId() });
```

:::
::::

## 用变量激活绿灯

我们可以用青空莉在{doc}`/青空莉/工具经验/酒馆如何处理世界书/激活/index`中提到的 "自行编写代码控制条目的激活" 方法之一——`injectPrompts` 来将变量值转换为可以激活绿灯的预扫描文本:

```ts
await waitGlobalInitialized('Mvu');
eventOn(Mvu.events.VARIABLE_UPDATE_ENDED, variables => {
  // 获取当前白娅依存度数值
  const value = _.get(variables, 'stat_data.白娅.依存度');

  injectPrompts([
    {
      id: '激活-白娅依存度',  // 这里的 id 是提示词的唯一标识符
                           // 如果我们之后再对同样的 id 进行 injectPrompts, 则会替换掉之前的提示词

      content: `白娅依存度=${value}`,  // 注入一段 `白娅依存度=xxx`, 只用于激活绿灯;
                                     // 这样一来, 绿灯关键字可以填写 `白娅依存度=xxx` 来被激活

      position: 'none',
      depth: 0,
      role: 'user',
      should_scan: true,
    },
  ]);
});
```

这样一来, 当前聊天里就会始终有 `白娅依存度=xxx` 这样的提示词仅用于绿灯激活, 而每次变量更新时, 脚本都会用 `injectPrompts` 更新它, 保证它始终是最新数值.

当然, 为了让绿灯关键字写起来更简单, 你可以直接注入 `白娅阶段一` 而不是 `白娅依存度`:

```ts
await waitGlobalInitialized('Mvu');
eventOn(Mvu.events.VARIABLE_UPDATE_ENDED, variables => {
  // 获取当前白娅依存度数值
  const value = _.get(variables, 'stat_data.白娅.依存度');

  let content = '白娅阶段';
  if (value < 20) {
    content += '一';
  } else if (value < 40) {
    content += '二';
  } else if (value < 60) {
    content += '三';
  } else if (value < 80) {
    content += '四';
  } else {
    content += '五';
  }

  injectPrompts([
    {
      id: '激活-白娅依存度',
      content,  // `白娅阶段一`、`白娅阶段二`、...
      position: 'none',
      depth: 0,
      role: 'user',
      should_scan: true,
    },
  ]);
});
```

另一种方式是利用 `injectPrompts` 的 `filter` 字段, 直接注入一段只有给定条件满足时才使用的提示词. 示例卡中的立即事件脚本就是这么做的:

```ts
injectPrompts([
 {
   id: '激活-依存度最低时立即事件',
   position: 'none',
   depth: 0,
   role: 'system',
   content: '【【依存度最低时立即事件】】',

   // `getAllVariables()` 获取最新变量, 从中得到白娅依存度, 仅当依存度为 0 时才激活这段提示词
   filter: () => _.get(getAllVariables(), 'stat_data.白娅.依存度') === 0,

   should_scan: true,
 },
])
```

当然, `injectPrompts` 除了注入仅用于激活绿灯的提示词外, 还能直接注入 Dn 提示词, 具体请阅读{doc}`/青空莉/工具经验/酒馆如何处理世界书/index`和{doc}`/青空莉/工具经验/实时编写前端界面或脚本/index`.

## 在代码中请求 AI 生成并用结果更新变量

你当然可以在前端界面或脚本中直接请求 AI 生成, 而生成结果中如果有 `<JSONPatch>` 等变量更新命令, 你也可以解析它并更新变量.

```ts
await waitGlobalInitialized('Mvu');

// 获取旧变量
const old_data = Mvu.getMvuData({ type: 'message', message_id: getCurrentMessageId() });

// 请求 AI 生成
const message = await generate({ user_input: '你好' });

// 解析生成结果
const data = await Mvu.parseMessage(message, old_data);
```

得到 AI 回复 `message` 和变量更新结果 `data` 后, 你可以自行选择如何使用它们.

也许这个 AI 请求只是为了专门进行一次变量更新, 那么你可以抛弃 `message`, 将 `data` 写回到当前楼层:

```ts
// 将更新后的变量写回楼层
await Mvu.replaceMvuData(data, { type: 'message', message_id: getCurrentMessageId() });
```

也许你是想让玩家直接在同层界面里玩 AI (具体请参考{doc}`/青空莉/工具经验/实时编写前端界面或脚本/index`), 这个 AI 请求是在请求 AI 回复剧情和更新变量, 那么你可以将回复和变量创建成新的楼层:

```ts
// 将回复和变量结果创建为新的楼层
await createChatMessages([{ role: 'assistant', message, data }]);
```

## 用脚本实现更多功能

请阅读{doc}`/青空莉/工具经验/实时编写前端界面或脚本/index`, 然后把模板文件夹中的 `@types/iframe/exported.mvu.d.ts` 文件发给 AI 让它学着帮你写.
