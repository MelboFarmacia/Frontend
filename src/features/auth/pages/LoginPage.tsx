import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { LoginForm } from '../components/LoginForm';
import { login } from '../services/authService';
import fondoLogin from '../../../img/FondoLogin.png';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await login(email, password);
      
      if (response?.token) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('role', response.role);
        toast.success('Inicio de sesión exitoso');
        navigate('/welcome');
      } else {
        throw new Error('Respuesta inválida del servidor');
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Error al iniciar sesión';
      toast.error(errorMessage);
      console.error('Error de login:', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F3F4FF] flex items-center justify-center md:justify-end p-4 relative">
      {/* Left side - Image */}
      <div className="absolute inset-x-0 bottom-0 w-full lg:w-[75%] z-0" style={{ marginBottom: '0' }}>
        <img 
          src={fondoLogin} 
          alt="Melbo animated image" 
          className="w-full h-auto object-contain"
        />
      </div>

      {/* Right side - Login Form */}
      <div className="w-full sm:w-[400px] lg:w-[420px] flex items-center justify-center md:justify-end p-4 z-10 lg:mr-20">
        <LoginForm 
          email={email}
          password={password}
          onEmailChange={setEmail}
          onPasswordChange={setPassword}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}