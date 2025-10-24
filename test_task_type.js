const { Client } = require('pg');
const io = require('socket.io-client');

// 测试配置
const DB_CONFIG = {
  host: 'localhost',
  port: 5432,
  database: 'worklenz_db',
  user: 'postgres',
  password: 'password'
};

const SOCKET_URL = 'http://localhost:3000';

async function testTaskTypeFlow() {
  console.log('=== 开始测试 task_type 完整流程 ===\n');
  
  // 1. 测试数据库连接和查询
  console.log('1. 测试数据库连接...');
  const client = new Client(DB_CONFIG);
  
  try {
    await client.connect();
    console.log('✅ 数据库连接成功');
    
    // 查询现有任务
    const result = await client.query('SELECT id, name, task_type FROM tasks LIMIT 3');
    console.log('📋 现有任务:');
    result.rows.forEach(task => {
      console.log(`   - ${task.name}: ${task.task_type} (ID: ${task.id})`);
    });
    
    if (result.rows.length === 0) {
      console.log('❌ 没有找到任务，请先创建一些任务');
      return;
    }
    
    const testTask = result.rows[0];
    console.log(`\n🎯 使用测试任务: ${testTask.name} (${testTask.task_type})`);
    
    // 2. 测试数据库函数
    console.log('\n2. 测试数据库函数...');
    const functionResult = await client.query(
      'SELECT handle_task_type_change($1, $2, $3) AS response',
      [testTask.id, 'Feature', testTask.id]
    );
    console.log('📊 数据库函数结果:', JSON.stringify(functionResult.rows[0].response, null, 2));
    
    // 3. 测试Socket连接
    console.log('\n3. 测试Socket连接...');
    const socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling']
    });
    
    return new Promise((resolve) => {
      socket.on('connect', () => {
        console.log('✅ Socket连接成功');
        
        // 4. 测试Socket事件发送
        console.log('\n4. 测试Socket事件发送...');
        const testData = {
          task_id: testTask.id,
          task_type: 'User Story',
          team_id: testTask.id
        };
        
        console.log('📤 发送TASK_TYPE_CHANGE事件:', testData);
        
        socket.emit('TASK_TYPE_CHANGE', JSON.stringify(testData));
        
        // 监听响应
        socket.on('TASK_TYPE_CHANGE', (data) => {
          console.log('📥 收到Socket响应:', data);
          
          // 5. 验证数据库更新
          console.log('\n5. 验证数据库更新...');
          client.query('SELECT task_type FROM tasks WHERE id = $1', [testTask.id])
            .then(updateResult => {
              console.log('📊 更新后的task_type:', updateResult.rows[0].task_type);
              
              if (updateResult.rows[0].task_type === 'User Story') {
                console.log('✅ task_type更新成功！');
              } else {
                console.log('❌ task_type更新失败！');
              }
              
              // 清理
              socket.disconnect();
              client.end();
              resolve();
            })
            .catch(err => {
              console.error('❌ 验证数据库更新失败:', err);
              socket.disconnect();
              client.end();
              resolve();
            });
        });
        
        // 设置超时
        setTimeout(() => {
          console.log('⏰ Socket响应超时');
          socket.disconnect();
          client.end();
          resolve();
        }, 5000);
      });
      
      socket.on('connect_error', (error) => {
        console.error('❌ Socket连接失败:', error.message);
        client.end();
        resolve();
      });
    });
    
  } catch (error) {
    console.error('❌ 测试失败:', error);
    await client.end();
  }
}

// 运行测试
testTaskTypeFlow().then(() => {
  console.log('\n=== 测试完成 ===');
  process.exit(0);
}).catch(error => {
  console.error('❌ 测试异常:', error);
  process.exit(1);
});
