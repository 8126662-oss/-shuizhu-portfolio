const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

console.log('=== OpenClaw 深度诊断 ===\n');

// 1. 检查 OpenClaw 进程
console.log('1. 检查 OpenClaw 进程:');
try {
  const result = execSync('tasklist /FI "IMAGENAME eq node.exe" /FO CSV', { encoding: 'utf8' });
  const lines = result.trim().split('\n').slice(1);
  if (lines.length > 0) {
    console.log('   ✅ Node.js 进程正在运行');
    lines.forEach(line => {
      const cols = line.split('","').map(c => c.replace(/"/g, ''));
      if (cols[0]) {
        console.log(`   - ${cols[0]} (PID: ${cols[1]}, 内存: ${cols[4]})`);
      }
    });
  } else {
    console.log('   ❌ 没有找到 Node.js 进程');
  }
} catch (error) {
  console.log('   ❌ 无法检查进程:', error.message);
}

// 2. 检查端口占用
console.log('\n2. 检查端口占用 (18789):');
try {
  const result = execSync('netstat -ano | findstr :18789', { encoding: 'utf8' });
  if (result.trim()) {
    console.log('   ✅ 端口 18789 被占用:');
    console.log('   ' + result.trim().split('\n').join('\n   '));
  } else {
    console.log('   ❌ 端口 18789 未被占用，OpenClaw 可能未启动');
  }
} catch (error) {
  console.log('   ❌ 端口检查失败:', error.message);
}

// 3. 测试 API 连接
console.log('\n3. 测试 API 连接:');
const testApiConnection = (hostname, port, path = '/') => {
  return new Promise((resolve) => {
    const protocol = port === 443 ? https : http;
    const options = {
      hostname,
      port,
      path,
      method: 'GET',
      timeout: 10000,
      headers: {
        'User-Agent': 'OpenClaw-Diagnose/1.0'
      }
    };

    const req = protocol.request(options, (res) => {
      console.log(`   ✅ ${hostname}:${port} - 状态码: ${res.statusCode}`);
      resolve(true);
    });

    req.on('error', (e) => {
      console.log(`   ❌ ${hostname}:${port} - 错误: ${e.message}`);
      resolve(false);
    });

    req.on('timeout', () => {
      console.log(`   ⏰ ${hostname}:${port} - 超时`);
      req.destroy();
      resolve(false);
    });

    req.end();
  });
};

(async () => {
  await testApiConnection('open.feishu.cn', 443);
  await testApiConnection('api.moonshot.cn', 443);
  await testApiConnection('www.baidu.com', 443);

  // 4. 检查配置文件
  console.log('\n4. 检查配置文件:');
  const configPath = path.join(process.env.USERPROFILE, '.openclaw', 'openclaw.json');
  if (fs.existsSync(configPath)) {
    try {
      const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      
      console.log('   配置检查:');
      console.log(`   - Tools Profile: ${config.tools?.profile || '❌ 未设置'}`);
      console.log(`   - Apply Patch: ${config.tools?.exec?.applyPatch ? '✅ 已配置' : '❌ 未配置'}`);
      console.log(`   - Moonshot 模型: ${config.models?.providers?.moonshot ? '✅ 已配置' : '❌ 未配置'}`);
      console.log(`   - Feishu 通道: ${config.channels?.feishu?.enabled ? '✅ 已启用' : '❌ 未启用'}`);
      console.log(`   - Gateway 端口: ${config.gateway?.port || '❌ 未设置'}`);
      console.log(`   - Gateway 模式: ${config.gateway?.mode || '❌ 未设置'}`);
      
      const issues = [];
      if (!config.tools?.profile) issues.push('tools.profile 未设置');
      if (!config.models?.providers?.moonshot) issues.push('Moonshot 模型未配置');
      if (!config.channels?.feishu?.enabled) issues.push('Feishu 通道未启用');
      if (!config.gateway?.port) issues.push('Gateway 端口未设置');
      
      if (issues.length > 0) {
        console.log('\n   ⚠️ 发现配置问题:');
        issues.forEach(issue => console.log(`   - ${issue}`));
      }
    } catch (error) {
      console.log('   ❌ 配置文件解析错误:', error.message);
    }
  } else {
    console.log('   ❌ 配置文件不存在');
  }

  // 5. 检查环境变量
  console.log('\n5. 检查环境变量:');
  const envVars = ['MOONSHOT_API_KEY', 'KIMI_API_KEY', 'HTTP_PROXY', 'HTTPS_PROXY', 'NO_PROXY'];
  envVars.forEach(varName => {
    const value = process.env[varName];
    if (value) {
      const displayValue = varName.includes('KEY') || varName.includes('SECRET') 
        ? `${value.substring(0, 4)}...${value.substring(value.length - 4)}` 
        : value;
      console.log(`   ✅ ${varName}: ${displayValue}`);
    } else {
      console.log(`   ❌ ${varName}: 未设置`);
    }
  });

  // 6. 提供解决方案
  console.log('\n=== 解决方案 ===');
  console.log('如果 OpenClaw 仍然不回复，请尝试以下步骤:');
  console.log('');
  console.log('1. 重启 OpenClaw:');
  console.log('   - 在终端中运行: openclaw stop');
  console.log('   - 然后运行: openclaw start');
  console.log('');
  console.log('2. 检查日志:');
  console.log('   - 查看日志文件: %USERPROFILE%\\.openclaw\\logs\\');
  console.log('   - 或者运行: openclaw logs');
  console.log('');
  console.log('3. 验证配置:');
  console.log('   - 确保 openclaw.json 格式正确');
  console.log('   - 检查 Moonshot API Key 是否有效');
  console.log('   - 确认 Feishu App ID 和 Secret 正确');
  console.log('');
  console.log('4. 网络检查:');
  console.log('   - 确保能够访问 open.feishu.cn');
  console.log('   - 确保能够访问 api.moonshot.cn');
  console.log('   - 检查防火墙设置');
  console.log('');
  console.log('5. 如果问题持续，请提供以下信息:');
  console.log('   - OpenClaw 版本: openclaw --version');
  console.log('   - 最近的错误日志');
  console.log('   - 配置文件内容（移除敏感信息）');

  console.log('\n=== 诊断完成 ===');
})();
