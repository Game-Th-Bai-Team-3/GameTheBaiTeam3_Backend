const getProtectedMessage = (user) => {
  return `Xin chào ${user.id},"Role: " ,${user.role}, bạn có quyền truy cập API protected!`;
};

module.exports = { getProtectedMessage };
