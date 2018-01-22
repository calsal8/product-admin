import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import ProductList from './components/ProductList';


class App extends Component {

  constructor() {
    super();
    this.state = {
      productList: [],
      showModal: false,
      chosenProduct: null
    };
    this.toggleModal = this.toggleModal.bind(this);
    this.handleEditProduct = this.handleEditProduct.bind(this);
  }

  toggleModal() {
    this.setState({ showModal: !this.state.showModal});
  }

  handleEditProduct(id) {
    console.log(this.state.productList[id]);
    this.setState({showModal: true, chosenProduct: this.state.productList[id]})
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Header</h1>
        </header>
        <ProductList/>
      </div>
    );
  }
}

export default App;
