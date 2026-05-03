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
     * @returns {Promise<{isSafe: boolean, riskScore: number, flaggedWords: string[]}>}
     */
    async analyzeText(text) {
        if (!text) return { isSafe: true, riskScore: 0, flaggedWords: [] };

        const lowercaseText = text.toLowerCase();
        const flaggedWords = [];

        // Basit kontrol: Blacklist'teki kelimeler geçiyor mu?
        this.blacklist.forEach(word => {
            if (lowercaseText.includes(word)) {
                flaggedWords.push(word);
            }
        });

        // Skorlama: Tek kelime bile varsa risklidir.
        const riskScore = flaggedWords.length > 0 ? Math.min(flaggedWords.length * 0.5, 1) : 0;
        const isSafe = flaggedWords.length === 0; // Hiç yasaklı kelime yoksa güvenli

        // Not: Gelecekte buraya OpenAI veya HuggingFace API çağrısı eklenebilir.
        // Örn: const response = await axios.post('AI_ENDPOINT', { text });

        return {
            isSafe,
            riskScore,
            flaggedWords
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
