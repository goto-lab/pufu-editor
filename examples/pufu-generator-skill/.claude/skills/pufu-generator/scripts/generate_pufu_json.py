#!/usr/bin/env python3
"""
プ譜JSON生成スクリプト（pufu-editor準拠）

抽出されたサマリからプ譜エディタ互換のJSONを生成する。
単一局面モードと複数局面モードに対応。
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


def create_text_element(text: str = "", comment_color: str = "blue", comment_text: str = "") -> Dict[str, Any]:
    """テキスト要素を作成"""
    return {
        "uuid": generate_short_uuid(),
        "text": text,
        "comment": create_comment(comment_color, comment_text)
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


def create_measure(text: str, color: Optional[str] = None, comment_color: str = "blue", comment_text: str = "") -> Dict[str, Any]:
    """施策要素を作成"""
    if color is None:
        color = estimate_measure_color(text)

    return {
        "uuid": generate_short_uuid(),
        "text": text,
        "comment": create_comment(comment_color, comment_text),
        "color": color
    }


def create_purpose(text: str, measures: List[Any], comment_color: str = "blue", comment_text: str = "") -> Dict[str, Any]:
    """中間目的要素を作成（施策を含む）"""
    processed_measures = []
    for m in measures:
        if isinstance(m, str):
            processed_measures.append(create_measure(m))
        elif isinstance(m, dict):
            processed_measures.append(create_measure(
                text=m.get("text", ""),
                color=m.get("color"),
                comment_color=m.get("comment_color", "blue"),
                comment_text=m.get("comment_text", "")
            ))
        else:
            processed_measures.append(m)

    return {
        "uuid": generate_short_uuid(),
        "text": text,
        "comment": create_comment(comment_color, comment_text),
        "measures": processed_measures
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


ELEMENT_KEYS = ["people", "money", "time", "quality", "businessScheme", "environment", "rival", "foreignEnemy"]

# 古いキーからの変換マッピング
KEY_MAPPING = {
    "businessStructure": "businessScheme",
    "rivals": "rival",
    "enemies": "foreignEnemy"
}


def populate_pufu_from_data(pufu: Dict[str, Any], data: Dict[str, Any]) -> None:
    """サマリデータからプ譜の各要素を設定する（共通処理）"""
    # 獲得目標
    gg = data.get("gainingGoal", "")
    if isinstance(gg, str):
        pufu["gainingGoal"]["text"] = gg
    elif isinstance(gg, dict):
        pufu["gainingGoal"]["text"] = gg.get("text", "")

    # 勝利条件
    wc = data.get("winCondition", "")
    if isinstance(wc, str):
        pufu["winCondition"]["text"] = wc
    elif isinstance(wc, dict):
        pufu["winCondition"]["text"] = wc.get("text", "")

    # 中間目的と施策
    purposes = data.get("purposes", [])
    for p in purposes:
        if isinstance(p, str):
            pufu["purposes"].append(create_purpose(p, []))
        elif isinstance(p, dict):
            text = p.get("text", "")
            measures = p.get("measures", [])
            comment_color = p.get("comment_color", "blue")
            comment_text = p.get("comment_text", "")
            pufu["purposes"].append(create_purpose(text, measures, comment_color, comment_text))

    # 廟算八要素
    elements = data.get("elements", {})
    for key in ELEMENT_KEYS:
        value = elements.get(key, "")
        if not value:
            for old_key, new_key in KEY_MAPPING.items():
                if new_key == key and old_key in elements:
                    value = elements[old_key]
                    break

        if isinstance(value, list):
            pufu["elements"][key]["text"] = "、".join(str(v) for v in value)
        elif isinstance(value, str):
            pufu["elements"][key]["text"] = value
        elif isinstance(value, dict):
            pufu["elements"][key]["text"] = value.get("text", "")
            if value.get("comment_color"):
                pufu["elements"][key]["comment"]["color"] = value["comment_color"]
            if value.get("comment_text"):
                pufu["elements"][key]["comment"]["text"] = value["comment_text"]


def apply_retrospective(pufu: Dict[str, Any], phase: Dict[str, Any]) -> None:
    """振り返り局面のプ譜にコメント・色の変更を適用"""
    retro = phase.get("retrospective", {})
    if not retro:
        return

    # 勝利条件の達成度をコメントに記録
    wc_achievement = retro.get("winCondition_achievement", "")
    if wc_achievement:
        pufu["winCondition"]["comment"]["text"] = wc_achievement
        # 達成なら green、未達なら red
        achieved_keywords = ['達成', '成功', '完了', '実現', 'クリア']
        is_achieved = any(kw in wc_achievement for kw in achieved_keywords)
        pufu["winCondition"]["comment"]["color"] = "green" if is_achieved else "red"

    # 獲得目標のコメント
    gg_comment = retro.get("gainingGoal_comment", "")
    if gg_comment:
        pufu["gainingGoal"]["comment"]["text"] = gg_comment

    # 各中間目的の達成状況をコメントに反映
    purpose_results = retro.get("purpose_results", [])
    for i, result in enumerate(purpose_results):
        if i >= len(pufu["purposes"]):
            break

        if result.get("comment"):
            pufu["purposes"][i]["comment"]["text"] = result["comment"]
        if result.get("status"):
            pufu["purposes"][i]["comment"]["color"] = result["status"]

        # 施策の色を実績に基づいて更新
        measure_results = result.get("measure_results", [])
        for j, mr in enumerate(measure_results):
            if j >= len(pufu["purposes"][i]["measures"]):
                break
            if mr.get("actual_color"):
                pufu["purposes"][i]["measures"][j]["color"] = mr["actual_color"]
            if mr.get("comment"):
                pufu["purposes"][i]["measures"][j]["comment"]["text"] = mr["comment"]
            if mr.get("comment_color"):
                pufu["purposes"][i]["measures"][j]["comment"]["color"] = mr["comment_color"]

    # 廟算八要素の振り返りコメント
    element_results = retro.get("element_results", {})
    for key in ELEMENT_KEYS:
        er = element_results.get(key, {})
        if er.get("comment"):
            pufu["elements"][key]["comment"]["text"] = er["comment"]
        if er.get("comment_color"):
            pufu["elements"][key]["comment"]["color"] = er["comment_color"]


def generate_pufu_from_summary(summary_path: str, output_path: str) -> Dict[str, Any]:
    """
    サマリファイルからプ譜JSONを生成（pufu-editor準拠・単一局面モード）

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
    populate_pufu_from_data(pufu, summary)

    # 出力
    output_path = Path(output_path)
    output_path.parent.mkdir(parents=True, exist_ok=True)

    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(pufu, f, ensure_ascii=False, indent=2)

    print(f"プ譜JSON生成完了: {output_path}")
    return pufu


