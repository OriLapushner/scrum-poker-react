export { };
declare global {

    type Card = {
        displayName: string;
        value: number;
    }

    type Deck = {
        name: string,
        cards: Card[]
    }

    type Guest = {
        name: string,
        id: string,
        isConnected: boolean
        isInRound: boolean
    }

    type JoinRoomResponse = {
        isReaveled: boolean,
        roomName: string,
        deck: Deck,
        guests: Guests[],
        error?: string,
        localGuestId: string,
        currentRound: GameRound
    }

    type CreateRoomProps = {
        deck: Deck,
        guestName: string,
        roomName: string
    }

    type JoinRoomProps = {
        guestName: string,
        roomId: string
    }

    type VoteValue = number | null

    type Vote = {
        guestId: string,
        voteValue: VoteValue
    }

    type GameRound = Vote[]

    type VoteEntry = {
        guest: Guest,
        value: VoteValue
    }

    type GameRoundResult = {
        result: number,
    }

    type VotesState = VoteEntry[];

    type LocalStorageRoom = {
        secretId: string,
        roomId: string,
        timeStamp: number
    }

}