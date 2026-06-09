import axios from 'axios';
import RecommendationRepository from '../repositories/RecommendationRepository.js';
import DiscussionRepository from '../repositories/DiscussionRepository.js';
import ApiError from '../utils/ApiError.js';

/**
 * @description Öneri (Recommendation) İş Mantığı Servisi
 */
class RecommendationService {
    /**
     * @desc    Genel/Ana sayfa önerilerini getir (Boşsa AI ile doldur)
     */
    async getGeneralRecommendations() {
        let recommendations = await RecommendationRepository.findGeneral();

        // Eğer veritabanı boşsa (Soğuk Başlangıç), AI ile 3 genel öneri üret ve kaydet
        if (recommendations.length < 3) {
            try {
                const aiRecommendations = await this.generateAiGeneralRecommendations();
                for (const item of aiRecommendations) {
                    await RecommendationRepository.create({
                        ...item,
                        isAi: true
                    });
                }
                recommendations = await RecommendationRepository.findGeneral();
            } catch (err) {
                console.error("Genel AI Önerisi Üretilemedi:", err.message);
            }
        }

        return recommendations;
    }

    /**
     * @desc    Tartışmaya özel önerileri katmanlı olarak getir
     * @param   {string} discussionId
     */
    async getDiscussionRecommendations(discussionId) {
        // 1. Tartışmayı getir
        const discussion = await DiscussionRepository.findById(discussionId);
        if (!discussion) {
            throw new ApiError(404, 'Tartışma bulunamadı');
        }

        // 2. Tartışmaya ait mevcut önerileri getir (Kullanıcılar veya AI tarafından yapılmış olanlar)
        const allDiscussionRecs = await RecommendationRepository.findByDiscussion(discussionId);
        
        let userDiscussionRecs = allDiscussionRecs.filter(r => !r.isAi);
        let aiDiscussionRecs = allDiscussionRecs.filter(r => r.isAi);

        // 3. Tartışmayı başlatan kişinin (Yazarın) kendi genel önerilerini getir
        const authorRecs = await RecommendationRepository.findAuthorGeneral(discussion.authorId);

        // 4. Tartışmaya yorum yazmış olan diğer kişilerin genel önerilerini getir
        const commenterIds = [...new Set((discussion.comments || []).map(c => c.authorId))].filter(id => id !== discussion.authorId);
        let commentersRecs = [];
        if (commenterIds.length > 0) {
            for (const commenterId of commenterIds) {
                const recs = await RecommendationRepository.findAuthorGeneral(commenterId);
                commentersRecs.push(...recs);
            }
        }

        // 5. Eğer AI önerisi henüz üretilmediyse (Cold Start), Gemini API ile 2-3 öneri üret ve kaydet
        if (aiDiscussionRecs.length === 0) {
            try {
                // Eşzamanlı istekler için çift kontrol (Double-check)
                const latestAiRecs = await RecommendationRepository.findByDiscussion(discussionId);
                const existingAiRecs = latestAiRecs.filter(r => r.isAi);

                if (existingAiRecs.length === 0) {
                    const generated = await this.generateAiDiscussionRecommendations(discussion);
                    
                    // Gelen öneriler içindeki olası mükerrer başlıkları temizle
                    const uniqueGenerated = [];
                    const seenGeneratedTitles = new Set();
                    for (const item of generated) {
                        const titleKey = item.title.toLowerCase().trim();
                        if (!seenGeneratedTitles.has(titleKey)) {
                            seenGeneratedTitles.add(titleKey);
                            uniqueGenerated.push(item);
                        }
                    }

                    for (const item of uniqueGenerated) {
                        const saved = await RecommendationRepository.create({
                            ...item,
                            discussionId,
                            isAi: true
                        });
                        aiDiscussionRecs.push(saved);
                    }
                } else {
                    aiDiscussionRecs = existingAiRecs;
                }
            } catch (err) {
                console.error("Tartışma AI Önerisi Üretilemedi:", err.message);
            }
        }

        // Arayüze dönmeden önce tüm listeleri başlığına göre tekilleştir (Deduplicate)
        const uniqueRecs = (arr) => {
            const seen = new Set();
            return arr.filter(item => {
                const key = item.title.toLowerCase().trim();
                if (seen.has(key)) return false;
                seen.add(key);
                return true;
            });
        };

        return {
            authorRecommendations: uniqueRecs(authorRecs),
            communityRecommendations: uniqueRecs([...userDiscussionRecs, ...commentersRecs]),
            aiRecommendations: uniqueRecs(aiDiscussionRecs)
        };
    }

    /**
     * @desc    Kullanıcı olarak yeni öneri ekle
     */
    async createRecommendation(data) {
        const { title, type, label, description, authorId, discussionId } = data;

        if (!title || title.trim().length < 2) {
            throw new ApiError(400, 'Öneri başlığı en az 2 karakter olmalıdır');
        }
        if (!description || description.trim().length < 5) {
            throw new ApiError(400, 'Öneri açıklaması en az 5 karakter olmalıdır');
        }

        return await RecommendationRepository.create({
            title: title.trim(),
            type: type || 'BOOK',
            label: label || 'Öneri',
            description: description.trim(),
            authorId,
            discussionId: discussionId || null,
            isAi: false
        });
    }

    /**
     * @desc    Gemini API ile genel entelektüel öneriler üretir
     */
    async generateAiGeneralRecommendations() {
        const apiKey = process.env.GEMINI_RECOMMENDATION_API_KEY || process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return this.getFallbackGeneralRecommendations();
        }

