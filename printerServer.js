const express = require('express');
const bodyParser = require('body-parser');
const escpos = require('escpos');
escpos.USB = require('escpos-usb');

const app = express();
app.use(bodyParser.json()); // for parsing application/json

const device = new escpos.USB();  // Assumes the printer is connected via USB

app.post('/print', (req, res) => {
    const { text } = req.body;

    device.open((err) => {
        if (err) {
            console.error('Failed to connect to printer:', err);
            return res.status(500).json({ success: false, message: 'Failed to connect to printer', error: err.message });
        }

        const printer = new escpos.Printer(device);
        printer
            .font('a')
            .align('ct')
            .style('bu')
            .size(1, 1)
            .text(text)
            .cut()
            .close(() => {
                res.json({ success: true, message: 'Printed successfully' });
            });
    });
});

const PORT = 8000;
app.listen(PORT, () => {
    console.log(`Printer server listening on port ${PORT}`);
});
