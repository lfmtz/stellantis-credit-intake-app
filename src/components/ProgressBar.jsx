import React from 'react';

export const ProgressBar = ({ currentStep, totalSteps, stepTitles }) => {
  const percentage = Math.round((currentStep / (totalSteps - 1)) * 100);

  return (
    <div className="progress-container">
      <div className="progress-header">
        <span className="step-badge">Fase {currentStep} de {totalSteps - 1}</span>
        <span className="step-percentage">{percentage}% Completado</span>
      </div>
      
      <div className="progress-bar-wrapper">
        <div 
          className="progress-bar-fill" 
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="step-indicator-dots">
        {stepTitles.map((title, idx) => {
          if (idx === 0) return null; // Saltar bienvenida
          let classes = "step-dot-wrapper";
          if (idx === currentStep) classes += " active";
          else if (idx < currentStep) classes += " completed";
          
          return (
            <div key={idx} className={classes}>
              <div className="step-dot" />
              <span className="step-dot-label">{title}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