def generate_multi_phase_pufu(summary_path: str, output_path: str) -> Dict[str, Any]:
    """
    複数局面のプ譜JSONを生成（ProjectScoreMap形式）

    サマリファイルの期待形式:
    {
        "phases": [
            {
                "number": 1,
                "type": "plan",
                "label": "第1局面：企画・準備",
                "gainingGoal": "...",
                "winCondition": "...",
                "purposes": [...],
                "elements": {...}
            },
            {
                "number": 2,
                "type": "retrospective",
                "label": "第1局面：振り返り",
                "gainingGoal": "...",
                "winCondition": "...",
                "purposes": [...],
                "elements": {...},
                "retrospective": {
                    "winCondition_achievement": "達成度の評価テキスト",
                    "gainingGoal_comment": "目標に対するコメント",
                    "purpose_results": [
                        {
                            "comment": "振り返りコメント",
                            "status": "green",
                            "measure_results": [
                                {"actual_color": "red", "comment": "実績コメント", "comment_color": "green"}
                            ]
                        }
                    ],
                    "element_results": {
                        "people": {"comment": "実際の状況", "comment_color": "blue"},
                        ...
                    }
                }
            }
        ]
    }
    """
    with open(summary_path, 'r', encoding='utf-8') as f:
        summary = json.load(f)

    phases = summary.get("phases", [])

    # 局面がない場合は従来の単一プ譜生成にフォールバック
    if not phases:
        print("局面データが見つかりません。単一局面モードで生成します。")
        pufu = generate_pufu_from_summary(summary_path, output_path)
        return {"phase1": pufu}

    result = {}
    output_dir = Path(output_path).parent
    output_dir.mkdir(parents=True, exist_ok=True)

    for phase in phases:
        phase_num = phase["number"]
        phase_type = phase.get("type", "plan")
        phase_label = phase.get("label", f"局面{phase_num}")
        key = f"phase{phase_num}"

        pufu = create_empty_pufu()
        populate_pufu_from_data(pufu, phase)

        # 振り返り局面の場合、コメントに振り返り情報を反映
        if phase_type == "retrospective":
            apply_retrospective(pufu, phase)

        result[key] = pufu

        # 個別局面のJSONも出力
        phase_output_path = output_dir / f"pufu_phase{phase_num}.json"
        with open(phase_output_path, 'w', encoding='utf-8') as f:
            json.dump(pufu, f, ensure_ascii=False, indent=2)
        print(f"局面{phase_num}（{phase_label}）JSON生成完了: {phase_output_path}")

    # 統合JSONを出力（ProjectScoreMap形式）
    output_path = Path(output_path)
    output_path.parent.mkdir(parents=True, exist_ok=True)

    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(result, f, ensure_ascii=False, indent=2)

    print(f"\n複数局面プ譜JSON生成完了（{len(phases)}局面）: {output_path}")
    return result


