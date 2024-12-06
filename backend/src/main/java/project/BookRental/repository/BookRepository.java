package project.BookRental.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import project.BookRental.entity.BookEntity;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookRepository extends JpaRepository<BookEntity, Long> {
    Optional<BookEntity> findByTitle(String title);

    @Query("SELECT b FROM BookEntity b JOIN BorrowedEntity br ON b.id = br.book.id WHERE br.user.id = :userId")
    List<BookEntity> findBorrowedBooksByUserId(@Param("userId") Long userId);

}
