const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
    // 处理根路径请求，返回index.html
    if (req.url === '/' || req.url === '/index.html') {
const filePath = path.join(__dirname, 'index.html'); // 使用英文逗号        
        fs.readFile(filePath, (err, content) => {
            if (err) {
                res.statusCode = 500;
                res.end('服务器错误');
            } else {
                res.setHeader('Content-Type', 'text/html');
                res.end(content);
            }
        });
    } else {
        // 处理其他路径请求
        res.statusCode = 404;
        res.end('未找到页面');
    }
});

const PORT = 3000;
server。listen(PORT, () => {
    console.log(`服务器运行在端口 ${PORT}`);
});    