def display_pufu_summary(pufu: Dict[str, Any]) -> str:
    """プ譜のサマリを表示形式で出力（単一局面）"""
    lines = []
    lines.append("=" * 60)
    lines.append("プ譜サマリ")
    lines.append("=" * 60)
    lines.append("")

    lines.append("【獲得目標】")
    lines.append(f"  {pufu['gainingGoal']['text']}")
    lines.append("")

    lines.append("【勝利条件】")
    lines.append(f"  {pufu['winCondition']['text']}")
    lines.append("")

    lines.append(f"【中間目的】({len(pufu['purposes'])}件)")
    total_measures = 0
    color_counts = {"white": 0, "red": 0, "green": 0, "blue": 0, "yellow": 0}

    for i, purpose in enumerate(pufu['purposes'], 1):
        lines.append(f"  {i}. {purpose['text']}")
        comment = purpose.get('comment', {})
        if comment.get('text'):
            lines.append(f"     → {comment['text']}")
        for m in purpose['measures']:
            total_measures += 1
            color = m.get('color', 'white')
            color_counts[color] = color_counts.get(color, 0) + 1
            color_mark = {"white": "○", "red": "●", "green": "■", "blue": "◆", "yellow": "★"}.get(color, "○")
            lines.append(f"     {color_mark} {m['text']}")
            m_comment = m.get('comment', {})
            if m_comment.get('text'):
                lines.append(f"       → {m_comment['text']}")
    lines.append("")

    lines.append(f"【施策】({total_measures}件)")
    lines.append("  色別内訳:")
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
        el_comment = pufu['elements'].get(key, {}).get('comment', {})
        if el_comment.get('text'):
            lines.append(f"    → {el_comment['text']}")
    lines.append("")

    lines.append("=" * 60)
    lines.append("プ譜エディタでインポート:")
    lines.append("  https://goto-lab.github.io/pufu-editor/")
    lines.append("=" * 60)

    return "\n".join(lines)


