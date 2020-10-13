const logger = require('./logger');

const lib = {};

// Parse a JSON string to an object in all cases, without throwing
lib.parseJsonToObject = function parseJsonToObject(jsonString) {
  try {
    if (typeof jsonString === 'string' && jsonString.length > 0) {
      return JSON.parse(jsonString);
    }
    return {};
  } catch (err) {
    logger.debug(
      `parseJsonToObject: An error occurred while trying to parse "${jsonString}". ${err}`
    );
    return {};
  }
};

lib.isTopicEqualToTopicWithWildCard = function isTopicEqualToTopicWithWildCard(
  topic,
  topicWithWildCard
) {
  const wildCardIndex = topicWithWildCard.indexOf('#');

  if (wildCardIndex === -1 || wildCardIndex > topic.length) {
    return false;
  }

  const substrTopicWildCard = topicWithWildCard.substr(0, wildCardIndex);
  const substrTopic = topic.substr(0, wildCardIndex);

  return substrTopic === substrTopicWildCard;
};

module.exports = lib;
