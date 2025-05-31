require('dotenv').config();

const express = require('express');
const cors = require('cors');
const midtransClient = require('midtrans-client');

const app = express();
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

let snap = new midtransClient.Snap({
    isProduction: true,
    serverKey: process.env.MIDTRANS_SERVER_KEY,
    clientKey: process.env.MIDTRANS_CLIENT_KEY
});

app.post('/api/checkout', async (req, res) => {
    try {
        console.log("Request diterima:", req.body);
        const {order_id, amount } = req.body;
        let parameter = {
            transaction_details:{
                order_id: order_id,
                gross_amount: amount,
            },
        };

        let transaction = await snap.createTransaction(parameter);
        res.json({ token: transaction.token });
    } catch (error) {
        console.error("Error transaksi:", error);
        res.status(500).json({message: "Gagal melakukan transaksi. Mohon coba lagi!", error});
    }
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Backend berjalan di http://localhost:${PORT}`);
});