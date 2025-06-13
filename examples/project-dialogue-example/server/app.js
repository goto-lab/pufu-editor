import express from 'express';
import cors from 'cors';
import axios from 'axios';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const VOICEVOX_URL = 'http://localhost:50021';

const VOICE_IDS = {
  'ずんだもん': { normal: 3, whisper: 7 },
  '四国めたん': { normal: 2 },
  '春日部つむぎ': { normal: 8 },
  'ナースロボ＿タイプＴ': { normal: 47 },
  '小夜': { normal: 46 },
};

// 音声合成エンドポイント
app.post('/api/synthesize', async (req, res) => {
  try {
    const {
      text,
      speaker = 3, // デフォルトはずんだもん
      speedScale = 1.2,
      pitchScale = 0,
      intonationScale = 1,
      volumeScale = 1,
      prePhonemeLength = 0.1,
      postPhonemeLength = 0.1
    } = req.body;

    // 音声クエリの作成
    const queryResponse = await axios.post(
      `${VOICEVOX_URL}/audio_query`,
      null,
      {
        params: { text, speaker },
      }
    );

    const audioQuery = queryResponse.data;
    
    // パラメータの調整
    audioQuery.speedScale = speedScale;
    audioQuery.pitchScale = pitchScale;
    audioQuery.intonationScale = intonationScale;
    audioQuery.volumeScale = volumeScale;
    audioQuery.prePhonemeLength = prePhonemeLength;
    audioQuery.postPhonemeLength = postPhonemeLength;

    // 音声合成
    const synthesisResponse = await axios.post(
      `${VOICEVOX_URL}/synthesis`,
      audioQuery,
      {
        params: { speaker },
        responseType: 'arraybuffer',
      }
    );

    // 音声データをBase64で返す
    const audioBase64 = Buffer.from(synthesisResponse.data).toString('base64');
    res.json({ audio: audioBase64 });

  } catch (error) {
    console.error('音声合成エラー:', error.message);
    res.status(500).json({ error: '音声合成に失敗しました' });
  }
});

// スピーカー一覧取得
app.get('/api/speakers', async (req, res) => {
  try {
    const response = await axios.get(`${VOICEVOX_URL}/speakers`);
    res.json(response.data);
  } catch (error) {
    console.error('スピーカー取得エラー:', error.message);
    res.status(500).json({ error: 'スピーカー情報の取得に失敗しました' });
  }
});

// ヘルスチェック
app.get('/api/health', async (req, res) => {
  try {
    await axios.get(`${VOICEVOX_URL}/version`);
    res.json({ status: 'ok', voicevox: 'connected' });
  } catch (error) {
    res.status(503).json({ status: 'error', voicevox: 'disconnected' });
  }
});

app.listen(PORT, () => {
  console.log(`VOICEVOXプロキシサーバーが起動しました: http://localhost:${PORT}`);
  console.log('VOICEVOXが http://localhost:50021 で起動していることを確認してください');
});