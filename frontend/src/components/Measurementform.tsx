import React, { useState, ChangeEvent, FormEvent } from 'react';
import './MeasurementForm.css'; // Import the CSS file

// Define the shape of the data you'll be storing
interface Measurements {
  chest: number;
  waist: number;
  inseam: number;
}

const MeasurementForm: React.FC = () => {
  const [measurements, setMeasurements] = useState<Measurements>({
    chest: 0,
    waist: 0,
    inseam: 0,
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setMeasurements({
      ...measurements,
      [name]: Number(value),
    });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log('Submitted Measurements:', measurements);
    alert(`Measurements submitted!\nChest: ${measurements.chest} inches\nWaist: ${measurements.waist} inches\nInseam: ${measurements.inseam} inches`);
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Enter Your Measurements</h2>
      <p className="form-description">
        Please provide three key measurements for a perfect fit.
      </p>
      <form onSubmit={handleSubmit} className="measurement-form">
        <div className="form-group">
          <label htmlFor="chest">Chest (inches)</label>
          <input
            type="number"
            id="chest"
            name="chest"
            value={measurements.chest}
            onChange={handleInputChange}
            required
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="waist">Waist (inches)</label>
          <input
            type="number"
            id="waist"
            name="waist"
            value={measurements.waist}
            onChange={handleInputChange}
            required
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="inseam">Inseam (inches)</label>
          <input
            type="number"
            id="inseam"
            name="inseam"
            value={measurements.inseam}
            onChange={handleInputChange}
            required
            className="form-input"
          />
        </div>
        <button type="submit" className="submit-button">Submit</button>
      </form>
    </div>
  );
};

export default MeasurementForm;