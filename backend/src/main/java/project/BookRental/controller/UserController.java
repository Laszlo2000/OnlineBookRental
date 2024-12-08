package project.BookRental.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import project.BookRental.entity.UserEntity;
import project.BookRental.service.UserService;

import java.util.List;

@RestController
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public UserEntity register(@RequestBody UserEntity user) {
        return userService.register(user);
    }

    @PostMapping("/login")
    public String login(@RequestBody UserEntity user) {


        return userService.verify(user);
    }

    @GetMapping("/users")
    public List<UserEntity> getAllUsers() { return userService.getAllUsers(); }
}
