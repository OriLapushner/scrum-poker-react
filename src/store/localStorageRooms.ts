'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const LOCAL_STORAGE_TIME_LIMIT = 1000 * 60 * 60 * 3 // 3 hours

interface LocalStorageRoomsState {
	rooms: LocalStorageRooms
}

interface LocalStorageRoomsStore extends LocalStorageRoomsState {
	addRoom: (roomId: string, secretId: string) => void;
	setRooms: (rooms: LocalStorageRooms) => void;
}

const INITIAL_STATE: LocalStorageRoomsState = {
	rooms: {}
}

const filterOutdatedRooms = (rooms: LocalStorageRooms) => {
	const filteredRooms: LocalStorageRooms = {};
	const currentTime = Date.now();

	Object.entries(rooms).forEach(([key, value]) => {
		if (value.timeStamp > currentTime - LOCAL_STORAGE_TIME_LIMIT) {
			filteredRooms[key] = value;
		}
	});

	return filteredRooms;
}

export const useLocalStorageRoomsStore = create<LocalStorageRoomsStore>()(
	persist((set, get) => ({
		...INITIAL_STATE,
		addRoom: (roomId: string, secretId: string) => {
			const state = get();
			const newRooms = { ...state.rooms };
			newRooms[roomId] = { secretId, timeStamp: Date.now() };
			set({ rooms: newRooms });
		},
		setRooms: (rooms: LocalStorageRooms) => {
			set({ rooms });
		}
	}),
		{
			name: 'localStorageRooms',
			partialize: (state) => ({ rooms: filterOutdatedRooms(state.rooms) }),
			onRehydrateStorage: () => (state) => {
				if (state) {
					state.setRooms(filterOutdatedRooms(state.rooms));
				}
			},
		})
)




