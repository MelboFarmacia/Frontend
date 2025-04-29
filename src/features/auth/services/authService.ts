import { api } from '../../../lib/api';

interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    role: string;
    name: string;
  };
}

export const login = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    const response = await api.post<AuthResponse>('/auth/login', { email, password });
    
    if (response.data?.token) {
      // Guardar token y datos de usuario
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      // Configurar el token para futuras peticiones
      api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      
      return response.data;
    }
    
    throw new Error('Respuesta inválida del servidor');
  } catch (error: any) {
    const errorMessage = error?.response?.data?.message || 
                        error?.message || 
                        'Error al iniciar sesión';
    throw new Error(errorMessage);
  }
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  delete api.defaults.headers.common['Authorization'];
};

export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem('token');
  return !!token;
};