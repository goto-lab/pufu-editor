import React, { useEffect } from 'react';
import { ProjectScore, setScore, downloadScore } from '@goto-lab/pufu-editor';
import { ProjectInfo } from '../types';
import short from 'short-uuid';

interface ProjectScoreViewProps {
  projectInfo: ProjectInfo;
  onClose: () => void;
}

export const ProjectScoreView: React.FC<ProjectScoreViewProps> = ({ projectInfo, onClose }) => {
  useEffect(() => {
    // 新しい形式のプ譜データを使用するか、旧形式から変換
    if (projectInfo.scoreData) {
      // 新しい形式がある場合はそのまま使用
      setScore('project-review', JSON.stringify(projectInfo.scoreData));
    } else {
      // 旧形式から新形式に変換
      const scoreData = {
        winCondition: {
          uuid: short.generate(),
          text: projectInfo.winCondition,
          comment: {
            color: 'blue',
            text: ''
          }
        },
        gainingGoal: {
          uuid: short.generate(),
          text: projectInfo.gainingGoal,
          comment: {
            color: 'blue',
            text: ''
          }
        },
        purposes: projectInfo.intermediatePurposes.map((purpose, index) => ({
          uuid: short.generate(),
          text: purpose.purpose,
          comment: {
            color: 'blue',
            text: ''
          },
          measures: purpose.measures.map((measure, mIndex) => ({
            uuid: short.generate(),
            text: measure.action,
            comment: {
              color: 'blue',
              text: ''
            },
            color: measure.type
          }))
        })),
        elements: {
          people: {
            uuid: short.generate(),
            text: projectInfo.eightElements.people,
            comment: {
              color: 'blue',
              text: ''
            }
          },
          money: {
            uuid: short.generate(),
            text: projectInfo.eightElements.money,
            comment: {
              color: 'blue',
              text: ''
            }
          },
          time: {
            uuid: short.generate(),
            text: projectInfo.eightElements.time,
            comment: {
              color: 'blue',
              text: ''
            }
          },
          quality: {
            uuid: short.generate(),
            text: projectInfo.eightElements.quality,
            comment: {
              color: 'blue',
              text: ''
            }
          },
          businessScheme: {
            uuid: short.generate(),
            text: projectInfo.eightElements.businessFlow,
            comment: {
              color: 'blue',
              text: ''
            }
          },
          environment: {
            uuid: short.generate(),
            text: projectInfo.eightElements.environment,
            comment: {
              color: 'blue',
              text: ''
            }
          },
          rival: {
            uuid: short.generate(),
            text: projectInfo.eightElements.rival,
            comment: {
              color: 'blue',
              text: ''
            }
          },
          foreignEnemy: {
            uuid: short.generate(),
            text: projectInfo.eightElements.foreignEnemy,
            comment: {
              color: 'blue',
              text: ''
            }
          }
        }
      };

      setScore('project-review', JSON.stringify(scoreData));
    }
  }, [projectInfo]);

  const handleDownload = () => {
    downloadScore('project-review', `${projectInfo.name}_プ譜.json`);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl max-h-[90vh] w-full m-4 flex flex-col">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">
            {projectInfo.name} - プロジェクト譜
          </h2>
          <div className="flex gap-3">
            <button
              onClick={handleDownload}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              ダウンロード
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              閉じる
            </button>
          </div>
        </div>
        
        <div className="flex-1 overflow-auto p-6">
          <ProjectScore uniqueKey="project-review" />
        </div>
      </div>
    </div>
  );
};