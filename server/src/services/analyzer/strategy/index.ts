export type JobType = 'technical' | 'product' | 'design' | 'operation';

export interface AnalysisStrategy {
  jobType: JobType;
  displayName: string;
  focusDimensions: string[];
  promptTemplate: string;
  weightConfig: {
    experience: number;
    skills: number;
    project: number;
    softSkills: number;
  };
}

// 技术岗策略
export const technicalStrategy: AnalysisStrategy = {
  jobType: 'technical',
  displayName: '技术开发',
  focusDimensions: ['技术栈匹配', '项目复杂度', '开源贡献', '系统设计'],
  promptTemplate: 'tech_analysis_v2',
  weightConfig: {
    experience: 0.3,
    skills: 0.4,
    project: 0.25,
    softSkills: 0.05
  }
};

// 产品岗策略
export const productStrategy: AnalysisStrategy = {
  jobType: 'product',
  displayName: '产品经理',
  focusDimensions: ['业务理解', '数据驱动', '用户洞察', '跨团队协作'],
  promptTemplate: 'product_analysis_v2',
  weightConfig: {
    experience: 0.25,
    skills: 0.2,
    project: 0.35,
    softSkills: 0.2
  }
};

// 设计岗策略
export const designStrategy: AnalysisStrategy = {
  jobType: 'design',
  displayName: '设计师',
  focusDimensions: ['作品集', '设计思维', '工具熟练度', '用户体验'],
  promptTemplate: 'design_analysis_v2',
  weightConfig: {
    experience: 0.2,
    skills: 0.4,
    project: 0.3,
    softSkills: 0.1
  }
};

// 运营岗策略
export const operationStrategy: AnalysisStrategy = {
  jobType: 'operation',
  displayName: '运营',
  focusDimensions: ['增长思维', '内容能力', '数据分析', '活动策划'],
  promptTemplate: 'operation_analysis_v2',
  weightConfig: {
    experience: 0.2,
    skills: 0.3,
    project: 0.35,
    softSkills: 0.15
  }
};

export const strategies: Record<JobType, AnalysisStrategy> = {
  technical: technicalStrategy,
  product: productStrategy,
  design: designStrategy,
  operation: operationStrategy
};

export function getStrategy(jobType?: JobType): AnalysisStrategy {
  return strategies[jobType || 'technical'] || technicalStrategy;
}

export function getSystemPrompt(strategy: AnalysisStrategy): string {
  const basePrompt = '你是一位专业的 HR 顾问，擅长简历分析和岗位匹配评估。';
  
  switch (strategy.jobType) {
    case 'technical':
      return `${basePrompt}你特别关注技术深度、项目经验和问题解决能力。`;
    case 'product':
      return `${basePrompt}你特别关注产品思维、业务理解和数据分析能力。`;
    case 'design':
      return `${basePrompt}你特别关注设计思维、用户体验和作品集质量。`;
    case 'operation':
      return `${basePrompt}你特别关注增长思维、运营能力和数据分析能力。`;
    default:
      return basePrompt;
  }
}
