package project.BookRental.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import project.BookRental.entity.RoleEntity;
import project.BookRental.entity.UserEntity;
import project.BookRental.repository.RoleRepository;
import project.BookRental.repository.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    @Autowired
    private RoleRepository roleRepository;

    public UserEntity register(UserEntity user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        RoleEntity role = roleRepository.findById(2L)
                .orElseThrow(() -> new IllegalArgumentException("Default role not found"));
        user.setRole(role);
        return userRepository.save(user);
    }
}
