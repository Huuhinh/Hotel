document.addEventListener('DOMContentLoaded', () => {
    const searchButton = document.getElementById('search-button');
    const destinationInput = document.getElementById('destination');
    const resultsDiv = document.getElementById('results');
    const resultTitle = document.getElementById('result-title');

    // Ảnh dự phòng nếu link ảnh bị lỗi
    const DEFAULT_IMG = 'https://images.unsplash.com/photo-1566073771259-6a8506099945';

    function performSearch() {
        const keyword = destinationInput.value.trim();
        
        // --- QUAN TRỌNG: GỌI THẲNG VÀO SERVER 3000 ---
        let apiUrl = 'http://localhost:3000/api/hotels';
        
        if (keyword) {
            apiUrl += `?city=${encodeURIComponent(keyword)}`;
            if(resultTitle) resultTitle.innerText = `Kết quả cho: "${keyword}"`;
        }

        resultsDiv.innerHTML = '<p style="text-align:center">⏳ Đang tải dữ liệu...</p>';

        fetch(apiUrl)
            .then(res => {
                // Kiểm tra nếu lỗi mạng
                if (!res.ok) throw new Error('Không thể kết nối tới http://localhost:3000');
                return res.json();
            })
            .then(data => {
                resultsDiv.innerHTML = ''; 

                if (data.length === 0) {
                    resultsDiv.innerHTML = '<p style="text-align:center">Không tìm thấy khách sạn nào.</p>';
                    return;
                }

                data.forEach(hotel => {
                    // Xử lý giá tiền
                    const price = hotel.price_per_night ? Number(hotel.price_per_night).toLocaleString() : '0';
                    // Xử lý ảnh (ưu tiên ảnh database, nếu lỗi lấy ảnh mặc định)
                    const img = hotel.image_url || DEFAULT_IMG;

                    const html = `
                        <div class="hotel-card">
                            <img src="${img}" class="hotel-img" onerror="this.src='${DEFAULT_IMG}'">
                            <div class="hotel-info">
                                <h3 class="hotel-name">${hotel.name}</h3>
                                <p>📍 ${hotel.city}</p>
                                <p class="hotel-price">${price} VND</p>
                                <p>⭐ ${hotel.rating}</p>
                            </div>
                        </div>
                    `;
                    resultsDiv.innerHTML += html;
                });
            })
            .catch(err => {
                console.error(err);
                resultsDiv.innerHTML = `<p style="color:red; text-align:center;">
                    ❌ LỖI KẾT NỐI!<br>
                    Hãy chắc chắn bạn đã chạy lệnh 'node server.js'<br>
                    Lỗi chi tiết: ${err.message}
                </p>`;
            });
    }

    if (searchButton) {
        searchButton.addEventListener('click', (e) => {
            e.preventDefault();
            performSearch();
        });
    }

    performSearch();
});