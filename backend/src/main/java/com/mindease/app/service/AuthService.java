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

        @org.springframework.beans.factory.annotation.Value("${mindease.google.client-id}")
        private String googleClientId;

        public AuthResponse loginWithGoogle(com.mindease.app.dto.GoogleLoginRequest request) {
                try {
                        log.info("NEURAL HANDSHAKE: Initializing Google login verification");
                        com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier verifier = 
                            new com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier.Builder(
                                new com.google.api.client.http.javanet.NetHttpTransport(), 
                                com.google.api.client.json.gson.GsonFactory.getDefaultInstance()
                            )
                            .setAudience(java.util.Collections.singletonList(googleClientId))
                            .build();

                        com.google.api.client.googleapis.auth.oauth2.GoogleIdToken idToken = verifier.verify(request.getIdToken());
                        if (idToken == null) {
                                log.error("GOOGLE AUTH FAILED: Invalid token signature/audience");
                                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "INVALID_GOOGLE_TOKEN");
                        }

                        com.google.api.client.googleapis.auth.oauth2.GoogleIdToken.Payload payload = idToken.getPayload();
                        String email = payload.getEmail();
                        String name = (String) payload.get("name");
                        
                        log.info("GOOGLE AUTH SUCCESSFUL for email: {}", email);

                        User user = repository.findByEmail(email).orElse(null);
                        if (user == null) {
                                log.info("REGISTERING NEW GOOGLE USER: {}", email);
                                Role userRole = email.endsWith("@admin.com") ? Role.ADMIN : Role.USER;
                                // Create a random password for Google users since they login via Google OAuth
                                String randomPassword = java.util.UUID.randomUUID().toString();
                                user = User.builder()
                                                .name(name != null ? name : "Google User")
                                                .email(email)
                                                .password(passwordEncoder.encode(randomPassword))
                                                .role(userRole)
                                                .build();
                                user.setVerified(true); // Google emails are pre-verified
                                repository.save(user);
                        }

                        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
                        var jwtToken = jwtService.generateToken(userDetails);

                        return AuthResponse.builder()
                                        .token(jwtToken)
                                        .email(user.getEmail())
                                        .name(user.getName())
                                        .role(user.getRole().name())
                                        .build();

                } catch (ResponseStatusException e) {
                        throw e;
                } catch (Exception e) {
                        log.error("GOOGLE AUTH ERROR: {}", e.getMessage(), e);
                        throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Google authentication failed: " + e.getMessage());
                }
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
