import { sendAIMessage } from '../api/api';
import { createUserMessage, createTextResponse } from './Messages';
import { createComponentByType, getComponentTypeFromContent } from './ComponentMapper';

//this = MessageHandler nesnesinin kendisi ve constructor'da atanan React state fonksiyonlarına erişim sağlar.
//await kod gerçekleşene kadar bekler.

//MessageHandler sınıfı, tüm mesaj işleme mantığını bir araya getiren bir yöneticidir (controller). Özellikle mesaj gönderme, örnek mesaj tıklama, AI'den yanıt alma gibi işlevleri tek bir merkezden kontrol etmek için kullanılır.
export class MessageHandler {
    constructor(setMessages, setLoading, handleMessageUpdate) {
        this.setMessages = setMessages;  // Chat'teki mesajları güncelleyen React state fonksiyonu
        this.setLoading = setLoading;    // Loading durumunu kontrol eden fonksiyon
        this.handleMessageUpdate = handleMessageUpdate;  // Mesaj güncellendiğinde çalışan callback
    }

    async handleExampleClick(content, setShowButtons) {
        setShowButtons(false); //butonların gizlenmesi
        const userMessage = createUserMessage(content); //yeni kullanıcı mesajı
        this.setMessages(prev => [...prev, userMessage]); // Mesajı chat'e ekle

        await this.processMessage(content); //mesajı işle
    }

    async handleSendMessage(input, setInput, messages) {
        if (!input.trim()) return; //boş mesaj kontrolü

        const userMessage = createUserMessage(input); //kullanıcı mesajı oluştur
        this.setMessages(prev => [...prev, userMessage]); //chat'e ekle
        setInput(''); //inputu temizle 
        this.setLoading(true); //loading'i başlat 

        await this.processMessage(input, messages, userMessage); //mesajı işle
    }

    async processMessage(content, messages = [], userMessage = null) { //mesaj içeriğine göre uygun component tipini belirler ve mesajı düzenler
        const componentType = getComponentTypeFromContent(content); //component var mı kontrol et

        if (componentType) { //kart componenti oluşturur
            const result = createComponentByType(componentType, {
                setMessages: this.setMessages,
                onResult: this.handleMessageUpdate
            }); // component türüne göre oluşturur.

            if (result) { //eğer sonuç varsa eski mesajla yeni mesajı değiştirir ve loading'i kapatır
                this.setMessages(prev => [...prev, result.component]);
                this.setLoading(false);
                return; //işlem tamamlandı, çık
            }
        }

        // AI mesajı gönder
        if (userMessage) {
            try {
                const aiReply = await sendAIMessage([...messages, userMessage]); //AI'den cevap alır 
                const assistantMessage = createTextResponse(aiReply); //AI mesajını oluşturur
                this.setMessages(prev => [...prev, assistantMessage]); //chat'e yazdırır
            } catch (error) { //hata durumundaki mesajlar
                console.error('AI mesajı gönderilirken hata:', error);
                const errorMessage = createTextResponse("Üzgünüm, bir hata oluştu. Lütfen tekrar deneyin.");
                this.setMessages(prev => [...prev, errorMessage]);
            }
        }

        this.setLoading(false);
    }
}