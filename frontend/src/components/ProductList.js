import React, { Component } from 'react';
import * as ProductActions from '../actions/ProductActions';
import ProductStore from '../stores/ProductStore';
import Product from './Product';
import Modal from './Modal';

class App extends Component {

  constructor() {
    super();
    this.state = {
      productList: [],
      showModal: false
    };
    this.closeModal = this.closeModal.bind(this);
    this.openModal = this.openModal.bind(this);
    this.handleEditProduct = this.handleEditProduct.bind(this);
  }

  componentWillMount() {
    ProductActions.fetchProducts();
    ProductStore.on('change', () => {
      this.setState({productList: ProductStore.getAll()})
    })
  }

  closeModal() {
    ProductActions.setProductToEdit(null);
    this.setState({ showModal: false});
  }

  openModal() {
    this.setState({ showModal: true});
  }

  renderProductList() {
    return this.state.productList.map((item, key) => {
      return <Product key={key} id={item.id} product={item.name} variants={item.variants} onEdit={this.handleEditProduct}/>
    })
  }

  handleEditProduct(id) {
    const chosen = {...this.state.productList.find((item) => {return item.id === id})};
    ProductActions.setProductToEdit(chosen);
    this.setState({showModal: true});
  }

  render() {
    if (ProductStore.isLoading()) {
      return <h1>Loading...</h1>
    }
    return (
      <div className="product-list">
        <button className={'btn btn--add btn--lg btn--center btn--slide btn--slide-up'} onClick={this.openModal}>Add product</button>
        <Modal showModal={this.state.showModal} onClose={this.closeModal}/>
        <div className={'list'}>
          <div className={'table bold'}>
            <div className={'table__cell'}>Name</div>
            <div className={'table__cell'}>Variant</div>
            <div className={'table__cell'}>Price</div>
            <div className={'table__cell'}/>
          </div>
          {this.state.productList.length > 0 && this.renderProductList()}
        </div>
      </div>
    );


  }
}

export default App;
