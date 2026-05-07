package com.mindease.app.controller;

import com.mindease.app.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/public/stats")
@RequiredArgsConstructor
@org.springframework.web.bind.annotation.CrossOrigin("*")
public class SystemController {

    private final UserRepository userRepository;

    @GetMapping
    public Map<String, Object> getPublicStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalIdentities", userRepository.count());
        stats.put("systemStatus", "NOMINAL");
        stats.put("neuralUptime", "99.9%");
        return stats;
    }
}
