# 音为音乐播放器

一个简洁的在线音乐播放器，支持搜索、播放、收藏等功能。

## 功能特点

- 音乐搜索与播放
- 音质选择（标准音质、高音质、无损音质、杜比全景声）
- 收藏喜欢的歌曲
- 响应式设计，支持移动端和桌面端
- 播放控制（播放/暂停、上一首/下一首、音量调节）
- 进度条控制

## 安装与使用

### 开发环境设置

1. 安装依赖

```bash
npm install
```

2. 编译Tailwind CSS

```bash
npm run build
```

3. 开发模式（实时编译CSS）

```bash
npm run watch
```

4. 在浏览器中打开`index.html`文件

## 项目结构

```
├── css/                # CSS文件
│   ├── style.css       # Tailwind CSS源文件
│   └── output.css      # 编译后的CSS文件
├── img/                # 图片资源
├── js/                 # JavaScript文件
│   └── music.js        # 音乐API相关功能
├── index.html          # 主页面
├── tailwind.config.js  # Tailwind配置
└── package.json        # 项目依赖
```

## 技术栈

- HTML5
- CSS3 (Tailwind CSS)
- JavaScript (原生)
- 酷狗音乐API (非官方)

## 注意事项

- 本项目仅用于学习和个人使用
- 音乐资源来自第三方API，可能存在不稳定情况
- 在生产环境中使用时，请确保已编译Tailwind CSS
- 默认使用高音质(320kbps)，如果播放失败，可以尝试降低音质
- 杜比全景声等高音质选项可能在某些歌曲上不可用，此时会自动降级