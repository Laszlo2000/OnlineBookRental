package user_management;

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
public class LoginTests {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void testSuccessfulLogin() throws Exception {
        String loginJson = """
            {
              "username": "Laszlo",
              "password": "Laszlo"
            }
            """;

        mockMvc.perform(post("/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(loginJson))
                .andExpect(status().isOk());
    }

    @Test
    void testMissingUsername() throws Exception {
        String loginJson = """
        {
          "username": "",
          "password": "Laszlo"
        }
        """;

        mockMvc.perform(post("/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(loginJson))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void testMissingPassword() throws Exception {
        String loginJson = """
        {
          "username": "Laszlo",
          "password": ""
        }
        """;

        mockMvc.perform(post("/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(loginJson))
                .andExpect(status().isUnauthorized()); // 400 státuszkód várható
    }

    @Test
    void testInvalidUsername() throws Exception {
        String loginJson = """
        {
          "username": "WrongUsername",
          "password": "Laszlo"
        }
        """;

        mockMvc.perform(post("/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(loginJson))
                .andExpect(status().isUnauthorized());
    }


    @Test
    void testInvalidPassword() throws Exception {
        String loginJson = """
        {
          "username": "Laszlo",
          "password": "WrongPassword"
        }
        """;

        mockMvc.perform(post("/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(loginJson))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void testNonExistentUser() throws Exception {
        String loginJson = """
        {
          "username": "NonExistentUser",
          "password": "SomePassword"
        }
        """;

        mockMvc.perform(post("/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(loginJson))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void testEmptyUsernamePassword() throws Exception {
        String loginJson = """
        {
          "username": "",
          "password": ""
        }
        """;

        mockMvc.perform(post("/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(loginJson))
                .andExpect(status().isUnauthorized());
    }
}