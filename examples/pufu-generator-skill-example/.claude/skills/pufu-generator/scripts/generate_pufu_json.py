#!/usr/bin/env python3
"""
プ譜JSON生成スクリプト（pufu-editor準拠）

抽出されたサマリからプ譜エディタ互換のJSONを生成する
"""

import json
import sys
import uuid
import base64
import random
import string
from pathlib import Path
from datetime import datetime
from typing import Dict, List, Any, Optional


def generate_short_uuid() -> str:
    """pufu-editor形式の短縮UUIDを生成"""
    u = uuid.uuid4()
    b64 = base64.urlsafe_b64encode(u.bytes).decode('ascii')
    return b64.rstrip('=')


def create_comment(color: str = "blue", text: str = "") -> Dict[str, str]:
    """コメント構造を作成"""
    return {
        "color": color,
        "text": text
    }


def create_text_element(text: str = "", comment_color: str = "blue") -> Dict[str, Any]:
    """テキスト要素を作成"""
    return {
        "uuid": generate_short_uuid(),
        "text": text,
        "comment": create_comment(comment_color)
    }


def estimate_measure_color(text: str) -> str:
    """
    施策のテキストから色を推定
    
    色の意味:
    - white: 標準的なアクション
    - red: 目標達成のために当然取り組むべき主なアクション
    - green: 面倒でも、やらなければならないこと
    - blue: 後々発生するかもしれない問題への予防策
    - yellow: 資源に余裕があればやりたいこと
    """
    text_lower = text.lower()
    
    # red: 必須・最優先
    red_keywords = ['必須', '絶対', '最優先', '重要', '必ず', 'must', '核心', '本質', '基本']
    if any(kw in text_lower for kw in red_keywords):
        return "red"
    
    # green: 面倒だが必要
    green_keywords = ['調整', '折衝', '交渉', '承認', '申請', '手続き', '面倒', '複雑', '確認']
    if any(kw in text_lower for kw in green_keywords):
        return "green"
    
    # blue: リスク対策・予防
    blue_keywords = ['リスク', '予防', '備え', '対策', '障害', '問題', '保険', 'バックアップ', '冗長']
    if any(kw in text_lower for kw in blue_keywords):
        return "blue"
    
    # yellow: あれば良い
    yellow_keywords = ['余裕があれば', 'できれば', '追加', 'オプション', '将来', '発展', '拡張', 'nice to have']
    if any(kw in text_lower for kw in yellow_keywords):
        return "yellow"
    
    # デフォルトは white
    return "white"


def create_measure(text: str, color: Optional[str] = None) -> Dict[str, Any]:
    """施策要素を作成"""
    if color is None:
        color = estimate_measure_color(text)
    
    return {
        "uuid": generate_short_uuid(),
        "text": text,
        "comment": create_comment(),
        "color": color
    }


def create_purpose(text: str, measures: List[str]) -> Dict[str, Any]:
    """中間目的要素を作成（施策を含む）"""
    return {
        "uuid": generate_short_uuid(),
        "text": text,
        "comment": create_comment(),
        "measures": [create_measure(m) if isinstance(m, str) else m for m in measures]
    }


def create_empty_pufu() -> Dict[str, Any]:
    """空のプ譜構造を作成（pufu-editor準拠）"""
    return {
        "winCondition": create_text_element(),
        "gainingGoal": create_text_element(),
        "purposes": [],
        "elements": {
            "people": create_text_element(),
            "money": create_text_element(),
            "time": create_text_element(),
            "quality": create_text_element(),
            "businessScheme": create_text_element(),
            "environment": create_text_element(),
            "rival": create_text_element(),
            "foreignEnemy": create_text_element()
        }
    }


def generate_pufu_from_summary(summary_path: str, output_path: str) -> Dict[str, Any]:
    """
    サマリファイルからプ譜JSONを生成（pufu-editor準拠）
    
    サマリファイルの期待形式:
    {
        "gainingGoal": "獲得目標のテキスト",
        "winCondition": "勝利条件のテキスト",
        "purposes": [
            {
                "text": "中間目的1",
                "measures": ["施策1", "施策2"]
            }
        ],
        "elements": {
            "people": "...",
            "money": "...",
            ...
        }
    }
    """
    with open(summary_path, 'r', encoding='utf-8') as f:
        summary = json.load(f)
    
    pufu = create_empty_pufu()
    
    # 獲得目標
    gg = summary.get("gainingGoal", "")
    if isinstance(gg, str):
        pufu["gainingGoal"]["text"] = gg
    elif isinstance(gg, dict):
        pufu["gainingGoal"]["text"] = gg.get("text", "")
    
    # 勝利条件
    wc = summary.get("winCondition", "")
    if isinstance(wc, str):
        pufu["winCondition"]["text"] = wc
    elif isinstance(wc, dict):
        pufu["winCondition"]["text"] = wc.get("text", "")
    
    # 中間目的と施策
    purposes = summary.get("purposes", [])
    for p in purposes:
        if isinstance(p, str):
            # 文字列のみの場合は施策なしで追加
            pufu["purposes"].append(create_purpose(p, []))
        elif isinstance(p, dict):
            text = p.get("text", "")
            measures = p.get("measures", [])
            pufu["purposes"].append(create_purpose(text, measures))
    
    # 廟算八要素
    elements = summary.get("elements", {})
    element_keys = ["people", "money", "time", "quality", "businessScheme", "environment", "rival", "foreignEnemy"]
    
    # 古いキーからの変換マッピング
    key_mapping = {
        "businessStructure": "businessScheme",
        "rivals": "rival",
        "enemies": "foreignEnemy"
    }
    
    for key in element_keys:
        # 直接のキーまたはマッピングされたキーを確認
        value = elements.get(key, "")
        if not value:
            for old_key, new_key in key_mapping.items():
                if new_key == key and old_key in elements:
                    value = elements[old_key]
                    break
        
        if isinstance(value, list):
            pufu["elements"][key]["text"] = "、".join(str(v) for v in value)
        elif isinstance(value, str):
            pufu["elements"][key]["text"] = value
    
    # 出力
    output_path = Path(output_path)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(pufu, f, ensure_ascii=False, indent=2)
    
    print(f"プ譜JSON生成完了: {output_path}")
    return pufu


