package project.BookRental.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import project.BookRental.entity.BookEntity;
import project.BookRental.repository.BookRepository;

import java.util.Optional;

@RestController
@RequestMapping("/return")
public class ReturnBookController {

    @Autowired
    private BookRepository bookRepository;

    // Könyv visszajuttatása
    @GetMapping("/{title}")
    public ResponseEntity<String> returnBook(@PathVariable String title) {
        Optional<BookEntity> bookEntity = bookRepository.findByTitle(title);

        // Ha a könyv nem található az adatbázisban
        if (!bookEntity.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("A megadott című könyv nem található az adatbázisban.");
        }

        BookEntity book = bookEntity.get();

        // Ha a könyv már elérhető, nincs mit visszaadni
        if (book.isAvailable()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Ez a könyv már elérhető az adatbázisban, nem szükséges visszajuttatni.");
        }

        // Könyv elérhetőség visszaállítása
        book.setAvailable(true);
        bookRepository.save(book);

        return ResponseEntity.ok("A könyv sikeresen visszakerült az adatbázisba.");
    }
}

