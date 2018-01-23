import React, { Component } from 'react';
import VariantsHelper from '../helpers/VariantsHelper';

class Product extends Component {

  constructor(props) {
    super(props);
    this.state = {
      variants: props.variants,
      multipleVariants: props.variants.length > 1,
      expanded: false
    }
    this.toggleExpand = this.toggleExpand.bind(this);
  }

  toggleExpand() {
    this.setState({expanded: !this.state.expanded})
  }

  renderVariants() {
    if (this.state.multipleVariants) {
      return this.props.variants.map((item, key) => {
        return (
          <div className={'product__variants__item'} key={key} data-sku-id={item.sku_id}>
            <div className={'table__cell'}>{item.variant_name}</div>
            <div className={'table__cell'}>{item.price}</div>
          </div>
        )
      })
    }
  }

  render() {
    return (
      <div className={this.state.expanded ? 'product product--open' : 'product'}>
        <div className={'table'}>
          <div className={'table__cell'}>{this.props.product}</div>
          {this.state.multipleVariants ?
            <button className={'btn--no-style table__cell'} onClick={this.toggleExpand}>
              <span>{this.props.variants.length}<i className='fas fa-chevron-down table__cell__chev'/></span>
            </button>
            : <div className={'table__cell'}/>}
          <div className={'table__cell'}>{VariantsHelper.getPriceFormatted(this.props.variants)}</div>
          <button className={'btn btn--no-margin btn--slide btn--slide-left btn--slide-opacity table__cell table__btn'}
                  onClick={this.props.onEdit.bind(this, this.props.id)}>Edit</button>
        </div>
        <div className={this.state.expanded ? 'product__variants product__variants--open' : 'product__variants'}>
          {this.renderVariants()}
        </div>
      </div>
    );
  }
}

export default Product;
