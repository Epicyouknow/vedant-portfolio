'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface EnquiryModalContextType {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

const EnquiryModalContext = createContext<EnquiryModalContextType>({
  isOpen: false,
  openModal: () => {},
  closeModal: () => {},
});

export function EnquiryModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    const handleClose = () => setIsOpen(false);

    window.addEventListener('open-enquiry-modal', handleOpen);
    window.addEventListener('close-enquiry-modal', handleClose);
    document.addEventListener('open-enquiry-modal', handleOpen);
    document.addEventListener('close-enquiry-modal', handleClose);

    // Global helper for console or external scripts
    if (typeof window !== 'undefined') {
      (window as any).openEnquiryModal = handleOpen;
      (window as any).closeEnquiryModal = handleClose;
    }

    return () => {
      window.removeEventListener('open-enquiry-modal', handleOpen);
      window.removeEventListener('close-enquiry-modal', handleClose);
      document.removeEventListener('open-enquiry-modal', handleOpen);
      document.removeEventListener('close-enquiry-modal', handleClose);
    };
  }, []);

  return (
    <EnquiryModalContext.Provider value={{ isOpen, openModal, closeModal }}>
      {children}
    </EnquiryModalContext.Provider>
  );
}

export function useEnquiryModal() {
  const context = useContext(EnquiryModalContext);
  if (!context) {
    throw new Error('useEnquiryModal must be used within an EnquiryModalProvider');
  }
  return context;
}

