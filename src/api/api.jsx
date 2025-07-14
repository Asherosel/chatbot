import axios from 'axios';
//

// IMPORTANT: Replace with your actual Gemini API Key.
// For production applications, consider securing this key
// by storing it in environment variables and accessing it server-side.
const GEMINI_API_KEY = "AIzaSyBmk5csfwLiursqI_CevGuaVfFSF_G6PRA"; // Replace with your actual API key
// 'gemini-pro' yerine ListModels'tan aldığınız geçerli bir model adını kullanın
const MODEL_NAME = "gemini-1.5-flash"; // Veya 'gemini-1.5-flash', vb.

export const sendAIMessage = async (messages) => {
    try {
        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${GEMINI_API_KEY}`,
            {
                contents: messages.map(msg => ({
                    role: msg.role === 'user' ? 'user' : 'model',
                    parts: [{ text: msg.content }]
                }))
            },
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );

        // Assuming the Gemini API response structure
        if (response.data && response.data.candidates && response.data.candidates.length > 0) {
            const firstCandidate = response.data.candidates[0];
            if (firstCandidate.content && firstCandidate.content.parts && firstCandidate.content.parts.length > 0) {
                return firstCandidate.content.parts[0].text;
            }
        }
        return "Yanıt alınamadı.";
    } catch (error) {
        console.error("Gemini API Hatası:", error);
        if (error.response) {
            console.error("API Hata Detayları:", error.response.data);
            // Gemini API'den gelen hatayı daha net görmek için burada error.response.data.message'ı loglayabiliriz
            if (error.response.data && error.response.data.error && error.response.data.error.message) {
                console.error("Gemini spesifik hata mesajı:", error.response.data.error.message);
                return `Bir hata oluştu: ${error.response.data.error.message}. Lütfen tekrar deneyin.`;
            }
        }
        return "Bir hata oluştu. Lütfen tekrar deneyin.";
    }
};