def display_multi_phase_summary(result: Dict[str, Any]) -> str:
    """複数局面プ譜のサマリを表示形式で出力"""
    lines = []
    lines.append("=" * 60)
    lines.append("複数局面プ譜サマリ")
    lines.append("=" * 60)
    lines.append("")

    # 局面一覧
    phase_keys = sorted(result.keys(), key=lambda k: int(k.replace("phase", "")))
    lines.append(f"【局面数】{len(phase_keys)}局面")
    lines.append("")

    for key in phase_keys:
        phase_num = int(key.replace("phase", ""))
        phase_type = "振り返り" if phase_num % 2 == 0 else "計画"
        pufu = result[key]

        lines.append("-" * 60)
        lines.append(f"■ {key}（{phase_type}局面）")
        lines.append("-" * 60)

        lines.append(f"  獲得目標: {pufu['gainingGoal']['text']}")
        wc_comment = pufu['winCondition'].get('comment', {})
        lines.append(f"  勝利条件: {pufu['winCondition']['text']}")
        if wc_comment.get('text'):
            color_mark = {"green": "✓", "red": "✗", "blue": "ℹ"}.get(wc_comment.get('color', ''), '')
            lines.append(f"    {color_mark} {wc_comment['text']}")

        # 中間目的と施策の集計
        total_measures = 0
        comment_counts = {"green": 0, "red": 0, "blue": 0}
        for purpose in pufu['purposes']:
            for m in purpose['measures']:
                total_measures += 1
                m_comment = m.get('comment', {})
                if m_comment.get('text'):
                    c = m_comment.get('color', 'blue')
                    comment_counts[c] = comment_counts.get(c, 0) + 1

        lines.append(f"  中間目的: {len(pufu['purposes'])}件")
        lines.append(f"  施策: {total_measures}件")

        # 振り返り局面ではコメントの集計を表示
        if phase_type == "振り返り":
            if any(comment_counts.values()):
                lines.append(f"  振り返りコメント:")
                if comment_counts["green"]:
                    lines.append(f"    ✓ 達成: {comment_counts['green']}件")
                if comment_counts["red"]:
                    lines.append(f"    ✗ 未達: {comment_counts['red']}件")
                if comment_counts["blue"]:
                    lines.append(f"    ℹ 情報: {comment_counts['blue']}件")

        lines.append("")

    lines.append("=" * 60)
    lines.append("プ譜エディタでインポート:")
    lines.append("  https://goto-lab.github.io/pufu-editor/")
    lines.append("（ProjectScoreMap形式のJSONをそのままインポート可能）")
    lines.append("=" * 60)

    return "\n".join(lines)


def create_sample_summary(output_path: str):
    """サンプルのサマリファイルを作成（単一局面）"""
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


