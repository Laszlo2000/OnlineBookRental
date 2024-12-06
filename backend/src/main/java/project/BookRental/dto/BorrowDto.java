package project.BookRental.dto;

import java.time.LocalDate;

public class BorrowDto {
    private String username;
    private String title;

    public BorrowDto() {
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

}
