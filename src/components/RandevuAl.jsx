import React from 'react'
import { useState } from "react";
import { createTextResponse, createComponentResponse } from '../utils/Messages';
import RandevuSonuc from './RandevuSonuc';
import { useSendMessageMutation } from '../api/api';

function RandevuAl({ onResult, onRemoveFormMessage, setMessages, id }) {
    // Geçici veriler (dummy data)
    const hospitals = ["Devlet Hastanesi", "Şehir Hastanesi", "Özel Hastane"];
    const doctors = ["Dr. Ali Yılmaz", "Dr. Ayşe Demir", "Dr. Mehmet Kaya"];
    const departments = ["Kardiyoloji", "Dahiliye", "Ortopedi"];

    // Seçilen değerleri tutmak için state
    const [selectedHospital, setSelectedHospital] = useState("");
    const [selectedDoctor, setSelectedDoctor] = useState("");
    const [selectedDepartment, setSelectedDepartment] = useState("");
    const [selectedDate, setSelectedDate] = useState("");

    const today = new Date();
    const formatDate = (date) => date.toISOString().split("T")[0]; //Bu kısım Date nesnesini ISO 8601 formatına çevirir. split("T")[0] sadece "2025-07-11" kısmını alır.

    const [sendMessage] = useSendMessageMutation();
    const [currentStep, setCurrentStep] = useState(1);

    const handleConfirm = async () => {
        if (!selectedDate) {
            alert("Lütfen tarih seçiniz.");
            return;
        }

        try {
            alert("Randevu başarıyla oluşturuldu.");

            // Sonuç mesajını göster
            const sonucComponent = (
                <RandevuSonuc
                    id={Date.now()}
                    hospital={selectedHospital}
                    doctor={selectedDoctor}
                    department={selectedDepartment}
                    date={selectedDate}
                    onRemoveMessage={(id) => onResult({ type: "remove", id })}
                />
            );

            onResult(createComponentResponse(sonucComponent, Date.now()));

            // Formu sıfırla ve/veya adımı resetle
            setSelectedHospital("");
            setSelectedDoctor("");
            setSelectedDepartment("");
            setSelectedDate("");
            setCurrentStep(1); // ya da uygun adım

        } catch (error) {
            console.log("Randevu oluşturulurken hata oluştu.");
            console.error(error);
        }
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-xl space-y-4">
            <h2 className="text-2xl font-semibold text-center text-gray-800">Randevu Oluştur</h2>

            {/* Hastane */}
            {currentStep === 1 && (
                <div>
                    <label>Hastane</label>
                    <select value={selectedHospital} onChange={(e) => setSelectedHospital(e.target.value)}>
                        <option value="">Seçiniz</option>
                        {hospitals.map((item, i) => (
                            <option key={i} value={item}>{item}</option>
                        ))}
                    </select>
                    <button
                        onClick={async () => {
                            if (!selectedHospital) return alert("Lütfen hastane seçiniz.");
                            useSendMessageMutation("hastane", selectedHospital);
                            setCurrentStep(2);
                        }}
                    >
                        Devam Et
                    </button>
                </div>
            )}

            {/* Doktor */}
            {currentStep === 2 && (
                <div>
                    <label>Doktor</label>
                    <select value={selectedDoctor} onChange={(e) => setSelectedDoctor(e.target.value)}>
                        <option value="">Seçiniz</option>
                        {doctors.map((item, i) => (
                            <option key={i} value={item}>{item}</option>
                        ))}
                    </select>
                    <button
                        onClick={async () => {
                            if (!selectedDoctor) return alert("Lütfen doktor seçiniz.");
                            await useSendMessageMutation("doktor", selectedDoctor);
                            setCurrentStep(3);
                        }}
                    >
                        Devam Et
                    </button>
                </div>
            )}

            {/* Bölüm */}
            {currentStep === 3 && (
                <div>
                    <label>Bölüm</label>
                    <select value={selectedDepartment} onChange={(e) => setSelectedDepartment(e.target.value)}>
                        <option value="">Seçiniz</option>
                        {departments.map((item, i) => (
                            <option key={i} value={item}>{item}</option>
                        ))}
                    </select>
                    <button
                        onClick={async () => {
                            if (!selectedDepartment) return alert("Lütfen bölüm seçiniz.");
                            await useSendMessageMutation("bölüm", selectedDepartment);
                            setCurrentStep(4);
                        }}
                    >
                        Devam Et
                    </button>
                </div>
            )}

            {/* Tarih */}
            {currentStep === 4 && (
                <div>
                    <label>Tarih</label>
                    <select value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)}>
                        <option value="">Seçiniz</option>
                        {date.map((item, i) => (
                            <option key={i} value={item}>{item}</option>
                        ))}
                    </select>
                    <button
                        onClick={async () => {
                            if (!selectedDate) return alert("Lütfen tarih seçiniz.");
                            await useSendMessageMutation("tarih", selectedDate);
                            setCurrentStep(4);
                        }}
                    >
                        Devam Et
                    </button>
                </div>
            )}

            {currentStep === 5 && (
                <button
                    onClick={handleConfirm}
                    className="w-full bg-[#303030] hover:bg-[#414141] text-white py-2 px-4 rounded-2xl cursor-pointer"
                >
                    Randevu Al
                </button>
            )}
        </div>
    );
};

export default RandevuAl