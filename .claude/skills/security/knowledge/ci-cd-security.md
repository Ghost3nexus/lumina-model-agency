# CI/CD セキュリティパイプライン

## GitHub Actions 推奨ワークフロー

### 1. gitleaks — シークレット検出

```yaml
# .github/workflows/security.yml
name: Security Scan
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  gitleaks:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - uses: gitleaks/gitleaks-action@v2
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

#### pre-commit hook（ローカル）
```bash
# .git/hooks/pre-commit
#!/bin/sh
gitleaks detect --source . --verbose --redact --staged
```

### 2. npm audit — 依存脆弱性スキャン

```yaml
  npm-audit:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        dir: [discord-bot, dashboard]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '22'
      - run: cd ${{ matrix.dir }} && npm ci
      - run: cd ${{ matrix.dir }} && npm audit --audit-level=high
```

### 3. Semgrep — 静的解析（SAST）

```yaml
  semgrep:
    runs-on: ubuntu-latest
    container:
      image: semgrep/semgrep
    steps:
      - uses: actions/checkout@v4
      - run: semgrep scan --config=auto --error --json > semgrep-results.json
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: semgrep-results
          path: semgrep-results.json
```

**カスタムルール例（Express向け）**:
```yaml
# .semgrep/express-security.yml
rules:
  - id: no-raw-sql
    patterns:
      - pattern: db.query($SQL, ...)
      - pattern-not: db.query("...", [...])
    message: "Use parameterized queries"
    severity: ERROR
  - id: no-eval
    pattern: eval(...)
    message: "eval() is forbidden"
    severity: ERROR
```

### 4. Trivy — Dockerイメージスキャン

```yaml
  trivy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Build image
        run: docker build -t tomorrowproof-bot .
      - uses: aquasecurity/trivy-action@0.28.0
        with:
          image-ref: 'tomorrowproof-bot'
          format: 'sarif'
          output: 'trivy-results.sarif'
          severity: 'CRITICAL,HIGH'
      - uses: github/codeql-action/upload-sarif@v3
        if: always()
        with:
          sarif_file: 'trivy-results.sarif'
```

### 5. Dependabot — 自動依存更新

```yaml
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/discord-bot"
    schedule:
      interval: "weekly"
      day: "monday"
    open-pull-requests-limit: 5
    labels:
      - "dependencies"
      - "security"
    reviewers:
      - "Ghost3nexus"

  - package-ecosystem: "npm"
    directory: "/dashboard"
    schedule:
      interval: "weekly"
      day: "monday"
    open-pull-requests-limit: 5
    labels:
      - "dependencies"
      - "security"

  - package-ecosystem: "docker"
    directory: "/"
    schedule:
      interval: "weekly"
    labels:
      - "dependencies"
      - "docker"

  - package-ecosystem: "github-actions"
    directory: "/"
    schedule:
      interval: "weekly"
    labels:
      - "dependencies"
      - "ci"
```

## ブランチ保護ルール

GitHub Settings → Branches → main:
- Require pull request reviews (1人以上)
- Require status checks: gitleaks, npm-audit, semgrep
- Require branches to be up to date
- Do not allow bypassing settings

## シークレット管理

### 環境変数の階層
```
GitHub Secrets（CI/CD用）
  └── DISCORD_BOT_TOKEN
  └── API_SECRET_TOKEN
  └── ANTHROPIC_API_KEY

Railway Environment Variables（本番用）
  └── 同上 + FREEE_*, GOOGLE_* 等

.env（ローカル開発用）
  └── .gitignore で除外
  └── パーミッション 600
```

### ローテーションスケジュール
| シークレット | 頻度 | 方法 |
|-------------|------|------|
| API_SECRET_TOKEN | 90日 | 手動生成 → Railway更新 |
| DISCORD_BOT_TOKEN | 侵害時のみ | Discord Developer Portal |
| ANTHROPIC_API_KEY | 90日 | Anthropic Console |
| FREEE_CLIENT_SECRET | 年次 | freee Developer Portal |
| GOOGLE_* | 年次 | GCP Console |

## サプライチェーンセキュリティ

### lockfile integrity
- `npm ci`（CI/CDでは常にこちら、`npm install`禁止）
- `package-lock.json` をgit管理
- lockfile変更時はPRでレビュー

### SBOM生成（四半期）
```bash
npx @cyclonedx/cyclonedx-npm --output-file sbom.json
```

### npm publishの保護（将来パッケージ公開時）
- 2FA必須
- npm provenance（--provenance フラグ）
- `files` フィールドでpublish範囲を明示
