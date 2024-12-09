package project.BookRental.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import project.BookRental.entity.BookEntity;
import project.BookRental.entity.BorrowedEntity;
import project.BookRental.entity.UserEntity;

import java.util.List;
import java.util.Optional;

@Repository
public interface BorrowedRepository extends JpaRepository<BorrowedEntity, Long> {
    Optional<BorrowedEntity> findByBookAndUser(BookEntity book, UserEntity user);
    List<BorrowedEntity> findAllByBook_Id(Long konyvId);

}
