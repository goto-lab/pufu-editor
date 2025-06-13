import { ProjectInfo } from '../types';

export class ProjectAnalyzer {
  static analyzeAndComplete(partialInfo: Partial<ProjectInfo>): ProjectInfo {
    // 不足している情報を補完
    const completeInfo: ProjectInfo = {
      name: partialInfo.name || 'プロジェクト',
      period: partialInfo.period || {
        start: new Date(),
        end: new Date()
      },
      gainingGoal: partialInfo.gainingGoal || '',
      winCondition: partialInfo.winCondition || '',
      intermediatePurposes: partialInfo.intermediatePurposes || [],
      eightElements: partialInfo.eightElements || {
        people: '',
        money: '',
        time: '',
        quality: '',
        businessFlow: '',
        environment: '',
        rival: '',
        foreignEnemy: ''
      }
    };

    // 中間目的に施策が不足している場合は補完
    completeInfo.intermediatePurposes.forEach((purpose, index) => {
      if (purpose.measures.length === 0) {
        purpose.measures.push({
          id: `measure-${index}-1`,
          action: '詳細な施策の検討が必要',
          type: 'yellow',
          priority: 3
        });
      } else {
        // 既存の施策に色が設定されていない場合は自動的に色を割り当てる
        purpose.measures.forEach((measure, measureIndex) => {
          if (!measure.type) {
            measure.type = this.assignMeasureColor(measure, measureIndex, purpose.measures.length);
          }
        });
      }
    });

    return completeInfo;
  }

  // 施策に色を自動的に割り当てる
  private static assignMeasureColor(
    measure: any, 
    index: number, 
    totalMeasures: number
  ): 'white' | 'red' | 'green' | 'blue' | 'yellow' {
    // キーワードベースで色を判定
    const actionLower = measure.action.toLowerCase();
    
    // red: 目標達成のために当然取り組むべき主なアクション
    if (actionLower.includes('必須') || actionLower.includes('重要') || 
        actionLower.includes('基本') || actionLower.includes('主要')) {
      return 'red';
    }
    
    // green: 面倒でも、やらなければならないこと
    if (actionLower.includes('面倒') || actionLower.includes('手間') || 
        actionLower.includes('調整') || actionLower.includes('準備')) {
      return 'green';
    }
    
    // blue: 後々発生するかもしれない問題への予防策
    if (actionLower.includes('予防') || actionLower.includes('リスク') || 
        actionLower.includes('対策') || actionLower.includes('備え')) {
      return 'blue';
    }
    
    // yellow: 人、お金、時間等の資源に余裕があればやりたいこと
    if (actionLower.includes('余裕') || actionLower.includes('可能なら') || 
        actionLower.includes('理想') || actionLower.includes('追加')) {
      return 'yellow';
    }
    
    // デフォルトは順番で決める
    if (index === 0 && totalMeasures > 1) {
      return 'red'; // 最初の施策は主要なアクション
    } else if (index === totalMeasures - 1 && totalMeasures > 2) {
      return 'yellow'; // 最後の施策は余裕があればやること
    }
    
    return 'white'; // その他は標準的なアクション
  }

  static generateSummary(projectInfo: ProjectInfo): string {
    const summary = `
プロジェクト「${projectInfo.name}」の振り返り結果：

【基本情報】
- 期間: ${projectInfo.period.start.toLocaleDateString('ja-JP')} 〜 ${projectInfo.period.end.toLocaleDateString('ja-JP')}
- 獲得目標: ${projectInfo.gainingGoal}
- 勝利条件: ${projectInfo.winCondition}

【中間目的】
${projectInfo.intermediatePurposes.map((p, i) => 
  `${i + 1}. ${p.purpose}\n   施策: ${p.measures.map(m => m.action).join(', ')}`
).join('\n')}

【8要素の評価】
- ひと: ${projectInfo.eightElements.people}
- お金: ${projectInfo.eightElements.money}
- 時間: ${projectInfo.eightElements.time}
- クオリティ: ${projectInfo.eightElements.quality}
- 商流/座組: ${projectInfo.eightElements.businessFlow}
- 環境: ${projectInfo.eightElements.environment}
- ライバル: ${projectInfo.eightElements.rival}
- 外敵: ${projectInfo.eightElements.foreignEnemy}
    `.trim();

    return summary;
  }
}