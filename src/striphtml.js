var fs = require('fs');
const { convert } = require('html-to-text')
const services = require('./services')
var json = JSON.parse(fs.readFileSync('../data/posts-2.json', 'utf8'));

let excerptText = "";

 try {
    (async function() {
        for await (const element of json.data) {
            const { title, excerpt, id} = element
            excerptText = convert(excerpt, { wordwrap: 500, ignoreHref: true });
            try {
                const response = services.searchArticle(title)
                if(response.error == 1)
                {
                    console.log('error: ', response.title)
                }
            } catch (error) {
                console.log('error for general: ', error)
            }
        }
     })();
 } catch (error) {
    console.log('error general: ', error)
 }




// json.data.forEach(async (element) => {
//     let { title, excerpt, id} = element
//     excerptText = convert(excerpt, { wordwrap: 500, ignoreHref: true });
//     console.log('title: ', title)
//     // const response = await services.searchArticle(title)
//     // if(response.meta?.count > 0)
//     // {
//     //     console.log('id: ', response.data[0].id)
//     // }
// });

