export const loadProducts = () => {
  return JSON.parse(localStorage.getItem('products') || '[]');
};

export const saveProducts = (data) => {
  localStorage.setItem('products', JSON.stringify(data));
};