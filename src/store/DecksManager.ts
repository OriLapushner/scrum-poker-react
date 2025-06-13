'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { getDefaultDecks } from '@/services/defaultDecks'



interface DecksManagerState {
	cards: Card[];
	deckName: string;
	userDecks: Deck[];
	selectedDeckIdx: number | null,
	defaultDecks: Deck[],
	cardsInput: string
}

interface DecksManagerStore extends DecksManagerState {
	deleteCard: (index: number) => void
	addUserDeck: (deck: Deck) => void
	deleteDeck: (index: number) => void
	createDeck: (deck: Deck) => void
	editDeck: () => void
	setSelectedDeck: (index: number | null) => void
	resetDeckCreation: () => void
	setDeckName: (name: string) => void
	setCardsInput: (input: string) => void
	getAllDecks: () => Deck[]
}

const INITIAL_STATE: DecksManagerState = {
	cards: [],
	deckName: '',
	cardsInput: '',
	defaultDecks: getDefaultDecks(),
	userDecks: [],
	selectedDeckIdx: 0,
}

export const useDecksManagerStore = create<DecksManagerStore>()(
	persist(
		(set, get) => ({
			...INITIAL_STATE,

			deleteCard: (index) =>
				set((state) => {
					const newCards = state.cards.filter((_, idx) => idx !== index)
					const newCardsInput = newCards.map(card => card.displayName).join(',')
					return {
						cards: newCards,
						cardsInput: newCardsInput
					}
				}),

			addUserDeck: (deck) =>
				set((state) => ({ userDecks: [...state.userDecks, deck] })),

			deleteDeck: (index) => {
				const state = get()
				const newDecks = state.userDecks.filter((_, idx) => idx !== index)
				set({ userDecks: newDecks })
			},

			setDeckName: (name) => set({ deckName: name }),

			setCardsInput: (input) => {
				const cards = input
					.split(',')
					.map(str => str.trim())
					.filter(str => str !== '')
					.map(str => {
						const num = Number(str)
						return isNaN(num) ? null : { displayName: str, value: num }
					})
					.filter((card): card is Card => card !== null)
				set({ cardsInput: input, cards })
			},

			createDeck: (deck) => {
				const state = get()
				set({ userDecks: [...state.userDecks, deck] })
			},

			editDeck: () => {
				const state = get()
				if (state.selectedDeckIdx === null) throw new Error('No deck selected')
				const newDecks = [...state.userDecks]
				newDecks[state.selectedDeckIdx] = { cards: state.cards, name: state.deckName }
				set({ userDecks: newDecks })
			},

			resetDeckCreation: () => set({ cards: [], cardsInput: '' }),

			setSelectedDeck: (index) => {
				const state = get()
				//null set decks to creation mode
				if (index === null) return set({ selectedDeckIdx: null, cards: [], cardsInput: '' })
				const selectedDeck = state.userDecks[index]
				const cards = selectedDeck?.cards || []
				const cardsInput = cards.map(card => card.displayName).join(',')
				set({
					selectedDeckIdx: index,
					cards,
					cardsInput
				})
			},

			getAllDecks: () => {
				const state = get()
				return [...state.defaultDecks, ...state.userDecks]
			}
		}),
		{
			name: 'decks-manager-storage',
			partialize: (state) => ({ userDecks: state.userDecks })
		}
	)
)