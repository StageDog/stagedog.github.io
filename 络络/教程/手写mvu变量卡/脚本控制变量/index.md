# 酒馆助手: 监听变量更新或自行修改变量

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

针对变量开始更新、某个变量发生更新、变量更新结束, MVU 都会发送 "事件". 我们只要新建一个酒馆助手脚本, 监听这些事件, 就能进行相应的功能:

::::{tabs}
:::{tab} 保持好感度不低于 0

```js
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

我们甚至可以利用{doc}`/青空莉/工具经验/酒馆如何处理世界书/激活/index`中提到的 "自行编写代码控制条目的激活" 方法之一——`setExtensionPrompt` 来将变量值转换为预扫描文本, 从而能够用来激活绿灯条目:

```ts
eventOn(Mvu.events.VARIABLE_UPDATE_ENDED, async variables => {
  // 将整个 stat_data 转换为绿灯的预扫描文本
  const data = _.get(variables, 'stat_data');
  await SillyTavern.setExtensionPrompt('mvu_variables', JSON.stringify(data), -1, 0, true, 0);
});
```

我们只需要新建一个酒馆助手脚本, 将这段代码粘贴进去, 就能实现用变量值激活绿灯条目.

如果你需要更精确的控制, 则可以不是转换整个 `stat_data` 而是转换某个变量, 或者自己填写如何注入这个仅用于绿灯激活的提示词:

```ts
eventOn(Mvu.events.VARIABLE_UPDATE_ENDED, async variables => {
  // 在预扫描文本中注入一句 `络络好感度: 好感度具体数值`
  const content = `络络好感度: ${_.get(variables, 'stat_data.角色.络络.好感度')}`;
  await SillyTavern.setExtensionPrompt('mvu_variables', content, -1, 0, true, 0);
});
```

:::{hint}
看不懂上面写的是啥? 没关系, 请阅读{doc}`/青空莉/工具经验/实时编写前端界面或脚本/index`, 然后把模板文件夹中的 `@types/iframe_client/exported.mvu.d.ts` 文件发给 ai 让它学着帮你写. \
这个文件还支持你自己在前端界面/脚本中调用 MVU 来解析文本中的 `_.set(...)` 从而更新变量.
:::
