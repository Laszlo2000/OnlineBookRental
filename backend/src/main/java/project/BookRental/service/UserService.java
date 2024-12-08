package project.BookRental.service;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import project.BookRental.entity.RoleEntity;
import project.BookRental.entity.UserEntity;
import project.BookRental.repository.RoleRepository;
import project.BookRental.repository.UserRepository;

import java.util.List;

@Service
public class UserService {

    @Autowired
    private JWTService jwtService;

    @Autowired
    private UserRepository userRepository;

    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    @Autowired
    private RoleRepository roleRepository;
    @Autowired
    private AuthenticationManager authenticationManager;

    public UserEntity register(UserEntity user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        RoleEntity role = roleRepository.findById(2L)
                .orElseThrow(() -> new IllegalArgumentException("Default role not found"));
        user.setRole(role);
        return userRepository.save(user);
    }

    public String verify(UserEntity user) {
        Authentication authentication =
                authenticationManager.authenticate(
                        new UsernamePasswordAuthenticationToken(
                                user.getUsername(), user.getPassword()));

        if (authentication.isAuthenticated())
            return jwtService.generateToken(user.getUsername());

        return "Login failed";
    }

    public List<UserEntity> getAllUsers() {
        return userRepository.findAll();
    }

    @Transactional
    public void updateUserRole(Long userId, Long newRoleId) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        RoleEntity newRole = roleRepository.findById(newRoleId)
                .orElseThrow(() -> new EntityNotFoundException("Role not found"));

        user.setRole(newRole);
        userRepository.save(user);
    }
}