        const systemInstruction = 
            "Sen entelektüel derinlik katan bir asistanısın. Genel felsefe, sosyoloji, bilim, ekonomi veya sistem eleştirisi konularında 3 adet kitap, film, makale veya belgesel önerisi üret. Yanıtı SADECE aşağıdaki JSON formatında bir dizi olarak ver, başka açıklama yazma:\n" +
            "[\n" +
            "  {\n" +
            "    \"title\": \"kaynak adı (örn: George Orwell - 1984)\",\n" +
            "    \"type\": \"BOOK | FILM | ARTICLE | DOCUMENTARY\",\n" +
            "    \"label\": \"öneri türü ve konusu (örn: Sistem Eleştirisi İçin Kitap)\",\n" +
            "    \"description\": \"Neden tüketilmesi gerektiğine dair 1-2 cümlelik açıklama.\"\n" +
            "  }\n" +
            "]";

        try {
            const response = await axios.post(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
                {
                    contents: [{ role: "user", parts: [{ text: "Genel öneriler üret." }] }],
                    systemInstruction: { parts: [{ text: systemInstruction }] },
                    generationConfig: { responseMimeType: "application/json", temperature: 0.7 }
                },
                { headers: { "Content-Type": "application/json" }, timeout: 8000 }
            );

            const resultText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (resultText) {
                return JSON.parse(resultText.trim());
            }
        } catch (error) {
            console.error("Gemini Genel Öneri Hatası:", error.message);
        }

        return this.getFallbackGeneralRecommendations();
    }

    /**
     * @desc    Gemini API ile tartışmaya özel entelektüel öneriler üretir
     */
    async generateAiDiscussionRecommendations(discussion) {
        const apiKey = process.env.GEMINI_RECOMMENDATION_API_KEY || process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return this.getFallbackDiscussionRecommendations(discussion);
        }

        const systemInstruction = 
            "Sen entelektüel derinlik katan bir asistanısın. Sana gönderilen tartışma başlığını, içeriğini ve etiketlerini analiz et. Bu tartışmanın felsefi, sosyolojik veya eleştirel derinliğini artıracak 2 ya da 3 adet kaynak kitap, film, makale veya belgesel önerisi üret. Yanıtı SADECE aşağıdaki JSON formatında bir dizi olarak ver, başka açıklama yazma:\n" +
            "[\n" +
            "  {\n" +
            "    \"title\": \"kaynak adı (örn: Karl Marx - Ücret, Fiyat ve Kar)\",\n" +
            "    \"type\": \"BOOK | FILM | ARTICLE | DOCUMENTARY\",\n" +
            "    \"label\": \"öneri türü ve konusu (örn: Emek Eleştirisi İçin Kitap)\",\n" +
            "    \"description\": \"Bu tartışmadaki kavramları derinleştirmek amacıyla neden tüketilmesi gerektiğine dair 1-2 cümlelik açıklama.\"\n" +
            "  }\n" +
            "]";

        const textToAnalyze = `Başlık: ${discussion.title}\nİçerik: ${discussion.content}\nEtiketler: ${JSON.stringify(discussion.tags)}`;

        try {
            const response = await axios.post(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
                {
                    contents: [{ role: "user", parts: [{ text: textToAnalyze }] }],
                    systemInstruction: { parts: [{ text: systemInstruction }] },
                    generationConfig: { responseMimeType: "application/json", temperature: 0.5 }
                },
                { headers: { "Content-Type": "application/json" }, timeout: 8000 }
            );

            const resultText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (resultText) {
                return JSON.parse(resultText.trim());
            }
        } catch (error) {
            console.error("Gemini Tartışma Öneri Hatası:", error.message);
        }

        return this.getFallbackDiscussionRecommendations(discussion);
    }

    getFallbackGeneralRecommendations() {
        return [
            {
                title: "George Orwell - 1984",
                type: "BOOK",
                label: "Gözetim Toplumu İçin Kitap",
                description: "Bireysel özgürlüklerin yok oluşunu ve iktidarın bilgi üzerindeki kontrolünü sorgulamak için mutlaka okunmalı."
            },
            {
                title: "Sosyal Dilemma (The Social Dilemma)",
                type: "DOCUMENTARY",
                label: "Teknoloji Eleştirisi İçin Belgesel",
                description: "Sosyal medyanın algoritmik yapısının zihnimizi ve toplumsal yapıyı nasıl manipüle ettiğini ortaya koyuyor."
            },
            {
                title: "Fight Club",
                type: "FILM",
                label: "Tüketim Toplumu İçin Film",
                description: "Modern tüketim toplumunun bireylerde yarattığı yabancılaşmayı ve kimlik krizini anarşist bir dille eleştirir."
            }
        ];
    }

    getFallbackDiscussionRecommendations(discussion) {
        return [
            {
                title: "Aldous Huxley - Cesur Yeni Dünya",
                type: "BOOK",
                label: "Sistem Analizi İçin Kitap",
                description: `Bu tartışmada ele alınan konuları modern haz kültürü ve sistemin dolaylı kontrol mekanizmaları bağlamında sorgulamak için ideal.`
            },
            {
                title: "Capitalism: A Love Story",
                type: "DOCUMENTARY",
                label: "Ekonomik Eşitsizlik İçin Belgesel",
                description: "Tartışmadaki sömürü, kurumlar ve sistemik sorunları küresel ölçekteki finansal krizlerle ilişkilendirmek için yararlı."
            }
        ];
    }
}

const recommendationService = new RecommendationService();
export default recommendationService;
