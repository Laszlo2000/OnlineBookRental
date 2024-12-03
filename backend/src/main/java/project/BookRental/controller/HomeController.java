package project.BookRental.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import project.BookRental.service.JWTService;

@RestController
public class HomeController {

    @Autowired
    private JWTService jwtService;

    @GetMapping("/")
    public String home() {
        return "Welcome to Book Rental System";
    }
}
