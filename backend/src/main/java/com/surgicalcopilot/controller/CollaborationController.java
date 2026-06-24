package com.surgicalcopilot.controller;

import com.surgicalcopilot.entity.CollaborationPost;
import com.surgicalcopilot.exception.ResourceNotFoundException;
import com.surgicalcopilot.repository.CollaborationPostRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/collaboration-posts")
public class CollaborationController {

    private final CollaborationPostRepository repository;

    public CollaborationController(CollaborationPostRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<CollaborationPost> getAll(@RequestParam(required = false) String postType) {
        if (postType != null && !postType.isBlank()) {
            return repository.findByPostTypeOrderByCreatedAtDesc(postType);
        }
        return repository.findAllByOrderByCreatedAtDesc();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CollaborationPost create(@Valid @RequestBody CollaborationPost post) {
        return repository.save(post);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        CollaborationPost post = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found with id " + id));
        repository.delete(post);
    }
}
