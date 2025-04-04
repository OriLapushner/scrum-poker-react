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

const getIsReadyToReveal = (currentRound: GameRound) => {
	return !currentRound.some(vote => vote.voteValue === null);
}

const getGuestVoteValue = (guest: Guest, round: GameRound) => {
	const vote = round.find(vote => vote.guestId === guest.id);
	return vote?.voteValue ?? null;
}

export { getVotesStateFromRound, getResultFromRound, getRoundsResults, getIsReadyToReveal, getGuestVoteValue };
