package project.BookRental.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import project.BookRental.entity.BookEntity;
import project.BookRental.entity.BorrowedEntity;
import project.BookRental.entity.UserEntity;

import java.util.Optional;

public interface BorrowedRepository extends JpaRepository<BorrowedEntity, Long> {
    Optional<BorrowedEntity> findByBookAndUser(BookEntity book, UserEntity user);
}
