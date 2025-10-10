project = '白化蓝染的酒馆'
copyright = '2025. 络络, 青空莉想做舞台少女的狗'
author = '络络, 青空莉想做舞台少女的狗'
html_title = f'{project}'

extensions = [
    'myst_parser',
    'sphinxcontrib.video',
    'sphinx.ext.extlinks',
    'sphinx_copybutton',
    'sphinx_design',
    'sphinx_examples',
    'sphinx_last_updated_by_git',
    'sphinx_tabs.tabs',
    'sphinx_togglebutton',
]

extlinks = {
    'stagedog': ('https://gitgud.io/StageDog/tavern_resource/-/raw/main/%s?inline=false', '[青空莉资源 %s]'),
    'stagedog_commit': ('https://gitgud.io/StageDog/tavern_resource/-/raw/%s?inline=false', '[青空莉资源 %s]'),
    'stagedog_path': ('https://gitgud.io/StageDog/tavern_resource/-/tree/main/%s', '[青空莉仓库 %s]'),
    'stagedog_path_commit': ('https://gitgud.io/StageDog/tavern_resource/-/tree/%s', '[青空莉仓库 %s]'),
    'lolodesu': ('https://gitgud.io/lolodesu/lolocard/-/raw/master/%s?inline=false', '[络络资源 %s]'),
    'lolodesu_commit': ('https://gitgud.io/lolodesu/lolocard/-/raw/%s?inline=false', '[络络资源 %s]'),
    'lolodesu_path': ('https://gitgud.io/lolodesu/lolocard/-/tree/master/%s', '[络络仓库 %s]'),
    'lolodesu_path_commit': ('https://gitgud.io/lolodesu/lolocard/-/tree/%s', '[络络仓库 %s]'),
}

exclude_patterns = ['.venv', 'build', 'node_modules', 'README.md']
git_last_updated_timezone = 'Asia/Shanghai'
html_baseurl = 'https://stagedog.github.io'
html_favicon = 'logo.ico'
html_last_updated_fmt = '%Y-%m-%d %H:%M:%S'
html_search_language = 'zh'
html_static_path = ['_static']
html_theme = 'sphinx_book_theme'
html_theme_options = {
    'repository_url': 'https://github.com/StageDog/stagedog.github.io',
    'show_navbar_depth': 2,
    'show_prev_next': True,
    'show_toc_level': 2,
    'use_edit_page_button': True,
    'use_issues_button': True,
    'use_sidenotes': True,
    'use_source_button': True,
}
language = 'zh_CN'
myst_enable_extensions = [
    "attrs_inline",
    "colon_fence",
    "deflist",
    "fieldlist",
    "html_admonition",
    "html_image",
    "linkify",
    "replacements",
    "strikethrough",
    "substitution",
    "tasklist",
]
myst_substitutions = {
    "prolog": """
```{eval-rst}
.. meta::
  :robots: noindex
```
"""
}
md_prolog = """
"""
togglebutton_hint = "点击展开"
togglebutton_hint_hide = "点击隐藏"


def setup(app):
    app.add_js_file("script.js")
    app.add_css_file("style.css")
