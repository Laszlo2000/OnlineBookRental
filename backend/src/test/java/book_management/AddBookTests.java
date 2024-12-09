package book_management;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import project.BookRental.BookRentalApplication;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(classes = BookRentalApplication.class)
@AutoConfigureMockMvc
public class AddBookTests {

    @Autowired
    private MockMvc mockMvc;
    private String token;

    @BeforeEach
    void loginAndGetToken() throws Exception {
        String loginJson = """
        {
          "username": "admin",
          "password": "admin"
        }
        """;

        // A /login végpontra POST kérés
        token = "Bearer " + mockMvc.perform(post("/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(loginJson))
                .andReturn()
                .getResponse()
                .getContentAsString();
    }

    @Test
    void testAddBookSuccess() throws Exception {
        String bookJson = """
        {
          "title": "The Great Gatsby",
          "author": "F. Scott Fitzgerald",
          "genre": "Novel",
          "isbn": "9780743273565"
        }
        """;

        mockMvc.perform(post("/addbook")
                        .header("Authorization", token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(bookJson))
                .andExpect(status().isOk());
    }

    @Test
    void testAddBookWithoutToken() throws Exception {
        String bookJson = """
        {
          "title": "The Great Gatsby",
          "author": "F. Scott Fitzgerald",
          "genre": "Novel",
          "isbn": "9780743273565"
        }
        """;

        mockMvc.perform(post("/addbook")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(bookJson))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void testAddBookMissingTitle() throws Exception {
        String bookJson = """
        {
          "title": "",
          "author": "F. Scott Fitzgerald",
          "genre": "Novel",
          "isbn": "9780743273565"
        }
        """;

        mockMvc.perform(post("/addbook")
                        .header("Authorization", token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(bookJson))
                .andExpect(status().isBadRequest()); // Elvárt státusz: 400 BAD REQUEST
    }

    @Test
    void testAddBookMissingAuthor() throws Exception {
        String bookJson = """
        {
          "title": "The Great Gatsby",
          "author": "",
          "genre": "Novel",
          "isbn": "9780743273565"
        }
        """;

        mockMvc.perform(post("/addbook")
                        .header("Authorization", token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(bookJson))
                .andExpect(status().isBadRequest()); // Elvárt státusz: 400 BAD REQUEST
    }

    @Test
    void testAddBookMissingGenre() throws Exception {
        String bookJson = """
        {
          "title": "The Great Gatsby",
          "author": "F. Scott Fitzgerald",
          "genre": "",
          "isbn": "9780743273565"
        }
        """;

        mockMvc.perform(post("/addbook")
                        .header("Authorization", token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(bookJson))
                .andExpect(status().isBadRequest()); // Elvárt státusz: 400 BAD REQUEST
    }

    @Test
    void testAddBookMissingISBN() throws Exception {
        String bookJson = """
        {
          "title": "The Great Gatsby",
          "author": "F. Scott Fitzgerald",
          "genre": "Novel",
          "isbn": ""
        }
        """;

        mockMvc.perform(post("/addbook")
                        .header("Authorization", token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(bookJson))
                .andExpect(status().isBadRequest()); // Elvárt státusz: 400 BAD REQUEST
    }

    @Test
    void testAddBookMissingAllFields() throws Exception {
        String bookJson = """
        {
          "title": "",
          "author": "",
          "genre": "",
          "isbn": ""
        }
        """;

        mockMvc.perform(post("/addbook")
                        .header("Authorization", token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(bookJson))
                .andExpect(status().isBadRequest()); // Elvárt státusz: 400 BAD REQUEST
    }

    @Test
    void testAddBookEmptyRequestBody() throws Exception {
        mockMvc.perform(post("/addbook")
                        .header("Authorization", token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(""))
                .andExpect(status().isBadRequest()); // Elvárt státusz: 400 BAD REQUEST
    }

    @Test
    void testAddBookInvalidISBNFormat() throws Exception {
        String bookJson = """
        {
          "title": "The Great Gatsby",
          "author": "F. Scott Fitzgerald",
          "genre": "Novel",
          "isbn": "invalid_isbn"
        }
        """;

        mockMvc.perform(post("/addbook")
                        .header("Authorization", token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(bookJson))
                .andExpect(status().isBadRequest()); // Elvárt státusz: 400 BAD REQUEST
    }
}