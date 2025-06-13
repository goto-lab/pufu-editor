import { DialoguePhase, DialogueMessage, ProjectInfo } from "../types";
import { ApiService } from "./ApiService";

interface ScenarioStep {
  id: number;
  loading?: boolean;
  displayMessage?: string;
  voiceMessage?: string;
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
      loading: false,
      displayMessage:
        "ようこそ、私はプ譜AIアシスタントです。プロジェクトの振り返りサポートさせていただきます。",
      voiceMessage:
        "ようこそ、私はプ譜AIアシスタントです。プロジェクトの振り返りサポートさせていただきます。",
      nextId: 2,
      type: "notice",
    },
    {
      id: 2,
      loading: false,
      displayMessage:
        "あなたが取り組まれてたプロジェクトについてお伺いし、プ譜を作成します。 6つの質問にお答えください。",
      voiceMessage:
        "あなたが取り組まれてたプロジェクトについてお伺いし、プ譜を作成します。 6つの質問にお答えください。",
      nextId: 3,
      type: "notice",
    },
    {
      id: 3,
      loading: true,
      displayMessage:
        "**1. プロジェクトの出発点**\n - どのようなプロジェクトの内容\n - プロジェクトに取り組もうとしたきっかけや思い \n- 解決しようとした課題",
      voiceMessage:
        "1. プロジェクトの出発点 どのようなプロジェクトを始めましたか？プロジェクトに取り組もうとしたきっかけや背景となる思い、解決しようとした課題について教えてください",
      nextId: 4,
      type: "talk",
    },
    {
      id: 4,
      loading: true,
      displayMessage:
        "**2. 仮説と取り組みの方向性**\n - 当初の仮説や方向性\n - 仮説や方向性を選んだ理由\n - 仮説は途中で変化と出来事",
      voiceMessage:
        "2. 仮説と取り組みの方向性 最初に「こうすればうまく進められるのでは？」といった仮説や方向性はありますか？\n・なぜその仮説や方向性を選んびましたか？また仮説は途中で変化しましたか？それはどのような出来事がきっかけでしたか？",
      nextId: 5,
      type: "talk",
    },
    {
      id: 5,
      loading: true,
      displayMessage:
        "**3. 実際の取り組み**\n - 具体的な「施策」「行動」と手応え\n - リスクを取ったチャレンジ\n - 想定外の出来事や、偶然うまくいったこと",
      voiceMessage:
        "3. 実際の取り組み 具体的にどのような施策、行動をしましたか？手応えを感じた施策や行動はありますか？\n・リスクを取ったチャレンジはありましたか？想定外の出来事や、偶然うまくいったことはありましたか？",
      nextId: 6,
      type: "talk",
    },
    {
      id: 6,
      loading: true,
      displayMessage:
        "**4. 観察（起きたこと・気づいたこと）**\n - プロジェクトに取り組んだ結果と反応\n・自分たちにとって意外だったこと\n - うまくいかなかったことから学んだこと",
      voiceMessage:
        "4. 観察 プロジェクトに取り組んだ結果、どのような反応が返ってきましたか？自分たちにとって「意外だったこと」はありますか？うまくいかなかったことから、何か学んだことはありますか？",
      nextId: 7,
      type: "talk",
    },
    {
      id: 7,
      loading: true,
      displayMessage:
        "**5. 意味づけ（学び・変化・価値）**\n - プロジェクトを通じて得たこと\n - 視点や前提の変化\n・自分やチームにとっての意味\n - プロジェクトによる未来の変化",
      voiceMessage:
        "5. 意味づけ このプロジェクトを通じて、自分たちは何を得ましたか？視点や前提が変わったことはありますか？チームにとっての意味、自分にとっての意味は何でしょうか？このプロジェクトは、どのように未来につながりますか？",
      nextId: 8,
      type: "talk",
    },
    {
      id: 8,
      nextId: 9,
      type: "question",
    },
    {
      id: 9,
      displayMessage: "回答ありがとうございます。プ譜の作成をはじめます。",
      voiceMessage: "回答ありがとうございます。プ譜の作成をはじめます。",
      nextId: 10,
      type: "generate",
    },
    {
      id: 10,
      loading: false,
      displayMessage:
        "生成されたプ譜はいかがでしたか？\n是非、<a href='https://forms.gle/LkjFdN8Kekfzivk2A' target='_blank'>問い合わせフォーム</a>からご意見をお聞かせください。\nまた、以下のようなご相談がある方は、 お問い合わせをお待ちしております。\n・自社用にカスタマイズしたい\n・自社のシステムと連携したい\n・自社の製品やメディアにバンドルしたい",
      voiceMessage:
        "生成されたプ譜はいかがでしたか？是非、問い合わせフォームからご意見をお聞かせください。また、自社用にカスタマイズしたい、自社のシステムと連携したい、自社の製品やメディアにバンドルしたいなどのご相談がある方は、お問い合わせをお待ちしております。",
      nextId: null,
      type: "notice",
    },
  ];

  private constructor() {}

  static getInstance(): DialogueService {
    if (!DialogueService.instance) {
      DialogueService.instance = new DialogueService();
    }
    return DialogueService.instance;
  }

  generateMessage(
    speaker: "system" | "user",
    text: string,
    voiceText?: string
  ): DialogueMessage {
    return {
      id: `msg-${++this.messageIdCounter}`,
      speaker,
      text,
      voiceText, // 音声読み上げ用テキスト
      timestamp: new Date(),
    };
  }

  getVoiceText(message: DialogueMessage): string {
    // 音声用テキストが指定されている場合はそれを使用、されていない場合はマークダウンを除去
    return message.voiceText || this.stripMarkdown(message.text);
  }

  private stripMarkdown(text: string): string {
    return text
      .replace(/\*\*(.*?)\*\*/g, "$1") // Bold
      .replace(/\*(.*?)\*/g, "$1") // Italic
      .replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1") // Links
      .replace(/^#+\s*/gm, "") // Headers
      .replace(/^[-*+]\s*/gm, "") // List items
      .replace(/\n{2,}/g, " ") // Multiple newlines
      .replace(/\n/g, " ") // Single newlines
      .trim();
  }

  getCurrentStep(): ScenarioStep | null {
    return this.scenario.find((step) => step.id === this.currentStepId) || null;
  }

  getUserResponses(): { [stepId: number]: string } {}

  getProjectInfo(): Partial<ProjectInfo> {
    return this.generatedProjectInfo;
  }

  async processUserInput(input: string): Promise<{
    response: string;
    voiceText?: string;
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
            response: nextStep.displayMessage || "",
            voiceText: nextStep.voiceMessage || "",
            nextPhase: "complete",
            shouldGenerate: true,
            currentStepType: nextStep.type,
          };
        } else if (nextStep.type === "question") {
          // questionタイプはLLMで動的に質問を生成
          const aiResponse = await this.generateAIQuestion();
          return {
            response: aiResponse,
            voiceText: this.stripMarkdown(aiResponse), // AI生成の場合はマークダウン除去
            nextPhase: this.currentStepId === 8 ? "summary" : "basicInfo",
            currentStepType: nextStep.type,
          };
        } else if (nextStep.type === "talk") {
          // talkタイプは定型文の質問
          return {
            response: nextStep.displayMessage || "",
            voiceText: nextStep.voiceMessage || "",
            nextPhase: this.getPhaseFromStep(nextStep.type),
            currentStepType: nextStep.type,
          };
        } else {
          // noticeやgenerateタイプ
          return {
            response: nextStep.displayMessage || "",
            voiceText: nextStep.voiceMessage || "",
            nextPhase: this.getPhaseFromStep(nextStep.type),
            currentStepType: nextStep.type,
          };
        }
      }
    }

    return {
      response: "ありがとうございました。",
      voiceText: undefined,
      nextPhase: "complete",
      currentStepType: "notice",
    };
  }

  // noticeタイプ専用の「次へ」処理
  async proceedToNext(): Promise<{
    response: string;
    voiceText?: string;
    nextPhase: DialoguePhase;
    currentStepType?: string;
  }> {
    const currentStep = this.getCurrentStep();

    if (!currentStep || currentStep.type !== "notice") {
      return {
        response: "エラーが発生しました。",
        voiceText: undefined,
        nextPhase: "complete",
        currentStepType: "notice",
      };
    }

    if (currentStep.nextId) {
      this.currentStepId = currentStep.nextId;
      const nextStep = this.getCurrentStep();

      if (nextStep) {
        if (nextStep.type === "question") {
          // questionタイプの場合はAI質問を生成
          const aiResponse = await this.generateAIQuestion();
          return {
            response: aiResponse,
            voiceText: this.stripMarkdown(aiResponse),
            nextPhase: this.getPhaseFromStep(nextStep.type),
            currentStepType: nextStep.type,
          };
        } else {
          return {
            response: nextStep.displayMessage || "",
            voiceText: nextStep.voiceMessage || "",
            nextPhase: this.getPhaseFromStep(nextStep.type),
            currentStepType: nextStep.type,
          };
        }
      }
    }

    return {
      response: "ありがとうございました。",
      voiceText: undefined,
      nextPhase: "complete",
      currentStepType: "notice",
    };
  }

  private async generateAIQuestion(): Promise<string> {
    try {
      const apiService = ApiService.getInstance();
      const responses = Object.values(this.userResponses);

      // APIサーバー経由で動的に質問を生成
      const aiQuestion = await apiService.generateQuestion(responses);
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
      const apiService = ApiService.getInstance();

      // APIサーバー経由でプ譜情報を生成
      const aiGeneratedInfo = await apiService.generateProjectInfo(
        this.userResponses
      );

      // AIで生成された情報をプ譜形式に変換
      this.generatedProjectInfo = {
        name: aiGeneratedInfo.projectName || "プロジェクト振り返り",
        period: {
          start: new Date("2024-01-01"),
          end: new Date("2024-06-30"),
        },
        gainingGoal: aiGeneratedInfo.gainingGoal?.text || "プロジェクトの成功",
        winCondition: aiGeneratedInfo.winCondition?.text || "目標の達成",
        intermediatePurposes:
          aiGeneratedInfo.purposes?.map((purpose: any, index: number) => ({
            id: `purpose-${index + 1}`,
            purpose: purpose.text,
            measures:
              purpose.measures?.map((measure: any, mIndex: number) => ({
                id: `measure-${index + 1}-${mIndex + 1}`,
                action: measure.text,
                type: measure.color || "white",
                priority: 1,
              })) || [],
          })) || [],
        eightElements: {
          people: aiGeneratedInfo.elements?.people?.text || "チームメンバー",
          money: aiGeneratedInfo.elements?.money?.text || "予算内",
          time: aiGeneratedInfo.elements?.time?.text || "スケジュール通り",
          quality: aiGeneratedInfo.elements?.quality?.text || "品質確保",
          businessFlow:
            aiGeneratedInfo.elements?.businessScheme?.text || "関係者連携",
          environment:
            aiGeneratedInfo.elements?.environment?.text || "作業環境",
          rival: aiGeneratedInfo.elements?.rival?.text || "競合対応",
          foreignEnemy:
            aiGeneratedInfo.elements?.foreignEnemy?.text || "外部要因",
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
