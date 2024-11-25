package project.BookRental.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import project.BookRental.entity.BookEntity;
import project.BookRental.repository.BookRepository;


@RestController
@RequestMapping("/addbook")
public class BookController {

    private static final Logger logger = LoggerFactory.getLogger(BookController.class);

    @Autowired
    private BookRepository bookRepository;

    @PostMapping
    public ResponseEntity<String> addBook(@RequestBody BookEntity book) {
        logger.info("Received book: {}", book);

        if (book.getTitle() == null || book.getAuthor() == null || book.getGenre() == null || book.getIsbn() == null) {
            System.out.println("Validation failed: missing fields");
            return ResponseEntity.badRequest().body("All fields are required.");
        }
        try {
            book.setAvailable(true);
            bookRepository.save(book);
            System.out.println("Book saved successfully!");
            return ResponseEntity.ok("Book added successfully!");
        } catch (Exception e) {
            e.printStackTrace(); // Nyomtasd ki a teljes kivételt
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to add book. Please try again later.");
        }
    }

}
