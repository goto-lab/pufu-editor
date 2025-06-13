import { DialoguePhase, DialogueMessage, ProjectInfo } from "../types";
import { OpenAIService } from "./OpenAIService";

interface ScenarioStep {
  id: number;
  loading?: boolean;
  message: string;
  nextId?: number | null;
  type: "notice" | "talk" | "question" | "generate";
}

export class DialogueService {
  private static instance: DialogueService;
  private currentStepId = 1;
  private userResponses: { [stepId: number]: string } = {};
  private messageIdCounter = 0;
  private generatedProjectInfo: Partial<ProjectInfo> = {};

  private scenario: ScenarioStep[] = [
    {
      id: 1,
      message:
        "「外敵」の要素について教えてください。（目的を積極的に邪魔するヒトやコト）",
      nextId: 2,
      type: "question",
    },
    {
      id: 2,
      message: "回答ありがとうございます。プ譜の作成をはじめます。",
      nextId: 3,
      type: "generate",
    },
    {
      id: 3,
      loading: false,
      message:
        "生成されたプ譜はいかがでしたか？\n是非、<a href='https://forms.gle/LkjFdN8Kekfzivk2A' target='_blank'>問い合わせフォーム</a>からご意見をお聞かせください。\nまた、以下のようなご相談がある方は、 お問い合わせをお待ちしております。\n・自社用にカスタマイズしたい\n・自社のシステムと連携したい\n・自社の製品やメディアにバンドルしたい",
      nextId: null,
      type: "notice",
    },
    /*
    {
      id: 1,
      loading: false,
      message:
        "ようこそ、私はプ譜AIアシスタントです。\nプロジェクトの振り返りサポートさせていただきます。",
      nextId: 2,
      type: "notice",
    },
    {
      id: 2,
      loading: false,
      message:
        "あなたが取り組まれてたプロジェクトについてお伺いし、プ譜を作成します。 \n以下の質問にお答えください。",
      nextId: 3,
      type: "notice",
    },
    {
      id: 3,
      loading: true,
      message:
        "**1. 問い（プロジェクトの出発点）**\n・どのようなプロジェクトを始めましたか？\n・プロジェクトに取り組もうとしたきっかけや背景となる思い、解決しようとした課題は何でしたか？\n・当初の思いや課題は、プロジェクトを通してどのように変化しましたか？",
      nextId: 4,
      type: "talk",
    },
    {
      id: 4,
      loading: true,
      message:
        "**2. 仮説（取り組みの方向性)**\n・最初に「こうすればうまく進められるのでは？」といった仮説や方向性はありますか？\n・なぜその仮説や方向性を選んびましたか？\n・仮説は途中で変化しましたか？それはどのような出来事がきっかけでしたか？",
      nextId: 5,
      type: "talk",
    },
    {
      id: 5,
      loading: true,
      message:
        "**3. 実験（実際にやってみたこと）**\n・具体的にどんな「施策」「行動」をしましたか？\n・手応えを感じた施策や行動はありますか？\n・リスクを取ったチャレンジはありましたか？\n・想定外の出来事や、偶然うまくいったことはありましたか？",
      nextId: 6,
      type: "talk",
    },
    {
      id: 6,
      loading: true,
      message:
        "**4. 観察（起きたこと・気づいたこと）**\n・プロジェクトに取り組んだ結果、どんな反応が返ってきましたか？\n・自分たちにとって「意外だったこと」はありますか？\n・うまくいかなかったことから、何か学んだことはありますか？\n・外から見たとき（第三者の視点）にどう見えていそうでしょうか？",
      nextId: 7,
      type: "talk",
    },
    {
      id: 7,
      loading: true,
      message:
        "**5. 意味づけ（学び・変化・価値）**\n・このプロジェクトを通じて、自分たちは何を得ましたか？\n・視点や前提が変わったことはありますか？\n・チームにとっての意味、自分にとっての意味は何でしょうか？\n・このプロジェクトは、どのように未来につながりますか？",
      nextId: 8,
      type: "talk",
    },
    {
      id: 8,
      nextId: 9,
      type: "question",
      message:
        "ここまでの質問にお答えいただき、ありがとうございます。続いて、より具体的なプロジェクトの詳細について伺います。",
    },
    {
      id: 9,
      message: "回答ありがとうございます。プ譜の作成をはじめます。",
      nextId: 10,
      type: "generate",
    },
    {
      id: 10,
      loading: false,
      message:
        "生成されたプ譜はいかがでしたか？\n是非、<a href='https://forms.gle/LkjFdN8Kekfzivk2A' target='_blank'>問い合わせフォーム</a>からご意見をお聞かせください。\nまた、以下のようなご相談がある方は、 お問い合わせをお待ちしております。\n・自社用にカスタマイズしたい\n・自社のシステムと連携したい\n・自社の製品やメディアにバンドルしたい",
      nextId: null,
      type: "notice",
    },
    */
  ];

