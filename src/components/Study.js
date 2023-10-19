import React, { useState, useEffect } from "react";
import { Link, useParams, useHistory } from "react-router-dom";
import { readDeck } from "../utils/api";

function Study() {
    const { deckId } = useParams();
    const history = useHistory();

    const [deck, setDeck] = useState(null);
    const [currentCard, setCurrentCard] = useState(0);
    const [flip, setFlip] = useState(false);

    useEffect(() => {
        // Initialize an AbortController to control fetch requests. 
        const abortController = new AbortController();
        
        async function loadStudyDeck() {
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
        loadStudyDeck();

        return () => {
            abortController.abort();
        };
    }, [deckId]);

    if (!deck) {
        return (
            <div>
                <h1>EMPTY SET</h1>
            </div>
        )
    }

    const handleFlip = () => {
        setFlip(!flip);
    };

    const handleNext = () => {
        if (currentCard + 1 === deck.cards.length) {
            const restart = window.confirm('Restart code?\n\nClick \'Cancel\' to return to the home page.');
            
            if (restart) {
                setCurrentCard(0);
                setFlip(false);
            } else {
                history.push('/');
            }
        } else {
            setCurrentCard(currentCard + 1);
            setFlip(false);
        }
    };

    return (
        <div>
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                    <li className="breadcrumb-item"><Link to={`/decks/${deckId}`}>{deck.name}</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">Study</li>
                </ol>
            </nav>
            <div>
            <h1>{`Study: ${deck.name}`}</h1>
                <div> 
                    {deck.cards.length <= 2 ? (
                        <div className="">
                            {/* Render content for decks with 2 or fewer cards */}
                            <h2>Not enough cards</h2>
                            <p>You need at least 3 cards to study. There are only {deck.cards.length} in this deck.</p>
                            <Link to={`/decks/${deck.id}/cards/new`}>
                                <button type="button" className="btn btn-primary mr-2"> 
                                    <i className="fas fa-plus"></i> Add Cards 
                                </button>
                            </Link>
                        </div>
                    ) : (
                        < div
                            className="card col-sm-6 mb-3 mb-sm-0"
                        >
                            <div className="Card">
                                <div className="card-body">
                                    {/* Render content for decks with more than 2 cards */}
                                    <h5 className="card-title">
                                        Card {currentCard + 1} of {deck.cards.length}
                                    </h5>
                                    <div className="card-text mb-2">
                                        {flip ? deck.cards[currentCard].back : deck.cards[currentCard].front}
                                    </div>
                                    <button
                                        type="button"
                                        className="btn btn-secondary mr-2 mt-2"
                                        onClick={handleFlip}>Flip
                                    </button>
                                    {
                                    flip && 
                                    <button 
                                        type="button" 
                                        className="btn btn-primary mr-2 mt-2" 
                                        onClick={handleNext}>Next
                                    </button>}
                                </div>                    
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Study;