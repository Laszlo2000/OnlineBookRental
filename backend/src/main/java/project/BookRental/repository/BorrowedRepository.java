package project.BookRental.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import project.BookRental.entity.BorrowedEntity;

public interface BorrowedRepository extends JpaRepository<BorrowedEntity, Long> {
}
