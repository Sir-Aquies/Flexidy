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

        //product.image = `https://picsum.photos/400/300?random&secId=${crypto.randomUUID()})`;
        //product.image = `https://picsum.photos/id/${Math.floor(Math.random() * 1085)}/400/300`;

        getPicsum(Math.floor(Math.random() * 1085), function (error: XMLHttpRequest, data: any) {
          if (error === null) {
            product.image = data;
          }
        })

        //TODO - try this.
        //product.image = `https://thispersondoesnotexist.com/`;

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

function getPicsum(id: number, callback: Function) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', `https://picsum.photos/id/${id}/400/300`, true);

  xhr.onload = function () {
    var status = xhr.status;
    if (status === 200) {
      callback(null, xhr.responseURL);
    } else {
      callback(status, xhr.responseURL);
    }
  };
  xhr.send();
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
