import { createUserMessage, createTextResponse } from './Messages';
import { createComponentByType, getComponentTypeFromContent } from './ComponentMapper';

//this = MessageHandler nesnesinin kendisi ve constructor'da atanan React state fonksiyonlarına erişim sağlar.
//await kod gerçekleşene kadar bekler.

//MessageHandler sınıfı, tüm mesaj işleme mantığını bir araya getiren bir yöneticidir (controller). Özellikle mesaj gönderme, örnek mesaj tıklama, AI'den yanıt alma gibi işlevleri tek bir merkezden kontrol etmek için kullanılır.
// MessageHandler.js

export class MessageHandler {
    constructor(setMessages, setLoading, handleMessageUpdate, generateContent) {
        this.setMessages = setMessages;
        this.setLoading = setLoading;
        this.handleMessageUpdate = handleMessageUpdate;
        this.generateContent = generateContent; // RTK mutation fonksiyonu
    }

    async handleExampleClick(content, setShowButtons) {
        setShowButtons(false);
        const userMessage = createUserMessage(content);
        this.setMessages(prev => [...prev, userMessage]);

        await this.processMessage(content); // aynı
    }

    async handleSendMessage(input, setInput, messages) {
        if (!input.trim()) return;

        const userMessage = createUserMessage(input);
        this.setMessages(prev => [...prev, userMessage]);
        setInput('');
        this.setLoading(true);

        await this.processMessage(input, messages, userMessage);
    }

    async processMessage(content, messages = [], userMessage = null) {
        const componentType = getComponentTypeFromContent(content);

        if (componentType) {
            const result = createComponentByType(componentType, {
                setMessages: this.setMessages,
                onResult: this.handleMessageUpdate
            });

            if (result) {
                this.setMessages(prev => [...prev, result.component]);
                this.setLoading(false);
                return;
            }
        }

        if (userMessage) {
            try {
                // RTK mutation kullanımı
                const aiReply = await this.generateContent([...messages, userMessage]).unwrap();
                const assistantMessage = createTextResponse(aiReply);
                this.setMessages(prev => [...prev, assistantMessage]);
            } catch (error) {
                console.error('AI mesajı gönderilirken hata:', error);
                const errorMessage = createTextResponse("Üzgünüm, bir hata oluştu. Lütfen tekrar deneyin.");
                this.setMessages(prev => [...prev, errorMessage]);
            }
        }

        this.setLoading(false);
    }
}
