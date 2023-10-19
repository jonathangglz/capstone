import React, { useEffect, useState } from "react";
import { Link, useParams, useHistory } from "react-router-dom";
import { readDeck, updateDeck } from "../utils/api";

function EditDeck() {
    const initialFormState = {
        id: "",
        name: "",
        description: "",
    };
    const [formData, setFormData] = useState({ ...initialFormState });
    const history = useHistory();

    const { deckId } = useParams();

    useEffect(() => {
        // Initialize an AbortController to control fetch requests. 
        const abortController = new AbortController();
        
        async function loadStudyDeck() {
            try {
                // Fetch the list of decks and retrive deck data.
                const response = await readDeck(deckId, abortController.signal)
                setFormData({
                    id: response.id,
                    name: response.name,
                    description: response.description
                });
            } catch (error) {
                // If an error occurs and it's not an abort error, log the error.
                if (error.name !== "AbortError") {
                    console.log(error);
                    }
            }
        }
        loadStudyDeck();

        return () => {
            abortController.abort();
        };
    }, [deckId]);

    const handleChange = ({ target }) => {
        setFormData({
        ...formData,
        [target.name]: target.value,
        });
    };
    
    const handleSubmit = async (event) => {
        event.preventDefault();
        await updateDeck(formData);
        history.push(`/decks/${deckId}`);

    };

    const handleCancel = () => {
        history.push(`/decks/${deckId}`);
    };
    
    if (!formData) {
        return (
            <div>
                <h1>No Deck Found</h1>
            </div>
        )
    }

    return (

        <div>
            {/* Breadcrumb Navigation */}
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                    <li className="breadcrumb-item"><Link to={`/decks/${deckId}`}>{formData.name}</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">Edit Deck</li>
                </ol>
            </nav>
            {/* Deck Form */}
            <h2>Edit Deck</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="deckName">Name</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        id="name"
                        name="name"
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
    )
}

export default EditDeck;