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
	cardDisplayName: string,
	cardValue: string
}

interface DecksManagerStore extends DecksManagerState {
	addCard: (card: Card) => void
	deleteCard: (index: number) => void
	addUserDeck: (deck: Deck) => void
	deleteDeck: (index: number) => void
	createDeck: (deck: Deck) => void
	editDeck: () => void
	setSelectedDeck: (index: number | null) => void
	resetDeckCreation: () => void
	setDeckName: (name: string) => void
	setCardValue: (value: string) => void
	setCardDisplayName: (name: string) => void
	getAllDecks: () => Deck[]
}

const INITIAL_STATE: DecksManagerState = {
	cards: [],
	deckName: '',
	cardDisplayName: '',
	cardValue: '',
	defaultDecks: getDefaultDecks(),
	userDecks: [],
	selectedDeckIdx: 0,
}

export const useDecksManagerStore = create<DecksManagerStore>()(
	persist(
		(set, get) => ({
			...INITIAL_STATE,

			addCard: (card) =>
				set((state) => ({ cards: [...state.cards, card] })),

			deleteCard: (index) =>
				set((state) => ({
					cards: state.cards.filter((_, idx) => idx !== index)
				})),

			addUserDeck: (deck) =>
				set((state) => ({ userDecks: [...state.userDecks, deck] })),

			deleteDeck: (index) => {
				const state = get()
				const newDecks = state.userDecks.filter((_, idx) => idx !== index)
				set({ userDecks: newDecks })
			},

			setDeckName: (name) => set({ deckName: name }),

			setCardValue: (value) => set({ cardValue: value }),

			setCardDisplayName: (name) => set({ cardDisplayName: name }),

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

			resetDeckCreation: () => set({ cards: [] }),

			setSelectedDeck: (index) => {
				const state = get()
				//null set decks to creation mode
				if (index === null) return set({ selectedDeckIdx: null, cards: [] })
				set({
					selectedDeckIdx: index,
					cards: state.userDecks[index]?.cards || []
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