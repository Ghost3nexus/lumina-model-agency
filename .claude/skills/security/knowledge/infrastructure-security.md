# インフラストラクチャ・セキュリティ

## Docker セキュリティ

### Dockerfileベストプラクティス
```dockerfile
# Multi-stage build
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:22-alpine
# non-root user
RUN addgroup -g 1001 -S appgroup && \
    adduser -S appuser -u 1001 -G appgroup
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY . .

# ファイル権限
RUN chown -R appuser:appgroup /app
USER appuser

# ヘルスチェック
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3001/api/health || exit 1

EXPOSE 3001
CMD ["node", "src/index.js"]
```

### チェックリスト
- [x] `node:22-alpine`（軽量 + 攻撃面最小）
- [x] Multi-stage build（ビルドツールを本番に含めない）
- [x] non-root USER
- [x] HEALTHCHECK
- [x] `.dockerignore` で `.env`, `.secrets/`, `node_modules` 除外
- [ ] Trivy CI スキャン（GitHub Actions追加時）
- [ ] read-only rootfs（`--read-only` フラグ、tmpfs使用）

### イメージスキャン（ローカル）
```bash
# Trivy でスキャン
docker build -t tomorrowproof-bot .
trivy image tomorrowproof-bot --severity HIGH,CRITICAL
```

## Railway セキュリティ

### 環境変数管理
- すべてのシークレットはRailway Environment Variablesで管理
- ローカル`.env`とは別管理（同期しない）
- 変更時はデプロイ履歴で追跡可能

### ネットワーク
- Private Networking: サービス間通信は内部ネットワーク
- Public Domains: HTTPSのみ（Railway自動設定）
- Custom Domains: DNS設定でVercelと分離

### デプロイセキュリティ
- GitHub連携デプロイ（mainブランチのみ）
- ロールバック: Railway Dashboardから1クリック
- Deploy Logs: エラー・警告の定期チェック

### ヘルスチェック
```javascript
// /api/health エンドポイント（認証不要）
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    // 内部情報は含めない
  });
});
```

## Vercel セキュリティ

### セキュリティヘッダー（next.config.ts）
```typescript
async headers() {
  return [{
    source: '/:path*',
    headers: [
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'X-Frame-Options', value: 'DENY' },
      { key: 'X-XSS-Protection', value: '1; mode=block' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
      // CSP は動的コンテンツに応じて調整
      // { key: 'Content-Security-Policy', value: "default-src 'self'; ..." },
      { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
    ],
  }];
},
```

### Next.js 固有の注意点
- **CVE-2025-29927**: `x-middleware-subrequest` ヘッダーによるミドルウェアバイパス
  - Next.js 15.2.3+ で修正済み → バージョン確認必須
  - WAFルールで `x-middleware-subrequest` ヘッダーをブロック
- **Server Components**: 秘密情報をクライアントに渡さない
- **API Routes**: 認証チェックをルートごとに実施
- **dangerouslySetInnerHTML**: 必ずエスケープ済みHTMLのみ使用

### Vercel WAF / Firewall Rules
- Vercel Enterprise以外は基本WAFなし
- 代替: Cloudflare Free（DNS経由でWAF適用可能）

## Express API セキュリティ

### 推奨ミドルウェアスタック
```javascript
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { body, param, validationResult } = require('express-validator');

// 1. Helmet（セキュリティヘッダー一括設定）
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
    }
  },
  hsts: { maxAge: 63072000, includeSubDomains: true, preload: true }
}));

// 2. レート制限
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15分
  max: 100,                    // 100リクエスト/窓
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests' }
});
app.use('/api/', apiLimiter);

// 3. ボディサイズ制限
app.use(express.json({ limit: '1mb' }));

// 4. CORS（明示的オリジン、null拒否）
app.use(cors({
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
}));
```

### 認証パターン
```javascript
// Bearer Token（timing-safe比較）
const crypto = require('crypto');

function apiAuth(req, res, next) {
  if (req.path === '/api/health') return next();
  if (!API_TOKEN) return next(); // 開発モード

  const auth = req.headers.authorization || '';
  const provided = auth.replace('Bearer ', '');

  // タイミング攻撃防止
  const expected = Buffer.from(API_TOKEN);
  const received = Buffer.from(provided);
  if (expected.length !== received.length ||
      !crypto.timingSafeEqual(expected, received)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}
```

### 入力バリデーション例
```javascript
router.post('/journal',
  body('content').isString().trim().isLength({ min: 1, max: 50000 }),
  body('date').optional().isISO8601(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Invalid input' });
    }
    next();
  },
  journalController.create
);
```

## OAuth セキュリティ（freee / Google）

### トークン暗号化ストレージ
```javascript
const crypto = require('crypto');

const ENCRYPTION_KEY = process.env.TOKEN_ENCRYPTION_KEY; // 32bytes hex
const ALGORITHM = 'aes-256-gcm';

function encrypt(plaintext) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
  let encrypted = cipher.update(plaintext, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const tag = cipher.getAuthTag().toString('hex');
  return `${iv.toString('hex')}:${tag}:${encrypted}`;
}

function decrypt(ciphertext) {
  const [ivHex, tagHex, encrypted] = ciphertext.split(':');
  const decipher = crypto.createDecipheriv(
    ALGORITHM,
    Buffer.from(ENCRYPTION_KEY, 'hex'),
    Buffer.from(ivHex, 'hex')
  );
  decipher.setAuthTag(Buffer.from(tagHex, 'hex'));
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}
```

### PKCE実装（RFC 9700）
```javascript
function generatePKCE() {
  const verifier = crypto.randomBytes(32).toString('base64url');
  const challenge = crypto
    .createHash('sha256')
    .update(verifier)
    .digest('base64url');
  return { verifier, challenge };
}

// 認可リクエスト
const { verifier, challenge } = generatePKCE();
const authUrl = `${authEndpoint}?` +
  `client_id=${clientId}&` +
  `redirect_uri=${redirectUri}&` +
  `response_type=code&` +
  `code_challenge=${challenge}&` +
  `code_challenge_method=S256&` +
  `scope=${minimumScopes}`;
```

### トークンローテーション
- リフレッシュトークン使用時に新しいリフレッシュトークンを取得
- 古いトークンは即座に無効化
- ローテーション失敗時は再認証フローへリダイレクト

## 監視・ログ

### 構造化ログフォーマット
```javascript
function securityLog(event, details) {
  console.log(JSON.stringify({
    timestamp: new Date().toISOString(),
    level: 'SECURITY',
    event,
    ...details,
    // IPは保存しない（個人情報保護法）
  }));
}

// 使用例
securityLog('AUTH_FAILURE', { path: '/api/agents', reason: 'invalid_token' });
securityLog('RATE_LIMIT', { path: '/api/finance', userId: 'xxx' });
securityLog('INJECTION_DETECTED', { pattern: 'ignore_previous', channelId: 'yyy' });
```

### 外部監視（無料）
- **UptimeRobot** (Free): /api/health エンドポイント監視（5分間隔）
- **Railway Metrics**: CPU/メモリ/ネットワーク
- **Discord Webhook**: アラート通知先
