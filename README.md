# PR Size Label Action

A GitHub Action that automatically labels pull requests based on their size (additions + deletions).

## Features

- Automatically calculates PR size from additions and deletions
- Intelligently updates labels only when size category changes
- Supports size categories: XS, S, M, L, XL, XXL
- Works with any repository
- Prevents unnecessary label updates for better UX

## Size Categories

| Size | Lines Changed | Label |
|------|---------------|-------|
| 0-35 | Small changes | `size: XS` |
| 36-60 | Small changes | `size: S` |
| 61-120 | Medium changes | `size: M` |
| 121-240 | Large changes | `size: L` |
| 241-600 | Extra large changes | `size: XL` |
| 600+ | Very large changes | `size: XXL` |

## Usage

### Basic Usage

```yaml
name: PR Size Label
on:
  pull_request_target:
    types: [opened, synchronize]

permissions:
  pull-requests: write
  issues: write

jobs:
  size-label:
    runs-on: ubuntu-latest
    steps:
      - name: Label PR by size
        uses: conforma/pr-size-label-action@v1.0.0
```

### With Custom Token

```yaml
name: PR Size Label
on:
  pull_request_target:
    types: [opened, synchronize]

permissions:
  pull-requests: write
  issues: write

jobs:
  size-label:
    runs-on: ubuntu-latest
    steps:
      - name: Label PR by size
        uses: conforma/pr-size-label-action@v1.0.0
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
```

## Inputs

| Input | Description | Required | Default |
|-------|-------------|----------|---------|
| `token` | GitHub token for API access | Yes | `${{ github.token }}` |

## Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Build the action:
   ```bash
   npm run build
   ```

3. Test locally (you'll need to set up a test repository)

## License

Apache 2.0
