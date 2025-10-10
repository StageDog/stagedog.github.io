# MVU beta: 允许 AI 在游玩中途增加、删除变量

{{ prolog }}

目前仅提供试运行视频:

:::{raw} html
<div class="responsive-video-container">
  <iframe
    src="https://www.youtube.com/embed/Roh8oa2kbas?si=fEm_U27qU2h3Be15"
    frameborder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    allowfullscreen>
  </iframe>
</div>
:::

上方视频若无法查看, <a href="https://www.youtube.com/watch?v=Roh8oa2kbas" target="_blank" rel="noopener noreferrer">点击跳转 Youtube</a>.

此外, 建议将提示词中的 `_.assign` 替换成 `_.insert`, 这能让 AI 更明白是要进行插入操作, 避免和 `_.set` 打架.
