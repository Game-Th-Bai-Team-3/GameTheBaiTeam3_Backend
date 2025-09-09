# GameTheBaiTeam3_Backend

Backend project cho nhóm Game Thẻ Bài - Team 3  
Dự án sử dụng **Node.js + Express** theo cấu trúc chuẩn.

---

## 🚀 Cài đặt

1. Clone project:
   ```bash
   git clone https://github.com/Game-Th-Bai-Team-3/GameTheBaiTeam3_Backend.git
   cd GameTheBaiTeam3_Backend
2. Cài dependencies:

    npm install

3. Tạo file .env (tham khảo từ .env.example):

🏃 Chạy project

Development (auto reload bằng nodemon):

    npm run dev


Production:

    npm start

📂 Cấu trúc thư mục
src/
 ┣ config/        # Cấu hình (DB, JWT,...)
 ┣ controllers/   # Xử lý logic request
 ┣ middlewares/   # Middleware (auth, validate,...)
 ┣ models/        # Model / Schema DB
 ┣ routes/        # Định nghĩa API endpoint
 ┣ services/      # Business logic
 ┣ utils/         # Helper / Utility functions
 ┣ app.js         # Khởi tạo express app
 ┗ server.js      # Chạy server

test/             # Unit test
.env              # Biến môi trường (local)
.env.example      # File mẫu env
.gitignore
package.json


👨‍💻 Team 3

Leader:

Thân Trần Quốc Huy

Members: 

Hoàng Nguyễn Thế Vinh
Nguyễn Tăng Minh Thông
Lê Cao Khánh Hoàng
Lê Công Minh Quân