import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { assets } from '../assets/assets.js';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.7, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }
  })
};

const About = () => {
  const founder = {
    name: 'Malak Hajji',
    role: 'Fondatrice & CEO',
    initial: 'M',
    bio: `Passionnée de beauté naturelle depuis l'enfance, Malak Hajji a fondé Lalla Beauty en 2018 avec une vision claire : rendre les rituels de beauté marocains accessibles à toutes les femmes du monde. Après des études en cosmétologie à Paris et plusieurs années au sein de grandes maisons de cosmétiques, elle est revenue à ses racines marocaines pour créer quelque chose d'unique et d'authentique.`,
    quote: "La beauté marocaine est un héritage infini. Mon rêve est que chaque femme dans le monde puisse en bénéficier.",
    gradient: 'linear-gradient(135deg, #C19A6B, #FAD4D8)',
  };

  const team = [
    {
      name: 'Imad Hajji',
      role: 'Directeur des Opérations',
      initial: 'I',
      bio: 'En charge de la logistique et de la chaîne d\'approvisionnement, Imad veille à ce que chaque produit soit livré avec excellence.',
      gradient: 'linear-gradient(135deg, #2A2A2A, #C19A6B)',
    },
    {
      name: 'Farah Hajji',
      role: 'Responsable Créativité & Design',
      initial: 'F',
      bio: 'Farah insuffle l\'âme esthétique de Lalla Beauty. Elle crée l\'identité visuelle et l\'univers de marque qui nous distingue.',
      gradient: 'linear-gradient(135deg, #FAD4D8, #C19A6B)',
    },
    {
      name: 'Karim El Khatib',
      role: 'Expert Formulation & R&D',
      initial: 'K',
      bio: 'Pharmacien et expert en cosmétologie naturelle, Karim développe nos formules en alliant tradition ancestrale et innovation scientifique.',
      gradient: 'linear-gradient(135deg, #C19A6B, #8C5B62)',
    },
  ];

  const values = [
    { icon: '🌱', title: 'Naturel & Bio', desc: 'Tous nos produits sont issus de la nature marocaine, cultivés et récoltés de manière durable et respectueuse.' },
    { icon: '💎', title: 'Luxe Artisanal', desc: 'Chaque produit est préparé selon des recettes traditionnelles transmises de génération en génération.' },
    { icon: '💚', title: 'Respect de la Peau', desc: 'Formules douces, sans parabènes, sans sulfates, testées dermatologiquement sur tous types de peau.' },
    { icon: '🤝', title: 'Commerce Équitable', desc: 'Nous travaillons directement avec des coopératives féminines au Maroc pour des produits authentiques.' },
  ];

  const milestones = [
    { year: '2018', event: 'Fondation de Lalla Beauty à Marrakech' },
    { year: '2019', event: 'Lancement de la boutique en ligne' },
    { year: '2021', event: 'Certification Bio et 5 000 clientes fidèles' },
    { year: '2023', event: 'Export vers la France, Belgique & Canada' },
    { year: '2024', event: '10 000+ clientes satisfaites dans le monde' },
  ];

  return (
    <div style={{ backgroundColor: 'var(--bg-light)', color: 'var(--text-dark)', overflowX: 'hidden' }}>

      {/* ── HERO ── */}
      <section style={{ background: 'linear-gradient(135deg, var(--primary-light) 0%, var(--secondary) 50%, #FAF3EE 100%)', padding: '7rem 0 5rem', position: 'relative', overflow: 'hidden' }}>
        {/* Decorative pattern */}
        <div style={{ position: 'absolute', inset: 0, opacity: 0.04, backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23C19A6B'%3E%3Cpath d='M30 0L60 30L30 60L0 30Z'/%3E%3C/g%3E%3C/svg%3E\")", pointerEvents: 'none' }} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="section-label mb-4">Notre Histoire</p>
            <h1 className="fw-bold mb-4" style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', color: 'var(--text-dark)', lineHeight: 1.1 }}>
              La Beauté Marocaine,<br />
              <em style={{ color: 'var(--accent)', fontStyle: 'italic' }}>une Passion Ancestrale</em>
            </h1>
            <p className="lead mx-auto mt-4" style={{ maxWidth: '620px', color: 'var(--text-light)', lineHeight: '1.9', fontSize: '1.1rem' }}>
              Fondée à Marrakech en 2018 par Malak Hajji, Lalla Beauty est née d'un amour profond pour les rituels de beauté marocains et d'une ambition : les partager avec le monde entier.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── TIMELINE / JALONS ── */}
      <section style={{ padding: '5rem 0', backgroundColor: 'var(--bg-light)' }}>
        <div className="container">
          <motion.div
            className="text-center mb-5"
            initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}
          >
            <p className="section-label mb-2">Notre Parcours</p>
            <h2 className="fw-bold" style={{ fontFamily: 'var(--font-serif)', color: 'var(--text-dark)' }}>Une Success Story Marocaine</h2>
          </motion.div>
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div style={{ position: 'relative', paddingLeft: '2rem' }}>
                <div style={{ position: 'absolute', left: '8px', top: 0, bottom: 0, width: '1px', background: 'linear-gradient(to bottom, var(--accent), transparent)' }} />
                {milestones.map((m, i) => (
                  <motion.div
                    key={m.year}
                    className="d-flex gap-4 mb-4"
                    initial="hidden" whileInView="show" viewport={{ once: true }} custom={i} variants={fadeUp}
                  >
                    <div style={{ position: 'absolute', left: 0, width: 18, height: 18, borderRadius: '50%', background: 'var(--accent)', marginTop: 2, flexShrink: 0 }} />
                    <div style={{ paddingLeft: '1.5rem' }}>
                      <span style={{ fontFamily: 'var(--font-serif)', color: 'var(--accent)', fontSize: '1.2rem', fontWeight: 700 }}>{m.year}</span>
                      <p className="mb-0 mt-1" style={{ color: 'var(--text-dark)', fontSize: '1rem' }}>{m.event}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FONDATRICE ── */}
      <section style={{ padding: '6rem 0', backgroundColor: 'var(--secondary)' }}>
        <div className="container">
          <motion.div
            className="text-center mb-5"
            initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}
          >
            <p className="section-label mb-2">À l'Origine</p>
            <h2 className="fw-bold" style={{ fontFamily: 'var(--font-serif)', color: 'var(--text-dark)' }}>La Fondatrice</h2>
          </motion.div>
          <div className="row align-items-center g-5">
            {/* Avatar grande */}
            <motion.div
              className="col-lg-4 text-center"
              initial={{ x: -50, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} viewport={{ once: true }}
            >
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <div style={{
                  width: 220, height: 220, borderRadius: '50%',
                  margin: '0 auto',
                  boxShadow: '0 20px 60px rgba(193,154,107,0.3)',
                  position: 'relative', zIndex: 1,
                  overflow: 'hidden'
                }}>
                  <img src="/images/malak.jpg" alt="Malak Hajji" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                {/* Decorative ring */}
                <div style={{
                  position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)',
                  width: 240, height: 240, borderRadius: '50%',
                  border: '1px solid rgba(193,154,107,0.3)',
                  animation: 'spin 20s linear infinite'
                }} />
                <div style={{
                  position: 'absolute', top: -20, left: '50%', transform: 'translateX(-50%)',
                  width: 260, height: 260, borderRadius: '50%',
                  border: '1px dashed rgba(193,154,107,0.15)'
                }} />
              </div>
              <h3 className="fw-bold mt-4 mb-1" style={{ fontFamily: 'var(--font-serif)', color: 'var(--text-dark)' }}>{founder.name}</h3>
              <p style={{ color: 'var(--accent)', letterSpacing: '1px', fontSize: '0.85rem', textTransform: 'uppercase' }}>{founder.role}</p>
            </motion.div>

            {/* Bio */}
            <motion.div
              className="col-lg-8"
              initial={{ x: 50, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }} viewport={{ once: true }}
            >
              <p style={{ color: 'var(--text-light)', lineHeight: '1.9', fontSize: '1.05rem', marginBottom: '2rem' }}>
                {founder.bio}
              </p>
              <blockquote style={{
                borderLeft: '3px solid var(--accent)', paddingLeft: '1.5rem',
                margin: '0 0 2rem',
              }}>
                <p className="fst-italic" style={{ color: 'var(--text-dark)', fontSize: '1.1rem', lineHeight: '1.7' }}>
                  "{founder.quote}"
                </p>
                <footer style={{ color: 'var(--accent)', fontSize: '0.85rem', letterSpacing: '2px', textTransform: 'uppercase', marginTop: '0.5rem' }}>
                  — {founder.name}
                </footer>
              </blockquote>
              <div className="d-flex gap-4 flex-wrap">
                {[['10K+', 'Clientes'], ['20+', 'Produits'], ['6', 'Pays'], ['100%', 'Naturel']].map(([n, l]) => (
                  <div key={l} className="text-center">
                    <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', color: 'var(--accent)', fontWeight: 700 }}>{n}</div>
                    <div style={{ fontSize: '0.72rem', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--text-light)' }}>{l}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── ÉQUIPE ── */}
      <section style={{ padding: '6rem 0', backgroundColor: 'var(--bg-light)' }}>
        <div className="container">
          <motion.div
            className="text-center mb-5"
            initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}
          >
            <p className="section-label mb-2">Les Visages</p>
            <h2 className="fw-bold" style={{ fontFamily: 'var(--font-serif)', color: 'var(--text-dark)' }}>Notre Équipe</h2>
            <p className="mt-3" style={{ color: 'var(--text-light)', maxWidth: 500, margin: '1rem auto 0' }}>
              Une équipe soudée, passionnée et complémentaire, unie autour d'une même vision : révéler la beauté naturelle de chaque femme.
            </p>
          </motion.div>

          <div className="row g-4 justify-content-center">
            {team.map((member, i) => (
              <motion.div
                key={member.name}
                className="col-md-4"
                initial="hidden" whileInView="show" viewport={{ once: true }} custom={i} variants={fadeUp}
              >
                <div style={{
                  padding: '2.5rem 2rem', textAlign: 'center',
                  background: 'var(--secondary)',
                  border: '1px solid rgba(193,154,107,0.12)',
                  height: '100%',
                  transition: 'all 0.4s ease',
                }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-8px)';
                    e.currentTarget.style.boxShadow = '0 20px 40px rgba(193,154,107,0.12)';
                    e.currentTarget.style.borderColor = 'var(--accent)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.borderColor = 'rgba(193,154,107,0.12)';
                  }}
                >
                  <div style={{
                    width: 90, height: 90, borderRadius: '50%',
                    background: member.gradient,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 1.5rem',
                    fontSize: '2rem', fontWeight: 700,
                    color: '#fff', fontFamily: 'var(--font-serif)',
                    boxShadow: '0 10px 30px rgba(193,154,107,0.25)'
                  }}>
                    {member.initial}
                  </div>
                  <h4 className="fw-bold mb-1" style={{ fontFamily: 'var(--font-serif)', color: 'var(--text-dark)' }}>{member.name}</h4>
                  <p style={{ color: 'var(--accent)', fontSize: '0.8rem', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '1rem' }}>{member.role}</p>
                  <div style={{ width: 30, height: 1, background: 'var(--accent)', margin: '0 auto 1rem', opacity: 0.5 }} />
                  <p style={{ color: 'var(--text-light)', lineHeight: '1.7', fontSize: '0.92rem' }}>{member.bio}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── NOS VALEURS ── */}
      <section style={{ padding: '6rem 0', backgroundColor: 'var(--secondary)' }}>
        <div className="container">
          <motion.div
            className="text-center mb-5"
            initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}
          >
            <p className="section-label mb-2">Ce Qui Nous Définit</p>
            <h2 className="fw-bold" style={{ fontFamily: 'var(--font-serif)', color: 'var(--text-dark)' }}>Nos Valeurs</h2>
          </motion.div>
          <div className="row g-4">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                className="col-md-6 col-lg-3"
                initial="hidden" whileInView="show" viewport={{ once: true }} custom={i} variants={fadeUp}
              >
                <div className="why-card">
                  <div className="why-icon">{v.icon}</div>
                  <h5 className="fw-bold mb-3" style={{ fontFamily: 'var(--font-serif)', color: 'var(--text-dark)' }}>{v.title}</h5>
                  <p style={{ color: 'var(--text-light)', lineHeight: '1.7', fontSize: '0.95rem', margin: 0 }}>{v.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: '6rem 0', background: 'linear-gradient(135deg, #1A0F0F 0%, #2A1614 100%)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.06, backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23C19A6B'%3E%3Cpath d='M30 0L60 30L30 60L0 30Z'/%3E%3C/g%3E%3C/svg%3E\")" }} />
        <div className="container text-center" style={{ position: 'relative', zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }} viewport={{ once: true }}
          >
            <p className="section-label mb-4">Rejoignez-nous</p>
            <h2 className="fw-bold mb-4" style={{ fontFamily: 'var(--font-serif)', color: '#fff', fontSize: 'clamp(1.8rem, 4vw, 3rem)' }}>
              Prête à sublimer votre beauté ?
            </h2>
            <p className="mb-5" style={{ color: 'rgba(255,255,255,0.6)', maxWidth: 500, margin: '0 auto 2.5rem', lineHeight: 1.8 }}>
              Découvrez notre collection complète de soins naturels marocains et rejoignez plus de 10 000 femmes qui nous font confiance.
            </p>
            <div className="d-flex gap-3 justify-content-center flex-wrap">
              <Link to="/catalog" className="btn btn-primary-custom px-5">Découvrir la boutique</Link>
              <Link to="/contact" className="btn" style={{ border: '1px solid rgba(255,255,255,0.3)', color: '#fff', padding: '14px 35px', letterSpacing: '2px', fontSize: '0.9rem', textTransform: 'uppercase', transition: 'all 0.3s' }}>
                Nous contacter
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
};

export default About;
