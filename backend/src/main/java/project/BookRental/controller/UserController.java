package project.BookRental.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import project.BookRental.entity.UserEntity;
import project.BookRental.service.UserService;

import java.util.List;
import java.util.Map;

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

    @PutMapping("/{id}/role")
    public ResponseEntity<String> updateUserRole(@PathVariable Long id, @RequestBody Map<String, Long> request) {
        Long newRoleId = request.get("roleId");
        userService.updateUserRole(id, newRoleId);
        return ResponseEntity.ok("Role updated successfully");
    }
}
