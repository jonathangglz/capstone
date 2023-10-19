import React, { useState, useEffect } from 'react';
import { Link, useParams, useHistory } from 'react-router-dom';
import { deleteCard, deleteDeck, readDeck } from '../utils/api';

function Deck() {
    const history = useHistory();

    const [deck, setDeck] = useState(null);
    const { deckId } = useParams();

    useEffect(() => {
    // Initialize an AbortController to control fetch requests. 
    const abortController = new AbortController();

    async function loadDecks() {
        try {
            // Raads the list of decks.
            const response = await readDeck(deckId, abortController.signal);
            
            // Set the fetched decks to state.
            setDeck(response);
        } catch (error) {
            // If an error occurs and it's not an abort error, log the error.
            if (error.name !== "AbortError") {
                console.log(error);
                }
        }
    }
    loadDecks();

    return () => {
        abortController.abort();
    };
}, [deckId]);

async function handleDeleteDeck(deck) {
    // Ask the user for confirmation before deleting the deck
    if (window.confirm('Delete this deck?\n\nYou will not be able to recover it')) {    
        // Delete the deck and return the result
        await deleteDeck(deck.id);
        history.push("/")
    }
}

async function handleDeleteCard(cardId) {

    // Ask the user for confirmation before deleting the deck
    if (window.confirm('Delete this card?\n\nYou will not be able to recover it')) {    
        // Delete the deck and return the result
        
        await deleteCard(cardId);
        const updatedCards = deck.cards.filter(card => card.id !== cardId);
        const updatedDeck = { ...deck, cards: updatedCards };

        setDeck(updatedDeck)
    }
}


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
        <li className="breadcrumb-item active" aria-current="page">{deck.name}</li>
    </ol>
    </nav>

    {/* Deck Details */}
    <h1>{deck.name}</h1>
    <p>{deck.description}</p>

    {/* Deck Actions */}
    <Link 
        to={`/decks/${deckId}/edit`} 
        className="btn btn-secondary mr-2">
        <i className="fas fa-edit"></i> Edit
    </Link>
    <Link 
    to={`/decks/${deckId}/study`} 
    className="btn btn-primary mr-2">
        <i className="fas fa-book"></i> Study
    </Link>
    <Link 
    to={`/decks/${deckId}/cards/new`} 
    className="btn btn-primary mr-2">
        <i className="fas fa-plus"></i> Add Cards
    </Link>
    <button
        type="button"
        className="btn btn-danger ml-5"
        onClick={() => handleDeleteDeck(deck)}
    >
        <i className="fas fa-trash"></i>
    </button>

    {/* Cards Listing */}
    <h2 className="mt-4">Cards</h2>
    {deck.cards.map(card => (
        <div className="card col-sm-6 mb-3 mb-sm-0" key={card.id}>
            <div className="Card">
                <div className="card-body" key={card.id}>
                    <p className="card-text"><strong>Question:</strong> {card.front}</p>
                    <p className="card-text"><strong>Answer:</strong> {card.back}</p>
                    <div className="d-flex justify-content-end">
                        <Link 
                        to={`/decks/${deckId}/cards/${card.id}/edit`} 
                        className="btn btn-secondary mr-2">
                            <i className="fas fa-edit"></i> Edit
                        </Link>
                        <button 
                        onClick={() => handleDeleteCard(card.id)} 
                        className="btn btn-danger">
                            <i className="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    ))}
</div>
);
}

export default Deck;
