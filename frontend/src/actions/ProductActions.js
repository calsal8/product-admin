import dispatcher from '../dispatcher';
import Backend from '../backend';

export async function fetchProducts() {
  dispatcher.dispatch({
    type: 'FETCH_PRODUCTS_PENDING'
  });
  const data = await Backend.getProductContext();
  /* Timeout is only to show that it is loading, not necessary */
  setTimeout(() => {
    dispatcher.dispatch({
      type: 'FETCH_PRODUCTS_FULFILLED',
      payload: data
    })
  }, 500)
}

export async function deleteProduct(product) {
  await Backend.deleteProduct(product.id);
  dispatcher.dispatch({
    type: 'DELETE_PRODUCT_FULFILLED',
    payload: product
  })
}

export async function addOrUpdateProductContext(productName, variants, productId) {
  dispatcher.dispatch({
    type: 'SAVE_PRODUCT_PENDING',
    payload: {name: productName}
  });

  const data = await Backend.addOrUpdateProductContext(productName, variants, productId);
  dispatcher.dispatch({
    type: 'SAVE_PRODUCT_FULFILLED',
    payload: data
  })

}

export function setProductToEdit(product) {
  dispatcher.dispatch({
    type: 'EDIT_PRODUCT_FULFILLED',
    payload: product
  })

}