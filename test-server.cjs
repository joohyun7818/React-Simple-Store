// Simple test server to simulate Optimizely SDK responses
const http = require('http');
const url = require('url');

// UI configurations as specified in the problem statement
const configs = {
  v1: {
    theme: "default",
    primaryColor: "#007bff",
    showDiscount: false,
    featuredCategories: ["전자제품", "의류", "도서"],
    headerMessage: "AI Store에 오신 것을 환영합니다!"
  },
  v2: {
    theme: "modern",
    primaryColor: "#28a745",
    showDiscount: true,
    featuredCategories: ["캠핑", "스포츠", "생활용품"],
    headerMessage: "🎉 특별 할인 이벤트 진행중!"
  }
};

// Simulated product data
const products = [
  {
    id: "1",
    name: "무선 이어폰",
    price: 89000,
    description: "고음질 무선 이어폰",
    category: "전자제품",
    imageUrl: "https://picsum.photos/400/400?random=1"
  },
  {
    id: "2",
    name: "캠핑 텐트",
    price: 150000,
    description: "4인용 방수 텐트",
    category: "캠핑",
    imageUrl: "https://picsum.photos/400/400?random=2"
  },
  {
    id: "3",
    name: "러닝화",
    price: 120000,
    description: "편안한 운동화",
    category: "스포츠",
    imageUrl: "https://picsum.photos/400/400?random=3"
  },
  {
    id: "4",
    name: "프로그래밍 책",
    price: 35000,
    description: "JavaScript 완벽 가이드",
    category: "도서",
    imageUrl: "https://picsum.photos/400/400?random=4"
  },
  {
    id: "5",
    name: "티셔츠",
    price: 25000,
    description: "편안한 면 티셔츠",
    category: "의류",
    imageUrl: "https://picsum.photos/400/400?random=5"
  },
  {
    id: "6",
    name: "수납함",
    price: 18000,
    description: "다용도 플라스틱 수납함",
    category: "생활용품",
    imageUrl: "https://picsum.photos/400/400?random=6"
  }
];

// Track user variants
let userVariants = {};

const server = http.createServer((req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  // Login endpoint
  if (pathname === '/api/login' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      const { email } = JSON.parse(body);
      
      // Alternate between v1 and v2 based on email
      const variant = email.includes('test') ? 'v2' : 'v1';
      userVariants[email] = variant;
      
      const uiConfig = configs[variant];
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        email,
        name: 'Test User',
        country: 'KR',
        variant,
        uiConfig
      }));
    });
    return;
  }

  // Register endpoint
  if (pathname === '/api/register' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      const { email, name } = JSON.parse(body);
      
      // Alternate between v1 and v2 based on email
      const variant = email.includes('test') ? 'v2' : 'v1';
      userVariants[email] = variant;
      
      const uiConfig = configs[variant];
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        email,
        name,
        country: 'KR',
        variant,
        uiConfig
      }));
    });
    return;
  }

  // Products endpoint
  if (pathname === '/api/products' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(products));
    return;
  }

  // Cart endpoints (simple mock)
  if (pathname === '/api/cart' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify([]));
    return;
  }

  if (pathname === '/api/cart/add' && req.method === 'POST') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true }));
    return;
  }

  // Orders endpoint
  if (pathname === '/api/orders' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify([]));
    return;
  }

  // Default 404
  res.writeHead(404);
  res.end('Not Found');
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Test server running on http://localhost:${PORT}`);
  console.log('');
  console.log('Test instructions:');
  console.log('- Login/Register with email containing "test" (e.g., test@example.com) for v2 UI (green, discount)');
  console.log('- Login/Register with other emails (e.g., user@example.com) for v1 UI (blue, no discount)');
});
