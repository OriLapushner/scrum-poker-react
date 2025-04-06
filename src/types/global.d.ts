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

    type ErrorResponse = {
        error: string
    }

    type CreateRoomResponse = {
        roomId: string,
        secretId: string,
        localGuestId: string
    } | ErrorResponse

    type JoinRoomResponse = {
        isReaveled: boolean,
        roomName: string,
        deck: Deck,
        guests: Guests[],
        localGuestId: string,
        currentRound: GameRound,
        previousRounds: GameRound[],
        localGuestId: string,
        secretId: string
    } | ErrorResponse

    type RejoinRoomResponse = (Omit<Exclude<JoinRoomResponse, ErrorResponse>, 'secretId'> & {
        localGuest: Guest
    }) | ErrorResponse

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
        cardValue: number | null
        displayName: string
    }

    type GameRoundResult = {
        result: number,
    }

    type VotesState = VoteEntry[];

    type LocalStorageRooms = { [key: string]: { secretId: string; timeStamp: number } }

}