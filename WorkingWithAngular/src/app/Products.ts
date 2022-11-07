export interface Product {
  name: string,
  author?: string,
  uid: string,
  price: number,
  image?: string,
  stringPrice?: string
}

export function ProductsArray(amount: number): Product[] {
  const products: Product[] = [];

  while (amount > 0) {
    getJSON("https://random-data-api.com/api/lorem_ipsum/random_lorem_ipsum", function(error: XMLHttpRequest, xhttp: any) {
      if (error === null) {
        const data = xhttp;

        const product: Product = {
          name: data.short_sentence,
          uid: data.uid,
          price: Math.round(((Math.random() * 100) + Number.EPSILON) * 100) / 100
        };

        product.image = `https://picsum.photos/400/300?random&secId=${crypto.randomUUID()})`;

        getJSON("https://random-data-api.com/api/users/random_user", function (error: XMLHttpRequest, xhttp: any) {
          if (error === null) {
            product.author = xhttp.first_name + " " + xhttp.last_name;
          }
        })

        product.stringPrice = product.price.toFixed(2);

        products.push(product);
}
      else {
        amount++;
      }
    });
    amount--;
  }

  return products;
}

function getJSON(url: string, callback: Function) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.responseType = 'json';
  xhr.onload = function () {
    var status = xhr.status;
    if (status === 200) {
      callback(null, xhr.response);
    } else {
      callback(status, xhr.response);
    }
  };
  xhr.send();
};
