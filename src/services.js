const axios = require("axios").default;
const btoa = require("btoa");
const { convert } = require("html-to-text");

const b64 = btoa("David Disch:Khh47evWcPBv8LP");
const urlApi = "https://cms.laprensa.org/";
// const urlApi = 'https://dev-laprensa-drupal.pantheonsite.io/jsonapi/node/article?filter[title]='

const searchArticle = async ({ title, id, content, excerpt }) => {
  return await axios
    .get(
      `${urlApi}jsonapi/node/article?filter[title]=${encodeURIComponent(
        title
      )}`,
      { timeout: 10000 }
    )
    .then((response) => {
      const jsonData = response.data;
      const { status, statusText } = response;
      return {
        error: 0,
        title,
        statusAxios: { status, statusText },
        cant: jsonData.meta.count,
        article: {
          id: jsonData.data[0].id,
          langcode: jsonData.data[0].attributes.langcode,
          summary: jsonData.data[0].attributes.body.summary,
          wordpressId: id,
          content,
          excerpt,
        },
      };
    })
    .catch((error) => {
      return { error: 1, title, wordpressId: id, errorDetail: error };
    });
};

const updateExcerpt = async (articleObject) => {
  if (articleObject.error == 0 && articleObject.cant > 0) {
    if(articleObject.article.summary.trim().length > 0)
    {
      // console.log('articleObject ok: ', articleObject);
      return { 
        updateExcerptError: 0,
        articleId: articleObject.article.id,
        wordpressId: articleObject.article.wordpressId
      }
    }

    const config = {
      headers: {
        "Content-Type": "application/vnd.api+json",
        Accept: "application/vnd.api+json",
        Authorization: `Basic ${b64}`,
      },
    };

    const data = {
      data: {
        type: "node--article",
        id: articleObject.article.id,
        attributes: {
          body: {
            value: articleObject.article.content,
            format: "full_html",
            summary: convert(articleObject.article.excerpt, {
              wordwrap: 500,
              ignoreHref: true,
            }),
          },
        },
      },
    };

    const spanishLangCode = articleObject.article.langcode == 'es' ? 'es/' : '';

    return await axios
      .patch(
        `${urlApi}${spanishLangCode}jsonapi/node/article/${articleObject.article.id}`,
        data,
        config
      )
      .then((response) => {
        const jsonData = response.data;
        return {
          updateExcerptError: 0,
          articleId: articleObject.article.id,
          wordpressId: articleObject.article.wordpressId,
        };
      })
      .catch((error) => {
        // console.log('updateExcerpt: ', error.response);
        return {
          updateExcerptError: 1,
          errorDetail: error.response?.status,
          articleId: articleObject.article.id,
          wordpressId: articleObject.article.wordpressId,
        };
      });
  }

  // console.log('articleObject 99: ', articleObject);
  return {
    updateExcerptError: 99,
    errorDetail: {
      error: articleObject.error,
      cant: articleObject.cant,
      axiosErrorCode: articleObject.errorDetail.code,
      status: articleObject.errorDetail.response?.code,
    },
    articleId: null,
    wordpressId: articleObject.wordpressId,
    articleObject: articleObject.title,
  };
};

module.exports = {
  searchArticle,
  updateExcerpt,
};
