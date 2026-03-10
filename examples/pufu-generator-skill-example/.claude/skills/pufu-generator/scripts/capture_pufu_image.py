#!/usr/bin/env python3
"""
プ譜画像キャプチャスクリプト

Playwrightを使用してプ譜エディタのStorybookページを開き、
JSONデータをロードしてPNG画像を生成する。

必要なライブラリ:
  pip install playwright --break-system-packages
  playwright install chromium

使用方法:
  # ローカルStorybookを自動起動して画像生成
  python capture_pufu_image.py pufu.json output.png --project-dir /path/to/pufu-editor

  # 起動済みStorybookを使用
  python capture_pufu_image.py pufu.json output.png --storybook-url http://localhost:6006

  # GitHub Pagesのデモサイトを使用
  python capture_pufu_image.py pufu.json output.png --storybook-url https://goto-lab.github.io/pufu-editor
"""

import json
import sys
import subprocess
import time
from pathlib import Path
from typing import Optional


def is_port_in_use(port: int) -> bool:
    """指定ポートが使用中か確認"""
    import socket
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        return s.connect_ex(('localhost', port)) == 0


def start_storybook(project_dir: str, port: int = 6006) -> Optional[subprocess.Popen]:
    """Storybookの開発サーバーを起動（未起動の場合）"""
    if is_port_in_use(port):
        print(f'Storybookは既にポート{port}で起動中です')
        return None

    print(f'Storybookをポート{port}で起動中...')
    proc = subprocess.Popen(
        ['npx', 'storybook', 'dev', '-p', str(port), '--no-open'],
        cwd=project_dir,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
    )

    # Storybookの起動を待機（最大120秒）
    for _ in range(60):
        time.sleep(2)
        if is_port_in_use(port):
            print('Storybook起動完了')
            return proc

    proc.kill()
    raise RuntimeError('Storybookの起動がタイムアウトしました')


