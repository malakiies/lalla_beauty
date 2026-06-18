import { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Register = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const { register, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const redirect = location.search ? location.search.split('=')[1] : '/';

  useEffect(() => {
    if (user) {
      navigate(redirect);
    }
  }, [navigate, user, redirect]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage('Les mots de passe ne correspondent pas');
      toast.error('Les mots de passe ne correspondent pas');
    } else {
      const res = await register(firstName, lastName, email, password);
      if (!res.success) {
        setErrorMsg(res.error);
        toast.error(res.error || 'Erreur lors de l\'inscription');
      } else {
        toast.success(`Bienvenue ${firstName} ! Votre compte a été créé. ✨`);
      }
    }
  };

  return (
    <div className="container py-5 d-flex justify-content-center align-items-center min-vh-100" style={{ marginTop: '-80px' }}>
      <div className="col-md-6 col-lg-5">
        <div className="card border-0 shadow-sm rounded-0 glass p-4">
          <div className="card-body">
            <h2 className="text-center fw-bold mb-4 font-serif" style={{ color: 'var(--text-dark)' }}>Créer un compte</h2>
            
            {message && <div className="alert alert-danger rounded-0">{message}</div>}
            {errorMsg && <div className="alert alert-danger rounded-0">{errorMsg}</div>}
            
            <form onSubmit={submitHandler}>
              <div className="row mb-3">
                <div className="col-md-6 mb-3 mb-md-0">
                  <label className="form-label text-muted fw-semibold">Prénom</label>
                  <input 
                    type="text" 
                    className="form-control form-control-custom" 
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required 
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label text-muted fw-semibold">Nom</label>
                  <input 
                    type="text" 
                    className="form-control form-control-custom" 
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required 
                  />
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label text-muted fw-semibold">Email</label>
                <input 
                  type="email" 
                  className="form-control form-control-custom" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
              </div>
              <div className="mb-3">
                <label className="form-label text-muted fw-semibold">Mot de passe</label>
                <input 
                  type="password" 
                  className="form-control form-control-custom" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                />
              </div>
              <div className="mb-4">
                <label className="form-label text-muted fw-semibold">Confirmer le mot de passe</label>
                <input 
                  type="password" 
                  className="form-control form-control-custom" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required 
                />
              </div>
              <button type="submit" className="btn btn-primary-custom w-100 mb-3">S'inscrire</button>
            </form>
            
            <div className="text-center mt-3 text-muted">
              Déjà un compte ? <Link to={`/login?redirect=${redirect}`} style={{ color: 'var(--accent)' }}>Connectez-vous</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
