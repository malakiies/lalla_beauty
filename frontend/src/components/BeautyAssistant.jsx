import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FaRobot, FaTimes, FaPaperPlane, FaMagic } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';

const BeautyAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'model',
      text: 'Coucou ! Je suis Lalla, ton assistante beauté personnelle. As-tu besoin de conseils skincare ou d\'aide pour choisir un produit ? ✨'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const sendMessage = async (e) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const history = messages.slice(1); // Exclude initial greeting to let system prompt take over
      const { data } = await axios.post('/api/chat', {
        message: userMessage,
        history
      });
      
      setMessages(prev => [...prev, { role: 'model', text: data.text }]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = error.response?.data?.message || 'Désolé, je rencontre un problème de connexion. 😔';
      setMessages(prev => [...prev, { role: 'model', text: errorMessage }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ position: 'fixed', bottom: '30px', right: '30px', zIndex: 1050 }}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="card shadow-lg border-0 overflow-hidden glass"
            style={{ 
              width: '380px', 
              height: '550px', 
              marginBottom: '20px',
              borderRadius: '20px',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {/* Header */}
            <div className="bg-dark text-white p-3 d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center gap-3">
                <div 
                  className="bg-gold d-flex justify-content-center align-items-center rounded-circle" 
                  style={{ width: '40px', height: '40px' }}
                >
                  <FaMagic size={18} className="text-white" />
                </div>
                <div>
                  <h6 className="mb-0 fw-bold font-serif letter-spacing-1">Lalla AI</h6>
                  <small className="text-white-50">Assistante Beauté</small>
                </div>
              </div>
              <button 
                className="btn btn-sm text-white-50 hover-white" 
                onClick={() => setIsOpen(false)}
              >
                <FaTimes size={20} />
              </button>
            </div>

            {/* Chat Body */}
            <div className="flex-grow-1 p-3 overflow-auto" style={{ backgroundColor: 'rgba(255,255,255,0.8)' }}>
              {messages.map((msg, idx) => (
                <div 
                  key={idx} 
                  className={`d-flex mb-3 ${msg.role === 'user' ? 'justify-content-end' : 'justify-content-start'}`}
                >
                  <div 
                    className={`p-3 rounded-4 shadow-sm ${msg.role === 'user' ? 'bg-gold text-white' : 'bg-white text-dark'}`}
                    style={{ 
                      maxWidth: '85%',
                      borderBottomRightRadius: msg.role === 'user' ? '4px' : '20px',
                      borderBottomLeftRadius: msg.role === 'model' ? '4px' : '20px',
                      fontSize: '0.95rem'
                    }}
                  >
                    {msg.role === 'model' ? (
                      <ReactMarkdown
                        components={{
                          p: ({node, ...props}) => <p className="mb-1" {...props} />,
                          ul: ({node, ...props}) => <ul className="mb-1 ps-3" {...props} />,
                          strong: ({node, ...props}) => <strong className="fw-bold" style={{color: 'var(--primary-dark)'}} {...props} />
                        }}
                      >
                        {msg.text}
                      </ReactMarkdown>
                    ) : (
                      msg.text
                    )}
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="d-flex mb-3 justify-content-start">
                  <div className="bg-white p-3 rounded-4 shadow-sm d-flex align-items-center gap-2" style={{ borderBottomLeftRadius: '4px' }}>
                    <div className="spinner-grow spinner-grow-sm text-gold" role="status"></div>
                    <div className="spinner-grow spinner-grow-sm text-gold" role="status" style={{ animationDelay: '0.2s' }}></div>
                    <div className="spinner-grow spinner-grow-sm text-gold" role="status" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input */}
            <div className="p-3 bg-white border-top">
              <form onSubmit={sendMessage} className="d-flex gap-2">
                <input
                  type="text"
                  className="form-control rounded-pill bg-light border-0 px-4 py-2"
                  placeholder="Posez votre question..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={isLoading}
                />
                <button 
                  type="submit" 
                  className="btn btn-dark rounded-circle d-flex justify-content-center align-items-center"
                  style={{ width: '45px', height: '45px', flexShrink: 0 }}
                  disabled={!input.trim() || isLoading}
                >
                  <FaPaperPlane size={16} />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      {!isOpen && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(true)}
          className="btn shadow-lg rounded-circle d-flex justify-content-center align-items-center"
          style={{ 
            width: '65px', 
            height: '65px', 
            backgroundColor: 'var(--accent)',
            color: 'white',
            border: 'none'
          }}
        >
          <FaRobot size={30} />
        </motion.button>
      )}
    </div>
  );
};

export default BeautyAssistant;
