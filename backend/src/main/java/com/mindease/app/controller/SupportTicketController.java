package com.mindease.app.controller;

import com.mindease.app.model.SupportTicket;
import com.mindease.app.repository.SupportTicketRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/support")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class SupportTicketController {

    private final SupportTicketRepository repository;

    @PostMapping("/create")
    public ResponseEntity<SupportTicket> createTicket(@RequestBody SupportTicket ticket) {
        ticket.setStatus("OPEN");
        return ResponseEntity.ok(repository.save(ticket));
    }

    @GetMapping("/all")
    public ResponseEntity<List<SupportTicket>> getAllTickets() {
        return ResponseEntity.ok(repository.findAllByOrderByCreatedAtDesc());
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<SupportTicket> updateStatus(@PathVariable Long id, @RequestParam String status) {
        SupportTicket ticket = repository.findById(id).orElseThrow();
        ticket.setStatus(status);
        return ResponseEntity.ok(repository.save(ticket));
    }
}
