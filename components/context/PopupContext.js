"use client"
import React, { createContext, useContext, useState } from 'react';
import styles from './Popup.module.css'; // Import the CSS Module

const PopupContext = createContext();

export const usePopup = () => {
  return useContext(PopupContext);
};

export const PopupProvider = ({ children }) => {
  const [popup, setPopup] = useState({ message: '', isVisible: false });

  const showPopup = (message) => {
    setPopup({ message, isVisible: true });
  };

  const hidePopup = () => {
    setPopup({ ...popup, isVisible: false });
  };

  return (
    <PopupContext.Provider value={{ showPopup, hidePopup }}>
      {children}
      {popup.isVisible && (
        <ErrorPopup message={popup.message} onClose={hidePopup} />
      )}
    </PopupContext.Provider>
  );
};

const ErrorPopup = ({ message, onClose }) => (
  <div className={styles.errorPopup}>
    <div className={styles.errorContent}>
      <h2>Error</h2>
      <p>{message}</p>
      <button onClick={onClose}>Close</button>
    </div>
  </div>
);
