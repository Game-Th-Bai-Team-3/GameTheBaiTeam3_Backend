# Hướng dẫn sử dụng Image Merge API - Đầy đủ

## Tổng quan
Hệ thống này cho phép ghép ảnh từ nhiều cards thông qua AI và real-time communication với Socket.io. Hỗ trợ nhiều loại ghép ảnh khác nhau, batch processing, và quản lý lịch sử.

## Cài đặt

### 1. Cài đặt dependencies
```bash
npm install socket.io cloudinary multer
```

### 2. Cấu hình Environment Variables
Thêm vào file `.env`:
```env
# Database
MONGODB_URI=mongodb://localhost:27017/gamethebai

# Server
PORT=5000

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# JWT (nếu cần)
JWT_SECRET=your_jwt_secret_key_here
```

## API Endpoints

### 1. Ghép ảnh cơ bản (2 cards)
**POST** `/api/image-merge/merge`

Request body:
```json
{
  "cardId1": "64f8b1234567890abcdef123",
  "cardId2": "64f8b1234567890abcdef456"
}
```

Response:
```json
{
  "success": true,
  "message": "Đã gửi yêu cầu ghép ảnh cho AI",
  "data": {
    "requestId": "merge_1703123456789_abc123def",
    "card1": {
      "id": "64f8b1234567890abcdef123",
      "name": "Card 1",
      "imageUrl": "https://cloudinary.com/image1.jpg"
    },
    "card2": {
      "id": "64f8b1234567890abcdef456", 
      "name": "Card 2",
      "imageUrl": "https://cloudinary.com/image2.jpg"
    }
  }
}
```

### 2. AI upload ảnh đã tạo
**POST** `/api/image-merge/ai-upload`

Request body:
```json
{
  "requestId": "merge_1703123456789_abc123def",
  "imageBase64": "iVBORw0KGgoAAAANSUhEUgAA...",
  "description": "Ảnh được tạo bởi AI"
}
```

Response:
```json
{
  "success": true,
  "message": "Đã lưu ảnh và gửi đến frontend",
  "data": {
    "requestId": "merge_1703123456789_abc123def",
    "imageUrl": "https://res.cloudinary.com/your-cloud/image/upload/v1703123456/ai-generated-images/merged_merge_1703123456789_abc123def.jpg",
    "publicId": "ai-generated-images/merged_merge_1703123456789_abc123def",
    "description": "Ảnh được tạo bởi AI",
    "createdAt": "2023-12-21T10:30:56.789Z"
  }
}
```

### 3. Ghép nhiều cặp ảnh cùng lúc (Batch Processing)
**POST** `/api/image-merge/batch`

Request body:
```json
{
  "cardPairs": [
    {
      "cardId1": "64f8b1234567890abcdef123",
      "cardId2": "64f8b1234567890abcdef456"
    },
    {
      "cardId1": "64f8b1234567890abcdef789",
      "cardId2": "64f8b1234567890abcdef012"
    }
  ]
}
```

Response:
```json
{
  "success": true,
  "message": "Đã xử lý 2 yêu cầu thành công, 0 lỗi",
  "data": {
    "totalRequests": 2,
    "successful": 2,
    "errors": 0,
    "results": [
      {
        "index": 0,
        "requestId": "batch_1703123456789_0_abc123def",
        "status": "processing",
        "card1": { "id": "...", "name": "Card 1", "imageUrl": "..." },
        "card2": { "id": "...", "name": "Card 2", "imageUrl": "..." }
      }
    ],
    "errors": []
  }
}
```

### 4. Ghép ảnh nâng cao với nhiều tùy chọn
**POST** `/api/image-merge/advanced`

Request body:
```json
{
  "cardIds": ["64f8b1234567890abcdef123", "64f8b1234567890abcdef456", "64f8b1234567890abcdef789"],
  "mergeType": "fusion",
  "style": "anime",
  "background": "gradient",
  "effects": ["glow", "shadow"],
  "outputFormat": "png",
  "quality": "high"
}
```

