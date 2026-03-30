/**
 * 连通性自检：读取本机 OpenClaw auth-profiles 中的 xiaoming:default，
 * 调用小明中转 OpenAI 兼容 /v1/chat/completions（含一条最小 vision 消息）。
 * 不将密钥写入仓库。
 */
import { readFileSync } from 'fs';
import { join } from 'path';
import { homedir } from 'os';

/** 若 DNS 失败，请用购买文档里的真实 host 覆盖，例如：XIAOMING_OPENAI_BASE_URL=https://你的域名/v1 */
const BASE = (process.env.XIAOMING_OPENAI_BASE_URL || 'https://api.xiaoming-ai.com/v1').replace(/\/$/, '');
const MODEL = process.env.XIAOMING_MODEL || 'claude-3-5-sonnet-20241022';
const ONE_PX_PNG =
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';

function loadKey() {
  const p = join(homedir(), '.openclaw', 'agents', 'main', 'agent', 'auth-profiles.json');
  const j = JSON.parse(readFileSync(p, 'utf8'));
  const k = j?.profiles?.['xiaoming:default']?.key;
  if (!k) throw new Error('Missing xiaoming:default key in ' + p);
  return k;
}

async function main() {
  const apiKey = loadKey();
  const url = `${BASE}/chat/completions`;
  const body = {
    model: MODEL,
    max_tokens: 64,
    messages: [
      {
        role: 'user',
        content: [
          { type: 'text', text: 'Reply with exactly: OK_VISION if you can see an image.' },
          {
            type: 'image_url',
            image_url: { url: `data:image/png;base64,${ONE_PX_PNG}` },
          },
        ],
      },
    ],
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const text = await res.text();
  if (!res.ok) {
    console.error('HTTP', res.status, text.slice(0, 2000));
    process.exit(1);
  }
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    console.error('Non-JSON body:', text.slice(0, 500));
    process.exit(1);
  }
  const reply = data?.choices?.[0]?.message?.content ?? JSON.stringify(data).slice(0, 300);
  console.log('OK — model replied:', String(reply).slice(0, 500));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
