import React, { useRef, useEffect } from 'react';
import './Lyrics.css';

const Lyrics = ({ lyrics, currentIndex, onLyricClick }) => {
  const containerRef = useRef(null);
  const activeItemRef = useRef(null);

  // 当当前歌词索引变化时，滚动到对应位置
  useEffect(() => {
    if (activeItemRef.current && containerRef.current) {
      const container = containerRef.current;
      const activeItem = activeItemRef.current;

      // 计算滚动位置，让当前歌词居中
      const containerHeight = container.clientHeight;
      const itemTop = activeItem.offsetTop;
      const itemHeight = activeItem.clientHeight;

      container.scrollTo({
        top: itemTop - containerHeight / 2 + itemHeight / 2,
        behavior: 'smooth'
      });
    }
  }, [currentIndex]);

  return (
    <div className="lyrics-container" ref={containerRef}>
      {lyrics.map((lyric, index) => (
        <div
          key={index}
          ref={index === currentIndex ? activeItemRef : null}
          className={`lyric-item ${index === currentIndex ? 'active' : ''}`}
          onClick={() => onLyricClick && onLyricClick(lyric.time)}
        >
          {lyric.text}
        </div>
      ))}
      {/* 底部留白，方便最后一行歌词居中 */}
      <div className="lyrics-spacer"></div>
    </div>
  );
};

export default Lyrics;
