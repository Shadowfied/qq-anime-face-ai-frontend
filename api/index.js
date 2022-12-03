import express from 'express';
import fetch from 'node-fetch';
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.bodyParser({limit: '50mb'}));

app.post('/api/processanime', async (req, res) => {
  fetch(
    'https://ai.tu.qq.com/trpc.shadow_cv.ai_processor_cgi.AIProcessorCgi/Process',
    {
      headers: {
        'Content-type': 'application/json',
        Origin: 'https://h5.tu.qq.com',
        Referer: 'https://h5.tu.qq.com',
      },
      method: 'POST',
      body: JSON.stringify({
        busiId: 'ai_painting_anime_img_entry',
        extra: JSON.stringify({
          face_rects: [],
          version: 2,
          platform: 'web',
          data_report: {
            parent_trace_id: 'c26b66f0-caee-1a93-3713-67e585db33f7',
            root_channel: '',
            level: 0,
          },
        }),
        images: [req.body.image],
      }),
    }
  )
    .then((res) => {
      return res.json();
    })
    .then((body) => {
      try {
        return res.send(JSON.parse(body.extra));
      } catch {
        console.log(body)
        res.send(body);
      }
    })
});

export default app;