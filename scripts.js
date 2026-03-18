$(document).ready(function() {

    const maxResults = 10;  // Number of books per page
    let currentPage = 1;    // Current page for pagination

    // Function to fetch books from Google Books API
    function fetchBooks(query, page = 1) {
        const startIndex = (page - 1) * maxResults;
        const url = `https://www.googleapis.com/books/v1/volumes?q=${query}&startIndex=${startIndex}&maxResults=${maxResults}`;

        $.getJSON(url, function(data) {
            const totalResults = data.totalItems;
            const books = data.items;

            // Clear previous results
            $('#book-list').empty();
            $('#pagination').empty();

            // Display books
            let output = '';
            $.each(books, function(i, book) {
                const title = book.volumeInfo.title;
                const author = book.volumeInfo.authors ? book.volumeInfo.authors.join(', ') : 'No Author';
                const image = book.volumeInfo.imageLinks ? book.volumeInfo.imageLinks.thumbnail : 'no-image.jpg';
                const bookLink = `bookdetails.html?id=${book.id}`;

                output += `
                    <div class="book">
                        <img src="${image}" alt="${title}">
                        <h3><a href="${bookLink}">${title}</a></h3>
                        <p><strong>Author(s):</strong> ${author}</p>
                    </div>
                `;
            });

            $('#book-list').html(output);

            // Implement pagination
            const totalPages = Math.ceil(totalResults / maxResults);
            let pagination = '';
            for (let i = 1; i <= totalPages; i++) {
                pagination += `<button class="page-btn" data-page="${i}">${i}</button>`;
            }

            $('#pagination').html(pagination);

            // Highlight current page
            $(`.page-btn[data-page="${page}"]`).css('background-color', '#2980b9');
        });
    }

    // Search button click
    $('#search-btn').click(function() {
        const query = $('#search-input').val();
        if (query) {
            fetchBooks(query, currentPage);
        }
    });

    // Pagination button click
    $(document).on('click', '.page-btn', function() {
        currentPage = $(this).data('page');
        const query = $('#search-input').val();
        fetchBooks(query, currentPage);
    });

});