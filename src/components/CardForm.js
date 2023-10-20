import React from "react";

function CardForm({ formData, handleSubmit, handleCancel, handleChange, formMode}) {
    return (
        <form onSubmit={(event) => {
            event.preventDefault();
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
        {formMode === "addCard" ? (
            <>
                <button type="button" className="btn btn-secondary mr-2" onClick={handleCancel}>Done</button>
                <button type="submit" className="btn btn-primary">Save</button>
            </>
        ) : (
            <>
                <button type="button" className="btn btn-secondary mr-2" onClick={handleCancel}>Cancel</button>
                <button type="submit" className="btn btn-primary">Submit</button>
            </>
        )}
      </form>
    );
  }
  
  export default CardForm;