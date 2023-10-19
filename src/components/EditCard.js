import React, { useEffect, useState } from "react";
import { Link, useParams, useHistory} from "react-router-dom";
import { readCard, readDeck, updateCard } from "../utils/api";
import CardForm from "./CardForm";


function EditCard() {
    const history = useHistory();

    const initialFormState = {
        deckId: "",
        front: "",
        back: "",
        id: "",
    };
    const [formData, setFormData] = useState({ ...initialFormState });

    const { deckId, cardId } = useParams();
    const [deck, setDeck] = useState(null);

    useEffect(() => {
        // Initialize an AbortController to control fetch requests. 
        const abortController = new AbortController();
        
        async function loadStudyCard() {
            try {
                // Fetch the list of decks.
                const loadedDeck = await readDeck(deckId, abortController.signal)
                setDeck(loadedDeck);

                const loadedCard = await readCard(cardId, abortController.signal)
                
                setFormData({
                    deckId: loadedCard.deckId,
                    front: loadedCard.front,
                    back: loadedCard.back,
                    id: loadedCard.id
                });

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
    }, [deckId, cardId]);

    if (!deck) {
        return (
            <div>
                <h1>No Deck Found</h1>
            </div>
        )
    }

    const handleSubmit = async (updatedData) => {
        await updateCard(updatedData);
        history.push(`/decks/${deckId}`);
    };
    
    const handleCancel = () => {
        history.push(`/decks/${deckId}`);
    };

    return (
        <div>
            {/* Breadcrumb Navigation */}
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                    <li className="breadcrumb-item"><Link to={`/decks/${deckId}`}>{deck.name}</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">Edit Card {cardId}</li>
                </ol>
            </nav>
            <h1>Edit Card</h1>
            <CardForm 
                initialData={formData}
                handleSubmit={handleSubmit}
                handleCancel={handleCancel}
            />
        </div>
    )
}

export default EditCard;