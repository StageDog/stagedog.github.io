# 附.如何更新模板

{{ prolog }}

:::{hint}
如果你有代码和 Git 版本管理经验, 你可以从模板文件夹 <https://github.com/StageDog/tavern_helper_template> 右上角的 {menuselection}`Use this template` 按钮来根据模板创建一个新仓库, **并按照仓库 README 说明进行配置**. \
这样创建的仓库会自动检测模板更新并创建 pull request, 你无须自己检查更新.
:::

## 仅更新参考文件

`@types` 文件夹中记录了酒馆助手所提供的接口定义, 它随着酒馆助手更新会发生变化, 因此酒馆助手更新后你需要下载更新它.

:::{figure} 更新酒馆助手参考文件.png
:::

`slash_command.txt` 文件中记录了酒馆 /STScript 命令, 它随着酒馆更新会发生变化, 因此酒馆更新后你需要下载更新它.

:::{figure} 更新stscript参考文件.png
:::

## 更新整个模板

但模板也可能存在编程助手规则、MCP、打包方式、依赖等的更新, 则你可以重新从 <https://github.com/StageDog/tavern_helper_template> 下载模板, 将你的 `src` 文件夹复制到新模板中, 然后输入 `pnpm install` 重新安装代码依赖.

具体更新情况在 <https://github.com/StageDog/tavern_helper_template> 中有显示:

:::{figure} 模板更新情况.png
:::

当然, 如果你使用了别的 AI 编程助手, 记得按{doc}`/青空莉/工具经验/实时编写前端界面或脚本/环境准备/index`说的更新编写规则和 MCP.
