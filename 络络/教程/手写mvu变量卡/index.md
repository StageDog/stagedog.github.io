# 手写 MVU 变量卡

{{ prolog }}

> 帖子: [类脑](https://discord.com/channels/1134557553011998840/1400321862235328552/1400321862235328552)/[旅程](https://discord.com/channels/1291925535324110879/1400321714298294272/1400321714298294272)

如何在不使用 AI 的情况下, 编写用变量与 EJS 控制的提示词? 让我们先来了解一下流程, 再阅读文档来理解细节:

:::{raw} html
<div class="responsive-video-container">
  <iframe
    src="https://www.youtube.com/embed/YEr6ivYzpqY?si=JNOK3sqkk-07xUtC"
    frameborder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    allowfullscreen>
  </iframe>
</div>
:::

上方视频若无法查看, <a href="https://www.youtube.com/watch?v=YEr6ivYzpqY" target="_blank" rel="noopener noreferrer">点击跳转 Youtube</a>.

如今, 越来越多的人会使用 AI 写卡工具写卡, 而自己对酒馆、提示词缺乏理解 (**忆涟杯参赛作品绿灯错误率高达 70%**). \
结果是, 一些人的有趣想法只能经由 AI 生成的、质量无法保证的提示词来实现. \
这样的提示词往往不够定制化, 因而效果不理想或占用过多的注意力.

MVU 变量框架的结构更为特殊, 更是这种情况的重灾区.

因此, 我决定教你如何不使用任何工具来制作一张 MVU 变量卡, 从而帮助你更好地理解酒馆、世界书 (请阅读{doc}`世界书条目的激活 </青空莉/工具经验/酒馆如何处理世界书/index>`)、MVU 和提示词.

**文章理解起来并不困难, 请不要看到不认识的名词或字母就放弃, 遇到不懂的可以复制下来发送给 AI 并进行询问.**

荒行 (`@naniitteno`) 做了 MVU 图解 ([谷歌文档](https://docs.google.com/document/d/1N2be_3H2E9MqehcU-cDkzW3lTgSZo3RclXHa3lXwuEU/edit?pli=1&tab=t.0#heading=h.g5702bugc1wv)/[旅程原帖](https://discord.com/channels/1291925535324110879/1436345117739843694/1436345117739843694)), 可以配合着看!

:::{hint}

- 教程所使用的提示词结构可以用{doc}`门之主写卡助手 </青空莉/作品集/index>`直接生成
- 如果需要示例卡, 目前请在阅读教程后参考{lolodesu}`日记络络 <src/日记络络/白化蓝染的日记本.png>`
- 另外还有`/青空莉/工具经验/实时编写角色卡、世界书或预设/index`和[咩咩的 Gemini CLI 全自动写卡教程](https://discord.com/channels/1291925535324110879/1418158780927049779)能提升你的写卡体验
:::

:::{toctree}
:maxdepth: 2
安装插件和导入脚本/index
设置和初始化变量/index
变量提示词/index
状态栏/index
动态发送提示词/index
脚本控制变量/index
mvu_beta/index
mvu会让ai变蠢吗/index
附录/index
:::
