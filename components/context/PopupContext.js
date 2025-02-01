"use client"
import React, { createContext, useContext, useEffect, useState } from 'react';
import styles from './Popup.module.css'; // Import the CSS Module
import { getSocket } from '../../functions/socket';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const PopupContext = createContext();

export const usePopup = () => {
  return useContext(PopupContext);
};

export const PopupProvider = ({ children }) => {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [typeofpopup, settypeofpopup] = useState("");
  const [challenge, setChallenge] = useState(null);
  const [socket, setSocket] = useState(null);
  const [pos, setPos] = useState(null);
  const session = useSession();

  useEffect(() => {
    if (session && session.data)
      setSocket(getSocket(session.data?.user, showPopup, router))
  }, [session])

  const showPopup = (message, type, position, challenge) => {
    if (position) {
      setPos(position)
    }
    setMessage(message)
    settypeofpopup(type)
    if (challenge)
      setChallenge(challenge)
  };

  const hidePopup = () => {
    settypeofpopup("")
  };

  return (
    <PopupContext.Provider value={{ showPopup, hidePopup }}>
      {children}
      {typeofpopup == "error" && (
        <ErrorPopup message={message} onClose={hidePopup} pos={pos} />
      )}
      {typeofpopup == "challenge" && (
        <ChallengePopup message={message} onClose={hidePopup} challenge={challenge} socket={socket} pos={pos} />
      )}
      {typeofpopup == "message" && (
        <MessagePopup message={message} onClose={hidePopup} pos={pos} />
      )}
    </PopupContext.Provider>
  );
};

const ErrorPopup = ({ message, onClose, pos }) => (
  <div className={`${styles.popup} ${styles[pos]}`}>
    <div className={styles.content}>
      <h2>Error</h2>
      <p>{message}</p>
      <button onClick={onClose}>Close</button>
    </div>
  </div>
);

const ChallengePopup = ({ message, onClose, challenge, socket, pos }) => (
  <div className={`${styles.popup} ${styles[pos]}`}>
    <p>{message}</p>
    <button onClick={() => {
      socket.emit('challenge-accepted', challenge)
      onClose()
    }}>
      Accept
    </button>
    <button onClick={onClose}>Decline</button>

  </div>
);

const MessagePopup = ({ message, onClose, pos }) => (
  <div className={`${styles.popup} ${styles[pos]}`}>
    <div className={styles.content}>
      <p>{message}</p>
      <button onClick={onClose}>Close</button>
    </div>
  </div>
);