import React from 'react';
import ReactModal from 'react-modal'
import * as ProductActions from '../actions/ProductActions';
import ProductStore from '../stores/ProductStore';
import VariantsHelper from '../helpers/VariantsHelper'

ReactModal.setAppElement('#root');

class Modal extends React.Component {
  constructor() {
    super();
    this.state = {
      productInfo: {
        productName: '',
        productPrice: ''
      },
      variantInputs: [],
      productToEdit: ProductStore.getProductToEdit()
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.renderProductFormGroup = this.renderProductFormGroup.bind(this);
    this.addVariantInputs = this.addVariantInputs.bind(this);
    this.handleVariantInputChange = this.handleVariantInputChange.bind(this);
    this.handleProductInputChange = this.handleProductInputChange.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.validatedData = this.validatedData.bind(this);
  }

  componentWillMount() {
    ProductStore.on('editChange', () => {
      const productToEdit = ProductStore.getProductToEdit();
      if (productToEdit) {
        this.setState({
          variantInputs: productToEdit.variants,
          productToEdit: productToEdit,
          productInfo: {
            productName: productToEdit.name,
            productPrice: VariantsHelper.getPriceFormatted(productToEdit.variants)
          }
        })
      } else {
        this.setState({
          variantInputs: [],
          productToEdit: productToEdit,
          productInfo: {
            productName: '',
            productPrice: ''
          },
        })
      }
    });
  }

  async handleSubmit (e) {
    e.preventDefault();
    const productId = this.state.productToEdit ? this.state.productToEdit.id : null;
    if (this.state.variantInputs.length > 0) {
      ProductActions.addOrUpdateProductContext(
        this.state.productInfo.productName,
        this.state.variantInputs,
        productId);
    } else {
      ProductActions.addOrUpdateProductContext(
        this.state.productInfo.productName,
        [{
          variant_name: 'Standard',
          price: this.state.productInfo.productPrice,
          sku_id: null
        }],
        productId);
    }
    this.props.onClose();
  }

  handleVariantInputChange(event, index, property) {
    let inputsCopy = [ ...this.state.variantInputs ];
    inputsCopy[index][property] = event.target.value;
    this.setState({ variantInputs: inputsCopy });
  }

  handleProductInputChange(event, property) {
    let productCopy = { ...this.state.productInfo };
    productCopy[property] = event.target.value;
    this.setState({productInfo: productCopy})
  }

  handleDelete() {
    ProductActions.deleteProduct(this.state.productToEdit);
    this.props.onClose();
  }

  validatedData() {
    if (this.state.variantInputs.length > 0) {
      const validatedVariants = this.state.variantInputs.every(i => i.variant_name && i.price);
      return !!this.state.productInfo.productName &&
        validatedVariants;
    } else {
      return !!this.state.productInfo.productName &&
        !!this.state.productInfo.productPrice;
    }
  }

  removeVariantInput(index) {
    let inputsCopy = [ ...this.state.variantInputs ];
    inputsCopy.splice(index, 1);
    this.setState({ variantInputs: inputsCopy });
  }

  addVariantInputs(name, price, sku = null) {
    let inputsCopy = [...this.state.variantInputs];
    inputsCopy.push({
      variant_name: name || '',
      price: price || '',
      sku_id: sku
    });

    this.setState({ variantInputs: inputsCopy });
  }

  renderProductFormGroup() {
    if (this.state.productToEdit) {
      const priceDisabled = this.state.productToEdit.variants.length > 1;
        return <div className={'form__group'}>
          <div className={'form__product'}>
            <input type={'text'} id={'product-name'} className={this.state.productInfo.productName ? 'valid' : ''}
                   value={this.state.productInfo.productName} autoComplete='off'
                   onChange={(e) => this.handleProductInputChange(e, 'productName')}/>
            <label htmlFor={'product-name'}><span>Name</span></label>
          </div>
          <div className={'form__product'}>
            <input type={priceDisabled ? 'text' : 'number'} id={'product-price'} className={this.state.productInfo.productPrice ? 'valid' : ''}
                   value={this.state.productInfo.productPrice} autoComplete='off'
                   onChange={(e) => this.handleProductInputChange(e, 'productPrice')}
                   disabled={priceDisabled}/>
            <label htmlFor={'product-price'}><span>Price</span></label>
          </div>
        </div>
    } else {
      return <div className={'form__group'}>
        <div className={'form__product'}>
          <input type={'text'} id={'product-name'} autoComplete='off'
                 className={this.state.productInfo.productName ? 'valid' : ''}
                 value={this.state.productInfo.productName}
                 onChange={(e) => this.handleProductInputChange(e, 'productName')}/>
          <label htmlFor={'product-name'}><span>Name</span></label>
        </div>
        <div className={'form__product'}>
          <input type={'number'} id={'product-price'} className={this.state.productInfo.productPrice ? 'valid' : ''}
                 autoComplete='off' value={this.state.productInfo.productPrice}
                 onChange={(e) => this.handleProductInputChange(e, 'productPrice')}/>
          <label htmlFor={'product-price'}><span>Price</span></label>
        </div>
      </div>
    }
  }

  renderVariantInputs() {
    if (this.state.variantInputs.length > 0) {
      return this.state.variantInputs.map((item, i) => {
        return <div key={i} className={'form__group'}>
          <div className={'form__variant'}>
            <input type={'text'} className={item.variant_name ? 'valid' : ''} id={`variant-name-${i}`} value={item.variant_name}
                   onChange={(e) => this.handleVariantInputChange(e, i, 'variant_name')} autoComplete='off'/>
            <label htmlFor={`variant-name-${i}`}><span>Name</span></label>
          </div>
          <div className={'form__variant'}>
            <input type={'number'} className={item.price ? 'valid' : ''} id={`variant-price-${i}`} value={item.price}
                   onChange={(e) => this.handleVariantInputChange(e, i, 'price')} autoComplete='off'/>
            <label htmlFor={`variant-price-${i}`}><span>Price</span></label>
          </div>
          <button type={'button'} className={'btn btn--warning btn--no-padding form__delete-btn'} onClick={()=> this.removeVariantInput(i)}><i className={'far fa-minus-square'}/></button>
        </div>
      })
    }
  }

  render () {
    return <div>
      <ReactModal
        isOpen={this.props.showModal}
        contentLabel="Administrate product">
        <h3 className={'headline'}>{this.state.productToEdit !== null ? 'Edit Product' : 'Add Product'}</h3>
        <form id={'form'} className={'form'} onSubmit={this.handleSubmit}>
          {this.renderProductFormGroup()}
          <div className={'form__variants'}>
            <h4 className={'headline'}>Variants</h4>
            {this.renderVariantInputs()}
            <button type={'button'} className={'btn btn--add btn--slide btn--slide-right'} onClick={() => this.addVariantInputs()}>Add Variant</button>
          </div>
          <button type={'submit'} className={'btn btn--add btn--lg btn--slide btn--slide-up'} disabled={!this.validatedData()}>Save <i className={'far fa-check-circle'}/></button>
        </form>
        {this.state.productToEdit && <button className={'btn btn--danger ReactModal__delete'} onClick={this.handleDelete}>Delete!</button>}
        <button className={'btn btn--xl btn--no-margin btn--no-padding ReactModal__close'} onClick={this.props.onClose}><i className={'far fa-window-close'}/></button>
      </ReactModal>
    </div>
  }
}

export default Modal;
