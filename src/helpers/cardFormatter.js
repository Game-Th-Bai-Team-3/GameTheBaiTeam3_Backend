// helpers/cardFormatter.js
exports.formatCard = (card) => {
  const cardObj = card.toObject ? card.toObject() : card;

  if (cardObj.image) {
    cardObj.image = { contentType: cardObj.image.contentType };
  }

  return cardObj;
};
