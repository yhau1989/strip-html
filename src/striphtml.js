var fs = require("fs");
var arrayPaginate = require("array-paginate");
const services = require("./services");
const mongodb = require("./mongodb/mongodb");
var json = JSON.parse(fs.readFileSync("../data/posts-2.json", "utf8"));
var errorList1 = JSON.parse(fs.readFileSync("../data/migrations.json", "utf8"));


const totalItems = json.data.length;
const items = json.data;
const rowsPerPage = 100;
const totalsPages = totalItems / rowsPerPage;
let datas = {};
console.log('Pages: ', totalsPages);


async function pross(){
  let it = 11
  while(it <= 129)
  {
    datas = arrayPaginate(items, it, rowsPerPage);
    await run(datas, it);
    it++;
  }
}

async function pross2(dataArticles){
  const {totalPages } = arrayPaginate(dataArticles, 1, rowsPerPage)
  let it = 1
  while(it <= totalPages)
  {
    datas = arrayPaginate(dataArticles, it, rowsPerPage);
    await run(datas, it);
    it++;
  }
}




async function run(_requests, page) {
  const requests = _requests.docs.map((element) => services.searchArticle(element));
  console.log('savelogMongo page: ', page);
 const runData  = await Promise.all(requests)
  .then((values) => ({ error: 0, values }))
  .catch((reason) => {
    console.log("reason: ", reason);
    return { error: 1, reason };
  });

  if (runData.error == 0) {
    // console.log('linea 52 ', runData.values);
    const runData2 = await updateExcerptByIdArticle(runData.values);
    if(runData2.error == 0)
    {
      console.log('linea 53: ', runData2.values);
      await savelogMongo(runData2.values);
    }
  }
}



async function updateExcerptByIdArticle(articlesData) {
  
  const requestsUpdates = articlesData.map((element) => services.updateExcerpt(element));

  const data = await Promise.all(requestsUpdates)
    .then((values) => ({ error: 0, values }))
    .catch((reason) => {
      console.log("updateExcerptByIdArticle error reason: ", reason);
      return { error: 1, reason };
    });

  return data;
}

async function savelogMongo(data) {
  await mongodb.AddArticlesMigration(data);
  console.log('savelogMongo fin..');
}


// pross();

// resagados

const errorsItems = errorList1.map(x => x.wordpressId);
var unique = [...new Set(errorsItems)]

// console.log('unique: ', unique.length);

const newItems = [];

unique.forEach(element => {
  newItems.push(json.data.filter(x => x.id == element)[0]);
});

// newItems.push(json.data.filter(x => x.id == 55472)[0]);

// console.log(newItems);
// pross2(newItems);
console.log(services.b64Sam);