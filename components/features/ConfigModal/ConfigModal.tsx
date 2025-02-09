import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAPIConfig } from '@/context/APIConfigContext';
import Dropdown from '../../../components/ui/Dropdown';
import { TRANSLATION_SERVICES, SERVICE_MODELS } from '@/lib/config/models';
import type { ServiceType } from '@/lib/config/models';

export default function ConfigModal() {
  const { config, updateConfig, getFullEndpoint, isConfigModalOpen, setIsConfigModalOpen } = useAPIConfig();
  const [showApiKey, setShowApiKey] = useState(false);
  const [modelInputMode, setModelInputMode] = useState<'dropdown' | 'text'>('dropdown');

  // Load saved modelInputMode on mount
  useEffect(() => {
    const saved = localStorage.getItem('modelInputMode');
    if (saved === 'text') {
      setModelInputMode('text');
    }
  }, []);

  // Save modelInputMode whenever it changes
  useEffect(() => {
    localStorage.setItem('modelInputMode', modelInputMode);
  }, [modelInputMode]);

  if (!isConfigModalOpen) return null;

  const modelOptions = SERVICE_MODELS[config.service as ServiceType];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50">
        <div className="flex items-center justify-center min-h-screen p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-[var(--card-bg)] rounded-2xl p-6 w-full max-w-lg border border-[var(--border-color)] shadow-lg"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">API Configuration</h2>
              <button
                onClick={() => setIsConfigModalOpen(false)}
                className="p-2 hover:bg-[var(--hover-bg)] rounded-lg transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Translation Service</label>
                <Dropdown
                  value={config.service}
                  onChange={(value) => updateConfig({ service: value as ServiceType })}
                  options={TRANSLATION_SERVICES}
                  placeholder="Select a service"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">API Key</label>
                <div className="relative">
                  <input
                    type={showApiKey ? "text" : "password"}
                    value={config.apiKey}
                    onChange={(e) => updateConfig({ apiKey: e.target.value })}
                    placeholder="Enter your API key"
                    className="w-full px-4 py-2.5 rounded-xl bg-[var(--card-bg)] border border-[var(--border-color)] focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-[var(--card-shadow)]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg hover:bg-[var(--hover-bg)] transition-colors"
                  >
                    {showApiKey ? (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-[var(--foreground)]/60">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-[var(--foreground)]/60">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">API Host</label>
                <input
                  type="text"
                  value={config.apiHost}
                  onChange={(e) => updateConfig({ apiHost: e.target.value })}
                  placeholder="API host"
                  className="w-full px-4 py-2.5 rounded-xl bg-[var(--card-bg)] border border-[var(--border-color)] focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-[var(--card-shadow)]"
                />
                <p className="mt-1 text-sm text-[var(--foreground)]/60">
                  Full API endpoint: {getFullEndpoint()}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Model</label>
                <div className="relative flex items-center gap-2">
                  <div className="flex-1">
                    {modelInputMode === 'dropdown' ? (
                      <Dropdown
                        value={config.model}
                        onChange={(value) => updateConfig({ model: value })}
                        options={modelOptions}
                        placeholder="Select a model"
                      />
                    ) : (
                      <input
                        type="text"
                        value={config.model}
                        onChange={(e) => updateConfig({ model: e.target.value })}
                        placeholder="Enter model name"
                        className="w-full px-4 py-2.5 rounded-xl bg-[var(--card-bg)] border border-[var(--border-color)] focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-[var(--card-shadow)]"
                      />
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => setModelInputMode(mode => mode === 'dropdown' ? 'text' : 'dropdown')}
                    className="p-1.5 rounded-lg hover:bg-[var(--hover-bg)] transition-colors flex-shrink-0"
                  >
                    <motion.svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-4 h-4 text-[var(--foreground)]/60"
                      animate={{ rotate: modelInputMode === 'dropdown' ? 0 : 180 }}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                    </motion.svg>
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setIsConfigModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
              >
                Done
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
} 