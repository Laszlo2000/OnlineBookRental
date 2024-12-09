package project.BookRental.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import project.BookRental.entity.BookEntity;
import project.BookRental.entity.UserEntity;
import project.BookRental.repository.BookRepository;
import project.BookRental.repository.UserRepository;

@RestController
@RequestMapping("/addbook")
public class BookController {

    private static final Logger logger = LoggerFactory.getLogger(BookController.class);

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private UserRepository userRepository; // Szükséges a role ellenőrzéséhez

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

    @GetMapping("/getrole")
    public ResponseEntity<String> getUserRole(Authentication authentication) {
        // Az aktuális bejelentkezett felhasználó role-ját lekérjük
        UserEntity user = userRepository.findByUsername(authentication.getName());
        if (user != null && user.getRole() != null) {
            return ResponseEntity.ok(user.getRole().getRole()); // Role visszaküldése
        }
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Role not found");
    }

    // Update Book
    @PutMapping("/{id}")
    public ResponseEntity<String> updateBook(@PathVariable Long id, @RequestBody BookEntity updatedBook) {
        logger.info("Updating book with ID: {}", id);

        return bookRepository.findById(id).map(book -> {
            book.setTitle(updatedBook.getTitle());
            book.setAuthor(updatedBook.getAuthor());
            book.setGenre(updatedBook.getGenre());
            book.setIsbn(updatedBook.getIsbn());
            book.setAvailable(updatedBook.isAvailable());
            bookRepository.save(book);
            logger.info("Book updated successfully!");
            return ResponseEntity.ok("Book updated successfully!");
        }).orElseGet(() -> {
            logger.error("Book with ID {} not found", id);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Book not found.");
        });
    }

    // Delete Book
    // tomcat jetty ghostfish
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteBook(@PathVariable Long id) {
        logger.info("Deleting book with ID: {}", id);

        return bookRepository.findById(id).map(book -> {
            bookRepository.delete(book);
            logger.info("Book deleted successfully!");
            return ResponseEntity.ok("Book deleted successfully!");
        }).orElseGet(() -> {
            logger.error("Book with ID {} not found", id);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Book not found.");
        });
    }
}
