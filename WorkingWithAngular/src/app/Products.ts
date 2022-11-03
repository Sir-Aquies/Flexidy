import { ɵassignExtraOptionsToRouter } from "@angular/router";

export interface Product {
  name: string,
  brand: string,
  uid: string,
  price: number,
  image?: string
}

export function ProductsArray(amount: number): Product[] {
  const products: Product[] = [];

  const ad: Product = {
    name: "phone",
    brand: "cool",
    uid: "asssssssss",
    price: 2323
  };

  products.push(ad);

  for (var i = 0; i < products.length; i++) {
    const imageRequest = new XMLHttpRequest();
    var url = `https://serpapi.com/playground?q=${products[i].name}&tbm=isch`;

    imageRequest.open("GET", `https://serpapi.com/playground?q=${products[i].name}&tbm=isch`, true);

    imageRequest.onload = function () {
      var status = imageRequest.status;

      if (status === 200) {
        var [img] = imageRequest.response.images_results;
        products[i].image = img;
      }
    }

    imageRequest.send();
  }

  while (amount > 0) {
    getJSON("https://random-data-api.com/api/v2/appliances", function (error: XMLHttpRequest, xhttp: any) {
      if (error === null) {
        const data = xhttp;

        const product: Product = {
          name: data.equipment,
          brand: data.brand,
          uid: data.uid,
          price: Math.round(((Math.random() * 1000) + Number.EPSILON) * 100) / 100
        };
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
