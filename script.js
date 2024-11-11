 if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./serviceworker.js')
        .then((registration) => {
            console.log('Service Worker registered with scope:', registration.scope);
        })
        .catch((error) => {
            console.error('Service Worker registration failed:', error);
        });
}
const dbRequest = indexedDB.open("FeedbackMessage", 1);

dbRequest.onupgradeneeded = function(event) {
    const db = event.target.result;
    if (!db.objectStoreNames.contains("ulasan")) {
        const objectStore = db.createObjectStore("ulasan", { keyPath: "id", autoIncrement: true });
        objectStore.createIndex("username", "username", { unique: false });
        objectStore.createIndex("feedback", "feedback", { unique: false });
    }
};

dbRequest.onsuccess = function(event) {
    const db = event.target.result;

    // Fungsi untuk menyimpan data ulasan
    const saveUlasan = (username, feedback) => {
        const transaction = db.transaction(['ulasan'], 'readwrite');
        const objectStore = transaction.objectStore('ulasan');
        const ulasan = { username, feedback };

        console.log('Saving ulasan:', ulasan);

        const request = objectStore.add(ulasan);

        request.onsuccess = function() {
            console.log('Data berhasil disimpan');
            alert("Message has been sent successfully!");
            displayUlasan(); // Menampilkan data setelah disimpan
        };

        request.onerror = function(event) {
            console.error('Error saving data:', event.target.error);
            alert('Failed to save message. Please try again.');
        };

        transaction.oncomplete = function() {
            console.log('Transaction completed');
        };

        transaction.onerror = function(event) {
            console.error('Transaction error:', event.target.error);
            alert('Transaction error occurred.');
        };
    };

    // Fungsi untuk menampilkan semua ulasan
    const displayUlasan = () => {
        const transaction = db.transaction(['ulasan'], 'readonly');
        const objectStore = transaction.objectStore('ulasan');
        const request = objectStore.getAll();

        request.onsuccess = function(event) {
            const ulasan = event.target.result;
            console.log('Ulasan:', ulasan);
            // Anda dapat menampilkan data di halaman di sini
        };
    };

    // Event listener untuk tombol "Send Message"
    document.getElementById('feedbackForm').addEventListener('submit', function(event) {
        event.preventDefault();

        const username = document.getElementById('username').value;
        const feedback = document.getElementById('feedback').value;

        // Pastikan semua field diisi
        if (username && feedback) {
            console.log("Submitting form data:", { username, feedback });
            saveUlasan(username, feedback); // Memanggil fungsi yang benar
            this.reset();
        } else {
            alert('Please fill out all fields.');
        }
    });
};

dbRequest.onerror = function(event) {
    console.error('Database error:', event.target.error);
    alert('Database error. Please refresh the page and try again.');
};
