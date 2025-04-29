import React from 'react';
import { Lock, Mail, Loader } from 'lucide-react';
import logo from '../../../img/LOGO (1).png';

interface LoginFormProps {
  email: string;
  password: string;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading?: boolean;
}

export function LoginForm({
  email,
  password,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  isLoading = false
}: LoginFormProps) {
  return (
    <div className=" bg-transparent rounded-xl shadow-lg w-[400px]">
      <div className="flex items-center justify-center">
        <div className="bg-gray-50 w-full rounded-xl shadow-sm p-10 bg-gradient-to-b from-blue-100 to-white  ">
          <form onSubmit={onSubmit} className="flex flex-col space-y-6 ">
            <div className="flex flex-col items-center space-y-5">
              <img
                src={logo}
                alt="Melbo Logo"
                className="h-29 w-auto"
              />
              <h1 className="text-gray-700  font-semibold">Bienvenid@</h1>
              <p className="text-gray-500 text-sm">Inicia sesion para continuar</p>
            </div>
            <div className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-600 h-5 w-5" />
                <input
                  className="w-full pl-10 p-3 bg-gray-50 rounded-lg border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-gray-700"
                  placeholder="Ingresa tu email"
                  value={email}
                  onChange={(e) => onEmailChange(e.target.value)}
                  type="email"
                  name="email"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-600 h-5 w-5" />
                <input
                  className="w-full pl-10 p-3 bg-gray-50 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-green-200 transition-all duration-200 text-gray-700"
                  placeholder="Contraseña"
                  type="password"
                  name="password"
                  value={password}
                  onChange={(e) => onPasswordChange(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center font-medium shadow-sm hover:shadow-md"
            >
              {isLoading ? (
                <>
                  <Loader className="animate-spin -ml-1 mr-2 h-5 w-5" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}