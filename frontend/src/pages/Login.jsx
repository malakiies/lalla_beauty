import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Login = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const [errorMsg, setErrorMsg] = useState('');
  
  const { login, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const redirect = location.search ? location.search.split('=')[1] : '/';

  useEffect(() => {
    if (user) {
      navigate(redirect);
    }
  }, [navigate, user, redirect]);

  const onSubmit = async (data) => {
    const res = await login(data.email, data.password);
    if (!res.success) {
      setErrorMsg(res.error);
      toast.error('Identifiants incorrects');
    } else {
      toast.success('Bienvenue sur Lalla Beauty ! ✨');
    }
  };

  return (
    <div className="container py-5 d-flex justify-content-center align-items-center" style={{ minHeight: 'calc(100vh - 80px)' }}>
      <div className="col-md-6 col-lg-5">
        <div className="card border-0 shadow-sm rounded-4 glass p-3">
          <div className="card-body">
            <h3 className="text-center fw-bold mb-3" style={{ color: 'var(--text-dark)' }}>Connexion</h3>
            
            {errorMsg && <div className="alert alert-danger rounded-3">{errorMsg}</div>}
            
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-3">
                <label className="form-label text-muted fw-semibold">Email</label>
                <input 
                  type="email" 
                  className={`form-control form-control-custom ${errors.email ? 'is-invalid' : ''}`} 
                  {...register('email', { required: 'L\'email est requis', pattern: { value: /^\S+@\S+$/i, message: 'Email invalide' } })}
                />
                {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
              </div>
              <div className="mb-3">
                <label className="form-label text-muted fw-semibold">Mot de passe</label>
                <input 
                  type="password" 
                  className={`form-control form-control-custom ${errors.password ? 'is-invalid' : ''}`} 
                  {...register('password', { required: 'Le mot de passe est requis' })}
                />
                {errors.password && <div className="invalid-feedback">{errors.password.message}</div>}
              </div>
              <button type="submit" className="btn btn-primary-custom w-100 mb-3" disabled={isSubmitting}>
                {isSubmitting ? 'Connexion en cours...' : 'Se connecter'}
              </button>
            </form>
            
            <div className="text-center mt-3 text-muted pb-3 border-bottom">
              Nouveau client ? <Link to={`/register?redirect=${redirect}`} style={{ color: 'var(--primary)' }}>Créer un compte</Link>
            </div>
            
            <div className="text-center mt-3">
              <Link to="/admin/login" className="text-muted small text-decoration-none hover-gold transition-custom d-inline-flex align-items-center gap-1">
                <span>🛡️</span> Accès Administrateur
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
