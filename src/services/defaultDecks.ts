const getFibnacciDeck = (): Deck => {
    const fibonacciCards: Card[] = [0, 1, 2, 3, 5, 8, 13].map(num => ({ displayName: String(num), value: num }))
    return { name: "Fibonacci", cards: fibonacciCards }
}

const getPowersOf2Deck = (): Deck => {
    const powerOf2Cards: Card[] = [1, 2, 4, 8, 16, 32].map(num => ({ displayName: String(num), value: num }))
    return { name: "Powers of 2", cards: powerOf2Cards }
}

const getNaturalNumbersDeck = (): Deck => {
    const naturalNumbersCards: Card[] = [1, 2, 3, 4, 5, 6].map(num => ({ displayName: String(num), value: num }))
    return { name: "Natural Numbers", cards: naturalNumbersCards }
}

const getDefaultDecks = (): Deck[] => {
    return [getFibnacciDeck(), getPowersOf2Deck(), getNaturalNumbersDeck()]
}

export {
    getFibnacciDeck,
    getNaturalNumbersDeck,
    getPowersOf2Deck,
    getDefaultDecks
}