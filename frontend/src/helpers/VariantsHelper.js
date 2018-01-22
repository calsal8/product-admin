
class VariantsHelper {


  getPriceFormatted(variants) {
    if (variants.length > 1) {
      const priceRange = variants.reduce((acc, val) => {
          acc[0] = ( acc[0] === undefined || val.price < acc[0] ) ? val.price : acc[0];
          acc[1] = ( acc[1] === undefined || val.price > acc[1] ) ? val.price : acc[1];
          return acc;
        }, []
      );
      return `${priceRange[0]} - ${priceRange[1]}`
    } else {
      return `${variants[0].price}`
    }
  }

}

let variantsHelper = new VariantsHelper();
export default variantsHelper;
