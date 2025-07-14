import React from 'react'
import { useState } from "react";
import { createTextResponse, createComponentResponse } from '../utils/Messages';
import RandevuSonuc from './RandevuSonuc';

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

    const handleConfirm = () => {
        const missingFields = []; //boş alanlar
        const sonucId = Date.now(); // yeni randevu sonuç mesajı için benzersiz bir id

        if (!selectedHospital) missingFields.push("Hastane");
        if (!selectedDoctor) missingFields.push("Doktor");
        if (!selectedDepartment) missingFields.push("Bölüm");
        if (!selectedDate) missingFields.push("Tarih");

        if (missingFields.length > 0) { //boş alan kontrolü
            const message = `Lütfen ${missingFields.join(", ")} seçiniz.`// join virgülle böler
            onResult(createTextResponse(message));
            return;
        }

        // Önce form mesajını kaldır
        if (onRemoveFormMessage && setMessages && id) {
            onRemoveFormMessage(setMessages, id);
        }

        // Sonra randevu sonuç mesajını ekle
        if (onResult) {
            const sonucComponent = (
                <RandevuSonuc
                    id={sonucId}
                    hospital={selectedHospital}
                    doctor={selectedDoctor}
                    department={selectedDepartment}
                    date={selectedDate}
                    onRemoveMessage={(id) => onResult({ type: "remove", id })}
                />
            );

            const baseMessage = createComponentResponse(sonucComponent, sonucId);
            const message = {
                ...baseMessage,
                hospital: selectedHospital,
                doctor: selectedDoctor,
                department: selectedDepartment,
                date: selectedDate
            };
            onResult(message);
        }

        // Formu sıfırla
        setSelectedHospital("");
        setSelectedDoctor("");
        setSelectedDepartment("");
        setSelectedDate("");
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-xl space-y-4">
            <h2 className="text-2xl font-semibold text-center text-gray-800">Randevu Oluştur</h2>

            {/* Hastane */}
            <div>
                <label className="block mb-1 text-gray-600">Hastane</label>
                <select
                    value={selectedHospital}
                    onChange={(e) => setSelectedHospital(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">Seçiniz</option>
                    {hospitals.map((item, i) => (
                        <option key={i} value={item}>{item}</option>
                    ))}
                </select>
            </div>

            {/* Doktor */}
            <div>
                <label className="block mb-1 text-gray-600">Doktor</label>
                <select
                    value={selectedDoctor}
                    onChange={(e) => setSelectedDoctor(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">Seçiniz</option>
                    {doctors.map((item, i) => (
                        <option key={i} value={item}>{item}</option>
                    ))}
                </select>
            </div>

            {/* Bölüm */}
            <div>
                <label className="block mb-1 text-gray-600">Bölüm</label>
                <select
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">Seçiniz</option>
                    {departments.map((item, i) => (
                        <option key={i} value={item}>{item}</option>
                    ))}
                </select>
            </div>

            {/* Tarih */}
            <div>
                <label className="block mb-1 text-gray-600">Tarih</label>
                <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min={formatDate(today)}  // minimum seçilebilir tarih
                // max="2025-07-12"  // maksimum seçilebilir tarih
                />
            </div>

            <button
                onClick={handleConfirm}
                className="w-full bg-[#303030] hover:bg-[#414141] text-white py-2 px-4 rounded-2xl cursor-pointer"
            >
                Randevu Al
            </button>
        </div>
    );
};

export default RandevuAl