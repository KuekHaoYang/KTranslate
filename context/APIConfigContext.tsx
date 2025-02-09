'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ServiceType, ModelType } from '@/lib/config/models';

export interface APIConfig {
  service: ServiceType;
  model: ModelType;
  apiKey: string;
  apiHost: string;
}

interface APIConfigContextType {
  config: APIConfig;
  updateConfig: (updates: Partial<APIConfig>) => void;
  getFullEndpoint: () => string;
  isConfigModalOpen: boolean;
  setIsConfigModalOpen: (isOpen: boolean) => void;
}

const DEFAULT_CONFIG: APIConfig = {
  service: 'openai',
  model: 'gpt-4-turbo-preview',
  apiKey: '',
  apiHost: 'https://api.openai.com/v1'
};

const APIConfigContext = createContext<APIConfigContextType | undefined>(undefined);

export function APIConfigProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<APIConfig>(DEFAULT_CONFIG);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);

  useEffect(() => {
    // Load saved config from localStorage
    const savedConfig = localStorage.getItem('apiConfig');
    if (savedConfig) {
      try {
        const parsed = JSON.parse(savedConfig);
        setConfig(parsed);
      } catch (error) {
        console.error('Failed to parse saved API config:', error);
        setConfig(DEFAULT_CONFIG);
      }
    }
  }, []);

  const updateConfig = (updates: Partial<APIConfig>) => {
    setConfig(prev => {
      const newConfig = { ...prev, ...updates };
      localStorage.setItem('apiConfig', JSON.stringify(newConfig));
      return newConfig;
    });
  };

  const getFullEndpoint = () => {
    return `${config.apiHost}/chat/completions`;
  };

  return (
    <APIConfigContext.Provider value={{ 
      config, 
      updateConfig, 
      getFullEndpoint,
      isConfigModalOpen,
      setIsConfigModalOpen
    }}>
      {children}
    </APIConfigContext.Provider>
  );
}

export function useAPIConfig() {
  const context = useContext(APIConfigContext);
  if (context === undefined) {
    throw new Error('useAPIConfig must be used within an APIConfigProvider');
  }
  return context;
} 