  private constructor() {}

  static getInstance(): DialogueService {
    if (!DialogueService.instance) {
      DialogueService.instance = new DialogueService();
    }
    return DialogueService.instance;
  }

  generateMessage(speaker: "system" | "user", text: string): DialogueMessage {
    return {
      id: `msg-${++this.messageIdCounter}`,
      speaker,
      text,
      timestamp: new Date(),
    };
  }

  getCurrentStep(): ScenarioStep | null {
    return this.scenario.find((step) => step.id === this.currentStepId) || null;
  }

  getUserResponses(): { [stepId: number]: string } {
    return this.userResponses;
  }

  getProjectInfo(): Partial<ProjectInfo> {
    return this.generatedProjectInfo;
  }

  async processUserInput(input: string): Promise<{
    response: string;
    nextPhase: DialoguePhase;
    shouldGenerate?: boolean;
    currentStepType?: string;
  }> {
    const currentStep = this.getCurrentStep();

    if (!currentStep) {
      return {
        response: "セッションが完了しています。",
        nextPhase: "complete",
        currentStepType: "notice",
      };
    }

    // ユーザーの回答を保存
    if (currentStep.type === "talk" || currentStep.type === "question") {
      this.userResponses[this.currentStepId] = input;
    }

    // 次のステップに進む
    if (currentStep.nextId) {
      this.currentStepId = currentStep.nextId;
      const nextStep = this.getCurrentStep();

      if (nextStep) {
        if (nextStep.type === "generate") {
          // プ譜生成フェーズ
          await this.generateProjectInfo();
          return {
            response: nextStep.message,
            nextPhase: "complete",
            shouldGenerate: true,
            currentStepType: nextStep.type,
          };
        } else if (nextStep.type === "question") {
          // OpenAI APIを使った詳細質問
          const aiResponse = await this.generateAIQuestion();
          return {
            response: aiResponse,
            nextPhase: this.currentStepId === 8 ? "summary" : "basicInfo",
            currentStepType: nextStep.type,
          };
        } else {
          return {
            response: nextStep.message,
            nextPhase: this.getPhaseFromStep(nextStep.type),
            currentStepType: nextStep.type,
          };
        }
      }
    }

    return {
      response: "ありがとうございました。",
      nextPhase: "complete",
      currentStepType: "notice",
    };
  }

  // noticeタイプ専用の「次へ」処理
  proceedToNext(): {
    response: string;
    nextPhase: DialoguePhase;
    currentStepType?: string;
  } {
    const currentStep = this.getCurrentStep();

    if (!currentStep || currentStep.type !== "notice") {
      return {
        response: "エラーが発生しました。",
        nextPhase: "complete",
        currentStepType: "notice",
      };
    }

    if (currentStep.nextId) {
      this.currentStepId = currentStep.nextId;
      const nextStep = this.getCurrentStep();

      if (nextStep) {
        return {
          response: nextStep.message,
          nextPhase: this.getPhaseFromStep(nextStep.type),
          currentStepType: nextStep.type,
        };
      }
    }

    return {
      response: "ありがとうございました。",
      nextPhase: "complete",
      currentStepType: "notice",
    };
  }

