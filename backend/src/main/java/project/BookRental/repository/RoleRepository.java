package project.BookRental.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import project.BookRental.entity.RoleEntity;

import java.util.Optional;

public interface RoleRepository extends JpaRepository<RoleEntity, Long> {
    Optional<RoleEntity> findById(Long id);
}
