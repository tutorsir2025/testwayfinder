
import { toast } from "@/components/ui/use-toast";

// User types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  exams: string[];
  completedExams: string[];
  certificates: string[];
}

// Mock storage key
const USER_STORAGE_KEY = 'certifypro-user';
const USERS_STORAGE_KEY = 'certifypro-users';

// Mock user database
export const initializeUsers = () => {
  if (!localStorage.getItem(USERS_STORAGE_KEY)) {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify([]));
  }
};

// Authentication functions
export const register = async (
  email: string, 
  password: string, 
  firstName: string, 
  lastName: string
): Promise<User | null> => {
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    initializeUsers();
    const users = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) || '[]');
    
    // Check if user already exists
    if (users.some((user: any) => user.email === email)) {
      toast({
        title: "Registration failed",
        description: "A user with this email already exists.",
        variant: "destructive",
      });
      return null;
    }
    
    // Create new user
    const newUser: User = {
      id: Date.now().toString(),
      email,
      firstName,
      lastName,
      exams: [],
      completedExams: [],
      certificates: [],
    };
    
    // Save password separately (in a real app, this would be hashed)
    const userWithPassword = {
      ...newUser,
      password,
    };
    
    users.push(userWithPassword);
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    
    // Save current user without password
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(newUser));
    
    return newUser;
  } catch (error) {
    console.error('Registration error:', error);
    toast({
      title: "Registration failed",
      description: "An unexpected error occurred. Please try again.",
      variant: "destructive",
    });
    return null;
  }
};

export const login = async (email: string, password: string): Promise<User | null> => {
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    initializeUsers();
    const users = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) || '[]');
    
    // Find user
    const user = users.find((u: any) => u.email === email && u.password === password);
    
    if (!user) {
      toast({
        title: "Login failed",
        description: "Invalid email or password.",
        variant: "destructive",
      });
      return null;
    }
    
    // Remove password before storing in session
    const { password: _, ...userWithoutPassword } = user;
    
    // Save current user
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userWithoutPassword));
    
    return userWithoutPassword;
  } catch (error) {
    console.error('Login error:', error);
    toast({
      title: "Login failed",
      description: "An unexpected error occurred. Please try again.",
      variant: "destructive",
    });
    return null;
  }
};

export const logout = (): void => {
  localStorage.removeItem(USER_STORAGE_KEY);
};

export const getCurrentUser = (): User | null => {
  const userJson = localStorage.getItem(USER_STORAGE_KEY);
  return userJson ? JSON.parse(userJson) : null;
};

export const updateUser = (userData: Partial<User>): User | null => {
  const currentUser = getCurrentUser();
  if (!currentUser) return null;
  
  const updatedUser = { ...currentUser, ...userData };
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser));
  
  // Also update in users array
  const users = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) || '[]');
  const updatedUsers = users.map((user: any) => 
    user.id === currentUser.id ? { ...user, ...userData } : user
  );
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsers));
  
  return updatedUser;
};
