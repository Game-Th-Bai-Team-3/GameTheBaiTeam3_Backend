const Card = require('../models/cards');
const ImageHistory = require('../models/imageHistory');

class ImageMergeController {
  // API để nhận 2 ID card và emit qua socket cho AI
  static async mergeImages(req, res) {
    try {
      const { cardId1, cardId2 } = req.body;

      // Validate input
      if (!cardId1 || !cardId2) {
        return res.status(400).json({
          success: false,
          message: 'Vui lòng cung cấp cả hai cardId'
        });
      }

      if (cardId1 === cardId2) {
        return res.status(400).json({
          success: false,
          message: 'Hai card ID không được giống nhau'
        });
      }

      // Lấy thông tin 2 cards từ database
      const [card1, card2] = await Promise.all([
        Card.findById(cardId1),
        Card.findById(cardId2)
      ]);

      if (!card1 || !card2) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy một hoặc cả hai cards'
        });
      }

      if (!card1.image || !card2.image) {
        return res.status(400).json({
          success: false,
          message: 'Một hoặc cả hai cards không có ảnh'
        });
      }

      // Lấy socket handler từ app
      const socketHandler = req.app.get('socketHandler');
      
      // Kiểm tra AI có kết nối không
      if (!socketHandler.isAIConnected()) {
        return res.status(503).json({
          success: false,
          message: 'AI service chưa kết nối. Vui lòng thử lại sau.'
        });
      }

      // Chuẩn bị dữ liệu để gửi cho AI
      const imageData = {
        requestId: `merge_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        card1: {
          id: card1._id,
          name: card1.name,
          imageUrl: card1.image,
          rarity: card1.rarity,
          element: card1.element
        },
        card2: {
          id: card2._id,
          name: card2.name,
          imageUrl: card2.image,
          rarity: card2.rarity,
          element: card2.element
        }
      };

      // Lưu vào lịch sử
      const historyRecord = new ImageHistory({
        requestId: imageData.requestId,
        originalCards: [
          {
            cardId: card1._id,
            name: card1.name,
            imageUrl: card1.image,
            rarity: card1.rarity,
            element: card1.element
          },
          {
            cardId: card2._id,
            name: card2.name,
            imageUrl: card2.image,
            rarity: card2.rarity,
            element: card2.element
          }
        ],
        status: 'processing',
        metadata: {
          createdAt: new Date(),
          description: `Merge ${card1.name} + ${card2.name}`
        }
      });
      await historyRecord.save();

      // Emit dữ liệu cho AI
      socketHandler.emitImageToAI(imageData);

      // Trả về response thành công
      res.status(200).json({
        success: true,
        message: 'Đã gửi yêu cầu ghép ảnh cho AI',
        data: {
          requestId: imageData.requestId,
          card1: {
            id: card1._id,
            name: card1.name,
            imageUrl: card1.image
          },
          card2: {
            id: card2._id,
            name: card2.name,
            imageUrl: card2.image
          }
        }
      });

    } catch (error) {
      console.error('Error in mergeImages:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi xử lý yêu cầu ghép ảnh',
        error: error.message
      });
    }
  }

  // API để AI upload ảnh đã tạo và lưu vào Cloudinary
  static async uploadAIGeneratedImage(req, res) {
    try {
      const cloudinary = require('../utils/cloudinaryConfig');
      const { requestId, imageBase64, description } = req.body;

      // Validate input
      if (!requestId || !imageBase64) {
        return res.status(400).json({
          success: false,
          message: 'Vui lòng cung cấp requestId và imageBase64'
        });
      }

      // Upload ảnh lên Cloudinary
      const uploadResult = await cloudinary.uploader.upload(
        `data:image/png;base64,${imageBase64}`,
        {
          folder: 'ai-generated-images',
          public_id: `merged_${requestId}`,
          resource_type: 'image',
          transformation: [
            { quality: 'auto', fetch_format: 'auto' }
          ]
        }
      );

      // Cập nhật lịch sử
      const historyRecord = await ImageHistory.findOne({ requestId });
      if (historyRecord) {
        historyRecord.status = 'completed';
        historyRecord.generatedImage = {
          url: uploadResult.secure_url,
          publicId: uploadResult.public_id,
          cloudinaryId: uploadResult.public_id
        };
        historyRecord.metadata.completedAt = new Date();
        historyRecord.metadata.description = description || 'Ảnh được tạo bởi AI';
        historyRecord.processingTime = new Date() - historyRecord.metadata.createdAt;
        await historyRecord.save();
      }

      // Lấy socket handler từ app
      const socketHandler = req.app.get('socketHandler');

      // Chuẩn bị dữ liệu để emit cho frontend
      const imageData = {
        requestId,
        imageUrl: uploadResult.secure_url,
        publicId: uploadResult.public_id,
        description: description || 'Ảnh được tạo bởi AI',
        createdAt: new Date().toISOString(),
        originalCards: historyRecord ? historyRecord.originalCards : []
      };

      // Emit ảnh mới đến frontend
      socketHandler.emitNewImageToFrontend(imageData);

      // Trả về response thành công
      res.status(200).json({
        success: true,
        message: 'Đã lưu ảnh và gửi đến frontend',
        data: imageData
      });

    } catch (error) {
      console.error('Error in uploadAIGeneratedImage:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi upload ảnh từ AI',
        error: error.message
      });
    }
  }

  // API để kiểm tra trạng thái kết nối
  static async getConnectionStatus(req, res) {
    try {
      const socketHandler = req.app.get('socketHandler');
      
      res.status(200).json({
        success: true,
        data: {
          aiConnected: socketHandler.isAIConnected(),
          frontendClients: socketHandler.getFrontendClientsCount(),
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('Error in getConnectionStatus:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi kiểm tra trạng thái kết nối',
        error: error.message
      });
    }
  }

  // API để ghép nhiều ảnh cùng lúc (batch processing)
  static async batchMergeImages(req, res) {
    try {
      const { cardPairs } = req.body;

      // Validate input
      if (!cardPairs || !Array.isArray(cardPairs) || cardPairs.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Vui lòng cung cấp mảng cardPairs hợp lệ'
        });
      }

      if (cardPairs.length > 10) {
        return res.status(400).json({
          success: false,
          message: 'Tối đa 10 cặp cards trong một lần xử lý'
        });
      }

      const socketHandler = req.app.get('socketHandler');
      if (!socketHandler.isAIConnected()) {
        return res.status(503).json({
          success: false,
          message: 'AI service chưa kết nối. Vui lòng thử lại sau.'
        });
      }

      const results = [];
      const errors = [];

      // Xử lý từng cặp cards
      for (let i = 0; i < cardPairs.length; i++) {
        try {
          const { cardId1, cardId2 } = cardPairs[i];

          if (!cardId1 || !cardId2) {
            errors.push({
              index: i,
              error: 'Thiếu cardId1 hoặc cardId2'
            });
            continue;
          }

          if (cardId1 === cardId2) {
            errors.push({
              index: i,
              error: 'Hai card ID không được giống nhau'
            });
            continue;
          }

          // Lấy thông tin cards
          const [card1, card2] = await Promise.all([
            Card.findById(cardId1),
            Card.findById(cardId2)
          ]);

          if (!card1 || !card2) {
            errors.push({
              index: i,
              error: 'Không tìm thấy một hoặc cả hai cards'
            });
            continue;
          }

          if (!card1.image || !card2.image) {
            errors.push({
              index: i,
              error: 'Một hoặc cả hai cards không có ảnh'
            });
            continue;
          }

          const requestId = `batch_${Date.now()}_${i}_${Math.random().toString(36).substr(2, 9)}`;
          
          const imageData = {
            requestId,
            card1: {
              id: card1._id,
              name: card1.name,
              imageUrl: card1.image,
              rarity: card1.rarity,
              element: card1.element
            },
            card2: {
              id: card2._id,
              name: card2.name,
              imageUrl: card2.image,
              rarity: card2.rarity,
              element: card2.element
            }
          };

          // Lưu vào lịch sử
          const historyRecord = new ImageHistory({
            requestId,
            originalCards: [
              {
                cardId: card1._id,
                name: card1.name,
                imageUrl: card1.image,
                rarity: card1.rarity,
                element: card1.element
              },
              {
                cardId: card2._id,
                name: card2.name,
                imageUrl: card2.image,
                rarity: card2.rarity,
                element: card2.element
              }
            ],
            status: 'processing',
            metadata: {
              createdAt: new Date(),
              description: `Batch merge ${card1.name} + ${card2.name}`,
              batchIndex: i
            }
          });
          await historyRecord.save();

          // Emit cho AI
          socketHandler.emitImageToAI(imageData);

          results.push({
            index: i,
            requestId,
            status: 'processing',
            card1: {
              id: card1._id,
              name: card1.name,
              imageUrl: card1.image
            },
            card2: {
              id: card2._id,
              name: card2.name,
              imageUrl: card2.image
            }
          });

        } catch (error) {
          errors.push({
            index: i,
            error: error.message
          });
        }
      }

      res.status(200).json({
        success: true,
        message: `Đã xử lý ${results.length} yêu cầu thành công, ${errors.length} lỗi`,
        data: {
          totalRequests: cardPairs.length,
          successful: results.length,
          errors: errors.length,
          results,
          errors
        }
      });

    } catch (error) {
      console.error('Error in batchMergeImages:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi xử lý batch merge',
        error: error.message
      });
    }
  }

  // API để lấy lịch sử ảnh đã tạo
  static async getImageHistory(req, res) {
    try {
      const { page = 1, limit = 10, status, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

      const query = {};
      if (status) {
        query.status = status;
      }

      const sort = {};
      sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

      const skip = (parseInt(page) - 1) * parseInt(limit);

      const [histories, total] = await Promise.all([
        ImageHistory.find(query)
          .populate('originalCards.cardId', 'name rarity element')
          .sort(sort)
          .skip(skip)
          .limit(parseInt(limit)),
        ImageHistory.countDocuments(query)
      ]);

      res.status(200).json({
        success: true,
        data: {
          histories,
          pagination: {
            currentPage: parseInt(page),
            totalPages: Math.ceil(total / parseInt(limit)),
            totalItems: total,
            itemsPerPage: parseInt(limit)
          }
        }
      });

    } catch (error) {
      console.error('Error in getImageHistory:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi lấy lịch sử ảnh',
        error: error.message
      });
    }
  }

  // API để lấy chi tiết một request
  static async getImageRequestDetail(req, res) {
    try {
      const { requestId } = req.params;

      const history = await ImageHistory.findOne({ requestId })
        .populate('originalCards.cardId', 'name rarity element stats');

      if (!history) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy request với ID này'
        });
      }

      res.status(200).json({
        success: true,
        data: history
      });

    } catch (error) {
      console.error('Error in getImageRequestDetail:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi lấy chi tiết request',
        error: error.message
      });
    }
  }

  // API để xóa ảnh đã tạo
  static async deleteGeneratedImage(req, res) {
    try {
      const { requestId } = req.params;
      const cloudinary = require('../utils/cloudinaryConfig');

      const history = await ImageHistory.findOne({ requestId });
      if (!history) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy request với ID này'
        });
      }

      // Xóa ảnh từ Cloudinary nếu có
      if (history.generatedImage && history.generatedImage.publicId) {
        try {
          await cloudinary.uploader.destroy(history.generatedImage.publicId);
        } catch (cloudinaryError) {
          console.error('Error deleting from Cloudinary:', cloudinaryError);
        }
      }

      // Xóa record từ database
      await ImageHistory.deleteOne({ requestId });

      res.status(200).json({
        success: true,
        message: 'Đã xóa ảnh và lịch sử thành công'
      });

    } catch (error) {
      console.error('Error in deleteGeneratedImage:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi xóa ảnh',
        error: error.message
      });
    }
  }

  // API để ghép ảnh với nhiều options
  static async advancedMergeImages(req, res) {
    try {
      const { 
        cardIds, 
        mergeType = 'fusion', // fusion, combination, evolution
        style = 'default', // default, anime, realistic, cartoon
        background = 'transparent', // transparent, solid, gradient
        effects = [], // array of effects
        outputFormat = 'png', // png, jpg, webp
        quality = 'high' // low, medium, high
      } = req.body;

      // Validate input
      if (!cardIds || !Array.isArray(cardIds) || cardIds.length < 2) {
        return res.status(400).json({
          success: false,
          message: 'Cần ít nhất 2 cardIds'
        });
      }

      if (cardIds.length > 5) {
        return res.status(400).json({
          success: false,
          message: 'Tối đa 5 cards trong một lần ghép'
        });
      }

      // Lấy thông tin tất cả cards
      const cards = await Card.find({ _id: { $in: cardIds } });
      
      if (cards.length !== cardIds.length) {
        return res.status(404).json({
          success: false,
          message: 'Một hoặc nhiều cards không tồn tại'
        });
      }

      // Kiểm tra tất cả cards đều có ảnh
      const missingImages = cards.filter(card => !card.image);
      if (missingImages.length > 0) {
        return res.status(400).json({
          success: false,
          message: `Cards sau không có ảnh: ${missingImages.map(c => c.name).join(', ')}`
        });
      }

      const socketHandler = req.app.get('socketHandler');
      if (!socketHandler.isAIConnected()) {
        return res.status(503).json({
          success: false,
          message: 'AI service chưa kết nối. Vui lòng thử lại sau.'
        });
      }

      const requestId = `advanced_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Chuẩn bị dữ liệu nâng cao
      const advancedImageData = {
        requestId,
        cards: cards.map(card => ({
          id: card._id,
          name: card.name,
          imageUrl: card.image,
          rarity: card.rarity,
          element: card.element,
          stats: card.stats
        })),
        options: {
          mergeType,
          style,
          background,
          effects,
          outputFormat,
          quality
        }
      };

      // Lưu vào lịch sử
      const historyRecord = new ImageHistory({
        requestId,
        originalCards: cards.map(card => ({
          cardId: card._id,
          name: card.name,
          imageUrl: card.image,
          rarity: card.rarity,
          element: card.element
        })),
        status: 'processing',
        metadata: {
          createdAt: new Date(),
          description: `Advanced merge: ${cards.map(c => c.name).join(' + ')}`,
          mergeOptions: advancedImageData.options
        }
      });
      await historyRecord.save();

      // Emit cho AI với dữ liệu nâng cao
      socketHandler.emitImageToAI(advancedImageData);

      res.status(200).json({
        success: true,
        message: 'Đã gửi yêu cầu ghép ảnh nâng cao cho AI',
        data: {
          requestId,
          cards: advancedImageData.cards,
          options: advancedImageData.options
        }
      });

    } catch (error) {
      console.error('Error in advancedMergeImages:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi xử lý yêu cầu ghép ảnh nâng cao',
        error: error.message
      });
    }
  }
}

module.exports = ImageMergeController;
