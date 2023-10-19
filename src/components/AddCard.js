import React, { useEffect, useState } from "react";
import { Link, useParams, useHistory} from "react-router-dom";
import { createCard, readDeck } from "../utils/api";
import CardForm from "./CardForm";


function AddCard() {
    const history = useHistory();

    const initialFormState = {
        front: "",
        back: "",
    };
    const [formData, setFormData] = useState({ ...initialFormState });

    const { deckId } = useParams();
    const [deck, setDeck] = useState(null);

    useEffect(() => {
        // Initialize an AbortController to control fetch requests. 
        const abortController = new AbortController();
        
        async function loadStudyCard() {
            try {
                // Fetch the list of decks.
                const response = await readDeck(deckId, abortController.signal)
                setDeck(response);
            } catch (error) {
                // If an error occurs and it's not an abort error, log the error.
                if (error.name !== "AbortError") {
                    console.log(error);
                    }
            }
        }
        loadStudyCard();

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

    const handleSubmit = async (updatedData) => {
        await createCard(deckId, updatedData);
        history.push(`/decks/${deckId}`);
    };
    
    const handleCancel = () => {
        history.push(`/decks/${deckId}`);
    };

    if (!deck) {
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
                    <li className="breadcrumb-item"><Link to={`/decks/${deckId}`}>{deck.name}</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">Add Card</li>
                </ol>
            </nav>
            <h1>{`${deck.name}: Add Card`}</h1>
            <CardForm 
                initialData={formData}
                handleSubmit={handleSubmit}
                handleCancel={handleCancel}
            />
        </div>

    )
}

export default AddCard;