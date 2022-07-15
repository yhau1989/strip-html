
const axios = require('axios').default;

// const urlApi = 'https://cms.laprensa.org/jsonapi/node/article?filter[title]=' 
const urlApi = 'https://dev-laprensa-drupal.pantheonsite.io/jsonapi/node/article?filter[title]=' 


const searchArticle = async (title) => {
    try {
        const response = await axios.get(`${urlApi}${title}`);
        const jsonData = response.data
        // console.log('id: ', jsonData);
        return { error: 0, title}
      } catch (error) {
        // console.error('searchArticle error: ', error);
        return { error: 1, title, errorDetail: error};
      }
}


module.exports = {
    searchArticle
}