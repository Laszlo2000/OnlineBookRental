package project.BookRental.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import project.BookRental.dto.BorrowDto;
import project.BookRental.entity.BookEntity;
import project.BookRental.entity.BorrowedEntity;
import project.BookRental.entity.UserEntity;
import project.BookRental.repository.BookRepository;
import project.BookRental.repository.BorrowedRepository;
import project.BookRental.repository.UserRepository;

import java.security.Principal;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
public class ReturnBookController {
    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BorrowedRepository borrowedRepository;

    @GetMapping("/{user}/borrowed")
    public ResponseEntity<List<BorrowDto>> borrowedBooksByUser(Principal principal) {
        UserEntity user = userRepository.findByUsername(principal.getName());
        List<BookEntity> borrowedBooks = bookRepository.findBorrowedBooksByUserId(user.getId());

        List<BorrowDto> bookDtos = borrowedBooks.stream()
                .map(book -> {
                    BorrowDto dto = new BorrowDto();
                    dto.setTitle(book.getTitle());
                    return dto;
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(bookDtos);
    }

    @PutMapping("/return")
    public ResponseEntity<BorrowDto> returnBook(@RequestBody BorrowDto borrowDto, Principal principal) {
        //Kérjük le a könyv címét a DTO-ból
        String title = borrowDto.getTitle();

        //Könyv lekérése
        Optional<BookEntity> bookEntity = bookRepository.findByTitle(title);
        if (bookEntity.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build(); // Ha nincs ilyen könyv
        }

        //Felhasználó lekérése
        Optional<UserEntity> userEntity = Optional.ofNullable(userRepository.findByUsername(principal.getName()));
        if (userEntity.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null); // Ha a felhasználó nem található
        }

        BookEntity book = bookEntity.get();
        UserEntity user = userEntity.get();

        //Kölcsönzés ellenőrzése
        Optional<BorrowedEntity> borrowedEntity = borrowedRepository.findByBookAndUser(book, user);
        if (borrowedEntity.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build(); // Ha a kölcsönzés nem található
        }

        //Kölcsönzés törlése
        borrowedRepository.delete(borrowedEntity.get());

        //Könyv elérhetőségének visszaállítása
        book.setAvailable(true);
        bookRepository.save(book);

        //Válasz DTO elkészítése
        BorrowDto responseDto = new BorrowDto();
        responseDto.setUsername(principal.getName());
        responseDto.setTitle(book.getTitle());

        return ResponseEntity.ok(responseDto);
    }
}
