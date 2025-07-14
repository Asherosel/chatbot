 // Mesajlar, input, loading ve buton state'leri burada tutulur ve güncellenir.
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  messages: [],
  input: '',
  loading: false,
  showButtons: true,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setMessages: (state, action) => { state.messages = action.payload; },
    addMessage: (state, action) => { state.messages.push(action.payload); },
    setInput: (state, action) => { state.input = action.payload; },
    setLoading: (state, action) => { state.loading = action.payload; },
    setShowButtons: (state, action) => { state.showButtons = action.payload; },
    clearMessages: (state) => { state.messages = []; },
    // Gerekirse başka reducer'lar eklenebilir
  },
});

export const { setMessages, addMessage, setInput, setLoading, setShowButtons, clearMessages } = chatSlice.actions;
export default chatSlice.reducer;