def create_sample_multi_phase_summary(output_path: str):
    """サンプルの複数局面サマリファイルを作成"""
    sample = {
        "phases": [
            {
                "number": 1,
                "type": "plan",
                "label": "第1局面：企画・要件定義",
                "gainingGoal": "新規ECサイトの要件定義完了",
                "winCondition": "ステークホルダー全員が要件に合意",
                "purposes": [
                    {
                        "text": "ビジネス要件が明確になっている",
                        "measures": ["市場調査を実施する", "競合分析を行う"]
                    },
                    {
                        "text": "技術要件が確定している",
                        "measures": ["技術スタックを選定する", "アーキテクチャ設計を完了する"]
                    }
                ],
                "elements": {
                    "people": "PM1名、エンジニア3名、デザイナー1名",
                    "money": "企画予算300万円",
                    "time": "2025年1月〜2月（2ヶ月間）",
                    "quality": "要件定義書の網羅性90%以上",
                    "businessScheme": "自社開発、一部外部コンサル活用",
                    "environment": "EC市場拡大中",
                    "rival": "大手ECモール",
                    "foreignEnemy": "社内調整の遅れリスク"
                }
            },
            {
                "number": 2,
                "type": "retrospective",
                "label": "第1局面：振り返り",
                "gainingGoal": "新規ECサイトの要件定義完了",
                "winCondition": "ステークホルダー全員が要件に合意",
                "purposes": [
                    {
                        "text": "ビジネス要件が明確になっている",
                        "measures": ["市場調査を実施する", "競合分析を行う"]
                    },
                    {
                        "text": "技術要件が確定している",
                        "measures": ["技術スタックを選定する", "アーキテクチャ設計を完了する"]
                    }
                ],
                "elements": {
                    "people": "PM1名、エンジニア3名、デザイナー1名",
                    "money": "企画予算300万円（実績250万円）",
                    "time": "2025年1月〜2月（2ヶ月間、予定通り）",
                    "quality": "要件定義書の網羅性95%達成",
                    "businessScheme": "自社開発、一部外部コンサル活用",
                    "environment": "EC市場拡大中",
                    "rival": "大手ECモール",
                    "foreignEnemy": "社内調整に1週間の遅れあり"
                },
                "retrospective": {
                    "winCondition_achievement": "合意は達成したが、一部要件の優先度について再調整が必要",
                    "gainingGoal_comment": "要件定義は概ね完了。追加要件が2件発生",
                    "purpose_results": [
                        {
                            "comment": "ビジネス要件は明確になった",
                            "status": "green",
                            "measure_results": [
                                {"actual_color": "red", "comment": "市場調査完了、有益な知見を獲得", "comment_color": "green"},
                                {"actual_color": "red", "comment": "競合3社の詳細分析完了", "comment_color": "green"}
                            ]
                        },
                        {
                            "comment": "技術要件は概ね確定したが、インフラ部分に未確定事項あり",
                            "status": "red",
                            "measure_results": [
                                {"actual_color": "red", "comment": "React + Next.jsに決定", "comment_color": "green"},
                                {"actual_color": "yellow", "comment": "インフラ設計は次局面に持ち越し", "comment_color": "red"}
                            ]
                        }
                    ],
                    "element_results": {
                        "people": {"comment": "デザイナーが途中参加で立ち上がりに時間を要した", "comment_color": "red"},
                        "money": {"comment": "予算内で収まった（250万/300万）", "comment_color": "green"},
                        "time": {"comment": "予定通り完了", "comment_color": "green"}
                    }
                }
            },
            {
                "number": 3,
                "type": "plan",
                "label": "第2局面：設計・開発",
                "gainingGoal": "ECサイトのα版リリース",
                "winCondition": "主要機能が動作し、内部テストをパス",
                "purposes": [
                    {
                        "text": "主要画面のUI実装が完了している",
                        "measures": ["フロントエンド開発を行う", "デザインシステムを構築する"]
                    },
                    {
                        "text": "バックエンドAPIが稼働している",
                        "measures": ["API設計・実装を行う", "データベース設計を完了する"]
                    },
                    {
                        "text": "決済機能の基本実装が完了している",
                        "measures": ["決済代行サービスとの連携を実装する"]
                    }
                ],
                "elements": {
                    "people": "PM1名、エンジニア5名（2名追加）、デザイナー1名",
                    "money": "開発予算1000万円",
                    "time": "2025年3月〜5月（3ヶ月間）",
                    "quality": "単体テストカバレッジ80%以上",
                    "businessScheme": "自社開発",
                    "environment": "EC市場拡大中",
                    "rival": "競合他社がリニューアル予定",
                    "foreignEnemy": "インフラ設計の未確定事項（前局面からの持ち越し）"
                }
            },
            {
                "number": 4,
                "type": "retrospective",
                "label": "第2局面：振り返り",
                "gainingGoal": "ECサイトのα版リリース",
                "winCondition": "主要機能が動作し、内部テストをパス",
                "purposes": [
                    {
                        "text": "主要画面のUI実装が完了している",
                        "measures": ["フロントエンド開発を行う", "デザインシステムを構築する"]
                    },
                    {
                        "text": "バックエンドAPIが稼働している",
                        "measures": ["API設計・実装を行う", "データベース設計を完了する"]
                    },
                    {
                        "text": "決済機能の基本実装が完了している",
                        "measures": ["決済代行サービスとの連携を実装する"]
                    }
                ],
                "elements": {
                    "people": "PM1名、エンジニア5名、デザイナー1名",
                    "money": "開発予算1000万円（実績950万円）",
                    "time": "2025年3月〜5月（3ヶ月間、2週間遅延）",
                    "quality": "単体テストカバレッジ85%達成",
                    "businessScheme": "自社開発",
                    "environment": "EC市場拡大中",
                    "rival": "競合他社リニューアル発表",
                    "foreignEnemy": "インフラ移行で想定外の工数発生"
                },
                "retrospective": {
                    "winCondition_achievement": "主要機能は動作するが、決済機能のテストが一部未完了で2週間遅延",
                    "purpose_results": [
                        {
                            "comment": "UI実装は完了、ユーザーテストでも好評",
                            "status": "green",
                            "measure_results": [
                                {"actual_color": "red", "comment": "予定通り完了", "comment_color": "green"},
                                {"actual_color": "red", "comment": "デザインシステム構築完了、再利用性が高い", "comment_color": "green"}
                            ]
                        },
                        {
                            "comment": "APIは稼働しているが、パフォーマンス改善が必要",
                            "status": "red",
                            "measure_results": [
                                {"actual_color": "red", "comment": "実装完了、一部パフォーマンス課題あり", "comment_color": "red"},
                                {"actual_color": "red", "comment": "DB設計完了", "comment_color": "green"}
                            ]
                        },
                        {
                            "comment": "基本実装は完了したが、テストが未完了",
                            "status": "red",
                            "measure_results": [
                                {"actual_color": "yellow", "comment": "連携実装完了、テスト環境構築が遅延", "comment_color": "red"}
                            ]
                        }
                    ]
                }
            }
        ]
    }

    output_path_obj = Path(output_path)
    output_path_obj.parent.mkdir(parents=True, exist_ok=True)

    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(sample, f, ensure_ascii=False, indent=2)

    print(f"サンプル複数局面サマリ作成: {output_path}")


