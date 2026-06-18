import { useState } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaInstagram, FaFacebookF } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('/api/messages', formData);
      toast.success(t('contactPage.success'), { duration: 4000 });
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      toast.error(t('contactPage.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5 fade-in-up">
      <div className="text-center mb-5 mt-4">
        <h2 className="display-5 fw-bold font-serif" style={{ color: 'var(--text-dark)' }}>{t('contactPage.title')}</h2>
        <p className="text-muted font-sans" style={{ maxWidth: '600px', margin: '0 auto', lineHeight: '1.6' }}>
          {t('contactPage.desc')}
        </p>
      </div>

      <div className="row g-5 justify-content-center">
        {/* Informations de contact */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm rounded-0 p-5 h-100 bg-pastel-light">
            <h4 className="fw-bold font-serif mb-4" style={{ color: 'var(--text-dark)' }}>{t('contactPage.infoTitle')}</h4>
            
            <div className="d-flex align-items-start mb-4">
              <div className="me-3 mt-1 text-gold">
                <FaMapMarkerAlt size={20} />
              </div>
              <div>
                <h6 className="fw-semibold mb-1">{t('contactPage.shop')}</h6>
                <p className="text-muted mb-0 font-sans">15 Avenue Mohammed V,<br/>Guéliz, Marrakech, Maroc</p>
              </div>
            </div>

            <div className="d-flex align-items-start mb-4">
              <div className="me-3 mt-1 text-gold">
                <FaPhoneAlt size={20} />
              </div>
              <div>
                <h6 className="fw-semibold mb-1">{t('contactPage.phone')}</h6>
                <p className="text-muted mb-0 font-sans">+212 5 24 43 21 00</p>
              </div>
            </div>

            <div className="d-flex align-items-start mb-5">
              <div className="me-3 mt-1 text-gold">
                <FaEnvelope size={20} />
              </div>
              <div>
                <h6 className="fw-semibold mb-1">{t('contactPage.emailLabel')}</h6>
                <p className="text-muted mb-0 font-sans">hello@lallabeauty.ma</p>
              </div>
            </div>

            <hr className="mb-4" style={{ borderColor: 'rgba(193, 154, 107, 0.3)' }} />
            
            <h6 className="fw-semibold mb-3">{t('contactPage.followUs')}</h6>
            <div className="d-flex gap-3">
              <a href="#" className="btn btn-outline-custom rounded-circle p-2 d-flex align-items-center justify-content-center" style={{ width: '45px', height: '45px' }}>
                <FaInstagram size={18} />
              </a>
              <a href="#" className="btn btn-outline-custom rounded-circle p-2 d-flex align-items-center justify-content-center" style={{ width: '45px', height: '45px' }}>
                <FaFacebookF size={18} />
              </a>
            </div>
          </div>
        </div>

        {/* Formulaire de contact */}
        <div className="col-lg-7">
          <div className="card border-0 shadow-sm rounded-0 p-5 glass h-100">
            <h4 className="fw-bold font-serif mb-4" style={{ color: 'var(--text-dark)' }}>{t('contactPage.formTitle')}</h4>
            
            <form onSubmit={handleSubmit}>
              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label className="form-label text-muted fw-semibold font-sans">{t('contactPage.fullName')}</label>
                  <input 
                    type="text" 
                    className="form-control form-control-custom" 
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required 
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label text-muted fw-semibold font-sans">{t('contactPage.emailLabel')}</label>
                  <input 
                    type="email" 
                    className="form-control form-control-custom" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required 
                  />
                </div>
              </div>
              
              <div className="mb-3">
                <label className="form-label text-muted fw-semibold font-sans">{t('contactPage.subject')}</label>
                <input 
                  type="text" 
                  className="form-control form-control-custom" 
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required 
                />
              </div>

              <div className="mb-4">
                <label className="form-label text-muted fw-semibold font-sans">{t('contactPage.messageLabel')}</label>
                <textarea 
                  className="form-control form-control-custom" 
                  rows="5" 
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>

              <button type="submit" className="btn btn-primary-custom w-100 btn-lg" disabled={loading}>
                {loading ? t('contactPage.sending') : t('contactPage.sendBtn')}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
