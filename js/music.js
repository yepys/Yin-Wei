/**
 * 获取酷狗音乐搜索列表
 * @param {string} msg - 歌曲名/歌手名（必填）
 * @param {string} [n=''] - 歌曲索引（选填，为空返回列表）
 * @param {string} [num='100'] - 最大返回数量（选填，默认30）
 * @param {string} [quality='viper_atmos'] - 音质（选填，128/320/flac/viper_atmos）
 * @returns {Promise<Array>} 歌曲列表数组
 */
async function fetchKugouMusicList(msg, n = '', num = '100', quality = 'viper_atmos') {
  try {
    const baseUrl = 'https://www.hhlqilongzhu.cn/api/dg_kugouSQ.php';
    const params = new URLSearchParams({
      msg,
      n,
      num,
      type: 'json',
      quality,
    });

    const response = await fetch(`${baseUrl}?${params}`);

    if (!response.ok) {
      throw new Error(`列表请求失败，状态码：${response.status}`);
    }

    const data = await response.json();

    // 处理列表数据，提取关键字段
    if (data.data && Array.isArray(data.data)) {
      return data.data
        .filter(item => item.Duration !== "0:00") // 过滤时长为0:00的歌曲
        .map((item) => ({
          n: item.n,
          title: item.title,
          singer: item.singer,
          duration: item.Duration,
        }));
    }

    return [];
  } catch (error) {
    console.error('获取歌曲列表错误：', error.message);
    throw error;
  }
}

/**
 * 获取指定歌曲的详细信息
 * @param {string} msg - 歌曲名/歌手名（必填）
 * @param {string} n - 歌曲索引（必填，从列表中获取）
 * @param {string} [quality='viper_atmos'] - 音质（选填，128/320/flac/viper_atmos）
 * @returns {Promise<Object>} 包含指定字段的歌曲详情
 */
async function fetchKugouMusicDetail(msg, n, quality = 'viper_atmos') {
  try {
    const baseUrl = 'https://www.hhlqilongzhu.cn/api/dg_kugouSQ.php';
    const params = new URLSearchParams({
      msg,
      n,
      num: '100',
      type: 'json',
      quality,
    });

    const response = await fetch(`${baseUrl}?${params}`);

    if (!response.ok) {
      throw new Error(`详情请求失败，状态码：${response.status}`);
    }

    const data = await response.json();

    // 验证并提取所需字段
    const requiredFields = ['title', 'singer', 'cover', 'music_url', 'lyrics'];
    const missingFields = requiredFields.filter((field) => !(field in data));

    if (missingFields.length > 0) {
      console.warn(`数据缺失：${missingFields.join(', ')}，将使用默认值`);
    }
    
    // 验证字段值是否为null或无效
    if (!data.title) {
      console.error('歌曲标题缺失');
      data.title = '未知歌曲';
    }
    
    if (!data.singer) {
      console.error('歌手信息缺失');
      data.singer = '未知歌手';
    }
    
    // 检查音乐URL是否有效
    if (!data.music_url || data.music_url === '?from=longzhu_api') {
      console.error('无效的音乐URL');
      throw new Error('无效的音乐URL，无法播放此歌曲');
    }
    
    // 检查音乐URL是否包含HTTP协议
    if (data.music_url && !data.music_url.startsWith('http')) {
      data.music_url = 'https:' + data.music_url;
      console.warn('音乐URL缺少协议，已自动添加HTTPS协议');
    }
    
    // 检查封面URL是否有效
    let coverUrl = './img/4k.png'; // 默认封面
    
    if (data.cover && data.cover.trim()) {
      // 移除封面URL中的多余空格
      coverUrl = data.cover.trim();
      
      // 检查封面URL是否包含HTTP协议
      if (!coverUrl.startsWith('http')) {
        coverUrl = 'https:' + coverUrl;
        console.warn('封面URL缺少协议，已自动添加HTTPS协议');
      }
    } else {
      console.warn('封面URL缺失，使用默认封面');
    }
    
    // 返回处理后的详情数据，提供默认值防止null
    return {
      title: data.title,
      singer: data.singer,
      cover: coverUrl,
      music_url: data.music_url,
      lyrics: data.lyrics || '',
    };
  } catch (error) {
    console.error('获取歌曲详情错误：', error.message);
    throw error;
  }
}

/**
 * 收藏相关功能
 */
const FAVORITES_KEY = 'music_favorites';

/**
 * 获取所有收藏歌曲
 * @returns {Array} 收藏歌曲数组
 */
function getFavorites() {
  const favorites = localStorage.getItem(FAVORITES_KEY);
  return favorites ? JSON.parse(favorites) : [];
}

/**
 * 切换歌曲收藏状态
 * @param {Object} song - 歌曲对象，必须包含n、title、singer字段，可选包含music_url、cover字段
 * @returns {boolean} 当前收藏状态（true为已收藏）
 */
function toggleFavorite(song) {
  const favorites = getFavorites();
  const index = favorites.findIndex(item => item.n === song.n);

  if (index > -1) {
    // 移除收藏
    favorites.splice(index, 1);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    return false;
  } else {
    // 添加收藏，包含音乐链接和封面链接（如果有）
    const songToSave = { 
      n: song.n, 
      title: song.title, 
      singer: song.singer,
      music_url: song.music_url || '',
      cover: song.cover || ''
    };
    favorites.push(songToSave);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    return true;
  }
}

/**
 * 检查歌曲是否已收藏
 * @param {string} songId - 歌曲索引n
 * @returns {boolean} 是否收藏
 */
function isFavorite(songId) {
  const favorites = getFavorites();
  return favorites.some(item => item.n === songId);
}