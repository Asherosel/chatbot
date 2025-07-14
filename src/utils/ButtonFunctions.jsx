import React from 'react'
import RandevuAl from '../components/RandevuAl';
import RandevuSonuc from '../components/RandevuSonuc';
import { createComponentResponse } from '../utils/Messages';
import { store } from '../hooks/store';
import { localApi } from '../api/api';

export const sendActionToAPI = async (actionText) => {
    try {
        const result = await store.dispatch(
            localApi.endpoints.sendMessage.initiate([
                { role: "user", content: actionText }
            ])
        ).unwrap();

        console.log("🟢 API'den gelen cevap:", result); // GELEN CEVAP

        return result;
    } catch (e) {
        console.error("API hatası:", e);
    }
};

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

export const removeRandevuSonucMessage = async (setMessages, id) => {
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
    await sendActionToAPI("Hayır");
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

export const confirmRandevuSonucMessage = async (setMessages, id) => {
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
                            hideButtons={true}
                        />
                    ),
                    content: "",
                };
            }
            return msg;
        })
    );

    await sendActionToAPI("Evet");
};
