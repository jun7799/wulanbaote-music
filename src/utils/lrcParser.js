/**
 * 解析LRC歌词文件
 * @param {string} lrcText - LRC文件的文本内容
 * @returns {Array} 解析后的歌词数组，每项包含 {time: 秒数, text: 歌词文本}
 */
export function parseLRC(lrcText) {
  const lines = lrcText.split('\n');
  const lyrics = [];

  // 正则匹配时间标签 [mm:ss.ms]，毫秒可以是任意位数
  const timeRegex = /\[(\d{2}):(\d{2})\.(\d+)\]/;

  for (const line of lines) {
    const match = line.match(timeRegex);
    if (match) {
      const minutes = parseInt(match[1], 10);
      const seconds = parseInt(match[2], 10);
      // 取毫秒的前3位，避免6位数导致时间计算错误
      const msStr = match[3].padEnd(3, '0').substring(0, 3);
      const milliseconds = parseInt(msStr, 10);

      const time = minutes * 60 + seconds + milliseconds / 1000;
      const text = line.replace(timeRegex, '').trim();

      // 过滤掉纯信息行（作词、作曲等）和空行
      if (text && !text.includes('作词') && !text.includes('作曲') &&
          !text.includes('编曲') && !text.includes('录音') &&
          !text.includes('混音') && !text.includes('母带') &&
          !text.includes('封面') && !text.includes('和声')) {
        lyrics.push({ time, text });
      }
    }
  }

  return lyrics;
}

/**
 * 根据当前播放时间获取应该高亮的歌词索引
 * @param {Array} lyrics - 解析后的歌词数组
 * @param {number} currentTime - 当前播放时间（秒）
 * @returns {number} 应该高亮的歌词索引
 */
export function getCurrentLyricIndex(lyrics, currentTime) {
  for (let i = 0; i < lyrics.length; i++) {
    if (currentTime < lyrics[i].time) {
      return i - 1;
    }
  }
  return lyrics.length - 1;
}
