package com.mindease.app.controller;

import com.mindease.app.model.Mood;
import com.mindease.app.model.Suggestion;
import com.mindease.app.model.User;
import com.mindease.app.service.AdminService;
import com.mindease.app.service.MoodService;
import com.mindease.app.service.SuggestionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;
    private final MoodService moodService;
    private final SuggestionService suggestionService;

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    @DeleteMapping("/user/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        adminService.deleteUser(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/moods")
    public ResponseEntity<List<Mood>> getAllMoods() {
        return ResponseEntity.ok(moodService.getAllMoods());
    }

    @PostMapping("/suggestions")
    public ResponseEntity<Suggestion> addSuggestion(@RequestBody Suggestion suggestion) {
        return ResponseEntity.ok(suggestionService.saveSuggestion(suggestion));
    }

    @PutMapping("/suggestions/{id}")
    public ResponseEntity<Suggestion> updateSuggestion(@PathVariable Long id, @RequestBody Suggestion suggestion) {
        return ResponseEntity.ok(suggestionService.updateSuggestion(id, suggestion));
    }

    @DeleteMapping("/suggestions/{id}")
    public ResponseEntity<Void> deleteSuggestion(@PathVariable Long id) {
        suggestionService.deleteSuggestion(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        Map<String, Object> stats = adminService.getGlobalStats();
        stats.put("moodDistribution", moodService.getMoodStats());
        return ResponseEntity.ok(stats);
    }
}