def display_pufu_summary(pufu: Dict[str, Any]) -> str:
    """プ譜のサマリを表示形式で出力"""
    lines = []
    lines.append("=" * 60)
    lines.append("プ譜サマリ")
    lines.append("=" * 60)
    lines.append("")
    
    lines.append(f"【獲得目標】")
    lines.append(f"  {pufu['gainingGoal']['text']}")
    lines.append("")
    
    lines.append(f"【勝利条件】")
    lines.append(f"  {pufu['winCondition']['text']}")
    lines.append("")
    
    lines.append(f"【中間目的】({len(pufu['purposes'])}件)")
    total_measures = 0
    color_counts = {"white": 0, "red": 0, "green": 0, "blue": 0, "yellow": 0}
    
    for i, purpose in enumerate(pufu['purposes'], 1):
        lines.append(f"  {i}. {purpose['text']}")
        for m in purpose['measures']:
            total_measures += 1
            color = m.get('color', 'white')
            color_counts[color] = color_counts.get(color, 0) + 1
            color_mark = {"white": "○", "red": "●", "green": "■", "blue": "◆", "yellow": "★"}.get(color, "○")
            lines.append(f"     {color_mark} {m['text']}")
    lines.append("")
    
    lines.append(f"【施策】({total_measures}件)")
    lines.append(f"  色別内訳:")
    lines.append(f"    ● red（必須）: {color_counts['red']}件")
    lines.append(f"    ○ white（標準）: {color_counts['white']}件")
    lines.append(f"    ■ green（要対応）: {color_counts['green']}件")
    lines.append(f"    ◆ blue（予防策）: {color_counts['blue']}件")
    lines.append(f"    ★ yellow（余裕時）: {color_counts['yellow']}件")
    lines.append("")
    
    lines.append("【廟算八要素】")
    element_labels = {
        "people": "ひと",
        "money": "お金",
        "time": "時間",
        "quality": "クオリティ",
        "businessScheme": "商流/座組",
        "environment": "環境",
        "rival": "ライバル",
        "foreignEnemy": "外敵"
    }
    for key, label in element_labels.items():
        value = pufu['elements'].get(key, {}).get('text', '')
        status = "✓" if value else "−"
        display_value = value[:50] + "..." if len(value) > 50 else value
        lines.append(f"  {status} {label}: {display_value}")
    lines.append("")
    
    lines.append("=" * 60)
    lines.append("プ譜エディタでインポート:")
    lines.append("  https://goto-lab.github.io/pufu-editor/")
    lines.append("=" * 60)
    
    return "\n".join(lines)


def create_sample_summary(output_path: str):
    """サンプルのサマリファイルを作成"""
    sample = {
        "gainingGoal": "新規ECサイトのローンチ",
        "winCondition": "月間売上1000万円を達成",
        "purposes": [
            {
                "text": "使いやすいUI/UXが実現されている",
                "measures": ["UIプロトタイプを作成する", "ユーザビリティテストを実施する"]
            },
            {
                "text": "決済システムが安定稼働している",
                "measures": ["決済代行サービスを導入する", "負荷テストを実施する"]
            },
            {
                "text": "既存顧客への認知が浸透している",
                "measures": ["既存顧客向けメール配信を行う", "初回購入キャンペーンを実施する"]
            }
        ],
        "elements": {
            "people": "開発チーム8名、マーケティング2名",
            "money": "開発予算2000万円、広告予算500万円",
            "time": "2025年1月〜6月（6ヶ月間）",
            "quality": "ページ読み込み2秒以内",
            "businessScheme": "自社ECモデル、外部決済代行利用",
            "environment": "EC市場拡大中、モバイル利用増加傾向",
            "rival": "大手ECモール（楽天、Amazon）、同業他社EC",
            "foreignEnemy": "開発リソース不足、レガシー基幹システム連携"
        }
    }
    
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(sample, f, ensure_ascii=False, indent=2)
    
    print(f"サンプルサマリ作成: {output_path}")


def main():
    """メイン処理"""
    if len(sys.argv) < 3:
        print("使用方法: python generate_pufu_json.py <サマリJSONパス> <出力パス>")
        print("例: python generate_pufu_json.py /home/claude/pufu_work/03_summary/summary.json /home/claude/pufu_work/04_output/pufu.json")
        print("")
        print("サンプルサマリを作成する場合:")
        print("  python generate_pufu_json.py --sample <出力パス>")
        sys.exit(1)
    
    if sys.argv[1] == "--sample":
        create_sample_summary(sys.argv[2])
        sys.exit(0)
    
    summary_path = sys.argv[1]
    output_path = sys.argv[2]
    
    if not Path(summary_path).exists():
        print(f"サマリファイルが見つかりません: {summary_path}")
        sys.exit(1)
    
    pufu = generate_pufu_from_summary(summary_path, output_path)
    
    print("\n")
    print(display_pufu_summary(pufu))


if __name__ == "__main__":
    main()
