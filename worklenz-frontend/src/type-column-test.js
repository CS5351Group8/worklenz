// Type列显示测试
console.log('🎯 Type列测试开始');

// 检查页面是否加载完成
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', runTest);
} else {
  runTest();
}

function runTest() {
  console.log('🔍 开始检查Type列...');
  
  // 等待页面完全加载
  setTimeout(() => {
    // 查找表格头部
    const tableHeaders = document.querySelectorAll('th');
    console.log('📋 找到的表格头部数量:', tableHeaders.length);
    
    let typeColumnFound = false;
    tableHeaders.forEach((header, index) => {
      const text = header.textContent || header.innerText;
      console.log(`📋 头部 ${index}:`, text);
      if (text.includes('Type') || text.includes('类型')) {
        typeColumnFound = true;
        console.log('✅ 找到Type列!');
      }
    });
    
    if (!typeColumnFound) {
      console.log('❌ 未找到Type列');
      
      // 尝试查找任务行
      const taskRows = document.querySelectorAll('tr[data-task-row]');
      console.log('📋 找到的任务行数量:', taskRows.length);
      
      if (taskRows.length > 0) {
        const firstRow = taskRows[0];
        const cells = firstRow.querySelectorAll('td');
        console.log('📋 第一行的单元格数量:', cells.length);
        
        cells.forEach((cell, index) => {
          const text = cell.textContent || cell.innerText;
          console.log(`📋 单元格 ${index}:`, text);
        });
      }
    }
    
    // 检查是否有调试信息
    const debugInfo = document.querySelector('#task-table-debug');
    if (debugInfo) {
      console.log('✅ 找到调试信息:', debugInfo.textContent);
    } else {
      console.log('❌ 未找到调试信息');
    }
    
  }, 3000);
}
