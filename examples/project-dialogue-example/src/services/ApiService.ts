export class ApiService {
  private static instance: ApiService;
  private baseUrl: string;
  private llmProvider: string | null = null;

  private constructor() {
    // バックエンドサーバーのURL
    this.baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
  }

  static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  async getProvider(): Promise<string> {
    if (this.llmProvider) {
      return this.llmProvider;
    }

    try {
      const response = await fetch(`${this.baseUrl}/api/provider`);
      const data = await response.json();
      this.llmProvider = data.provider;
      return data.provider;
    } catch (error) {
      console.error('プロバイダー情報の取得エラー:', error);
      return 'unknown';
    }
  }

  async generateQuestion(userResponses: string[]): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/api/generate-question`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userResponses }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      return data.question;
    } catch (error) {
      console.error('質問生成エラー:', error);
      throw error;
    }
  }

  async generateProjectInfo(userResponses: {
    [stepId: number]: string;
  }): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/api/generate-project-info`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userResponses }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('プロジェクト情報生成エラー:', error);
      throw error;
    }
  }

  async generateFeedback(userResponse: string, stepId: number): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/api/generate-feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userResponse, stepId }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      return data.feedback;
    } catch (error) {
      console.error('フィードバック生成エラー:', error);
      throw error;
    }
  }
}