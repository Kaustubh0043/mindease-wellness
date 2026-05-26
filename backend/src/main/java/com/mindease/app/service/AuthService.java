package com.mindease.app.service;

import com.mindease.app.dto.AuthResponse;
import com.mindease.app.dto.LoginRequest;
import com.mindease.app.dto.RegisterRequest;
import com.mindease.app.model.User;
import com.mindease.app.model.Role;
import com.mindease.app.repository.UserRepository;
import com.mindease.app.security.JwtService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

@Service
public class AuthService {
        private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(AuthService.class);

        private final UserRepository repository;
        private final PasswordEncoder passwordEncoder;
        private final JwtService jwtService;
        private final AuthenticationManager authenticationManager;
        private final UserDetailsService userDetailsService;
        private final EmailService emailService;

        public AuthService(
                        UserRepository repository,
                        PasswordEncoder passwordEncoder,
                        JwtService jwtService,
                        AuthenticationManager authenticationManager,
                        UserDetailsService userDetailsService,
                        EmailService emailService) {
                this.repository = repository;
                this.passwordEncoder = passwordEncoder;
                this.jwtService = jwtService;
                this.authenticationManager = authenticationManager;
                this.userDetailsService = userDetailsService;
                this.emailService = emailService;
        }

        public AuthResponse register(RegisterRequest request) {
                try {
                        log.info("NEURAL HANDSHAKE: Initializing identity for {}", request.getEmail());
                        Role userRole = request.getEmail().endsWith("@admin.com") ? Role.ADMIN : Role.USER;

                        String code = String.format("%06d", new java.util.Random().nextInt(1000000));

                        var user = User.builder()
                                        .name(request.getName())
                                        .email(request.getEmail())
                                        .password(passwordEncoder.encode(request.getPassword()))
                                        .role(userRole)
                                        .build();
                        user.setVerified(false);
                        user.setVerificationCode(code);
                        repository.save(user);

                        emailService.sendVerificationEmail(user.getEmail(), code);

                        return AuthResponse.builder()
                                        .email(user.getEmail())
                                        .name(user.getName())
                                        .role(user.getRole().name())
                                        .token(null) // unverified users do not get a token yet
                                        .build();
                } catch (Exception e) {
                        log.error("HANDSHAKE FAILED: Database rejection for {}. Reason: {}", request.getEmail(),
                                        e.getMessage());
                        throw e;
                }
        }

        public AuthResponse login(LoginRequest request) {
                authenticationManager.authenticate(
                                new UsernamePasswordAuthenticationToken(
                                                request.getEmail(),
                                                request.getPassword()));
                var user = repository.findByEmail(request.getEmail())
                                .orElseThrow();
                if (!user.isVerified()) {
                        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "EMAIL_NOT_VERIFIED");
                }
                UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
                var jwtToken = jwtService.generateToken(userDetails);
                return AuthResponse.builder()
                                .token(jwtToken)
                                .email(user.getEmail())
                                .name(user.getName())
                                .role(user.getRole().name())
                                .build();
        }

        public AuthResponse verifyEmail(String email, String code) {
                var user = repository.findByEmail(email)
                                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
                if (user.isVerified()) {
                        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User is already verified");
                }
                if (user.getVerificationCode() == null || !user.getVerificationCode().equals(code)) {
                        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "INVALID_CODE");
                }
                user.setVerified(true);
                user.setVerificationCode(null);
                repository.save(user);

                UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
                var jwtToken = jwtService.generateToken(userDetails);
                return AuthResponse.builder()
                                .token(jwtToken)
                                .email(user.getEmail())
                                .name(user.getName())
                                .role(user.getRole().name())
                                .build();
        }
}