Response:
```json
{
  "success": true,
  "message": "Đã gửi yêu cầu ghép ảnh nâng cao cho AI",
  "data": {
    "requestId": "advanced_1703123456789_abc123def",
    "cards": [...],
    "options": {
      "mergeType": "fusion",
      "style": "anime",
      "background": "gradient",
      "effects": ["glow", "shadow"],
      "outputFormat": "png",
      "quality": "high"
    }
  }
}
```

### 5. Lấy lịch sử ảnh đã tạo
**GET** `/api/image-merge/history?page=1&limit=10&status=completed&sortBy=createdAt&sortOrder=desc`

Response:
```json
{
  "success": true,
  "data": {
    "histories": [
      {
        "requestId": "merge_1703123456789_abc123def",
        "originalCards": [...],
        "generatedImage": {
          "url": "https://res.cloudinary.com/...",
          "publicId": "ai-generated-images/merged_..."
        },
        "status": "completed",
        "processingTime": 5000,
        "metadata": {
          "createdAt": "2023-12-21T10:30:56.789Z",
          "completedAt": "2023-12-21T10:31:01.789Z",
          "description": "Merge Card 1 + Card 2"
        }
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalItems": 50,
      "itemsPerPage": 10
    }
  }
}
```

### 6. Lấy chi tiết một request
**GET** `/api/image-merge/history/{requestId}`

Response:
```json
{
  "success": true,
  "data": {
    "requestId": "merge_1703123456789_abc123def",
    "originalCards": [...],
    "generatedImage": {...},
    "status": "completed",
    "processingTime": 5000,
    "metadata": {...}
  }
}
```

### 7. Xóa ảnh đã tạo
**DELETE** `/api/image-merge/history/{requestId}`

Response:
```json
{
  "success": true,
  "message": "Đã xóa ảnh và lịch sử thành công"
}
```

### 8. Kiểm tra trạng thái kết nối
**GET** `/api/image-merge/status`

Response:
```json
{
  "success": true,
  "data": {
    "aiConnected": true,
    "frontendClients": 2,
    "timestamp": "2023-12-21T10:30:56.789Z"
  }
}
```

## Socket.io Events

### Kết nối từ AI
```javascript
const socket = io('http://localhost:5000');

// AI kết nối
socket.emit('ai_connected', { 
  clientType: 'ai', 
  version: '1.0' 
});

// Lắng nghe xác nhận kết nối
socket.on('ai_connection_confirmed', (data) => {
  console.log('AI connection confirmed:', data);
});

// Lắng nghe yêu cầu xử lý ảnh
socket.on('process_images', (data) => {
  console.log('Received images to process:', data);
  // Xử lý ảnh ở đây
  // Sau khi xử lý xong, emit kết quả
  socket.emit('ai_image_processed', {
    requestId: data.requestId,
    status: 'completed',
    processedImageUrl: 'path/to/processed/image.jpg'
  });
});
```

### Kết nối từ Frontend
```javascript
const socket = io('http://localhost:5000');

// Frontend kết nối
socket.emit('frontend_connected', { 
  clientType: 'frontend', 
  version: '1.0' 
});

// Lắng nghe xác nhận kết nối
socket.on('frontend_connection_confirmed', (data) => {
  console.log('Frontend connection confirmed:', data);
});

// Lắng nghe ảnh mới được tạo
socket.on('new_merged_image', (data) => {
  console.log('New merged image:', data);
  // Hiển thị ảnh mới trong UI
});

// Lắng nghe ảnh mới được upload từ AI
socket.on('new_generated_image', (data) => {
  console.log('New generated image:', data);
  // Hiển thị ảnh mới trong UI
});
```

## Flow hoạt động

1. **Frontend gọi API merge**: POST `/api/image-merge/merge` với 2 cardId
2. **Backend kiểm tra AI connection**: Nếu AI chưa kết nối, trả về lỗi 503
3. **Backend emit cho AI**: Gửi thông tin 2 ảnh qua socket event `process_images`
4. **AI xử lý ảnh**: AI nhận dữ liệu, xử lý và tạo ảnh mới
5. **AI upload ảnh**: AI gọi API POST `/api/image-merge/ai-upload` với ảnh base64
6. **Backend lưu vào Cloudinary**: Upload ảnh lên Cloudinary
7. **Backend emit cho Frontend**: Gửi ảnh mới qua socket event `new_generated_image`
8. **Frontend nhận ảnh**: Hiển thị ảnh mới trong UI

