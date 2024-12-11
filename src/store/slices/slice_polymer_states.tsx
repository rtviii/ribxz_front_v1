import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface PolymerUIState {
    visible: boolean;
    selected: boolean;
    isolated: boolean;
}

interface PolymerIdentifier {
    auth_asym_id: string;
}

// Flattened state structure
interface PolymerStatesState {
    statesByPolymer: Record<string, PolymerUIState>; // key is `${rcsb_id}_${auth_asym_id}`
}

const initialState: PolymerStatesState = {
    statesByPolymer: {}
};

interface PolymerVisibilityUpdate {
    rcsb_id: string;
    auth_asym_id: string;
    visible: boolean;
}

export const polymerStatesSlice = createSlice({
    name: 'polymerStates',
    initialState,
    reducers: {
        initializePolymerStates: (state, action: PayloadAction<PolymerIdentifier[]>) => {
            action.payload.forEach(({auth_asym_id}) => {
                // Initialize polymer state if it doesn't exist
                if (!state.statesByPolymer[auth_asym_id]) {
                    state.statesByPolymer[auth_asym_id] = {
                        visible: true,
                        selected: false,
                        isolated: false
                    };
                }
            });
        },

        setPolymerVisibility: (
            state,
            action: PayloadAction<{
                rcsb_id: string;
                auth_asym_id: string;
                visible: boolean;
            }>
        ) => {
            const {rcsb_id, auth_asym_id, visible} = action.payload;

            if (state.statesByPolymer[auth_asym_id]) {
                state.statesByPolymer[auth_asym_id].visible = visible;
            }
        },

        setBatchPolymerVisibility: (state, action: PayloadAction<PolymerVisibilityUpdate[]>) => {
            action.payload.forEach(({rcsb_id, auth_asym_id, visible}) => {
                if (state.statesByPolymer[auth_asym_id]) {
                    state.statesByPolymer[auth_asym_id].visible = visible;
                }
            });
        },

        setPolymerSelected: (
            state,
            action: PayloadAction<{
                rcsb_id: string;
                auth_asym_id: string;
                selected: boolean;
            }>
        ) => {
            const {rcsb_id, auth_asym_id, selected} = action.payload;
            if (state.statesByPolymer[auth_asym_id]) {
                state.statesByPolymer[auth_asym_id].selected = selected;
            }
        },

        setPolymerIsolated: (
            state,
            action: PayloadAction<{
                rcsb_id: string;
                auth_asym_id: string;
                isolated: boolean;
            }>
        ) => {
            const {rcsb_id, auth_asym_id, isolated} = action.payload;
            if (state.statesByPolymer[auth_asym_id]) {
                state.statesByPolymer[auth_asym_id].isolated = isolated;
            }
        }
    }
});

export const {
    initializePolymerStates,
    setBatchPolymerVisibility,
    setPolymerVisibility,
    setPolymerSelected,
    setPolymerIsolated
} = polymerStatesSlice.actions;

export default polymerStatesSlice.reducer;

import {createSelector} from '@reduxjs/toolkit';
import type {RootState} from '../store';

const selectPolymerStates = (state: RootState) => state.polymer_states;

// Get UI state for a specific polymer
export const selectPolymerUIState = createSelector(
    [selectPolymerStates, (_state, props: {rcsb_id: string; auth_asym_id: string}) => props],
    (polymerStates, {rcsb_id, auth_asym_id}) => polymerStates.statesByPolymer[auth_asym_id]
);

// Get all polymer states for a specific RCSB ID
export const selectPolymerStatesForRCSB = createSelector(
    [selectPolymerStates, (_state, rcsb_id: string) => rcsb_id],
    (polymerStates, rcsb_id) => {
        const polymerIds = Object.keys(polymerStates.statesByPolymer);
        return polymerIds.reduce((acc, polymerId) => {
            const [_, auth_asym_id] = polymerId.split('_');
            acc[auth_asym_id] = polymerStates.statesByPolymer[polymerId];
            return acc;
        }, {} as Record<string, PolymerUIState>);
    }
);