def main():
    """メイン処理"""
    if len(sys.argv) < 3:
        print("使用方法:")
        print("  単一局面: python generate_pufu_json.py <サマリJSONパス> <出力パス>")
        print("  複数局面: python generate_pufu_json.py <サマリJSONパス> <出力パス> --multi-phase")
        print("")
        print("例:")
        print("  python generate_pufu_json.py summary.json pufu.json")
        print("  python generate_pufu_json.py multi_phase_summary.json pufu_all_phases.json --multi-phase")
        print("")
        print("サンプルサマリを作成する場合:")
        print("  python generate_pufu_json.py --sample <出力パス>")
        print("  python generate_pufu_json.py --sample-multi-phase <出力パス>")
        sys.exit(1)

    if sys.argv[1] == "--sample":
        create_sample_summary(sys.argv[2])
        sys.exit(0)

    if sys.argv[1] == "--sample-multi-phase":
        create_sample_multi_phase_summary(sys.argv[2])
        sys.exit(0)

    summary_path = sys.argv[1]
    output_path = sys.argv[2]
    multi_phase = "--multi-phase" in sys.argv

    if not Path(summary_path).exists():
        print(f"サマリファイルが見つかりません: {summary_path}")
        sys.exit(1)

    if multi_phase:
        result = generate_multi_phase_pufu(summary_path, output_path)
        print("\n")
        print(display_multi_phase_summary(result))
    else:
        pufu = generate_pufu_from_summary(summary_path, output_path)
        print("\n")
        print(display_pufu_summary(pufu))


if __name__ == "__main__":
    main()