## Lưu ý

- Đảm bảo AI service kết nối trước khi gọi API merge
- Ảnh từ cards phải có URL hợp lệ
- AI phải encode ảnh thành base64 trước khi gửi
- Socket.io hỗ trợ CORS cho development (có thể cần cấu hình cho production)

## Error Handling

- **400**: Dữ liệu đầu vào không hợp lệ
- **404**: Không tìm thấy cards
- **503**: AI service chưa kết nối
- **500**: Lỗi server

## Ví dụ sử dụng thực tế

### Ví dụ 1: Ghép ảnh đơn giản
```javascript
// Frontend gọi API
const response = await fetch('/api/image-merge/merge', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    cardId1: '64f8b1234567890abcdef123',
    cardId2: '64f8b1234567890abcdef456'
  })
});

const result = await response.json();
console.log('Request ID:', result.data.requestId);
```

### Ví dụ 2: Batch processing
```javascript
// Ghép nhiều cặp cards cùng lúc
const cardPairs = [
  { cardId1: 'card1', cardId2: 'card2' },
  { cardId1: 'card3', cardId2: 'card4' },
  { cardId1: 'card5', cardId2: 'card6' }
];

const response = await fetch('/api/image-merge/batch', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ cardPairs })
});

const result = await response.json();
console.log(`Xử lý thành công: ${result.data.successful}/${result.data.totalRequests}`);
```

### Ví dụ 3: Ghép ảnh nâng cao
```javascript
// Ghép 3 cards với style anime
const response = await fetch('/api/image-merge/advanced', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    cardIds: ['card1', 'card2', 'card3'],
    mergeType: 'fusion',
    style: 'anime',
    background: 'gradient',
    effects: ['glow', 'shadow'],
    outputFormat: 'png',
    quality: 'high'
  })
});
```

### Ví dụ 4: Lấy lịch sử và theo dõi tiến trình
```javascript
// Lấy lịch sử ảnh đã tạo
const getHistory = async (page = 1) => {
  const response = await fetch(`/api/image-merge/history?page=${page}&limit=20&status=completed`);
  const result = await response.json();
  return result.data.histories;
};

// Theo dõi trạng thái một request
const checkRequestStatus = async (requestId) => {
  const response = await fetch(`/api/image-merge/history/${requestId}`);
  const result = await response.json();
  return result.data;
};
```

## Các trường hợp đặc biệt

### 1. Xử lý lỗi AI không kết nối
```javascript
try {
  const response = await fetch('/api/image-merge/merge', { ... });
  const result = await response.json();
  
  if (!result.success && result.message.includes('AI service chưa kết nối')) {
    // Retry sau 5 giây
    setTimeout(() => {
      // Gọi lại API
    }, 5000);
  }
} catch (error) {
  console.error('Lỗi kết nối:', error);
}
```

### 2. Xử lý batch với một số lỗi
```javascript
const response = await fetch('/api/image-merge/batch', { ... });
const result = await response.json();

if (result.data.errors.length > 0) {
  console.log('Có lỗi trong batch processing:');
  result.data.errors.forEach(error => {
    console.log(`Index ${error.index}: ${error.error}`);
  });
}

// Chỉ xử lý các request thành công
result.data.results.forEach(item => {
  console.log(`Request ${item.requestId} đang được xử lý`);
});
```

### 3. Upload ảnh từ AI (Python example)
```python
import requests
import base64

# AI đã xử lý xong ảnh
def upload_processed_image(request_id, image_path, description=""):
    # Đọc và encode ảnh thành base64
    with open(image_path, "rb") as image_file:
        image_base64 = base64.b64encode(image_file.read()).decode('utf-8')
    
    # Upload lên API
    response = requests.post('http://localhost:5000/api/image-merge/ai-upload', 
                           json={
                               'requestId': request_id,
                               'imageBase64': image_base64,
                               'description': description
                           })
    
    if response.status_code == 200:
        result = response.json()
        print(f"Đã upload thành công: {result['data']['imageUrl']}")
        return result
    else:
        print(f"Lỗi upload: {response.text}")
        return None
```

