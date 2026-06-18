import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { assets } from '../assets/assets.js';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBoxOpen, FaListUl, FaUsers, FaShoppingCart, FaChartLine, FaPlus, FaEdit, FaTrash, FaCheck, FaTimes, FaCircle, FaEnvelope } from 'react-icons/fa';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Product Form State
  const [showProductForm, setShowProductForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  
  const [pName, setPName] = useState('');
  const [pPrice, setPPrice] = useState(0);
  const [pDescription, setPDescription] = useState('');
  const [pStock, setPStock] = useState(0);
  const [pCategory, setPCategory] = useState('');
  const [pImage, setPImage] = useState('');

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const fetchDashboardData = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      
      const [resProducts, resOrders, resUsers, resCats, resMsgs] = await Promise.all([
        axios.get('/api/products'),
        axios.get('/api/orders', config),
        axios.get('/api/auth', config),
        axios.get('/api/categories'),
        axios.get('/api/messages', config).catch(() => ({ data: [] }))
      ]);
      
      setProducts(resProducts.data);
      setOrders(resOrders.data);
      setUsersList(resUsers.data);
      setCategories(resCats.data);
      setMessages(resMsgs.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/admin/login');
      return;
    }
    fetchDashboardData();
  }, [user, navigate]);

  // Derived Statistics
  const totalRevenue = orders.reduce((acc, order) => acc + (order.totalPrice || order.totalAmount || 0), 0);
  
  // Monthly Revenue Chart Data
  const monthlyRevenue = orders.reduce((acc, order) => {
    const month = new Date(order.createdAt).toLocaleString('fr-FR', { month: 'short' });
    const amount = order.totalPrice || order.totalAmount || 0;
    acc[month] = (acc[month] || 0) + amount;
    return acc;
  }, {});
  const monthlyRevenueData = Object.keys(monthlyRevenue).map(key => ({ name: key, Revenus: monthlyRevenue[key] }));

  // Top Products Chart Data
  const productSales = orders.reduce((acc, order) => {
    const items = order.orderItems || order.items || [];
    items.forEach(item => {
      acc[item.name] = (acc[item.name] || 0) + item.qty;
    });
    return acc;
  }, {});
  const topProductsData = Object.keys(productSales)
    .map(key => ({ name: key, Ventes: productSales[key] }))
    .sort((a, b) => b.Ventes - a.Ventes)
    .slice(0, 5);

  // Categories Chart Data
  const categoryCounts = products.reduce((acc, product) => {
    const catName = product.category?.name || 'Autres';
    acc[catName] = (acc[catName] || 0) + 1;
    return acc;
  }, {});
  const categoryData = Object.keys(categoryCounts).map(key => ({ name: key, value: categoryCounts[key] }));
  const COLORS = ['#F4B942', '#1e1e1e', '#8884d8', '#82ca9d', '#ffc658'];

  // Handlers for Products
  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('image', file);
    setUploading(true);

    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post('/api/upload', formData, config);
      setPImage(data.url);
      setUploading(false);
      toast.success('Image importée avec succès');
    } catch (error) {
      console.error(error);
      setUploading(false);
      toast.error('Échec de l\'upload de l\'image');
    }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    const config = { headers: { Authorization: `Bearer ${user.token}` } };
    
    const productData = {
      name: pName,
      price: pPrice,
      description: pDescription,
      stock: pStock,
      category: pCategory,
      image: pImage,
    };

    try {
      if (editingProductId) {
        await axios.put(`/api/products/${editingProductId}`, productData, config);
        toast.success('Produit mis à jour avec succès');
      } else {
        await axios.post('/api/products', productData, config);
        toast.success('Produit créé avec succès');
      }
      setShowProductForm(false);
      fetchDashboardData();
    } catch (error) {
      console.error(error);
      toast.error('Erreur lors de la sauvegarde du produit');
    }
  };

  const editProduct = (product) => {
    setEditingProductId(product._id);
    setPName(product.name);
    setPPrice(product.price);
    setPDescription(product.description);
    setPStock(product.stock);
    setPCategory(product.category?._id || '');
    setPImage(product.image);
    setShowProductForm(true);
  };

  const openNewProductForm = () => {
    setEditingProductId(null);
    setPName('');
    setPPrice(0);
    setPDescription('');
    setPStock(0);
    setPCategory(categories.length > 0 ? categories[0]._id : '');
    setPImage('');
    setShowProductForm(true);
  };

  const deleteProduct = async (id) => {
    if (window.confirm('Voulez-vous vraiment supprimer ce produit ?')) {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        await axios.delete(`/api/products/${id}`, config);
        toast.success('Produit supprimé');
        fetchDashboardData();
      } catch (error) {
        console.error(error);
        toast.error('Erreur lors de la suppression');
      }
    }
  };

  const toggleOrderStatus = async (order) => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.put(`/api/orders/${order._id}/deliver`, {}, config);
      toast.success(`Statut de la commande ${order._id.substring(0,6)} mis à jour !`);
      fetchDashboardData();
    } catch (err) {
      toast.error('Erreur de mise à jour');
    }
  };

  const sidebarLinks = [
    { id: 'dashboard', label: 'Vue d\'ensemble', icon: <FaChartLine /> },
    { id: 'products', label: 'Produits', icon: <FaBoxOpen /> },
    { id: 'categories', label: 'Catégories', icon: <FaListUl /> },
    { id: 'orders', label: 'Commandes', icon: <FaShoppingCart /> },
    { id: 'users', label: 'Utilisateurs', icon: <FaUsers /> },
    { id: 'messages', label: 'Messages', icon: <FaEnvelope /> },
  ];

  return (
    <div className="container-fluid min-vh-100" style={{ backgroundColor: '#f8f9fa' }}>
      <div className="row h-100">
        
        {/* Sidebar */}
        <div className="col-lg-3 col-xl-2 p-0" style={{ backgroundColor: '#1e1e1e', minHeight: 'calc(100vh - 80px)' }}>
          <div className="p-4 h-100 d-flex flex-column">
            <h5 className="fw-bold mb-5 font-serif text-white letter-spacing-1">Lalla Admin</h5>
            <div className="nav flex-column gap-3 flex-grow-1">
              {sidebarLinks.map(link => (
                <button 
                  key={link.id}
                  className={`nav-link text-start rounded-3 px-4 py-3 border-0 transition-custom d-flex align-items-center gap-3 ${activeTab === link.id ? 'fw-bold' : 'text-muted'}`}
                  style={{
                    backgroundColor: activeTab === link.id ? 'rgba(244, 185, 66, 0.15)' : 'transparent',
                    color: activeTab === link.id ? '#F4B942' : '#888',
                  }}
                  onClick={() => { setActiveTab(link.id); setShowProductForm(false); }}
                >
                  <span style={{ fontSize: '1.2rem' }}>{link.icon}</span>
                  {link.label}
                </button>
              ))}
            </div>
            <div className="mt-auto">
              <button onClick={() => navigate('/')} className="btn btn-outline-secondary w-100 rounded-3 text-start px-4 py-3 border-0" style={{ backgroundColor: 'rgba(255,255,255,0.05)', color: '#aaa' }}>
                Retour au site
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="col-lg-9 col-xl-10 p-4 p-md-5">
          {loading ? (
            <div className="d-flex justify-content-center align-items-center h-100">
              <div className="spinner-border text-gold" role="status" style={{ width: '3rem', height: '3rem' }}></div>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="h-100"
              >
                
                {activeTab === 'dashboard' && (
                  <div>
                    <h2 className="fw-bold mb-5 font-serif text-dark">Tableau de bord</h2>
                    
                    {/* Key Metrics Cards */}
                    <div className="row g-4 mb-5">
                      <div className="col-md-6 col-xl-3">
                        <motion.div whileHover={{ y: -5 }} className="bg-white p-4 rounded-4 shadow-sm border-0 d-flex flex-column h-100" style={{ borderLeft: '4px solid #F4B942' }}>
                          <div className="text-muted text-uppercase small letter-spacing-1 mb-2 d-flex justify-content-between">Produits <FaBoxOpen className="text-gold" size={18}/></div>
                          <h2 className="fw-bold text-dark mb-0 mt-auto" style={{ fontSize: '2.5rem' }}>{products.length}</h2>
                        </motion.div>
                      </div>
                      <div className="col-md-6 col-xl-3">
                        <motion.div whileHover={{ y: -5 }} className="bg-white p-4 rounded-4 shadow-sm border-0 d-flex flex-column h-100" style={{ borderLeft: '4px solid #F4B942' }}>
                          <div className="text-muted text-uppercase small letter-spacing-1 mb-2 d-flex justify-content-between">Commandes <FaShoppingCart className="text-gold" size={18}/></div>
                          <h2 className="fw-bold text-dark mb-0 mt-auto" style={{ fontSize: '2.5rem' }}>{orders.length}</h2>
                        </motion.div>
                      </div>
                      <div className="col-md-6 col-xl-3">
                        <motion.div whileHover={{ y: -5 }} className="bg-white p-4 rounded-4 shadow-sm border-0 d-flex flex-column h-100" style={{ borderLeft: '4px solid #F4B942' }}>
                          <div className="text-muted text-uppercase small letter-spacing-1 mb-2 d-flex justify-content-between">Membres <FaUsers className="text-gold" size={18}/></div>
                          <h2 className="fw-bold text-dark mb-0 mt-auto" style={{ fontSize: '2.5rem' }}>{usersList.length}</h2>
                        </motion.div>
                      </div>
                      <div className="col-md-6 col-xl-3">
                        <motion.div whileHover={{ y: -5 }} className="bg-dark p-4 rounded-4 shadow-sm border-0 d-flex flex-column h-100 position-relative overflow-hidden">
                          <div className="position-absolute end-0 top-0 opacity-10 p-3"><FaChartLine size={80} /></div>
                          <div className="text-white-50 text-uppercase small letter-spacing-1 mb-2 position-relative z-1">Revenu Total</div>
                          <h2 className="fw-bold text-gold mb-0 mt-auto position-relative z-1" style={{ fontSize: '2.2rem' }}>{totalRevenue.toFixed(0)} <span className="fs-5">MAD</span></h2>
                        </motion.div>
                      </div>
                    </div>

                    {/* Charts Row */}
                    <div className="row g-4 mb-5">
                      {/* Monthly Revenue Line Chart */}
                      <div className="col-lg-8">
                        <div className="bg-white p-4 rounded-4 shadow-sm border h-100">
                          <h5 className="fw-bold mb-4 font-serif">Revenus Mensuels</h5>
                          <div style={{ width: '100%', height: 300 }}>
                            <ResponsiveContainer>
                              <LineChart data={monthlyRevenueData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#888' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#888' }} tickFormatter={(value) => `${value} MAD`} />
                                <Tooltip contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                                <Line type="monotone" dataKey="Revenus" stroke="#1e1e1e" strokeWidth={3} dot={{ r: 4, fill: '#F4B942', strokeWidth: 0 }} activeDot={{ r: 6 }} />
                              </LineChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      </div>

                      {/* Categories Pie Chart */}
                      <div className="col-lg-4">
                        <div className="bg-white p-4 rounded-4 shadow-sm border h-100 d-flex flex-column">
                          <h5 className="fw-bold mb-4 font-serif">Répartition par Catégorie</h5>
                          <div style={{ width: '100%', height: 250, flexGrow: 1 }}>
                            <ResponsiveContainer>
                              <PieChart>
                                <Pie
                                  data={categoryData}
                                  cx="50%"
                                  cy="50%"
                                  innerRadius={60}
                                  outerRadius={80}
                                  paddingAngle={5}
                                  dataKey="value"
                                >
                                  {categoryData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                  ))}
                                </Pie>
                                <Tooltip contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                              </PieChart>
                            </ResponsiveContainer>
                          </div>
                          <div className="mt-3">
                            {categoryData.map((entry, index) => (
                              <div key={index} className="d-flex justify-content-between align-items-center mb-2 small text-muted">
                                <div><FaCircle className="me-2" style={{ color: COLORS[index % COLORS.length], fontSize: '0.6rem' }} /> {entry.name}</div>
                                <span className="fw-bold">{entry.value}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Top Products Bar Chart Row */}
                    <div className="row g-4">
                      <div className="col-12">
                        <div className="bg-white p-4 rounded-4 shadow-sm border">
                          <h5 className="fw-bold mb-4 font-serif">Top 5 des Produits les Plus Vendus</h5>
                          <div style={{ width: '100%', height: 300 }}>
                            <ResponsiveContainer>
                              <BarChart data={topProductsData} margin={{ top: 5, right: 0, bottom: 5, left: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#888' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#888' }} />
                                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                                <Bar dataKey="Ventes" fill="#F4B942" radius={[4, 4, 0, 0]} barSize={40} />
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Products Tab */}
                {activeTab === 'products' && (
                  <div>
                    {!showProductForm ? (
                      <>
                        <div className="d-flex justify-content-between align-items-center mb-4">
                          <h2 className="fw-bold font-serif text-dark m-0">Gestion des Produits</h2>
                          <button className="btn btn-dark rounded-pill px-4 py-2 shadow-sm d-flex align-items-center gap-2" onClick={openNewProductForm}>
                            <FaPlus /> Nouveau
                          </button>
                        </div>
                        <div className="bg-white rounded-4 shadow-sm overflow-hidden border">
                          <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                              <thead className="table-light text-uppercase small text-muted letter-spacing-1">
                                <tr>
                                  <th className="ps-4 py-3">Produit</th>
                                  <th className="py-3">Catégorie</th>
                                  <th className="py-3">Prix</th>
                                  <th className="py-3">Stock</th>
                                  <th className="py-3 text-end pe-4">Actions</th>
                                </tr>
                              </thead>
                              <tbody>
                                {products.map(product => (
                                  <tr key={product._id} style={{ transition: 'background 0.2s' }}>
                                    <td className="ps-4 py-3 d-flex align-items-center gap-3">
                                      <div style={{ width: '45px', height: '45px', borderRadius: '50%', overflow: 'hidden', border: '1px solid #eee' }}>
                                        <img src={assets[product.image] || product.image || '/images/placeholder.jpg'} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                      </div>
                                      <span className="fw-semibold text-dark">{product.name}</span>
                                    </td>
                                    <td className="py-3">{product.category?.name || '-'}</td>
                                    <td className="py-3 fw-semibold">{product.price} MAD</td>
                                    <td className="py-3">
                                      {product.stock > 0 ? (
                                        <span className="badge rounded-pill bg-success-subtle text-success px-3 py-2 border border-success border-opacity-25">En stock ({product.stock})</span>
                                      ) : (
                                        <span className="badge rounded-pill bg-danger-subtle text-danger px-3 py-2 border border-danger border-opacity-25">Rupture</span>
                                      )}
                                    </td>
                                    <td className="py-3 text-end pe-4">
                                      <button className="btn btn-sm btn-light text-primary me-2 rounded-circle" style={{ width: '35px', height: '35px' }} onClick={() => editProduct(product)} title="Éditer"><FaEdit /></button>
                                      <button className="btn btn-sm btn-light text-danger rounded-circle" style={{ width: '35px', height: '35px' }} onClick={() => deleteProduct(product._id)} title="Supprimer"><FaTrash /></button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="bg-white rounded-4 shadow-sm border p-5">
                        <div className="d-flex justify-content-between align-items-center mb-5 border-bottom pb-3">
                          <h3 className="fw-bold font-serif text-dark m-0">{editingProductId ? 'Modifier le Produit' : 'Nouveau Produit'}</h3>
                          <button className="btn btn-sm btn-outline-secondary rounded-pill px-3" onClick={() => setShowProductForm(false)}>Annuler</button>
                        </div>
                        <form onSubmit={handleProductSubmit}>
                          <div className="row g-4">
                            <div className="col-md-6">
                              <label className="form-label text-muted fw-semibold">Nom du produit</label>
                              <input type="text" className="form-control bg-light border-0 py-2" value={pName} onChange={(e) => setPName(e.target.value)} required />
                            </div>
                            <div className="col-md-6">
                              <label className="form-label text-muted fw-semibold">Catégorie</label>
                              <select className="form-select bg-light border-0 py-2" value={pCategory} onChange={(e) => setPCategory(e.target.value)} required>
                                <option value="">Sélectionner une catégorie</option>
                                {categories.map(c => (
                                  <option key={c._id} value={c._id}>{c.name}</option>
                                ))}
                              </select>
                            </div>
                            <div className="col-md-6">
                              <label className="form-label text-muted fw-semibold">Prix (MAD)</label>
                              <input type="number" className="form-control bg-light border-0 py-2" value={pPrice} onChange={(e) => setPPrice(e.target.value)} required min="0" />
                            </div>
                            <div className="col-md-6">
                              <label className="form-label text-muted fw-semibold">Stock</label>
                              <input type="number" className="form-control bg-light border-0 py-2" value={pStock} onChange={(e) => setPStock(e.target.value)} required min="0" />
                            </div>
                            <div className="col-12">
                              <label className="form-label text-muted fw-semibold">Description courte</label>
                              <textarea className="form-control bg-light border-0 py-2" rows="3" value={pDescription} onChange={(e) => setPDescription(e.target.value)} required></textarea>
                            </div>
                            <div className="col-12">
                              <label className="form-label text-muted fw-semibold mb-3">Image du produit (Cloudinary)</label>
                              <div className="d-flex align-items-center gap-4 p-4 rounded-3 border border-dashed bg-light">
                                <div className="position-relative" style={{ width: '100px', height: '100px', borderRadius: '15px', overflow: 'hidden', backgroundColor: '#e9ecef', flexShrink: 0 }}>
                                  {(pImage || uploading) ? (
                                    <img src={pImage || '/images/placeholder.jpg'} alt="Aperçu" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: uploading ? 0.5 : 1 }} />
                                  ) : (
                                    <div className="d-flex justify-content-center align-items-center h-100 text-muted"><FaBoxOpen size={30} /></div>
                                  )}
                                  {uploading && <div className="position-absolute top-50 start-50 translate-middle spinner-border spinner-border-sm text-gold"></div>}
                                </div>
                                <div className="flex-grow-1">
                                  <input type="file" className="form-control" onChange={uploadFileHandler} accept="image/*" />
                                  <p className="text-muted small mt-2 mb-0">Recommandé : image carrée (ex: 800x800px) sur fond transparent ou uni.</p>
                                </div>
                              </div>
                            </div>
                            <div className="col-12 mt-5 text-end">
                              <button type="submit" className="btn btn-dark rounded-pill px-5 py-3 fw-bold" disabled={uploading}>
                                {editingProductId ? 'Enregistrer les modifications' : 'Publier le produit'}
                              </button>
                            </div>
                          </div>
                        </form>
                      </div>
                    )}
                  </div>
                )}

                {/* Categories Tab */}
                {activeTab === 'categories' && (
                  <div>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <h2 className="fw-bold font-serif text-dark m-0">Catégories</h2>
                    </div>
                    <div className="bg-white rounded-4 shadow-sm overflow-hidden border">
                      <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                          <thead className="table-light text-uppercase small text-muted letter-spacing-1">
                            <tr>
                              <th className="ps-4 py-3">ID</th>
                              <th className="py-3">Nom</th>
                            </tr>
                          </thead>
                          <tbody>
                            {categories.map(cat => (
                              <tr key={cat._id}>
                                <td className="ps-4 py-3 text-muted small">{cat._id}</td>
                                <td className="py-3 fw-semibold">{cat.name}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {/* Orders Tab */}
                {activeTab === 'orders' && (
                  <div>
                    <h2 className="fw-bold mb-4 font-serif text-dark">Commandes Récentes</h2>
                    <div className="bg-white rounded-4 shadow-sm overflow-hidden border">
                      <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                          <thead className="table-light text-uppercase small text-muted letter-spacing-1">
                            <tr>
                              <th className="ps-4 py-3">Référence</th>
                              <th className="py-3">Client</th>
                              <th className="py-3">Date</th>
                              <th className="py-3">Total</th>
                              <th className="py-3">Statut</th>
                              <th className="py-3 text-end pe-4">Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {orders.map(order => (
                              <tr key={order._id}>
                                <td className="ps-4 py-3 text-muted small fw-bold">#{order._id.substring(18).toUpperCase()}</td>
                                <td className="py-3 fw-semibold">{order.user?.firstName || order.user?.name || 'Client Inconnu'} {order.user?.lastName || ''}</td>
                                <td className="py-3 text-muted">{new Date(order.createdAt).toLocaleDateString('fr-FR')}</td>
                                <td className="py-3 fw-bold text-gold">{order.totalPrice || order.totalAmount || 0} MAD</td>
                                <td className="py-3">
                                  {order.isDelivered || order.status === 'delivered' ? (
                                    <span className="badge rounded-pill bg-success-subtle text-success px-3 py-2 border border-success border-opacity-25"><FaCheck className="me-1"/> Livrée</span>
                                  ) : (
                                    <span className="badge rounded-pill bg-warning-subtle text-warning px-3 py-2 border border-warning border-opacity-25">En traitement</span>
                                  )}
                                </td>
                                <td className="py-3 text-end pe-4">
                                  {!(order.isDelivered || order.status === 'delivered') && (
                                    <button 
                                      className="btn btn-sm btn-outline-success rounded-pill px-3"
                                      onClick={() => toggleOrderStatus(order)}
                                    >
                                      Marquer Livré
                                    </button>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {/* Users Tab */}
                {activeTab === 'users' && (
                  <div>
                    <h2 className="fw-bold mb-4 font-serif text-dark">Membres</h2>
                    <div className="bg-white rounded-4 shadow-sm overflow-hidden border">
                      <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                          <thead className="table-light text-uppercase small text-muted letter-spacing-1">
                            <tr>
                              <th className="ps-4 py-3">Avatar</th>
                              <th className="py-3">Nom Complet</th>
                              <th className="py-3">Email</th>
                              <th className="py-3">Rôle</th>
                            </tr>
                          </thead>
                          <tbody>
                            {usersList.map((u, i) => {
                              const fName = u.firstName || u.name || '?';
                              const lName = u.lastName || '';
                              return (
                                <tr key={u._id}>
                                  <td className="ps-4 py-3">
                                    <div className="d-flex justify-content-center align-items-center fw-bold text-white shadow-sm" style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: i % 2 === 0 ? '#1e1e1e' : '#F4B942' }}>
                                      {fName.charAt(0)}{lName ? lName.charAt(0) : ''}
                                    </div>
                                  </td>
                                  <td className="py-3 fw-semibold">{fName} {lName}</td>
                                <td className="py-3 text-muted">{u.email}</td>
                                <td className="py-3">
                                  {u.role === 'admin' ? (
                                    <span className="badge rounded-pill bg-dark text-white px-3 py-2">Administrateur</span>
                                  ) : (
                                    <span className="badge rounded-pill bg-light text-dark px-3 py-2 border">Client</span>
                                  )}
                                </td>
                              </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {/* Messages Tab */}
                {activeTab === 'messages' && (
                  <div>
                    <h2 className="fw-bold mb-4 font-serif text-dark">Messages Reçus</h2>
                    <div className="bg-white rounded-4 shadow-sm overflow-hidden border">
                      <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                          <thead className="table-light text-uppercase small text-muted letter-spacing-1">
                            <tr>
                              <th className="ps-4 py-3">Date</th>
                              <th className="py-3">Expéditeur</th>
                              <th className="py-3">Sujet</th>
                              <th className="py-3">Message</th>
                              <th className="py-3">Statut</th>
                            </tr>
                          </thead>
                          <tbody>
                            {messages.map(msg => (
                              <tr key={msg._id} style={{ backgroundColor: msg.isRead ? 'transparent' : 'rgba(244, 185, 66, 0.05)' }}>
                                <td className="ps-4 py-3 text-muted small">{new Date(msg.createdAt).toLocaleDateString('fr-FR')}</td>
                                <td className="py-3 fw-semibold">
                                  {msg.name}
                                  <div className="small text-muted fw-normal">{msg.email}</div>
                                </td>
                                <td className="py-3 fw-semibold">{msg.subject}</td>
                                <td className="py-3 text-muted" style={{ maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                  {msg.message}
                                </td>
                                <td className="py-3">
                                  {msg.isRead ? (
                                    <span className="badge rounded-pill bg-light text-muted border">Lu</span>
                                  ) : (
                                    <button 
                                      className="btn btn-sm btn-outline-success rounded-pill px-3"
                                      onClick={async () => {
                                        try {
                                          await axios.put(`/api/messages/${msg._id}/read`, {}, { headers: { Authorization: `Bearer ${user.token}` } });
                                          fetchDashboardData();
                                        } catch (err) {
                                          console.error(err);
                                        }
                                      }}
                                    >
                                      Marquer lu
                                    </button>
                                  )}
                                </td>
                              </tr>
                            ))}
                            {messages.length === 0 && (
                              <tr>
                                <td colSpan="5" className="text-center py-5 text-muted">
                                  <FaEnvelope size={40} className="mb-3 opacity-25" /><br/>
                                  Aucun message reçu pour le moment
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
