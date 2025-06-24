const getVotesStateFromRound = (round: GameRound, guests: Guest[], deck: Deck) => {
	return round.map(vote => {
		const guest = guests.find(g => g.id === vote.guestId)!
		const card = deck.cards[vote.voteValue ?? 0];
		return {
			guest,
			cardValue: vote?.voteValue === null ? null : card.value,
			displayName: card.displayName
		};
	});
}

const getResultFromRound = (round: GameRound, deck: Deck) => {
	const totalVotesValue = round.reduce((acc, vote) => {
		let result = 0;
		if (vote.voteValue !== null) {
			result = deck.cards[vote.voteValue].value;
		}
		return acc + result
	}, 0);
	return { result: totalVotesValue / round.length };
}

const getRoundsResults = (rounds: GameRound[], deck: Deck) => {
	return rounds.map(round => getResultFromRound(round, deck));
}

const getIsRevealDisabled = (currentRound: GameRound) => {
	return !currentRound.some(vote => vote.voteValue === null) && currentRound.length > 0;
}

const getGuestVoteValue = (guest: Guest, round: GameRound) => {
	const vote = round.find(vote => vote.guestId === guest.id);
	return vote?.voteValue ?? null;
}

const getGroupedVotes = (gameRound: GameRound, deck: Deck, guests: Guest[]) => {
	const groupedVotes = gameRound.reduce<Record<number, { card: Card, guests: Guest[] }>>((acc, vote) => {
		const voteValue = vote.voteValue ?? 0;
		if (acc[voteValue]) {
			acc[voteValue].guests.push(guests.find(guest => guest.id === vote.guestId)!);
		} else {
			acc[voteValue] = {
				card: deck.cards[voteValue],
				guests: [guests.find(guest => guest.id === vote.guestId)!]
			};
		}
		return acc;
	}, {});

	return Object.values(groupedVotes);
}

const getDisplayedVotes = (
	historySelectedRoundIndex: number | null,
	currentRound: GameRound,
	previousRounds: GameRound[],
	guests: Guest[],
	deck: Deck
) => {
	if (historySelectedRoundIndex === null) {
		return getVotesStateFromRound(currentRound, guests, deck);
	}
	return getVotesStateFromRound(previousRounds[historySelectedRoundIndex], guests, deck);
};

const getIsDeckDisabled = (isRevealed: boolean, localGuest: Guest) => {
	return isRevealed || !localGuest.isInRound || localGuest.isSpectator;
}

export {
	getVotesStateFromRound,
	getResultFromRound,
	getRoundsResults,
	getIsRevealDisabled,
	getGuestVoteValue,
	getGroupedVotes,
	getDisplayedVotes,
	getIsDeckDisabled
};
