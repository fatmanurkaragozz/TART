import { query } from '../config/database.js';

/**
 * @description Tartışma Veri Erişim Katmanı (PostgreSQL / pg)
 */
class DiscussionRepository {
    /**
     * @desc    Yeni tartışma oluştur
     * @param   {object} discussionData
     */
    async create(discussionData) {
        const { title, content, author, tags } = discussionData;
        
        const sql = `
            INSERT INTO discussions (title, content, author, tags)
            VALUES ($1, $2, $3, $4)
            RETURNING *
        `;
        
        const values = [title, content, author, JSON.stringify(tags)];
        const result = await query(sql, values);
        
        return result.rows[0];
    }

    /**
     * @desc    Tüm tartışmaları getir
     */
    async findAll() {
        const sql = 'SELECT * FROM discussions ORDER BY created_at DESC';
        const result = await query(sql);
        
        return result.rows;
    }

    /**
     * @desc    ID'ye göre tartışma getir
     * @param   {string|number} id
     */
    async findById(id) {
        const sql = 'SELECT * FROM discussions WHERE id = $1';
        const result = await query(sql, [id]);
        
        return result.rows[0];
    }
}

const discussionRepository = new DiscussionRepository();
export default discussionRepository;
