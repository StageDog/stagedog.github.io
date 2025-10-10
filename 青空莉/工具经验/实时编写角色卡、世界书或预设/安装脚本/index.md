# 安装脚本

## 在本地安装服务端脚本

如果你的电脑没有部署过酒馆, 请下载 {doc}`NodeJS 22+ </青空莉/工具经验/实时编写前端界面或脚本/环境准备/index>`.

除此之外本地再无任何依赖, 你只需要{download}`下载脚本 <https://gitgud.io/StageDog/tavern_sync/-/raw/main/dist/tavern_sync.mjs?inline=false>`.

## 在酒馆中安装客户端脚本

为了让酒馆能接收本地服务端脚本的信息, 我们需要在酒馆中安装客户端脚本.

这也很简单: 我们先安装[酒馆助手](https://n0vi028.github.io/JS-Slash-Runner-Doc/guide/关于酒馆助手/安装与更新.html), 然后在{menuselection}`酒馆助手设置页 --> 脚本库 --> 新建`脚本, 内容填写为:

```ts
import 'https://testingcf.jsdelivr.net/gh/StageDog/tavern_sync/dist/script.js'
```

## 安装编辑器

虽然这个脚本并不限制怎么编辑这些本地文件, 但建议你{doc}`按教程配置 Cursor </青空莉/工具经验/实时编写前端界面或脚本/环境准备/index>` (一定要一步步按教程走) 来编辑这些本地文件, 因为它们有语法高亮、自动保存、文件历史记录等功能, **还能{doc}`让 AI 帮你修改整个世界书/预设 </青空莉/工具经验/实时编写角色卡、世界书或预设/特殊功能/index>`**.

如果你需要编写提示词模板, 也可以再安装一个 WebStorm (但更难上手). 它针对以 `.ejs` 结尾的文件, 会检查[提示词模板](https://github.com/zonde306/ST-Prompt-Template)为我们提供的 `<%_ 代码 _%>` 语法是否正确.
