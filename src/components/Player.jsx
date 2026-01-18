import React, { useState, useEffect, useRef } from 'react';
import { parseLRC, getCurrentLyricIndex } from '../utils/lrcParser';
import Scene from './Scene';
import Lyrics from './Lyrics';
import './Player.css';

const Player = () => {
  const [lyrics, setLyrics] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [lrcLoaded, setLrcLoaded] = useState(false);

  const audioRef = useRef(null);

  // 加载歌词文件
  useEffect(() => {
    fetch('/lyrics.lrc')
      .then(response => response.text())
      .then(text => {
        const parsedLyrics = parseLRC(text);
        setLyrics(parsedLyrics);
        setLrcLoaded(true);
      })
      .catch(error => {
        console.error('加载歌词失败:', error);
      });
  }, []);

  // 更新当前歌词索引
  useEffect(() => {
    if (lyrics.length > 0) {
      const index = getCurrentLyricIndex(lyrics, currentTime);
      setCurrentIndex(index);
    }
  }, [currentTime, lyrics]);

  // 音频时间更新
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  // 音频加载完成
  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  // 播放/暂停切换
  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // 格式化时间显示
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // 进度条拖动
  const handleSeek = (e) => {
    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    if (audioRef.current) {
      audioRef.current.currentTime = percent * duration;
      setCurrentTime(percent * duration);
    }
  };

  // 计算进度百分比
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  // 点击歌词跳转到对应时间
  const handleLyricClick = (time) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
      // 如果当前是暂停状态，点击后自动播放
      if (!isPlaying) {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  return (
    <div className="player-container">
      {/* 背景场景 */}
      <Scene currentTime={currentTime} />

      {/* 歌词显示 */}
      {lrcLoaded && <Lyrics lyrics={lyrics} currentIndex={currentIndex} onLyricClick={handleLyricClick} />}

      {/* 播放控制条 */}
      <div className="controls-bar">
        <div className="controls-content">
          {/* 歌曲信息 */}
          <div className="song-info">
            <div className="song-title">乌兰巴托的夜</div>
            <div className="song-artist">半吨兄弟/张茜</div>
          </div>

          {/* 播放按钮 */}
          <button className="play-button" onClick={togglePlay}>
            {isPlaying ? (
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z"/>
              </svg>
            )}
          </button>

          {/* 时间显示 */}
          <div className="time-display">
            <span className="current-time">{formatTime(currentTime)}</span>
            <span className="time-separator">/</span>
            <span className="total-time">{formatTime(duration)}</span>
          </div>
        </div>

        {/* 进度条 */}
        <div className="progress-container" onClick={handleSeek}>
          <div className="progress-bar-bg">
            <div
              className="progress-bar-fill"
              style={{ width: `${progressPercent}%` }}
            >
              <div className="progress-bar-handle"></div>
            </div>
          </div>
        </div>
      </div>

      {/* 音频元素 */}
      <audio
        ref={audioRef}
        src="/song.mp3"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
      />
    </div>
  );
};

export default Player;
