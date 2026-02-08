# 安装插件和导入脚本

{{ prolog }}

## 安装插件

要能用 MVU 变量框架写卡, 我们得先安装这些插件:

- 酒馆助手: [安装教程](https://n0vi028.github.io/JS-Slash-Runner-Doc/guide/关于酒馆助手/安装与更新.html)
- 提示词模板: 安装方式同酒馆助手, 安装链接为 `https://codeberg.org/zonde306/ST-Prompt-Template/`

这两个插件不只是作者需要装, 玩我们卡的玩家也需要安装这两个插件! 所以, 请你记得在角色卡帖子中提示玩家安装喔.

## 为角色卡导入 MVU 脚本

在安装好插件后, 我们就能为角色卡添加 MVU 变量框架了——

让我们像视频里那样新建一个角色卡, 点开{menuselection}`酒馆右上角积木按钮 --> 酒馆助手 --> 脚本`, 点击{menuselection}`+ 脚本`来新建一个角色脚本, 命名……不如就叫 `MVU` 吧! 内容按下面这样填写:

```ts
import 'https://testingcf.jsdelivr.net/gh/MagicalAstrogy/MagVarUpdate/artifact/bundle.js';
```

这样一来, 我们就为角色卡导入了 MVU 脚本, 可以正式开始给角色卡设计变量、用变量写提示词和制作各种东西啦!
