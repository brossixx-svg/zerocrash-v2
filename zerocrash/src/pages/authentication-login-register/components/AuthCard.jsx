import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';

const AuthCard = () => {
  const [activeTab, setActiveTab] = useState('login');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  // Login form state
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  // Register form state
  const [registerForm, setRegisterForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  });

  // Form errors
  const [errors, setErrors] = useState({});

  // Mock credentials for testing
  const mockCredentials = {
    email: 'admin@zerocrash.com',
    password: 'ZeroCrash2025!'
  };

  const validateLoginForm = () => {
    const newErrors = {};
    
    if (!loginForm?.email) {
      newErrors.email = 'Email è richiesta';
    } else if (!/\S+@\S+\.\S+/?.test(loginForm?.email)) {
      newErrors.email = 'Formato email non valido';
    }
    
    if (!loginForm?.password) {
      newErrors.password = 'Password è richiesta';
    } else if (loginForm?.password?.length < 6) {
      newErrors.password = 'Password deve essere almeno 6 caratteri';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const validateRegisterForm = () => {
    const newErrors = {};
    
    if (!registerForm?.name) {
      newErrors.name = 'Nome è richiesto';
    } else if (registerForm?.name?.length < 2) {
      newErrors.name = 'Nome deve essere almeno 2 caratteri';
    }
    
    if (!registerForm?.email) {
      newErrors.email = 'Email è richiesta';
    } else if (!/\S+@\S+\.\S+/?.test(registerForm?.email)) {
      newErrors.email = 'Formato email non valido';
    }
    
    if (!registerForm?.password) {
      newErrors.password = 'Password è richiesta';
    } else if (registerForm?.password?.length < 8) {
      newErrors.password = 'Password deve essere almeno 8 caratteri';
    }
    
    if (!registerForm?.confirmPassword) {
      newErrors.confirmPassword = 'Conferma password è richiesta';
    } else if (registerForm?.password !== registerForm?.confirmPassword) {
      newErrors.confirmPassword = 'Le password non corrispondono';
    }
    
    if (!registerForm?.acceptTerms) {
      newErrors.acceptTerms = 'Devi accettare i termini e condizioni';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleLoginSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateLoginForm()) return;

    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Check mock credentials
      if (loginForm?.email === mockCredentials?.email && loginForm?.password === mockCredentials?.password) {
        // Success - redirect to dashboard
        navigate('/dashboard');
      } else {
        setErrors({
          general: `Credenziali non valide. Usa: ${mockCredentials?.email} / ${mockCredentials?.password}`
        });
      }
    } catch (error) {
      setErrors({
        general: 'Errore durante il login. Riprova.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateRegisterForm()) return;

    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Success - redirect to dashboard
      navigate('/dashboard');
    } catch (error) {
      setErrors({
        general: 'Errore durante la registrazione. Riprova.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider) => {
    setIsLoading(true);
    
    try {
      // Simulate social login
      await new Promise(resolve => setTimeout(resolve, 1000));
      navigate('/dashboard');
    } catch (error) {
      setErrors({
        general: `Errore durante il login con ${provider}. Riprova.`
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    alert('Funzionalità di recupero password non ancora implementata');
  };

  return (
    <div className="w-full max-w-md mx-auto bg-card border border-border rounded-xl shadow-elevation-2 overflow-hidden">
      {/* Header */}
      <div className="p-6 pb-0">
        <div className="flex items-center justify-center mb-6">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
            <Icon name="Zap" size={24} color="white" />
          </div>
        </div>
        <h1 className="text-2xl font-semibold text-center text-text-primary mb-2">
          Benvenuto in ZeroCrash
        </h1>
        <p className="text-center text-text-secondary text-sm mb-6">
          Piattaforma professionale per IT trend scouting
        </p>
      </div>
      {/* Tab Navigation */}
      <div className="px-6">
        <div className="flex bg-muted rounded-lg p-1 mb-6">
          <button
            onClick={() => setActiveTab('login')}
            className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-all duration-200 ${
              activeTab === 'login' ?'bg-card text-text-primary shadow-sm' :'text-text-secondary hover:text-text-primary'
            }`}
          >
            Accedi
          </button>
          <button
            onClick={() => setActiveTab('register')}
            className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-all duration-200 ${
              activeTab === 'register' ?'bg-card text-text-primary shadow-sm' :'text-text-secondary hover:text-text-primary'
            }`}
          >
            Registrati
          </button>
        </div>
      </div>
      {/* Forms */}
      <div className="px-6 pb-6">
        {/* General Error */}
        {errors?.general && (
          <div className="mb-4 p-3 bg-error/10 border border-error/20 rounded-lg">
            <p className="text-error text-sm">{errors?.general}</p>
          </div>
        )}

        {/* Login Form */}
        {activeTab === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              placeholder="inserisci@email.com"
              value={loginForm?.email}
              onChange={(e) => setLoginForm({...loginForm, email: e?.target?.value})}
              error={errors?.email}
              required
            />

            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? "text" : "password"}
                placeholder="Inserisci la password"
                value={loginForm?.password}
                onChange={(e) => setLoginForm({...loginForm, password: e?.target?.value})}
                error={errors?.password}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-text-secondary hover:text-text-primary"
              >
                <Icon name={showPassword ? "EyeOff" : "Eye"} size={18} />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <Checkbox
                label="Ricordami"
                checked={loginForm?.rememberMe}
                onChange={(e) => setLoginForm({...loginForm, rememberMe: e?.target?.checked})}
              />
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-sm text-accent hover:text-accent/80 transition-colors"
              >
                Password dimenticata?
              </button>
            </div>

            <Button
              type="submit"
              variant="default"
              loading={isLoading}
              fullWidth
              className="mt-6"
            >
              Accedi
            </Button>
          </form>
        )}

        {/* Register Form */}
        {activeTab === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            <Input
              label="Nome completo"
              type="text"
              placeholder="Mario Rossi"
              value={registerForm?.name}
              onChange={(e) => setRegisterForm({...registerForm, name: e?.target?.value})}
              error={errors?.name}
              required
            />

            <Input
              label="Email"
              type="email"
              placeholder="inserisci@email.com"
              value={registerForm?.email}
              onChange={(e) => setRegisterForm({...registerForm, email: e?.target?.value})}
              error={errors?.email}
              required
            />

            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? "text" : "password"}
                placeholder="Minimo 8 caratteri"
                value={registerForm?.password}
                onChange={(e) => setRegisterForm({...registerForm, password: e?.target?.value})}
                error={errors?.password}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-text-secondary hover:text-text-primary"
              >
                <Icon name={showPassword ? "EyeOff" : "Eye"} size={18} />
              </button>
            </div>

            <div className="relative">
              <Input
                label="Conferma password"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Ripeti la password"
                value={registerForm?.confirmPassword}
                onChange={(e) => setRegisterForm({...registerForm, confirmPassword: e?.target?.value})}
                error={errors?.confirmPassword}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-9 text-text-secondary hover:text-text-primary"
              >
                <Icon name={showConfirmPassword ? "EyeOff" : "Eye"} size={18} />
              </button>
            </div>

            <Checkbox
              label="Accetto i termini e condizioni e la privacy policy"
              checked={registerForm?.acceptTerms}
              onChange={(e) => setRegisterForm({...registerForm, acceptTerms: e?.target?.checked})}
              error={errors?.acceptTerms}
              required
            />

            <Button
              type="submit"
              variant="default"
              loading={isLoading}
              fullWidth
              className="mt-6"
            >
              Crea account
            </Button>
          </form>
        )}

        {/* Social Login */}
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-card text-text-secondary">oppure</span>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            <Button
              variant="outline"
              fullWidth
              onClick={() => handleSocialLogin('Google')}
              disabled={isLoading}
              iconName="Chrome"
              iconPosition="left"
            >
              Continua con Google
            </Button>
            <Button
              variant="outline"
              fullWidth
              onClick={() => handleSocialLogin('LinkedIn')}
              disabled={isLoading}
              iconName="Linkedin"
              iconPosition="left"
            >
              Continua con LinkedIn
            </Button>
          </div>
        </div>

        {/* Demo Credentials Info */}
        <div className="mt-6 p-3 bg-accent/10 border border-accent/20 rounded-lg">
          <p className="text-xs text-accent text-center">
            <Icon name="Info" size={14} className="inline mr-1" />
            Demo: {mockCredentials?.email} / {mockCredentials?.password}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthCard;