"use client"

import { create } from 'zustand';

import io, { Socket } from 'socket.io-client';

const SERVER_ADDRESS = process.env.NEXT_PUBLIC_SERVER_ADDRESS

interface RoomState {
    roomName: string;
    socket: Socket | null;
    remoteGuests: Guest[];
    deck: Deck
    localGuest: Guest
    currentRound: GameRound;
    previousRounds: GameRound[];
    roomId: string | null;
    isRevealed: boolean;
    secretId: string;
}

interface RoomStore extends RoomState {
    // Setter actions
    addRemoteGuest: (guest: Guest) => void;
    removeRemoteGuest: (guestId: string) => void;
    setCurrentRoundVote: (vote: Vote) => void;

    // Getters
    getRoomsFromLocalStorage: () => { secretId: string, roomId: string, timeStamp: number }[] | null;
    getSecretIdFromLocalStorage: (roomId: string) => string | null;
    getAllGuests: () => Guest[];
    getVotingGuests: () => Guest[];
    getVotesState: () => VotesState;
    getLocalGuestVoteValue: () => VoteValue;
    getIsReadyToReveal: () => boolean;
    getPreviousRoundsResults: () => GameRoundResult[];

    // Event handlers
    handleGuestJoined: (guest: Guest) => void;
    handleGuestLeft: (guestId: string) => void;
    handleGuestVoted: (vote: Vote) => void;
    handleCardsRevealed: () => void;
    handleNewRoundStarted: () => void;
    handleGuestDisconnected: (guestId: string) => void;
    subscribeToEvents: (socket: Socket) => void;

    // Complex actions
    saveIdToLocalStorage: (secretId: string) => void;
    create: (payload: CreateRoomProps) => Promise<string>;
    join: (payload: JoinRoomProps) => void;
    leaveRoom: () => void;
    vote: (value: number | null) => void;
    revealCards: () => void;
    startNewRound: () => void;
}

const INITIAL_STATE: RoomState = {
    secretId: '',
    roomName: 'room name',
    socket: null,
    remoteGuests: [],
    deck: { name: '', cards: [] },
    localGuest: { name: "Guest", isConnected: true, id: 'local', isInRound: false },
    currentRound: [],
    previousRounds: [],
    roomId: null,
    isRevealed: false
};

