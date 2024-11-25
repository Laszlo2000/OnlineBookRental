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
@RequestMapping("/borrow")
public class BookBorrowController {
    /*
Elfogadási kritériumok:
A felhasználó be tud jelentkezni és kiválasztani egy könyvet a kölcsönzéshez.
A kölcsönzés időtartama előre meghatározott (pl. 2 hét).
A rendszer frissíti a könyv státuszát „kölcsönzött”-re és eltávolítja a listából, amíg a felhasználó vissza nem hozza.
     */
    @Autowired
    private BookRepository bookRepository;

    @GetMapping("/{title}")
    public ResponseEntity<BorrowDto> bookEntityResponseEntity(@PathVariable String title, Principal principal) {
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
            BorrowDto borrowDto = new BorrowDto();
            borrowDto.setUsername(principal.getName());
            borrowDto.setTitle(book.getTitle());
            //borrowDto.setAvailable(false);
            borrowDto.setDueDate(LocalDate.now().plusWeeks(2));


            return ResponseEntity.ok(borrowDto);
        }

        // Nincs ilyen könyv
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }
}

