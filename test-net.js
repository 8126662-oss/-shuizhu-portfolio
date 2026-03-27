const dns = require('dns');
const http = require('http');
const https = require('https');

console.log('=== 网络诊断测试 ===\n');

// 测试 DNS 解析
console.log('1. 测试 DNS 解析:');
const domains = ['open.feishu.cn', 'api.moonshot.cn', 'www.baidu.com'];

domains.forEach(domain => {
  console.log(`\n测试域名: ${domain}`);
  
  // DNS 解析测试
  dns.resolve4(domain, (err, addresses) => {
    if (err) {
      console.log(`  ❌ DNS 解析失败: ${err.message}`);
    } else {
      console.log(`  ✅ DNS 解析成功: ${addresses.join(', ')}`);
    }
  });
  
  // HTTP 连接测试
  const protocol = domain.startsWith('api.') || domain.includes('moonshot') ? https : http;
  const options = {
    hostname: domain,
    port: domain.startsWith('api.') || domain.includes('moonshot') ? 443 : 80,
    path: '/',
    method: 'GET',
    timeout: 5000
  };
  
  const req = protocol.request(options, (res) => {
    console.log(`  ✅ HTTP 连接成功: ${res.statusCode}`);
  });
  
  req.on('error', (e) => {
    console.log(`  ❌ HTTP 连接失败: ${e.message}`);
  });
  
  req.on('timeout', () => {
    console.log(`  ⏰ HTTP 连接超时`);
    req.destroy();
  });
  
  req.end();
});

// 测试系统代理设置
console.log('\n2. 测试系统代理设置:');
console.log(`  HTTP_PROXY: ${process.env.HTTP_PROXY || '未设置'}`);
console.log(`  HTTPS_PROXY: ${process.env.HTTPS_PROXY || '未设置'}`);
console.log(`  NO_PROXY: ${process.env.NO_PROXY || '未设置'}`);

// 测试网络延迟
console.log('\n3. 测试网络延迟:');
const testLatency = (domain) => {
  const startTime = Date.now();
  const options = {
    hostname: domain,
    port: 443,
    path: '/',
    method: 'HEAD',
    timeout: 10000
  };
  
  const req = https.request(options, (res) => {
    const latency = Date.now() - startTime;
    console.log(`  ${domain}: ${latency}ms`);
  });
  
  req.on('error', (e) => {
    console.log(`  ${domain}: 错误 - ${e.message}`);
  });
  
  req.on('timeout', () => {
    console.log(`  ${domain}: 超时`);
    req.destroy();
  });
  
  req.end();
};

testLatency('open.feishu.cn');
testLatency('api.moonshot.cn');
testLatency('www.baidu.com');

console.log('\n=== 测试完成 ===');
