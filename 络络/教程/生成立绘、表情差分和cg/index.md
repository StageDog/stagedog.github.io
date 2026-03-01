# 生成立绘、表情差分和 CG

{{ prolog }}

> 帖子: [帖子](https://discord.com/channels/1134557553011998840/1357406336828047488/1357406336828047488)

这篇教程会通过一个例子来教你使用 AI 画图来制作人物立绘、表情动作差分和 CG 插图. \
这些插图可以作为游戏的插图/状态栏, 或者用于完整的 Galgame 界面.

## 下载软件喵

我在制作这些立绘的时候只用到了

- ForgeUI
- Photoshop

其中, ForgeUI 可以在某视频平台上找到简单的一键安装包, 非常容易部署 (请注意不要下载成 sd-webui) \
而 Photoshop 也是非常容易获取的, 这里就不赘述了.

## ForgeUI 怎么用──

虽然 ComfyUI 其实并不难并且很强大, 而 ForgeUI 的后端就是 ComfyUI, 但是我个人感觉 ForgeUI 更容易让不熟悉工作流的小白们 (比如我w) 更加容易上手, 而且用起来和 Nai 也差不多.

首先说明的是, 这个教程只保证你使用和我一样的画风 (模型、LORA 与画风提示词) 时, 能够跑出相对完美的效果:

:::{figure} 示例图.png
:::

事实上, 你仔细看可以看出我的立绘是非常偏向 Flat Color 这种风格的, 人物整体很少有反光.

如果你的模型或 LORA 很注重人物皮肤、服饰的反光效果, 使用这个方法跑的立绘大概会在人物身上有很多背景的反光 (比如使用绿幕会出现绿色的反光). 我个人也不知道有什么比较好的方法解决这个问题, 也没有尝试过寻找. 如果你确实需要可以自行尝试看更换提示词、增加负面提示词或者更换其他 LORA 来规避这个现象.

### 模型与 LORA: 让我们确定画风?

首先我们需要准备模型与 LORA.

- 模型: [waiNSFWIllustrious_v130.safetensors](https://civitai.com/models/827184?modelVersionId=1612720)
- LORA: [v2.0 [wan-t2v-1.3b]](https://civitai.com/models/1132089?modelVersionId=1525407) [^1]

[^1]: 实际上……这是一个视频 LORA. 作者是有针对 illustrious 的 LORA 的, 但是经过个人测试后, 使用 illustrious 的 LORA 跑出的立绘效果过于 flat 了, 所以……我仍然以错误的方法使用这个 1.3b 的针对视频生成的 LORA.

将下载下来的两个 .safetensors 文件分别放在 `models/Stable-diffusion` 文件夹下和 `models/LORA` 文件夹下.

### 安装 Forge 扩展: 好物安利时间

这里顺便推荐一些 Fogre 用的扩展:

- 汉化界面: `https://github.com/hanamizuki-ai/stable-diffusion-webui-localization-zh_Hans`
- 管理与翻译提示词: `https://github.com/Physton/sd-webui-prompt-all-in-one`
- 历史图库: `https://github.com/zanllp/sd-webui-infinite-image-browsing`
- 分区提示词couple: `https://github.com/Haoming02/sd-forge-couple`

点击 ForgeUI 上方的{menuselection}`扩展`选项卡, 选择{menuselection}`从网址安装`, 输入上面列出的链接就可以安装了.

:::{figure} 安装扩展.png
:::

:::{warning}
安装后可能需要重载 UI/重启.
:::

### 调整Forge设置: 预备运动──

现在让我们来调整设置!

:::{figure} 主界面设置.png
:::

#### 上方模型配置

- 左上角选择{menuselection}`全部`
- {menuselection}`模型`部分点击{menuselection}`刷新图标`, 然后选择我们刚安装的`waiNSFWillustrious13`
- 将 {menuselection}`CLIP终止层数`设置为`2`

#### 下方生成选项卡

- 采样方法: Euler a
- 调度类型: Karras
- 迭代步数: 我个人偏好28
- 分辨率: 1024x1536
- Distilled CFG Scale: 3.5
- 提示词引导系数（CFG Scale）: 4.5
- 随机数种子: -1

在这个和{menuselection}`生成`相同级别的选项卡中有一个 {menuselection}`LORA` 选项卡 (我真的很想问 SD 为什么把 LORA 放在这里)

#### 添加 LORA

点击右侧的{menuselection}`刷新按钮`, 就能在其中找到我们刚刚安装的 LORA, 点击 LORA 后提示词上会多出 `<LORA:wan_flat_color_1.3b_v2.1:1>`. 这代表你的 LORA 也成功使用上啦

### 填入立绘提示词: 画画

调整好了重点设置 (或者按照你的喜好也许也行?), 直接开始输入生成立绘的提示词!

#### 正面提示词

```{code-block} text
:emphasize-lines: 2
<LORA:wan_flat_color_1.3b_v2:1>,flat color,no lineart,very awa,masterpiece,best quality,year 2024,newest,highres,absurdres,
在这里填入你的人物与服装提示词
solo,(upper body),cowboy shot,standing,((green background)),((green screen)),simple background,(((tachi-e))),((((facing viewer)))),light smile,eye contact,looking at viewer,
```

:::{hint}
如果你使用的模型或画风有着身体反射绿幕的绿光问题, 可以尝试将 green 换成 grey.
:::

上方一行 `flat color...` 是我的画风串, 最下方一行 `solo...` 是生成立绘所使用的姿势、镜头提示词.

#### 负面提示词

```text
nsfw,bad feet,missing toes,extra toes,lowres,bad anatomy,bad hands,text,error,missing fingers,extra digit,fewer digits,cropped,worst quality,low quality,normal quality,jpeg artifacts,signature,watermark,username,blurry,4-koma,sketch,(bad:1.05),error,fewer,extra,missing,worst quality,jpeg artifacts,bad quality,watermark,unfinished,displeasing,chromatic aberration,signature,extra digits,artistic error,username,scan,abstract,(blurry, lowres, low quality:1.1),ugly,(big head, bad anatomy:1.05),artist name,(watermark:1.1),bar censor,
```

负面应该都差不多……? 如果你需要生成色色的内容, 就把 nsfw 去掉并放到正面提示词第一个喔.

### 示例: 我来画一个

人物与服装呢可以使用你自己已经有的, 没有的话……可以去找 tag 仓库里自己搭配, 或者如果你有很喜欢的一些元素但不知道是什么 tag, 可以使用 ForgeUI 上方的 {menuselection}`WD1.4 标签器`, 上传你的图片来进行反推, 看看其中的TAG都是什么. \
如果你随机跑图跑出了喜欢的角色或服装, 但不知道对应的TAG, 也可以使用 {menuselection}`WD1.4 标签器`来反推!

我这次案例中的人物串是这个: [^2]

[^2]: 是的其实这是一个 vtuber（）

```text
1girl,loli,aged up,animal ears,brown hair,streaked hair,multicolored hair,pink hair,long hair,animal ear fluff,cat ears,red eyes,bangs,pink eyes,
ribbon-trimmed clothes,pink bandaid,brown hooded cape,hood,hair ornament,hoodie,sleeves past wrists,hood up,long sleeves,hairclip,sleeves past fingers,bare legs,
```

所以我的正面提示词是:

```text
<LORA:wan_flat_color_1.3b_v2:1>,flat color,no lineart,very awa,masterpiece,best quality,year 2024,newest,highres,absurdres,
1girl,loli,aged up,animal ears,brown hair,streaked hair,multicolored hair,pink hair,long hair,animal ear fluff,cat ears,red eyes,bangs,pink eyes,
ribbon-trimmed clothes,pink bandaid,brown hooded cape,hood,hair ornament,hoodie,sleeves past wrists,hood up,long sleeves,hairclip,sleeves past fingers,bare legs,
solo,(upper body),cowboy shot,standing,((green background)),((green screen)),simple background,(((tachi-e))),((((facing viewer)))),light smile,eye contact,looking at viewer,
```

万事俱备, 点击生成吧!

<big>生成! </big>

:::{figure} 立绘.png
:::

像这样就还不错呢! 如果是这张图的话, 似乎完全没必要使用 Photoshop, 直接使用 ForgeUI 内置的大模型抠图, 或者使用在线大模型, 应该就可以扣完整, 让我试试看:

点击 ForgeUI 上方的 {menuselection}`SPACE` 按钮, 选择 {menuselection}`IMAGE Processing`, {menuselection}`安装`, {menuselection}`Launch`, 上传图片, {menuselection}`Remove Background`……

超级完美——

:::{figure} 透明立绘.png
:::

这样我们获得了我们的第一张立绘!

请注意, 你的立绘应该避免以下问题:

- 四周被截断, 如左右两侧显示不全, 顶部没有显示完整等. 这样放进背景里真的很难看, 答应我不要这样做
- 身体错误的反射了来自背景的光, 比如, 大腿上有绿色的反光……后果会怎么样想必你也知道
- 身体动作幅度很大, 没有站立姿势, 或者头很歪 (适当倾斜是正常的). 就算看起来不错, 但是做出立绘这样真的很难看……

有了完美的立绘已经是最好的开始了, 但是一个游戏肯定要有不同的表情动作, 甚至这个角色还需要穿其他衣服. \
现在, 让我们来开始图生图重绘!

:::{hint}
你也可以试试让 gemini-3-pro-image-preview 帮你生成差分, 很容易做, 而且分辨率可以高达 4K!

:::{figure} gemini生成差分.png
:::
:::

## 表情差分

在你刚刚的带着绿幕立绘下方, 有一个画板按钮: 发送到局部重绘, 请点击!

:::{figure} 重绘.png
:::

来到这边后, 可以发现我们的提示词和设置都被发送了过来, 如果你的没有被发送过来……请手动调整一下吧!

### 重绘设置解释

我来简单介绍一下重绘中你需要知道的按钮意义 (没提到的可以不用管).

**你可能需要大致理解大模型画画的原理:** \
它并不是和人类一样一笔一笔画, 而是先将图片整个铺上许多噪点, 然后根据你的提示词, 将这些噪点逐渐降噪选择确定的颜色, 保留出符合提示词的那些颜色像素, 慢慢的变成了最终的图片.

{menuselection}`蒙版边缘模糊度`
: 想象一下PS的画笔, 有的画笔非常锐利, 写上去多少就是多少, 而有的画笔呢是朦胧的带着一些模糊边缘, 实际上的笔迹并不会完全填满整个画笔光标指示器, 这里也同理!
  如果这个值太高, 你在绘制重绘部分时可能需要往外扩展地画一些; 如果太太低, 可能重绘的边缘会和原图的边缘分离并不连贯, 所以需要根据你的需求调整.

{menuselection}`重绘蒙版内容/重绘非蒙版内容`
: 选择是重绘你画笔画到的区域, 还是重绘的画笔没画到的区域.

<!-- markdownlint-disable MD007 MD032 -->
{menuselection}`重绘区域`
: 整张图片: 直接将整张图片铺上噪点重新绘制, 但然后最终只保留你画笔画到的区域, 重绘出来的图片更加连贯丝滑. \
  仅蒙版区域: 只在你画笔周围的区域 (是个矩形) 铺上和整张图片相同数量的噪点, 然后最终只保留你画笔画到的区域, 重绘的区域会更加具有细节.
<!-- markdownlint-enable MD007 MD032 -->

{menuselection}`重绘幅度`
: 最重要! 影响了铺噪点数量的多少. 如果调高铺的高, 大模型可能更少看清原来的画面是什么样; 如果铺得少, 大模型能改动的就很少. 一会我会告诉你我是怎样选择的, 通常来说这个没有什么固定的设置.

### 示例

首先呢, 对于这个立绘, 她现在笑眯眯的, 其实就很适合作为默认或者通常之类的立绘. \
但是我们可能还会需要类似于: 愤怒、悲伤、哭泣、害羞等. 并且我也建议你分为不同的如: 愠怒、生气到极点、难过、悲伤、哭泣、大哭、微微脸红、害羞、害羞到捂脸等, 画出相同情绪但不同程度的立绘, 这也许会增加你的工作量? 总之请以你个人需求为准啦.

我们先来画一个愤怒的立绘!

直接这样用画笔将脸部盖住, 不需要画的过于精细, 但是你可以看到我的角色有一个发卡, 我不希望换表情这个发卡也会变掉, 所以我把他让了出来:

:::{figure} 表情差分.png
:::

然后再正向提示词找个位置 (我习惯于再末尾) 增加表情的提示词: `anger`. \
我原本角色串中有个 `light simle`, 让我把它删掉……然后添加 `anger` 并为它增加权重: `(anger:1.2)`.

我的设置是: \
（重绘出现少量的错误是允许的, 之后我告诉你怎样修理! ）

- 模糊度: 17
- 蒙版模式: 重绘蒙版内容
- 蒙版区域内容处理: 原版
- 整张图片
- **重绘幅度: 65** (如果你的表情没能重绘出来变化不大, 请拉高; 如果变化太大导致画面崩坏, 稍微降低一点)
- **勾选柔和重绘**

<big>生成!</big>

:::{figure} 愤怒差分.png
:::

生气的小猫也可爱捏~ \
但是……你有注意到吗? 我们仔细看的话脸部尤其是发卡附近, 能看到有一些些绘画错误. 如果你的要求不太高, 或者说觉得这些无伤大雅, 已经可以切换 tag 来画下一张了, 但是我的要求比较高……所以让我教你如何修复这些问题.

答案是, 再发送到重绘, 扩大画笔, 降低重绘幅度:

:::{figure} 修复.png
直接就是一个大圆盖住脸（）
:::

然后, 我将重绘幅度调整成了 `0.35`.

<big>生成!</big>

:::{figure} 修复后.png
:::

呃、可以看到, 修复后的图和原图相比, 几乎没有区别, 但是错误的地方更少了, 并且看不出来有不连贯的地方 \
(我的例图在第一次重绘后就有些完美, 导致修复看似效果不大; 如果你的立绘重绘出现了一些错误, 可以尝试这样修复, 也许会震撼于它的效果w.)

这就是表情差分的全部啦, 是不是还挺简单的? \
是的, 我尝试了很多方法, 包括 ControlNet 等, 但是说实话, 都不如这个方法简单好用. 根据你的电脑, 只需要最多几次按钮就可以获得一张很完美可用的表情差分立绘 \
(喂! 可不要想着用这个方法来做 Galgame 圈钱哦——)

但是只是表情变化, 情绪显得不是很足够呢……可以做到动作上也有变化吗? \
可以的兄弟!

## 简单动作差分

事实上对于立绘来说, 动作最好不需要太大, 我个人的选择是只有比猫爪来表现生气, 以及抬手擦眼泪. \
比猫爪生气说实话还蛮简单的, 但是抬手擦眼泪……稍微难一点对吧? \
我尝试了包括线稿、软边缘、姿势的 ControlNet, 发现还是重新生成图片最简单好用 (目移). \
所以为了避免增加额外的麻烦, 我不会提供 ControlNet 的姿势图以及教你怎么用, 你真的需要学的话可以自己查看文档, 并不难哦.

那么, 我是怎么画出类似这样的动作呢?

:::{figure} 擦眼泪.png
:::

其、其实和重绘表情一样简单直接（目移）

先、先修改提示词吧,

我把 `anger` 换成了这些 `(crying:1.2),(wiping tears:1.2),(covering own eyes:1.2),(hand up:1.1),(wiping face:1.1),`. 是的, 可以看到权重给的蛮夸张的
并且又没人规定表情必须用一个词, 你也可以做用 `light smile` 和 `anger` 一起用, 弄出一个又生气又笑的表情啦.

但是, 重绘只画脸肯定是不行了, 怎么办呢……? 把、把手也一起画上!

:::{figure} 重绘擦眼泪笔刷.png
:::

可以看到, 由于有蒙版边缘模糊度与柔和重绘, 你需要和我一样画的范围尽量大点. \
而且你也不知道最终这个手会什么姿势……所以画大点更不容易再蒙版边缘之外啦.

我也不确定重绘幅度多少比较好, 我们试试看 `0.65`.

:::{figure} 错误生图.png
:::

呜哇……看起来, 我们重绘幅度稍微小了一点呢?

而且, 我在提示词上写了 `cape`, 但是实际上人物并没有用到…… \
<small>偷偷把 `cape` 删了（）</small>

而且我忘记了腿上的创可贴, 导致他消失了一点!

现在让我们把画笔让出关键的部分, 然后稍微拉高重绘幅度到 `0.7` 试试看:

:::{figure} 重新调整.png
:::

<big>生成……没画对, 懒得放图</big>

呃、这一张图片她选择举起了右手, 这和我们重绘区域不太符合, 导致一只手悬浮的飘着, 也算正常现象, 所以……重ROLL. \

:::{hint}
你也可以选择告诉模型抬起哪只手, 但是我发现大模型搞不清对于人物的左右和对于镜头的左右, 所以我选择不告诉他然后重ROLL到合适的……
:::

你可以在{menuselection}`总批次数`那里选择如 `4` 之类的数字来一次出 4 张图.

跑了大概 12 张 (也就是 3 轮 4 张图) \
我最终的重绘幅度增加到了 `0.85`, 你们也可以拿这个数值做参考呢.

我最终的选图是这张:

:::{figure} 最终选图.png
:::

呃、错误还挺多的是不啦w, 记得应该怎么办吗（）

**发送到重绘, 低重绘幅度, 启动.** \
(记得调回生成一张图而不是四张x)

:::{figure} 最终修复.png
:::

完美! \
什么? 你说头发穿模了? \
呃……也、也许后边的衣服是开口的头发可以穿出来 (胡言乱语).

是的这是因为长发 tag 干扰到了, 我们应该删掉长发 tag, 但是我是 PS 高手我会把这段 PS 掉（）

教程到这里就已经教了 90% 了, 我还没有讲的是如何为她换衣服和用 PS 抠图.

## 增添衣柜

换衣服……若想简单点, 则不得不用 Photoshop 了呢.

大概原理是: (看不懂没关系, 之后有演示喵)

1. {menuselection}`重绘`覆盖住脸部后, 选择{menuselection}`重绘非蒙版区域`, 更换服装 tag, 生成
2. 这样你会得到一张面部和面前头发相同, 但服装变换了的立绘
3. 我们把换衣前和换衣后两张图片扔到PS里, 将新服装的图层放到旧服装的上边, 然后用{menuselection}`橡皮擦`擦掉脸部露出下方原来的脸部表情（）
4. 仔细用鼠标擦掉表情后, 最后得到一张看起来完美的换衣后立绘
5. 之后将之前所有表情的图片都丢进来, 用{menuselection}`图层显示按钮 (小眼睛)`切换图层来更换不同表情并导出为PNG (也可以录制动作批量导出)

让我们来实操吧……(好想偷懒! )

:::{figure} 重绘换衣服.png
:::

我们用画笔尽可能地覆盖脸部和脸部周围的头发 (但是不要覆盖到可能换衣的部分, 比如帽子、围巾等). \
选择{menuselection}`重绘非蒙版区域`, 重绘幅度为 `0.8`. \
更换服装提示词为 `school uniform`.

<big>生成!</big>

:::{figure} 换衣服成功.png
:::

啊哇, 原来图片有兜帽, 导致换衣后头发那里光影不对啦!

发送到重绘, 勾画出错的地方, 重绘区域选择整张图片, 重绘幅度为 `0.5`:

<big>修复!</big>

:::{figure} 换衣服修复.png
:::

完美捏!

:::{warning}
千万要检查你修复好还有没有其他区域有错误, 常见错误的区域可能有头发边缘、脖子下巴之类的地方.

你可以分多次修复, 也就是修复之后发现还有问题, 发送到重绘, 然后继续勾画修复的地方.
:::

如果……你实在用不了 Photoshop 的话, 其实可以费力一点就和之前一样, 继续用 AI 画表情差分.

但是如果你安装了 Photoshop 就可以继续看! 接下来我先说如何换脸, 最后会说如何抠图. \
(事实上这张图大模型抠图的效果就不好了……大模型会保留一些绿色的背景)

## 超简单 Photoshop 教程x

### 换脸

首先是换脸.

我们先将图片导入 Photoshop, 然后选择图层, 将我们的新衣服放在上边, 之前的表情放在下边.

接着, 我们使用{menuselection}`橡皮擦工具`, 将脸部擦除露出下方不一样的表情.

这个步骤请擦除地细致一些, 它只需要进行一次, 之后就只需要点击眼睛切换图层来更换表情并导出了.

具体请看换脸视频:

:::{video} 换脸视频.mp4
:align: center
:::

抱歉, 视频中没能将上方区域擦除干净, 还能看出一条分界线, 使用橡皮擦再擦擦就好了x.

最终成品:

:::{figure} PS后愤怒.png
:::

你可以将这个脸部被擦除的图层保留（）\
虽然有些恐怖, 但是可以很方便的更换表情!

我、我就不放图片了哦w.

[面部被扣掉的水手服立绘😱]

### 抠图

接下来, 我教你如何抠图, 这真的很简单只需要不到 30s!

:::{video} 抠图视频.mp4
:align: center
:::

:::{figure} 抠图后愤怒.png
:::

差不多只需要 30s 左右就能抠完呢, 真的很简单——

可能时看到头发啊边缘之类的效果不太好, 嗯……实际上如果你追求比较高, 可以用**反向橡皮擦来勾线将其擦回来**. \
<small>反向橡皮擦就是点击橡皮擦后, 上方勾选{menuselection}`抹到历史记录`</small> \
工作量也不算大, 大概两分钟就能做完? 鼠标画也可以呢, 毕竟 PS 现在的平滑绘画还挺强大的!

但是我认为只是用爱发电而已（）没必要做这么完美吧ww这个效果已经足够啦! 你也可以试试这个[抠图网站](https://www.koukoutu.com/removebgtool/all)!

请看, 带有背景的效果:

:::{figure} 带背景.png
背景来自[一个免费可商用的网站](https://min-chi.material.jp/category/fm/bg_c/)
:::

## 结语

好啦, 你已经看完全部教程了, 希望有帮到你!
如果你真的制作了带有立绘的卡, 请务必 at 我让我也观摩一下qwq

对了, 如果嫌生成那么多表情麻烦, 可以安装 <https://github.com/adieyal/sd-dynamic-prompts> 然后配置一个动态提示词一键重绘几十种表情哦?

完结撒花w
