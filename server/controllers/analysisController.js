const alchemy = require('./alchemyController.js');
const db = require('../models/databaseModel.js');
const logger = require('../logger.js');

module.exports = {
  alchemyAnalyze: (message, callback) => {
    const response = { message };
    alchemy.getEmotions(message, (err, res) => {
      if (res) { response.emotions = res.docEmotions; }
      alchemy.getTaxonomy(message, (err, res) => {
        if (res) { response.taxonomy = res.taxonomy; }
        alchemy.getKeywords(message, (err, res) => {
          if (res) { response.keywords = res.keywords; }
          logger.log('debug', 'analysis compiled', response);
          callback(null, response);
        });
      });
    });
  },
  saveAnalysis: (analysis, callback) => {
    db.saveMessage(analysis.message, (err, res) => {
      logger.log('debug', 'Message saved', res);
      db.saveEmotions(analysis.emotions, analysis.message, (err, res) => {
        logger.log('debug', 'Emotions saved', res);
        db.saveTaxonomy(analysis.taxonomy, analysis.message, (err, res) => {
          logger.log('debug', 'Taxonomy saved', res);
          db.saveKeywords(analysis.keywords, analysis.message, (err, res) => {
            logger.log('debug', 'Keywords saved', res);
            callback(null, analysis);
          });
        });
      });
    });
  },
  getAnalysis: (data, callback) => {
    const response = {};
    db.getEmotions((err, emotions) => {
      response.emotions = emotions[0];
      db.getTaxonomy((err, taxonomy) => {
        response.taxonomy = taxonomy;
        db.getKeywords((err, keywords) => {
          response.keywords = keywords;
          db.getEmotionsOverTime(data, (err, emotionsTime) => {
            response.emotionsTime = emotionsTime;
            db.getAllEmotions((err, allEmotions) => {
              response.allEmotions = allEmotions;
              logger.log('debug', 'analysis pulled', response);
              callback(null, response);
            })
          });
        });
      });
    });
  },
};
