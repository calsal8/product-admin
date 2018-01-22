
class Backend {
  apiUrl = 'http://localhost:8000/';

  async getProduct(id) {
    const res = await fetch(`${this.apiUrl}api/product/${id}/`);
    return await res.json();
  }

  async addProduct(name, callback) {
    const res = await fetch(`${this.apiUrl}api/product/`, {
      method: "POST",
      headers: new Headers({'Content-Type': 'application/json'}),
      body: JSON.stringify({name: name})
    });

    const json = await res.json();
    if (callback && typeof(callback) === "function") callback();
    return json;
  }

  async getAllProducts() {
    const res = await fetch(`${this.apiUrl}api/product/`);
    return await res.json();
  }

  async getAllSKUs() {
    const res = await fetch(`${this.apiUrl}api/sku/`);
    return await res.json();
  }

  async getProductContext() {
    const res = await fetch(`${this.apiUrl}contexts/product-list/`);
    return await res.json();
  }

  async addOrUpdateProductContext(productName, variants, productId) {
    const payload = {
      name: productName,
      variants: variants
    };

    if (productId) {
      payload['id'] = productId
    }

    /*if (!productId || productName == null || !variants || !variants.constructor === Array) {
      return { message: 'Error: Something went wrong. Try again with different values' }
    }*/

    const res = await fetch(`${this.apiUrl}contexts/save-product/`, {
      method: "POST",
      headers: new Headers({'Content-Type': 'application/json'}),
      body: JSON.stringify(payload)
    });

    const json = await res.json();
    console.log(json);
    return json;
  }

  async addSKU(price, productId, variantName = 'Standard') {
    const payload = {
      price: price,
      product: productId,
      variant_name: variantName
    };

    const res = await fetch(`${this.apiUrl}api/sku/`, {
      method: "POST",
      headers: new Headers({'Content-Type': 'application/json'}),
      body: JSON.stringify(payload)
    });

    const json = await res.json();
    console.log(json);
    return json;
  }

  async deleteProduct(id) {
    const res = await fetch(`${this.apiUrl}api/product/${id}`, {
      method: "DELETE",
      headers: new Headers({'Content-Type': 'application/json'}),
    });
    console.log(res);
    return res;
  }

  async deleteSKU(id) {
    const res = await fetch(`${this.apiUrl}api/sku/${id}`, {
      method: "DELETE",
      headers: new Headers({'Content-Type': 'application/json'}),
    });
    console.log(res);
    return res;
  }

  async updateSKU(id, variantName, price) {
    const payload = {
      price: price,
      variant_name: variantName
    };

    const res = await fetch(`${this.apiUrl}api/sku/${id}/`, {
      method: "PATCH",
      headers: new Headers({'Content-Type': 'application/json'}),
      body: JSON.stringify(payload)
    });

    const json = await res.json();
    console.log(json);
    return json;
  }

}

let backend = new Backend();
export default backend;
