import { EventEmitter } from 'events';
import dispatcher from '../dispatcher'

class ProductListStore extends EventEmitter {
  constructor() {
    super();
    this.products = [];
    this.loading = false;
    this.productToEdit = null;
  }

  deleteProduct(product) {
    this.products = this.products.filter((item) => {
      return item.id !== product.id
    });
    this.emit('change');
  }

  saveProduct(product) {
    const matchIndex = this.products.findIndex(obj => obj.id === product.id);
    if (matchIndex > -1) {
      this.products[matchIndex] = {
        variants: product.variants,
        id: product.id,
        name: product.name
      }
    } else {
      this.products.push({
        variants: product.variants,
        id: product.id,
        name: product.name
      });
    }
    this.emit('change');
  }

  setProductToEdit(product) {
    this.productToEdit = product;
    this.emit('editChange');
  }

  getProductToEdit() {
    return this.productToEdit;
  }

  getAll() {
    return this.products;
  }

  isLoading() {
    return this.loading;
  }

  handleActions(action) {
    switch (action.type) {
      case 'FETCH_PRODUCTS_PENDING': {
        this.loading = true;
        break;
      }
      case 'FETCH_PRODUCTS_FULFILLED': {
        this.loading = false;
        this.products = action.payload;
        this.emit('change');
        break;
      }
      case 'EDIT_PRODUCT_FULFILLED': {
        this.setProductToEdit(action.payload);
        break;
      }
      case 'SAVE_PRODUCT_FULFILLED': {
        this.saveProduct(action.payload);
        break;
      }
      case 'DELETE_PRODUCT_FULFILLED': {
        this.deleteProduct(action.payload);
        break;
      }
      default:
    }
  }
}

const productListStore = new ProductListStore();
dispatcher.register(productListStore.handleActions.bind(productListStore));
export default productListStore;