export const useRoomStore = create<RoomStore>()((set, get) => ({
    ...INITIAL_STATE,

    // Setter actions
    addRemoteGuest: (guest) => set((state) => ({
        remoteGuests: [...state.remoteGuests, guest]
    })),
    removeRemoteGuest: (guestId) => set((state) => ({
        remoteGuests: state.remoteGuests.filter(guest => guest.id !== guestId)
    })),
    setCurrentRoundVote: (vote) => set((state) => {
        const currentRound = state.currentRound.filter(v => v.guestId !== vote.guestId);
        currentRound.push(vote);
        return { currentRound };
    }),

    // Event handlers
    handleGuestJoined: (guest: Guest) => {
        get().addRemoteGuest(guest);
    },

    handleGuestLeft: (guestId: string) => {
        get().removeRemoteGuest(guestId);
    },

    handleGuestVoted: (vote: Vote) => {
        get().setCurrentRoundVote(vote);
    },

    handleCardsRevealed: () => {
        set({ isRevealed: true });
    },
    handleNewRoundStarted: () => {
        get().startNewRound();
    },
    handleGuestDisconnected: (guestId: string) => {
        const guest = get().remoteGuests.find(guest => guest.id === guestId)
        if (guest) {
            guest.isConnected = false;
            const filteredGuests = get().remoteGuests.filter(guest => guest.id !== guestId);
            set({ remoteGuests: [...filteredGuests, guest] })
        }
    },

    subscribeToEvents: (socket: Socket) => {
        socket.on('guest_joined', get().handleGuestJoined);
        socket.on('guest_left', get().handleGuestLeft);
        socket.on('guest_voted', get().handleGuestVoted);
        socket.on('cards_revealed', get().handleCardsRevealed);
        socket.on('new_round_started', get().handleNewRoundStarted);
        socket.on('guest_disconnected', get().handleGuestDisconnected)
    },

    // Complex actions
    create: (payload: CreateRoomProps) => {
        return new Promise((resolve, reject) => {
            const socket = io(SERVER_ADDRESS, { timeout: 5000 });
            const state = get();
            set({
                socket,
                deck: payload.deck,
                roomName: payload.roomName,
                localGuest: { ...state.localGuest, name: payload.guestName, isInRound: true }
            });

            if (!state.socket) {
                socket.on('connect', () => {
                });
            }

            socket.emit('create_room', payload, (response: string) => {
                set({ roomId: response });
                resolve(response);
            });

            socket.on('connect_error', (error) => {
                reject(error);
            });

            get().subscribeToEvents(socket);
        });
    },

    join: (payload: JoinRoomProps): Promise<void> => {
        return new Promise((resolve, reject) => {
            const socket = io(SERVER_ADDRESS);
            const state = get();
            set({ socket });

            socket.on('connect_error', (error) => {
                reject(new Error(`Connection failed: ${error.message}`));
            });

            socket.on('connect', () => {
            });
            const secretId = state.getSecretIdFromLocalStorage(payload.roomId);
            socket.emit('join_room', { ...payload, secretId }, (response: JoinRoomResponse) => {
                if (response.error) {
                    reject(new Error(`Join room failed: ${response.error}`));
                    return;
                }
                set({
                    isRevealed: response.isReaveled,
                    roomName: response.roomName,
                    deck: response.deck,
                    remoteGuests: response.guests,
                    currentRound: response.currentRound,
                    roomId: payload.roomId,
                    localGuest: { ...state.localGuest, name: payload.guestName, isInRound: !response.isReaveled }
                });
                get().subscribeToEvents(socket);
                resolve();
            });
        });
    },

    leaveRoom: () => {
        const state = get();
        if (state.socket) {
            state.socket.disconnect();
        }
        set(INITIAL_STATE);
    },

    vote: (payload: VoteValue) => {
        const state = get();
        const localGuestId = state.localGuest.id;

        set((state) => ({
            currentRound: [
                ...state.currentRound.filter(vote => vote.guestId !== localGuestId),
                { voteValue: payload, guestId: localGuestId }
            ]
        }));

        state.socket?.emit('vote', payload);
    },

    revealCards: () => {
        return new Promise<void>((resolve, reject) => {
            const state = get();
            state.socket?.emit('reveal_cards', {}, (response: { error: string }) => {
                if (response.error) {
                    reject(new Error(`Reveal cards failed: ${response.error}`));
                    return;
                }
                set({ isRevealed: true });
                resolve();
            });
        });
    },

    startNewRound: () => {
        return new Promise<void>((resolve, reject) => {
            get().socket?.emit('start_new_round', {}, (response: { error: string }) => {
                if (response.error) {
                    return reject(new Error(`Start new round failed: ${response.error}`));
                }
                set({
                    currentRound: [],
                    isRevealed: false,
                    previousRounds: [...get().previousRounds, get().currentRound],
                    localGuest: { ...get().localGuest, isInRound: true },
                    remoteGuests: get().remoteGuests.map(guest => ({ ...guest, isInRound: true }))
                });
                resolve();
            });
        });
    },

    saveIdToLocalStorage: (secretId) => {
        const state = get();
        const stringifiedData = JSON.stringify({
            secretId,
            roomId: state.roomId,
            timeStamp: Date.now()
        });
        localStorage.setItem('rooms', stringifiedData);
    },

    getRoomsFromLocalStorage: () => {
        const rooms = localStorage.getItem('rooms');
        if (!rooms) {
            return [];
        }
        return JSON.parse(rooms) as LocalStorageRoom[];
    },

    getSecretIdFromLocalStorage: (roomId) => {
        const state = get();
        const rooms = state.getRoomsFromLocalStorage();
        const timeLimit = Date.now() - 1000 * 60 * 60 * 1;
        const filteredRooms = rooms?.filter(room => room.timeStamp > timeLimit);
        localStorage.setItem('rooms', JSON.stringify(filteredRooms));
        const roomData = filteredRooms?.find(room => room.roomId === roomId);
        return roomData?.secretId ?? null;
    },

    getAllGuests: () => {
        const state = get();
        return [state.localGuest, ...state.remoteGuests];
    },

    getLocalGuestVoteValue: () => {
        const state = get();
        const localGuestId = state.localGuest.id;
        const localGuestVote = state.currentRound.find(vote => vote.guestId === localGuestId);
        return localGuestVote?.voteValue ?? null;
    },

    getVotingGuests: () => {
        const allGuests = get().getAllGuests();
        return allGuests.filter(guest => guest.isInRound && guest.isConnected);
    },

    getVotesState: () => {
        const state = get();
        return state.getVotingGuests().map(guest => {
            const vote = state.currentRound.find(vote => vote.guestId === guest.id);
            return {
                guest,
                value: vote?.voteValue ?? null
            };
        });
    },

    getIsReadyToReveal: () => {
        const state = get();
        return state.getVotingGuests().length === state.currentRound.filter(vote => vote.voteValue !== null).length;
    },

    getPreviousRoundsResults: () => {
        const state = get();
        return state.previousRounds.map(round => {
            const totalVotesValue = round.reduce((acc, vote) => { return acc + (vote.voteValue ?? 0) }, 0);
            return {
                result: totalVotesValue / round.length
            };
        })
    }

}));