package com.tinder.tinder.model;

import com.tinder.tinder.enums.StatusName;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "likes")
public class Likes {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "from_user_id", nullable = false)
    private Users fromUser;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "to_user_id", nullable = false)
    private Users toUser;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private StatusName status;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    public Likes() {
    }
    public Likes(Long id, Users fromUser, Users toUser, StatusName status) {
        this.id = id;
        this.fromUser = fromUser;
        this.toUser = toUser;
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Users getFromUser() {
        return fromUser;
    }

    public void setFromUser(Users fromUser) {
        this.fromUser = fromUser;
    }

    public Users getToUser() {
        return toUser;
    }

    public void setToUser(Users toUser) {
        this.toUser = toUser;
    }

    public StatusName getStatus() {
        return status;
    }

    public void setStatus(StatusName status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
