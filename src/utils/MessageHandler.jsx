//dispatch: Redux store'a action göndermek için kullanılır.
//setMessages, setLoading: Redux slice'tan import edilen action'lardır.
//handleExampleClick: Örnek butona tıklanınca mesajı Redux state'ine ekler.
//handleSendMessage: Kullanıcı mesajını ve ardından asistan cevabını Redux state'ine ekler.
//handleMessageUpdate: Mesajları günceller (örneğin bir mesaj silindiğinde veya değiştirildiğinde).
import { sendAIMessage } from '../api/api';
import { createUserMessage, createTextResponse } from './Messages';
import { createComponentByType, getComponentTypeFromContent } from './ComponentMapper';
import { setMessages, setLoading } from '../store/ChatSlice';

//this = MessageHandler nesnesinin kendisi ve constructor'da atanan React state fonksiyonlarına erişim sağlar.
//await kod gerçekleşene kadarbekler.

//MessageHandler sınıfı, tüm mesaj işleme mantığını bir araya getiren bir yöneticidir (controller). Özellikle mesaj gönderme, örnek mesaj tıklama, AI'den yanıt alma gibi işlevleri tek bir merkezden kontrol etmek için kullanılır.
export class MessageHandler {
  constructor(dispatch, handleMessageUpdate) {
    this.dispatch = dispatch;
    this.handleMessageUpdate = handleMessageUpdate;
  }
    async handleExampleClick(content, setShowButtons, messages) {
    setShowButtons(false);
    const userMessage = createUserMessage(content);
    this.dispatch(setMessages([...messages, userMessage]));
    await this.processMessage(content, messages, userMessage);
  }

  async handleSendMessage(input, setInput, messages) {
    if (!input.trim()) return;
    const userMessage = createUserMessage(input);
    this.dispatch(setMessages([...messages, userMessage]));
    setInput('');
    this.dispatch(setLoading(true));
    await this.processMessage(input, messages, userMessage);
  }

  async processMessage(content, messages = [], userMessage = null) {
    const componentType = getComponentTypeFromContent(content);

    if (componentType) {
      const result = createComponentByType(componentType, {
        dispatch: this.dispatch,
        onResult: this.handleMessageUpdate,
      });
      if (result) {
        this.dispatch(setMessages([...messages, result.component]));
        this.dispatch(setLoading(true)); // mesaj gönderme işlemi başlarken
        return;
      }
    }

    //AI cevabı
    if (userMessage) {
      try {
        const aiReply = await sendAIMessage([...messages, userMessage]);
        const assistantMessage = createTextResponse(aiReply);
        this.dispatch(setMessages([...messages, assistantMessage]));
      } catch (error) {
        console.error('AI mesajı gönderilirken hata:', error);
        const errorMessage = createTextResponse("Üzgünüm, bir hata oluştu. Lütfen tekrar deneyin.");
        this.dispatch(setMessages([...messages, errorMessage]));
      }
    }
    this.dispatch(setLoading(false));
  }
}
