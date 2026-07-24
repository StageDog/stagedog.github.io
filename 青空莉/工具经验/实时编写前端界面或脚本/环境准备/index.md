# 环境准备

{{ prolog }}

## 安装 Git

请通过 [Git 官网](https://git-scm.com/downloads/win) 下载 Git 安装包

:::{figure} git官网.png
:::

下载好安装包后, 双击安装包然后一直点击 {menuselection}`Next` 安装即可.

## 安装 NodeJS

请通过 [NodeJS 官网](https://nodejs.org/zh-cn/download)下载 NodeJS 安装包:

:::{figure} nodejs官网.png
:::

下载好安装包后, 双击安装包然后一步步点击 {menuselection}`Next` 安装即可, 除了第二步需要勾选 {menuselection}`I accept the terms in the License Agreement`、正式开始安装时需要确认外, 不需要额外操作.

如果你已经安装过, 双击安装会显示下图, 则你可以直接进行下一步:

:::{figure} nodejs已经安装过.png
:::

## 安装 pnpm

在安装好 NodeJS 后, 我们在 Windows {menuselection}`开始菜单` 搜索 `powershell`, {kbd}`右键`以管理员身份运行它:

:::{figure} 以管理员身份运行powershell.png
:::

注意打开时窗口显示的东西, 我们在窗口执行完一条命令时, 它还会再次显示:

:::{figure} 打开powershell.png
:::

在这个窗口执行命令的方法是输入命令然后{kbd}`回车`.

我们首先输入以下命令, 来确认 NodeJS 安装成功且版本号大于等于 24:

```bash
node -v
```

然后我们对以下命令一条条地先输入再回车, 来改变执行策略、配置国内镜像源和安装 pnpm:

```{code-block} bash
:caption: 改变 powershell 执行策略
set-executionpolicy remotesigned
```

```{code-block} bash
:caption: 配置 npm 国内镜像源
npm config set registry https://registry.npmmirror.com/
```

```{code-block} bash
:caption: 安装 pnpm
npm install -g pnpm
```

```{code-block} bash
:caption: 配置 pnpm 国内镜像源
pnpm config set registry https://registry.npmmirror.com/
```

:::{figure} 安装pnpm.png
:::

## 安装和配置 VSCode

:::{hint}
如果已经安装了**谷歌基于 VSCode 改动的 Antigravity**, 你可以通过{kbd}`Ctrl-Shift-P` 打开命令菜单, 输入 `profiles new profile` 切出配置文件窗口, 然后跳到[导入配置文件](#导入配置文件)一步配置; 但它界面差异比较大, 可能有的步骤做起来和我在这里写的不一样.
:::

### 安装

请通过 [VSCode 官网](https://code.visualstudio.com/download) 下载 VSCode 安装包:

:::{figure} vscode官网.png
:::

下载好安装包后, 双击安装包, 勾选{menuselection}`我同意此协议`, 然后一步步点击{menuselection}`下一步`安装即可.

(导入配置文件)=

### 导入配置文件

让我们{kbd}`右键` VSCode **以管理员身份运行它**. (以后也要记得以管理员身份运行它.)

接下来, 请下载 {download}`VSCode 配置文件 <../sillytavern.code-profile>`. 其中有我由网上已有配置文件改动来的, 酒馆助手编写教程所需的所有 VSCode 配置, 我们将会导入它来配置 VSCode 自动保存文件、保存时格式化文件、安装扩展等许多功能.

要导入配置文件, 我们首先从{menuselection}`左下角齿轮 --> Profiles` 打开配置文件页面:

:::{figure} 打开配置文件页面.png
:::

然后点击 {menuselection}`New Profiles 旁的下三角 --> Import Profile...`, 再点击 {menuselection}`Select File...` 来选择配置文件以导入:

:::{figure} 导入配置文件.png
:::

在选择配置文件后, 我们点击 {menuselection}`Create` 来导入它, 在弹出的窗口中选择 {menuselection}`Trust Publishers & Install` 然后等待 VSCode 导入完成.

:::{figure} 确认导入配置文件.png
:::

在导入完成后, 我们选择 sillytavern 配置文件, 勾选默认使用该配置文件, 再启用它.

:::{figure} 默认使用配置文件.png
:::

此时, VSCode 左下角的齿轮将会显示 `SI` 字样; 以后遇到齿轮没有显示 `SI` 字样时, 也请注意通过{menuselection}`左下角齿轮 --> Profiles` 进行切换.

### 切换中文

在导入完成后, 我们从侧边栏点击 {menuselection}`Extensions` 再搜索 `Chinese` 来安装中文插件.

:::{figure} 安装中文插件.png
:::

当然也许你已经安装中文插件, 则中文插件右下角会显示{menuselection}`齿轮` 而不是 {menuselection}`Install`, 就不用再点击安装了.

:::{figure} 已经安装中文插件.png
:::

安装完毕后, 我们通过{kbd}`Ctrl-Shift-P` 打开命令菜单, 输入 `configure display language` 并{kbd}`回车`, 然后选择 {menuselection}`中文(简体) (zh-cn)` 来切换成中文.

### 打开模板文件夹

实时编写前端界面或脚本依赖于我做好的项目模板, 我们打开 <https://github.com/StageDog/tavern_helper_template>, 点击 {menuselection}`Code --> Download ZIP` 来下载它:

:::{figure} 下载模板文件.png
:::

:::{hint}
如果你有代码和 Git 版本管理经验, 也可以 fork 本仓库或从网页右上角的 {menuselection}`Use this template` 按钮来创建一个新仓库, 并按照仓库 README 说明进行配置. \
这将为你带来仓库 README 说明中所说的很多方便功能.
:::

下载完成后, 我们以管理员身份运行 bandizip 选择智能解压它 (别的解压软件我没试过, 可能会有问题), 按自己的意愿重命名文件夹, 然后通过 VSCode 左上角的{menuselection}`文件 --> 打开文件夹...`来打开它:

:::{figure} 打开文件夹.png
:::

### 介绍 VSCode 界面

VSCode 界面的总体情况如下所示. 如果哪一部分没有显示, 你可以点击右上角的三个按钮来展开显示它.

:::{figure} vscode界面介绍.png
:::

### 安装代码依赖

根据 VSCode 界面, 我们展开{menuselection}`终端`, 然后输入以下命令来安装代码依赖:

```bash
pnpm install
```

:::{figure} 安装依赖完成.png
:::

在安装完成后, 我们将会在项目根目录看到名为 `node_modules` 的文件夹, 这个文件夹中就是我们刚刚通过 `pnpm install` 安装的第三方库.

## 安装字体

为了让代码更易阅读, 建议你寻找中英文的等宽字体安装并自行配置给 VSCode.

## 安装 AI 编程助手

VSCode 自带的编程助手并不好用, 接下来我们来安装 Claude Code 插件作为编程助手: 在 VSCode 侧边栏的{menuselection}`扩展`中搜索 `Claude Code` 即可找到安装.

安装好后, VSCode 左边侧边栏会多出 {menuselction}`Claude Code` 选项:

:::{figure} 打开claudecode.png
:::

你可以下载 CC Mate、CC Switch 之类的工具来为 Claude Code 配置自定义 API, 配置好后重启 VSCode 即可使用. 网上有很多这类教程, 这里不再展开.

另外, 你还可以安装官方提供的[前端设计提示词](https://skillsmp.com/zh/creators/anthropics/skills/skills-frontend-design).

## 其他 AI 编程助手

你也可以尝试其他 AI 编程助手. 它们有的以 VSCode 插件的形式发布, 你可以在 VSCode 侧边栏的{menuselection}`扩展`中搜索安装, 有的是单独的命令行软件.

本教程所提供的模板除了代码项目本身的配置外, 还为编程助手设置了:

- **规则**: 即项目文件夹中的 AGENTS.md 文件, 相当于添加了一个全局世界书, 里面我为项目结构、酒馆助手、前端界面、脚本、MVU 等进行了说明
- **MCP**: 为编程助手添加额外工具, 例如允许编程助手直接查看酒馆网页

编程助手一般都支持读取 AGENTS.md 文件作为全局规则, 因此换个编程助手也能直接用, 不需要你再调整啥; 但它们安装 MCP 的方式有很大差异. 如果你使用 Claude Code 之外的编程助手, 则需要自行或者让 AI 按照[这个网页说的](https://github.com/ChromeDevTools/chrome-devtools-mcp#mcp-client-configuration)来配置好 MCP.

可以尝试的编程助手有: Claude Code、Codex、Augment、RooCode、Kilo Code、Gemini CLI (参考[司马咩咩的用 GEMINI CLI 写卡教程](https://discord.com/channels/1291925535324110879/1418158780927049779)) 等, 它们中绝大多数都支持你填入自定义 API.

以 Codex 为例, 要为它配置好 MCP, 你需要在项目文件夹中新建一个 .codex 文件夹, 在它里面新建一个 config.toml 文件, 然后填入:

:::{code-block} toml
:caption: Windows
[mcp_servers.chrome-devtools]
command = "cmd"
args = [
    "/c",
    "pnpx",
    "chrome-devtools-mcp@latest",
    "--autoConnect",
]
env = { SystemRoot="C:\\Windows", PROGRAMFILES="C:\\Program Files" }
startup_timeout_ms = 20_000
:::
:::{code-block} toml
:caption: MacOS、Linux
[mcp_servers.chrome-devtools]
command = "pnpx"
args = ["chrome-devtools-mcp@latest", "--autoConnect"]
startup_timeout_ms = 20_000
:::
