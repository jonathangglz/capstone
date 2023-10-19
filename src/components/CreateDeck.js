import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { createDeck } from '../utils/api';

function CreateDeck() {
    const initialFormState = {
        name: "",
        description: "",
    };
    const [formData, setFormData] = useState({ ...initialFormState });
    const history = useHistory();

    const handleChange = ({ target }) => {
        setFormData({
          ...formData,
          [target.name]: target.value,
        });
      };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const newDeck = await createDeck(formData);
        history.push(`/decks/${newDeck.id}`);
    };

    const handleCancel = () => {
        history.push("/");
    };

    return (
        <div>
            {/* Breadcrumb Navigation */}
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">Create Deck</li>
                </ol>
            </nav>

            {/* Deck Form */}
            <h2>Create Deck</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="deckName">Name</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        id="name"
                        name="name"
                        placeholder="Deck Name"
                        value={formData.name} 
                        onChange={handleChange} 
                        required 
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="deckDescription">Description</label>
                    <textarea 
                        className="form-control" 
                        id="description" 
                        name="description"
                        placeholder="Brief description of the deck"
                        rows="5"
                        value={formData.description} 
                        onChange={handleChange} 
                        required
                   />
                </div>
                <button type="button" className="btn btn-secondary mr-2" onClick={handleCancel}>Cancel</button>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    );
}

export default CreateDeck;