def capture_pufu_image(
    pufu_json_path: str,
    output_path: str,
    storybook_url: Optional[str] = None,
    project_dir: Optional[str] = None,
    width: int = 1200,
    dark: bool = False,
) -> str:
    """
    プ譜JSONから画像を生成する

    処理フロー:
    1. Storybookのiframe URLでExample1ストーリーを開く
    2. 「Import」ボタンをクリックしてインポートモーダルを開く
    3. テキストエリアにJSONを貼り付ける
    4. モーダルの「Import」ボタンでデータを反映
    5. #score-{key} 要素のスクリーンショットを取得

    Args:
        pufu_json_path: プ譜JSONファイルのパス
        output_path: 出力画像ファイルのパス（.png）
        storybook_url: StorybookのURL（指定しない場合はローカルサーバーを起動）
        project_dir: pufu-editorプロジェクトのルートディレクトリ
        width: ビューポートの幅
        dark: ダークモードで描画するか

    Returns:
        出力ファイルのパス
    """
    from playwright.sync_api import sync_playwright

    # JSONファイルの読み込み
    with open(pufu_json_path, 'r', encoding='utf-8') as f:
        pufu_data = json.load(f)

    pufu_json_str = json.dumps(pufu_data, ensure_ascii=False)

    # Storybookサーバーの準備
    storybook_proc = None
    port = 6006

    if storybook_url is None:
        if project_dir is None:
            # スクリプトの位置からプロジェクトルートを推定
            script_dir = Path(__file__).resolve().parent
            candidate = script_dir
            while candidate != candidate.parent:
                if (candidate / 'package.json').exists() and (candidate / '.storybook').exists():
                    project_dir = str(candidate)
                    break
                candidate = candidate.parent

            if project_dir is None:
                print('エラー: pufu-editorプロジェクトのルートが見つかりません')
                print('--project-dir または --storybook-url を指定してください')
                sys.exit(1)

        storybook_proc = start_storybook(project_dir, port)
        storybook_url = f'http://localhost:{port}'

    # Storybookのiframe URLでストーリーを直接表示
    iframe_url = f'{storybook_url}/iframe.html?id=pufu-editor-examples--example-1&viewMode=story'
    score_key = 'example1'

    try:
        with sync_playwright() as p:
            browser = p.chromium.launch()
            page = browser.new_page(viewport={'width': width, 'height': 800})

            print(f'ページを読み込み中: {iframe_url}')
            page.goto(iframe_url, wait_until='networkidle')

            # プ譜コンポーネントの描画完了を待機
            page.wait_for_selector(f'#score-{score_key}', timeout=30000)
            print('プ譜コンポーネントの描画完了')

            # ダークモード設定
            if dark:
                page.evaluate('() => document.documentElement.classList.add("dark")')

            # --- インポートモーダル経由でJSONデータをロード ---
            # ページ内にはツールバーボタンが複数あり、最初の「Import」ボタンがモーダルを開く
            print('データをインポート中...')

            # Importボタンをクリック（ツールバー上のボタン）
            toolbar_buttons = page.locator('button')
            import_opened = False
            for i in range(toolbar_buttons.count()):
                btn = toolbar_buttons.nth(i)
                text = btn.inner_text().strip()
                if text == 'Import':
                    btn.click()
                    import_opened = True
                    break

            if not import_opened:
                print('警告: Importボタンが見つかりません。デフォルトデータで画像生成します')
            else:
                # モーダルの表示を待機
                page.wait_for_selector('#modal-textarea', timeout=5000)

                # テキストエリアにJSONを入力
                textarea = page.locator('#modal-textarea')
                textarea.fill(pufu_json_str)
                page.wait_for_timeout(300)

                # モーダル内の「Import」ボタンをクリック（モーダル内のボタン群から選択）
                # モーダル内のボタンは「Import」と「Cancel」の2つ
                modal_buttons = page.locator('.absolute button')
                for i in range(modal_buttons.count()):
                    btn = modal_buttons.nth(i)
                    text = btn.inner_text().strip()
                    if text == 'Import':
                        btn.click()
                        break

                # データ反映の待機
                page.wait_for_timeout(1500)
                print('データのインポート完了')

            # --- スクリーンショット取得 ---
            score_element = page.locator(f'#score-{score_key}')

            output_file = Path(output_path)
            output_file.parent.mkdir(parents=True, exist_ok=True)

            # Playwrightのelement screenshotでPNG取得
            score_element.screenshot(path=str(output_file), type='png')
            print(f'画像生成完了: {output_file}')

            browser.close()
            return str(output_file)

    finally:
        if storybook_proc is not None:
            print('Storybookサーバーを停止中...')
            storybook_proc.terminate()
            try:
                storybook_proc.wait(timeout=10)
            except subprocess.TimeoutExpired:
                storybook_proc.kill()


def main():
    """メイン処理"""
    import argparse

    parser = argparse.ArgumentParser(
        description='プ譜JSONから画像（PNG）を生成するスクリプト（Playwright使用）'
    )
    parser.add_argument(
        'input',
        help='プ譜JSONファイルのパス'
    )
    parser.add_argument(
        'output',
        help='出力画像ファイルのパス（.png）'
    )
    parser.add_argument(
        '--storybook-url',
        default=None,
        help='StorybookのURL（例: http://localhost:6006）。未指定時はローカルで起動'
    )
    parser.add_argument(
        '--project-dir',
        default=None,
        help='pufu-editorプロジェクトのルートディレクトリ'
    )
    parser.add_argument(
        '--width',
        type=int,
        default=1200,
        help='ビューポートの幅（デフォルト: 1200）'
    )
    parser.add_argument(
        '--dark',
        action='store_true',
        help='ダークモードで描画'
    )

    args = parser.parse_args()

    if not Path(args.input).exists():
        print(f'エラー: 入力ファイルが見つかりません: {args.input}')
        sys.exit(1)

    capture_pufu_image(
        pufu_json_path=args.input,
        output_path=args.output,
        storybook_url=args.storybook_url,
        project_dir=args.project_dir,
        width=args.width,
        dark=args.dark,
    )


if __name__ == '__main__':
    main()