  private async generateAIQuestion(): Promise<string> {
    try {
      const openaiService = OpenAIService.getInstance();
      const responses = Object.values(this.userResponses);

      // OpenAI APIを使って動的に質問を生成
      const aiQuestion = await openaiService.generateQuestion(responses);
      return aiQuestion;
    } catch (error) {
      console.error("AI質問生成エラー:", error);
      // フォールバック: 固定の質問を返す
      return `これまでのお話を踏まえて、プロジェクトの詳細についてお聞きします。

プロジェクト名は何でしたか？また、プロジェクトの期間（開始時期と終了時期）を教えてください。

具体的な目標や成功条件があれば、それも教えてください。`;
    }
  }

  private async generateProjectInfo(): Promise<void> {
    try {
      const openaiService = OpenAIService.getInstance();

      // OpenAI APIを使ってプ譜情報を生成
      const aiGeneratedInfo = await openaiService.generateProjectInfo(
        this.userResponses
      );

      // AIで生成された情報をプ譜形式に変換
      this.generatedProjectInfo = {
        name: aiGeneratedInfo.projectName || "プロジェクト振り返り",
        period: {
          start: new Date("2024-01-01"),
          end: new Date("2024-06-30"),
        },
        gainingGoal: aiGeneratedInfo.gainingGoal || "プロジェクトの成功",
        winCondition: aiGeneratedInfo.winCondition || "目標の達成",
        intermediatePurposes:
          aiGeneratedInfo.purposes?.map(
            (purpose: any, index: number) => ({
              id: `purpose-${index + 1}`,
              purpose: purpose.text,
              measures:
                purpose.measures?.map((measure: any, mIndex: number) => ({
                  id: `measure-${index + 1}-${mIndex + 1}`,
                  action: measure.text,
                  type: measure.color || "white",
                  priority: 1,
                })) || [],
            })
          ) || [],
        eightElements: aiGeneratedInfo.elements || {
          people: "チームメンバー",
          money: "予算内",
          time: "スケジュール通り",
          quality: "品質確保",
          businessFlow: "関係者連携",
          environment: "作業環境",
          rival: "競合対応",
          foreignEnemy: "外部要因",
        },
        // 新しい形式のデータも保存
        scoreData: aiGeneratedInfo,
      };
    } catch (error) {
      console.error("AI プ譜生成エラー:", error);
      // フォールバック: 基本的な情報で生成
      const responses = this.userResponses;
      this.generatedProjectInfo = {
        name: "プロジェクト振り返り",
        period: {
          start: new Date("2024-01-01"),
          end: new Date("2024-06-30"),
        },
        gainingGoal: responses[3] || "プロジェクトの成功",
        winCondition: responses[4] || "目標の達成",
        intermediatePurposes: [
          {
            id: "purpose-1",
            purpose: "問題の解決",
            measures: [
              {
                id: "measure-1",
                action: responses[5] || "具体的な施策の実行",
                type: "white",
                priority: 1,
              },
            ],
          },
        ],
        eightElements: {
          people: "チームメンバー",
          money: "予算内",
          time: "スケジュール通り",
          quality: "品質確保",
          businessFlow: "関係者連携",
          environment: "作業環境",
          rival: "競合対応",
          foreignEnemy: "外部要因",
        },
      };
    }
  }

  private getPhaseFromStep(type: string): DialoguePhase {
    switch (type) {
      case "notice":
        return "introduction";
      case "talk":
        return "basicInfo";
      case "question":
        return "purposes";
      case "generate":
        return "complete";
      default:
        return "introduction";
    }
  }


  reset() {
    this.currentStepId = 1;
    this.userResponses = {};
    this.messageIdCounter = 0;
    this.generatedProjectInfo = {};
  }

  isComplete(): boolean {
    return this.currentStepId >= 10;
  }

  isGenerating(): boolean {
    const currentStep = this.getCurrentStep();
    return currentStep?.type === "generate";
  }
}
