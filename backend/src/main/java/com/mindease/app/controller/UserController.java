package com.mindease.app.controller;

import com.mindease.app.model.*;
import com.mindease.app.repository.UserRepository;
import com.mindease.app.service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin("*")
public class UserController {

    private final MoodService moodService;
    private final JournalService journalService;
    private final ChatService chatService;
    private final SuggestionService suggestionService;
    private final UserRepository userRepository;

    private User getCurrentUser(Authentication authentication) {
        return userRepository.findByEmail(authentication.getName()).orElseThrow();
    }

    @PostMapping("/moods")
    public ResponseEntity<Mood> addMood(@RequestBody Map<String, String> payload, Authentication authentication) {
        User user = getCurrentUser(authentication);
        Mood mood = Mood.builder()
                .user(user)
                .mood(MoodType.valueOf(payload.get("mood")))
                .note(payload.get("note"))
                .date(LocalDate.parse(payload.get("date")))
                .build();
        return ResponseEntity.ok(moodService.saveMood(mood));
    }

    @GetMapping("/moods")
    public ResponseEntity<List<Mood>> getMoods(Authentication authentication) {
        User user = getCurrentUser(authentication);
        return ResponseEntity.ok(moodService.getUserMoods(user.getId()));
    }

    @GetMapping("/suggestions/{mood}")
    public ResponseEntity<List<Suggestion>> getSuggestions(@PathVariable MoodType mood) {
        return ResponseEntity.ok(suggestionService.getSuggestionsByMood(mood));
    }

    @PostMapping("/journal")
    public ResponseEntity<Journal> addJournal(@RequestBody Map<String, String> payload, Authentication authentication) {
        User user = getCurrentUser(authentication);
        Journal journal = Journal.builder()
                .user(user)
                .content(payload.get("content"))
                .build();
        return ResponseEntity.ok(journalService.saveJournal(journal));
    }

    @GetMapping("/journal")
    public ResponseEntity<List<Journal>> getJournals(Authentication authentication) {
        User user = getCurrentUser(authentication);
        return ResponseEntity.ok(journalService.getUserJournals(user.getId()));
    }

    @PostMapping("/chat")
    public ResponseEntity<ChatLog> chat(@RequestBody Map<String, String> payload, Authentication authentication) {
        User user = getCurrentUser(authentication);
        return ResponseEntity.ok(chatService.processMessage(user, payload.get("message")));
    }
}
