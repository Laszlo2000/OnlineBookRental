package project.BookRental.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import project.BookRental.dto.BorrowDto;
import project.BookRental.dto.UserProfileDto;
import project.BookRental.entity.BookEntity;
import project.BookRental.entity.UserEntity;
import project.BookRental.repository.BookRepository;
import project.BookRental.repository.UserRepository;

import java.security.Principal;
import java.time.LocalDate;
import java.util.Optional;

@RestController
public class BookBorrowController {

    @Autowired
    private BookRepository bookRepository;

    @PutMapping("/rent")
    public ResponseEntity<BorrowDto> bookEntityResponseEntity(@RequestBody BorrowDto borrowDto, Principal principal) {
        String title = borrowDto.getTitle();
        Optional<BookEntity> bookEntity = bookRepository.findByTitle(title);

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

            //DTO
            BorrowDto dto = new BorrowDto();
            dto.setUsername(principal.getName());
            dto.setTitle(book.getTitle());
            //borrowDto.setAvailable(false);
            dto.setDueDate(LocalDate.now().plusWeeks(2));


            return ResponseEntity.ok(borrowDto);
        }

        // Nincs ilyen könyv
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }
}

