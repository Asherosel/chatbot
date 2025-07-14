import React from 'react';
import { useChatState, useTextareaAutoGrow, useMessageUpdate } from '../hooks/useChatHooks';
import { MessageHandler } from '../utils/MessageHandler';
import { removeRandevuSonucMessage, updateRandevuSonucMessage, confirmRandevuSonucMessage } from '../utils/ButtonFunctions';

const AIAsistan = () => {
    const {
        messages,
        setMessages,
        input,
        setInput,
        loading,
        setLoading,
        showButtons,
        setShowButtons,
        inputRef
    } = useChatState();

    const handleInputChange = useTextareaAutoGrow(inputRef, setInput); //yazı bölümünün otomatik büyümesini ayarlayan fonksiyon çağırılır
    const handleMessageUpdate = useMessageUpdate(setMessages); //mesaj güncelleme fonksiyonu
    const messageHandler = new MessageHandler(setMessages, setLoading, handleMessageUpdate); //MessageHandler çağırılır
    const handleExampleClick = (content) => {
        messageHandler.handleExampleClick(content, setShowButtons);
    }; //ilk butona göre mesaj yazdırma fonksiyonu
    const sendMessage = () => {
        messageHandler.handleSendMessage(input, setInput, messages);
    }; //mesaj gönderme fonksiyonu

    return (
        <div className='min-h-screen w-full bg-gradient-to-tr from-[#e0def4] via-[#a1bef1] to-[#e0def4]'>
            <div className='md:w-[700px] md:mx-auto relative'>
                <div className='bg-white h-17 rounded-b-3xl mx-auto mb-2 sticky top-0 z-50'>

                    <h2 className="text-xl font-semibold text-center pt-5 text-black/80">Randevu Asistanı</h2>
                    <div className="absolute top-2 right-4 ">
                        <button className="btn cursor-pointer rounded-full justify-center" onClick={() => window.location.reload()}>
                            <img src="./Reload.svg" alt="Reload" className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="absolute top-2 left-4">
                        <button className="btn cursor-pointer rounded-full justify-center">
                            <img src="./Back.svg" alt="Back" className="w-5 h-5" />
                        </button>
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto mb-4 space-y-3 px-2 rounded p-2 pb-40">
                    {messages.map((msg, idx) => (
                        <div
                            key={idx}
                            className={`max-w-[90%] p-4 shadow-xl text-xl break-words relative ${msg.role === "user"
                                ? "ml-auto bg-[#241f4e] text-white rounded-l-3xl rounded-tr-3xl"
                                : "mr-auto bg-white text-black rounded-r-3xl rounded-tl-3xl"
                                }`}
                        >
                            {/* 🔽 Mesaj içeriğini burada koşullu gösteriyoruz */}
                            {msg.component // React.cloneElement() var olan bir React bileşenini yeniden oluşturur ve içine yeni props ekler. Yani <RandevuAl /> gibi component'i alır, üzerine bazı işlevleri (props) enjekte eder.
                                ? React.cloneElement(msg.component, {
                                    onResult: handleMessageUpdate,
                                    onRemoveMessage: (id) => removeRandevuSonucMessage(setMessages, id),
                                    onUpdateMessage: (id) => updateRandevuSonucMessage(setMessages, id),
                                    onConfirmMessage: (id) => confirmRandevuSonucMessage(setMessages, id),
                                })
                                : <div className="pb-2">{msg.content} </div>}



                            {/* 🔽 Zaman damgası */}
                            {msg.timestamp && (
                                <div className={`text-xs absolute bottom-2 opacity-70 ${msg.role === "user" ? "text-white right-3" : "text-black left-3"
                                    }`}>
                                    {msg.timestamp}
                                </div>
                            )}

                            {/* İlk mesaj altı butonlar */}
                            {idx === 0 && msg.role === "assistant" && showButtons && (
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {["Randevu Al", "Sonuç Görüntüle", "Hastane Bilgisi Al", "Nöbetçi Eczane", "Geçmiş Randevu Görüntüle", "Gelecek Randevu Görüntüle"].map((btn, i) => (
                                        <button
                                            key={i}
                                            onClick={() => handleExampleClick(btn)}
                                            className="border-2 text-black px-4 py-1 rounded-xl hover:border-black/50 hover:text-black/50 cursor-pointer"
                                        >
                                            {btn}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}

                    {loading && (
                        <div className="mr-auto bg-gray-200 text-black text-sm px-2 py-1 rounded-lg animate-pulse">
                            Yazıyor...
                        </div>
                    )}
                </div>



                <div className="fixed bottom-0 left-0 w-full p-4 flex justify-center gap-2 z-10">
                    <div className="relative w-full max-w-2xl">
                        <textarea
                            ref={inputRef}
                            value={input}
                            onChange={handleInputChange}
                            placeholder="Örn: Randevu al"
                            rows={1}
                            className="resize-none w-full min-h-24 max-h-64 top-1/2 focus:outline-none focus:ring-0 focus:border-transparent bg-[#303030] text-white text-lg rounded-4xl placeholder:text-white/70 px-4 md:py-8 py-4 pr-30 overflow-hidden"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    sendMessage();
                                }
                            }}
                        />

                        <button
                            onClick={sendMessage}
                            disabled={loading}
                            className="absolute right-10 top-1/2 -translate-y-1/2 bg-white text-black px-4 py-3 rounded-full hover:bg-white/90 disabled:opacity-50 cursor-pointer rotate-270"
                        >
                            ➤
                        </button>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default AIAsistan;
