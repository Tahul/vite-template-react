import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import './GradientSelector.css';

const GradientSelector = ({ onGradientChange }) => {
  const [gradients, setGradients] = useState([]);
  const [selectedGradientId, setSelectedGradientId] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGradients();
    loadUserPreference();
  }, []);

  const getSessionId = () => {
    let sessionId = localStorage.getItem('gradient_session_id');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('gradient_session_id', sessionId);
    }
    return sessionId;
  };

  const loadGradients = async () => {
    try {
      const { data, error } = await supabase
        .from('gradient_presets')
        .select('*')
        .order('name');

      if (error) throw error;
      setGradients(data || []);
    } catch (error) {
      console.error('Error loading gradients:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserPreference = async () => {
    try {
      const sessionId = getSessionId();
      const { data, error } = await supabase
        .from('user_preferences')
        .select('selected_gradient_id')
        .eq('session_id', sessionId)
        .maybeSingle();

      if (error) throw error;
      if (data?.selected_gradient_id) {
        setSelectedGradientId(data.selected_gradient_id);
        const gradient = gradients.find(g => g.id === data.selected_gradient_id);
        if (gradient) {
          applyGradient(gradient);
        }
      }
    } catch (error) {
      console.error('Error loading user preference:', error);
    }
  };

  const applyGradient = (gradient) => {
    const gradientStyle = `linear-gradient(${gradient.direction}, ${gradient.start_color}, ${gradient.end_color})`;
    document.body.style.background = gradientStyle;
    if (onGradientChange) {
      onGradientChange(gradient);
    }
  };

  const handleGradientSelect = async (gradient) => {
    setSelectedGradientId(gradient.id);
    applyGradient(gradient);

    try {
      const sessionId = getSessionId();
      const { data: existing } = await supabase
        .from('user_preferences')
        .select('id')
        .eq('session_id', sessionId)
        .maybeSingle();

      if (existing) {
        await supabase
          .from('user_preferences')
          .update({
            selected_gradient_id: gradient.id,
            updated_at: new Date().toISOString()
          })
          .eq('session_id', sessionId);
      } else {
        await supabase
          .from('user_preferences')
          .insert({
            session_id: sessionId,
            selected_gradient_id: gradient.id
          });
      }
    } catch (error) {
      console.error('Error saving preference:', error);
    }
  };

  useEffect(() => {
    if (gradients.length > 0 && selectedGradientId) {
      const gradient = gradients.find(g => g.id === selectedGradientId);
      if (gradient) {
        applyGradient(gradient);
      }
    }
  }, [gradients, selectedGradientId]);

  return (
    <div className="gradient-selector-container">
      <button
        className="gradient-toggle-btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle gradient selector"
      >
        🎨
      </button>

      {isOpen && (
        <div className="gradient-panel">
          <div className="gradient-panel-header">
            <h3>Choose Background</h3>
            <button
              className="close-btn"
              onClick={() => setIsOpen(false)}
              aria-label="Close"
            >
              ×
            </button>
          </div>

          {loading ? (
            <div className="loading">Loading gradients...</div>
          ) : (
            <div className="gradient-grid">
              {gradients.map((gradient) => (
                <button
                  key={gradient.id}
                  className={`gradient-card ${selectedGradientId === gradient.id ? 'selected' : ''}`}
                  onClick={() => handleGradientSelect(gradient)}
                  style={{
                    background: `linear-gradient(${gradient.direction}, ${gradient.start_color}, ${gradient.end_color})`
                  }}
                >
                  <span className="gradient-name">{gradient.name}</span>
                  {selectedGradientId === gradient.id && (
                    <span className="selected-indicator">✓</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GradientSelector;
