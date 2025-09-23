// helpers/cardFormatter.js
const BASE_URL = (process.env.BASE_URL || "http://localhost:5000").replace(/\/$/, "");

exports.formatCard = (card) => {
  const cardObj = card.toObject ? card.toObject() : card;

  if (cardObj.image && cardObj._id) {
    cardObj.imageUrl = `${BASE_URL}/cards/${cardObj._id}/image`;
    delete cardObj.image;
  } else {
    cardObj.imageUrl = null;
  }

  return cardObj;
};
