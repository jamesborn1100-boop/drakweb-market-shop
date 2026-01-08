const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// ໄຟລ໌ທີ່ຈະໃຊ້ເກັບຂໍ້ມູນພໍ່ຄ້າ
const DATA_FILE = path.join(__dirname, 'database.json');

// ຟັງຊັນອ່ານຂໍ້ມູນ
const readData = () => {
    if (!fs.existsSync(DATA_FILE)) return [];
    try {
        const data = fs.readFileSync(DATA_FILE);
        return JSON.parse(data);
    } catch (e) { return []; }
};

// ຟັງຊັນຂຽນຂໍ້ມູນ
const writeData = (data) => {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
};

app.get('/api/products', (req, res) => {
    res.json(readData());
});

app.post('/api/products', (req, res) => {
    const products = readData();
    const newProduct = { id: Date.now(), ...req.body };
    products.unshift(newProduct);
    writeData(products);
    res.json({ message: "Success", product: newProduct });
});

// ໃຫ້ Server ລັນຢູ່ Port 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});