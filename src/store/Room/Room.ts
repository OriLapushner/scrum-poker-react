"use client"

import { create } from 'zustand';
import { useLocalStorageRoomsStore } from '@/store/localStorageRooms';

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
    isVoteResultsOpen: boolean;
    historySelectedRoundIndex: number | null;
}

interface RoomStore extends RoomState {
    // Setter actions
    removeRemoteGuest: (guestId: string) => void;
    setCurrentRoundVote: (vote: Vote) => void;
    setNewRoundState: () => void;
    setIsVoteResultsOpen: (isOpen: boolean) => void;
    setHistorySelectedRoundIndex: (index: number | null) => void;

    // Event handlers
    handleGuestJoined: (guest: Guest) => void;
    handleGuestLeft: (guestId: string) => void;
    handleGuestVoted: (vote: Vote) => void;
    handleCardsRevealed: () => void;
    handleNewRoundStarted: () => void;
    handleGuestDisconnected: (guestId: string) => void;
    handleGuestChanged: (guest: Partial<Guest> & Pick<Guest, 'id'>) => void;
    handleGuestReconnected: (guestId: string) => void;
    subscribeToEvents: (socket: Socket) => void;

    // Complex actions
    create: (payload: CreateRoomProps) => Promise<string>;
    join: (payload: JoinRoomProps) => Promise<void>
    rejoinRoom: (roomId: string) => Promise<void>;
    leaveRoom: () => void;
    vote: (value: number | null) => void;
    revealCards: () => void;
    startNewRound: () => void;
    setLocalGuestAsSpectator: (value: boolean) => Promise<void>;
    changeLocalGuestName: (name: string) => Promise<void>;
}

const INITIAL_STATE: RoomState = {
    roomName: 'room name',
    socket: null,
    remoteGuests: [],
    deck: { name: '', cards: [] },
    localGuest: { name: "Guest", isConnected: true, id: 'local', isInRound: false, isSpectator: false },
    currentRound: [],
    previousRounds: [],
    roomId: null,
    isRevealed: false,
    isVoteResultsOpen: false,
    historySelectedRoundIndex: null
};

