import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';
import { assets } from '../assets/assets.js';
import { useTranslation } from 'react-i18next';

// ─── Animation Variants ───────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] } })
};
const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.7 } }
};

// ─── Section Heading ──────────────────────────────────────────
const SectionHeading = ({ label, title, subtitle, light = false }) => (
  <motion.div
    className="text-center mb-5"
    initial="hidden"
    whileInView="show"
    viewport={{ once: true }}
    variants={fadeUp}
  >
    <p className="section-label mb-2">{label}</p>
    <h2 className="fw-bold display-6 mb-3" style={{ color: light ? '#fff' : 'var(--text-dark)', fontFamily: 'var(--font-serif)' }}>{title}</h2>
    {subtitle && <p style={{ color: light ? 'rgba(255,255,255,0.65)' : 'var(--text-light)', maxWidth: '550px', margin: '0 auto', lineHeight: 1.8 }}>{subtitle}</p>}
    <div className="ornament-divider mt-3"><span style={{ color: 'var(--accent)', fontSize: '1rem' }}>✦</span></div>
  </motion.div>
);

// ─── Data ─────────────────────────────────────────────────────
const categories = [
  { title: 'Soins Visage', count: 8, img: assets.cremeArgan, slug: 'Soins Visage' },
  { title: 'Soins Corps', count: 5, img: assets.laitCorps, slug: 'Soins Corps' },
  { title: 'Cheveux', count: 4, img: assets.shampoing, slug: 'Cheveux' },
  { title: 'Coffrets', count: 3, img: assets.coffretBeaute, slug: 'Coffrets Cadeaux' },
];

const whyUs = [
  { icon: '🌿', title: 'Ingrédients 100% Naturels', desc: 'Sélectionnés directement auprès des coopératives marocaines, sans additifs chimiques.' },
  { icon: '🏅', title: 'Qualité Certifiée', desc: 'Nos produits sont testés dermatologiquement et répondent aux plus hauts standards européens.' },
  { icon: '🚚', title: 'Livraison Rapide', desc: 'Livraison en 24/48h au Maroc. Emballage éco-responsable et offert dès 300 MAD.' },
  { icon: '💎', title: 'Savoir-faire Ancestral', desc: 'Des recettes transmises de génération en génération, sublimées par la science moderne.' },
];

const testimonials = [
  { name: 'Yasmine B.', city: 'Casablanca', rating: 5, text: "L'huile d'argan a transformé ma peau en quelques semaines. Je ne peux plus m'en passer ! La qualité est vraiment exceptionnelle.", initial: 'Y' },
  { name: 'Nadia E.', city: 'Marrakech', rating: 5, text: "Le coffret hammam est un vrai rituel de bien-être. Mon mari me l'offre à chaque anniversaire. Le packaging est magnifique.", initial: 'N' },
  { name: 'Sofia R.', city: 'Paris', rating: 5, text: "Étant marocaine vivant en France, Lalla Beauty me reconnecte à mes racines. Le ghassoul est incroyable, ma peau est parfaite.", initial: 'S' },
  { name: 'Khadija M.', city: 'Rabat', rating: 5, text: "J'ai essayé l'eau de rose pour ma routine du soir et c'est révolutionnaire. La livraison était ultra rapide et l'emballage élégant.", initial: 'K' },
];

const faqs = [
  { q: 'Quels sont vos délais de livraison ?', a: 'Nous livrons en 24 à 48h au Maroc. Pour la France et l\'Europe, comptez 4 à 7 jours ouvrables. La livraison est offerte dès 300 MAD d\'achat au Maroc.' },
  { q: 'Vos produits sont-ils vraiment naturels ?', a: 'Absolument. Tous nos produits sont formulés à partir d\'ingrédients naturels issus de coopératives marocaines certifiées. Nous n\'utilisons aucun parabène, sulfate ou silicone.' },
  { q: 'Puis-je retourner un produit ?', a: 'Oui, vous disposez de 14 jours pour retourner un produit non ouvert et non utilisé. Contactez notre service client à contact@lallabeauty.ma pour initier le retour.' },
  { q: 'Comment utiliser l\'huile d\'argan ?', a: 'L\'huile d\'argan s\'utilise pure en quelques gouttes sur le visage le soir, comme sérum. Pour les cheveux, appliquez sur les pointes en masque ou en finition.' },
  { q: 'Proposez-vous des coffrets cadeaux personnalisés ?', a: 'Oui ! Contactez-nous via notre page Contact pour créer un coffret sur-mesure avec un message personnalisé. Idéal pour les mariages, baby showers et anniversaires.' },
];

