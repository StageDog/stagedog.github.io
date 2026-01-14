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

在这个窗口执行命令的方法是输入命令然后{kbd}`回车`. 我们首先输入以下命令, 来确认 NodeJS 安装成功且版本号大于等于 22:

```bash
node -v
```

:::{figure} 确认nodejs版本号.png
:::

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

## 安装和配置 Cursor

:::{hint}
如果已经安装了 **VSCode**, 你可以直接跳到[导入配置文件](#导入配置文件), 区别只在于你将不能使用 Cursor 的 AI 编程助手. \
如果已经安装了**谷歌基于 VSCode 改动的 Antigravity**, 你也可以直接跳到[导入配置文件](#导入配置文件), 先将配置文件导入到 VSCode, 再在 Antigravity 中导入 VSCode 配置; 但它界面差异比较大, 可能有的步骤做起来和我在这里写的不一样.
:::

### 安装

请通过 [Cursor 官网](https://cursor.com/cn/downloads) 下载 Cursor 安装包:

:::{figure} cursor官网.png
:::

下载好安装包后, 双击安装包, 勾选{menuselection}`我同意此协议`, 然后一步步点击{menuselection}`下一步`安装即可.

### 初次打开 Cursor

让我们{kbd}`右键` Cursor **以管理员身份运行它**. (以后也要记得以管理员身份运行它.)

首次运行时, Cursor 将要求你登录一个账号, 请自行注册并登录 Cursor 账号 (也可以先点击跳过).

:::{figure} 初次打开cursor.png
:::

然后一直点击继续, 勾选 {menuselection}`I'm fine with Cursor learning from my code or I'll turn it off in Settings` (是的, 神人软件先强制你同意数据共享, 如果不愿意再之后自己去设置里取消.), 最后选择 AI 回复语言为中文, 即可进入 Cursor 主界面.

:::{figure} 选择ai回复语言.png
:::

### 设置侧边栏

进入主界面后, 通过 {kbd}`Ctrl-Shift+P` 打开命令菜单, 输入 `open vscode settings` 以找到 {menuselection}`Open VSCode Settings`, 从而打开 VSCode 设置面板, 搜索 `orientation`, 然后将搜索到的选项从 {menuselection}`horizontal` 改为 {menuselection}`vertical`:

:::{figure} 设置侧边栏.png
:::

在设置后, 将会弹窗提示我们重启 Cursor, 点击 {menuselection}`Restart` 即可.

(导入配置文件)=

### 导入配置文件

接下来, 请下载 {download}`Cursor 配置文件 <../sillytavern.code-profile>`. 其中有我由网上已有配置文件改动来的, 酒馆助手编写教程所需的所有 Cursor 配置, 我们将会导入它来配置 Cursor 自动保存文件、保存时格式化文件、安装扩展等许多功能.

要导入配置文件, 我们首先从{menuselection}`左下角齿轮 --> Profiles` 打开配置文件页面:

:::{figure} 打开配置文件页面.png
:::

然后点击 {menuselection}`New Profiles 旁的下三角 --> Import Profile...`, 再点击 {menuselection}`Select File...` 来选择配置文件以导入:

:::{figure} 导入配置文件.png
:::

在选择配置文件后, 我们点击 {menuselection}`Create` 来导入它, 在弹出的窗口中选择 {menuselection}`Trust Publishers & Install` 然后等待 Cursor 导入完成.

:::{figure} 确认导入配置文件.png
:::

在导入完成后, 我们选择 sillytavern 配置文件, 勾选默认使用该配置文件, 再启用它.

:::{figure} 默认使用配置文件.png
:::

此时, Cursor 左下角的齿轮将会显示 `SI` 字样; 以后遇到齿轮没有显示 `SI` 字样时, 也请注意通过{menuselection}`左下角齿轮 --> Profiles` 进行切换.

### 切换中文

在导入完成后, 我们从侧边栏点击 {menuselection}`Extensions` 再搜索 `Chinese` 来安装中文插件. 安装完毕后再重启 Cursor, 则会发现 Cursor 变成了中文.

:::{figure} 安装中文插件.png
:::

### 打开模板文件夹

实时编写前端界面或脚本依赖于我做好的项目模板, 我们打开 <https://github.com/StageDog/tavern_helper_template>, 点击 {menuselection}`Code --> Download ZIP` 来下载它:

:::{figure} 下载模板文件.png
:::

:::{hint}
如果你有代码和 Git 版本管理经验, 也可以 fork 本仓库或从网页右上角的 {menuselection}`Use this template` 按钮来创建一个新仓库, 并按照仓库 README 说明进行配置. \
这将为你带来仓库 README 说明中所说的很多方便功能.
:::

下载完成后, 我们以管理员身份运行 bandizip 选择智能解压它 (别的解压软件我没试过, 可能会有问题), 按自己的意愿重命名文件夹, 然后通过 Cursor 左上角的{menuselection}`文件 --> 打开文件夹...`来打开它:

:::{figure} 打开文件夹.png
:::

如果你没有使用 bandizip, 请至少以管理员身份运行解压软件来解压文件, 但即便这样也可能解压存在问题. 具体地, 我们从 Cursor 里点击左侧 `.mcp.json` 文件, 如果只显示了一行文字, 其中包含 `cursor/mcp.json`, 那就是有问题的.

### 介绍 Cursor 界面

Cursor 界面的总体情况如下所示. 如果哪一部分没有显示, 你可以点击右上角的三个按钮来展开显示它. (新版这三个按钮的图标改了, 但功能一样.)

:::{figure} cursor界面介绍.png
:::

### 禁用 Cursor 的数据共享

根据上图的简单介绍, 我们应该从 {menuselection}`右上角齿轮` (新版不再是齿轮图标, 但功能一样) 来调整 Cursor 的特殊设置.

在此我们先关闭 Cursor 强制我们开启的数据共享:

:::{figure} 关闭数据共享.png
:::

### 安装代码依赖

根据 Cursor 界面, 我们展开{menuselection}`终端`, 然后输入以下命令来安装代码依赖:

```bash
pnpm install
```

:::{figure} 安装依赖完成.png
:::

在安装完成后, 我们将会在项目根目录看到名为 `node_modules` 的文件夹, 这个文件夹中就是我们刚刚通过 `pnpm install` 安装的第三方库.

## 安装字体

为了让代码更易阅读, 建议你寻找中英文的等宽字体安装并自行配置给 Cursor.

## 其他 AI 编程助手

**Cursor 变得越来越蠢了**, 建议你尝试其他 AI 编程助手. 它们有的以 Cursor/VSCode 插件的形式发布, 你可以在 Cursor 侧边栏的{menuselection}`扩展`中搜索安装, 有的是单独的命令行软件.

本教程所提供的模板除了项目本身的配置外, 也为 Cursor 和一些编程助手设置了:

- **规则**: 相当于添加了一个全局世界书, 里面我为项目结构、酒馆助手、前端界面、脚本、MVU 等进行了说明
- **MCP**: 为编程助手添加额外工具, 例如允许编程助手直接查看酒馆网页

因此, 如果你需要使用其他编程助手, 除了编程助手本身的配置外还需要按照以下说明对它们也配置规则和 MCP.

<!-- markdownlint-disable MD032 MD007 -->
Augment
: 很强, 但越来越难白嫖了 \
  规则: 已经配置在了 .augment/rules 中, AI 会自动读取 \
  MCP: 按照 .cursor/mcp.json 自行配置

Cline
: 无中文, 支持自定义 API \
  规则: 已经配置在了 .clinerules 中, AI 会自动读取 \
  MCP: 按照 .cursor/mcp.json 自行配置

RooCode
: 有中文, 改自 Cline, 支持自定义 API, 比 Cline 省 token \
  规则: 已经配置在了 .roo/rules 中, AI 会自动读取 \
  MCP: 已经配置在了 .roo/mcp.json 中, AI 会自动读取

Kilo Code (推荐)
: 有中文, 改自 RooCode, 支持自定义 API, 据说更好 \
  规则: 已经配置在了 .kilocode/rules 中, AI 会自动读取 \
  MCP: 已经配置在了 .kilo/mcp.json 中, AI 会自动读取

Gemini CLI
: 谷歌的编程助手, emmm你真的要拿 gemini 做前端界面吗? 配置可以参考[司马咩咩的用 GEMINI CLI 写卡教程](https://discord.com/channels/1291925535324110879/1418158780927049779) \
  规则: 已经配置在了 GEMINI.md 中, AI 会自动读取 \
  MCP: 按照 .cursor/mcp.json 自行配置到 .gemini/settings.json 里

Claude Code (推荐)
: Anthropic 的编程助手, 和 Gemini CLI 类似 (或者反过来?), 有 claude pro 账号即可使用; 你也可以用 Claude Code Router 接入自定义 API. \
  你还可以执行一句 `npx claude-plugins skills install @anthropics/claude-code/frontend-design` 为 Claude Code 全局添加官方提供的[前端设计提示词](https://claude-plugins.dev/skills/@anthropics/claude-code/frontend-design). \
  规则: 已经配置在了 CLAUDE.md 中, AI 会自动读取 \
  MCP: 已经配置在了 .mcp.json 中, AI 会自动读取

Codex (推荐)
: OpenAI 的编程助手, **据说目前最好用**. \
  规则: 已经配置在了 AGENTS.md 中, AI 会自动读取 \
  MCP: 按照 .cursor/mcp.json 转换为 toml 格式, 然后从 codex 界面打开 mcp 配置文件并填入. 注意将 `mcpSevers` 改为 `mcp_servers`

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
  args = ["chrome-devtools-mcp@latest", "--autoConnet"]
  startup_timeout_ms = 20_000
  :::

其他编程助手
: 规则: 按照 .cursor/rules 自行配置 \
  MCP: 按照 .cursor/mcp.json 自行配置
<!-- markdownlint-enable MD032 MD007 -->
