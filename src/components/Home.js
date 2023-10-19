import React, { useState, useEffect } from "react";
import { listDecks, deleteDeck } from "../utils/api/index";
import { Link } from "react-router-dom";

function Home() {
    const [decks, setDecks] = useState([]);

    useEffect(() => {
        // Initialize an AbortController to control fetch requests. 
        const abortController = new AbortController();
        
        async function loadDecks() {
            try {
                // Fetch the list of decks.
                const response = await listDecks(abortController.signal);
                
                // Set the fetched decks to state.
                setDecks(response);
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
    }, []);

    async function handleDelete(deck) {
        // Ask the user for confirmation before deleting the deck
        if (window.confirm('Delete this deck?\n\nYou will not be able to recover it')) {    
            // Delete the deck and return the result
            await deleteDeck(deck.id);

            // After successful deletion, update the state to reflect the changes.
            const updatedDecks = decks.filter(d => d.id !== deck.id);
            setDecks(updatedDecks);
        }
    }

    return (
        <div className="container">
            <Link to="/decks/new">
                <button type="button" className="btn btn-primary"> 
                    <i className="fas fa-plus"></i> Create Deck 
                </button>
            </Link>
            <div className="row p-3">
                {decks.map((deck) => {
                    return (
                        <div
                            className="card col-sm-6 mb-3"
                            key={deck.id}
                        >
                            <div className="Card">
                                <div className="card-body">
                                    <h5 className="card-title">{deck.name}</h5>
                                    <h6 className="card-subtitle mb-2 text-muted">
                                        {`${deck.cards.length} cards`}
                                    </h6>
                                    <p className="card-text"> {deck.description}</p>
                                    <Link to={`/decks/${deck.id}`}>
                                    <button type="button" className="btn btn-secondary mr-2"> 
                                        <i className="fas fa-eye"></i> View 
                                    </button>
                                    </Link>
                                    <Link to={`/decks/${deck.id}/study`}>
                                    <button type="button" className="btn btn-primary mr-2"> 
                                        <i className="fas fa-book"></i> Study 
                                    </button>
                                    </Link>
                                    <button
                                        type="button"
                                        className="btn btn-danger ml-5"
                                        onClick={() => handleDelete(deck)}
                                    >
                                        <i className="fas fa-trash"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default Home;