### 4. Socket.io connection cho AI (Python example)
```python
import socketio

sio = socketio.Client()

@sio.event
def connect():
    print('Connected to server')
    # Báo với server rằng đây là AI
    sio.emit('ai_connected', {'clientType': 'ai', 'version': '1.0'})

@sio.event
def ai_connection_confirmed(data):
    print(f'AI connection confirmed: {data}')

@sio.event
def process_images(data):
    print(f'Received images to process: {data["requestId"]}')
    
    # Xử lý ảnh ở đây
    processed_image_path = process_images_locally(data)
    
    # Upload ảnh đã xử lý
    upload_processed_image(data['requestId'], processed_image_path)
    
    # Báo với server rằng đã xử lý xong
    sio.emit('ai_image_processed', {
        'requestId': data['requestId'],
        'status': 'completed'
    })

# Kết nối
sio.connect('http://localhost:5000')
```

## Error Handling

### Các mã lỗi phổ biến
- **400**: Dữ liệu đầu vào không hợp lệ
- **404**: Không tìm thấy cards hoặc request
- **503**: AI service chưa kết nối
- **500**: Lỗi server

### Xử lý lỗi trong Frontend
```javascript
const handleImageMerge = async (cardId1, cardId2) => {
  try {
    const response = await fetch('/api/image-merge/merge', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cardId1, cardId2 })
    });
    
    const result = await response.json();
    
    if (!result.success) {
      switch (response.status) {
        case 400:
          alert(`Lỗi dữ liệu: ${result.message}`);
          break;
        case 404:
          alert('Không tìm thấy cards');
          break;
        case 503:
          alert('AI service chưa sẵn sàng. Vui lòng thử lại sau.');
          break;
        default:
          alert('Có lỗi xảy ra. Vui lòng thử lại.');
      }
      return;
    }
    
    // Thành công
    console.log('Request ID:', result.data.requestId);
    
  } catch (error) {
    console.error('Network error:', error);
    alert('Lỗi kết nối mạng');
  }
};
```

## Performance Tips

### 1. Batch Processing
- Sử dụng batch API khi cần ghép nhiều cặp ảnh
- Tối đa 10 cặp cards trong một batch request
- Xử lý song song để tăng hiệu suất

### 2. Caching
- Lưu cache các ảnh đã tạo để tránh tạo lại
- Sử dụng requestId để track trạng thái

### 3. Error Recovery
- Implement retry logic cho các request thất bại
- Kiểm tra trạng thái AI trước khi gửi request

## Testing

### 1. Swagger UI
Sử dụng Swagger UI tại: `http://localhost:5000/api-docs`

### 2. Test với Postman
Import collection từ Swagger hoặc tạo requests thủ công

### 3. Unit Testing
```javascript
// Test merge API
describe('Image Merge API', () => {
  test('should merge two cards successfully', async () => {
    const response = await request(app)
      .post('/api/image-merge/merge')
      .send({
        cardId1: 'valid_card_id_1',
        cardId2: 'valid_card_id_2'
      });
    
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.requestId).toBeDefined();
  });
});
```

## Deployment

### 1. Production Environment Variables
```env
MONGODB_URI=mongodb://production-db-url
CLOUDINARY_CLOUD_NAME=production-cloud-name
CLOUDINARY_API_KEY=production-api-key
CLOUDINARY_API_SECRET=production-api-secret
PORT=5000
NODE_ENV=production
```

### 2. Docker Setup
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

### 3. Socket.io CORS cho Production
```javascript
// Trong socketHandler.js
const io = new Server(server, {
  cors: {
    origin: ["https://your-frontend-domain.com"],
    methods: ["GET", "POST"]
  }
});
```
