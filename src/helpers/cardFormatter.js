// helpers/cardFormatter.js
exports.formatCard = (card) => {
  const cardObj = card.toObject ? card.toObject() : card;

  if (cardObj.image && cardObj._id) {
    //tra ve url api ảnh thay vì buffer
    cardObj.imageUrl = `/cards/${cardObj._id}/image`;
   delete cardObj.image; // Xóa trường image gốc nếu không cần thiết
  }else{
    cardObj.imageUrl = null;
  }

  return cardObj;
};
