import api from './api';
import { jwtDecode } from 'jwt-decode';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface JwtResponse {
  token: string;
  type: string;
}

export interface UserData {
  id: number;
  username: string;
  email: string;
  roles: string[];
}

class AuthService {
  async login(loginRequest: LoginRequest): Promise<boolean> {
    try {
      const response = await api.post<JwtResponse>('/auth/login', loginRequest);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        this.storeUserData(response.data.token);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async register(registerRequest: RegisterRequest): Promise<boolean> {
    try {
      const response = await api.post('/auth/register', registerRequest);
      return response.status === 201 || response.status === 200;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  getCurrentUser(): UserData | null {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    if (!token) return false;
    
    try {
      const decoded: any = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      
      // Check if token is expired
      if (decoded.exp < currentTime) {
        this.logout();
        return false;
      }
      
      return true;
    } catch {
      return false;
    }
  }

  private storeUserData(token: string): void {
    try {
      const decoded: any = jwtDecode(token);
      const userData: UserData = {
        id: decoded.id,
        username: decoded.sub,
        email: decoded.email,
        roles: decoded.roles || []
      };
      
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      console.error('Error storing user data:', error);
    }
  }
}

export default new AuthService(); 