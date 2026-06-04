import axios from 'axios';

/**
 * @description İçerik Moderasyon Servisi (Hafta 5)
 * Bu servis, kullanıcıların girdiği içeriklerdeki argo, küfür ve hakaretleri tespit eder.
 */
class ModerationService {
    constructor() {
        // Temel argo ve küfür listesi (Geliştirilebilir)
        this.blacklist = [
            'siktir', 'bok', 'amk', 'oç', 'piç', 'yavşak',
            'aptal', 'gerizekalı', 'şerefsiz', 'ahlaksız', 'salak'
        ];
    }

    /**
     * @desc Metni analiz eder ve risk skorunu döndürür (0-1 arası)
     * @param {string} text 
     * @returns {Promise<{isSafe: boolean, riskScore: number, flaggedWords: string[], source: string, flaggedReason?: string}>}
     */
    async analyzeText(text) {
        if (!text) return { isSafe: true, riskScore: 0, flaggedWords: [], source: 'empty' };

        const lowercaseText = text.toLowerCase();
        const flaggedWords = [];

        // 1. Yerel denetim (Hızlı ön filtreleme / Fallback)
        this.blacklist.forEach(word => {
            if (lowercaseText.includes(word)) {
                flaggedWords.push(word);
            }
        });

        if (flaggedWords.length > 0) {
            return {
                isSafe: false,
                riskScore: Math.min(flaggedWords.length * 0.5, 1),
                flaggedWords,
                source: 'local_blacklist',
                flaggedReason: 'Metinde uygunsuz veya kaba ifadeler tespit edildi.'
            };
        }

        // 2. Gelişmiş Yapay Zeka (Gemini API) Moderasyonu
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            console.warn("AI Moderasyon uyarısı: GEMINI_API_KEY tanımlı değil. Sadece yerel kara liste koruması devrede.");
            return {
                isSafe: true,
                riskScore: 0,
                flaggedWords: [],
                source: 'local_blacklist'
            };
        }

        try {
            const systemInstruction =
                "Sen bir Türkçe içerik denetleme asistanısın. Görevin, sana gönderilen metni analiz ederek topluluk kurallarına " +
                "uygunluğunu değerlendirmektir. Küfür, hakaret, nefret söylemi, şiddet teşviki veya yetişkin içerikleri tespit et.\n" +
                "Yanıtı SADECE aşağıdaki JSON formatında ver, başka hiçbir açıklama yazma:\n" +
                "{\n" +
                "  \"isSafe\": boolean,\n" +
                "  \"riskScore\": number (0.0 ile 1.0 arasında risk oranı),\n" +
                "  \"flaggedReason\": \"tespit edilen ihlal nedeni (eğer güvenli ise boş bırak)\"\n" +
                "}";

            const response = await axios.post(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
                {
                    contents: [
                        {
                            role: "user",
                            parts: [
                                { text: `Metin:\n\"\"\"\n${text}\n\"\"\"` }
                            ]
                        }
                    ],
                    systemInstruction: {
                        parts: [
                            { text: systemInstruction }
                        ]
                    },
                    generationConfig: {
                        responseMimeType: "application/json",
                        temperature: 0.1
                    }
                },
                {
                    headers: {
                        "Content-Type": "application/json"
                    },
                    timeout: 5000 // 5 saniye zaman aşımı limit
                }
            );

            const resultText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (resultText) {
                const aiResult = JSON.parse(resultText.trim());
                return {
                    isSafe: aiResult.isSafe ?? true,
                    riskScore: aiResult.riskScore ?? 0,
                    flaggedWords: [],
                    source: 'gemini_ai',
                    flaggedReason: aiResult.flaggedReason || ''
                };
            }
        } catch (error) {
            console.error("AI Moderasyon Hatası (Gemini):", error.message);
        }

        // Gemini sorgusu başarısız olursa güvenli kabul et
        return {
            isSafe: true,
            riskScore: 0,
            flaggedWords: [],
            source: 'local_fallback'
        };
    }

    /**
     * @desc İçeriği temizler (isteğe bağlı)
     */
    cleanText(text) {
        let cleaned = text;
        this.blacklist.forEach(word => {
            const regex = new RegExp(word, 'gi');
            cleaned = cleaned.replace(regex, '***');
        });
        return cleaned;
    }
}

const moderationService = new ModerationService();
export default moderationService;
