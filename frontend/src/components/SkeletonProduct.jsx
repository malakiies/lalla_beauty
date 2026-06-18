const SkeletonProduct = () => {
  return (
    <div className="card product-card h-100 border-0">
      <div className="product-img-wrapper skeleton" style={{ height: '330px' }}></div>
      <div className="product-body d-flex flex-column p-4 glass">
        <div className="skeleton mb-2" style={{ height: '15px', width: '40%' }}></div>
        <div className="skeleton mb-3" style={{ height: '24px', width: '80%' }}></div>
        <div className="d-flex justify-content-between align-items-center mt-auto">
          <div className="skeleton" style={{ height: '20px', width: '30%' }}></div>
          <div className="skeleton" style={{ height: '40px', width: '120px' }}></div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonProduct;
