const ProductList = ({ products }) => {
  return (
    <div className="row">
      {products?.length === 0 && <p>No products found.</p>}
      {products.map((product) => (
        <div className="col-lg-4 col-md-6 col-sm-12 mb-4" key={product.id}>
          <div className="card" style={{ width: "18rem" }}>
            <img
              src={product.imageURL || ""}
              className="card-img-top"
              alt={product.name}
            />
            <div className="card-body">
              <h5 className="card-title">{product.name}</h5>
              <p className="card-text">{product.description}</p>
              <p className="card-text">${product.price}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
export default ProductList;
