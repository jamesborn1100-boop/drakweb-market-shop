const express = require('express');
const cors = require('cors');
const { kv } = require('@vercel/kv'); // ປ່ຽນມາໃຊ້ Database Online ຂອງ Vercel
const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// ດຶງຂໍ້ມູນສິນຄ້າຈາກ Database
app.get('/api/products', async (req, res) => {
    try {
        const products = await kv.get('products') || [];
        res.json(products);
    } catch (e) {
        res.status(500).json({ error: "ອ່ານຂໍ້ມູນບໍ່ໄດ້: " + e.message });
    }
});

// ເພີ່ມສິນຄ້າໃໝ່ລົງ Database
app.post('/api/products', async (req, res) => {
    try {
        const products = await kv.get('products') || [];
        const newProduct = { 
            id: Date.now(), 
            views: 0, 
            ...req.body 
        };
        products.unshift(newProduct);
        
        await kv.set('products', products); // ບັນທຶກລົງ Cloud ຂອງ Vercel
        res.json({ message: "Success", product: newProduct });
    } catch (e) {
        res.status(500).json({ error: "ບັນທຶກຂໍ້ມູນບໍ່ໄດ້: " + e.message });
    }
});

// ສຳລັບ Vercel ຕ້ອງ Export app
module.exports = app;