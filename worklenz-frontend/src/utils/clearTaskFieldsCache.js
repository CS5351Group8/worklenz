// 清除任务字段缓存的工具函数
// 在浏览器控制台中运行此函数来清除本地存储的列配置

function clearTaskFieldsCache() {
  // 清除本地存储的任务字段配置
  localStorage.removeItem('worklenz.taskManagement.fields');
  
  // 清除所有相关的本地存储
  const keysToRemove = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.includes('taskManagement') || key.includes('taskList')) {
      keysToRemove.push(key);
    }
  }
  
  keysToRemove.forEach(key => localStorage.removeItem(key));
  
  console.log('✅ 已清除任务字段缓存');
  console.log('请刷新页面以重新加载默认列配置');
  
  return true;
}

// 使其在全局可用
if (typeof window !== 'undefined') {
  window.clearTaskFieldsCache = clearTaskFieldsCache;
}

export default clearTaskFieldsCache;
