interface CompletionModalProps {
  onRestart: () => void;
  onBackToHome: () => void;
}

export default function CompletionModal({ onRestart, onBackToHome }: CompletionModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="rounded-lg bg-white p-8 shadow-lg">
        <h2 className="mb-4 text-2xl font-bold text-gray-800">🎉 恭喜!</h2>
        <p className="mb-6 text-gray-600">你已完成所有单词的学习。要再来一遍吗？</p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onBackToHome}
            className="rounded-lg bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
          >
            回到主页
          </button>
          <button
            onClick={onRestart}
            className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 flex items-center gap-2"
          >
            <span>再来一遍</span>
            <span className="text-lg">🔀</span>
          </button>
        </div>
      </div>
    </div>
  );
}
