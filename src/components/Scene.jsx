import React, { useMemo } from 'react';
import './Scene.css';

// 根据播放时间获取应该显示的场景
const getSceneForTime = (currentTime) => {
  // 歌曲时长：约201秒（3:21）
  // 每个场景约22秒

  // 0:00-0:22: scene1 "穿过旷野的风" - 草原风
  // 0:22-0:44: scene2 "沉默告诉我醉了酒" - 沉默醉酒
  // 0:44-0:67: scene3 "乌兰巴托的夜那么静" - 夜空宁静
  // 0:67-0:89: scene4 "飘向天边的云" - 云朵飘动
  // 0:89-1:11: scene5 "歌儿轻轻唱风儿轻轻吹" - 歌唱风起
  // 1:11-1:33: scene6 "有一个地方很远很远" - 远方草原
  // 1:33-1:56: scene7 "骄傲的母亲目光深远" - 母亲凝望
  // 1:56-2:18: scene8 "唱歌的人不许掉眼泪" - 情感高潮
  // 2:18-3:21: scene9 结尾 - 宁静延续

  if (currentTime < 22) return 'scene1';
  if (currentTime < 44) return 'scene2';
  if (currentTime < 67) return 'scene3';
  if (currentTime < 89) return 'scene4';
  if (currentTime < 111) return 'scene5';
  if (currentTime < 133) return 'scene6';
  if (currentTime < 156) return 'scene7';
  if (currentTime < 178) return 'scene8';
  return 'scene9';
};

const Scene = ({ currentTime = 0 }) => {
  const currentScene = useMemo(() => getSceneForTime(currentTime), [currentTime]);

  return (
    <div className="scene-container">
      {/* 背景图片 */}
      <div
        key={currentScene}
        className="scene-image"
        style={{
          backgroundImage: `url('/${currentScene}.jpg')`
        }}
      />
      {/* 老电影效果层 */}
      <div className="vintage-film-grain" />
      <div className="vintage-scanlines" />
      <div className="vintage-vignette" />
      {/* 渐变遮罩，让歌词更清晰 */}
      <div className="scene-overlay" />
    </div>
  );
};

export default Scene;