export const useRoomStore = create<RoomStore>()(
    (set, get) => ({
        ...INITIAL_STATE,
        // Setter actions
        removeRemoteGuest: (guestId) => set((state) => ({
            remoteGuests: state.remoteGuests.filter(guest => guest.id !== guestId)
        })),

        setCurrentRoundVote: (vote: Vote) => {
            const state = get();
            const currentRound = state.currentRound.filter(stateVote => stateVote.guestId !== vote.guestId);
            currentRound.push(vote);
            set({ currentRound });
        },

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

        setIsVoteResultsOpen: (isOpen: boolean) => set({ isVoteResultsOpen: isOpen }),

        setHistorySelectedRoundIndex: (index: number | null) => set({ historySelectedRoundIndex: index }),

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
        handleGuestChanged: (guestUpdate: Partial<Guest> & Pick<Guest, 'id'>) => {
            const state = get();
            const updatedGuests = state.remoteGuests.map(remoteGuest =>
                remoteGuest.id === guestUpdate.id ? { ...remoteGuest, ...guestUpdate } : remoteGuest
            );
            if (guestUpdate.isSpectator) {
                const updatedCurrentRound = state.currentRound.filter(vote => vote.guestId !== guestUpdate.id);
                set({ currentRound: updatedCurrentRound })
            }
            if (guestUpdate.isSpectator === false) {
                const updatedCurrentRound = [...state.currentRound, { guestId: guestUpdate.id, voteValue: null }]
                set({ currentRound: updatedCurrentRound })
            }
            set({ remoteGuests: updatedGuests });
        },
        handleGuestReconnected: (guestId: string) => {
            const state = get();
            const guest = state.remoteGuests.find(guest => guest.id === guestId)
            if (!guest) return;
            guest.isConnected = true;
            guest.isInRound = !state.isRevealed;
            if (!state.isRevealed) {
                guest.isSpectator = true;
            }
            const updatedCurrentRound = state.currentRound.filter(vote => vote.guestId !== guestId);
            if (!state.isRevealed) {
                updatedCurrentRound.push({ guestId, voteValue: null });
            }
            const remoteFilteredGuests = state.remoteGuests.filter(guest => guest.id !== guestId);
            set({ remoteGuests: [...remoteFilteredGuests, guest], currentRound: updatedCurrentRound });

        },

        subscribeToEvents: (socket: Socket) => {
            const state = get();
            socket.on('guest_joined', state.handleGuestJoined);
            socket.on('guest_left', state.handleGuestLeft);
            socket.on('guest_voted', state.handleGuestVoted);
            socket.on('cards_revealed', state.handleCardsRevealed);
            socket.on('new_round_started', state.handleNewRoundStarted);
            socket.on('guest_disconnected', state.handleGuestDisconnected)
            socket.on('guest_changed', state.handleGuestChanged)
            socket.on('guest_reconnected', state.handleGuestReconnected)
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
                    const localStorageRoomsState = useLocalStorageRoomsStore.getState()
                    localStorageRoomsState.addRoom(response.roomId, response.secretId);

                    set({
                        roomId: response.roomId,
                        deck: payload.deck,
                        roomName: payload.roomName,
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
                    const localStorageRoomsState = useLocalStorageRoomsStore.getState()
                    localStorageRoomsState.addRoom(payload.roomId, response.secretId);
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

                    state.subscribeToEvents(socket);
                    resolve();
                });
            });
        },

        rejoinRoom: (roomId: string) => {
            return new Promise((resolve, reject) => {
                const state = get();
                const socket = io(SERVER_ADDRESS);
                set({ socket });
                socket.on('connect_error', (error) => {
                    reject(new Error(`Connection failed: ${error.message}`));
                });
                const rooms = useLocalStorageRoomsStore.getState().rooms
                const roomToJoin = rooms[roomId]

                socket.emit('rejoin_room', { roomId, secretId: roomToJoin?.secretId }, (response: RejoinRoomResponse) => {
                    if ("error" in response) {
                        reject(new Error(`Rejoin room failed: ${response.error}`));
                        return;
                    }
                    set({
                        roomId,
                        isRevealed: response.isReaveled,
                        roomName: response.roomName,
                        deck: response.deck,
                        remoteGuests: response.guests,
                        currentRound: response.currentRound,
                        localGuest: response.localGuest,
                        previousRounds: response.previousRounds
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
            return new Promise<void>((resolve, reject) => {
                const state = get();
                const localGuestId = state.localGuest.id;
                state.socket?.emit('vote', payload, (response: { error: string }) => {
                    if (response.error) return reject(new Error(`Vote failed: ${response.error}`));
                    state.setCurrentRoundVote({ voteValue: payload, guestId: localGuestId });
                    resolve();
                });
            });
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
        setLocalGuestAsSpectator: (value: boolean) => {
            return new Promise<void>((resolve, reject) => {
                const state = get();
                state.socket?.emit('set_guest_spectator_status', value, (response: { error: string }) => {
                    if (response.error) {
                        return reject(new Error(`Set local guest as spectator failed: ${response.error}`));
                    }
                    const updatedLocalGuest = { ...state.localGuest, isSpectator: value }
                    if (value) {
                        const updatedCurrentRound = state.currentRound.filter(vote => vote.guestId !== state.localGuest.id);
                        set({ currentRound: updatedCurrentRound, localGuest: updatedLocalGuest })
                    }
                    else {
                        const updatedCurrentRound = [...state.currentRound, { guestId: state.localGuest.id, voteValue: null }]
                        set({ currentRound: updatedCurrentRound, localGuest: updatedLocalGuest })
                    }
                    resolve();
                });
            })
        },
        changeLocalGuestName: (name: string) => {
            return new Promise<void>((resolve, reject) => {
                const state = get();
                state.socket?.emit('set_guest_name', name, (response: { error: string }) => {
                    if (response.error) {
                        return reject(new Error(`Change local guest name failed: ${response.error}`));
                    }
                    const updatedLocalGuest = { ...state.localGuest, name }
                    set({ localGuest: updatedLocalGuest })
                    resolve();
                });
            })
        }
    }),
);