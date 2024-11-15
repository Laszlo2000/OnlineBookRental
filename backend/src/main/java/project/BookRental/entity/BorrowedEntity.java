package project.BookRental.entity;

import jakarta.persistence.*;

import java.util.Objects;

@Entity
public class BorrowedEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @ManyToOne
    @JoinColumn(name = "felh_id", nullable = false)
    private UserEntity user;

    @ManyToOne
    @JoinColumn(name = "konyv_id", nullable = false)
    private BookEntity book;

    public BorrowedEntity() {
    }

    public BorrowedEntity(long id, UserEntity user, BookEntity book) {
        this.id = id;
        this.user = user;
        this.book = book;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public UserEntity getUser() {
        return user;
    }

    public void setUser(UserEntity user) {
        this.user = user;
    }

    public BookEntity getBook() {
        return book;
    }

    public void setBook(BookEntity book) {
        this.book = book;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        BorrowedEntity that = (BorrowedEntity) o;
        return id == that.id && Objects.equals(user, that.user) && Objects.equals(book, that.book);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, user, book);
    }
}
