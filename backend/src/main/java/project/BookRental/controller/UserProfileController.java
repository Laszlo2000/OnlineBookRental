package project.BookRental.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import project.BookRental.dto.UserProfileDto;
import project.BookRental.entity.BookEntity;
import project.BookRental.entity.UserEntity;
import project.BookRental.repository.BookRepository;
import project.BookRental.repository.UserRepository;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/userprofile")
public class UserProfileController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BookRepository bookRepository;

    @GetMapping
    public ResponseEntity<UserProfileDto> getUserProfile(Principal principal) {
        // Lekérjük a bejelentkezett felhasználó nevét a tokenből
        String username = principal.getName();
        // Adatok lekérése az adatbázisból
        UserEntity user = userRepository.findByUsername(username);

        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        // Lekérjük a kölcsönzött könyveket
        List<BookEntity> borrowedBooks = bookRepository.findBorrowedBooksByUserId(user.getId());
        List<String> borrowedBookTitles = borrowedBooks.stream()
                .map(BookEntity::getTitle)
                .toList();

        // DTO összeállítása
        UserProfileDto userProfile = new UserProfileDto();
        userProfile.setUsername(user.getUsername());
        userProfile.setEmail(user.getEmail());
        userProfile.setBorrowedBooks(borrowedBookTitles);

        return ResponseEntity.ok(userProfile);
    }
}
