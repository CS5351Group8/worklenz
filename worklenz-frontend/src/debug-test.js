// 这是一个简单的调试测试文件
console.log('🎯 调试测试文件已加载 - 时间戳:', new Date().toISOString());
console.log('🚨 如果你看到这个消息，说明前端代码正在执行！');

// 在页面上显示一个明显的调试信息
if (typeof document !== 'undefined') {
  const debugDiv = document.createElement('div');
  debugDiv.id = 'debug-test';
  debugDiv.style.cssText = 'position: fixed; top: 10px; right: 10px; background: red; color: white; padding: 10px; z-index: 9999; font-size: 14px;';
  debugDiv.textContent = '🎯 调试测试已加载 - ' + new Date().toLocaleTimeString();
  document.body.appendChild(debugDiv);
  
  // 5秒后移除调试信息
  setTimeout(() => {
    if (debugDiv.parentNode) {
      debugDiv.parentNode.removeChild(debugDiv);
    }
  }, 5000);
}