const instaImages = [
  assets.arganOil, assets.savonNoir, assets.ghassoul,
  assets.eauRose, assets.cremeArgan, assets.coffretHammam,
];

// ─── Component ────────────────────────────────────────────────
const Home = () => {
  const { data: products = [], isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data } = await axios.get('/api/products');
      return data;
    }
  });

  const [openFaq, setOpenFaq] = useState(null);
  const [email, setEmail] = useState('');
  const { addToCart } = useContext(CartContext);
  const { toggleWishlist, isInWishlist } = useContext(WishlistContext);
  const { t } = useTranslation();

  const featuredProducts = products.filter(p => p.featured).slice(0, 4);
  const promoProducts = products.slice(0, 4).map(p => ({ ...p, oldPrice: Math.round(p.price * 1.3) }));

  const handleNewsletter = (e) => {
    e.preventDefault();
    if (!email) return;
    toast.success('Merci ! Vous êtes inscrite à notre newsletter ✨', { duration: 4000 });
    setEmail('');
  };

  const ProductMiniCard = ({ product, showPromo = false }) => {
    const inWl = isInWishlist(product._id);
    return (
      <div className="card product-card h-100" style={{ position: 'relative' }}>
        {showPromo && <div className="promo-badge">-{Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}%</div>}
        <button
          onClick={() => toggleWishlist(product)}
          style={{ position: 'absolute', top: 12, right: 12, zIndex: 10, background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '50%', width: 36, height: 36, cursor: 'pointer', fontSize: 16 }}
        >
          {inWl ? '❤️' : '🤍'}
        </button>
        <div className="product-img-wrapper">
          <Link to={`/product/${product._id}`}>
            <img src={assets[product.image] || product.image || '/images/placeholder.jpg'} className="product-img" alt={product.name} />
          </Link>
        </div>
        <div className="product-body d-flex flex-column">
          <div className="mb-1 text-muted small">{product.category?.name || 'Cosmétique'}</div>
          <Link to={`/product/${product._id}`} className="product-title mb-2">{product.name}</Link>
          <div className="mt-auto pt-3 border-top position-relative">
            <div className="d-flex align-items-center gap-2 mb-1">
              <span className="product-price fs-6">{product.price} MAD</span>
              {showPromo && <span className="text-muted text-decoration-line-through small">{product.oldPrice} MAD</span>}
            </div>
            <div className="add-to-cart-wrapper">
              <button
                className="btn btn-primary-custom w-100"
                onClick={() => { addToCart(product, 1); toast.success(`${product.name} ajouté au panier`, { icon: '✨' }); }}
              >
                Ajouter au panier
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-light)', color: 'var(--text-dark)', overflowX: 'hidden' }}>
      {/* ── 1. HERO BANNER PLEIN ÉCRAN ── */}
      <section className="hero-section" style={{ backgroundImage: `linear-gradient(to right, rgba(255,248,240,0.85), rgba(255,248,240,0.85)), url(${assets.heroImage})` }}>
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <motion.div
            className="hero-content mx-auto"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="hero-tag" style={{ color: 'var(--accent)', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', fontSize: '0.8rem', display: 'block', marginBottom: '1rem' }}>{t('home.heroSubtitle')}</span>
            <h1 className="hero-title mb-4" style={{ fontFamily: 'var(--font-serif)', fontSize: '4rem', fontWeight: 500, color: 'var(--text-dark)' }}>
              {t('home.heroTitle1')} {t('home.heroTitle2')} <em style={{ color: 'var(--accent)' }}>{t('home.heroTitle3')}</em>
            </h1>
            <p className="mb-5 fs-5 fw-light mx-auto" style={{ color: 'var(--text-light)', lineHeight: 1.8, maxWidth: 500 }}>
              {t('home.heroDesc')}
            </p>
            <div className="d-flex gap-3 justify-content-center flex-wrap">
              <Link to="/catalog" className="btn btn-primary-custom px-5">{t('home.btnShop')}</Link>
              <Link to="/about" className="btn btn-outline-custom px-5">{t('home.btnAbout')}</Link>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator - Advanced */}
        <div 
          className="d-none d-md-flex flex-column align-items-center"
          style={{ position: 'absolute', bottom: '4vh', left: '50%', transform: 'translateX(-50%)', zIndex: 10 }}
        >
          <div style={{ width: '28px', height: '46px', borderRadius: '14px', border: '2px solid rgba(42, 42, 42, 0.4)', display: 'flex', justifyContent: 'center', paddingTop: '6px', backgroundColor: 'rgba(255,255,255,0.5)', backdropFilter: 'blur(4px)' }}>
            <motion.div 
              style={{ width: '4px', height: '10px', borderRadius: '2px', backgroundColor: 'var(--accent)' }}
              animate={{ y: [0, 16, 0], opacity: [1, 0.2, 1] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
            />
          </div>
          <span className="mt-3" style={{ fontSize: '0.65rem', letterSpacing: '4px', color: 'var(--text-dark)', textTransform: 'uppercase', fontWeight: 500 }}>Découvrir</span>
        </div>
      </section>

      {/* ── 2. CATÉGORIES POPULAIRES ── */}
      <section className="py-6" style={{ padding: '6rem 0', backgroundColor: 'var(--bg-light)' }}>
        <div className="container">
          <SectionHeading label={t('home.catLabel')} title={t('home.catTitle')} subtitle={t('home.catSubtitle')} />
          <div className="row g-3 flex-nowrap scroll-snap-x hide-scrollbar">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.title}
                className="col-6 col-lg-3"
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                custom={i}
                variants={fadeUp}
              >
                <Link to={`/catalog?category=${encodeURIComponent(cat.slug)}`} style={{ textDecoration: 'none' }}>
                  <div className="cat-card">
                    <img src={cat.img} alt={cat.title} />
                    <div className="cat-card-overlay">
                      <div className="cat-card-title">{cat.title}</div>
                      <div className="cat-card-count">{cat.count} produits</div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. PRODUITS VEDETTES ── */}
      <section style={{ padding: '6rem 0', backgroundColor: 'var(--secondary)' }}>
        <div className="container">
          <SectionHeading label="Nos Favoris" title="Produits Vedettes" subtitle="Les incontournables plébiscités par nos clientes fidèles. Des formules d'exception pour une beauté rayonnante." />
          {isLoading ? (
            <div className="row g-4 flex-nowrap scroll-snap-x hide-scrollbar">
              {[1, 2, 3, 4].map((_, i) => (
                <motion.div key={i} className="col-sm-6 col-lg-3" initial="hidden" whileInView="show" viewport={{ once: true }} custom={i} variants={fadeUp}>
                  <div className="card product-card h-100">
                    <div className="product-img-wrapper" style={{ background: '#f5f5f5', height: '280px' }} />
                    <div className="product-body"><div className="skeleton" style={{ height: 20, marginBottom: 8, borderRadius: 4, background: '#eee' }} /><div className="skeleton" style={{ height: 16, width: '60%', borderRadius: 4, background: '#eee' }} /></div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : featuredProducts.length > 0 ? (
            <motion.div
              className="row g-4 flex-nowrap scroll-snap-x hide-scrollbar"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.12 } } }}
            >
              {featuredProducts.map(product => (
                <motion.div key={product._id} className="col-sm-6 col-lg-3" variants={{ hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}>
                  <ProductMiniCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-5">
              <p className="text-muted">Aucun produit vedette pour le moment.</p>
            </div>
          )}
          <div className="text-center mt-5">
            <Link to="/catalog" className="btn btn-outline-custom px-5">Voir tous les produits</Link>
          </div>
        </div>
      </section>

      {/* ── 4. PRODUITS EN PROMOTION ── */}
      {promoProducts.length > 0 && (
        <section style={{ padding: '6rem 0', backgroundColor: 'var(--bg-light)' }}>
          <div className="container">
            <SectionHeading label="Offres Spéciales" title="Ventes Flash ✨" subtitle="Des réductions exceptionnelles sur une sélection de nos meilleures formules. Profitez-en vite !" />
            <motion.div
              className="row g-4 flex-nowrap scroll-snap-x hide-scrollbar"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } }}
            >
              {promoProducts.map(product => (
                <motion.div key={product._id} className="col-sm-6 col-lg-3" variants={{ hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}>
                  <ProductMiniCard product={product} showPromo />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* ── 5. POURQUOI CHOISIR LALLA BEAUTY ── */}
      <section style={{ padding: '6rem 0', backgroundColor: 'var(--secondary)' }}>
        <div className="container">
          <SectionHeading label="Notre Promesse" title="Pourquoi Lalla Beauty ?" subtitle="Nous mettons notre passion et notre expertise au service de votre beauté, avec des valeurs qui nous sont chères." />
          <div className="row g-4">
            {whyUs.map((item, i) => (
              <motion.div
                key={item.title}
                className="col-sm-6 col-lg-3"
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                custom={i}
                variants={fadeUp}
              >
                <div className="why-card">
                  <div className="why-icon">{item.icon}</div>
                  <h5 className="fw-bold mb-3" style={{ fontFamily: 'var(--font-serif)' }}>{item.title}</h5>
                  <p className="mb-0" style={{ color: 'var(--text-light)', lineHeight: 1.7, fontSize: '0.95rem' }}>{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. AVIS CLIENTES ── */}
      <section style={{ padding: '6rem 0', backgroundColor: 'var(--bg-light)' }}>
        <div className="container">
          <SectionHeading label="Témoignages" title="Ce Que Disent Nos Clientes" subtitle="Plus de 10 000 femmes nous font confiance. Voici quelques-uns de leurs retours sincères." />
          <div className="row g-4">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                className="col-md-6 col-lg-3"
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                custom={i}
                variants={fadeUp}
              >
                <div className="testimonial-card">
                  <div className="stars mb-3">{'★'.repeat(t.rating)}</div>
                  <p className="mb-4" style={{ color: 'var(--text-dark)', lineHeight: 1.8, fontSize: '0.95rem', position: 'relative', zIndex: 1 }}>
                    "{t.text}"
                  </p>
                  <div className="d-flex align-items-center gap-3">
                    <div className="avatar-circle">{t.initial}</div>
                    <div>
                      <div className="fw-semibold" style={{ color: 'var(--text-dark)', fontSize: '0.95rem' }}>{t.name}</div>
                      <div style={{ color: 'var(--text-light)', fontSize: '0.8rem' }}>{t.city}</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. NEWSLETTER ── */}
      <section className="newsletter-section" style={{ padding: '6rem 0' }}>
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <motion.div
            className="text-center"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <p className="section-label mb-3" style={{ color: 'var(--accent)' }}>Rejoignez la communauté</p>
            <h2 className="fw-bold display-6 mb-3" style={{ fontFamily: 'var(--font-serif)', color: '#fff' }}>
              -15% sur votre première commande
            </h2>
            <p className="mb-5" style={{ color: 'rgba(255,255,255,0.6)', maxWidth: 480, margin: '0 auto 2.5rem', lineHeight: 1.8 }}>
              Inscrivez-vous à notre newsletter et recevez vos offres exclusives, nos nouveautés et nos conseils beauté.
            </p>
            <form onSubmit={handleNewsletter} className="d-flex gap-0 justify-content-center flex-wrap" style={{ maxWidth: 520, margin: '0 auto' }}>
              <input
                type="email"
                className="newsletter-input"
                placeholder="Votre adresse email..."
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                style={{ flex: 1, minWidth: 220 }}
              />
              <button type="submit" className="newsletter-btn">S'inscrire</button>
            </form>
            <p className="mt-3" style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.78rem' }}>
              Pas de spam. Désinscription en un clic.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── 8. INSTAGRAM FEED ── */}
      <section style={{ padding: '6rem 0', backgroundColor: 'var(--bg-light)' }}>
        <div className="container">
          <SectionHeading label="@lallabeauty.ma" title="Notre Univers sur Instagram" subtitle="Suivez-nous pour découvrir nos rituels beauté, conseils exclusifs et les coulisses de Lalla Beauty." />
          <div className="row g-2">
            {instaImages.map((img, i) => (
              <motion.div
                key={i}
                className="col-6 col-md-4 col-lg-2"
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                custom={i}
                variants={fadeUp}
              >
                <div className="insta-item">
                  <img src={img} alt={`Instagram ${i + 1}`} />
                  <div className="insta-overlay">
                    <span style={{ fontSize: '2rem' }}>📷</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-4">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="btn btn-outline-custom">
              📸 Suivre sur Instagram
            </a>
          </div>
        </div>
      </section>

      {/* ── 9. FAQ ── */}
      <section style={{ padding: '6rem 0', backgroundColor: 'var(--secondary)' }}>
        <div className="container">
          <SectionHeading label="Vos Questions" title="FAQ — Questions Fréquentes" />
          <div style={{ maxWidth: 760, margin: '0 auto' }}>
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                className="faq-item"
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                custom={i * 0.5}
                variants={fadeUp}
              >
                <button
                  className="faq-question"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span>{faq.q}</span>
                  <motion.span
                    animate={{ rotate: openFaq === i ? 45 : 0 }}
                    transition={{ duration: 0.25 }}
                    style={{ color: 'var(--accent)', fontSize: '1.4rem', flexShrink: 0, fontWeight: 300, lineHeight: 1 }}
                  >
                    +
                  </motion.span>
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      className="faq-answer"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: 'easeInOut' }}
                    >
                      {faq.a}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-5">
            <Link to="/contact" className="btn btn-outline-custom">Une autre question ? Contactez-nous</Link>
          </div>
        </div>
      </section>

      {/* ── 10. FOOTER PREMIUM ── */}
      <footer className="footer-premium">
        <div className="container">
          <div className="row g-5">
            {/* Brand */}
            <div className="col-lg-4">
              <div className="footer-brand mb-2">
                <img src={assets.logo} alt="Lalla Beauty Logo" style={{ height: '50px', objectFit: 'contain', filter: 'brightness(0) invert(1)' }} />
              </div>
              <div className="footer-divider" />
              <p style={{ color: 'rgba(255,255,255,0.5)', lineHeight: 1.8, fontSize: '0.9rem', maxWidth: 300 }}>
                L'élégance de la beauté marocaine accessible à toutes. Des produits naturels, luxueux et authentiques, directement depuis Marrakech.
              </p>
              <div className="mt-4">
                {['f', 'in', '📸', '▶'].map((s, i) => (
                  <a key={i} href="#" className="social-icon">{s}</a>
                ))}
              </div>
            </div>

            {/* Navigation */}
            <div className="col-6 col-lg-2">
              <h6 className="fw-semibold mb-3" style={{ color: '#fff', letterSpacing: '2px', textTransform: 'uppercase', fontSize: '0.78rem' }}>Navigation</h6>
              <div className="footer-divider" style={{ marginTop: 0 }} />
              {[['/', 'Accueil'], ['/catalog', 'Boutique'], ['/about', 'À Propos'], ['/contact', 'Contact']].map(([to, label]) => (
                <Link key={to} to={to} className="footer-link">{label}</Link>
              ))}
            </div>

            {/* Services */}
            <div className="col-6 col-lg-2">
              <h6 className="fw-semibold mb-3" style={{ color: '#fff', letterSpacing: '2px', textTransform: 'uppercase', fontSize: '0.78rem' }}>Mon Compte</h6>
              <div className="footer-divider" style={{ marginTop: 0 }} />
              {[['/profile', 'Mon Profil'], ['/profile', 'Mes Commandes'], ['/wishlist', 'Mes Favoris'], ['/cart', 'Mon Panier']].map(([to, label]) => (
                <Link key={label} to={to} className="footer-link">{label}</Link>
              ))}
            </div>

            {/* Contact */}
            <div className="col-lg-4">
              <h6 className="fw-semibold mb-3" style={{ color: '#fff', letterSpacing: '2px', textTransform: 'uppercase', fontSize: '0.78rem' }}>Nous Contacter</h6>
              <div className="footer-divider" style={{ marginTop: 0 }} />
              {[
                ['📍', '15 Rue Majorelle, Guéliz, Marrakech'],
                ['📞', '+212 6 12 34 56 78'],
                ['✉️', 'contact@lallabeauty.ma'],
                ['🕐', 'Lun–Ven : 9h–19h'],
              ].map(([icon, text]) => (
                <div key={text} className="d-flex gap-2 mb-2" style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.9rem' }}>
                  <span>{icon}</span>
                  <span>{text}</span>
                </div>
              ))}
              {/* Trust Badges */}
              <div className="d-flex gap-2 mt-4 flex-wrap">
                {['🔒 Paiement Sécurisé', '🌿 100% Naturel', '🚚 Livraison rapide'].map(badge => (
                  <span key={badge} style={{ background: 'rgba(193,154,107,0.12)', border: '1px solid rgba(193,154,107,0.25)', padding: '4px 10px', fontSize: '0.72rem', color: 'var(--accent)', letterSpacing: '0.5px' }}>
                    {badge}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="container">
            <span>© {new Date().getFullYear()} Lalla Beauty — Tous droits réservés. Marrakech, Maroc</span>
            <span className="mx-3">·</span>
            <a href="#" style={{ color: 'rgba(255,255,255,0.3)', textDecoration: 'none' }}>Politique de confidentialité</a>
            <span className="mx-3">·</span>
            <a href="#" style={{ color: 'rgba(255,255,255,0.3)', textDecoration: 'none' }}>CGV</a>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default Home;
