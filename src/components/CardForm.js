import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

function CardForm({ initialData, handleSubmit, handleCancel }) {
    const history = useHistory();
    const [formData, setFormData] = useState(initialData);
    
    useEffect(() => {
        setFormData(initialData);
    }, [initialData]);

    const handleChange = ({ target }) => {
      setFormData({
        ...formData,
        [target.name]: target.value,
      });
    };
  
    return (
        <form onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(formData);
        }}>        
        <div className="form-group">
          <label htmlFor="cardFront">Front</label>
          <textarea 
            type="text" 
            className="form-control" 
            id="front"
            name="front"
            rows="4"
            value={formData.front} 
            onChange={handleChange} 
            required 
          />
        </div>
        <div className="form-group">
          <label htmlFor="cardBack">Back</label>
          <textarea 
            className="form-control" 
            id="back" 
            name="back"
            rows="4"
            value={formData.back} 
            onChange={handleChange} 
            required
          />
        </div>
        <button type="button" className="btn btn-secondary mr-2" onClick={handleCancel}>Cancel</button>
        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
    );
  }
  
  export default CardForm;