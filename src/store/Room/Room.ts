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
}

interface RoomStore extends RoomState {
    // Setter actions
    removeRemoteGuest: (guestId: string) => void;
    setCurrentRoundVote: (vote: Vote) => void;
    setNewRoundState: () => void;

    // Event handlers
    handleGuestJoined: (guest: Guest) => void;
    handleGuestLeft: (guestId: string) => void;
    handleGuestVoted: (vote: Vote) => void;
    handleCardsRevealed: () => void;
    handleNewRoundStarted: () => void;
    handleGuestDisconnected: (guestId: string) => void;
    subscribeToEvents: (socket: Socket) => void;

    // Complex actions
    create: (payload: CreateRoomProps) => Promise<string>;
    join: (payload: JoinRoomProps) => Promise<void>
    rejoinRoom: (payload: RejoinRoomProps) => Promise<void>;
    leaveRoom: () => void;
    vote: (value: number | null) => void;
    revealCards: () => void;
    startNewRound: () => void;
}

const INITIAL_STATE: RoomState = {
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

export const useRoomStore = create<RoomStore>()(
    (set, get) => ({
        ...INITIAL_STATE,
        // Setter actions
        removeRemoteGuest: (guestId) => set((state) => ({
            remoteGuests: state.remoteGuests.filter(guest => guest.id !== guestId)
        })),

        setCurrentRoundVote: (vote) => set((state) => {
            const currentRound = state.currentRound.filter(v => v.guestId !== vote.guestId);
            currentRound.push(vote);
            return { currentRound };
        }),

        setNewRoundState: () => {
            const state = get();
            const updatedRemoteGuests = state.remoteGuests.map(guest => ({ ...guest, isInRound: true }))
            const updatedLocalGuest = { ...state.localGuest, isInRound: true }
            const filteredRemoteGuests = updatedRemoteGuests.filter(guest => guest.isConnected)
            const currentRound = [...filteredRemoteGuests, updatedLocalGuest].map(guest => ({ guestId: guest.id, voteValue: null }))
            set({
                currentRound,
                isRevealed: false,
                previousRounds: [...state.previousRounds, state.currentRound],
                localGuest: updatedLocalGuest,
                remoteGuests: updatedRemoteGuests
            });
        },

        // Event handlers
        handleGuestJoined: (guest: Guest) => {
            const state = get();
            const objToSet: Partial<RoomState> = { remoteGuests: [...state.remoteGuests, guest] };
            if (guest.isInRound) {
                objToSet.currentRound = [...state.currentRound, { guestId: guest.id, voteValue: null }];
            }
            set(objToSet);
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
            get().setNewRoundState();
        },

        handleGuestDisconnected: (guestId: string) => {
            const guest = get().remoteGuests.find(guest => guest.id === guestId)
            if (guest) {
                guest.isConnected = false;
                guest.isInRound = false;
                const filteredGuests = get().remoteGuests.filter(guest => guest.id !== guestId);
                const updatedCurrentRound = get().currentRound.filter(vote => vote.guestId !== guestId);
                set({ remoteGuests: [...filteredGuests, guest], currentRound: updatedCurrentRound })
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
                const state = get()
                set({ ...INITIAL_STATE, socket });

                socket.emit('create_room', payload, (response: CreateRoomResponse) => {
                    if ("error" in response) {
                        reject(new Error(`Create room failed: ${response.error}`));
                        return;
                    }
                    set({
                        roomId: response.roomId,
                        deck: payload.deck,
                        roomName: payload.roomName,
                        // secretId: response.secretId,
                        localGuest: { ...state.localGuest, id: response.localGuestId, isInRound: true, name: payload.guestName },
                        currentRound: [{ guestId: response.localGuestId, voteValue: null }]
                    });

                    resolve(response.roomId);
                });

                socket.on('connect_error', (error) => {
                    reject(error);
                });

                get().subscribeToEvents(socket);
            });
        },

        join: (payload: JoinRoomProps) => {
            return new Promise((resolve, reject) => {
                const socket = io(SERVER_ADDRESS);
                const state = get();
                set({ socket });

                socket.on('connect_error', (error) => {
                    reject(new Error(`Connection failed: ${error.message}`));
                });

                socket.emit('join_room', { ...payload }, (response: JoinRoomResponse) => {
                    if ("error" in response) {
                        reject(new Error(`Join room failed: ${response.error}`));
                        return;
                    }
                    console.log('response', response);
                    set({
                        isRevealed: response.isReaveled,
                        roomName: response.roomName,
                        deck: response.deck,
                        remoteGuests: response.guests,
                        currentRound: response.currentRound,
                        roomId: payload.roomId,
                        localGuest: {
                            ...state.localGuest,
                            name: payload.guestName,
                            isInRound: !response.isReaveled,
                            id: response.localGuestId
                        },
                        previousRounds: response.previousRounds
                    });

                    get().subscribeToEvents(socket);
                    resolve();
                });
            });
        },

        rejoinRoom: (payload: RejoinRoomProps) => {
            return new Promise((resolve, reject) => {
                const state = get();
                const socket = io(SERVER_ADDRESS);
                set({ socket });
                socket.on('connect_error', (error) => {
                    reject(new Error(`Connection failed: ${error.message}`));
                });

                socket.emit('rejoin_room', payload, (response: RejoinRoomResponse) => {
                    if ("error" in response) {
                        reject(new Error(`Rejoin room failed: ${response.error}`));
                        return;
                    }

                    set({
                        isRevealed: response.isReaveled,
                        roomName: response.roomName,
                        deck: response.deck,
                        remoteGuests: response.guests,
                        currentRound: response.currentRound,
                        roomId: payload.roomId,
                        localGuest: { ...state.localGuest, name: response.localGuestName, isInRound: !response.isReaveled }
                    });

                    state.subscribeToEvents(socket);
                    resolve();
                });
            })
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
                const state = get();
                state.socket?.emit('start_new_round', {}, (response: { error: string }) => {
                    if (response.error) {
                        return reject(new Error(`Start new round failed: ${response.error}`));
                    }
                    state.setNewRoundState();
                    resolve();
                });
            });
        },
    }),
);