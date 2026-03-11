#!/usr/bin/env python3
"""
プ譜画像キャプチャスクリプト

Playwrightを使用してプ譜エディタのStorybookページを開き、
JSONデータをロードしてPNG画像を生成する。
単一局面モードと複数局面モードに対応。

必要なライブラリ:
  pip install playwright --break-system-packages
  playwright install chromium

使用方法:
  # 単一局面（従来）
  python capture_pufu_image.py pufu.json output.png --storybook-url http://localhost:6006

  # 複数局面（局面ごとに画像生成）
  python capture_pufu_image.py pufu_all_phases.json output.png --storybook-url http://localhost:6006 --multi-phase

  # GitHub Pagesのデモサイトを使用
  python capture_pufu_image.py pufu.json output.png --storybook-url https://goto-lab.github.io/pufu-editor
"""

import json
import sys
import subprocess
import time
from pathlib import Path
from typing import Optional, Dict, Any, List


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


def import_and_capture(page, pufu_json_str: str, score_key: str, output_file: Path) -> str:
    """プ譜JSONをインポートしてスクリーンショットを取得する共通処理"""
    # --- インポートモーダル経由でJSONデータをロード ---
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

        # モーダル内の「Import」ボタンをクリック
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

    output_file.parent.mkdir(parents=True, exist_ok=True)

    # Playwrightのelement screenshotでPNG取得
    score_element.screenshot(path=str(output_file), type='png')
    print(f'画像生成完了: {output_file}')

    return str(output_file)


def capture_pufu_image(
    pufu_json_path: str,
    output_path: str,
    storybook_url: Optional[str] = None,
    project_dir: Optional[str] = None,
    width: int = 1200,
    dark: bool = False,
) -> str:
    """
    プ譜JSONから画像を生成する（単一局面モード）

    Args:
        pufu_json_path: プ譜JSONファイルのパス
        output_path: 出力画像ファイルのパス（.png）
        storybook_url: StorybookのURL
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
    storybook_url, storybook_proc = _prepare_storybook(storybook_url, project_dir)

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

            output_file = Path(output_path)
            result = import_and_capture(page, pufu_json_str, score_key, output_file)

            browser.close()
            return result

    finally:
        _cleanup_storybook(storybook_proc)


def capture_multi_phase_images(
    pufu_json_path: str,
    output_path: str,
    storybook_url: Optional[str] = None,
    project_dir: Optional[str] = None,
    width: int = 1200,
    dark: bool = False,
) -> List[str]:
    """
    複数局面プ譜JSONから局面ごとの画像を生成する

    ProjectScoreMap形式のJSONを読み込み、各局面を個別にインポートして
    スクリーンショットを取得する。

    Args:
        pufu_json_path: 複数局面プ譜JSONファイルのパス（ProjectScoreMap形式）
        output_path: 出力画像ファイルのベースパス（.png）
        storybook_url: StorybookのURL
        project_dir: pufu-editorプロジェクトのルートディレクトリ
        width: ビューポートの幅
        dark: ダークモードで描画するか

    Returns:
        生成された画像ファイルパスのリスト
    """
    from playwright.sync_api import sync_playwright

    # JSONファイルの読み込み
    with open(pufu_json_path, 'r', encoding='utf-8') as f:
        pufu_map = json.load(f)

    # 局面キーをソート
    phase_keys = sorted(pufu_map.keys(), key=lambda k: int(k.replace("phase", "")))

    if not phase_keys:
        print('エラー: 局面データが見つかりません')
        sys.exit(1)

    print(f'複数局面モード: {len(phase_keys)}局面の画像を生成します')

    # Storybookサーバーの準備
    storybook_proc = None
    storybook_url, storybook_proc = _prepare_storybook(storybook_url, project_dir)

    iframe_url = f'{storybook_url}/iframe.html?id=pufu-editor-examples--example-1&viewMode=story'
    score_key = 'example1'
    output_base = Path(output_path)
    output_dir = output_base.parent
    output_stem = output_base.stem

    generated_files = []

    try:
        with sync_playwright() as p:
            browser = p.chromium.launch()
            page = browser.new_page(viewport={'width': width, 'height': 800})

            for phase_key in phase_keys:
                phase_num = int(phase_key.replace("phase", ""))
                phase_data = pufu_map[phase_key]
                phase_json_str = json.dumps(phase_data, ensure_ascii=False)

                print(f'\n--- 局面{phase_num} ({phase_key}) の画像生成 ---')

                # ページをリロードして初期状態に戻す
                page.goto(iframe_url, wait_until='networkidle')
                page.wait_for_selector(f'#score-{score_key}', timeout=30000)

                if dark:
                    page.evaluate('() => document.documentElement.classList.add("dark")')

                # 局面ごとの出力ファイルパス
                phase_output = output_dir / f'{output_stem}_phase{phase_num}.png'
                result = import_and_capture(page, phase_json_str, score_key, phase_output)
                generated_files.append(result)

            browser.close()

    finally:
        _cleanup_storybook(storybook_proc)

    print(f'\n全{len(generated_files)}局面の画像生成完了')
    return generated_files


def _prepare_storybook(storybook_url: Optional[str], project_dir: Optional[str]):
    """Storybookサーバーの準備（共通処理）"""
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

    return storybook_url, storybook_proc


def _cleanup_storybook(storybook_proc: Optional[subprocess.Popen]) -> None:
    """Storybookプロセスのクリーンアップ（共通処理）"""
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
    parser.add_argument(
        '--multi-phase',
        action='store_true',
        help='複数局面モード：ProjectScoreMap形式のJSONから局面ごとに画像を生成'
    )

    args = parser.parse_args()

    if not Path(args.input).exists():
        print(f'エラー: 入力ファイルが見つかりません: {args.input}')
        sys.exit(1)

    if args.multi_phase:
        capture_multi_phase_images(
            pufu_json_path=args.input,
            output_path=args.output,
            storybook_url=args.storybook_url,
            project_dir=args.project_dir,
            width=args.width,
            dark=args.dark,
        )
    else:
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
