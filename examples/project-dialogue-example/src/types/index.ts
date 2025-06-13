export interface DialogueMessage {
  id: string;
  speaker: 'system' | 'user';
  text: string;
  timestamp: Date;
}

export interface ProjectInfo {
  name: string;
  period: {
    start: Date;
    end: Date;
  };
  gainingGoal: string;
  winCondition: string;
  intermediatePurposes: IntermediatePurpose[];
  eightElements: EightElements;
  scoreData?: any; // 新しい形式のプ譜データ
}

export interface IntermediatePurpose {
  id: string;
  purpose: string;
  measures: Measure[];
}

export interface Measure {
  id: string;
  action: string;
  type: 'white' | 'red' | 'green' | 'blue' | 'yellow';
  priority: number;
}

export interface EightElements {
  people: string;
  money: string;
  time: string;
  quality: string;
  businessFlow: string;
  environment: string;
  rival: string;
  foreignEnemy: string;
}

export type DialoguePhase = 
  | 'introduction'
  | 'basicInfo'
  | 'purposes'
  | 'measures'
  | 'eightElements'
  | 'summary'
  | 'complete';