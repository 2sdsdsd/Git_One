# 《等你下课》层叠剪纸 MV

## 当前版本：按歌词讲校园故事

主作品为 `LyricsMV`，以[歌词故事拆解](歌词故事拆解.md)为基础重新制作。九个故事大段内包含 33 个对应歌词含义的画面变化：搬入公寓、升学遗憾、宿舍附近工作、制作早餐、耳机与擦肩、操场等待、亮着的教室、写情书、等下课、弹唱、女孩回头与离开。人物、巷子、公寓与道具均用 React + SVG 绘制。

```powershell
npm.cmd run dev
npm.cmd run lyrics-audio
npm.cmd run lyrics-stills
npm.cmd run lyrics-render
```

在 http://localhost:3010 中选择 `LyricsMV`。新版成片保存为 `out/lyrics-story.mp4`，画面预览保存为 `out/lyrics-storyboard.png`，全部分镜静帧位于 `out/lyrics-stills/`。旧版仍可在 `PaperMV` 中预览，原成片保留为 `out/waiting-for-you.mp4`。

**音频来源与限制：** BGM 是用户根目录中的 MP3，已核对其与 `public/audio/bgm.mp3` 字节一致。MP3 无内嵌歌词。歌词文本来自此前查询的 QQ 音乐参考，逐句场景使用意译而不显示完整歌词。尝试用本地模型直接转写该录音时，Windows 应用控制策略以 `WinError 4551` 阻止识别组件，沙箱外运行也未成功。目前 `src/lyric-timeline.json` 明确保留自动转写未完成、逐句时间未人工核验的状态；时间暂按参考录音比例映射后对齐本地检测拍点。画面与 BGM 已可制作，不把这一估算描述为准确听写。

模型和识别组件已准备在 `.cache` 中。若日后运行环境允许加载该组件，可运行 `scripts/transcribe-local.py` 后再运行 `scripts/build-lyric-timeline.py`；它会使用本地识别锚点重建时间轴。这里没有更改或关闭 Windows 应用控制策略。

## 旧版：纸船与月亮

已从中断的聊天恢复项目。九个镜头由 Remotion、React 和 SVG 绘制，背景音乐使用项目根目录中提供的 MP3；海浪、纸张、鲸跃、风声和灯笼音效由脚本生成。

## 预览和导出

```powershell
npm.cmd run dev
```

打开 http://localhost:3010，选择 `PaperMV`。画面规格为 1920×1080、30 fps。

```powershell
npm.cmd run typecheck
npm.cmd run attach-bgm
npm.cmd run prepare-audio
npm.cmd run stills
npm.cmd run render
```

成片：`out/waiting-for-you.mp4`。九镜头预览：`out/storyboard.png`。原始无声视频也保留在 `out`，便于后续重新混音。

`attach-bgm` 使用 `D:/Anaconda/python.exe` 和已有的 NumPy、SciPy，解码并分析本地音频。可通过 `MV_PYTHON` 指定其他 Python 路径。渲染默认使用已安装的 Edge；可通过 `REMOTION_BROWSER` 指定 Chromium 浏览器路径，通过 `MV_CONCURRENCY` 指定渲染并发数。无需重新下载音频。

## 时间轴和同步

本地 MP3 解码后的有效长度约 283.691 秒，与先前网页参考的 270 秒不同。完整 MV 使用本地音频，不截成原先的 24.1 秒短片。30 fps 的视频帧数向上取整，成片封装时按音频长度收尾。

`src/timeline.json` 保存九个连续镜头、起止帧、音频检测出的约 73.79 BPM 节拍网格与拍点偏移。动画中的脉冲与镜头切换使用同一网格。谱通量和自相关只提供节奏估算；歌词起唱位置由之前的参考时间与附近的频谱攻击峰估算，**尚未经过逐句听感核对**。`beatVerified: false` 如实保留这一状态。需要更精确的歌词卡点时，可在 Studio 中听音轨、调整镜头的 `startFrame`，同步更新上一个镜头的 `endFrame`。

## 九个镜头

1. 启航：六层纸浪逐拍升起，第七拍纸船出现。
2. 孤夜：镜头拉远，乌云遮月，灯笼与星星随节拍闪动。
3. 想着你：人物近景、纸念想泡泡，冷色转暖色。
4. 不惶恐：巨浪、爬坡纸船与纸鲸跃出。
5. 人来人往：粉色黄昏码头，三层不同路人交错走过。
6. 离开：女生挥手，两层纸幕分开，船与码头距离扩大。
7. 感谢：不同纸层后每半拍升起孔明灯，镜头向上移动。
8. 你眼中：纸眼睛的月亮倒影，推入双人纸船画面。
9. 尾声：纸浪逐拍落下，船驶入月亮并淡出。

## 下次继续

即使旧聊天因服务端资源变化无法继续，源代码和音频仍保存在这个目录。新聊天选中 `D:/Claude/Jay_music`，让助手先读本文件和 `src/timeline.json`，即可接着修改项目。无需删除旧聊天或项目。

本项目代码采用 MIT 许可证。歌曲录音及第三方资源不包含在该授权范围内。