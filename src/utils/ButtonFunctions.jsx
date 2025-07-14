import React from 'react'
import RandevuAl from '../components/RandevuAl';
import RandevuSonuc from '../components/RandevuSonuc';
import { createComponentResponse } from '../utils/Messages';

export const removeRandevuFormMessage = (setMessages, id) => {
    setMessages(prev =>
        prev.map(msg => {
            if (msg.id === id) {
                return {
                    ...msg,
                    component: null,
                    content: "Randevu Oluşturuldu!",
                };
            }
            return msg;
        })
    );
};

export const removeRandevuSonucMessage = (setMessages, id) => {
    setMessages(prev =>
        prev.map(msg => {
            if (msg.id === id) {
                return {
                    ...msg,
                    component: null,
                    content: "Randevu İptal Edildi!",
                };
            }
            return msg;
        })
    );
};

export const updateRandevuSonucMessage = (setMessages, id) => {
    removeRandevuSonucMessage(setMessages, id);
    setMessages(prev => {
        const updated = prev.map(msg => {
            if (msg.id === id) {
                return {
                    ...msg,
                    component: null,
                    content: "Randevunuzu Güncelleyin!",
                };
            }
            return msg;
        });

        // Güncelleme mesajını ekle
        const newFormMessage = createComponentResponse(
            <RandevuAl onRemoveFormMessage={removeRandevuFormMessage} />
        );

        return [...updated, newFormMessage];
    });
};

export const confirmRandevuSonucMessage = (setMessages, id) => {
    setMessages(prev =>
        prev.map(msg => {
            if (msg.id === id) {
                return {
                    ...msg,
                    component: (
                        <RandevuSonuc
                            id={id}
                            hospital={msg.hospital}
                            doctor={msg.doctor}
                            department={msg.department}
                            date={msg.date}
                            hideButtons={true}  // Butonları gizlemek için yeni prop
                        />
                    ),
                    content: "",  // metin kaldırılıyor, component gösterilecek
                };
            }
            return msg;
        })
    );
};