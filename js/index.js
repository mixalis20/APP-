async function runObjectDetection() {
    // Φόρτωση του μοντέλου COCO-SSD
    const model = await cocoSsd.load();
    console.log("COCO-SSD model loaded!");

    // Επιλέγουμε την εικόνα και το canvas
    const img = document.getElementById('input-image');
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    // Περιμένουμε μέχρι η εικόνα να φορτώσει πλήρως
    img.onload = async () => {
        // Ορίζουμε τις διαστάσεις του καμβά να ταιριάζουν με τις διαστάσεις της εικόνας
        canvas.width = img.width;
        canvas.height = img.height;

        // Σχεδιάζουμε την εικόνα στον καμβά
        ctx.drawImage(img, 0, 0);

        // Εκτελούμε την ανίχνευση αντικειμένων
        const predictions = await model.detect(img);
        console.log(predictions);

        // Ζωγραφίζουμε τα αποτελέσματα στον καμβά και αποθηκεύουμε τα δεδομένα στο JSON
        const jsonOutput = [];
        predictions.forEach(prediction => {
            // Σχεδιάζουμε ένα πλαίσιο γύρω από το ανιχνευμένο αντικείμενο
            ctx.beginPath();
            ctx.rect(prediction.bbox[0], prediction.bbox[1], prediction.bbox[2], prediction.bbox[3]);
            ctx.lineWidth = 2;
            ctx.strokeStyle = 'red';
            ctx.fillStyle = 'red';
            ctx.stroke();
            ctx.fillText(
                `${prediction.class} (${Math.round(prediction.score * 100)}%)`,
                prediction.bbox[0],
                prediction.bbox[1] > 10 ? prediction.bbox[1] - 5 : 10
            );

            // Προσθήκη των αποτελεσμάτων στο JSON
            jsonOutput.push({
                label: prediction.class,
                score: prediction.score,
                bbox: prediction.bbox
            });
        });

        // Εμφανίζουμε τα δεδομένα του JSON στην οθόνη
        document.getElementById('json-output').textContent = JSON.stringify(jsonOutput, null, 2);
    };
}

// Καλούμε τη συνάρτηση όταν φορτώσει το DOM
document.addEventListener('DOMContentLoaded', runObjectDetection);
