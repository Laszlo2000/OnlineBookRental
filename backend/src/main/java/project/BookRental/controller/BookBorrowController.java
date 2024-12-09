package project.BookRental.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import project.BookRental.dto.BorrowDto;
import project.BookRental.dto.UserProfileDto;
import project.BookRental.entity.BookEntity;
import project.BookRental.entity.BorrowedEntity;
import project.BookRental.entity.UserEntity;
import project.BookRental.repository.BookRepository;
import project.BookRental.repository.BorrowedRepository;
import project.BookRental.repository.UserRepository;

import java.security.Principal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
public class BookBorrowController {

    private static final Logger logger = LoggerFactory.getLogger(BookController.class);

    @Autowired
    private BookRepository bookRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private BorrowedRepository borrowedRepository;


    @PutMapping("/rent")
    public ResponseEntity<BorrowDto> bookEntityResponseEntity(@RequestBody BorrowDto borrowDto, Principal principal) {
        String title = borrowDto.getTitle();
        Optional<BookEntity> bookEntity = bookRepository.findByTitle(title);

        // Felhasználó lekérdezése
        Optional<UserEntity> userEntity = Optional.ofNullable(userRepository.findByUsername(principal.getName()));
        if (userEntity.isEmpty()) {
            // Ha nincs ilyen felhasználó
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }

        UserEntity user = userEntity.get();


        // Könyv lekérdezése
        if (bookEntity.isPresent()) {
            BookEntity book = bookEntity.get();

            // Már kölcsönzött
            if (!book.isAvailable()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
            }

            // Könyv frissítése
            book.setAvailable(false);
            bookRepository.save(book);

            BorrowedEntity borrowed = new BorrowedEntity();
            borrowed.setBook(book);
            borrowed.setUser(user);
            borrowedRepository.save(borrowed);

            //DTO
            BorrowDto dto = new BorrowDto();
            dto.setUsername(principal.getName());
            dto.setTitle(book.getTitle());

            return ResponseEntity.ok(borrowDto);
        }

        // Nincs ilyen könyv
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    
    
    }

    @GetMapping("/books")
    public List<BookEntity> getAllBooks() { return bookRepository.findAll();}

    @GetMapping("/books/{id}")
    public ResponseEntity<BookEntity> getBookById(@PathVariable Long id) {
        logger.info("Received request for book with ID: {}", id);

        return bookRepository.findById(id)
                .map(book -> {
                    logger.info("Book found: {}", book);
                    return ResponseEntity.ok(book);
                })
                .orElseGet(() -> {
                    logger.warn("Book with ID {} not found.", id);
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
                });
    }
}


