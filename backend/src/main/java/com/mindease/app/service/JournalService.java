package com.mindease.app.service;

import com.mindease.app.model.Journal;
import com.mindease.app.repository.JournalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class JournalService {
    private final JournalRepository journalRepository;

    public JournalService(JournalRepository journalRepository) {
        this.journalRepository = journalRepository;
    }

    public Journal saveJournal(Journal journal) {
        return journalRepository.save(journal);
    }

    public List<Journal> getUserJournals(Long userId) {
        return journalRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }
}
